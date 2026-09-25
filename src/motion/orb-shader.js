import { Color, MeshBasicNodeMaterial } from "three/webgpu";
import {
  Fn,
  uv,
  uniform,
  float,
  vec2,
  vec3,
  vec4,
  sin,
  cos,
  exp,
  mix,
  smoothstep,
  atan,
  length,
  fract,
} from "three/tsl";
import { defaults, parameterSchema } from "./parameters";

/** A texture-free analytic light field. All fields below are evaluated by TSL on the GPU. */
export function createOrbMaterial() {
  const u = {
    time: uniform(0),
    aspect: uniform(1),
    framing: uniform(0.62),
    ripple: uniform(0),
    gyro: uniform(0),
    echo: uniform(1),
  };
  for (const p of parameterSchema)
    u[p.key] =
      p.type === "color" ? uniform(new Color(p.default)) : uniform(p.default);
  for (let i = 0; i < 9; i++) u["contour" + i] = uniform(0);
  for (let i = 0; i < 16; i++) {
    u["ringColor" + i] = uniform(new Color());
    u["glowColor" + i] = uniform(new Color());
  }
  u.measuredCore = uniform(new Color());
  for (let i = 0; i < 4; i++) u["bodyColor" + i] = uniform(new Color());
  const gaussian = (distance, width) =>
    exp(distance.div(width).pow(2).negate());
  const rotate = (p, a) =>
    vec2(
      p.x.mul(cos(a)).add(p.y.mul(sin(a))),
      p.y.mul(cos(a)).sub(p.x.mul(sin(a))),
    );
  const palette = (angle, offset = 0, prefix = "ringColor") => {
    // Non-negative interpolation of direct RGB samples cannot introduce the
    // spurious green/yellow hues of the old background-subtracted RGB fit.
    const turn = fract(
      angle
        .add(offset)
        .add(u.time.mul(u.colorSpeed.sub(0.72)))
        .div(Math.PI * 2)
        .add(0.5),
    );
    const result = vec3(0).toVar();
    for (let i = 0; i < 16; i++) {
      const d = turn.sub(i / 16).abs();
      const w = float(1)
        .sub(d.min(float(1).sub(d)).mul(16))
        .max(0);
      result.addAssign(u[prefix + i].mul(w));
    }
    // Color controls are explicit deviations from the measured default palette.
    const cool = float(1).sub(smoothstep(0.45, 0.9, result.r));
    const pink = result.r.sub(result.g).max(0).mul(3).clamp(0, 1);
    return result
      .add(u.cyan.sub(vec3(...new Color(defaults.cyan).toArray())).mul(cool))
      .add(u.pink.sub(vec3(...new Color(defaults.pink).toArray())).mul(pink))
      .add(
        u.warm
          .sub(vec3(...new Color(defaults.warm).toArray()))
          .mul(float(1).sub(cool).sub(pink).max(0)),
      )
      .clamp(0, 1);
  };
  const ring = (p, radius, tilt, rotation, width, strength, phase = 0) => {
    const q = rotate(p, rotation);
    const squash = cos(tilt).max(0.16);
    const circular = vec2(q.x.div(squash), q.y);
    const angle = atan(circular.y, circular.x);
    const rippleShape = sin(angle.mul(2).add(u.time.mul(1.1)))
      .add(sin(angle.mul(3).sub(u.time.mul(0.7))).mul(0.4))
      .mul(u.wobble)
      .mul(float(1).sub(u.gyro.mul(0.6)));
    const distance = length(circular)
      .sub(radius.add(rippleShape))
      .mul(squash.mul(0.45).add(0.55));
    const ink = palette(
      mix(atan(p.y, p.x), angle, u.gyro),
      u.gyro.mul(phase),
      "glowColor",
    );
    const sharp = gaussian(distance, width).mul(u.intensity);
    const near = gaussian(distance, u.bloomWidth).mul(u.bloom);
    const far = gaussian(distance, u.haloWidth).mul(u.halo);
    const facing = sin(angle.mul(2).add(rotation)).mul(0.45).add(0.55).pow(1.5);
    return ink
      .mul(near.add(far).add(sharp.mul(0.8)))
      .add(vec3(1, 0.985, 1).mul(sharp.mul(0.18)))
      .mul(strength)
      .mul(facing);
  };
  const output = Fn(() => {
    const tex = uv();
    const p = vec2(tex.x.sub(0.5).mul(2).mul(u.aspect), tex.y.sub(0.5).mul(2))
      .mul(u.framing)
      .toVar();
    const r = u.radius.mul(
      sin(u.time.mul(Math.PI * 2).div(u.breathPeriod))
        .mul(u.breathAmount)
        .add(1),
    );
    const radial = length(p).toVar();
    const light = vec3(0).toVar();
    const angle = u.time.sub(14.5).mul(u.gyroSpeed).add(0.05);
    const tilt = u.gyro.mul(u.gyroTilt).mul(1.18);
    const primary = p.sub(vec2(0.035, 0));
    const polar = atan(primary.y, primary.x);
    const contour = u.contour0.toVar();
    for (let k = 1; k <= 4; k++) {
      const c = cos(polar.mul(k)),
        s = sin(polar.mul(k));
      contour.addAssign(
        u["contour" + (k * 2 - 1)].mul(c).add(u["contour" + k * 2].mul(s)),
      );
    }
    const dist = length(primary).sub(
      contour
        .mul(r.div(0.46))
        .add(sin(polar.mul(2).add(u.time)).mul(u.wobble.sub(0.012))),
    );
    const profile = gaussian(dist, u.lineWidth)
      .mul(0.45)
      .add(gaussian(dist, u.bloomWidth).mul(u.bloom.div(0.72)).mul(0.45))
      .add(gaussian(dist, u.haloWidth).mul(u.halo.div(0.3)).mul(0.1));
    light.addAssign(
      palette(polar)
        .mul(gaussian(dist, u.lineWidth).mul(0.45))
        .add(
          palette(polar, 0, "glowColor").mul(
            profile.sub(gaussian(dist, u.lineWidth).mul(0.45)),
          ),
        )
        .mul(u.intensity.div(1.35))
        .mul(float(1).sub(u.gyro)),
    );
    light.addAssign(
      ring(
        p,
        r,
        tilt,
        angle.mul(u.gyro),
        u.lineWidth.add(u.gyro.mul(0.032)),
        u.gyro.mul(0.38),
      ),
    );
    // The idle ring has a displaced translucent echo, not a concentric CSS border.
    const echoPos = p.add(
      vec2(sin(u.time.mul(1.6)), cos(u.time.mul(1.3))).mul(u.echoOffset),
    );
    light.addAssign(
      ring(
        echoPos,
        r.mul(1.09),
        u.gyro.mul(u.gyroTilt).mul(0.8),
        u.time.mul(-0.6),
        u.lineWidth.mul(4),
        u.echo.mul(u.echoOpacity).mul(0.9),
        -1.4,
      ),
    );
    light.addAssign(
      ring(
        p,
        r.mul(1.04),
        u.gyro.mul(u.gyroTilt),
        angle.mul(-0.85).add(0.8),
        u.lineWidth.add(0.028),
        u.gyro.mul(0.22),
        2.4,
      ),
    );
    light.addAssign(
      ring(
        p,
        r.mul(0.99),
        u.gyro.mul(u.gyroTilt).mul(0.82),
        angle.mul(0.6).sub(0.6),
        u.lineWidth.add(0.018),
        u.gyro.mul(0.18),
        -1.5,
      ),
    );
    // Unrolled rings keep the node graph portable across WebGPU and the TSL WebGL2 backend.
    for (let i = 0; i < 5; i++) {
      const age = fract(
        u.time.div(u.ripplePeriod).add(float(i).div(u.rippleCount)),
      );
      const enabled = float(i + 0.5)
        .lessThan(u.rippleCount)
        .select(1, 0);
      const fade = smoothstep(0, 0.15, age).mul(
        float(1).sub(smoothstep(0.45, 1, age)),
      );
      const power = fade.mul(u.ripple).mul(u.rippleOpacity).mul(enabled);
      light.addAssign(
        ring(
          p,
          r.add(age.mul(u.rippleTravel)),
          float(0),
          float(0),
          u.lineWidth.mul(0.75),
          power,
          i * 0.8,
        ),
      );
    }
    // Only the orb emits pixels. A source recording's rectangular background is
    // never composited into the live canvas. Compact support makes every border
    // exactly transparent, including the tighter icon framing.
    const edge = u.framing.mul(u.aspect.min(1));
    const support = float(1).sub(smoothstep(edge.mul(0.82), edge, radial));
    const body = exp(radial.div(r.mul(1.35)).pow(4).negate())
      .mul(u.coreDepth.div(0.68))
      .mul(0.99)
      .clamp(0, 1);
    const bx = smoothstep(-0.3, 0.3, p.x),
      by = smoothstep(-0.3, 0.3, p.y);
    const quadrant = mix(
      mix(u.bodyColor2, u.bodyColor3, bx),
      mix(u.bodyColor0, u.bodyColor1, bx),
      by,
    )
      .add(u.coreColor.sub(vec3(...new Color(defaults.coreColor).toArray())))
      .add(
        u.auraColor
          .sub(vec3(...new Color(defaults.auraColor).toArray()))
          .mul(smoothstep(0.15, 0.6, radial)),
      )
      .clamp(0, 1);
    const core = mix(
      quadrant,
      u.measuredCore
        .add(u.coreColor.sub(vec3(...new Color(defaults.coreColor).toArray())))
        .clamp(0, 1),
      gaussian(radial, float(0.2)),
    );
    const energy = light.r.max(light.g).max(light.b).clamp(0, 1);
    const alpha = body
      .add(energy.mul(float(1).sub(body)))
      .clamp(0, 1)
      .mul(support);
    // Straight color over alpha: do not normalize RGB by vector length, which
    // darkens near-white light and amplifies hue errors on transparent surfaces.
    const rgb = mix(core, light.div(energy.max(0.001)).clamp(0, 1), energy);
    return vec4(rgb, alpha);
  })();
  const material = new MeshBasicNodeMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
  material.fragmentNode = output;
  return { material, uniforms: u };
}
