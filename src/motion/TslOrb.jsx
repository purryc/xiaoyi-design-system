import React, { useEffect, useRef, useState } from "react";
import { defaults, sanitizeParameters, referenceDuration } from "./parameters";
/** Pure GPU TSL rendering; no prerecorded texture or CSS-ring substitution. */
export function TslOrb({
  state = "idle",
  size = 100,
  paused = false,
  className = "",
  parameters = {},
  time = null,
  reference = false,
  onStatus,
}) {
  const canvasRef = useRef(null),
    settings = useRef({}),
    [status, setStatus] = useState("loading"),
    [backend, setBackend] = useState(""),
    [error, setError] = useState("");
  settings.current = {
    state,
    paused,
    parameters: sanitizeParameters(parameters),
    time,
    reference,
    onStatus,
  };
  useEffect(() => {
    let disposed = false,
      engine = null,
      raf = 0,
      elapsed = 0,
      previous = performance.now(),
      lastDraw = 0,
      dirty = true,
      visible = true,
      width = size,
      height = size,
      lastSignature = "";
    const canvas = canvasRef.current,
      host = canvas.parentElement,
      motion = matchMedia("(prefers-reduced-motion: reduce)");
    const resize = new ResizeObserver((entries) => {
      const b = entries[0].contentRect;
      width = Math.max(1, b.width);
      height = Math.max(1, b.height);
      dirty = true;
    });
    resize.observe(host);
    const intersection = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      dirty = true;
    });
    intersection.observe(host);
    const report = (value, details = "") => {
      if (disposed) return;
      setStatus(value);
      settings.current.onStatus?.({ status: value, backend: details });
    };
    import("./orb-renderer")
      .then(async ({ createOrbRenderer }) => {
        if (disposed) return;
        const forceWebGL =
          new URLSearchParams(location.search).get("backend") === "webgl";
        engine = await createOrbRenderer(canvas, { forceWebGL });
        if (disposed) {
          engine.dispose();
          return;
        }
        setBackend(engine.backend);
        report("ready", engine.backend);
        function loop(now) {
          if (disposed) return;
          raf = requestAnimationFrame(loop);
          const s = settings.current,
            dt = Math.min((now - previous) / 1000, 0.1);
          previous = now;
          const running =
            !s.paused &&
            !motion.matches &&
            s.time === null &&
            visible &&
            !document.hidden;
          if (running)
            elapsed = (elapsed + dt * s.parameters.speed) % referenceDuration;
          const playhead = s.time === null ? elapsed : s.time;
          const signature = JSON.stringify([
            s.state,
            s.parameters,
            s.time,
            s.reference,
            s.paused,
            motion.matches,
          ]);
          if (signature !== lastSignature) {
            dirty = true;
            lastSignature = signature;
          }
          if (!visible || document.hidden || (!dirty && !running)) return;
          if (lastDraw && now - lastDraw < 1000 / s.parameters.maxFps) return;
          try {
            engine.draw({
              time: playhead,
              mode: s.state,
              parameters: s.parameters,
              width,
              height,
              reference: s.reference,
            });
            canvas.dataset.time = playhead.toFixed(3);
            canvas.dataset.reducedMotion = String(motion.matches);
            canvas.dataset.paused = String(s.paused || motion.matches);
            dirty = false;
            lastDraw = now;
          } catch (e) {
            setError(e.message);
            report("error", engine.backend);
            cancelAnimationFrame(raf);
          }
        }
        raf = requestAnimationFrame(loop);
      })
      .catch((e) => {
        if (!disposed) {
          setError(e.message);
          report("error");
        }
      });
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resize.disconnect();
      intersection.disconnect();
      engine?.dispose();
    };
  }, []);
  const label =
    {
      idle: "待机",
      listening: "聆听",
      thinking: "思考",
      speaking: "回应",
      error: "错误",
      reference: "参考时间轴",
    }[state] || state;
  return (
    <div
      className={`xy-orb tsl-orb ${state} ${paused ? "paused" : ""} ${reference ? "reference-render" : ""} ${className}`}
      style={reference ? undefined : { "--orb-size": `${size}px` }}
      role="img"
      aria-label={`小艺光球：${label}`}
      data-engine="three-tsl"
      data-render-status={status}
      data-backend={backend}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
      {status === "loading" && size > 60 && (
        <span className="gpu-loading">加载光场…</span>
      )}
      {status === "error" && (
        <span className="gpu-error" title={error}>
          GPU 渲染不可用
        </span>
      )}
    </div>
  );
}
