# Xiaoyi Design System

[中文](#中文) · [English](#english)

## English

## Purpose and design context

Reconstruct Xiaoyi for shinoyan's UX design, interface prototyping, and reusable research. The supplied Xiaoyi screenshots and recordings are the visual authority: calm light surfaces, restrained typography, contextual assistant sheets, and the observed blue-violet orb. Do not redesign the brand. This is an independent research reconstruction, not Huawei's official design specification.

## Structure

- `src/`: reusable React components, styles, and documentation application.
- `src/motion/`: Three.js TSL node graph, reference timeline, renderer lifecycle and annotated parameters. Do not use video textures or CSS rings as the live orb.
- `src/controls/`: reusable common controls, accessible state handling, specimen previews and CSS; source IDs and estimated dimensions live with the specimens.
- `src/icons/`: hand-authored 24-unit SVG geometry, source mapping and icon-library UI.
- `public/icons/`: generated standalone SVGs, SVG sprite and portable icon manifest.
- `tokens/`: editable design tokens; distinguish observed structure from estimated numeric values.
- `public/reference/`: small derived reference previews and a documented local-video comparison proxy with traceable source IDs, never altered originals.
- `reference/manifest.json`: inventory of every local source, SHA-256, dimensions, duration and provenance.
- `docs/`: evidence, component specifications, state models, coverage and verification.
- `scripts/`: reproducible inventory, validation and browser checks.
- `qa/`: local visual verification results (ignored by Git).
  Original media stays in `../小艺/`; do not rename, modify, or duplicate original bytes. Derivative thumbnails and sampled frames are documented exceptions for the portable research catalog. Filenames for new code and docs are English kebab-case. Temporary render files belong in ignored `qa/`.

## Evidence and implementation

Use all supplied media in the reference index. Record unknown OS/app versions as unknown. Use official sources first for supplemental behavior. Never promote video search snippets to verified visual evidence. Exact radii, spacing, colors and timing are reconstruction estimates unless measured. Keep demonstration data fictional and mark simulation in documentation. Do not request microphone/camera access in demos. Match actual observed scrim per surface; do not apply a global scrim rule across versions.
Keep interaction instructions in documentation, not reproduced product screens. Preserve keyboard usability, focus visibility, responsive layout and reduced-motion support. Verify production build, reference integrity, demo transitions and visual output before delivery.

## GitHub

The user requested a GitHub project containing this system; creation and initial push are authorized. For a new repository, use private visibility by default. The existing repository is currently public; preserve its visibility for this explicitly authorized update. Track code, specs, tokens, evidence metadata and compact reference derivatives. Exclude original videos, node_modules, local paths with secrets, and generated build/QA output. No deployment or auto-merge is implied.

## Motion and icon extension

Use Three.js TSL for the light field, rings, glow and sampled reference sequence. Annotate every exposed parameter with unit, range, default, visual effect and evidence status. Keep numerical reconstruction distinct from access to proprietary original shaders. Preserve a synchronized source-frame comparison. Rebuild every UI icon used by this project and source-visible Xiaoyi controls as editable SVG; do not label unobserved app logos as official reconstructed icons. Reuse the new library in existing components. Further git pushes require renewed user instruction; the earlier authorization covered repository creation and initial push.

## Companion edge-light extension

`src/motion/edge-*` and `CompanionEdgeGlow.jsx` own the reusable rounded-rectangle TSL overlay; `EdgeGlowLab.jsx` owns its specimen and parameter controls. Keep the content interactive, the center transparent and the effect independent of companion layout. Measure line and diffusion widths from L11/L15/L16/L18 and time samples from L14; distinguish screen pixels, normalized reference scale and reconstruction estimates. Do not reuse the orb palette: companion borders visibly include pale warm tones. Record reproducible measurements in `reference/edge-light-analysis.json`, reusable parameter exports in `public/downloads/`, and bilingual reuse guidance in `docs/edge-light.md`. The user explicitly authorized committing and pushing this edge-light work together with the accepted orb color correction.

## Common controls extension

Use Huawei design guidance and OpenHarmony primary component documentation as supplemental references. Clearly separate framework behavior from verified Xiaoyi visuals. Store external source URLs, retrieval dates and any small derived preview provenance in `reference/web-sources.json`. New source figures belong in `public/reference/controls/` with source-ID filenames; no uncredited third-party screenshot bundles. Keep browser controls reusable and keyboard-operable; cancel feedback timers on replacement and unmount. Document estimated web dimensions separately from native vp values.

## Bilingual, transparent motion and vision extension

All UI copy and Markdown documentation must be available in Chinese and English. Use a persistent language switch and shared translation catalog; preserve source filenames, IDs, code identifiers and user-entered text. Keep both languages complete in each Markdown file. Standalone reference, web-source, token, icon and motion-stage JSON must expose English metadata beside the original Chinese fields, including in portable download copies. `src/i18n/` owns translation runtime and catalogs; `scripts/check-i18n.mjs` validates coverage. Live orb canvases must have transparent borders on every host surface; recorded backgrounds remain confined to source media. Vision examples must link the inspected source and distinguish observed layout from simulated behavior. The user explicitly authorized the current update to the existing GitHub repository, including a commit, push and bilingual repository description.
`src/vision/` contains the simulated Look at the World specimen. `public/reference/vision/` stores attributed W18 source figures and documented scene crops; previews are never presented as live camera input.

---

## 中文

### 目的与设计语境

为 shinoyan 的体验设计、原型与研究复刻小艺。用户提供的截图和录屏是视觉依据：浅色表面、克制排版、上下文助手面板和蓝紫光球。不得重新设计品牌。本项目为独立研究重建，不是华为官方规范。

### 目录约定

- `src/`：React 组件、样式、文档应用；`src/controls/`：可复用控件、状态和示例；来源编号与估值随示例保存。
- `src/motion/`：真实 Three.js TSL 图、时间轴、生命周期和参数；不使用视频纹理或 CSS 环替代光球。
- `src/icons/`：24 单位 SVG 几何、来源和图标库；`public/icons/`：生成的单枚图、sprite 与清单。
- `src/i18n/`：双语上下文、运行时与翻译表；`scripts/check-i18n.mjs`：覆盖检查。
- `src/vision/`：看世界模拟；`public/reference/vision/`：W18 署名图与场景裁切，不宣称为实时取景。
- `tokens/`：可编辑变量，区分观察结构与估值；`public/reference/`：可追溯的轻量预览、抽帧和对照代理。
- `reference/manifest.json`：每份本地素材的哈希、尺寸、时长与来源；`reference/web-sources.json`：网站、日期、适用范围与派生图记录。
- `docs/`：规格、证据、状态、覆盖和验证；`scripts/`：可重现生成与检查；忽略的 `qa/`：本地临时渲染、测试和截图。
  原件留在 `../小艺/`，不改名、不改写、不复制原始字节。已说明来源的缩略图、抽帧和视频代理为例外。新代码和文档使用英文 kebab-case 文件名。

### 证据与实现

索引包含全部用户素材。系统与小艺版本未知时写 unknown，不用文件日期推断版本。补充行为优先官方来源，不将视频搜索摘要当成已验证画面。圆角、间距、色彩和时序除非实测，否则为复刻估值。示例内容虚构，并在文档注明模拟；不请求摄像头或麦克风权限。遮罩逐场景遵循观察，不能全局推断。操作说明留在文档，不放进复刻产品画面。保持键盘、焦点、响应式和减少动态效果；交付前验证构建、原件完整性、状态和视觉。

### 动效、图标与常用控件

光场、环形、光晕与序列使用真实 TSL。每个公开参数有单位、范围、默认值、作用和证据；重建不等于拥有原始 shader。保留同步原片。实时光球在每种宿主背景上边缘完全透明，录屏背景只留在参考视频中。源图可见控件逐项重绘为可编辑 SVG，未观察的图形标注扩展，全站复用。
华为设计指南与 OpenHarmony 文档是常用控件的补充依据，框架行为与某版小艺视觉分开。外部图保存 URL、日期、许可或权利说明、变换与哈希；控件预览按 W 编号放在 `public/reference/controls/`。取消被替换和卸载的提示计时器。CSS px 估值与原生 vp 分开说明。

### 双语与 GitHub

所有 UI 文案和 Markdown 文档提供中文与英文。UI 语言切换应持久化，共用完整翻译表；保留状态键、源文件名、URL、代码标识符与用户输入。每份 Markdown 同时包含完整两种语言。独立使用的参考、网络来源、设计变量、图标及动效阶段 JSON 应与中文原字段并列提供英文字段，便携下载副本同步保持双语。看世界展示已查看的来源，区分观察布局与模拟行为。
新仓库默认私有；现有仓库已核对为公开，本轮按用户明确授权更新并保持可见性。保存代码、规格、变量、来源元数据及紧凑派生图；排除原视频、node_modules、密钥、生成站点和 QA。不得自动部署或合并。先前授权只覆盖创建和首次推送；用户本轮明确要求更新本地和 GitHub，授权本轮提交、推送及双语仓库介绍。以后推送仍须新指令。

### 伴随边缘光扩展

`src/motion/edge-*` 与 `CompanionEdgeGlow.jsx` 管理可复用圆角矩形 TSL 叠加层；`EdgeGlowLab.jsx` 管理独立示例与参数。保持内容可交互、中心透明，效果不依赖伴随侧栏布局。依据 L11/L15/L16/L18 与 L14 时间采样区分亮边、向内扩散和外侧余光，分清原图像素、参考缩放和拟合估值。伴随边缘含浅暖色，不套用光球配色。测量写入 `reference/edge-light-analysis.json`，参数导出放 `public/downloads/`，双语复用说明放 `docs/edge-light.md`。用户本轮授权将边缘光和已认可的光球颜色修正一同提交并推送 GitHub。
