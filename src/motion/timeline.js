import fieldFit from "../../reference/light-field-fit.json";
import analysis from "../../reference/motion-analysis.json";
import { referenceDuration } from "./parameters";
export function smooth(a, b, t) {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
}
export function timelineAt(seconds, mode = "reference") {
  const t =
    ((seconds % referenceDuration) + referenceDuration) % referenceDuration;
  const ripple =
    smooth(3.15, 3.75, t) * (1 - smooth(13.15, 13.6, t)) +
    smooth(16.1, 16.7, t) * (1 - smooth(18.4, 19, t)) * 0.55;
  const gyro = smooth(13.35, 13.85, t) * (1 - smooth(15.5, 16.15, t));
  let values = { ripple, gyro, echo: 1 - ripple * 0.8 - gyro * 0.5 };
  if (mode !== "reference")
    values =
      {
        idle: { ripple: 0, gyro: 0, echo: 1 },
        listening: { ripple: 1, gyro: 0, echo: 0.12 },
        thinking: { ripple: 0, gyro: 1, echo: 0.4 },
        speaking: { ripple: 0.45, gyro: 0, echo: 0.65 },
        error: { ripple: 0, gyro: 0, echo: 0.2 },
      }[mode] || values;
  let i = analysis.frames.findIndex((f) => f.time > t);
  if (i < 0) i = analysis.frames.length - 1;
  const a = analysis.frames[Math.max(0, i - 1)],
    b = analysis.frames[i],
    f = smooth(a.time, b.time || 0.001, t);
  return {
    time: t,
    field: {
      a: fieldFit.frames[Math.max(0, i - 1)],
      b: fieldFit.frames[i],
      mix: f,
    },
    ...values,
    segment: analysis.segments.find((s) => t >= s.start && t < s.end),
    background: { a: a.background, b: b.background, mix: f },
  };
}
export function nearestReference(seconds) {
  return analysis.frames.reduce((a, b) =>
    Math.abs(a.time - seconds) < Math.abs(b.time - seconds) ? a : b,
  );
}
export { analysis };
