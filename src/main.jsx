import { LanguageProvider, LanguageSwitch, english } from "./i18n/runtime";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Icon,
  IconButton,
  Button,
  Chip,
  Orb,
  AssistantInput,
  UserMessage,
  AssistantMessage,
  ServiceCard,
  WritingDemo,
  CompanionDemo,
  ConversationDemo,
  SelectionDemo,
  DragDemo,
  NavigationBar,
} from "./components.jsx";
import { controlItems } from "./controls/catalog";
import { ControlCatalog } from "./controls/ControlCatalog";
import { VisionDemo, VisionReference } from "./vision/VisionDemo";
import { MotionLab } from "./motion/MotionLab";
import { IconLibrary } from "./icons/IconLibrary";
import tokens from "../tokens/xiaoyi.tokens.json";
import manifest from "../reference/manifest.json";
import webSources from "../reference/web-sources.json";
import "./tokens.css";
import "./styles.css";
const nav = [
  ["overview", "概览", "Design overview", "Sparkles"],
  ["foundations", "设计基础", "Foundations", "Grip"],
  ["components", "组件库", "Components", "Clipboard"],
  ["motion", "光球与动效", "Motion & presence", "AudioLines"],
  ["icons", "图标库", "Icon library", "grid-four"],
  ["patterns", "交互范式", "Patterns", "ScanLine"],
  ["reference", "参考与证据", "References", "BookOpen"],
  ["handoff", "使用与交付", "Getting started", "FileText"],
];
const sourceById = Object.fromEntries(manifest.items.map((r) => [r.id, r]));
const tokenCount = Object.entries(tokens)
  .filter(([k]) => !k.startsWith("$") && k !== "meta")
  .reduce((n, [, v]) => n + Object.keys(v).length, 0);
