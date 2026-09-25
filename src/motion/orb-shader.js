import { Color, Vector3, MeshBasicNodeMaterial } from "three/webgpu";
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
  for (let i = 0; i < 9; i++) {
    u["contour" + i] = uniform(0);
    u["flux" + i] = uniform(new Vector3());
  }
  const gaussian = (distance, width) =>
    exp(distance.div(width).pow(2).negate());
  const rotate = (p, a) =>
    vec2(
      p.x.mul(cos(a)).add(p.y.mul(sin(a))),
      p.y.mul(cos(a)).sub(p.x.mul(sin(a))),
    );
  const palette = (angle, offset = 0) => {
    const phase = angle.mul(2).add(u.time.mul(u.colorSpeed)).add(offset);
    const rose = sin(phase).mul(0.5).add(0.5).pow(2.2);
    const cream = sin(angle.add(u.time.mul(u.colorSpeed).mul(0.5)).add(2.1))
      .mul(0.5)
      .add(0.5)
      .pow(9);
    return mix(mix(u.cyan, u.pink, rose), u.warm, cream);
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
    const ink = palette(angle, phase);
    const sharp = gaussian(distance, width).mul(u.intensity);
    const near = gaussian(distance, u.bloomWidth).mul(u.bloom);
    const far = gaussian(distance, u.haloWidth).mul(u.halo);
    const facing = sin(angle.mul(2).add(rotation)).mul(0.45).add(0.55).pow(1.5);
    return ink
      .mul(near.add(far).add(sharp.mul(0.8)))
      .add(vec3(1, 0.985, 0.97).mul(sharp.mul(0.18)))
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
    const contour = u.contour0.toVar(),
      flux = u.flux0.toVar();
    for (let k = 1; k <= 4; k++) {
      const c = cos(polar.mul(k)),
        s = sin(polar.mul(k));
      contour.addAssign(
        u["contour" + (k * 2 - 1)].mul(c).add(u["contour" + k * 2].mul(s)),
      );
      flux.addAssign(
        u["flux" + (k * 2 - 1)].mul(c).add(u["flux" + k * 2].mul(s)),
      );
    }
    const dist = length(primary).sub(
      contour
        .mul(r.div(0.46))
        .add(sin(polar.mul(2).add(u.time)).mul(u.wobble.sub(0.012))),
    );
    const profile = gaussian(dist, u.lineWidth)
      .mul(0.68)
      .add(gaussian(dist, u.bloomWidth).mul(u.bloom.div(0.72)).mul(0.25))
      .add(gaussian(dist, u.haloWidth).mul(u.halo.div(0.3)).mul(0.07));
    const roseWeight = sin(polar.mul(2).add(u.time.mul(u.colorSpeed)))
      .mul(0.5)
      .add(0.5);
    const warmWeight = sin(polar.add(u.time.mul(0.36)))
      .mul(0.5)
      .add(0.5)
      .pow(6);
    const tint = u.cyan
      .sub(vec3(...new Color(defaults.cyan).toArray()))
      .mul(float(1).sub(roseWeight))
      .add(
        u.pink.sub(vec3(...new Color(defaults.pink).toArray())).mul(roseWeight),
      )
      .add(
        u.warm.sub(vec3(...new Color(defaults.warm).toArray())).mul(warmWeight),
      )
      .mul(0.7);
    light.addAssign(
      flux
        .max(0)
        .add(tint)
        .mul(profile)
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
    const body = gaussian(radial, r.mul(0.88)).mul(u.coreDepth).mul(0.53);
    const energy = length(light).mul(0.85).clamp(0, 1);
    const alpha = body.add(energy).clamp(0, 1).mul(support);
    const rgb = mix(u.coreColor, u.auraColor, smoothstep(0, r, radial))
      .mul(body)
      .add(light)
      .div(body.add(energy).max(0.001))
      .clamp(0, 1);
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
