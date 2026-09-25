import { EdgeGlowLab } from "./EdgeGlowLab";
import React, { useEffect, useRef, useState } from "react";
import { Icon } from "../icons/Icon";
import { TslOrb } from "./TslOrb";
import {
  parameterSchema,
  defaults,
  referenceDuration,
  parameterExport,
  sanitizeParameters,
} from "./parameters";
import manifest from "../../reference/manifest.json";
import { analysis, timelineAt } from "./timeline";
const labels = {
  reference: "原片时间轴",
  idle: "单环",
  listening: "同心扩散",
  thinking: "交错旋转",
  speaking: "回应",
};
function download(name, value, type = "application/json") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([value], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
export function MotionLab({ onOpen }) {
  const [parameters, setParameters] = useState(defaults),
    [mode, setMode] = useState("reference"),
    [playing, setPlaying] = useState(
      () => !matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    [time, setTime] = useState(0),
    [status, setStatus] = useState({ status: "loading" }),
    [compare, setCompare] = useState(true),
    [surface, setSurface] = useState("checker"),
    [message, setMessage] = useState("");
  const video = useRef(null),
    clock = useRef(0),
    importRef = useRef(null),
    speed = useRef(parameters.speed);
  speed.current = parameters.speed;
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.playbackRate = parameters.speed;
    if (playing) v.play().catch(() => setPlaying(false));
    else v.pause();
  }, [playing, parameters.speed]);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const changed = () => {
      if (media.matches) setPlaying(false);
    };
    media.addEventListener("change", changed);
    return () => media.removeEventListener("change", changed);
  }, []);
  useEffect(() => {
    let frame,
      last = performance.now(),
      lastUpdate = 0;
    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      if (playing && !document.hidden) {
        const v = video.current;
        clock.current =
          v && !v.paused
            ? v.currentTime
            : (clock.current + ((now - last) / 1000) * speed.current) %
              referenceDuration;
        if (now - lastUpdate > 1000 / 30) {
          setTime(clock.current);
          lastUpdate = now;
        }
      }
      last = now;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);
  function seek(t) {
    setPlaying(false);
    clock.current = t;
    setTime(t);
    if (video.current) video.current.currentTime = t;
  }
  function change(key, value) {
    setParameters((p) => sanitizeParameters({ ...p, [key]: value }));
  }
  const segment = timelineAt(time).segment;
  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">03 / THREE.JS · TSL</div>
          <h1>光球与动效</h1>
          <p>
            原片时间轴、程序化光场、逐项参数。让动态形态与复用方式一起可见。
          </p>
        </div>
        <button
          className="xy-button secondary"
          onClick={() =>
            download(
              "xiaoyi-motion.parameters.json",
              JSON.stringify(parameterExport(parameters), null, 2),
            )
          }
        >
          <Icon name="download" size={17} />
          导出参数
        </button>
      </div>
      <div className="edge-shortcut">
        <button
          className="xy-button ghost small"
          onClick={() =>
            document
              .getElementById("edge-light")
              ?.scrollIntoView({
                behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "instant"
                  : "smooth",
              })
          }
        >
          伴随态边缘光 <span aria-hidden="true">↓</span>
        </button>
      </div>
      <div className="motion-workbench">
        <div className="motion-viewer">
          <div className="viewer-toolbar">
            <div className="inline">
              <span className={`engine-dot ${status.status}`} />
              <strong>Three.js TSL</strong>
              <span>
                {status.status === "ready"
                  ? status.backend
                  : status.status === "error"
                    ? "渲染失败"
                    : "正在初始化 GPU"}
              </span>
            </div>
            <button
              className="text-button"
              onClick={() => setCompare(!compare)}
            >
              {compare ? "隐藏原片" : "原片对照"}
            </button>
          </div>
          <div className={`tsl-comparison ${compare ? "is-comparing" : ""}`}>
            <figure
              className={`source-video ${compare ? "" : "source-hidden"}`}
            >
              <video
                ref={video}
                src={analysis.proxy.path}
                muted
                playsInline
                loop
                preload="auto"
                aria-label="小艺光球原片对照"
              />
              <figcaption>
                原片 · L10<span>30 fps 对照代理</span>
              </figcaption>
            </figure>
            <figure className="render-figure">
              <div className={`tsl-frame surface-${surface}`}>
                <TslOrb
                  state={mode}
                  reference
                  time={time}
                  paused={!playing}
                  parameters={parameters}
                  onStatus={setStatus}
                />
              </div>
              <figcaption>
                TSL 程序化渲染<span>{time.toFixed(2)} s</span>
              </figcaption>
            </figure>
          </div>
          <div className="surface-controls" role="group" aria-label="动效背景">
            <span>背景</span>
            {[
              ["checker", "透明网格"],
              ["white", "白色"],
              ["dark", "深色"],
              ["blue", "蓝色"],
              ["rose", "粉色"],
            ].map(([id, label]) => (
              <button
                key={id}
                aria-pressed={surface === id}
                onClick={() => setSurface(id)}
                className={`surface-swatch surface-${id}`}
                aria-label={label}
                title={label}
              />
            ))}
          </div>
          <div className="timeline-controls">
            <button
              className="transport-button"
              aria-label={playing ? "暂停动效" : "播放动效"}
              onClick={() => setPlaying(!playing)}
            >
              <Icon name={playing ? "pause" : "play"} size={17} />
            </button>
            <label className="playhead-label">
              <span>时间轴</span>
              <input
                aria-label="参考时间轴"
                type="range"
                min="0"
                max="23.2"
                step=".01"
                value={time}
                onChange={(e) => seek(+e.target.value)}
              />
            </label>
            <output>
              {time.toFixed(2)} <span>/ {referenceDuration} s</span>
            </output>
          </div>
          <div className="timeline-chapters">
            {analysis.segments.map((s) => (
              <button
                key={s.start}
                style={{ flex: s.end - s.start }}
                className={segment?.start === s.start ? "active" : ""}
                onClick={() => seek(s.start + 0.15)}
                title={`${s.start}–${s.end}s · ${s.label}`}
              >
                <span>{s.label}</span>
                <small>{s.start}s</small>
              </button>
            ))}
          </div>
          <div className="mode-controls">
            <span>形态</span>
            {Object.entries(labels).map(([id, label]) => (
              <button
                className={`xy-chip ${mode === id ? "selected" : ""}`}
                key={id}
                onClick={() => setMode(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <aside className="parameter-panel">
          <header>
            <div>
              <span className="eyebrow">LIVE PARAMETERS</span>
              <h3>参数调校</h3>
            </div>
            <button
              className="text-button"
              onClick={() => {
                setParameters(defaults);
                setMessage("已恢复参考拟合参数");
              }}
            >
              重置
            </button>
          </header>
          {["几何", "光感", "节奏", "色彩", "播放", "画质"].map((group, i) => (
            <details key={group} open={i === 0 || i === 1}>
              <summary>
                {group}
                <span>
                  {parameterSchema.filter((p) => p.group === group).length}
                </span>
              </summary>
              {parameterSchema
                .filter((p) => p.group === group)
                .map((p) => (
                  <label className="parameter-control" key={p.key}>
                    <span>
                      <strong>{p.label}</strong>
                      <output>
                        {p.type === "color"
                          ? parameters[p.key]
                          : Number(parameters[p.key].toFixed(3))}{" "}
                        <small>{p.unit}</small>
                      </output>
                    </span>
                    {p.type === "color" ? (
                      <input
                        aria-label={p.label}
                        type="color"
                        value={parameters[p.key]}
                        onChange={(e) => change(p.key, e.target.value)}
                      />
                    ) : (
                      <input
                        aria-label={p.label}
                        type="range"
                        min={p.min}
                        max={p.max}
                        step={p.step}
                        value={parameters[p.key]}
                        onChange={(e) => change(p.key, +e.target.value)}
                      />
                    )}
                    <small className="parameter-help">{p.description}</small>
                    <code>{p.key}</code>
                  </label>
                ))}
            </details>
          ))}
          <div className="parameter-import">
            <button
              className="xy-button secondary"
              onClick={() => importRef.current.click()}
            >
              <Icon name="upload" size={16} />
              导入 JSON
            </button>
            <input
              ref={importRef}
              className="visually-hidden"
              type="file"
              accept=".json,application/json"
              aria-label="导入动效参数"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const data = JSON.parse(await file.text());
                  if (!data.parameters || typeof data.parameters !== "object")
                    throw Error("需要包含 parameters 对象");
                  setParameters(sanitizeParameters(data.parameters));
                  setMessage("参数已导入，超出范围的值已归一化");
                } catch (error) {
                  setMessage("导入失败：" + error.message);
                }
                e.target.value = "";
              }}
            />
          </div>
          <p className="parameter-message" role="status">
            {message}
          </p>
        </aside>
      </div>
      <div className="motion-evidence">
        <button
          onClick={() =>
            onOpen(manifest.items.find((item) => item.id === "L10"))
          }
        >
          原始参考 L10 ↗
        </button>
        <span>
          无视频贴图 · 无 CSS 光环 · {parameterSchema.length} 个标注参数
        </span>
      </div>
      <div className="notice">
        <span className="badge observed">时间对照</span>原片在左，TSL
        实时绘制在右。光球使用透明背景，可叠加任意表面；环形、光晕和运动曲线为重建。未取得原始
        shader，当前不宣称逐像素完全相同。
      </div>
      <div className="section-heading">
        <div>
          <span className="section-index">01</span>
          <h2>关键帧对齐</h2>
          <p>
            选择时点，同时定位原片与程序化渲染。阶段名称描述可见形态，不替原片添加语义。
          </p>
        </div>
      </div>
      <div className="motion-sample-grid">
        {[0, 3, 5, 10, 13.5, 14.5, 15.5, 17, 20, 23].map((t) => {
          const f = analysis.frames.find((x) => x.time === t);
          return (
            <button
              key={t}
              className={Math.abs(time - t) < 0.08 ? "active" : ""}
              onClick={() => seek(t)}
            >
              <img src={f.preview} alt={`原片 ${t} 秒`} loading="lazy" />
              <span>
                {t.toFixed(2)} s<Icon name="ChevronRight" size={12} />
              </span>
            </button>
          );
        })}
      </div>
      <div className="section-heading">
        <div>
          <span className="section-index">02</span>
          <h2>参数规范</h2>
          <p>
            单位 H/2 表示归一化半高坐标；700 px 高的原片中，1 单位 = 350
            px。所有公开参数在此完整列出。
          </p>
        </div>
      </div>
      <div className="parameter-table-wrap">
        <table className="parameter-table">
          <thead>
            <tr>
              <th>参数 / key</th>
              <th>默认值</th>
              <th>范围 / 单位</th>
              <th>作用</th>
              <th>依据</th>
            </tr>
          </thead>
          <tbody>
            {parameterSchema.map((p) => (
              <tr key={p.key}>
                <td>
                  <strong>{p.label}</strong>
                  <code>{p.key}</code>
                </td>
                <td>{p.default}</td>
                <td>
                  {p.type === "color" ? "#RRGGBB" : `${p.min}—${p.max}`}
                  <small>{p.unit}</small>
                </td>
                <td>{p.description}</td>
                <td>{p.evidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <details className="demo-notes">
        <summary>渲染、性能和误差说明</summary>
        <p>
          WebGPURenderer 首选 WebGPU，设备不支持时使用同一 TSL 图编译到
          WebGL2。GPU 不可用时明确提示，不回退到 CSS
          仿制。调整像素比控制分辨率；暂停或离屏后不持续重绘。系统减少动态效果会暂停自动播放。
        </p>
        <p>
          原片预览为本地原视频的 960 px / 30 fps H.264
          代理；未修改原始文件。代理作为 HTML video
          单独播放，不进入材质采样。现有待机、聆听、思考等组件采用同一 TSL
          图的形态参数，语义映射仍为设计系统的演示映射。
        </p>
      </details>
      <EdgeGlowLab />
    </>
  );
}