function Evidence({ ids, onOpen }) {
  return (
    <div className="evidence-links">
      <span>视觉依据</span>
      {ids.split(",").map((id) => (
        <button key={id} onClick={() => onOpen(sourceById[id])}>
          {id}
          <Icon name="ArrowUp" size={10} />
        </button>
      ))}
    </div>
  );
}
function PageTitle({ eyebrow, title, description, children }) {
  return (
    <div className="page-title">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}
function SectionTitle({ index, title, note, children }) {
  return (
    <div className="section-heading">
      <div>
        <span className="section-index">{index}</span>
        <h2>{title}</h2>
        {note && <p>{note}</p>}
      </div>
      {children}
    </div>
  );
}
function Code({ children }) {
  return (
    <details className="code-block">
      <summary>
        查看代码 <Icon name="ChevronDown" size={14} />
      </summary>
      <pre>
        <code>{children}</code>
      </pre>
    </details>
  );
}
function Overview({ go, onOpen }) {
  return (
    <>
      <div className="overview-heading">
        <div className="eyebrow">
          XIAOYI DESIGN SYSTEM <span className="version">2.2</span>
        </div>
        <h1>
          小艺，
          <br />
          自然相伴的设计语言。
        </h1>
        <p>
          从真实界面出发，还原小艺的色彩、组件与交互。
          <br />
          让每一次唤起、聆听与回应，都有据可循。
        </p>
        <div className="inline">
          <Button onClick={() => go("components")} icon="ArrowUp">
            探索组件
          </Button>
          <Button variant="ghost" onClick={() => go("reference")}>
            查看参考资料 <span>↗</span>
          </Button>
        </div>
        <div className="hero-orbit">
          <Orb size={240} />
          <span className="orbit-caption">PRESENCE, IN EVERY MOMENT</span>
        </div>
      </div>
      <div className="overview-strip">
        <div>
          <strong>18</strong>
          <span>本地参考</span>
        </div>
        <div>
          <strong>{tokenCount}</strong>
          <span>设计变量</span>
        </div>
        <div>
          <strong>6</strong>
          <span>交互范式</span>
        </div>
        <div className="strip-note">
          <span className="status-dot" />
          基于参考复刻<span>2026.09 · 独立研究版本</span>
        </div>
      </div>
      <SectionTitle
        index="01"
        title="两种表面，一致的陪伴"
        note="保留内容的主导位置，让助手出现在合适的空间。"
      />
      <div className="surface-showcase">
        <div className="surface-wide">
          <div className="showcase-top">
            <div>
              <h3>伴随式 AI</h3>
              <span>上下文留在眼前，帮助就在身旁。</span>
            </div>
            <button
              className="round-link"
              aria-label="查看伴随式交互"
              onClick={() => go("patterns")}
            >
              <Icon name="ArrowUp" />
            </button>
          </div>
          <CompanionDemo />
          <Evidence ids="L11,L15,L18" onOpen={onOpen} />
        </div>
        <div className="surface-narrow">
          <div className="showcase-top">
            <div>
              <h3>小艺帮写</h3>
              <span>轻盈的半屏，聚焦当下的表达。</span>
            </div>
          </div>
          <div className="writing-mini">
            <WritingDemo />
          </div>
          <Evidence ids="L09" onOpen={onOpen} />
        </div>
      </div>
      <SectionTitle index="02" title="从细节，到系统" />
      <div className="overview-links">
        {[
          ["foundations", "01", "可复用的基础", "色彩、字体、间距与形状"],
          ["components", "02", "有语义的组件", "输入、建议、结果与服务卡片"],
          ["motion", "03", "可感知的状态", "光球、流光与状态转换"],
        ].map(([page, num, title, desc]) => (
          <button key={page} onClick={() => go(page)}>
            <span>{num}</span>
            <h3>{title}</h3>
            <p>{desc}</p>
            <Icon name="ArrowUp" />
          </button>
        ))}
      </div>
      <div className="research-note">
        <Icon name="BookOpen" />
        <p>
          这是一套独立复刻的研究型设计系统。界面结构来自截图与录屏；数值与演示时序为工程近似，图标提供可编辑重绘，具体来源可逐项查看。
        </p>
      </div>
    </>
  );
}
function Foundations({ onOpen }) {
  const [query, setQuery] = useState(""),
    [copied, setCopied] = useState("");
  async function copy(k, v) {
    try {
      await navigator.clipboard.writeText(v);
      setCopied(k);
    } catch {
      setCopied("");
    }
  }
  return (
    <>
      <PageTitle
        eyebrow="01 / FOUNDATIONS"
        title="设计基础"
        description="从浅色内容表面，到有辨识度的青、蓝、粉光晕。"
      >
        <a
          className="xy-button secondary"
          href="/downloads/xiaoyi.tokens.json"
          download
        >
          <Icon name="ArrowDown" size={17} />
          下载 Tokens
        </a>
      </PageTitle>
      <div className="notice">
        <span className="badge estimate">复刻估值</span>
        所有数值均为工程化近似，单位为 CSS px，不能当作华为官方色值或 vp 规范。
      </div>
      <SectionTitle
        index="01"
        title="色彩"
        note="中性色服务阅读，交互蓝标记动作，渐变仅用于智能状态。"
      >
        <label className="small-search">
          <Icon name="Search" size={17} />
          <input
            placeholder="筛选颜色"
            aria-label="筛选颜色"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </SectionTitle>
      <div className="color-grid">
        {Object.entries(tokens.color)
          .filter(([k, t]) =>
            (k + t.label + t.$value)
              .toLowerCase()
              .includes(query.toLowerCase()),
          )
          .map(([k, t]) => (
            <button
              className="color-item"
              key={k}
              onClick={() => copy(k, t.$value)}
              aria-label={`复制 ${t.label} ${t.$value}`}
            >
              <span className="color-swatch" style={{ background: t.$value }} />
              <span className="color-description">
                <strong>{t.label}</strong>
                <code>{copied === k ? "已复制" : t.$value.toUpperCase()}</code>
                <small>{k}</small>
              </span>
            </button>
          ))}
      </div>
      <Evidence ids="L09,L10,L15" onOpen={onOpen} />
      <SectionTitle
        index="02"
        title="文字层级"
        note="优先使用已安装的 HarmonyOS Sans；未安装时回退至系统中文字体，不捆绑字体文件。"
      />
      <div className="type-table">
        {Object.entries(tokens.fontSize)
          .reverse()
          .map(([k, t], i) => (
            <div key={k}>
              <span>
                {k}
                <small>
                  {t.$value.value} /{" "}
                  {Math.round(t.$value.value * (i < 3 ? 1.25 : 1.65))}
                </small>
              </span>
              <p
                style={{
                  fontSize: `${t.$value.value}px`,
                  fontWeight: i < 3 ? 600 : 400,
                }}
              >
                让每个想法，自然发生
              </p>
            </div>
          ))}
      </div>
      <SectionTitle index="03" title="间距与形状" />
      <div className="two-cols">
        <div className="spec-surface">
          <h3>4 px 基础节奏</h3>
          <div className="space-scale">
            {Object.keys(tokens.space).map((k) => (
              <div key={k}>
                <span>{k}</span>
                <i style={{ width: `${k}px` }} />
              </div>
            ))}
          </div>
          <p>控件内部更紧凑，内容组之间更舒展。</p>
        </div>
        <div className="spec-surface">
          <h3>连续圆角</h3>
          <div className="radius-grid">
            {Object.entries(tokens.radius).map(([k, t]) => (
              <div key={k}>
                <i style={{ borderRadius: `${t.$value.value}px` }} />
                <strong>{k}</strong>
                <small>
                  {t.$value.value === 999 ? "Pill" : `${t.$value.value} px`}
                </small>
              </div>
            ))}
          </div>
          <p>小控件 12，卡片 20，面板 28，应用容器 32。</p>
        </div>
      </div>
      <SectionTitle index="04" title="材质与层次" />
      <div className="material-grid">
        <div className="material light">
          <span>01</span>
          <h3>内容白</h3>
          <p>主阅读与对话表面</p>
        </div>
        <div className="material writing">
          <span>02</span>
          <h3>柔和彩色面板</h3>
          <p>帮写工具与输入</p>
        </div>
        <div className="material companion">
          <span>03</span>
          <h3>深色伴随</h3>
          <p>侧栏与持续聆听</p>
          <Orb size={55} />
        </div>
      </div>
      <Code>{`import './tokens.css';\n\n.assistant-card {\n  background: var(--xy-color-surface);\n  color: var(--xy-color-text);\n  border-radius: var(--xy-radius-card);\n  padding: var(--xy-space-24);\n}`}</Code>
    </>
  );
}
const componentItems = [
  [
    "buttons",
    "动作与选择",
    "L09,L15",
    "按钮区分主次动作，胶囊承载上下文建议。",
    "<Button onClick={submit}>发送</Button>\n<Chip active onClick={select}>总结一下</Chip>",
  ],
  [
    "input",
    "输入与对话",
    "L07,L11",
    "输入条与对话内容共享柔和边界；空输入禁止发送。",
    "<AssistantInput onSubmit={handlePrompt} />\n<UserMessage>总结一下这篇文章</UserMessage>",
  ],
  [
    "cards",
    "服务卡片",
    "L01,L05",
    "卡片用布局表达任务，信息保持简洁。内容为虚构样例。",
    '<ServiceCard type="calendar" />\n<ServiceCard type="travel" />',
  ],
  [
    "writing",
    "帮写面板",
    "L09",
    "3+4 工具排布，顶部操作区与底部输入条。",
    "<WritingDemo />",
  ],
  [
    "companion",
    "伴随侧栏",
    "L11,L15,L18",
    "窄栏提供快捷服务；对话展开后给予更多阅读空间。",
    "<CompanionDemo initialExpanded={false} />",
  ],
  [
    "selection",
    "圈选与结果",
    "L12,L13",
    "选区、动作与结果分层，用户可退回选区。",
    "<SelectionDemo />",
  ],
  [
    "navigation",
    "导航条",
    "L07",
    "接收内容的系统级入口；拖拽行为辅以 W03 官方说明。",
    "<NavigationBar onDrop={receive} onClick={open} />",
  ],
];
function Components({ onOpen, controlRequest }) {
  const [category, setCategory] = useState("all"),
    [selected, setSelected] = useState("总结一下"),
    [message, setMessage] = useState(""),
    [sent, setSent] = useState(""),
    [clicked, setClicked] = useState(false);
  useEffect(() => {
    if (controlRequest) setCategory(controlRequest.category);
  }, [controlRequest]);
  return (
    <>
      <PageTitle
        eyebrow="02 / COMPONENTS"
        title="组件库"
        description="卡片、Slider、底部 Chip、Toast 与常用选择控件。可交互、可复用，参数与参考逐项对应。"
      />
      <div className="filter-row">
        {[
          ["all", "全部"],
          ["buttons", "动作"],
          ["input", "输入"],
          ["cards", "卡片"],
          ["sliders", "Slider"],
          ["chips", "底部 Chip"],
          ["feedback", "Toast / 进度"],
          ["choice", "开关 / 选择"],
          ["writing", "帮写"],
          ["companion", "伴随"],
          ["selection", "圈选"],
          ["navigation", "导航条"],
        ].map(([id, label]) => (
          <Chip
            key={id}
            active={category === id}
            onClick={() => setCategory(id)}
          >
            {label}
          </Chip>
        ))}
      </div>
      <ControlCatalog category={category} onOpen={onOpen} />
      <div className="component-stack">
        {componentItems
          .filter((c) => category === "all" || category === c[0])
          .map(([id, title, source, desc, code], index) => (
            <section className="component-section" key={id}>
              <div className="component-spec">
                <span className="eyebrow">COMPONENT / {id.toUpperCase()}</span>
                <h2>{title}</h2>
                <p>{desc}</p>
                <Evidence ids={source} onOpen={onOpen} />
                <Code>{code}</Code>
              </div>
              <div className={`component-preview preview-${id}`}>
                {id === "buttons" ? (
                  <>
                    <div className="inline wrap">
                      <Button
                        icon={clicked ? "Check" : "ArrowUp"}
                        onClick={() => setClicked(!clicked)}
                      >
                        {clicked ? "已完成" : "主要操作"}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setClicked(false)}
                      >
                        次要操作
                      </Button>
                      <Button disabled>不可用</Button>
                    </div>
                    <div className="inline wrap">
                      {["总结一下", "生成脑图", "长文导读"].map((x) => (
                        <Chip
                          key={x}
                          active={selected === x}
                          onClick={() => setSelected(x)}
                        >
                          {x}
                        </Chip>
                      ))}
                    </div>
                    <div className="inline">
                      <IconButton
                        icon="Plus"
                        label="添加"
                        onClick={() => setMessage("已添加一个项目")}
                      />
                      <IconButton
                        icon="X"
                        label="清除"
                        onClick={() => setMessage("已清除")}
                      />
                      <span className="muted" role="status">
                        {message}
                      </span>
                    </div>
                  </>
                ) : id === "input" ? (
                  <div className="input-specimen">
                    <UserMessage>总结一下这篇文章</UserMessage>
                    <AssistantMessage>
                      阅读的价值，在于把信息变成自己的理解。
                    </AssistantMessage>
                    {sent && <UserMessage>{sent}</UserMessage>}
                    <AssistantInput onSubmit={setSent} />
                  </div>
                ) : id === "cards" ? (
                  <div className="card-specimen">
                    <ServiceCard />
                    <ServiceCard type="travel" />
                  </div>
                ) : id === "writing" ? (
                  <WritingDemo />
                ) : id === "companion" ? (
                  <CompanionDemo />
                ) : id === "selection" ? (
                  <SelectionDemo />
                ) : (
                  <DragDemo />
                )}
              </div>
            </section>
          ))}
      </div>
      <div className="notice">
        图标已统一使用本项目的 77 枚自绘
        SVG，可在图标库中检索和下载。错误、完成反馈与键盘交互属于复刻的可用性补充。
      </div>
    </>
  );
}
const Motion = MotionLab;
const patternList = [
  [
    "vision",
    "小艺看世界",
    "L06",
    "全幅取景中的实时视觉对话。字幕与翻转摄像头位于顶部，静音、摄像头和挂断位于底部。",
    "依据 W18 官方界面图重建；取景照片为参考裁切，字幕是固定示例。可切换字幕、前后摄像头、静音和通话状态，不请求设备权限。",
  ],
  [
    "companion",
    "伴随阅读",
    "L11,L14,L15,L16,L17,L18",
    "内容在左，帮助在右。窄栏提供快捷动作，结果展开为对话。关闭后恢复完整阅读空间。",
    "点击总结或识屏；也可按住光球（鼠标、触屏或 Space）开始聆听，松开后呈现固定示例结果。",
  ],
  [
    "writing",
    "上下文帮写",
    "L09",
    "保留原文可见，选择写作任务，审阅后替换原文。面板可随时关闭。",
    "选择工具生成固定示例；选择替换原文后可在笔记中看到结果。返回箭头重置笔记。",
  ],
  [
    "conversation",
    "全屏对话",
    "L06,L07,L08",
    "连续对话承载文本和结构化服务卡片。实时对话入口切换到光球或视觉模式。",
    "输入任意文字可触发本地规则回复；实时对话和摄像头仅切换视觉状态，不录音、不取景。",
  ],
  [
    "selection",
    "圈选问答",
    "L12,L13",
    "圈定对象，再选择问答或识图。保留选区、结果和退出三层状态。",
    "点击或拖过插画，展示固定示例选区；这是界面状态复刻，不具备实际分割识别能力。",
  ],
  [
    "drag",
    "拖给小艺",
    "L07",
    "让内容进入输入框或导航条，保留内容来源，再提供进一步服务。",
    "将文档拖向底部导航条；触屏及键盘可用「发送给小艺」。行为另参考 W03，结果为固定示例。",
  ],
];
function Patterns({ onOpen }) {
  const [current, setCurrent] = useState("companion"),
    [key, setKey] = useState(0);
  const [id, title, source, desc, instruction] = patternList.find(
    (p) => p[0] === current,
  );
  return (
    <>
      <PageTitle
        eyebrow="05 / INTERACTION PATTERNS"
        title="交互范式"
        description="从组件到完整场景，体验小艺如何进入任务、承接意图与交还控制。"
      />
      <div className="pattern-tabs">
        {patternList.map(([id, t]) => (
          <button
            key={id}
            className={current === id ? "active" : ""}
            onClick={() => setCurrent(id)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="pattern-description">
        <div>
          <h2>{title}</h2>
          <p>{desc}</p>
        </div>
        <Button
          variant="secondary"
          icon="RefreshCw"
          onClick={() => setKey(key + 1)}
        >
          重置
        </Button>
      </div>
      <div className={`pattern-canvas canvas-${id}`} key={`${id}-${key}`}>
        {id === "vision" ? (
          <VisionDemo />
        ) : id === "companion" ? (
          <CompanionDemo />
        ) : id === "writing" ? (
          <WritingDemo />
        ) : id === "conversation" ? (
          <ConversationDemo />
        ) : id === "selection" ? (
          <SelectionDemo />
        ) : (
          <DragDemo />
        )}
      </div>
      {id === "vision" && <VisionReference />}
      <div className="pattern-foot">
        <Evidence ids={source} onOpen={onOpen} />
        <span className="badge estimate">本地模拟</span>
      </div>
      <details className="demo-notes" open>
        <summary>演示与还原说明</summary>
        <p>{instruction}</p>
        <p>产品画面使用虚构内容。保留参考的布局关系，未连接真实小艺服务。</p>
      </details>
      <SectionTitle index="01" title="状态路径" />
      <div className="state-flow">
        {(id === "vision"
          ? ["进入看世界", "开启摄像头", "查看字幕", "切换取景", "挂断返回"]
          : id === "companion"
            ? [
                "窄栏待机",
                "聆听 / 快捷指令",
                "理解内容",
                "展开结果",
                "收起 / 退出",
              ]
            : id === "writing"
              ? ["原文", "选择类型", "生成中", "审阅结果", "替换原文"]
              : id === "selection"
                ? ["浏览内容", "圈定对象", "选择动作", "查看结果", "返回选区"]
                : id === "drag"
                  ? ["选择内容", "拖入导航条", "接收内容", "提供服务"]
                  : ["开始对话", "提交输入", "思考中", "回复结果", "继续提问"]
        ).map((x, i) => (
          <React.Fragment key={x}>
            {i > 0 && <Icon name="ChevronRight" size={16} />}
            <span>
              <small>0{i + 1}</small>
              {x}
            </span>
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
function References({ onOpen }) {
  const [filter, setFilter] = useState("all"),
    [query, setQuery] = useState("");
  const items = manifest.items.filter(
    (r) =>
      (filter === "all" || r.kind === filter || r.evidence === filter) &&
      (
        r.title +
        english(r.title) +
        r.filename +
        r.category +
        english(r.category) +
        r.id
      )
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <PageTitle
        eyebrow="06 / REFERENCE LIBRARY"
        title="参考与证据"
        description="18 份本地素材，逐项归档。看得到来源，也看得到还原的边界。"
      >
        <a
          className="xy-button secondary"
          href="/downloads/manifest.json"
          download
        >
          <Icon name="ArrowDown" size={17} />
          下载清单
        </a>
      </PageTitle>
      <div className="reference-toolbar">
        <div className="filter-row">
          {[
            ["all", "全部"],
            ["capture", "实机截图"],
            ["video", "录屏 / 动效"],
            ["marketing", "宣传 / 外部图"],
          ].map(([id, label]) => (
            <Chip key={id} active={filter === id} onClick={() => setFilter(id)}>
              {label}
            </Chip>
          ))}
        </div>
        <label className="small-search">
          <Icon name="Search" size={17} />
          <input
            aria-label="搜索参考"
            placeholder="标题、设备或编号"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <div className="reference-grid">
        {items.map((r) => (
          <button
            className="reference-card"
            key={r.id}
            onClick={() => onOpen(r)}
          >
            <div className="reference-image">
              <img src={r.preview} alt={r.title} loading="lazy" />
              <span>
                {r.kind === "video" ? `${r.duration.toFixed(1)}s` : r.id}
              </span>
            </div>
            <div className="reference-card-copy">
              <small>
                {r.id} / {r.category}
              </small>
              <h3>{r.title}</h3>
              <p>
                {r.width} × {r.height}
                {r.duplicateOf ? " · 重复来源" : ""}
              </p>
            </div>
            <Icon name="ArrowUp" size={17} />
          </button>
        ))}
      </div>
      {!items.length && (
        <div className="empty-state">
          没有匹配的参考。
          <button
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
          >
            清除筛选
          </button>
        </div>
      )}
      <SectionTitle
        index="02"
        title="网络补充来源"
        note="官方资料用于校核语义与版本，视频平台条目保留为补充线索。"
      />
      <div className="source-list">
        {webSources.map((s) => (
          <article key={s.id}>
            <span className="source-id">{s.id}</span>
            <div>
              <div className="inline">
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.title} ↗
                </a>
                <span
                  className={`badge ${s.type === "official" ? "observed" : "estimate"}`}
                >
                  {s.type === "official" ? "官方资料" : "视频线索"}
                </span>
              </div>
              <p>{s.note}</p>
              <small>{s.scope}</small>
              {s.preview && (
                <details className="control-reference">
                  <summary>查看官方示例图</summary>
                  <a href={s.url} target="_blank" rel="noreferrer">
                    <img
                      src={s.preview}
                      alt={s.title + " 原文示例"}
                      loading="lazy"
                    />
                  </a>
                </details>
              )}
            </div>
          </article>
        ))}
      </div>
      <div className="notice">
        本地媒体的系统与小艺版本没有完整元数据，均记为
        unknown。宣传图不证明设备实机行为；未观看的视频不作为视觉证据。
      </div>
    </>
  );
}
function Handoff() {
  return (
    <>
      <PageTitle
        eyebrow="07 / GETTING STARTED"
        title="使用与交付"
        description="从设计审阅到原型实现，带着来源复用这套系统。"
      />
      <div className="handoff-intro">
        <Orb size={100} />
        <div>
          <h2>Xiaoyi Design System</h2>
          <p>React 组件 · CSS 变量 · JSON Tokens · 可交互样例</p>
          <a
            href="https://github.com/purryc/xiaoyi-design-system"
            target="_blank"
            rel="noreferrer"
          >
            在 GitHub 查看源码 ↗
          </a>
        </div>
      </div>
      <SectionTitle index="01" title="快速开始" />
      <div className="two-cols">
        <div className="spec-surface">
          <h3>本地运行</h3>
          <pre>
            <code>npm ci{"\n"}npm run dev</code>
          </pre>
          <p>默认端口 5197。构建产物为静态站点，可按项目需要托管。</p>
        </div>
        <div className="spec-surface">
          <h3>复用组件</h3>
          <pre>
            <code>{`import { Orb, Chip } from './src/components';\nimport './src/tokens.css';\nimport './src/styles.css';\n\n<Orb state="listening" size={96} />`}</code>
          </pre>
        </div>
      </div>
      <SectionTitle index="02" title="设计资源" />
      <div className="download-list">
        {[
          [
            "xiaoyi.tokens.json",
            "设计变量 JSON",
            "颜色、间距、圆角、字号与动效参数",
          ],
          ["tokens.css", "CSS 自定义属性", "与 JSON 同源生成"],
          [
            "manifest.json",
            "本地参考清单",
            "尺寸、时长、SHA-256、来源与观察记录",
          ],
          ["web-sources.json", "网络资料索引", "来源链接、版本范围与证据边界"],
        ].map(([file, title, desc]) => (
          <a key={file} href={`/downloads/${file}`} download>
            <Icon name="FileText" />
            <div>
              <strong>{title}</strong>
              <span>{desc}</span>
            </div>
            <Icon name="ArrowDown" />
          </a>
        ))}
      </div>
      <SectionTitle index="03" title="边界与使用约定" />
      <div className="boundary-list">
        <div>
          <span className="badge observed">观察</span>
          <p>
            结构、工具顺序和关键视觉状态以本地参考为依据。视频只对已抽取并审阅的时点提供证据。
          </p>
        </div>
        <div>
          <span className="badge estimate">估值</span>
          <p>
            色值、间距、圆角、动效时长和缩放比例均为工程估值。图标是参考重绘与同风格扩展，字体回退效果与真机可能不同。
          </p>
        </div>
        <div>
          <span className="badge estimate">推断</span>
          <p>
            思考与回应的光球语义、错误状态、响应式小屏布局和交互模拟为复刻补充。没有连接小艺
            API。
          </p>
        </div>
        <div>
          <span className="badge neutral">归属</span>
          <p>
            小艺与 HarmonyOS
            品牌及参考素材归各自权利人。本仓库是独立研究复刻，不代表华为官方；原始视频留在本地参考目录。
          </p>
        </div>
      </div>
    </>
  );
}
function ReferenceDialog({ item, onClose }) {
  const ref = useRef();
  const [frame, setFrame] = useState(null);
  useEffect(() => {
    setFrame(null);
    if (item) ref.current?.showModal();
    else ref.current?.close();
  }, [item]);
  return (
    <dialog
      ref={ref}
      className="reference-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {item && (
        <>
          <header>
            <div>
              <small>
                {item.id} / {item.category}
              </small>
              <h2>{item.title}</h2>
            </div>
            <IconButton icon="X" label="关闭参考" onClick={onClose} />
          </header>
          <div className="dialog-image">
            <img src={frame?.preview || item.preview} alt={item.title} />
          </div>
          {item.frames && (
            <div className="frame-strip">
              {item.frames.map((f) => (
                <button
                  key={f.time}
                  className={frame?.time === f.time ? "selected" : ""}
                  onClick={() => setFrame(f)}
                >
                  <img src={f.preview} alt={`${f.time}秒`} />
                  <span>{f.time}s</span>
                </button>
              ))}
            </div>
          )}
          <p>{item.observation}</p>
          <dl>
            <dt>尺寸</dt>
            <dd>
              {item.width} × {item.height}
            </dd>
            <dt>系统版本</dt>
            <dd>unknown · 未确认</dd>
            <dt>文件</dt>
            <dd>{item.filename}</dd>
            <dt>SHA-256</dt>
            <dd>{item.sha256}</dd>
            {item.duplicateOf && (
              <>
                <dt>重复来源</dt>
                <dd>{item.duplicateOf}</dd>
              </>
            )}
          </dl>
          <a
            href={frame?.preview || item.preview}
            target="_blank"
            rel="noreferrer"
          >
            打开预览图 ↗
          </a>
        </>
      )}
    </dialog>
  );
}
function App() {
  const pageFromHash = () =>
    nav.some((n) => n[0] === location.hash.slice(1))
      ? location.hash.slice(1)
      : "overview";
  const [page, setPage] = useState(pageFromHash),
    [menu, setMenu] = useState(false),
    [search, setSearch] = useState(""),
    [reference, setReference] = useState(null),
    [controlRequest, setControlRequest] = useState(null);
  useEffect(() => {
    const fn = () => {
      setPage(pageFromHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);
  function go(id) {
    location.hash = id;
    setPage(id);
    setMenu(false);
    setSearch("");
    window.scrollTo(0, 0);
  }
  const results = search.trim()
    ? nav
        .filter((x) => x.join(" ").toLowerCase().includes(search.toLowerCase()))
        .map((x) => ({ type: "page", id: x[0], title: x[1] }))
        .concat(
          controlItems
            .filter((item) =>
              (item.title + english(item.title) + item.subtitle + item.id)
                .toLowerCase()
                .includes(search.toLowerCase()),
            )
            .map((item) => ({
              type: "control",
              id: item.id,
              title: item.title,
              category: item.category,
            })),
        )
        .concat(
          manifest.items
            .filter((x) =>
              (
                x.title +
                english(x.title) +
                x.category +
                english(x.category) +
                x.id
              )
                .toLowerCase()
                .includes(search.toLowerCase()),
            )
            .map((x) => ({ type: "reference", id: x.id, title: x.title })),
        )
    : [];
  const common = { go, onOpen: setReference, controlRequest };
  return (
    <>
      <a className="skip-link" href="#main-content">
        跳到内容
      </a>
      <aside className={`sidebar ${menu ? "open" : ""}`}>
        <button className="brand" onClick={() => go("overview")}>
          <span className="brand-symbol">
            <Orb size={32} paused />
          </span>
          <span>
            小艺<small>Design System</small>
          </span>
        </button>
        <div className="sidebar-label">设计语言 / DESIGN LANGUAGE</div>
        <nav>
          {nav.map(([id, title, en, icon]) => (
            <a
              key={id}
              href={`#${id}`}
              className={page === id ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                go(id);
              }}
              aria-current={page === id ? "page" : undefined}
            >
              <Icon name={icon} size={18} />
              <span>{title}</span>
              {page === id && <i />}
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div>
            <span className="status-dot" />
            Research edition
          </div>
          <p>参考驱动 · 持续还原</p>
          <a
            href="https://github.com/purryc/xiaoyi-design-system"
            target="_blank"
            rel="noreferrer"
          >
            GitHub 仓库 <span>↗</span>
          </a>
        </div>
      </aside>
      {menu && (
        <button
          className="menu-backdrop"
          aria-label="关闭导航"
          onClick={() => setMenu(false)}
        />
      )}
      <div className="app-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-menu"
              aria-label="打开导航"
              onClick={() => setMenu(!menu)}
            >
              <Icon name="Grip" />
            </button>
            <span>小艺设计系统</span>
            <Icon name="ChevronRight" size={13} />
            <strong>{nav.find((n) => n[0] === page)[1]}</strong>
          </div>
          <div className="topbar-actions">
            <LanguageSwitch />
            <div className="global-search">
              <Icon name="Search" size={16} />
              <input
                aria-label="搜索设计系统"
                placeholder="搜索组件与参考"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearch("");
                }}
              />
              {search && (
                <button aria-label="清除搜索" onClick={() => setSearch("")}>
                  <Icon name="X" size={15} />
                </button>
              )}
              {search && (
                <div className="search-results">
                  {results.length ? (
                    results.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          if (r.type === "page") go(r.id);
                          else if (r.type === "control") {
                            go("components");
                            setControlRequest({ category: r.category });
                          } else {
                            setReference(sourceById[r.id]);
                            setSearch("");
                          }
                        }}
                      >
                        <span>{r.title}</span>
                        <small>
                          {r.type === "page"
                            ? "页面"
                            : r.type === "control"
                              ? "控件"
                              : r.id}
                        </small>
                      </button>
                    ))
                  ) : (
                    <p>未找到相关内容</p>
                  )}
                </div>
              )}
            </div>
            <span className="top-version">v2.2</span>
          </div>
        </header>
        <main id="main-content" key={page}>
          {page === "overview" ? (
            <Overview {...common} />
          ) : page === "foundations" ? (
            <Foundations {...common} />
          ) : page === "components" ? (
            <Components {...common} />
          ) : page === "motion" ? (
            <Motion {...common} />
          ) : page === "icons" ? (
            <IconLibrary />
          ) : page === "patterns" ? (
            <Patterns {...common} />
          ) : page === "reference" ? (
            <References {...common} />
          ) : (
            <Handoff />
          )}
          <footer>
            <span>XIAOYI DESIGN SYSTEM</span>
            <span>Independent reconstruction · 2026</span>
            <button onClick={() => go("reference")}>查看证据与来源 ↗</button>
          </footer>
        </main>
      </div>
      <ReferenceDialog item={reference} onClose={() => setReference(null)} />
    </>
  );
}
createRoot(document.getElementById("root")).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>,
);
