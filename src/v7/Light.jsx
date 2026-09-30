import React, { useEffect, useRef, useState } from "react";
import { sanitizeV7Parameters } from "./parameters";
export function V7Light({
  effect = "bloom",
  shape = "phone",
  parameters = {},
  paused = false,
  time = null,
  active = true,
  className = "",
}) {
  const ref = useRef(null),
    latest = useRef({}),
    [status, setStatus] = useState("loading");
  latest.current = {
    effect,
    shape,
    parameters: sanitizeV7Parameters(parameters),
    paused,
    time,
    active,
  };
  useEffect(() => {
    const canvas = ref.current,
      host = canvas.parentElement,
      reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false,
      engine,
      raf = 0,
      width = 0,
      height = 0,
      last = performance.now(),
      elapsed = 0,
      visible = true,
      opacity = 0,
      lastDraw = 0,
      lastSignature = "";
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
    });
    resize.observe(host);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersection.observe(host);
    import("./renderer")
      .then(async ({ createV7Renderer }) => {
        if (disposed) return;
        engine = await createV7Renderer(
          canvas,
          new URLSearchParams(location.search).get("backend") === "webgl",
        );
        if (disposed) {
          engine.dispose();
          return;
        }
        setStatus("ready");
        canvas.dataset.backend = engine.backend;
        const loop = (now) => {
          if (disposed) return;
          raf = requestAnimationFrame(loop);
          const s = latest.current,
            dt = Math.min((now - last) / 1000, 0.1);
          last = now;
          if (!visible || document.hidden || !width || !height) return;
          const running = !s.paused && !reduce.matches && s.time === null;
          if (running) elapsed += dt;
          const duration = s.active
            ? s.parameters.enterMs
            : s.parameters.exitMs;
          opacity =
            reduce.matches || duration === 0
              ? Number(s.active)
              : Math.min(
                  1,
                  Math.max(
                    0,
                    opacity + ((s.active ? 1 : -1) * dt * 1000) / duration,
                  ),
                );
          if (now - lastDraw < 33) return;
          const signature = JSON.stringify([
            s,
            width,
            height,
            opacity,
            reduce.matches,
          ]);
          if (!running && lastSignature === signature) return;
          lastSignature = signature;
          lastDraw = now;
          try {
            engine.draw({
              width,
              height,
              ...s,
              time: s.time ?? elapsed,
              opacity: s.time !== null ? Number(s.active) : opacity,
            });
            canvas.dataset.time = String(s.time ?? elapsed);
            canvas.dataset.paused = String(!running);
          } catch (e) {
            canvas.dataset.error = e.message;
            setStatus("error");
            cancelAnimationFrame(raf);
          }
        };
        raf = requestAnimationFrame(loop);
      })
      .catch((e) => {
        if (!disposed) {
          canvas.dataset.error = e.message;
          setStatus("error");
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
  return (
    <span
      className={`xy-v7-light ${className}`}
      data-effect={effect}
      data-render-status={status}
      aria-hidden="true"
    >
      <canvas ref={ref} />
    </span>
  );
}
