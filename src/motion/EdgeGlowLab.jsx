import React, { useState, useId } from "react";
import { CompanionEdgeGlow } from "./CompanionEdgeGlow";
import {
  edgeDefaults,
  edgeParameterSchema,
  edgeParameterExport,
} from "./edge-parameters";
import english from "../i18n/en.json" with { type: "json" };
export function EdgeGlowLab() {
  const controlId = useId();
  const [parameters, setParameters] = useState(edgeDefaults),
    [paused, setPaused] = useState(false),
    [surface, setSurface] = useState("white"),
    [saved, setSaved] = useState(false);
  const colors = {
    white: ["#ffffff", "#292c39"],
    dark: ["#171b2b", "#f5f7ff"],
    pink: ["#f4d8e5", "#3d3240"],
  };
  function download() {
    const data = edgeParameterExport(parameters);
    data.schema = data.schema.map((p) => ({
      ...p,
      labelEn: english[p.label],
      descriptionEn: english[p.description],
    }));
    const url = URL.createObjectURL(
        new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
      ),
      a = document.createElement("a");
    a.href = url;
    a.download = "xiaoyi-edge-light.parameters.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section className="edge-lab" id="edge-light">
      <div className="eyebrow">04 / COMPANION EDGE LIGHT · TSL</div>
      <h2>伴随态边缘光</h2>
      <p>
        细亮边贴合应用轮廓，柔光主要向内容侧衰减。宽度按原图高度等比缩放；中间完全透明，内容可正常操作。
      </p>
      <div className="edge-lab-grid">
        <div className="edge-lab-preview">
          <div
            className="edge-surface"
            style={{
              background: colors[surface][0],
              color: colors[surface][1],
            }}
          >
            <div className="edge-surface-content">
              <div className="eyebrow">XIAOYI · COMPANION</div>
              <h3>让思考自然延续</h3>
              <p>阅读时留下的一个问题，可以成为下一段探索的起点。</p>
              <button
                className="xy-button secondary"
                onClick={() => setSaved(!saved)}
              >
                {saved ? "已收藏" : "收藏"}
              </button>
            </div>
            <CompanionEdgeGlow parameters={parameters} paused={paused} />
          </div>
          <div className="edge-lab-actions">
            {[
              ["white", "白色表面"],
              ["dark", "深色表面"],
              ["pink", "粉色表面"],
            ].map(([id, label]) => (
              <button
                key={id}
                className="xy-button secondary small"
                aria-pressed={surface === id}
                onClick={() => setSurface(id)}
              >
                {label}
              </button>
            ))}
            <button
              className="xy-button secondary small"
              onClick={() => setPaused(!paused)}
            >
              {paused ? "播放边缘光" : "暂停边缘光"}
            </button>
          </div>
        </div>
        <div className="edge-controls">
          {edgeParameterSchema.map((p) => (
            <label key={p.key} htmlFor={`${controlId}-${p.key}`}>
              <span>
                {p.label}
                <output>
                  {parameters[p.key]} {p.unit}
                </output>
              </span>
              <input
                type="range"
                id={`${controlId}-${p.key}`}
                min={p.min}
                max={p.max}
                step={p.step}
                value={parameters[p.key]}
                onChange={(e) =>
                  setParameters({ ...parameters, [p.key]: +e.target.value })
                }
              />
            </label>
          ))}
          <div className="edge-lab-actions">
            <button
              className="xy-button secondary small"
              onClick={() => setParameters(edgeDefaults)}
            >
              重置边缘光
            </button>
            <button className="xy-button secondary small" onClick={download}>
              导出边缘光参数
            </button>
          </div>
        </div>
      </div>
      <div className="edge-reference">
        <img
          src={`${import.meta.env.BASE_URL}reference/L16.jpg`}
          alt="L16 伴随态边缘光参考"
        />
        <div>
          <strong>L11 / L14 / L15 / L16 / L18</strong>
          <p>
            原图内侧半峰约 8px，衰减到 10% 约 14–18px；520px 高表面约为 2.3px 和
            4–5px。外侧余光为保守估值。边缘包含浅蓝、粉紫、青色和浅暖色，与光球配色分开。
          </p>
        </div>
      </div>
      <details className="demo-notes">
        <summary>边缘光参数与复用</summary>
        <pre>{`import { CompanionEdgeGlow } from './motion/CompanionEdgeGlow';\n\n<div style={{ position: 'relative', borderRadius: 24 }}>\n  {children}\n  <CompanionEdgeGlow parameters={{ innerWidth: 9.6, outerOpacity: 0.04 }} />\n</div>`}</pre>
        <p>
          宽度单位 ref px 对应 1828px 高原图；实际宽度 = 参数 × 宿主高度 /
          1828。圆角默认读取宿主左上圆角，也可通过 radius 指定 CSS
          px。暂停、离屏和减少动态效果时停止持续绘制；无需摄像头或麦克风。
        </p>
        <div className="parameter-table-wrap">
          <table className="parameter-table">
            <thead>
              <tr>
                <th>参数</th>
                <th>默认</th>
                <th>作用与依据</th>
              </tr>
            </thead>
            <tbody>
              {edgeParameterSchema.map((p) => (
                <tr key={p.key}>
                  <td>
                    {p.label}
                    <code>{p.key}</code>
                  </td>
                  <td>
                    {p.default} {p.unit}
                  </td>
                  <td>{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
