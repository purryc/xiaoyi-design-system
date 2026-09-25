# 小艺设计规格 · Reconstruction 2.2

[中文](#中文) · [English](#english)

## 中文

## 证据定义

- **观察**：源图或视频采样时点中直接可见的结构和状态。
- **估值**：为可复用组件而归一化的色值、尺寸、间距、曲线与时间。
- **推断**：证据未直接给出的语义映射、演示行为、响应式处理和错误恢复。

本地图片与视频没有可靠的系统/应用版本元数据，统一记为 `unknown`。文件名日期不等于系统版本。不同设备、OS 或应用可能存在不同视觉样式。

## 视觉基底

### 内容与色彩

浅色对话和文档以白色为主，控制组采用浅灰；主行动使用蓝色。帮写面板将浅粉、浅蓝和浅紫融为一个表面（L09）。伴随助手使用深蓝黑底色，让旁边的文档维持高亮（L11 / L15）。光球和分析入口以青、蓝、紫、粉的局部光效建立品牌识别（L10 / L18）。

主内容、辅助文字、交互动作、智能状态各用独立语义变量。`success` 与 `error` 是原型补充，没有本地截图支持。色值为观感匹配的 sRGB 工程估值，未声称是华为品牌标准。

### 字体

官方通用 HarmonyOS 设计材料提到 HarmonyOS Sans（W04）。项目字体栈为 HarmonyOS Sans SC → HarmonyOS Sans → PingFang SC → Microsoft YaHei → sans-serif，不分发字体。不能因为本机使用 PingFang 就声称实现了官方字体一致性。

使用 12 / 14 / 16 / 20 / 24 / 32 / 48 CSS px；这是设计系统的归一化刻度。真机截图为设备像素，不应将 1320px 宽的截图直接当作 1320vp 的布局。控件缩放演示不表示真实触摸目标大小。

### 形状和布局

| 对象     | 复刻规格                                 | 依据                             |
| -------- | ---------------------------------------- | -------------------------------- |
| 控件圆角 | 12px                                     | L09 工具按钮                     |
| 内容卡片 | 20px                                     | L01 / L05                        |
| 帮写面板 | 顶部 28px，底部贴边                      | L09                              |
| 应用窗口 | 32px 设计变量；示例缩放适配              | L11 / L15                        |
| 胶囊     | 999px；水平内边距 14px                   | L15 建议                         |
| 间距     | 4px 基础步长，常用 8 / 12 / 16 / 24 / 32 | 按截图观感归一化                 |
| 窄伴随   | 约 87:13 主应用/侧栏                     | L15 缩略图可见边界约 x=1041/1200 |
| 展开伴随 | 约 71:29 主应用/侧栏                     | L11 缩略图可见边界约 x=853/1200  |

这些比例可直接从源图布局得到近似关系，但响应式最小宽度会调整实际比例。移动端文档把平板范式缩成展示框；不是对真实手机伴随布局的声明。

## 表面与背景控制

1. 帮写：原文保持明亮，工具面板覆盖底部。L09 没有可见的全屏灰色遮罩。
2. 伴随：主应用收窄，深色助手在侧面出现；L15 / L18 主应用仍然明亮。
3. 圈选：L12 5.530s 有全局灰色遮罩与对象轮廓光；识图结果叠加在选区之上。
4. 过渡：L17 2.491s 出现浅色模糊帧。它仅说明过渡过程存在，不意味着所有稳定态都要模糊主内容。

## 交互模型

### 伴随阅读

`idle → listening → thinking → speaking/result → idle/closed`

- 窄栏：建议胶囊、识别屏幕、光球；关闭位于顶部。
- 建议或识屏操作直接进入结果生成；按住光球显示 listening，松开提交样例指令。
- 结果让侧栏展开；保留主应用可见。收起保留用户控制权，退出恢复主应用宽度。
- 生成中关闭必须取消计时器，不能在重新打开后出现过期结果。
- 静音开关仅表示 UI 状态，未实际播放语音。
- 官方 W01 说明的是指定机型/版本的伴随能力，不能用它反推本地平板 OS。官网双击导航条是真机入口，本网页以显式演示按钮代替系统手势。

### 帮写

`原文 → 选择工具 → 生成 → 审阅 → 替换 / 返回 / 关闭`

忠实保留 3+4 工具次序：摘要、校正文本、润色改写 / 语气改写、扩写、分段小结、会议排版。固定示例生成耗时 950ms，仅便于审阅等待反馈。仅点击「替换原文」才改动示例笔记。关闭不自动替换，回到类型时取消未完成生成。

### 对话和多模态

以 L06 / L07 / L08 支持的浅色对话、实时通话光球、视觉模式为结构方向。初始卡片、示例文案、相机占位和规则回复由本项目编写。2.2 视觉通话采用 W18 官方布局与参考照片裁切，支持字幕、前后镜头、静音和挂断；未请求摄像头或麦克风权限。

### 圈选

`浏览 → 选区 → 动作 → 结果 → 返回选区 / 退出`

L12 提供轮廓、顶部工具条、底部问答/识图与结果面板；L13 提供文本选中菜单。当前可交互主范式还原图像选区，使用固定树形插画与椭圆光边示意，未实现自由套索、智能分割、原截图人体轮廓或真实图搜。「保存」导出自绘示例 SVG，「复制」复制示例对象说明。

### 拖给小艺

依据 W03 的拖入导航条语义，结合 L07 的底部系统入口观感。支持 HTML 文本拖放与「发送给小艺」的键盘/触屏替代。演示仅接收内置文档，不读取用户文件，不连接系统拖拽协议。

## 动效

| 状态      | 视觉               | 证据程度                        |
| --------- | ------------------ | ------------------------------- |
| idle      | 柔和单环，低幅光晕 | L10 单环可见；idle 语义推断     |
| listening | 同心环外扩         | L18 收音文字+多环直接支持       |
| thinking  | 椭圆环面旋转       | L10 椭圆可见；thinking 语义推断 |
| speaking  | 核心脉动、低幅外扩 | 原型推断                        |
| error     | 低饱和红粉光环     | 原型扩展，未展示在默认路径      |

光球采用 Three.js TSL，源片背景拟合仅保留为分析数据，实时画布输出透明背景，主环由四阶傅里叶轮廓/光强与高斯亮芯重建，扩散和交错环为程序化投影。38 个采样点按 23.217 s 参考时间轴插值；28 个公开参数带单位、范围和证据。保留 prefers-reduced-motion 和按需重绘。控件 120–180ms、面板 360ms、布局 480ms 仍是 CSS UI 过渡，非光球渲染。详见 [动效规格](motion.md)。

## 可用性边界

支持键盘焦点、原生对话框焦点约束、Escape 关闭参考、空输入禁发、视觉状态文本、减少动态效果。尚未进行完整 WCAG 对比度认证或屏幕阅读器实机审阅；文档中缩放展示的平板不是触控尺寸规范。状态来自客户端演示，不能用来评价真实小艺的能力、速度或准确性。

---

## English

### Evidence definitions

**Observed** means a structure or state directly visible in a source image or reviewed video sample. **Estimated** means normalized colors, dimensions, spacing, curves or timing for reusable components. **Inferred** means semantic mappings, demo behavior, responsive treatment or recovery not directly established by evidence.

Local media has no reliable OS/application version metadata and is marked `unknown`. Filename dates are not OS versions. Different devices and releases can have different visual styles.

### Visual foundations

Light conversations and documents use white, with pale-gray control groups and blue primary actions. L09 blends pale pink, blue and violet in a writing sheet. L11 / L15 use a dark blue-black companion while keeping the document bright. Cyan, blue, violet and pink light identify the orb and analysis entry in L10 / L18.

Content, secondary text, actions and assistant states have separate semantic tokens. Success and error colors are prototype additions without local screenshot evidence. Colors are estimated sRGB values, not official brand specifications.

W04 mentions HarmonyOS Sans. The stack is HarmonyOS Sans SC → HarmonyOS Sans → PingFang SC → Microsoft YaHei → sans-serif; no font files are distributed. Using PingFang locally does not establish official typeface parity. The normalized scale is 12 / 14 / 16 / 20 / 24 / 32 / 48 CSS px. Screenshot pixels do not equal native vp; scaled demos do not specify physical touch targets.

| Object             | Reconstruction                           | Evidence                   |
| ------------------ | ---------------------------------------- | -------------------------- |
| Control radius     | 12px                                     | L09 tools                  |
| Content cards      | 20px                                     | L01 / L05                  |
| Writing sheet      | 28px top radius, flush bottom            | L09                        |
| App window         | 32px token; scaled specimens             | L11 / L15                  |
| Pills              | 999px radius; 14px horizontal padding    | L15                        |
| Spacing            | 4px base; commonly 8 / 12 / 16 / 24 / 32 | Visual normalization       |
| Narrow companion   | App/sidebar ≈ 87:13                      | L15 boundary ≈ x=1041/1200 |
| Expanded companion | App/sidebar ≈ 71:29                      | L11 boundary ≈ x=853/1200  |

These approximate relationships follow visible boundaries; responsive minimum sizes can change the ratio. The mobile documentation scales tablet examples, without claiming they are native phone layouts.

### Surface and background rules

1. Writing: bright original content and a bottom sheet; no visible full-screen gray scrim in L09.
2. Companion: the application narrows beside a dark assistant; L15 / L18 keep the app bright.
3. Selection: L12 at 5.530s has a global gray scrim and object glow; results overlay the selection.
4. Transition: L17 at 2.491s is light and blurred. That transient frame does not justify blurring every stable state.

### Interaction models

**Companion:** `idle → listening → thinking → speaking/result → idle/closed`. The narrow rail contains suggestions, screen analysis and an orb, with close at the top. Suggestions enter generation directly; holding the orb listens and releasing submits a sample. Results expand the sidebar while preserving the app. Collapse returns control; exit restores width. Closing during generation cancels the timer, preventing stale results. Mute is UI-only. W01 concerns specified devices/releases and cannot identify the local tablet OS. Explicit demo controls replace native double-tap gestures.

**Writing:** original → tool → generation → review → replace / back / close. Preserve the 3+4 order: summary, proofread, polish / tone, expand, section summaries, meeting format. A fixed 950ms delay demonstrates waiting. Only Replace original modifies the note. Closing does not replace; returning to types cancels pending generation.

**Conversation and vision:** L06 / L07 / L08 support light conversations, call orbs and visual mode. Cards, copy and rule-based responses are authored examples. Version 2.2 uses W18's official full-screen layout and cropped reference photos, with captions, camera flip, mute and hang-up. No camera or microphone permission is requested.

**Selection:** browse → selection → action → result → back / exit. L12 provides the outline, toolbar, ask/search and results; L13 provides text selection. The demo uses a fixed tree illustration and elliptical glow, without free lasso, segmentation, original person outlines or real image search. Save exports the drawn SVG; Copy copies the example description.

**Drag:** follows W03's navigation-bar semantics and L07's entry appearance. Supports HTML text drag and a Send to Xiaoyi touch/keyboard alternative. Only the built-in document is accepted; no user files or system drag protocol are parsed.

### Motion

| State     | Visual                          | Evidence                              |
| --------- | ------------------------------- | ------------------------------------- |
| idle      | Soft single ring                | L10 form; inferred idle semantics     |
| listening | Concentric expansion            | L18 listening label and rings         |
| thinking  | Rotating ellipses               | L10 form; inferred thinking semantics |
| speaking  | Core pulse and subtle expansion | Prototype inference                   |
| error     | Desaturated red/pink ring       | Extension outside the default path    |

The orb uses Three.js TSL. Fitted recording backgrounds are archived analysis data only; live canvases are transparent. Main-ring contours and radiance use fourth-order Fourier fits and Gaussian cores; ripples and intersecting rings use procedural projection. There are 38 samples over 23.217 seconds and 28 annotated parameters. Reduced motion and on-demand rendering are supported. Control transitions at 120–180ms, sheets at 360ms and layouts at 480ms remain CSS UI transitions, separate from orb rendering. See [motion](motion.md#english).

### Usability limits

Keyboard focus, native dialog focus containment, Escape, empty-input protection, visible state text and reduced motion are supported. Full WCAG contrast certification and real screen-reader/device review have not been completed. Scaled tablets are not touch-size specifications. Client-side states cannot establish real Xiaoyi capability, speed or accuracy.
