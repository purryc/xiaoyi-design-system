# Xiaoyi 7.0 · 小艺 7.0

[English](#english) · [中文](#中文)

## English

### Evidence and limits

This edition reconstructs the supplied L19 recording (311.334 s, 720 × 1504). “7.0” is the user's source label. The final Software Update screen offers HarmonyOS 7.0.0.109 SP6 for installation; it does not establish the installed OS or Xiaoyi application version. This is independent research, not an official Huawei specification. The full original stays outside Git. `reference/v7-analysis.json` records frame timestamps, SHA-256 values, crops, redaction rectangles and estimated geometry.

| File time | Observed surface and behavior | Reconstruction |
| --- | --- | --- |
| 6–25 s | Listening capsule, broad bottom bloom, independent glass card and input dock, querying dots, streamed response, card growth | Activate → listening → recognized query → querying → streaming → complete; stop and close cancel the local timers |
| 25–38 s | Skills hero carousel, pill categories, popular skill rows, gradient greeting, multicolor emblem | Carousel, searchable/filterable gallery and Try actions leading to a simulated conversation |
| 38–78 s | Full-screen dark chat, image response, source entries, fixed composer | Conversation specimen with fictional response content and expandable fictional source titles |
| 105–171 s | Dimmed shopping host, object outline, Save/Share/Shape toolbar, Ask/Search pills, attached-image questions, keyboard reflow | Editable preset phone/shoe contours; attachment follow-up, return to selection and observed search skeleton; no fabricated successful search |
| 269–297 s | Writing types, requirement selectors, gradient skeleton, growing text surface, stop, Add, copy and regenerate | Deterministic drafting, editable type/tone/audience/length requirements, cancel, regenerate and insertion into a fictional message editor |

The recording's control center, calendar/date actions, phone-number menus and Software Update page are host-system observations, not Xiaoyi component specifications. Store and message hosts in the demos are fictional contexts. The white touch dot and screen-recording capsule are recording instrumentation and are not added to the component library.

The lower green tint overlaps green host icons: it is not baked into an intrinsic glow palette. Glass backdrop blur remains separate from TSL light. The new emblem is reconstructed from small static views; its original motion and detailed shader remain unknown. The accepted legacy blue-violet orb and measured tablet edge-light are unchanged. Light mode, successful visual search and full new vision/call flows are not established by L19. Common sliders, toasts and other unchanged catalog controls remain adaptations, with a visible evidence note.

### Geometry and visual hierarchy

Coordinates refer to the 720 × 1504 source, not native `vp`. At a 360 px specimen, use half-scale estimates: panel horizontal inset 14 px, panel radius 30 px, dock height 46 px, card-to-dock gap 8 px, bottom inset 14 px and writing-sheet upper radius 28 px. These are manual visual estimates, not recovered native layout constants. The floating surface combines dark translucent fill, backdrop blur and restrained near-white edge light. The fullscreen surface is black; the writing surface is violet-gray with a separate colored light field. Typography, opacity, blur strength and timing are fits. Text differs intentionally because demo content is fictional and bilingual.

The floating card uses measured content height, grows to a cap, then scrolls internally. Reading upward disengages automatic following; the down button returns to new content. The dock stays separate. Expanded conversation retains the response state. The keyboard specimen demonstrates reflow; real browser focus may also open a native keyboard on mobile. The grab-handle button provides a keyboard-accessible expand/collapse action; its chosen toggle behavior and durations are reconstruction behavior, not an assertion about an unobserved native gesture algorithm.

### Version and language migration

Use `?design=v7&lang=en` or `?design=v6&lang=zh`, followed by the existing page hash. Design precedence is valid URL selection, saved local preference, then `v7`. Language selection is independent and preserves typed drafts and selected requirements. Changing editions unmounts demos and releases renderers/timers. Legacy source exports and token names remain stable. The user names the earlier light catalog Xiaoyi 6.0 and the newer dark catalog Xiaoyi 7.0. These are design-collection labels; source OS/app metadata remains unchanged. Old `design=legacy` links and saved preferences resolve to `v6`. On the reference page, `reference=v6|v7` selects either collection independently and survives refresh/language changes. Changing the system edition resets references to that edition. L01–L18 belong to 6.0; L19 belongs to 7.0. Download their separate manifests from the reference page.

`tokens/xiaoyi-v7.tokens.json` generates `src/v7/tokens.css` and portable downloads. All new visual variables are scoped under `.xy-v7-theme`. Run `npm run build` after token or icon changes. No published npm package or backend service is implied.

### React integration

```jsx
import { FloatingAssistant, WritingSheetV7, V7Light } from './src/v7';
import { LanguageProvider } from './src/i18n/runtime';
import './src/v7/tokens.css';
import './src/v7/v7.css';

<LanguageProvider>
  <div className="xy-v7-theme">
    <div className="xy-v7-phone">
      <FloatingAssistant
        status="streaming" text={answer} question={question}
        onSubmit={submit} onStop={stop} onClose={close}
        expanded={expanded} onExpandedChange={setExpanded}
      />
    </div>
  </div>
</LanguageProvider>
```

| Export | Contract |
| --- | --- |
| `FloatingAssistant` | Controlled `status`, `text`, `question`, `attachment`, `expanded`; callbacks `onSubmit(text, mode?)`, `onStop`, `onClose`, `onExpandedChange(boolean)`, `onRegenerate`; optional `attachmentType`, `onVision`, fixed `frameTime` and `initialKeyboard` for reference specimens |
| `VoiceDock` | Controlled optional `value`/`onChange`; otherwise local draft; `status`, `onSubmit`, `onStop`, `onKeyboardChange`, `onVision`. `mode="voice"` requests a simulated voice turn, never microphone permission |
| `SkillCard`, `SkillsGallery` | Card title/subtitle/icon and `onTry`; gallery emits `onTry(prompt)`; callers decide how to handle it |
| `Sources` | Expandable fictional source specimen, not real research citations |
| `SelectionOverlayV7` | `type="phone"|"shoe"`, `shape="object"|"rect"`, `onShapeChange`, `onAsk`, `onSearch`, `onClose`. Save exports a fictional SVG fixture; Share copies descriptive text locally |
| `WritingSheetV7` | `open`, `onClose`, `onApply(text)`; optional controlled `status`/`text`, `onGenerate({type,tone,audience,length,prompt})`, `onStop`. Without controlled data, runs a deterministic local draft |
| `V7Light` | `effect="bloom"|"edge"|"selection"|"writing"|"orb"`, `shape`, `parameters`, `paused`, `time` in seconds, `active`, `className`; place inside a positioned element |

Statuses are `idle`, `listening`, `recognizing`, `querying`, `streaming`, `complete`, `stopped` where relevant. For controlled writing, the caller updates status/text in response to generation, stop and close. Public components provide callbacks; the documentation showcase also uses a local `xy-v7-flow` event for navigation to existing vision/skills specimens. Consumers may provide their own navigation around the components.

### TSL reuse and parameters

All five light effects use the procedural TSL node graph in `src/v7/renderer.js`, with WebGPU or `?backend=webgl` compatibility. No video texture is used as a live effect. Edge centers and all canvas borders are transparent. Selection uses the exported editable `shoeContour` or rounded phone preset; it performs no segmentation. Keep the host backdrop blur separate from the overlay so host colors can change naturally.

The 12-field schema records bilingual labels/descriptions, defaults, bounds, units and evidence: line width, inner/outer diffusion, intensity, spread, speed, radius, entrance/exit durations, blue/pink/violet. Widths are CSS pixels; speed is radians per second; timing is milliseconds; colors are sRGB hex. Controls are sanitized at the renderer boundary. Not every parameter applies to every effect: diffusion to edges/selection, radius to the edge, spread to bloom, color fields to their relevant light bands. Entrance/exit apply to live `active` transitions; fixed `time` produces a fully visible paused specimen. The emblem is a static appearance fit and is deliberately not assigned an invented rotation.

The laboratory supports effect selection, four host backgrounds, pause/seek, parameters, reset and JSON export. The reference comparison selects an original timestamp and its reconstructed state; it is a discrete keyframe comparison, not a synchronized full-video shader reconstruction. Animation loop speed and local response timing are estimates. Renderers respect reduced motion, skip invisible documents and dispose their GPU resources on unmount. Loading/generation timers are canceled on replacement or unmount.

### Verification and delivery

Run `npm run build`, `npm run check`, `npm test` against the actual development server at 5197, then repeat browser checks against production preview with `PLAYWRIGHT_BASE_URL`. Tests cover edition/language precedence, all routes, mobile overflow, mock lifecycle, writing insertion, selection return paths, both GPU backends, alpha borders and reduced motion. Read `docs/verification.md` for measured results and limitations. Updated source, bilingual docs, compact redacted evidence, tokens and icons are committed to the existing GitHub repository; original videos, installed dependencies, builds and QA output are excluded. This update does not deploy a site or upload a Drive archive.

### Surface and continuity review · 2026-09-30

The current edition is an incremental update. Companion mode and Look at the World are first-class tabs alongside the L19 flows. The motion page opens the accepted blue-violet orb and companion edge-light laboratory; a separate tab contains the L19 surface effects and small multicolor emblem. User-confirmed continuity retains the original evidence IDs and parameters; it does not establish tablet geometry or full orb motion from this phone recording.

Reinspection at 00:12, 00:25, 00:27, 00:37, 01:15, 04:33 and 04:52 distinguishes these treatments:

- The floating sheet uses neutral translucent dark glass and independent backdrop blur. The host changes the composite color, so a sampled blue region is not a blue fill token.
- Tool chips have dark translucent fills and subtle light outlines. Writing-type chips have a filled violet-gray surface. The selected writing type uses blue-to-violet-to-pink text, while requirement selectors remain outlined.
- The writing options sheet is blue-violet gray; the generated-result sheet shifts to a warmer neutral gray with a separate restrained light field. It must not use one saturated purple fill in every state.
- Semantic icons include violet suggestions, orange-red Claw, cyan/rose skill badges and colored agent avatars. Back, mute and other utility icons remain neutral. The sidebar can be opened from Conversation; agent rows are appearance specimens without fabricated agent results.

Seven median sRGB sample rectangles, their original-pixel coordinates and timestamps are in `reference/v7-analysis.json.visualReview`. Examples: writing base `#26293a`, style chip `#3b3e4c`, requirement interior `#2a283b`, input dock `#1f1f1f`, result interior `#424148`. These are measured recorded composites; CSS opacity, blur and underlying fills remain estimates. The compact crop board selects only areas without account or phone details. Original media remains untouched.

Ten additional `v7-*-color` SVGs store colors per path. React, individual downloads, the sprite and the full icon ZIP preserve these colors. Their geometry is an editable reconstruction; at small source sizes no pixel-identical original vector is claimed. Existing monochrome IDs and their tint controls remain stable. Skill colors are keyed by skill ID, so filtering cannot change a skill's badge.

---

## 中文

### 证据与边界

本次依据 L19（311.334 秒，720 × 1504）重建。“7.0”来自用户的素材标记。末尾软件更新页面提供 HarmonyOS 7.0.0.109 SP6 待安装，不能证明录制时已安装的系统或小艺版本。本项目是独立研究复刻，不是官方规范。原视频不进 Git；时间点、哈希、裁切、遮蔽矩形及几何估值记录在 `reference/v7-analysis.json`。

| 文件时间 | 已观察界面与交互 | 重建内容 |
| --- | --- | --- |
| 6–25 秒 | 聆听胶囊、底部柔光、玻璃浮卡与独立输入条、查询点、流式回答和浮卡增高 | 唤起→聆听→识别→查询→生成→完成；停止与关闭取消本地计时器 |
| 25–38 秒 | 技能轮播、胶囊分类、热门技能列表、渐变问候与多彩标识 | 轮播、搜索、分类；试试进入模拟对话 |
| 38–78 秒 | 黑色全屏对话、图片回答、来源列表、固定输入区 | 虚构双语回答与可展开的虚构来源 |
| 105–171 秒 | 宿主遮罩、物体轮廓、保存/分享/选区形状、问问/搜索、附图追问和键盘重排 | 可编辑鞋子/手机预设轮廓；追问、返回选区及已观察的搜索骨架屏，不捏造成功结果 |
| 269–297 秒 | 帮写类型、要求选择、渐变加载、逐步长高、停止、添加、复制、重试 | 本地确定性生成；类型、语气、对象、长度可配置；停止、重试和回填虚构消息编辑器 |

控制中心、日期建日程、号码菜单和软件更新仅作为宿主观察，不属于小艺组件规范。商城、消息宿主使用虚构内容。录屏白色触点和录制胶囊是录制工具元素，不纳入图标或组件库。

底部绿色与宿主绿色图标位置重合，不写入光效固有配色。玻璃背景模糊和 TSL 光效分离。新标识仅有小尺寸静态证据，原始运动与细节未知；保留已确认的旧版蓝紫光球和实测平板边缘光。浅色主题、识图成功结果、新版完整看世界/通话流程证据不足。slider、toast 等通用控件保留为适配扩展，并在页面注明。

### 几何与视觉层级

尺寸以 720 × 1504 原片像素为基准，不当作原生 vp。360 px 示例使用半尺度估值：浮卡侧边距 14 px、圆角 30 px、输入条高 46 px、卡条间距 8 px、底边距 14 px、帮写顶部圆角 28 px。这些是人工观察估值。浮卡组合深色半透明填充、背景模糊与克制的近白色高光；全屏为黑色；帮写为灰紫底色与独立彩色光场。字号、透明度、模糊强度与时长均为拟合。内容使用虚构双语文本，不追求原文逐字相同。

浮卡测量实际内容高度，达到上限后内部滚动；向上阅读停止跟随，新内容按钮恢复。输入条独立，全屏展开保留回答。键盘示例展示重排，移动浏览器真实聚焦也可能打开原生键盘。拖动条提供键盘可用的展开/收起按钮；此切换规则和时长属于复刻实现，不声称掌握原生手势算法。

### 版本与语言迁移

使用 `?design=v7&lang=en` 或 `?design=v6&lang=zh`，后接既有页面 hash。设计版本优先级：有效 URL、保存偏好、默认 v7。语言独立，切换语言保留已输入草稿和所选要求。切换版本卸载组件并释放计时器/GPU；旧组件与变量名保持不变。用户将此前浅色目录命名为小艺 6.0，本次深色目录命名为小艺 7.0；此为设计分类，原始系统／应用版本字段不变。旧 design=legacy 链接与保存偏好映射到 v6。参考页用 reference=v6|v7 独立选择素材，刷新／换语言保留选择，切换系统版本时参考重新跟随。L01–L18 属于 6.0，L19 属于 7.0；可分别下载清单。

`tokens/xiaoyi-v7.tokens.json` 生成 `src/v7/tokens.css` 和下载副本，作用域为 `.xy-v7-theme`。修改 token 或图标后执行 `npm run build`。项目没有发布 npm 包，也不接入真实服务。

### React 接入

导入代码见上方英文示例。复制 `src/v7/`、图标库和双语运行时；以 `LanguageProvider` 包裹，在有定位的容器中放置组件，并加载两份 v7 样式。

| 导出 | 接口 |
| --- | --- |
| `FloatingAssistant` | 受控 `status/text/question/attachment/expanded`；`onSubmit(text, mode?)`、`onStop`、`onClose`、`onExpandedChange(boolean)`、`onRegenerate`；附件类型 `attachmentType`、看世界回调 `onVision`；对照用 `frameTime/initialKeyboard` |
| `VoiceDock` | 可选受控 `value/onChange`，否则内部草稿；提交、停止、键盘变化回调。voice 模式仅代表模拟语音，不申请权限 |
| `SkillCard/SkillsGallery` | 标题、说明、图标、`onTry`；目录通过 `onTry(prompt)` 交给宿主决定下一步 |
| `Sources` | 可展开的虚构来源示例，不是真实引用 |
| `SelectionOverlayV7` | 手机/鞋子、物体/矩形轮廓；切换形状、追问、搜索、关闭回调；保存虚构 SVG、分享复制描述文字 |
| `WritingSheetV7` | `open/onClose/onApply(text)`；可选受控状态/文本，生成回调包含类型、语气、对象、长度、提示词；无外部数据时本地模拟 |
| `V7Light` | bloom/edge/selection/writing/orb 五种效果，形状、参数、暂停、秒级时间、active 和类名；父元素须定位 |

状态包含 idle/listening/recognizing/querying/streaming/complete/stopped，按组件适用。受控帮写由调用方更新状态与文本。文档演示通过本地 `xy-v7-flow` 事件连接既有看世界/技能示例；接入方可自行提供导航。

### TSL 与参数

五类光效均使用 `src/v7/renderer.js` 中的过程式 TSL，支持 WebGPU 与 `?backend=webgl`，不使用视频纹理作为实时效果。边缘效果中心与画布边界透明。圈选使用导出的可编辑 `shoeContour` 和圆角手机预设，不执行分割。宿主背景模糊独立，允许背景颜色自然透出。

12 项参数均提供中英文标签、说明、默认值、范围、单位与证据：亮核、内/外扩散、强度、光场范围、速度、圆角、进入/消退、蓝/粉/紫。宽度 CSS px，速度 rad/s，时长 ms，颜色 sRGB hex；渲染入口限制非法值。各效果只使用相关参数：扩散用于边缘/圈选，圆角用于浮卡，范围用于底部光场。进入/消退用于实时 active 切换，固定 time 展示完全可见的暂停状态。标识仅拟合静态外观，不编造旋转。

实验室支持效果、四类背景、暂停、定位、参数、复位、JSON 导出。参考对照选择原片时间点与对应重建状态，属于关键帧对照，不是全片同步 shader 重建。循环速度与模拟回答时长为估值。遵循减少动态效果、不可见暂停、卸载释放 GPU；替换或关闭时取消加载/生成计时器。

### 验证与交付

执行构建、完整性/双语检查、5197 开发页面浏览器测试，再用 `PLAYWRIGHT_BASE_URL` 指向生产预览复验。覆盖版本语言优先级、全页面、移动溢出、取消、帮写回填、选区返回、两种 GPU 后端、透明边界和减少动态效果。实测结果见 `docs/verification.md`。同步现有 GitHub 的内容包括源码、双语文档、紧凑遮蔽素材、变量与图标；不包含原视频、依赖目录、构建和 QA，本轮不部署、不上传 Drive。

### 表面与能力延续复核 · 2026-09-30

当前版本采用增量更新：伴随态和看世界与 L19 流程并列；动效页默认打开已认可的蓝紫光球及伴随边缘光实验室，另一个页签展示 L19 表面光效与小尺寸多彩标识。按用户确认保留原有能力，沿用原始来源及参数；手机录屏不用于证明平板布局或完整光球运动。

复看 00:12、00:25、00:27、00:37、01:15、04:33、04:52 后区分：

- 浮动 sheet 使用中性深灰透明玻璃与独立背景模糊；宿主改变合成颜色，不能把某块蓝色采样认定为蓝色填充 token。
- 工具 chip 是深色透明填充及浅色细描边；帮写类型 chip 是灰紫实底，选中文字为蓝—紫—粉渐变，要求选择器继续使用描边。
- 帮写配置阶段偏蓝紫灰，生成结果阶段偏暖中性灰，并有独立弱光场。各阶段不共用一块浓紫色。
- 功能图标包含紫色建议、橙红 Claw、青／粉技能及彩色智能体头像；返回和静音等操作图标保持灰白。全屏对话可以展开侧栏；智能体行只展示外观，不虚构其结果。

`reference/v7-analysis.json.visualReview` 保存 7 个 sRGB 通道中位数、原片像素矩形与时间。示例：帮写底色 `#26293a`、类型 chip `#3b3e4c`、要求内部 `#2a283b`、输入条 `#1f1f1f`、结果内容区 `#424148`。它们是录屏合成色的实测值，CSS 透明度、模糊与底色仍为估值。紧凑裁切板只选择不含账号与电话号码的区域，原视频不变。

新增 10 枚 `v7-*-color` SVG，颜色写在独立路径中，React、单枚导出、sprite 和完整 ZIP 都保留颜色。图形可编辑但属于小尺寸原片的拟合重绘，不宣称官方原始矢量或逐像素一致。原单色图标 ID 和调色控件不变；技能配色与技能 ID 绑定，过滤后不会错配。
