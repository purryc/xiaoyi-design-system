import {
  WebGPURenderer,
  Scene,
  OrthographicCamera,
  PlaneGeometry,
  Mesh,
  Color,
  Vector2,
  SRGBColorSpace,
  NoToneMapping,
  MeshBasicNodeMaterial,
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
  smoothstep,
} from "three/tsl";
import analysis from "../../reference/edge-light-analysis.json";
import { edgeDefaults, sanitizeEdgeParameters } from "./edge-parameters";
export async function createEdgeRenderer(canvas, { forceWebGL = false } = {}) {
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
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NoToneMapping;
  renderer.setClearColor(0, 0);
  const u = {
    size: uniform(new Vector2(1, 1)),
    panel: uniform(new Vector2(1, 1)),
    radius: uniform(24),
  };
  for (const [k, v] of Object.entries(edgeDefaults)) u[k] = uniform(v);
  for (let i = 0; i < 16; i++) u["color" + i] = uniform(new Color());
  const material = new MeshBasicNodeMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
  material.fragmentNode = Fn(() => {
    const p = uv().sub(0.5).mul(u.size),
      half = u.panel.mul(0.5);
    const q = p.abs().sub(half).add(u.radius);
    const distance = length(q.max(0)).add(q.x.max(q.y).min(0)).sub(u.radius);
    const inside = distance.negate().max(0),
      outside = distance.max(0);
    const gaussian = (d, w) => exp(d.div(w.max(0.001)).pow(2).negate());
    const inner = gaussian(inside, u.lineWidth)
      .mul(0.05)
      .add(gaussian(inside, u.innerWidth).mul(0.95))
      .mul(
        float(1).sub(
          smoothstep(
            u.innerWidth.max(u.lineWidth).mul(2.5),
            u.innerWidth.max(u.lineWidth).mul(3),
            inside,
          ),
        ),
      );
    const outer = gaussian(outside, u.outerWidth)
      .mul(u.outerOpacity)
      .mul(u.outerWidth.greaterThan(0).select(1, 0))
      .mul(
        float(1).sub(
          smoothstep(
            u.outerWidth.max(0.001).mul(2.5),
            u.outerWidth.max(0.001).mul(3),
            outside,
          ),
        ),
      );
    const n = p.div(half).clamp(-1, 1);
    const horizontal = n.y
      .greaterThanEqual(0)
      .select(n.x.add(1).div(8), float(0.5).add(float(1).sub(n.x).div(8)));
    const vertical = n.x
      .greaterThanEqual(0)
      .select(
        float(0.25).add(float(1).sub(n.y).div(8)),
        float(0.75).add(n.y.add(1).div(8)),
      );
    const t = n.y
      .abs()
      .greaterThanEqual(n.x.abs())
      .select(horizontal, vertical);
    const ink = vec3(0).toVar();
    for (let i = 0; i < 16; i++) {
      const delta = t.sub(i / 16).abs();
      ink.addAssign(
        u["color" + i].mul(
          float(1)
            .sub(delta.min(float(1).sub(delta)).mul(16))
            .max(0),
        ),
      );
    }
    return vec4(
      ink,
      distance.lessThanEqual(0).select(inner, outer).mul(u.opacity),
    );
  })();
  const scene = new Scene(),
    camera = new OrthographicCamera(-1, 1, 1, -1, 0, 2),
    geometry = new PlaneGeometry(2, 2);
  camera.position.z = 1;
  scene.add(new Mesh(geometry, material));
  const a = new Color(),
    b = new Color();
  let lastSize = "",
    disposed = false;
  return {
    backend: renderer.backend.isWebGPUBackend ? "WebGPU" : "WebGL2 · TSL",
    draw({ width, height, padding, radius, time = 0, parameters = {} }) {
      if (disposed) return;
      const settings = sanitizeEdgeParameters(parameters),
        scale = height / analysis.referenceHeight;
      const fullWidth = width + padding * 2,
        fullHeight = height + padding * 2,
        ratio = Math.min(window.devicePixelRatio || 1, 2);
      const signature = `${fullWidth}:${fullHeight}:${ratio}`;
      if (signature !== lastSize) {
        renderer.setPixelRatio(ratio);
        renderer.setSize(fullWidth, fullHeight, false);
        lastSize = signature;
      }
      u.size.value.set(fullWidth, fullHeight);
      u.panel.value.set(width, height);
      u.radius.value = Math.min(radius, width / 2, height / 2);
      for (const [k, v] of Object.entries(settings))
        u[k].value = k.endsWith("Width") ? v * scale : v;
      const t = ((time % 13) + 13) % 13,
        index = Math.floor(t),
        next = index === 12 ? 0 : index + 1,
        f = t - index,
        ease = f * f * (3 - 2 * f);
      for (let i = 0; i < 16; i++) {
        a.setRGB(...analysis.frames[index].colors[i], SRGBColorSpace);
        b.setRGB(...analysis.frames[next].colors[i], SRGBColorSpace);
        u["color" + i].value.copy(a.lerp(b, ease));
      }
      renderer.render(scene, camera);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
