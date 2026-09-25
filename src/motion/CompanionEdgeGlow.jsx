import React, { useEffect, useRef, useState } from "react";
import { sanitizeEdgeParameters } from "./edge-parameters";
import "./edge-glow.css";
/** Place inside a positioned surface. Does not intercept input or tint its center. */
export function CompanionEdgeGlow({
  active = true,
  paused = false,
  time = null,
  parameters = {},
  radius = null,
  className = "",
}) {
  const ref = useRef(null),
    settings = useRef({}),
    [status, setStatus] = useState("loading"),
    [backend, setBackend] = useState("");
  settings.current = {
    active,
    paused,
    time,
    parameters: sanitizeEdgeParameters(parameters),
    radius,
  };
  useEffect(() => {
    const canvas = ref.current,
      host = canvas.parentElement,
      parent = host.parentElement,
      media = matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false,
      engine = null,
      raf = 0,
      dirty = true,
      visible = true,
      width = 0,
      height = 0,
      elapsed = 0,
      last = performance.now(),
      drawn = 0,
      signature = "";
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      dirty = true;
    });
    resize.observe(host);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      dirty = true;
    });
    observer.observe(host);
    import("./edge-renderer")
      .then(async ({ createEdgeRenderer }) => {
        if (disposed) return;
        engine = await createEdgeRenderer(canvas, {
          forceWebGL:
            new URLSearchParams(location.search).get("backend") === "webgl",
        });
        if (disposed) {
          engine.dispose();
          return;
        }
        setBackend(engine.backend);
        setStatus("ready");
        function loop(now) {
          if (disposed) return;
          raf = requestAnimationFrame(loop);
          const s = settings.current,
            dt = Math.min((now - last) / 1000, 0.1);
          last = now;
          const running =
            s.active &&
            !s.paused &&
            !media.matches &&
            s.time === null &&
            visible &&
            !document.hidden &&
            s.parameters.speed > 0;
          if (running) elapsed = (elapsed + dt * s.parameters.speed) % 13;
          const next = JSON.stringify([s, media.matches, width, height]);
          if (next !== signature) {
            dirty = true;
            signature = next;
          }
          if (
            !visible ||
            document.hidden ||
            !width ||
            !height ||
            (!dirty && !running) ||
            now - drawn < 1000 / 30
          )
            return;
          const padding = Math.ceil(
            ((Math.max(s.parameters.outerWidth, s.parameters.lineWidth) *
              height) /
              1828) *
              3 +
              2,
          );
          const corner =
            s.radius === null
              ? parseFloat(getComputedStyle(parent).borderTopLeftRadius) || 0
              : Math.max(0, s.radius);
          canvas.style.cssText = `position:absolute;left:${-padding}px;top:${-padding}px;width:${width + padding * 2}px;height:${height + padding * 2}px`;
          try {
            engine.draw({
              width,
              height,
              padding,
              radius: corner,
              time: s.time ?? elapsed,
              parameters: {
                ...s.parameters,
                opacity: s.active ? s.parameters.opacity : 0,
              },
            });
            canvas.dataset.time = (s.time ?? elapsed).toFixed(3);
            canvas.dataset.paused = String(!running);
            canvas.dataset.padding = String(padding);
            dirty = false;
            drawn = now;
          } catch (e) {
            setStatus("error");
            canvas.dataset.error = e.message;
            cancelAnimationFrame(raf);
          }
        }
        raf = requestAnimationFrame(loop);
      })
      .catch((e) => {
        if (!disposed) {
          setStatus("error");
          canvas.dataset.error = e.message;
        }
      });
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resize.disconnect();
      observer.disconnect();
      engine?.dispose();
    };
  }, []);
  return (
    <div
      className={`companion-edge-glow ${className}`}
      aria-hidden="true"
      data-engine="three-tsl"
      data-render-status={status}
      data-backend={backend}
      data-active={active}
    >
      <canvas ref={ref} />
      {status === "error" && <span className="edge-error">GPU 渲染不可用</span>}
    </div>
  );
}
