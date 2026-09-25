# 参考证据与覆盖表

[中文](#中文) · [English](#english)

## 中文

所有本地参考已读取并生成轻量预览。原图经过缩放，视频按 8%、25%、45%、65%、85% 时点抽帧；视频证据来自这些已审阅时点，不等于逐帧人工检查。

## 本地来源

| ID  | 内容                | 类型              | 还原依据与限制                                                                               |
| --- | ------------------- | ----------------- | -------------------------------------------------------------------------------------------- |
| L01 | 桌面建议卡片        | image / marketing | 浅蓝信息卡、圆角容器与多尺寸桌面组件。低清图片，不作字号测量。                               |
| L02 | 建议卡片设置        | image / marketing | 左侧为卡片设置页，右侧为桌面布局；与 L03 内容重复。                                          |
| L03 | 建议卡片设置 · 副本 | image / marketing | 重复视觉来源，保留独立文件及校验值，不计作第二份独立证据。                                   |
| L04 | 全场景设备          | image / marketing | 品牌宣传图；仅用作设备覆盖语境，不推导各设备组件细节。                                       |
| L05 | 办公与任务卡片      | image / marketing | 多种信息卡嵌入浅色对话，卡片语义清晰，主内容左对齐。                                         |
| L06 | 对话与实时视觉      | image / marketing | 对话、关闭摄像头、开启摄像头三个状态。图片低清，视觉模式以示意还原。                         |
| L07 | 折叠屏对话流转      | video / video     | 全屏对话、并排应用、桌面浮窗切换。1.276s 对话；3.987s 并排；10.366s 浮窗。                   |
| L08 | 长文总结宣传        | image / marketing | 文章摘要与底部光球；只提供布局方向。                                                         |
| L09 | 小艺帮写            | image / capture   | 浅紫蓝底部面板；3+4 工具布局；标题、拖拽柄、四点菜单、关闭和输入条。背景文档保持明亮。       |
| L10 | 小艺球动态          | video / video     | 1.857s 单环，5.804s 同心环，15.091s 旋转椭圆，19.734s 回归圆环。动效片段本身未标注语义状态。 |
| L11 | 跨应用伴随助手      | image / capture   | 应用占约 71%，深色伴随区约 29%；顶部标题/静音/关闭，下方对话和收音条。                       |
| L12 | 圈选图片            | video / video     | 1.770s 画圈；5.530s 蒙层/对象光边/菜单；9.955s 识图面板；14.379s 结果；18.804s 返回选区。    |
| L13 | 文本选择菜单        | image / capture   | 正文中的蓝色选择区域和白色悬浮工具条；伴随侧栏仍存在。                                       |
| L14 | 文章分析过程        | video / video     | 7.589s / 13.661s 聆听；19.732s 侧栏扩展过渡；25.803s 对话结果。                              |
| L15 | 文章分析入口        | image / capture   | 应用宽约 87%，伴随区约 13%；快捷建议、识屏胶囊和底部光球。                                   |
| L16 | 文章快捷指令        | image / capture   | 总结一下、生成脑图、长文导读、收藏；控件为深灰胶囊。                                         |
| L17 | 文章问答与退出      | video / video     | 2.491s 浅色模糊过渡；4.483s 侧栏；8.469s 退出并恢复全宽。                                    |
| L18 | 语音聆听            | image / capture   | Listening 文案、多圈收音球、顶部收音指示；主应用保持可见。                                   |

L02 与 L03 的 SHA-256 相同，是同一图片的两个文件名。18 个文件只包含 17 个唯一媒体。原件均未改动。完整文件名、哈希、像素尺寸、时长、抽帧时间和相对路径见 `reference/manifest.json`。

## 网络补充

### W01 · [小艺伴随式 AI 功能介绍](https://consumer.huawei.com/cn/support/content/zh-cn16094008/)

小屏、大屏、极简三形态；双击导航条进入、长按收音、显式退出。

适用范围/限制：HarmonyOS 6.1.0.115+；页面列明 Pura X Max / X View 等适用产品，不能据此推定本地平板版本。圈选伴随在该页标注为 7.0+。

访问日期：2026-09-25。

### W02 · [小艺圈选功能说明](https://consumer.huawei.com/cn/support/content/zh-cn16023699/)

指关节圈选后可问问小艺、识图搜索、保存或分享；本地 L12 为直接视觉依据。

适用范围/限制：HarmonyOS 5.0+；本次搜索索引可读，直接打开返回 503。

访问日期：2026-09-25。

### W03 · [拖给小艺功能简介](https://consumer.huawei.com/cn/support/content/zh-cn16010332/)

可将文本、图片、文件拖向输入框或导航条，交给小艺分析。

适用范围/限制：HarmonyOS 5.0+；受导航方式及应用支持限制。

访问日期：2026-09-25。

### W04 · [HarmonyOS 设计理念](https://developer.huawei.com/consumer/cn/design/concept/)

蓝白基调、舒适圆角、HarmonyOS Sans 与跨设备卡片设计。

适用范围/限制：通用 HarmonyOS 设计理念；非小艺组件规范。

访问日期：2026-09-25。

### W05 · [HarmonyOS 设计资源](https://developer.huawei.com/consumer/cn/design/resource?ha_source=sifou&ha_sourceId=89000483)

官方字体、图标和设计组件获取入口；本项目未捆绑这些授权资源。

适用范围/限制：访问时资源页列出 2026/06 与 2026/07 更新。

访问日期：2026-09-25。

### W06 · [小艺官网](https://consumer.huawei.com/cn/mobileservices/celia/)

补充多模态、办公、服务卡片与跨设备能力的范围。

适用范围/限制：动态营销页；功能需结合机型及系统版本确认。

访问日期：2026-09-25。

### W07 · [小艺帮写功能介绍](https://consumer.huawei.com/cn/support/content/zh-cn16015627/)

只补充写作语义；不将旧版输入法的 19 类场景映射到 L09 备忘录面板。

适用范围/限制：该页对应 HarmonyOS 4.0 / 4.2 / 4.3 输入法帮写。

访问日期：2026-09-25。

### W08 · [HarmonyOS 6 · 超能小艺，轻松搞定](https://www.bilibili.com/video/BV1K8s8zrERL/)

官方视频检索线索；不作为数值或动效时序依据。

适用范围/限制：华为终端，2025-10-22。已读页面信息，未逐帧审阅线上视频。

访问日期：2026-09-25。

### W09 · [Huawei Celia Assistant gets Native HarmonyOS support](https://www.youtube.com/watch?v=yBWt0BUIcGo)

第三方版本线索；不用于复刻定稿。

适用范围/限制：Tech News，2025-01-22。只检索到页面摘要，未观看完整视频。

访问日期：2026-09-25。

## 覆盖边界

- 高证据覆盖：L09 帮写工具顺序与表面，L11/L15/L18 伴随布局和聆听，L12 圈选层级，L10 光球形态。
- 低分辨率/宣传补充：L01–L08 的手机卡片、全屏对话与跨设备关系；不推导精确尺寸。
- 未完整复制：宣传图中每一张业务卡片、全部桌面布局、全部折叠屏应用流转、原文/照片内容。用可复用代表结构覆盖，避免将不同版本混用。
- 未集成能力：真实小艺、原生系统手势、用户文件拖入解析、摄像头、ASR、TTS、图像识别和跨应用自动执行。
- 数值全部为近似，未做原图像素差异合格率声明。

## 2.0 动效与图标证据

L10 额外抽取 38 个时点（`reference/motion-analysis.json`），包括 13.25–16.25 s 的加密采样。`light-field-fit.json` 包含各时点的背景和光环拟合数据；`scripts/analyze-motion.py`、`scripts/fit-light-field.py` 可重建。图标逐项来源见 `public/icons/manifest.json`。截图中只有文字标签、未确认图形的功能按风格扩展处理。对照视频只来自本地 L10，无线上视频转载。

实现查证：[Three.js TSL 官方说明](https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language)、[WebGPURenderer 官方 API](https://threejs.org/docs/pages/WebGPURenderer.html)。本机安装与测试版本为 Three.js 0.186.1。

## 常用控件补充 · W10–W17

新增华为鸿蒙卡片设计指南，以及 OpenHarmony 的 Slider、Chip、Toast、Toggle、Radio、Checkbox、Progress 官方文档。三张框架示例图已直接查看，均有 URL、许可与派生哈希。网页形态与小艺界面之间的范围、版本及行为差别见 [常用控件证据表](controls.md)。

## 看世界参考 · W18

[华为官方帮助](https://consumer.huawei.com/cn/support/content/zh-cn16053374/) 的入口、字幕开关、前后摄像头图片已直接查看。提供 3 张完整预览和 2 张场景裁切。照片、字幕回复为本地示例，不连接识别服务；官方页面区分 5.1 / 6.0 入口，不能推断本地参考设备版本。

---

## English

All local references were read and converted to lightweight previews. Original images were resized; video frames were sampled at 8%, 25%, 45%, 65% and 85%. Evidence concerns reviewed samples, not exhaustive frame-by-frame review.

### Local sources

| ID  | Content                              | Type              | Observation and limits                                                                                                                         |
| --- | ------------------------------------ | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| L01 | Home-screen suggestion cards         | image / marketing | Light-blue information cards, rounded containers and widgets in several sizes. Low-resolution image; no type-size measurements.                |
| L02 | Suggestion card settings             | image / marketing | Card settings on the left and home-screen layout on the right; duplicates L03.                                                                 |
| L03 | Suggestion card settings · Duplicate | image / marketing | Duplicate visual source retained with its own filename and checksum; not independent evidence.                                                 |
| L04 | Cross-device ecosystem               | image / marketing | Brand marketing image used only for device context, not component details.                                                                     |
| L05 | Work & task cards                    | image / marketing | Information cards within a light conversation surface, with clear semantics and left-aligned content.                                          |
| L06 | Conversation & live vision           | image / marketing | Conversation, camera-off and camera-on states. Low-resolution source; visual mode is schematic.                                                |
| L07 | Foldable conversation transitions    | video / video     | Transitions among full-screen conversation, side-by-side apps and a floating window. 1.276s conversation; 3.987s split view; 10.366s floating. |
| L08 | Long-article summary promotion       | image / marketing | Article summary and bottom orb; supports layout direction only.                                                                                |
| L09 | Writing assistant                    | image / capture   | Pale violet-blue bottom sheet; 3+4 tools, title, handle, four-dot menu, close and input. The background document stays bright.                 |
| L10 | Xiaoyi orb motion                    | video / video     | 1.857s single ring; 5.804s concentric rings; 15.091s rotating ellipses; 19.734s return to a ring. The clip does not label semantic states.     |
| L11 | Cross-app companion                  | image / capture   | App roughly 71%, dark companion 29%; title, mute and close above the conversation and listening bar.                                           |
| L12 | Circle an image                      | video / video     | 1.770s circle; 5.530s scrim, object glow and menu; 9.955s visual search panel; 14.379s results; 18.804s back to selection.                     |
| L13 | Text-selection menu                  | image / capture   | Blue text selection and white floating toolbar; the companion sidebar remains visible.                                                         |
| L14 | Article analysis sequence            | video / video     | 7.589s / 13.661s listening; 19.732s sidebar expansion; 25.803s conversation result.                                                            |
| L15 | Article analysis entry               | image / capture   | App roughly 87%, companion 13%; shortcut suggestions, screen-analysis pill and bottom orb.                                                     |
| L16 | Article shortcuts                    | image / capture   | Summarize, mind map, reading guide and save, in dark-gray pills.                                                                               |
| L17 | Article questions & exit             | video / video     | 2.491s light blurred transition; 4.483s sidebar; 8.469s exit and restore full width.                                                           |
| L18 | Voice listening                      | image / capture   | Listening label, multi-ring orb and top listening indicator; the main app remains visible.                                                     |

L02 and L03 have identical SHA-256 hashes: 18 files contain 17 unique media assets. Originals are unchanged. Complete names, hashes, dimensions, durations, frame times and relative paths are in `reference/manifest.json`.

### Web sources

#### W01 · [Xiaoyi companion AI guide](https://consumer.huawei.com/cn/support/content/zh-cn16094008/)

Scope: HarmonyOS 6.1.0.115+ on listed products including Pura X Max / X View. This does not identify the local tablet version. Circle-selection companion is listed as 7.0+.

Accessed: 2026-09-25.

#### W02 · [Xiaoyi circle-selection guide](https://consumer.huawei.com/cn/support/content/zh-cn16023699/)

Scope: HarmonyOS 5.0+. Search-index text was readable; direct opening returned 503.

Accessed: 2026-09-25.

#### W03 · [Drag to Xiaoyi guide](https://consumer.huawei.com/cn/support/content/zh-cn16010332/)

Scope: HarmonyOS 5.0+; depends on navigation mode and application support.

Accessed: 2026-09-25.

#### W04 · [HarmonyOS design principles](https://developer.huawei.com/consumer/cn/design/concept/)

Scope: General HarmonyOS design principles, not a Xiaoyi component specification.

Accessed: 2026-09-25.

#### W05 · [HarmonyOS design resources](https://developer.huawei.com/consumer/cn/design/resource?ha_source=sifou&ha_sourceId=89000483)

Scope: The resource page listed June and July 2026 updates when accessed.

Accessed: 2026-09-25.

#### W06 · [Xiaoyi official site](https://consumer.huawei.com/cn/mobileservices/celia/)

Scope: Dynamic marketing page; features must be checked against device and system version.

Accessed: 2026-09-25.

#### W07 · [Xiaoyi writing guide](https://consumer.huawei.com/cn/support/content/zh-cn16015627/)

Scope: This page covers keyboard writing assistance in HarmonyOS 4.0 / 4.2 / 4.3.

Accessed: 2026-09-25.

#### W08 · [HarmonyOS 6 · Get things done with Xiaoyi](https://www.bilibili.com/video/BV1K8s8zrERL/)

Scope: Huawei Consumer, 2025-10-22. Page information reviewed; online video not reviewed frame by frame.

Accessed: 2026-09-25.

#### W09 · [Huawei Celia Assistant gets Native HarmonyOS support](https://www.youtube.com/watch?v=yBWt0BUIcGo)

Scope: Tech News, 2025-01-22. Page summary located; full video not watched.

Accessed: 2026-09-25.

#### W10 · [HarmonyOS card design guide](https://developer.huawei.com/consumer/cn/doc/design-guides/harmonyos-widget2-0000002731312633)

documentation

Scope: Official Huawei guide. Indexed body text was readable; direct fetching was restricted. Used for hierarchy, not device-specific Xiaoyi dimensions.

Accessed: 2026-09-25.

#### W11 · [OpenHarmony Slider](https://github.com/openharmony/docs/blob/master/zh-cn/application-dev/reference/apis-arkui/arkui-ts/ts-basic-components-slider.md)

documentation-and-figure

Scope: OpenHarmony framework API. Defaults and behavior are verifiable; web pixel dimensions are engineering estimates.

Accessed: 2026-09-25.

#### W12 · [OpenHarmony Chip](https://github.com/openharmony/docs/blob/master/zh-cn/application-dev/reference/apis-arkui/arkui-ts/ohos-arkui-advanced-Chip.md)

documentation-and-figure

Scope: OpenHarmony API 11+ component, used for general chip behavior. Dock arrangement follows local L09 / L15 and is not a new official layout.

Accessed: 2026-09-25.

#### W13 · [OpenHarmony Toast / PromptAction](https://github.com/openharmony/docs/blob/master/zh-cn/application-dev/reference/apis-arkui/js-apis-promptAction.md)

documentation-and-figure

Scope: OpenHarmony primary documentation. API 12+ example appearance inspected. Web uses an 80 CSS px approximation; native keyboard avoidance is not implemented.

Accessed: 2026-09-25.

#### W14 · [OpenHarmony Toggle](https://github.com/openharmony/docs/blob/master/zh-cn/application-dev/reference/apis-arkui/arkui-ts/ts-basic-components-toggle.md)

documentation

Scope: Framework behavior reference; switch dimensions and web styling extend the shared visual language.

Accessed: 2026-09-25.

#### W15 · [OpenHarmony Radio](https://github.com/openharmony/docs/blob/master/zh-cn/application-dev/reference/apis-arkui/arkui-ts/ts-basic-components-radio.md)

documentation

Scope: Circular checkmark styling with native browser radio keyboard behavior, not an ArkUI binding.

Accessed: 2026-09-25.

#### W16 · [OpenHarmony Checkbox](https://github.com/openharmony/docs/blob/master/zh-cn/application-dev/reference/apis-arkui/arkui-ts/ts-basic-components-checkbox.md)

documentation

Scope: Checked and disabled states follow the framework; the web version adds an accessible mixed state.

Accessed: 2026-09-25.

#### W17 · [OpenHarmony Progress](https://github.com/openharmony/docs/blob/master/zh-cn/application-dev/reference/apis-arkui/arkui-ts/ts-basic-components-progress.md)

documentation

Scope: Framework form reference; progress values and document processing are local simulations.

Accessed: 2026-09-25.

#### W18 · [Look at the World: see and talk with Xiaoyi](https://consumer.huawei.com/cn/support/content/zh-cn16053374/)

Observed: full-frame preview, title and captions/flip at the top, mute/camera/hang up at the bottom. The example simulates local states.

Scope: Official help and entry, captions and camera-flip figures inspected. The page distinguishes 5.1 / 6.0 entry paths. This example follows its full-screen visual-call layout without inferring a specific device version.

Accessed: 2026-09-25.

### Coverage boundaries

Strong evidence: L09 tool order and writing surface; L11/L15/L18 companion and listening; L12 selection layers; L10 orb forms. Low-resolution/marketing L01–L08 supplements phone cards, full-screen conversation and cross-device context, without precise dimensions.

Not exhaustively replicated: every business card, home-screen arrangement, foldable transition or original prose/photo. Representative reusable structures avoid mixing releases. Not integrated: real Xiaoyi, native gestures, user-file parsing, camera, ASR, TTS, image recognition or cross-app automation. Numerical values are approximate; no pixel-difference acceptance rate is claimed.

L10 adds 38 samples, including denser 13.25–16.25s sampling, under `motion-analysis.json`. The fit file contains archived backgrounds and ring coefficients, reproducible through the analysis/fitting scripts. Per-icon provenance is in `public/icons/manifest.json`; unconfirmed glyphs are extensions. The comparison proxy derives only from local L10, not an online video.

Implementation references: [official TSL](https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language) and [WebGPURenderer API](https://threejs.org/docs/pages/WebGPURenderer.html). Installed/tested Three.js: 0.186.1.

W10–W17 cover cards and common controls; three framework figures were inspected and retain URLs, license and derivative hashes. See [controls](controls.md#english) for version and scope distinctions. W18 supplies three inspected official entry/captions/camera figures and two scene crops. They support the visual call layout; preview photos and caption responses remain simulations. Its 5.1 / 6.0 entry paths do not identify the versions of local source devices.
