export const edgeParameterSchema = [
  {
    key: "lineWidth",
    label: "边缘亮线宽度",
    default: 2,
    min: 0.5,
    max: 8,
    step: 0.1,
    unit: "ref px",
    description:
      "窄核的 1/e 半宽；约 0.57 CSS px / 520px 高。窄核权重 5%，为拟合估值。",
  },
  {
    key: "innerWidth",
    label: "向内发散宽度",
    default: 9.6,
    min: 2,
    max: 50,
    step: 0.1,
    unit: "ref px",
    description:
      "内侧高斯 1/e 半宽；约 2.73 CSS px / 520px 高。原图半峰约 8px，10% 约 14–18px。",
  },
  {
    key: "outerWidth",
    label: "外侧余光宽度",
    default: 4,
    min: 0,
    max: 40,
    step: 0.1,
    unit: "ref px",
    description: "外侧弱光的 1/e 半宽，独立于内侧发散；4px 为保守拟合估值。",
  },
  {
    key: "outerOpacity",
    label: "外侧余光强度",
    default: 0.04,
    min: 0,
    max: 0.5,
    step: 0.01,
    unit: "α",
    description: "外侧最高透明度；默认 4%，避免将应用边缘变成宽霓虹描边。",
  },
  {
    key: "opacity",
    label: "边缘光整体强度",
    default: 1,
    min: 0,
    max: 1,
    step: 0.01,
    unit: "×",
    description: "统一缩放亮线、内侧发散和外侧余光的透明度。",
  },
  {
    key: "speed",
    label: "边缘色彩播放倍率",
    default: 1,
    min: 0,
    max: 3,
    step: 0.1,
    unit: "×",
    description:
      "沿 0–12 秒采样播放；随后用 1 秒衔接回起点，循环衔接为复刻处理。",
  },
];
export const edgeDefaults = Object.fromEntries(
  edgeParameterSchema.map((p) => [p.key, p.default]),
);
export function sanitizeEdgeParameters(input = {}) {
  return Object.fromEntries(
    edgeParameterSchema.map((p) => [
      p.key,
      typeof input[p.key] === "number" && Number.isFinite(input[p.key])
        ? Math.max(p.min, Math.min(p.max, input[p.key]))
        : p.default,
    ]),
  );
}
export function edgeParameterExport(input = {}) {
  return {
    effect: "companion-edge-light",
    version: 1,
    sourceIds: ["L11", "L14", "L15", "L16", "L18"],
    referenceHeight: 1828,
    parameters: sanitizeEdgeParameters(input),
    schema: edgeParameterSchema,
  };
}
