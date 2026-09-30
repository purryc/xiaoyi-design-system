import React, { useEffect, useRef, useState } from "react";
import { Icon } from "../icons/Icon";
import { V7Light } from "./Light";
import { useV7Copy } from "./runtime";
export function V7IconButton({
  name,
  label,
  onClick,
  pressed,
  disabled = false,
}) {
  return (
    <button
      type="button"
      className="xy-v7-icon-button"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon name={name} size={19} />
    </button>
  );
}
export function V7Emblem() {
  return (
    <span className="xy-v7-emblem">
      <V7Light effect="orb" paused time={0} parameters={{ intensity: 1 }} />
    </span>
  );
}
export function ToolChips() {
  const t = useV7Copy(),
    [selected, setSelected] = useState("");
  return (
    <div className="xy-v7-tools">
      {[
        ["deep", "v7-reasoning"],
        ["claw", "v7-claw-color"],
        ["retouch", "image"],
        ["capture", "camera"],
      ].map(([key, icon]) => (
        <button
          key={key}
          aria-pressed={selected === key}
          onClick={() => setSelected(selected === key ? "" : key)}
        >
          <Icon name={icon} size={13} />
          {t(key)}
        </button>
      ))}
    </div>
  );
}
export function VoiceDock({
  onSubmit,
  onStop,
  status = "idle",
  value,
  onChange,
  onKeyboardChange,
  initialTyping = false,
  onVision,
}) {
  const t = useV7Copy(),
    [local, setLocal] = useState(""),
    [typing, setTyping] = useState(initialTyping),
    input = useRef(null),
    draft = value ?? local,
    busy = ["querying", "streaming"].includes(status);
  const update = (v) => {
    setLocal(v);
    onChange?.(v);
  };
  function toggle() {
    setTyping(!typing);
    onKeyboardChange?.(!typing);
    if (!typing) input.current?.focus();
  }
  return (
    <form
      className="xy-v7-dock"
      onSubmit={(e) => {
        e.preventDefault();
        if (draft.trim()) {
          onSubmit?.(draft);
          update("");
          setTyping(false);
          onKeyboardChange?.(false);
        }
      }}
    >
      <V7IconButton
        name={typing ? "v7-voice" : "v7-keyboard"}
        label={typing ? t("voice") : t("keyboard")}
        onClick={toggle}
      />
      {typing ? (
        <input
          ref={input}
          autoFocus
          aria-label={t("input")}
          placeholder={t("input")}
          value={draft}
          onChange={(e) => update(e.target.value)}
        />
      ) : (
        <button
          className="xy-v7-voice-trigger"
          type="button"
          onClick={() => onSubmit?.(t("recognize"), "voice")}
        >
          {status === "listening" ? t("listen") : t("speak")}
        </button>
      )}
      {busy ? (
        <V7IconButton name="stop" label={t("stop")} onClick={onStop} />
      ) : typing ? (
        <button
          className="xy-v7-send"
          aria-label={t("send")}
          disabled={!draft.trim()}
        >
          <Icon name="arrow-up" size={18} />
        </button>
      ) : (
        <V7IconButton
          name="video-camera"
          label={t("capture")}
          onClick={() => {
            if (onVision) onVision();
            else
              document.dispatchEvent(
                new CustomEvent("xy-v7-flow", { detail: "vision" }),
              );
          }}
        />
      )}
    </form>
  );
}
export function Sources({ defaultOpen = false }) {
  const t = useV7Copy(),
    [open, setOpen] = useState(defaultOpen);
  return (
    <div className="xy-v7-sources">
      <button onClick={() => setOpen(!open)} aria-expanded={open}>
        {t("sourceCount")}
        <Icon name="chevron-down" size={13} />
      </button>
      {open && (
        <ol>
          {[t("source1"), t("source2"), t("source3")].map((s, i) => (
            <li key={s}>
              <span>{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
export function ResponseActions({ text, onRegenerate }) {
  const t = useV7Copy(),
    [feedback, setFeedback] = useState(""),
    timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function act(action) {
    if (action === "retry") {
      onRegenerate?.();
      return;
    }
    if (action === "copy" || action === "share") {
      try {
        await navigator.clipboard.writeText(text);
        setFeedback(t(action === "copy" ? "copied" : "shared"));
      } catch {
        setFeedback(t("copy"));
      }
    } else setFeedback(t(action));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFeedback(""), 1800);
  }
  return (
    <div className="xy-v7-response-actions">
      {[
        ["copy", "copy"],
        ["share", "share"],
        ["retry", "refresh"],
        ["like", "thumbs-up"],
        ["dislike", "thumbs-down"],
      ].map(([key, icon]) => (
        <V7IconButton
          key={key}
          name={icon}
          label={t(key)}
          onClick={() => act(key)}
        />
      ))}
      <span role="status">{feedback}</span>
    </div>
  );
}
export function FloatingAssistant({
  status = "idle",
  text = "",
  question = "",
  attachment = false,
  attachmentType = "phone",
  expanded = false,
  onExpandedChange,
  onSubmit,
  onStop,
  onClose,
  onRegenerate,
  frameTime = null,
  initialKeyboard = false,
  onVision,
}) {
  const t = useV7Copy(),
    [muted, setMuted] = useState(true),
    [keyboard, setKeyboard] = useState(initialKeyboard),
    [contentHeight, setContentHeight] = useState(120),
    content = useRef(null),
    [follow, setFollow] = useState(true),
    scroller = useRef(null);
  const height = expanded
    ? 650
    : Math.min(580, Math.max(235, contentHeight + 110));
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setContentHeight(entry.contentRect.height),
    );
    if (content.current) observer.observe(content.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!scroller.current || !follow) return;
    scroller.current.scrollTop =
      height >= 580 || keyboard ? scroller.current.scrollHeight : 0;
  }, [text, follow, status, height, keyboard]);
  return (
    <div
      className={`xy-v7-assistant ${expanded ? "is-expanded" : ""} ${keyboard ? "has-keyboard" : ""}`}
      data-status={status}
    >
      <section
        className="xy-v7-float"
        style={{
          maxHeight: expanded ? "calc(100% - 54px)" : undefined,
          height,
        }}
      >
        <V7Light effect="edge" time={frameTime} />
        <button
          className="xy-v7-handle"
          aria-label={t(expanded ? "collapse" : "expand")}
          onClick={() => onExpandedChange?.(!expanded)}
        />
        <div className="xy-v7-float-header">
          <V7IconButton
            name={muted ? "volume-off" : "volume"}
            label={t(muted ? "unmute" : "mute")}
            pressed={muted}
            onClick={() => setMuted(!muted)}
          />
          <V7IconButton name="close" label={t("close")} onClick={onClose} />
        </div>
        <div
          ref={scroller}
          className="xy-v7-answer-scroll"
          onScroll={(e) => {
            const el = e.currentTarget;
            setFollow(el.scrollHeight - el.scrollTop - el.clientHeight < 28);
          }}
        >
          <div ref={content} className="xy-v7-answer-content">
            {attachment && (
              <div className="xy-v7-attachment">
                <Product type={attachmentType} />
              </div>
            )}
            {question && (
              <div className="xy-v7-user" translate="no">
                {question}
              </div>
            )}
            {status === "idle" && attachment && (
              <div className="xy-v7-followups">
                {(attachmentType === "shoe"
                  ? ["shoeQuestion", "shoeFitQuestion", "shoeCareQuestion"]
                  : ["photoQuestion", "weightQuestion", "screenQuestion"]
                ).map((k) => (
                  <button key={k} onClick={() => onSubmit?.(t(k))}>
                    {t(k)}
                  </button>
                ))}
              </div>
            )}
            {status === "querying" && (
              <div className="xy-v7-progress">
                <span className="xy-v7-spinner" />
                {t("querying")}
              </div>
            )}
            {["streaming", "complete", "stopped"].includes(status) && (
              <>
                <div className="xy-v7-step">
                  ✓ {t(status === "stopped" ? "stopState" : "summarize")}
                </div>
                <div
                  className="xy-v7-answer"
                  aria-live={status === "complete" ? "polite" : "off"}
                >
                  {text}
                </div>
              </>
            )}
            {["querying", "streaming"].includes(status) && (
              <span className="xy-v7-dots">
                <i />
                <i />
                <i />
              </span>
            )}
            {status === "complete" && (
              <>
                <Sources />
                <ResponseActions text={text} onRegenerate={onRegenerate} />
              </>
            )}
          </div>
        </div>
        {!follow && (
          <button
            className="xy-v7-jump"
            onClick={() => setFollow(true)}
            aria-label={t("jump")}
          >
            ↓
          </button>
        )}
        <ToolChips />
      </section>
      <VoiceDock
        status={status}
        onSubmit={onSubmit}
        onStop={onStop}
        initialTyping={initialKeyboard}
        onKeyboardChange={setKeyboard}
        onVision={onVision}
      />
      {keyboard && (
        <div className="xy-v7-keyboard" aria-hidden="true">
          {[
            "Q W E R T Y U I O P",
            "A S D F G H J K L",
            "↑ Z X C V B N M ⌫",
            "123　 🌐　 ━━━━━　 ↵",
          ].map((row) => (
            <div key={row}>
              {row.split(" ").map((key, i) => (
                <span key={i}>{key}</span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export function useResponse() {
  const [status, setStatus] = useState("idle"),
    [count, setCount] = useState(0),
    [question, setQuestion] = useState("");
  useEffect(() => {
    let timer;
    if (status === "listening")
      timer = setTimeout(() => setStatus("recognizing"), 850);
    else if (status === "recognizing")
      timer = setTimeout(() => setStatus("querying"), 650);
    else if (status === "querying")
      timer = setTimeout(() => setStatus("streaming"), 700);
    else if (status === "streaming")
      timer = setInterval(() => setCount((n) => n + 13), 45);
    return () => {
      clearTimeout(timer);
      clearInterval(timer);
    };
  }, [status]);
  const start = (q, mode) => {
    setQuestion(q);
    setCount(0);
    setStatus(mode === "voice" ? "listening" : "querying");
  };
  return {
    status,
    count,
    question,
    start,
    stop: () => setStatus("stopped"),
    complete: () => setStatus("complete"),
    reset: () => {
      setStatus("idle");
      setCount(0);
      setQuestion("");
    },
  };
}
export function Host({ children }) {
  const t = useV7Copy();
  return (
    <div className="xy-v7-host">
      <div className="xy-v7-host-title">
        <span>22:53</span>
        <h2>{t("host")}</h2>
        <p>{t("hostSubtitle")}</p>
      </div>
      <div className="xy-v7-host-cards">
        <div>
          30
          <br />
          <small>SEPTEMBER</small>
        </div>
        <div>
          18°
          <br />
          <small>LAKESIDE</small>
        </div>
      </div>
      {children}
    </div>
  );
}
export function AssistantDemo() {
  const t = useV7Copy(),
    r = useResponse(),
    [open, setOpen] = useState(false),
    [expanded, setExpanded] = useState(false),
    answer = t("answer");
  useEffect(() => {
    if (r.status === "streaming" && r.count >= answer.length) r.complete();
  }, [r.status, r.count, answer.length]);
  const close = () => {
    setOpen(false);
    r.reset();
  };
  return (
    <div className="xy-v7-phone">
      <Host />
      {!open ? (
        <button
          className="xy-v7-launch"
          onClick={() => {
            setOpen(true);
            r.start(t("recognize"), "voice");
          }}
        >
          <V7Emblem />
          {t("launch")}
        </button>
      ) : (
        <>
          <V7Light effect="bloom" />
          {["listening", "recognizing"].includes(r.status) ? (
            <button
              className="xy-v7-listening"
              onClick={() => r.start(t("recognize"))}
            >
              {t(r.status === "listening" ? "listen" : "recognize")}
            </button>
          ) : (
            <FloatingAssistant
              status={r.status}
              text={r.status === "complete" ? answer : answer.slice(0, r.count)}
              question={r.question}
              expanded={expanded}
              onExpandedChange={setExpanded}
              onSubmit={r.start}
              onStop={r.stop}
              onClose={close}
              onRegenerate={() => r.start(r.question)}
            />
          )}
        </>
      )}
    </div>
  );
}
export function ConversationSidebar({ onClose, onHome }) {
  const t = useV7Copy();
  return (
    <div
      className="xy-v7-sidebar-layer"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <button
        className="xy-v7-sidebar-dismiss"
        aria-label={t("close")}
        onClick={onClose}
      />
      <aside className="xy-v7-sidebar" aria-label={t("sidebar")}>
        <header>
          <V7IconButton name="v7-menu" label={t("close")} onClick={onClose} />
        </header>
        <button className="xy-v7-sidebar-home" onClick={onHome} autoFocus>
          <V7Emblem /> Xiaoyi
        </button>
        <div className="xy-v7-sidebar-row">
          <Icon name="sparkles" />
          {t("memo")}
        </div>
        <div className="xy-v7-sidebar-row">
          <Icon name="grid-four" />
          {t("automation")}
        </div>
        <div className="xy-v7-sidebar-row">
          <Icon name="v7-claw-color" style={{ filter: "grayscale(1)" }} />{" "}
          {t("claw")}
        </div>
        <h3>{t("agents")}</h3>
        {[
          ["retouch", "agentRetouch"],
          ["helper", "agentHelp"],
          ["time", "agentTime"],
        ].map(([icon, label]) => (
          <div className="xy-v7-sidebar-row" key={icon}>
            <Icon name={`v7-${icon}-color`} size={25} />
            {t(label)}
          </div>
        ))}
      </aside>
    </div>
  );
}
export function ConversationDemoV7({ initialPrompt = "" }) {
  const t = useV7Copy(),
    r = useResponse(),
    [muted, setMuted] = useState(true),
    [sidebar, setSidebar] = useState(false),
    answer = t("answer");
  useEffect(() => {
    if (initialPrompt) r.start(initialPrompt);
  }, [initialPrompt]);
  useEffect(() => {
    if (r.status === "streaming" && r.count >= answer.length) r.complete();
  }, [r.status, r.count, answer.length]);
  return (
    <div className="xy-v7-phone xy-v7-conversation">
      <header>
        <V7IconButton
          name="v7-menu"
          label={t("sidebar")}
          onClick={() => setSidebar(true)}
        />
        <b>Xiaoyi</b>
        <V7IconButton
          name="v7-call"
          label={t("voice")}
          onClick={() => r.start(t("recognize"), "voice")}
        />
        <V7IconButton
          name="volume-off"
          label={t(muted ? "unmute" : "mute")}
          pressed={muted}
          onClick={() => setMuted(!muted)}
        />
        <V7IconButton
          name="grid-four"
          label={t("skills")}
          onClick={() =>
            document.dispatchEvent(
              new CustomEvent("xy-v7-flow", { detail: "skills" }),
            )
          }
        />
      </header>
      {sidebar && (
        <ConversationSidebar
          onClose={() => setSidebar(false)}
          onHome={() => {
            r.reset();
            setSidebar(false);
          }}
        />
      )}
      <V7Light effect="writing" parameters={{ intensity: 0.25 }} />
      <div className="xy-v7-conversation-body">
        {r.status === "idle" ? (
          <>
            <p className="xy-v7-greeting">
              <V7Emblem />
              {t("greeting")}
            </p>
            <h2 className="xy-v7-gradient-text">{t("welcome")}</h2>
            <div className="xy-v7-suggestions">
              {["prompt1", "prompt2", "prompt3"].map((k) => (
                <button key={k} onClick={() => r.start(t(k))}>
                  <Icon
                    name={
                      k === "prompt1" ? "v7-news-color" : "v7-sparkles-color"
                    }
                    size={20}
                  />
                  {t(k)}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="xy-v7-user" translate="no">
              {r.question}
            </div>
            {r.status === "querying" ? (
              <p>{t("querying")}</p>
            ) : r.status === "listening" ? (
              <p>{t("listen")}</p>
            ) : (
              <div className="xy-v7-answer">
                {r.status === "complete" ? answer : answer.slice(0, r.count)}
              </div>
            )}
            {r.status === "complete" && (
              <>
                <img
                  className="xy-v7-city-image"
                  src="/reference/v7/city.jpg"
                  alt={t("host")}
                />
                <Sources />
                <ResponseActions
                  text={answer}
                  onRegenerate={() => r.start(r.question)}
                />
              </>
            )}
          </>
        )}
      </div>
      <div className="xy-v7-conversation-footer">
        <ToolChips />
        <VoiceDock status={r.status} onSubmit={r.start} onStop={r.stop} />
      </div>
    </div>
  );
}
export function SkillCard({
  title,
  subtitle,
  icon = "v7-sparkles-color",
  onTry,
}) {
  const t = useV7Copy();
  return (
    <div className="xy-v7-skill-row">
      <span className="xy-v7-skill-symbol">
        <Icon name={icon} size={37} />
      </span>
      <span>
        <b>{title}</b>
        <small>{subtitle}</small>
      </span>
      <button onClick={onTry}>{t("try")}</button>
    </div>
  );
}
export function SkillsGallery({ onTry }) {
  const t = useV7Copy(),
    [slide, setSlide] = useState(0),
    [category, setCategory] = useState("featured"),
    [search, setSearch] = useState("");
  const skills = ["skill1", "skill2", "skill3", "skill4"].filter(
    (k, i) =>
      t(k).toLowerCase().includes(search.toLowerCase()) &&
      (category === "featured" ||
        i % 3 === ["tasks", "work", "study"].indexOf(category)),
  );
  return (
    <div className="xy-v7-phone xy-v7-skills">
      <header>
        <h2>{t("skills")}</h2>
        <Icon name="search" />
      </header>
      <input
        className="xy-v7-skill-search"
        aria-label={t("skillSearch")}
        placeholder={t("skillSearch")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className={`xy-v7-skill-hero scene-${slide}`}>
        <img src={`/reference/v7/skill-${slide}.jpg`} alt="" />
        <div>
          <small>{t("guide")}</small>
          <h3>{t(slide ? "scene2" : "scene1")}</h3>
          <SkillCard
            title={t("guide")}
            subtitle={t("featured")}
            onTry={() => onTry?.(t(slide ? "scene2" : "scene1"))}
          />
          <div className="xy-v7-carousel-controls">
            <button
              aria-label={t("previous")}
              onClick={() => setSlide(1 - slide)}
            >
              ‹
            </button>
            <span>{slide + 1} / 2</span>
            <button aria-label={t("next")} onClick={() => setSlide(1 - slide)}>
              ›
            </button>
          </div>
        </div>
      </div>
      <div className="xy-v7-categories">
        {["featured", "tasks", "work", "study"].map((k) => (
          <button
            key={k}
            aria-pressed={category === k}
            onClick={() => setCategory(k)}
          >
            {t(k)}
          </button>
        ))}
      </div>
      <section className="xy-v7-skill-list">
        <small>{t("everyone")}</small>
        <h3>{t("popular")}</h3>
        {skills.map((k, i) => (
          <SkillCard
            key={k}
            title={t(k)}
            subtitle={t(category)}
            icon={
              {
                skill1: "v7-clean-color",
                skill2: "v7-charge-color",
                skill3: "v7-settings-color",
                skill4: "v7-car-color",
              }[k]
            }
            onTry={() => onTry?.(t(k))}
          />
        ))}
        {!skills.length && <p>{t("noSkills")}</p>}
      </section>
    </div>
  );
}
export function Product({ type = "phone" }) {
  return type === "phone" ? (
    <div className="xy-v7-product-phone">
      <span>
        <i />
        <i />
        <i />
      </span>
      <div />
    </div>
  ) : (
    <svg
      className="xy-v7-product-shoe"
      viewBox="0 0 200 120"
      aria-hidden="true"
    >
      <path
        d="M24 84 30 60 51 56 60 22 88 34 110 53 144 59 173 80 177 96 161 109 41 109 25 100Z"
        fill="#24252b"
        stroke="#e3dce8"
        strokeWidth="3"
      />
      <path
        d="m64 46 40 22m-42-10 42 23m-66 14 127 1"
        stroke="#da88b0"
        strokeWidth="5"
        fill="none"
      />
    </svg>
  );
}
export function SelectionOverlayV7({
  type = "phone",
  shape = "object",
  onShapeChange,
  onAsk,
  onSearch,
  onClose,
}) {
  const t = useV7Copy(),
    [feedback, setFeedback] = useState(""),
    timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function feedbackAction(key) {
    if (key === "share") {
      try {
        await navigator.clipboard.writeText(t(type));
      } catch {}
    } else {
      const svg =
        type === "phone"
          ? '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="220"><rect x="20" y="10" width="120" height="200" rx="20" fill="#444458"/></svg>'
          : '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120"><path d="M24 84 30 60 51 56 60 22 88 34 110 53 144 59 173 80 177 96 161 109 41 109 25 100Z" fill="#24252b"/></svg>';
      const url = URL.createObjectURL(
          new Blob([svg], { type: "image/svg+xml" }),
        ),
        a = document.createElement("a");
      a.href = url;
      a.download = `selection-${type}.svg`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    setFeedback(t(key === "save" ? "saved" : "shared"));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFeedback(""), 1600);
  }
  return (
    <div className="xy-v7-selection-layer">
      <div className="xy-v7-selection-close">
        <V7IconButton name="close" label={t("close")} onClick={onClose} />
      </div>
      <div className={`xy-v7-selected xy-v7-selected-${type}`}>
        <div className="xy-v7-selection-toolbar">
          <button onClick={() => feedbackAction("save")}>{t("save")}</button>
          <button onClick={() => feedbackAction("share")}>{t("share")}</button>
          <button
            onClick={() =>
              onShapeChange?.(shape === "object" ? "rect" : "object")
            }
            aria-label={t("shape")}
          >
            {t(shape === "object" ? "object" : "rect")}
          </button>
        </div>
        <Product type={type} />
        <V7Light
          effect="selection"
          shape={type === "shoe" && shape === "object" ? "shoe" : "phone"}
        />
      </div>
      <div role="status" className="xy-v7-selection-feedback">
        {feedback}
      </div>
      <div className="xy-v7-selection-actions">
        <button onClick={onAsk}>{t("ask")}</button>
        <button onClick={onSearch}>{t("search")}</button>
      </div>
    </div>
  );
}
export function SelectionDemoV7() {
  const t = useV7Copy(),
    [type, setType] = useState("phone"),
    [stage, setStage] = useState("select"),
    [shape, setShape] = useState("object"),
    [expanded, setExpanded] = useState(false),
    r = useResponse(),
    answer = t(type === "shoe" ? "shoeAnswer" : "productAnswer");
  useEffect(() => {
    if (r.status === "streaming" && r.count >= answer.length) r.complete();
  }, [r.status, r.count, answer.length]);
  const back = () => {
    setStage("select");
    r.reset();
  };
  return (
    <div className="xy-v7-phone xy-v7-shopping">
      <header>
        <h2>{t("shopping")}</h2>
      </header>
      <div className="xy-v7-products">
        {["phone", "shoe"].map((k) => (
          <button
            key={k}
            aria-label={t(k === "phone" ? "choosePhone" : "chooseShoe")}
            onClick={() => {
              setType(k);
              setStage("select");
            }}
          >
            <Product type={k} />
            <b>{t(k)}</b>
            <small>¥ {k === "phone" ? "3999" : "299"}</small>
          </button>
        ))}
      </div>
      <div className="xy-v7-shop-blocks">
        <div />
        <div />
        <div />
        <div />
      </div>
      {stage !== "closed" && (
        <SelectionOverlayV7
          type={type}
          shape={shape}
          onShapeChange={setShape}
          onAsk={() => setStage("ask")}
          onSearch={() => setStage("search")}
          onClose={() => {
            setStage("closed");
            r.reset();
          }}
        />
      )}
      {stage === "search" && (
        <section className="xy-v7-search-sheet">
          <span className="xy-v7-handle" />
          <header>
            <b>{t("search")}</b>
            <V7IconButton name="close" label={t("close")} onClick={back} />
          </header>
          <div className="xy-v7-skeleton">
            <i />
            <i />
            <i />
          </div>
          <div className="xy-v7-search-placeholder" />
        </section>
      )}
      {stage === "ask" && (
        <>
          <V7Light effect="bloom" />
          <FloatingAssistant
            attachment={r.status === "idle"}
            attachmentType={type}
            status={r.status}
            question={r.question}
            text={r.status === "complete" ? answer : answer.slice(0, r.count)}
            expanded={expanded}
            onExpandedChange={setExpanded}
            onSubmit={r.start}
            onStop={r.stop}
            onClose={back}
            onRegenerate={() => r.start(r.question)}
          />
        </>
      )}
    </div>
  );
}
export function WritingSheetV7({
  open = true,
  onClose,
  onApply,
  status: controlledStatus,
  text: controlledText,
  onGenerate,
  onStop,
  initialType = "summary",
  frameTime = null,
}) {
  const t = useV7Copy(),
    [type, setType] = useState(initialType),
    [more, setMore] = useState(false),
    [tone, setTone] = useState("warm"),
    [audience, setAudience] = useState("friends"),
    [length, setLength] = useState("short"),
    [draft, setDraft] = useState(""),
    [status, setStatus] = useState("idle"),
    [count, setCount] = useState(0),
    [expanded, setExpanded] = useState(false),
    scroll = useRef(null),
    follow = useRef(true);
  const actualStatus = controlledStatus ?? status,
    full =
      (draft && draft !== t(type) ? draft + "\n\n" : "") +
      (type === "plan"
        ? t("writingText")
        : t(type) + "\n\n" + t("writingSample")) +
      "\n\n" +
      t(tone === "warm" ? "warmEnding" : "formalEnding") +
      " · " +
      t(audience) +
      (length === "long" ? "\n\n" + t("writingDetails") : ""),
    text =
      controlledText ??
      (actualStatus === "complete" ? full : full.slice(0, count));
  useEffect(() => {
    let timer;
    if (!open) return;
    if (status === "querying")
      timer = setTimeout(() => setStatus("streaming"), 700);
    else if (status === "streaming")
      timer = setInterval(() => setCount((n) => n + 12), 45);
    return () => {
      clearTimeout(timer);
      clearInterval(timer);
    };
  }, [status, open]);
  useEffect(() => {
    if (count >= full.length && status === "streaming") setStatus("complete");
  }, [count, full.length, status]);
  useEffect(() => {
    if (follow.current && scroll.current)
      scroll.current.scrollTop =
        expanded || text.length > 700 ? scroll.current.scrollHeight : 0;
  }, [text, expanded]);
  useEffect(() => {
    if (!open) {
      setStatus("idle");
      setCount(0);
    }
  }, [open]);
  const generate = () => {
    setCount(0);
    setStatus("querying");
    follow.current = true;
    onGenerate?.({ type, tone, audience, length, prompt: draft });
  };
  if (!open) return null;
  return (
    <section
      className={`xy-v7-writing-sheet ${expanded ? "is-expanded" : ""}`}
      style={{
        height: expanded
          ? "calc(100% - 42px)"
          : actualStatus === "idle"
            ? 320
            : Math.min(660, 260 + text.length * 0.48),
      }}
      data-status={actualStatus}
    >
      <V7Light
        effect="writing"
        time={frameTime}
        parameters={{ intensity: actualStatus === "idle" ? 0.18 : 0.32 }}
      />
      <button
        className="xy-v7-handle"
        aria-label={t(expanded ? "collapse" : "expand")}
        onClick={() => setExpanded(!expanded)}
      />
      <header>
        {actualStatus !== "idle" && (
          <V7IconButton
            name="chevron-left"
            label={t("back")}
            onClick={() => {
              setStatus("idle");
              setCount(0);
              onStop?.();
            }}
          />
        )}
        <b>{t("writing")}</b>
        <V7IconButton
          name="close"
          label={t("close")}
          onClick={() => {
            setStatus("idle");
            onClose?.();
          }}
        />
      </header>
      {actualStatus === "idle" ? (
        <div className="xy-v7-writing-options">
          <small>{t("category")}</small>
          <div className="xy-v7-writing-types">
            {[
              "summary",
              "social",
              "greetingType",
              "plan",
              "essay",
              "story",
              "poem",
              "review",
              ...(more ? ["work", "study"] : []),
            ].map((k) => (
              <button
                key={k}
                aria-pressed={type === k}
                onClick={() => {
                  setType(k);
                  setDraft(t(k));
                }}
              >
                <span>{t(k)}</span>
              </button>
            ))}
            <V7IconButton
              name="chevron-down"
              label={t("more")}
              onClick={() => setMore(!more)}
              pressed={more}
            />
          </div>
          <small>{t("requirements")}</small>
          <div className="xy-v7-writing-selects">
            {[
              [tone, setTone, "tone", ["warm", "formal"]],
              [audience, setAudience, "audience", ["friends", "colleagues"]],
              [length, setLength, "length", ["short", "long"]],
            ].map(([value, set, label, options]) => (
              <select
                key={label}
                aria-label={t(label)}
                value={value}
                onChange={(e) => set(e.target.value)}
              >
                {options.map((k) => (
                  <option key={k} value={k}>
                    {t(label)} · {t(k)}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>
      ) : actualStatus === "querying" ? (
        <div className="xy-v7-skeleton">
          <i />
          <i />
          <i />
        </div>
      ) : (
        <div
          ref={scroll}
          className="xy-v7-writing-result"
          onScroll={(e) => {
            const el = e.currentTarget;
            follow.current =
              el.scrollHeight - el.scrollTop - el.clientHeight < 30;
          }}
        >
          <div className="xy-v7-answer">{text}</div>
          {actualStatus === "streaming" && (
            <span className="xy-v7-dots">
              <i />
              <i />
              <i />
            </span>
          )}
          {actualStatus === "complete" && <small>{t("disclaimer")}</small>}
        </div>
      )}
      {["complete", "stopped"].includes(actualStatus) && (
        <div className="xy-v7-writing-actions">
          <button disabled={!text} onClick={() => onApply?.(text)}>
            <Icon name="plus" size={14} />
            {t("apply")}
          </button>
          <ResponseActions text={text} onRegenerate={generate} />
        </div>
      )}
      <form
        className="xy-v7-dock"
        onSubmit={(e) => {
          e.preventDefault();
          generate();
        }}
      >
        <input
          aria-label={t("writePrompt")}
          placeholder={t("writePrompt")}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        {["querying", "streaming"].includes(actualStatus) ? (
          <V7IconButton
            name="stop"
            label={t("stop")}
            onClick={() => {
              setStatus("stopped");
              onStop?.();
            }}
          />
        ) : (
          <button className="xy-v7-send" aria-label={t("generate")}>
            <Icon name="arrow-up" size={18} />
          </button>
        )}
      </form>
    </section>
  );
}
export function WritingDemoV7() {
  const t = useV7Copy(),
    [open, setOpen] = useState(true),
    [text, setText] = useState("");
  return (
    <div className="xy-v7-phone xy-v7-message-host">
      <header>
        <Icon name="chevron-left" />
        <b>{t("note")}</b>
      </header>
      <div className="xy-v7-recipient">{t("recipient")}</div>
      <div className="xy-v7-host-editor">
        <textarea
          aria-label={t("note")}
          value={text}
          placeholder={t("hostMessage")}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={() => setOpen(true)}>{t("writing")}</button>
      </div>
      <WritingSheetV7
        open={open}
        onClose={() => setOpen(false)}
        onApply={(value) => {
          setText(value);
          setOpen(false);
        }}
      />
    </div>
  );
}
