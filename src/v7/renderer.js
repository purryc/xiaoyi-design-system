import {
  WebGPURenderer,
  Scene,
  OrthographicCamera,
  PlaneGeometry,
  Mesh,
  MeshBasicNodeMaterial,
  Vector2,
  Color,
  NoToneMapping,
  SRGBColorSpace,
} from "three/webgpu";
import {
  Fn,
  uv,
  uniform,
  float,
  vec2,
  vec3,
  vec4,
  length,
  exp,
  sin,
  mix,
  smoothstep,
  dot,
} from "three/tsl";
import { v7Defaults, sanitizeV7Parameters, shoeContour } from "./parameters";
export async function createV7Renderer(canvas, forceWebGL = false) {
  const renderer = new WebGPURenderer({
    canvas,
    alpha: true,
    antialias: true,
    forceWebGL,
    powerPreference: "low-power",
  });
  try {
    await renderer.init();
  } catch (e) {
    renderer.dispose();
    throw e;
  }
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NoToneMapping;
  const u = {
    size: uniform(new Vector2(360, 752)),
    time: uniform(0),
    kind: uniform(0),
    shape: uniform(0),
    opacity: uniform(1),
  };
  for (const [key, value] of Object.entries(v7Defaults))
    u[key] = uniform(typeof value === "string" ? new Color(value) : value);
  const mat = new MeshBasicNodeMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    toneMapped: false,
  });
  mat.fragmentNode = Fn(() => {
    const v = uv(),
      p = vec2(v.x.sub(0.5), float(0.5).sub(v.y)).mul(u.size),
      t = u.time.mul(u.speed);
    const fade = smoothstep(0, 0.025, v.x)
      .mul(float(1).sub(smoothstep(0.975, 1, v.x)))
      .mul(smoothstep(0, 0.018, v.y))
      .mul(float(1).sub(smoothstep(0.985, 1, v.y)));
    const wave = sin(v.x.mul(5).add(v.y.mul(3)).add(t))
      .mul(0.5)
      .add(0.5);
    const color = mix(u.blue, u.pink, wave).toVar();
    const gauss = (d, w) => exp(d.div(w.max(0.001)).pow(2).negate());
    const q = p.abs().sub(u.size.mul(0.5).sub(3)).add(u.radius);
    const edge = length(q.max(0)).add(q.x.max(q.y).min(0)).sub(u.radius);
    const edgeAlpha = gauss(edge.abs(), u.lineWidth)
      .mul(0.6)
      .add(gauss(edge.abs(), u.innerWidth).mul(0.12))
      .mul(wave.mul(0.6).add(0.4));
    // Bottom bloom: fully procedural; host blur is handled by the independent glass surface.
    const glow = gauss(v.y, u.spread)
      .mul(gauss(v.x.sub(0.5), float(0.36)))
      .mul(0.9);
    const wash = gauss(length(v.sub(vec2(0.23, 0.45))), float(0.42))
      .mul(0.24)
      .add(gauss(length(v.sub(vec2(0.85, 0.7))), float(0.4)).mul(0.2));
    const circle = length(v.sub(0.5)).sub(0.38);
    const sphere = mix(
      mix(
        u.blue,
        u.violet,
        sin(v.y.mul(14).add(v.x.mul(6)))
          .mul(0.5)
          .add(0.5),
      ),
      vec3(1, 0.84, 0.47),
      sin(v.y.mul(10).sub(v.x.mul(7)))
        .mul(0.5)
        .add(0.5),
    );
    const qq = p
      .abs()
      .sub(u.size.mul(vec2(0.32, 0.36)))
      .add(16);
    const phone = length(qq.max(0)).add(qq.x.max(qq.y).min(0)).sub(16);
    const contour = float(1e5).toVar();
    const inside = float(0).toVar();
    for (let i = 0; i < shoeContour.length; i++) {
      const a = vec2(...shoeContour[i]).mul(u.size),
        b = vec2(...shoeContour[(i + 1) % shoeContour.length]).mul(u.size),
        ab = b.sub(a),
        pa = p.sub(a);
      const crossing = a.y
        .greaterThan(p.y)
        .notEqual(b.y.greaterThan(p.y))
        .and(
          p.x.lessThan(
            b.x
              .sub(a.x)
              .mul(p.y.sub(a.y))
              .div(b.y.sub(a.y).add(0.00001))
              .add(a.x),
          ),
        );
      inside.assign(crossing.select(float(1).sub(inside), inside));
      contour.assign(
        contour.min(
          length(pa.sub(ab.mul(dot(pa, ab).div(dot(ab, ab)).clamp(0, 1)))),
        ),
      );
    }
    const d = u.shape
      .greaterThan(0.5)
      .select(inside.greaterThan(0.5).select(contour.negate(), contour), phone);
    const selected = gauss(d, u.lineWidth)
      .mul(wave.mul(0.25).add(0.75))
      .add(
        gauss(d.abs(), d.lessThan(0).select(u.innerWidth, u.outerWidth)).mul(
          0.35,
        ),
      );
    const alpha = u.kind
      .lessThan(0.5)
      .select(
        glow,
        u.kind
          .lessThan(1.5)
          .select(
            edgeAlpha,
            u.kind
              .lessThan(2.5)
              .select(
                selected,
                u.kind
                  .lessThan(3.5)
                  .select(wash, float(1).sub(smoothstep(-0.01, 0.015, circle))),
              ),
          ),
      );
    color.assign(
      u.kind.greaterThan(3.5).select(
        sphere,
        u.kind
          .greaterThan(1.5)
          .and(u.kind.lessThan(2.5))
          .select(mix(u.violet, vec3(1), gauss(d, u.lineWidth)), color),
      ),
    );
    color.assign(
      u.kind
        .greaterThan(0.5)
        .and(u.kind.lessThan(1.5))
        .select(mix(vec3(1), color, 0.14), color),
    );
    return vec4(
      color,
      alpha
        .mul(u.intensity)
        .mul(u.opacity)
        .mul(fade)
        .mul(
          v.x
            .greaterThan(float(1).div(u.size.x))
            .and(v.x.lessThan(float(1).sub(float(1).div(u.size.x))))
            .and(v.y.greaterThan(float(1).div(u.size.y)))
            .and(v.y.lessThan(float(1).sub(float(1).div(u.size.y))))
            .select(1, 0),
        )
        .clamp(0, 1),
    );
  })();
  const geometry = new PlaneGeometry(2, 2),
    scene = new Scene(),
    camera = new OrthographicCamera(-1, 1, 1, -1, 0, 2);
  camera.position.z = 1;
  scene.add(new Mesh(geometry, mat));
  let size = "";
  return {
    backend: renderer.backend.isWebGPUBackend ? "WebGPU" : "WebGL2 · TSL",
    draw({ width, height, time, effect, shape, parameters, opacity }) {
      const signature = `${width}:${height}`;
      if (size !== signature) {
        renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
        renderer.setSize(width, height, false);
        u.size.value.set(width, height);
        size = signature;
      }
      const settings = sanitizeV7Parameters(parameters);
      for (const [k, val] of Object.entries(settings)) {
        if (typeof val === "string") u[k].value.set(val);
        else u[k].value = val;
      }
      u.time.value = time;
      u.opacity.value = opacity;
      u.kind.value =
        { bloom: 0, edge: 1, selection: 2, writing: 3, orb: 4 }[effect] ?? 0;
      u.shape.value = shape === "shoe" ? 1 : 0;
      renderer.render(scene, camera);
    },
    dispose() {
      geometry.dispose();
      mat.dispose();
      renderer.dispose();
    },
  };
}
