import React, { useEffect, useState } from "react";
import { useLanguage } from "../i18n/runtime";
import { useV7Copy } from "./runtime";
import { V7Light } from "./Light";
import { v7Defaults, v7ParameterSchema } from "./parameters";
import {
  AssistantDemo,
  ConversationDemoV7,
  SkillsGallery,
  SelectionDemoV7,
  WritingDemoV7,
  FloatingAssistant,
  Host,
  WritingSheetV7,
  SelectionOverlayV7,
  Product,
  Sources,
  ToolChips,
  VoiceDock,
} from "./components";
import analysis from "../../reference/v7-analysis.json";
import tokens from "../../tokens/xiaoyi-v7.tokens.json";
import { ControlCatalog } from "../controls/ControlCatalog";
import { VisionDemo } from "../vision/VisionDemo";
const flowKeys = [
  "assistant",
  "conversation",
  "skills",
  "selection",
  "writing",
];
function Flow({ kind, onFlow, initialPrompt }) {
  return kind === "vision" ? (
    <VisionDemo />
  ) : kind === "assistant" ? (
    <AssistantDemo />
  ) : kind === "conversation" ? (
    <ConversationDemoV7 initialPrompt={initialPrompt} />
  ) : kind === "skills" ? (
    <SkillsGallery onTry={(q) => onFlow("conversation", q)} />
  ) : kind === "selection" ? (
    <SelectionDemoV7 />
  ) : (
    <WritingDemoV7 />
  );
}
export function V7Showcase() {
  const t = useV7Copy(),
    { language } = useLanguage(),
    [flow, setFlow] = useState("assistant"),
    [prompt, setPrompt] = useState("");
  function change(id, q = "") {
    setFlow(id);
    setPrompt(q);
  }
  useEffect(() => {
    const fn = (e) => change(e.detail);
    document.addEventListener("xy-v7-flow", fn);
    return () => document.removeEventListener("xy-v7-flow", fn);
  }, []);
  return (
    <>
      <div className="xy-v7-flow-tabs" role="group" aria-label={t("flows")}>
        {flowKeys.map((k) => (
          <button key={k} aria-pressed={flow === k} onClick={() => change(k)}>
            {t(k)}
          </button>
        ))}
      </div>
      <div className="xy-v7-layout">
        <div className="xy-v7-theme" key={flow}>
          <Flow kind={flow} onFlow={change} initialPrompt={prompt} />
        </div>
        <aside className="xy-v7-notes">
          <h2>{t(flow === "vision" ? "capture" : flow)}</h2>
          <div className="xy-v7-note-card">
            <b>
              L19 ·{" "}
              {
                {
                  assistant: "00:06–00:25",
                  conversation: "00:38–01:18",
                  skills: "00:25–00:38",
                  selection: "01:45–02:51",
                  writing: "04:29–04:57",
                }[flow]
              }
            </b>
            <p>{t("timingNote")}</p>
          </div>
          <div className="xy-v7-note-card">
            <b>{t("observed")}</b>
            <p>
              {
                analysis.segments.find((s) => s.id === flow)?.[
                  language === "en" ? "en" : "zh"
                ]
              }
            </p>
            <p>{t("permissionNote")}</p>
          </div>
          <div className="xy-v7-note-card">
            <b>{t("unknown")}</b>
            <p>{t("unobserved")}</p>
          </div>
          <a href="#reference">{t("openSources")} ↗</a>
          <a href="/downloads/xiaoyi-v7.tokens.json" download>
            Tokens ↓
          </a>
        </aside>
      </div>
    </>
  );
}
export function ReferenceReconstruction({ frame }) {
  const t = useV7Copy(),
    time = frame.time;
  if (time === 27 || time === 37)
    return time === 27 ? <SkillsGallery /> : <ConversationDemoV7 />;
  if (time >= 273 && time <= 296) {
    const state =
        time === 273
          ? "idle"
          : time === 276
            ? "querying"
            : time === 296
              ? "complete"
              : "streaming",
      part = time === 280 ? 0.13 : time === 292 ? 0.8 : 1;
    return (
      <div className="xy-v7-phone xy-v7-message-host">
        <header>
          <b>{t("note")}</b>
        </header>
        <div className="xy-v7-recipient">{t("recipient")}</div>
        <WritingSheetV7
          initialType="greetingType"
          frameTime={time - 269}
          status={state}
          text={t("writingText").slice(
            0,
            Math.round(t("writingText").length * part),
          )}
        />
      </div>
    );
  }
  if (time === 297)
    return (
      <div className="xy-v7-phone xy-v7-message-host">
        <header>{t("note")}</header>
        <div className="xy-v7-recipient">{t("recipient")}</div>
        <div className="xy-v7-host-editor">
          <textarea readOnly aria-label={t("note")} value={t("writingText")} />
        </div>
      </div>
    );
  if ([106, 110, 126].includes(time))
    return (
      <div className="xy-v7-phone xy-v7-shopping">
        <header>
          <h2>{t("shopping")}</h2>
        </header>
        <div className="xy-v7-products">
          <Product />
          <Product type="shoe" />
        </div>
        <SelectionOverlayV7 type="shoe" />
        {time === 110 && (
          <section className="xy-v7-search-sheet">
            <header>{t("search")}</header>
            <div className="xy-v7-skeleton">
              <i />
              <i />
              <i />
            </div>
            <div className="xy-v7-search-placeholder" />
          </section>
        )}
      </div>
    );
  if (time === 53)
    return (
      <div className="xy-v7-phone xy-v7-conversation" data-snapshot="sources">
        <header>
          <b>Xiaoyi</b>
        </header>
        <div className="xy-v7-conversation-body">
          <div className="xy-v7-answer">{t("answer").slice(-280)}</div>
          <img
            className="xy-v7-city-image"
            src="/reference/v7/city.jpg"
            alt={t("host")}
          />
          <Sources defaultOpen />
        </div>
        <div className="xy-v7-conversation-footer">
          <ToolChips />
          <VoiceDock />
        </div>
      </div>
    );
  const status =
    time === 12
      ? "querying"
      : [20, 147, 155].includes(time)
        ? time === 20
          ? "streaming"
          : "idle"
        : "complete";
  return (
    <div className="xy-v7-phone">
      <Host />
      <V7Light effect="bloom" paused time={time - 6} />
      {time === 8 ? (
        <button className="xy-v7-listening">{t("listen")}</button>
      ) : (
        <FloatingAssistant
          status={status}
          attachment={time === 147 || time === 155}
          text={
            time === 12
              ? ""
              : t(time > 100 ? "productAnswer" : "answer").slice(
                  0,
                  time === 20 ? 360 : 2000,
                )
          }
          question={
            time === 147 || time === 155
              ? ""
              : t(time > 100 ? "photoQuestion" : "recognize")
          }
          expanded={false}
          frameTime={time - 6}
          initialKeyboard={time === 155}
        />
      )}
    </div>
  );
}
export function V7Evidence() {
  const t = useV7Copy(),
    { language } = useLanguage(),
    [index, setIndex] = useState(1),
    frame = analysis.frames[index];
  return (
    <>
      <p>{t("sourceNote")}</p>
      <p>{t("evidence")}</p>
      <div
        className="xy-v7-frame-list"
        role="group"
        aria-label={t("referenceFrame")}
      >
        {analysis.frames.map((f, i) => (
          <button
            key={f.time}
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
          >
            {f.time}s · {f.state}
          </button>
        ))}
      </div>
      <p>{t("comparisonNote")}</p>
      <div className="xy-v7-comparison">
        <figure>
          <img
            src={frame.preview}
            alt={`L19 · ${frame.time}s · ${frame.state}`}
          />
          <figcaption>L19 · {frame.time}s · 720 × 1504</figcaption>
        </figure>
        <figure className="xy-v7-theme" key={frame.time}>
          <div inert>
            <ReferenceReconstruction frame={frame} />
          </div>
          <figcaption>
            {t("estimated")} · {frame.state}
          </figcaption>
        </figure>
      </div>
      <table className="xy-v7-evidence-table">
        <tbody>
          {analysis.segments.map((s) => (
            <tr key={s.id}>
              <td>
                {s.start}–{s.end}s
              </td>
              <td>{s[language === "en" ? "en" : "zh"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {analysis.limits.map((s, i) => (
        <p key={i}>{s[language === "en" ? "en" : "zh"]}</p>
      ))}
    </>
  );
}
export function V7MotionLab() {
  const t = useV7Copy(),
    { language } = useLanguage(),
    [effect, setEffect] = useState("bloom"),
    [background, setBackground] = useState("black"),
    [paused, setPaused] = useState(true),
    [time, setTime] = useState(2),
    [parameters, setParameters] = useState({ ...v7Defaults }),
    [shape, setShape] = useState("shoe");
  useEffect(() => {
    if (paused) return;
    let prev = performance.now();
    const interval = setInterval(() => {
      const now = performance.now();
      setTime((v) => (v + (now - prev) / 1000) % 20);
      prev = now;
    }, 50);
    return () => clearInterval(interval);
  }, [paused]);
  function download() {
    const data = {
        source: "L19",
        effect,
        shape,
        time,
        parameters,
        schema: v7ParameterSchema,
        evidence:
          "Reconstruction estimates. No proprietary shader or verified orb motion.",
      },
      url = URL.createObjectURL(
        new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
      ),
      a = document.createElement("a");
    a.href = url;
    a.download = `xiaoyi-v7-${effect}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <div className="xy-v7-flow-tabs">
        {[
          ["bloom", "bloom"],
          ["edge", "edge"],
          ["selection", "contour"],
          ["writing", "wash"],
          ["orb", "orb"],
        ].map(([id, key]) => (
          <button
            key={id}
            aria-pressed={effect === id}
            onClick={() => setEffect(id)}
          >
            {t(key)}
          </button>
        ))}
      </div>
      <div className="xy-v7-lab">
        <div>
          <div
            className="xy-v7-lab-preview xy-v7-theme"
            data-background={background}
          >
            <div className={`xy-v7-lab-object is-${effect}`}>
              <V7Light
                effect={effect}
                shape={shape}
                parameters={parameters}
                paused
                time={time}
              />
            </div>
          </div>
          <div className="xy-v7-lab-tools">
            <button onClick={() => setPaused(!paused)} aria-pressed={!paused}>
              {t(paused ? "play" : "pause")}
            </button>
            <label>
              {t("background")}
              <select
                value={background}
                onChange={(e) => setBackground(e.target.value)}
              >
                {["white", "black", "color", "picture"].map((k) => (
                  <option key={k} value={k}>
                    {t(k)}
                  </option>
                ))}
              </select>
            </label>
            {effect === "selection" && (
              <select
                aria-label={t("shape")}
                value={shape}
                onChange={(e) => setShape(e.target.value)}
              >
                <option value="shoe">{t("shoe")}</option>
                <option value="phone">{t("phone")}</option>
              </select>
            )}
          </div>
          <label>
            {t("time")} · {time.toFixed(2)} s
            <input
              style={{ width: "100%" }}
              type="range"
              min="0"
              max="20"
              step=".01"
              value={time}
              onChange={(e) => {
                setPaused(true);
                setTime(Number(e.target.value));
              }}
            />
          </label>
          <div className="xy-v7-lab-tools">
            <button onClick={download}>{t("export")} ↓</button>
            <button onClick={() => setParameters({ ...v7Defaults })}>
              {t("reset")}
            </button>
          </div>
          <p>{t("timingNote")}</p>
        </div>
        <div className="xy-v7-parameters">
          {v7ParameterSchema.map((p) => (
            <label key={p.key}>
              {language === "en" ? p.labelEn : p.label}
              <output>
                {parameters[p.key]} {p.unit}
              </output>
              <input
                aria-label={language === "en" ? p.labelEn : p.label}
                type={p.type === "color" ? "color" : "range"}
                min={p.min}
                max={p.max}
                step={p.step}
                value={parameters[p.key]}
                onChange={(e) =>
                  setParameters((v) => ({
                    ...v,
                    [p.key]:
                      p.type === "color"
                        ? e.target.value
                        : Number(e.target.value),
                  }))
                }
              />
              <small>
                {language === "en" ? p.descriptionEn : p.description}
                <br />
                {p.evidence}
              </small>
            </label>
          ))}
        </div>
      </div>
      <h2>{t("comparison")}</h2>
      <V7Evidence />
    </>
  );
}
export function V7Foundations() {
  const t = useV7Copy();
  return (
    <>
      <div className="xy-v7-tokens">
        {Object.entries(tokens.values).map(([name, item]) => (
          <div key={name} className="xy-v7-token">
            {item.$value.startsWith("#") && (
              <i style={{ background: item.$value }} />
            )}
            <code>{name}</code>
            <span>
              {item.$value} · {t("estimated")}
            </span>
          </div>
        ))}
      </div>
      <p>720 × 1504 → 360 × 752 · CSS px ≠ native vp</p>
      <p>{t("timingNote")}</p>
      <div className="xy-v7-source-strip">
        {[1, 7, 13].map((i) => (
          <figure key={i}>
            <img
              src={analysis.frames[i].preview}
              alt={`L19 ${analysis.frames[i].time}s`}
            />
            <figcaption>L19 · {analysis.frames[i].time}s</figcaption>
          </figure>
        ))}
      </div>
      <a href="/downloads/xiaoyi-v7.tokens.json" download>
        xiaoyi-v7.tokens.json ↓
      </a>
    </>
  );
}
export function V7Page({ page, controlRequest, legacyReference }) {
  const t = useV7Copy(),
    titles = {
      overview: "heading",
      foundations: "baseline",
      components: "componentsTitle",
      motion: "motionTitle",
      patterns: "patternsTitle",
      reference: "referenceTitle",
      handoff: "handoffTitle",
    };
  return (
    <div className="xy-v7-page">
      <div className="xy-v7-eyebrow">XIAOYI · 7.0 RESEARCH EDITION</div>
      <h1>{t(titles[page] || "heading")}</h1>
      <p>{t(page === "overview" ? "intro" : "evidence")}</p>
      {["overview", "components", "patterns"].includes(page) && <V7Showcase />}
      {page === "foundations" && <V7Foundations />}
      {page === "motion" && <V7MotionLab />}
      {page === "reference" && (
        <>
          <V7Evidence />
          <details>
            <summary>{t("legacy")}</summary>
            {legacyReference}
          </details>
        </>
      )}
      {page === "components" && (
        <>
          <h2>{t("newControls")}</h2>
          <p>{t("adaptation")}</p>
          <ControlCatalog request={controlRequest} />
        </>
      )}
      {page === "patterns" && (
        <details>
          <summary>{t("capture")}</summary>
          <p>{t("legacyVision")}</p>
          <VisionDemo />
        </details>
      )}
      {page === "handoff" && (
        <>
          <h2>{t("standalone")}</h2>
          <p>{t("migration")}</p>
          <pre className="xy-v7-code">
            <code>{`import { FloatingAssistant, WritingSheetV7, V7Light } from './src/v7';
import './src/v7/tokens.css';
import './src/v7/v7.css';

<div className="xy-v7-theme">
  <FloatingAssistant
    status="streaming" text={answer} question={question}
    onSubmit={submit} onStop={stop} onClose={close}
    expanded={expanded} onExpandedChange={setExpanded}
  />
</div>

<V7Light effect="edge" parameters={{ lineWidth: 1 }} />`}</code>
          </pre>
          <h2>{t("downloads")}</h2>
          <div className="xy-v7-notes">
            <a href="/downloads/xiaoyi-v7.tokens.json" download>
              Tokens ↓
            </a>
            <a href="/downloads/xiaoyi-v7.parameters.json" download>
              TSL parameters ↓
            </a>
            <a href="/downloads/v7-analysis.json" download>
              L19 evidence ↓
            </a>
            <a href="https://github.com/purryc/xiaoyi-design-system/blob/main/docs/v7-guide.md">
              中文 / English ↗
            </a>
          </div>
          <p>{t("permissionNote")}</p>
        </>
      )}
    </div>
  );
}
