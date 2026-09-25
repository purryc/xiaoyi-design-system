import {
  WebGPURenderer,
  Scene,
  OrthographicCamera,
  PlaneGeometry,
  Mesh,
  SRGBColorSpace,
  NoToneMapping,
} from "three/webgpu";
import { createOrbMaterial } from "./orb-shader";
import { parameterSchema, sanitizeParameters } from "./parameters";
import { timelineAt } from "./timeline";

export async function createOrbRenderer(canvas, { forceWebGL = false } = {}) {
  const renderer = new WebGPURenderer({
    canvas,
    alpha: true,
    antialias: true,
    forceWebGL,
    powerPreference: "low-power",
  });
  try {
    await renderer.init();
  } catch (error) {
    renderer.dispose();
    throw error;
  }
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NoToneMapping;
  renderer.setClearColor(0x000000, 0);
  const scene = new Scene(),
    camera = new OrthographicCamera(-1, 1, 1, -1, 0, 2);
  camera.position.z = 1;
  const geometry = new PlaneGeometry(2, 2),
    { material, uniforms: u } = createOrbMaterial(),
    mesh = new Mesh(geometry, material);
  scene.add(mesh);
  let lastSize = "",
    disposed = false;
  return {
    backend: renderer.backend.isWebGPUBackend ? "WebGPU" : "WebGL2 · TSL",
    draw({
      time = 0,
      mode = "idle",
      parameters = {},
      width = 100,
      height = 100,
      reference = false,
    }) {
      if (disposed) return;
      const params = sanitizeParameters(parameters),
        ratio = Math.min(params.pixelRatio, window.devicePixelRatio || 1.5);
      const size = `${width}:${height}:${ratio}`;
      if (lastSize !== size) {
        renderer.setPixelRatio(ratio);
        renderer.setSize(width, height, false);
        lastSize = size;
      }
      const sample = timelineAt(time, mode);
      u.time.value = sample.time;
      u.ripple.value = sample.ripple;
      u.gyro.value = sample.gyro;
      u.echo.value = sample.echo;
      u.aspect.value = width / height;
      u.framing.value = reference ? 1 : 0.62;
      for (const p of parameterSchema) {
        if (p.type === "color") u[p.key].value.set(params[p.key]);
        else u[p.key].value = params[p.key];
      }
      for (let i = 0; i < 9; i++) {
        const a = sample.field.a,
          b = sample.field.b,
          f = sample.field.mix;
        u["contour" + i].value = a.radius[i] + (b.radius[i] - a.radius[i]) * f;
        u["flux" + i].value.set(
          ...a.radiance[i].map((v, k) => v + (b.radiance[i][k] - v) * f),
        );
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
