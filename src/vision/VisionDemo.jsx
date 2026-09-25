import React, { useState } from "react";
import { Icon } from "../icons/Icon";
import { TslOrb } from "../motion/TslOrb";
export function VisionDemo({ embedded = false, onHangup }) {
  const [active, setActive] = useState(true),
    [camera, setCamera] = useState(true),
    [front, setFront] = useState(false),
    [captions, setCaptions] = useState(false),
    [muted, setMuted] = useState(false);
  const end = () => {
    setActive(false);
    onHangup?.();
  };
  if (!active)
    return (
      <div className="vision-ended">
        <TslOrb size={110} paused />
        <h3>通话已结束</h3>
        <button
          className="xy-button"
          onClick={() => {
            setActive(true);
            setCamera(true);
            setMuted(false);
            setCaptions(false);
          }}
        >
          重新开始
        </button>
      </div>
    );
  return (
    <div
      className={`vision-demo ${embedded ? "embedded" : ""} ${camera ? "camera-active" : "camera-inactive"}`}
      data-camera={camera ? "on" : "off"}
      data-facing={front ? "front" : "rear"}
    >
      {camera ? (
        <img
          className="vision-scene"
          src={`/reference/vision/W18-${front ? "portrait" : "temple"}.jpg`}
          alt={front ? "前置示例画面" : "建筑示例画面"}
        />
      ) : (
        <div className="vision-orb">
          <TslOrb size={170} state={muted ? "idle" : "listening"} />
        </div>
      )}
      <div className="vision-shade" />
      <header>
        <strong>小艺</strong>
        <div>
          <button
            aria-label="翻转摄像头"
            aria-pressed={front}
            disabled={!camera}
            onClick={() => setFront(!front)}
          >
            <Icon name="camera-flip" size={21} />
          </button>
          <button
            aria-label="字幕"
            aria-pressed={captions}
            onClick={() => setCaptions(!captions)}
          >
            字幕
          </button>
        </div>
      </header>
      {captions && (
        <div className="vision-captions" aria-live="polite">
          <p>这是什么建筑？</p>
          <p>画面中是一座传统建筑的屋檐，能看到层叠的斗拱和彩绘装饰。</p>
        </div>
      )}
      <div className="vision-bottom">
        <p className="vision-live-status" role="status">
          {muted ? "麦克风已静音" : camera ? "陪你看世界" : "正在聆听…"}
        </p>
        <div className="vision-actions">
          <button
            aria-label={muted ? "取消静音" : "静音"}
            aria-pressed={muted}
            onClick={() => setMuted(!muted)}
          >
            <span>
              <Icon name={muted ? "MicOff" : "Mic"} size={23} />
            </span>
            <small>{muted ? "取消静音" : "静音"}</small>
          </button>
          <button
            aria-label={camera ? "关闭摄像头" : "开启摄像头"}
            aria-pressed={camera}
            onClick={() => setCamera(!camera)}
          >
            <span className={camera ? "camera-selected" : ""}>
              <Icon name={camera ? "video-camera" : "camera-off"} size={23} />
            </span>
            <small>摄像头</small>
          </button>
          <button aria-label="挂断" onClick={end}>
            <span className="hang-up">
              <Icon name="phone-end" size={23} />
            </span>
            <small>挂断</small>
          </button>
        </div>
      </div>
      <div className="home-indicator" />
    </div>
  );
}
export function VisionReference() {
  return (
    <section className="vision-reference">
      <h3>小艺看世界 · 官方参考</h3>
      <p>
        全幅取景、顶部字幕与翻转摄像头、底部三项通话操作。示例照片来自参考图，未调用摄像头或麦克风。
      </p>
      <a
        href="https://consumer.huawei.com/cn/support/content/zh-cn16053374/"
        target="_blank"
        rel="noreferrer"
      >
        W18 · 华为官方帮助 ↗
      </a>
      <div className="vision-reference-grid">
        {[
          ["entry", "全屏对话入口"],
          ["captions", "字幕关闭 / 开启"],
          ["camera", "后置 / 前置摄像头"],
        ].map(([id, title]) => (
          <figure key={id}>
            <a
              href={`/reference/vision/W18-${id}.jpg`}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={`/reference/vision/W18-${id}.jpg`}
                alt={title}
                loading="lazy"
              />
            </a>
            <figcaption>{title}</figcaption>
          </figure>
        ))}
      </div>
      <small>
        © Huawei ·
        图像及照片归各自权利人；保留原图标注。英文说明为本项目翻译，图中原始中文未改写。
      </small>
    </section>
  );
}
