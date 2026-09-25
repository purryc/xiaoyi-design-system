import { CompanionEdgeGlow } from "./motion/CompanionEdgeGlow";
import { useLanguage, english } from "./i18n/runtime";
import { VisionDemo } from "./vision/VisionDemo";
import React, { useState, useEffect, useRef } from "react";
import { Icon, icons } from "./icons/Icon";
import { TslOrb } from "./motion/TslOrb";
export { Icon, icons };
export function IconButton({ icon, label, className = "", ...props }) {
  return (
    <button
      className={`xy-icon-button ${className}`}
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon name={icon} />
    </button>
  );
}
export function Button({ children, variant = "primary", icon, ...props }) {
  return (
    <button className={`xy-button ${variant}`} {...props}>
      {icon && <Icon name={icon} size={17} />}
      <span>{children}</span>
    </button>
  );
}
export function Chip({ children, active = false, icon, ...props }) {
  return (
    <button className={`xy-chip ${active ? "selected" : ""}`} {...props}>
      {icon && <Icon name={icon} size={15} />}
      <span>{children}</span>
    </button>
  );
}
export const Orb = TslOrb;
export function AssistantInput({
  onSubmit,
  placeholder = "有什么可以帮你？",
  disabled = false,
  compact = false,
}) {
  const [value, setValue] = useState("");
  function submit(e) {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      setValue("");
    }
  }
  return (
    <form className={`xy-input ${compact ? "compact" : ""}`} onSubmit={submit}>
      <Icon name="Keyboard" size={19} />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
      />
      <IconButton
        icon="ArrowUp"
        label="发送"
        type="submit"
        disabled={disabled || !value.trim()}
      />
    </form>
  );
}
export function UserMessage({ children, literal = false }) {
  return (
    <div className="xy-user-message" translate={literal ? "no" : undefined}>
      {children}
    </div>
  );
}
export function AssistantMessage({ children }) {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);
  return (
    <div className="xy-assistant-message">
      <div>{children}</div>
      <div className="message-actions">
        <IconButton
          icon={copied ? "Check" : "Copy"}
          label={copied ? "已复制" : "复制回复"}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(
                typeof children === "string"
                  ? language === "en"
                    ? english(children)
                    : children
                  : "阅读的价值，在于把信息变成自己的理解。",
              );
              setCopied(true);
            } catch {
              setCopied(false);
            }
          }}
        />
      </div>
    </div>
  );
}
export function ServiceCard({ type = "calendar" }) {
  return (
    <div className={`xy-service-card ${type}`}>
      {type === "calendar" ? (
        <>
          <div className="service-icon">
            <Icon name="Calendar" size={24} />
          </div>
          <div>
            <small>日程提醒</small>
            <strong>设计讨论会</strong>
            <span>明天 10:00—11:00</span>
          </div>
          <span className="date-number">26</span>
        </>
      ) : (
        <>
          <div className="service-icon">
            <Icon name="MapPin" size={24} />
          </div>
          <div>
            <small>出行建议</small>
            <strong>周末，一起去看展</strong>
            <span>城市美术馆 · 约 20 分钟</span>
          </div>
          <Icon name="ChevronRight" />
        </>
      )}
    </div>
  );
}
export const writingTools = [
  ["summarize", "摘要"],
  ["proofread", "校正文本"],
  ["rewrite", "润色改写"],
  ["tone", "语气改写"],
  ["expand-text", "扩写"],
  ["paragraph", "分段小结"],
  ["meeting", "会议排版"],
];
export function WritingSheet({ onClose, onApply }) {
  const [selected, setSelected] = useState(null),
    [result, setResult] = useState(""),
    [busy, setBusy] = useState(false),
    [more, setMore] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  function generate(tool) {
    clearTimeout(timer.current);
    setSelected(tool);
    setBusy(true);
    setResult("");
    timer.current = setTimeout(() => {
      setResult(
        tool === "摘要"
          ? "人工智能正在改变我们理解与处理信息的方式。交互设计需要在效率、上下文与用户控制之间取得平衡。"
          : `已按「${tool}」整理：\n人工智能让信息处理更加高效。好的交互始终尊重用户的意图，在需要的时候出现，让每一次表达自然流畅。`,
      );
      setBusy(false);
    }, 950);
  }
  return (
    <section className="xy-writing-sheet" aria-label="小艺帮写">
      <div className="sheet-handle" />
      <header>
        <h3>小艺帮写</h3>
        <div className="inline">
          <IconButton
            icon="Grip"
            label="更多写作选项"
            onClick={() => setMore(!more)}
            aria-expanded={more}
          />
          <IconButton icon="X" label="关闭帮写" onClick={onClose} />
        </div>
      </header>
      {more && (
        <div className="writing-options">
          <Chip onClick={() => generate("正式语气")}>正式</Chip>
          <Chip onClick={() => generate("轻松语气")}>轻松</Chip>
          <Chip onClick={() => generate("简洁语气")}>简洁</Chip>
        </div>
      )}
      {!selected ? (
        <>
          <small className="muted">类型</small>
          <div className="writing-tools">
            {writingTools.map(([icon, label], i) => (
              <button
                className={i < 3 ? "large-tool" : ""}
                key={label}
                onClick={() => generate(label)}
              >
                <Icon name={icon} size={24} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="writing-result" aria-live="polite">
          <div className="inline between">
            <strong>{selected}</strong>
            <button
              className="text-button"
              onClick={() => {
                clearTimeout(timer.current);
                setBusy(false);
                setSelected(null);
              }}
            >
              返回类型
            </button>
          </div>
          {busy ? (
            <div className="busy-row">
              <Orb state="thinking" size={36} />
              <span>正在生成…</span>
            </div>
          ) : (
            <>
              <p>{result}</p>
              <div className="inline">
                <Button
                  variant="secondary"
                  icon="RefreshCw"
                  onClick={() => generate(selected)}
                >
                  重新生成
                </Button>
                <Button
                  onClick={() => {
                    onApply(result);
                    onClose();
                  }}
                >
                  替换原文
                </Button>
              </div>
            </>
          )}
        </div>
      )}
      <AssistantInput
        placeholder="输入笔记要求"
        onSubmit={generate}
        disabled={busy}
      />
    </section>
  );
}
const originalNote =
  "人工智能技术正在经历一个非常快速的发展阶段。\n过去几年，大语言模型在文本生成、知识问答、代码编写，以及内容理解方面不断取得进展。\n内容理解需要结合语境、意图及潜在需求构建多维认知框架。跨模态融合也是提升理解深度的关键。\n通过扩展内容理解能力，实现从“识别”到“洞察”的跃迁。";
export function WritingDemo() {
  const [open, setOpen] = useState(true),
    [note, setNote] = useState(originalNote),
    [saved, setSaved] = useState(false);
  return (
    <div className="phone writing-phone">
      <div className="phone-header">
        <IconButton
          icon="ArrowLeft"
          label="重置笔记"
          onClick={() => {
            setNote(originalNote);
            setOpen(true);
            setSaved(false);
          }}
        />
        <div className="inline">
          <IconButton
            icon="PenLine"
            label="打开帮写"
            onClick={() => setOpen(true)}
          />
          <IconButton
            icon={saved ? "Check" : "MoreHorizontal"}
            label="保存笔记"
            onClick={() => setSaved(true)}
          />
        </div>
      </div>
      <div className="note-content">
        <h3>AI 技术讲演</h3>
        <div className="note-meta">
          <span>默认⌄</span> 今天 00:28
        </div>
        <p>{note}</p>
      </div>
      {!open && (
        <button className="open-writing" onClick={() => setOpen(true)}>
          <Icon name="Sparkles" size={18} />
          小艺帮写
        </button>
      )}
      {open && (
        <WritingSheet onClose={() => setOpen(false)} onApply={setNote} />
      )}
      <div className="home-indicator" />
    </div>
  );
}
export function Article({ selected = false, onSelect }) {
  return (
    <article className="xy-article">
      <div className="article-top">
        <Icon name="ArrowLeft" size={18} />
        <div className="inline">
          <Icon name="Headphones" size={17} />
          <Icon name="Search" size={17} />
          <Icon name="Grip" size={17} />
        </div>
      </div>
      <h3>阅读，让思考更进一步</h3>
      <div className="article-author">
        <span className="author-mark">读</span>
        <div>
          读者<small>2026/09/25 · 阅读与生活</small>
        </div>
        <button
          className="follow-button"
          onClick={(e) =>
            (e.currentTarget.textContent =
              e.currentTarget.textContent === "+" ? "已关注" : "+")
          }
          aria-label="关注读者"
        >
          +
        </button>
      </div>
      <div className="podcast">
        <Icon name="AudioLines" size={15} /> AI 播客 · 阅读笔记
      </div>
      <p className="article-index">01</p>
      <p className="article-intro">把信息，变成自己的理解</p>
      <p>
        在信息随时可得的时代，阅读的价值，逐渐从获取知识转向建立自己的理解。
      </p>
      <p className={selected ? "selected-text" : ""} onMouseUp={onSelect}>
        好的工具让我们更专注于内容。需要的时候，随时提问；思考的时候，保留属于自己的空间。
      </p>
      <p>
        从一篇文章开始，发现问题之间的联系。停下来，回顾那些值得记住的片段。
      </p>
      <p className="article-extra">
        让技术成为自然的陪伴，让每一次阅读，都成为新的发现。真正留下来的，是我们对世界的理解。
      </p>
      <div className="article-bottom">
        <span>
          <Icon name="MessageCircle" size={16} /> 2
        </span>
        <span>
          <Icon name="Star" size={17} /> 104
        </span>
        <span>
          <Icon name="Heart" size={17} /> 361
        </span>
        <span>
          <Icon name="Share2" size={17} /> 分享
        </span>
      </div>
    </article>
  );
}
export function CompanionDemo({ initialExpanded = false }) {
  const [mode, setMode] = useState("idle"),
    [expanded, setExpanded] = useState(initialExpanded),
    [active, setActive] = useState(true),
    [request, setRequest] = useState(""),
    [answer, setAnswer] = useState(""),
    [muted, setMuted] = useState(false);
  const timer = useRef(),
    modeRef = useRef(mode);
  modeRef.current = mode;
  useEffect(() => () => clearTimeout(timer.current), []);
  function ask(text) {
    clearTimeout(timer.current);
    setRequest(text);
    setAnswer("");
    setMode("thinking");
    setExpanded(true);
    timer.current = setTimeout(() => {
      setAnswer(
        text === "收藏"
          ? "已收藏这篇阅读笔记。"
          : text === "生成脑图"
            ? "阅读的价值\n├ 获取信息 → 找到值得读的内容\n├ 理解内容 → 连接已有知识\n└ 留下思考 → 回顾与整理"
            : "这篇文章讨论了阅读与思考的关系。\n\n1. 从获取信息，走向主动理解。\n2. 工具应尊重阅读节奏，按需出现。\n3. 通过回顾与提问，建立知识之间的联系。",
      );
      setMode("speaking");
    }, 1200);
  }
  function endListen() {
    if (modeRef.current === "listening") ask("总结一下这篇文章");
  }
  function close() {
    clearTimeout(timer.current);
    setActive(false);
    setMode("idle");
    setAnswer("");
    setRequest("");
  }
  return (
    <div
      className={`tablet companion-demo ${expanded ? "expanded" : ""} ${active ? "active" : "inactive"}`}
    >
      <div className="companion-app">
        <Article />
        <CompanionEdgeGlow active={active} />
      </div>
      {active ? (
        <aside className="companion-rail" aria-label="伴随助手">
          <div className="rail-top">
            {expanded && <strong>小艺伴随</strong>}
            <div className="inline">
              {expanded && (
                <IconButton
                  icon={muted ? "VolumeX" : "Volume2"}
                  label={muted ? "取消静音" : "静音"}
                  onClick={() => setMuted(!muted)}
                />
              )}
              <IconButton icon="X" label="退出伴随" onClick={close} />
            </div>
          </div>
          <div className="rail-body">
            {expanded && request ? (
              <>
                <UserMessage>{request}</UserMessage>
                <div className="rail-answer" aria-live="polite">
                  {mode === "thinking" ? (
                    <>
                      <span className="thinking-dot" /> 正在理解…
                    </>
                  ) : (
                    answer
                  )}
                </div>
              </>
            ) : (
              <p className="rail-hint">让阅读中的每个疑问，都有回应。</p>
            )}
          </div>
          {!expanded && (
            <div className="rail-suggestions">
              {["总结一下", "生成脑图", "长文导读", "收藏"].map((x) => (
                <Chip key={x} onClick={() => ask(x)}>
                  {x}
                </Chip>
              ))}
            </div>
          )}
          <Chip icon="Eye" onClick={() => ask("分析屏幕内容")}>
            识别屏幕
          </Chip>
          <div className="rail-input">
            <span className="rail-status" aria-live="polite">
              {
                {
                  idle: "",
                  listening: "正在聆听…",
                  thinking: "正在思考…",
                  speaking: "",
                  error: "请再试一次",
                }[mode]
              }
            </span>
            <button
              className="orb-button"
              aria-label="按住说话"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                clearTimeout(timer.current);
                setMode("listening");
              }}
              onPointerUp={endListen}
              onPointerCancel={() => setMode("idle")}
              onKeyDown={(e) => {
                if ((e.key === " " || e.key === "Enter") && !e.repeat) {
                  e.preventDefault();
                  clearTimeout(timer.current);
                  setMode("listening");
                }
              }}
              onKeyUp={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  endListen();
                }
              }}
            >
              {expanded ? (
                <span className="talk-bar">
                  <Icon name="Keyboard" size={17} />
                  {mode === "listening" ? "正在聆听…" : "按住说话"}
                  <Orb state={mode} size={26} />
                </span>
              ) : (
                <Orb state={mode} size={47} />
              )}
            </button>
          </div>
          {expanded && (
            <button
              className="rail-collapse"
              onClick={() => {
                clearTimeout(timer.current);
                setExpanded(false);
                setMode("idle");
              }}
            >
              收起
            </button>
          )}
        </aside>
      ) : (
        <button
          className="companion-reopen"
          aria-label="小艺伴随"
          onClick={() => {
            setActive(true);
            setExpanded(false);
          }}
        >
          <Orb size={26} />
          小艺伴随
        </button>
      )}
    </div>
  );
}
export function ConversationDemo() {
  const [messages, setMessages] = useState([]),
    [busy, setBusy] = useState(false),
    [call, setCall] = useState(false),
    [camera, setCamera] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  function ask(text) {
    setMessages((m) => [...m, { role: "user", text }]);
    setBusy(true);
    timer.current = setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: text.includes("日程")
            ? "已整理明天的日程。设计讨论会安排在上午 10:00。"
            : `关于“${text}”，可以先明确目标，再把任务拆成几个可执行的步骤。也可以把相关内容交给我，一起梳理。`,
        },
      ]);
      setBusy(false);
    }, 900);
  }
  return (
    <div className={`phone conversation-phone ${call ? "call-mode" : ""}`}>
      <div className="phone-header">
        <strong>小艺</strong>
        <div className="inline">
          <IconButton
            icon="RefreshCw"
            label="新建对话"
            onClick={() => {
              clearTimeout(timer.current);
              setMessages([]);
              setBusy(false);
            }}
          />
          <IconButton
            icon={call ? "X" : "Headphones"}
            label={call ? "结束通话" : "实时对话"}
            onClick={() => setCall(!call)}
          />
        </div>
      </div>
      {call ? (
        <div className={`call-stage ${camera ? "camera-on" : ""}`}>
          {camera ? (
            <VisionDemo
              embedded
              onHangup={() => {
                setCall(false);
                setCamera(false);
              }}
            />
          ) : (
            <Orb size={145} state="listening" />
          )}
          {!camera && (
            <div className="call-actions">
              <IconButton
                icon="Mic"
                label="开始语音示例"
                onClick={() => setCamera(false)}
              />
              <IconButton
                icon="Camera"
                label={camera ? "关闭摄像头示例" : "打开摄像头示例"}
                onClick={() => setCamera(!camera)}
              />
              <IconButton
                icon="X"
                label="挂断"
                onClick={() => setCall(false)}
              />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="conversation-scroll">
            {messages.length === 0 ? (
              <div className="conversation-welcome">
                <Orb size={65} />
                <h3>你好，我是小艺</h3>
                <p>生活中的大小事，随时问我。</p>
                <ServiceCard />
                <Chip onClick={() => ask("帮我整理明天的日程")}>
                  帮我整理明天的日程
                </Chip>
              </div>
            ) : (
              messages.map((m, i) =>
                m.role === "user" ? (
                  <UserMessage key={i} literal>
                    {m.text}
                  </UserMessage>
                ) : (
                  <AssistantMessage key={i}>{m.text}</AssistantMessage>
                ),
              )
            )}
            {busy && (
              <div className="busy-row" role="status">
                <Orb state="thinking" size={32} />
                正在思考…
              </div>
            )}
          </div>
          <AssistantInput onSubmit={ask} disabled={busy} />
        </>
      )}
      <div className="home-indicator" />
    </div>
  );
}
export function Landscape() {
  return (
    <svg
      className="landscape"
      viewBox="0 0 600 360"
      role="img"
      aria-label="山间湖泊插画"
    >
      <defs>
        <linearGradient id="sky" x2="0" y2="1">
          <stop stopColor="#c2e2ed" />
          <stop offset="1" stopColor="#edf0d9" />
        </linearGradient>
        <linearGradient id="lake" x2="0" y2="1">
          <stop stopColor="#8fbcc3" />
          <stop offset="1" stopColor="#cedfd5" />
        </linearGradient>
      </defs>
      <path fill="url(#sky)" d="M0 0h600v360H0z" />
      <circle cx="455" cy="75" r="30" fill="#fff6db" />
      <path d="M0 220L128 66l133 154L412 80l188 158v122H0" fill="#9cbbc1" />
      <path d="M0 260l155-132 105 110L432 148l168 86v126H0" fill="#698f96" />
      <path d="M0 248Q145 232 300 253T600 245v115H0" fill="url(#lake)" />
      <path d="M0 296l142-32 95 96H0" fill="#426c62" />
      <path d="M600 292l-85-30-140 98h225" fill="#45665d" />
      <path d="M325 220v83h-6v-83" fill="#384f45" />
      <path
        d="M322 157l-26 70h52zM322 184l-35 69h70zM322 215l-43 65h86z"
        fill="#315c50"
      />
    </svg>
  );
}
export function SelectionDemo() {
  const [selected, setSelected] = useState(false),
    [result, setResult] = useState(false),
    [action, setAction] = useState(""),
    [dragging, setDragging] = useState(false);
  return (
    <div className={`selection-demo ${selected ? "is-selected" : ""}`}>
      <div className="selection-top">
        <strong>山间的一次散步</strong>
        {selected && (
          <IconButton
            icon="X"
            label="退出圈选"
            onClick={() => {
              setSelected(false);
              setResult(false);
              setAction("");
            }}
          />
        )}
      </div>
      <button
        className="selection-image"
        aria-label="圈选图片"
        onPointerDown={() => setDragging(true)}
        onPointerUp={() => {
          setDragging(false);
          setSelected(true);
        }}
        onPointerCancel={() => setDragging(false)}
        onClick={() => setSelected(true)}
      >
        <Landscape />
        {(selected || dragging) && (
          <svg
            className="selection-outline"
            viewBox="0 0 600 360"
            aria-hidden="true"
          >
            <ellipse cx="322" cy="220" rx="72" ry="100" />
          </svg>
        )}
      </button>
      {selected && (
        <>
          <div className="selection-menu">
            <button
              onClick={() => {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(
                  new Blob(
                    [
                      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 180"><rect width="120" height="180" fill="#c9e0e1"/><path d="M60 15L20 100h80zM60 50L10 140h100z" fill="#315c50"/><path d="M57 125h6v40h-6z" fill="#384f45"/></svg>',
                    ],
                    { type: "image/svg+xml" },
                  ),
                );
                a.download = "xiaoyi-selection-example.svg";
                a.click();
                setTimeout(() => URL.revokeObjectURL(a.href), 1000);
                setAction("已导出示例选区");
              }}
            >
              保存
            </button>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    "示例选区：山间湖泊中的针叶树",
                  );
                  setAction("已复制选区说明");
                } catch {
                  setAction("复制失败，请重试");
                }
              }}
            >
              复制
            </button>
            <button
              onClick={() => {
                setSelected(false);
                setResult(false);
              }}
            >
              重新圈选
            </button>
          </div>
          <div className="selection-actions">
            <Chip
              icon="Sparkles"
              onClick={() => {
                setResult(true);
                setAction("问问小艺");
              }}
            >
              问问小艺
            </Chip>
            <Chip
              icon="ScanLine"
              onClick={() => {
                setResult(true);
                setAction("识图搜索");
              }}
            >
              识图搜索
            </Chip>
          </div>
        </>
      )}
      {result ? (
        <section className="image-result">
          <header>
            <strong>{action}</strong>
            <IconButton
              icon="X"
              label="关闭识图结果"
              onClick={() => setResult(false)}
            />
          </header>
          <small>百科</small>
          <p>针叶树</p>
          <span>常绿乔木，叶片呈针形。山地和温带森林中常见。</span>
        </section>
      ) : (
        <div className="selection-status" role="status">
          {action}
        </div>
      )}
    </div>
  );
}
export function NavigationBar({ onDrop, onClick }) {
  const [over, setOver] = useState(false);
  return (
    <button
      className={`xy-navigation-bar ${over ? "drag-over" : ""}`}
      aria-label="小艺导航条"
      onClick={onClick}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        onDrop?.(e.dataTransfer.getData("text/plain"));
      }}
    >
      <span />
    </button>
  );
}
export function DragDemo() {
  const [dropped, setDropped] = useState(false);
  return (
    <div className="drag-demo">
      <div
        className="drag-document"
        draggable
        onDragStart={(e) => e.dataTransfer.setData("text/plain", "阅读笔记")}
      >
        <Icon name="FileText" size={30} />
        <strong>阅读笔记</strong>
        <span>今天 · 文档</span>
      </div>
      {dropped ? (
        <div className="drop-result" role="status">
          <Orb size={40} />
          <strong>已接收「阅读笔记」</strong>
          <p>这份笔记讨论了阅读、理解与思考的关系。</p>
          <button className="text-button" onClick={() => setDropped(false)}>
            重置示例
          </button>
        </div>
      ) : (
        <Button variant="secondary" onClick={() => setDropped(true)}>
          发送给小艺
        </Button>
      )}
      <NavigationBar
        onClick={() => setDropped(true)}
        onDrop={() => setDropped(true)}
      />
    </div>
  );
}

export {
  Card,
  Slider,
  ActionChip,
  BottomChips,
  Toast,
  Switch,
  Checkbox,
  RadioGroup,
  Progress,
} from "./controls/index";
