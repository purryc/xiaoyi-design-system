import { english } from "../i18n/runtime";
import React, { useState } from "react";
import { iconLibrary, iconSvg } from "./icon-data";
import { Icon } from "./Icon";
function save(name, text) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "image/svg+xml" }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
export function IconLibrary() {
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("全部"),
    [evidence, setEvidence] = useState("全部"),
    [selected, setSelected] = useState(
      iconLibrary.find((x) => x.id === "summarize"),
    ),
    [size, setSize] = useState(28),
    [stroke, setStroke] = useState(1.65),
    [color, setColor] = useState("#202531"),
    [copied, setCopied] = useState(false);
  const filtered = iconLibrary.filter(
    (i) =>
      (category === "全部" || i.category === category) &&
      (evidence === "全部" || i.confidence === evidence) &&
      (i.id + i.label + english(i.label) + i.aliases.join(" "))
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const code = iconSvg(selected, { size, strokeWidth: stroke, color });
  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">04 / XIAOYI ICON LIBRARY</div>
          <h1>图标库</h1>
          <p>
            {iconLibrary.length} 枚可编辑 SVG，统一 24 × 24
            坐标。参考中可见的控件逐项重绘，其余按同一笔画体系补齐。
          </p>
        </div>
        <a
          className="xy-button secondary"
          href="/downloads/xiaoyi-icons.zip"
          download
        >
          <Icon name="download" size={17} />
          下载完整图标库
        </a>
      </div>
      <div className="icon-library-toolbar">
        <label className="small-search">
          <Icon name="Search" size={17} />
          <input
            aria-label="搜索图标"
            placeholder="搜索图标、英文名或功能"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="inline">
          <label>
            尺寸{" "}
            <select
              aria-label="图标尺寸"
              value={size}
              onChange={(e) => setSize(+e.target.value)}
            >
              {[16, 20, 24, 28, 32, 48].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            笔画{" "}
            <select
              aria-label="图标笔画"
              value={stroke}
              onChange={(e) => setStroke(+e.target.value)}
            >
              {[1.25, 1.5, 1.65, 1.75, 2, 2.5].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="icon-color-picker">
            颜色{" "}
            <input
              aria-label="图标颜色"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </label>
        </div>
      </div>
      <div className="filter-row icon-categories">
        {["全部", ...new Set(iconLibrary.map((i) => i.category))].map((c) => (
          <button
            className={`xy-chip ${category === c ? "selected" : ""}`}
            key={c}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
        <select
          aria-label="图标证据类型"
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
        >
          <option>全部</option>
          <option>参考重绘</option>
          <option>风格扩展</option>
        </select>
      </div>
      <div className="icon-workspace">
        <div>
          <div className="icon-result-count">
            {filtered.length} 个图标 <span>可调整尺寸、颜色与笔画</span>
          </div>
          <div className="icon-grid">
            {filtered.map((icon) => (
              <button
                key={icon.id}
                className={`icon-tile ${selected.id === icon.id ? "active" : ""}`}
                onClick={() => {
                  setSelected(icon);
                  setCopied(false);
                }}
                aria-label={`${icon.label} ${icon.id}`}
              >
                <span style={{ color }}>
                  <Icon name={icon.id} size={size} strokeWidth={stroke} />
                </span>
                <strong>{icon.label}</strong>
                <code>{icon.id}</code>
                <i
                  className={icon.confidence === "参考重绘" ? "observed" : ""}
                  title={icon.confidence}
                />
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="empty-state">
              没有匹配的图标。
              <button
                onClick={() => {
                  setQuery("");
                  setCategory("全部");
                  setEvidence("全部");
                }}
              >
                清除筛选
              </button>
            </div>
          )}
        </div>
        <aside className="icon-inspector">
          <div className="icon-grid-preview" style={{ color }}>
            <div className="icon-keyline" />
            <Icon name={selected.id} size={144} strokeWidth={stroke} />
          </div>
          <div className="inspector-copy">
            <div className="inline between">
              <h2>{selected.label}</h2>
              <span
                className={`badge ${selected.confidence === "参考重绘" ? "observed" : "estimate"}`}
              >
                {selected.confidence}
              </span>
            </div>
            <code>{selected.id}</code>
            <dl>
              <dt>网格</dt>
              <dd>24 × 24</dd>
              <dt>笔画</dt>
              <dd>{stroke} / Round</dd>
              <dt>输出</dt>
              <dd>
                {size} × {size} / SVG
              </dd>
              <dt>来源</dt>
              <dd>
                {selected.source === "extension"
                  ? "同风格扩展"
                  : selected.source}
              </dd>
            </dl>
            <p>{selected.note}</p>
            <div className="icon-inspector-actions">
              <button
                className="xy-button primary"
                onClick={() => save(`xiaoyi-${selected.id}.svg`, code)}
              >
                <Icon name="download" size={16} />
                下载 SVG
              </button>
              <button
                className="xy-button secondary"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(code);
                    setCopied(true);
                  } catch {
                    setCopied(false);
                  }
                }}
              >
                <Icon name={copied ? "Check" : "Copy"} size={16} />
                {copied ? "已复制" : "复制 SVG"}
              </button>
            </div>
            <details className="code-block">
              <summary>SVG 路径</summary>
              <pre>
                <code>{code}</code>
              </pre>
            </details>
            <details className="code-block">
              <summary>React 用法</summary>
              <pre>
                <code>{`<Icon name="${selected.id}"\n  size={${size}}\n  strokeWidth={${stroke}}\n/>`}</code>
              </pre>
            </details>
          </div>
        </aside>
      </div>
      <div className="section-heading">
        <div>
          <span className="section-index">01</span>
          <h2>构造规范</h2>
        </div>
      </div>
      <div className="icon-spec-grid">
        <div>
          <strong>24 × 24</strong>
          <span>矢量坐标系</span>
          <p>关键线常落在 3–21 单位内；圆形、箭头与端点按视觉重心微调。</p>
        </div>
        <div>
          <strong>1.65</strong>
          <span>默认笔画宽度</span>
          <p>
            圆端点、圆连接；使用 currentColor，SVG
            不含位图、嵌入字体或外部依赖。
          </p>
        </div>
        <div>
          <strong>SVG / React</strong>
          <span>两种复用方式</span>
          <p>
            单枚 SVG、symbol sprite、整包 ZIP、来源清单和 React 源码一并交付。
          </p>
        </div>
      </div>
      <div className="notice">
        整站已切换到这套自绘图标。参考重绘保留语义和轮廓，但不冒充华为官方矢量原件；每枚图标的来源和扩展身份可在右侧查看。
      </div>
    </>
  );
}
