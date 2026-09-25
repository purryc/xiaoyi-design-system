import React, { useEffect, useRef, useState } from "react";
import { Icon } from "../icons/Icon";
import {
  Card,
  Slider,
  ActionChip,
  BottomChips,
  Toast,
  Switch,
  Checkbox,
  RadioGroup,
  Progress,
} from "./index";
import { controlItems } from "./catalog";
import sources from "../../reference/web-sources.json";
import manifest from "../../reference/manifest.json";

function CardExamples() {
  const [expanded, setExpanded] = useState(false),
    [selected, setSelected] = useState("balanced");
  return (
    <div className="control-card-examples">
      <Card
        title="设计讨论会"
        eyebrow="日程提醒"
        description="明天 10:00—11:00 · 会议室 A"
        icon="calendar"
        footer={
          <>
            <span className="control-meta">提前 10 分钟提醒</span>
            <button
              className="xy-card-action"
              aria-expanded={expanded}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "收起详情" : "查看详情"}
              <Icon
                name={expanded ? "chevron-up" : "chevron-right"}
                size={15}
              />
            </button>
          </>
        }
      >
        {expanded && (
          <div className="card-detail">
            讨论交互原型与视觉方案，确认下一轮调整。
            <p>参会人：林然、周宁、陈悦</p>
          </div>
        )}
      </Card>
      <Card
        title="这篇文章，值得了解的三点"
        eyebrow="小艺摘要"
        icon="summarize"
        variant="tinted"
      >
        <ol className="xy-summary-points">
          <li>围绕正在做的事，提供相关建议。</li>
          <li>让信息保持清晰，让操作更轻。</li>
          <li>在合适的时刻给出结果。</li>
        </ol>
      </Card>
      <div className="xy-choice-cards" role="group" aria-label="回答模式">
        {[
          ["quick", "简洁", "快速获取要点"],
          ["balanced", "完整", "展开更多细节"],
        ].map(([id, label, desc]) => (
          <button
            key={id}
            className={`xy-choice-card ${selected === id ? "is-selected" : ""}`}
            aria-pressed={selected === id}
            onClick={() => setSelected(id)}
          >
            <span>
              <strong>{label}</strong>
              <small>{desc}</small>
            </span>
            <Icon name={selected === id ? "check" : "plus"} size={17} />
          </button>
        ))}
        <button className="xy-choice-card" disabled>
          <span>
            <strong>深度研究</strong>
            <small>暂不可用</small>
          </span>
          <Icon name="clock" size={17} />
        </button>
      </div>
    </div>
  );
}
function SliderExamples() {
  const [volume, setVolume] = useState(64),
    [speed, setSpeed] = useState(1),
    [brightness, setBrightness] = useState(72);
  return (
    <div className="control-slider-examples">
      <Slider label="音量" value={volume} onChange={setVolume} />
      <Slider
        label="朗读速度"
        min={0.5}
        max={2}
        step={0.25}
        value={speed}
        onChange={setSpeed}
        unit="×"
        showSteps
      />
      <Slider
        label="亮度"
        variant="inset"
        value={brightness}
        onChange={setBrightness}
      />
      <Slider label="不可用" disabled value={40} />
    </div>
  );
}
const suggestions = [
  { id: "summary", label: "总结一下", icon: "summarize" },
  { id: "mindmap", label: "生成脑图", icon: "mindmap" },
  { id: "questions", label: "提炼问题", icon: "message" },
  { id: "translate", label: "翻译全文", icon: "translate" },
];
function ChipExamples() {
  const [selected, setSelected] = useState("all"),
    [tags, setTags] = useState(["设计周报", "交互记录"]),
    [reply, setReply] = useState(""),
    [query, setQuery] = useState("");
  const responses = {
    summary:
      "这篇文章主要讨论：让帮助贴近任务、保持信息层级清晰，并及时提供反馈。",
    mindmap: "已整理为「任务 → 信息 → 操作 → 反馈」四个分支。",
    questions: "值得讨论：建议何时出现？结果放在哪里？用户如何继续操作？",
    translate:
      "This article explores contextual assistance, clear information hierarchy, and timely feedback.",
  };
  return (
    <div className="control-chip-examples">
      <div className="control-chip-variants">
        <div role="group" aria-label="内容筛选">
          {[
            ["all", "全部"],
            ["recent", "最近"],
            ["saved", "已收藏"],
          ].map(([id, label]) => (
            <ActionChip
              key={id}
              size="small"
              selected={selected === id}
              onClick={() => setSelected(id)}
            >
              {label}
            </ActionChip>
          ))}
          <ActionChip size="small" disabled>
            不可用
          </ActionChip>
        </div>
        <div className="chip-filter-result">
          {
            {
              all: "全部内容 · 12 项",
              recent: "最近内容 · 4 项",
              saved: "收藏内容 · 3 项",
            }[selected]
          }
        </div>
        <div>
          {tags.map((tag) => (
            <ActionChip
              key={tag}
              icon="file"
              onClose={() => setTags(tags.filter((t) => t !== tag))}
            >
              {tag}
            </ActionChip>
          ))}
          {tags.length < 2 && (
            <button
              className="text-button"
              onClick={() => setTags(["设计周报", "交互记录"])}
            >
              恢复标签
            </button>
          )}
        </div>
      </div>
      <div className="xy-dock-scene">
        <div className="dock-scene-heading">
          <Icon name="file" size={18} />
          <span>阅读笔记</span>
          <Icon name="more" size={18} />
        </div>
        <div className="dock-reading">
          <small>DESIGN NOTES</small>
          <h3>让帮助，自然发生</h3>
          <p>
            信息与操作应该围绕当下的任务展开。保持阅读的连续，让每一次回应都清晰可见。
          </p>
          {reply && (
            <div className="dock-reply" role="status">
              {reply}
            </div>
          )}
        </div>
        <div className="xy-bottom-dock">
          <BottomChips
            items={suggestions}
            onSelect={(id) => setReply(responses[id])}
          />
          <form
            className="dock-input"
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) {
                setReply(`已记录问题：${query.trim()}`);
                setQuery("");
              }
            }}
          >
            <Icon name="keyboard" size={19} />
            <input
              aria-label="底部输入"
              placeholder="有什么可以帮你？"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              aria-label="发送底部问题"
              disabled={!query.trim()}
            >
              <Icon name="arrow-up" size={18} />
            </button>
          </form>
          <div className="dock-home-indicator" />
        </div>
      </div>
    </div>
  );
}
function ToastExamples() {
  const [toast, setToast] = useState(null),
    [duration, setDuration] = useState(1500),
    [variant, setVariant] = useState("light");
  const next = useRef(0);
  function show(message) {
    setToast({ id: ++next.current, message, duration });
  }
  return (
    <div className="control-toast-examples">
      <div className="specimen-toolbar">
        <label>
          持续时间
          <select
            aria-label="Toast 持续时间"
            value={duration}
            onChange={(e) => setDuration(+e.target.value)}
          >
            {[1500, 3000, 5000, 10000].map((n) => (
              <option value={n} key={n}>
                {n / 1000} s
              </option>
            ))}
          </select>
        </label>
        <label>
          表面
          <select
            aria-label="Toast 表面"
            value={variant}
            onChange={(e) => setVariant(e.target.value)}
          >
            <option value="light">浅色 · 参考</option>
            <option value="dark">深色 · 扩展</option>
          </select>
        </label>
      </div>
      <div className="xy-toast-scene">
        <div className="toast-scene-document">
          <Icon name="file" size={24} />
          <h3>阅读笔记</h3>
          <span />
          <span />
          <span />
        </div>
        <div className="toast-sample-actions">
          <button
            className="xy-button secondary"
            onClick={() => show("已完成")}
          >
            完成操作
          </button>
          <button
            className="xy-button secondary"
            onClick={() => show("已复制")}
          >
            复制内容
          </button>
          <button
            className="xy-button secondary"
            onClick={() => show("网络连接不可用，请稍后再试")}
          >
            显示长提示
          </button>
        </div>
        <Toast
          toast={toast}
          variant={variant}
          onDismiss={(id) =>
            setToast((current) => (current?.id === id ? null : current))
          }
        />
        <div className="dock-home-indicator" />
      </div>
    </div>
  );
}
function ChoiceExamples() {
  const [enabled, setEnabled] = useState(true),
    [background, setBackground] = useState(false),
    [mode, setMode] = useState("auto"),
    [format, setFormat] = useState("text"),
    [checked, setChecked] = useState(["body"]);
  const opts = [
    ["body", "正文内容"],
    ["images", "图片说明"],
    ["links", "参考链接"],
  ];
  return (
    <div className="control-choice-examples">
      <div className="xy-setting-list">
        <Switch
          label="自动朗读"
          description="收到回复后朗读内容"
          checked={enabled}
          onChange={setEnabled}
        />
        <Switch
          label="后台继续"
          checked={background}
          onChange={setBackground}
        />
        <Switch label="跨设备接续" checked disabled />
      </div>
      <RadioGroup
        label="朗读方式"
        value={mode}
        onChange={setMode}
        options={[
          { value: "auto", label: "自动" },
          { value: "headphones", label: "仅耳机" },
          { value: "off", label: "关闭" },
        ]}
      />
      <div className="xy-checkbox-group" role="group" aria-label="整理内容">
        <Checkbox
          checked={checked.length === 3}
          indeterminate={checked.length > 0 && checked.length < 3}
          onChange={(yes) => setChecked(yes ? opts.map((o) => o[0]) : [])}
        >
          全部内容
        </Checkbox>
        <div>
          {opts.map(([id, label]) => (
            <Checkbox
              key={id}
              checked={checked.includes(id)}
              onChange={(yes) =>
                setChecked((list) =>
                  yes ? [...list, id] : list.filter((x) => x !== id),
                )
              }
            >
              {label}
            </Checkbox>
          ))}
        </div>
      </div>
      <RadioGroup
        label="输出格式"
        segmented
        value={format}
        onChange={setFormat}
        options={[
          { value: "text", label: "文本" },
          { value: "list", label: "列表" },
          { value: "mindmap", label: "脑图" },
        ]}
      />
    </div>
  );
}
function ProgressExamples() {
  const [value, setValue] = useState(36),
    [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setValue((v) => Math.min(v + 4, 100)), 160);
    return () => clearInterval(id);
  }, [running]);
  useEffect(() => {
    if (value >= 100) setRunning(false);
  }, [value]);
  return (
    <div className="control-progress-examples">
      <Card
        title={value === 100 ? "整理完成" : "正在整理文档"}
        description={
          value === 100 ? "已生成摘要与关键结论" : `${value}% · 汇总内容与结构`
        }
        icon="file"
      >
        <Progress label="文档整理进度" value={value} />
      </Card>
      <div className="progress-state-row">
        <div>
          <Progress label="环形文档进度" value={value} variant="ring" />
          <span>确定进度</span>
        </div>
        <div>
          <Progress label="正在读取文档" variant="ring" indeterminate />
          <span>读取中</span>
        </div>
      </div>
      <div className="inline wrap">
        <button
          className="xy-button primary"
          disabled={value === 100}
          onClick={() => setRunning(!running)}
        >
          {running ? "暂停" : "继续整理"}
        </button>
        <button
          className="xy-button secondary"
          onClick={() => {
            setRunning(false);
            setValue(0);
          }}
        >
          重置进度
        </button>
      </div>
    </div>
  );
}
const examples = {
  "content-cards": CardExamples,
  sliders: SliderExamples,
  "bottom-chips": ChipExamples,
  toast: ToastExamples,
  "choice-controls": ChoiceExamples,
  progress: ProgressExamples,
};
export function ControlCatalog({ category, onOpen }) {
  return (
    <div className="control-catalog">
      {controlItems
        .filter((item) => category === "all" || category === item.category)
        .map((item) => {
          const Example = examples[item.id];
          return (
            <section
              className={`component-section control-section control-${item.id}`}
              key={item.id}
              id={`component-${item.id}`}
            >
              <div className="component-spec">
                <span className="eyebrow">{item.subtitle}</span>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <div className="control-source-links">
                  {item.sources.map((id) => {
                    const source = sources.find((s) => s.id === id);
                    return (
                      <a
                        key={id}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {id} {source.publisher}
                        <Icon name="arrow-up" size={11} />
                      </a>
                    );
                  })}
                  {item.local?.map((id) => (
                    <button
                      key={id}
                      onClick={() =>
                        onOpen(manifest.items.find((s) => s.id === id))
                      }
                    >
                      {id} 本地参考
                      <Icon name="arrow-up" size={11} />
                    </button>
                  ))}
                </div>
                <dl className="control-param-list">
                  {item.params.map(([label, value]) => (
                    <React.Fragment key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </React.Fragment>
                  ))}
                </dl>
                <details className="control-code">
                  <summary>组件用法</summary>
                  <pre>
                    <code>{item.code}</code>
                  </pre>
                </details>
                {item.sources.some(
                  (id) => sources.find((s) => s.id === id)?.preview,
                ) && (
                  <details className="control-reference">
                    <summary>查看官方示例图</summary>
                    {item.sources.map((id) => {
                      const s = sources.find((s) => s.id === id);
                      return (
                        s.preview && (
                          <a
                            key={id}
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={s.preview}
                              alt={`${s.title} 原文示例`}
                              loading="lazy"
                            />
                            <small>{s.title} ↗</small>
                            <span className="control-figure-credit">
                              OpenHarmony contributors · CC BY 4.0 ·
                              抽帧、缩放与 JPEG 转换
                            </span>
                          </a>
                        )
                      );
                    })}
                  </details>
                )}
                <span className="control-evidence-note">
                  行为参考官方文档；网页尺寸与配色为复刻估值。
                </span>
              </div>
              <div className="component-preview control-preview">
                <Example />
              </div>
            </section>
          );
        })}
    </div>
  );
}
