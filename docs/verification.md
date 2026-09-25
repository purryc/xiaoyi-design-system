# 验证记录

[中文](#中文) · [English](#english)

## 中文

日期：2026-09-25。环境：macOS，Node.js 24.11.1，Chrome 153.0.8010.54，Vite 7.3.6。

## 英文交付复核 · 2026-09-25

- README 调整为英文先读，新增面向设计师和开发者的入口；11 份 Markdown（含 README、AGENTS）均保留完整中英正文。英文区除语言按钮名称「中文」和原始目录路径 `../小艺/` 外无汉字。
- 18 条本地参考、18 条网络来源、14 个颜色变量、77 枚图标和 5 个动效阶段均提供与翻译表一致的英文元数据；原始文件名、URL、ID 和哈希保持不变。`npm run inventory` 也会保留英文参考字段。下载副本与源 JSON 一致。
- 英文参考弹窗显示英文标题、分类、观察和可追溯的清单入口；切换页面时关闭弹窗。动态检查六个交互范式及组件、参考、图标、动效、交付页面，唯一可见汉字是语言切换按钮「中文」。
- 更新中英文站点预览图。生产构建、完整性与双语检查通过，原始媒体 18/18 哈希匹配；生产预览 33/33 浏览器测试通过，37.0s，覆盖英文参考弹窗与可下载元数据。

## 伴随边缘光交付 · 2026-09-25

- 原件校验后测量 L11/L15/L16/L18 顶部 15 条色度剖面：内侧半峰 8–9 原图 px，10% 距离 14–18px；原高 1828px。L14 前 0–12s 提取 13 组动态配色，应用边界稳定在录屏 x=1667px。完整来源哈希、剖面和色点保存在 `reference/edge-light-analysis.json`。
- 复用组件为 `CompanionEdgeGlow`：独立 TSL 圆角矩形距离场，6 个可调参数、中英说明、JSON 导出、暂停/定时/减少动态效果和卸载清理。原伴随态的固定 inset box-shadow 已替换；边缘向内扩散为主，外侧默认仅 4% 余光。
- 构建与完整性检查通过，838 条英文文案、11 份双语 Markdown。原始媒体 18/18 SHA-256 一致。31/31 生产浏览器检查通过，37.2s；新增两项覆盖 WebGPU/WebGL2 的中心/画布边缘 alpha=0、实际半峰/10% 衰减宽度、加宽后像素增长、暂停、点击穿透、复位、双语下载、减少动态效果和退出伴随。
- 首轮测试发现参数 label 隐式关联到了 output，已改为明确关联 slider。像素剖面按实际峰值定位，避免截图边界取整产生的一像素偏移。手机展开复用表格使用独立水平滚动容器；加入快捷入口后，6 项相关布局、双语与边缘光用例再次通过，6.9s。
- 人工复核中文桌面、英文手机、伴随态整体、原图直边裁切以及 L14 的 6 个观察时点。宽度单位为原图 px，不是原生 vp；独立窄核、外侧余光和 1 秒循环衔接均标明拟合估值。未做华为真机或性能基准验证。
- 本轮交付包含已获认可的光球颜色修正。按用户要求同步现有 GitHub 仓库，保持其公开可见性；不部署或合并其他分支。

## 光球颜色修正 · 2026-09-25

- 旧版将背景相减后的 RGB 差值用于透明光带着色，产生了原片未观察到的绿色/黄色，并削弱了蓝色球心。现改为 L10 原件的 38 组直接颜色采样；保留透明输出，未复制原片背景。
- 对原片 1、5、10、14.5、15.5、20 秒抽帧人工复核。四个单环/扩散检查点（1、5、10、20 秒）在归一化半径 .41–.50、alpha>.2 的光环区域，以 HSV 色相 70°–165° 且饱和度>.15 定义明显偏绿像素：原片为 0%；旧版依次为 19.365%、30.557%、27.381%、14.783%；修正后均为 0%。此阈值用于偏色回归，不代表整体图像一致性。
- 同一四帧球心半径 .1 内 RGB 中位数：原片依次 `(88,140,230)`、`(91,145,231)`、`(87,141,230)`、`(88,140,230)`；修正后 `(89,141,232)`、`(92,146,232)`、`(89,142,231)`、`(89,141,231)`。渲染值来自透明 PNG 的 RGB；白底合成会受 alpha 影响，不将这组数据解释为背景无关的逐像素一致。
- 生产构建、完整性、808 条英文文案与双语文档检查通过。生产预览 29/29 浏览器用例通过，34.9s；新增颜色断言合并进原有透明用例，覆盖 WebGPU / WebGL2，要求非空光球、边界 alpha=0、偏绿占比<0.1%，普通状态球心各通道偏差<12/255。
- 原片、修改前和修改后同尺寸裁切并排图保存在忽略的 `qa/color-review/comparison.png`。旧版修正对象和参考背景有区别；实时画布仍透明。高速交错姿态与光带形状仍有差异，不宣称完全复刻。该次颜色检查结束时尚未推送；此次已纳入后续伴随边缘光交付。

## 2.2 最终结果

- 生产构建、完整性与双语检查通过；生产预览 **29/29 浏览器用例通过，32.3s**。
- 中英八个页面在 1440px / 390px 无水平溢出；语言选择、交互状态与原始用户输入保持正确，英文参考和图标搜索可用。
- 802 条英文文案，全部 10 份 Markdown 含中英正文与语言跳转；图标和动效参数下载包含英文说明字段。
- WebGPU / WebGL2 各在 1、5、14.5、20 秒验证 RGBA 输出：画布周边 alpha=0，非空光球仍可见；白、深、蓝、粉背景截图均复核。
- 看世界字幕、前后镜头、静音、关摄像头、挂断及重开在两种语言中通过。3 张完整参考、2 张裁切的哈希通过；照片非实时取景。
- 图标现为 77 枚：47 枚参考重绘、30 枚扩展；ZIP 80 个文件 CRC 全通过。18/18 原始媒体哈希一致，18 条网络来源完整。
- 已人工复核英文桌面动效、看世界，以及手机 Slider 与看世界。原片高速形态拟合误差及 Three.js 大包提示仍保留。
- 首轮检查发现旧相机按钮与新示例同时留在 DOM，已改为互斥渲染。透明测试改用浏览器合成后的 PNG alpha，避免读取已丢弃的 GPU drawing buffer 导致假空图；检查同时要求有效光球像素，防止全透明假通过。

## 历史检查 · 截至 2.1

| 检查         | 结果                                                                                                                        |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| 生产构建     | `npm run build` 通过；静态站点输出到 dist/                                                                                  |
| 引用与变量   | `npm run check` 通过：18 个媒体记录、43 个衍生图、46 个 Tokens、17 条网络来源；3 张官方控件衍生图哈希与署名完整             |
| 原始媒体     | 18/18 SHA-256 与建库记录一致，未改写原件                                                                                    |
| 视频可解码性 | 5/5 视频全长视频流解码通过，退出码 0、零错误行                                                                              |
| 浏览器用例   | 22 项通过；包括所有 8 页面在 1440px / 390px 下无页面水平溢出与运行时异常                                                    |
| 交互         | 帮写生成/替换/关闭；伴随展开/收起/退出/重开；键盘按住说话；取消过期回复；对话与相机状态；圈选结果/返回/保存；拖拽与替代按钮 |
| 文档功能     | 全局搜索、参考筛选、视频帧切换、Escape 关闭、Token 下载                                                                     |
| 动效         | WebGPU 与 WebGL2 实际绘制、寻帧、暂停画面不变、参数改变画面、JSON 往返、prefers-reduced-motion                              |
| 人工视觉复核 | 桌面总览、伴随范式、光球实验室、帮写画面、手机使用说明；修正缩放预览底部裁切和代码块溢出                                    |

最终浏览器检查直接运行在生产构建预览（5198 端口），22/22 通过，耗时 27.3s。命令：`PLAYWRIGHT_BASE_URL=http://127.0.0.1:5198 npm test`。

浏览器用例与页面截图保存在 qa/，不提交。脚本位于 scripts/browser.spec.js，报告为 qa/test-results.json。

## 视频检查细节

初次 `ffmpeg -f null` 对三段可变帧率录屏报了输出端 non-monotonic DTS，并非解码内容损坏。复查采用 `-map 0:v:0 -fps_mode passthrough -enc_time_base 1:1000000 -xerror -f null -` 保留足够精度的输出时间基，全长视频流均零错误。未转码或修改源文件；未宣称检查音轨或逐帧人工看完视频。

## 已修正的问题

- 手机端代码示例撑宽 CSS Grid：给网格项设置 min-width: 0，代码内部自行滚动。
- 伴随重新开启按钮被光球的图像名称干扰：添加明确的 aria-label，使读屏及自动化都能准确识别。
- 首页缩放帮写预览的底部输入条被裁切：调整预览容器高度。
- 光球替换为真实 TSL；验证 Canvas 尺寸与宿主一致，避免 ResizeObserver 尺寸回馈。
- 图标下载 ZIP 经 Python zipfile CRC 校核，77 个文件全部可读；75 个 SVG（含 sprite）均可 XML 解析。

## 限制

没有进行真实华为设备验证、像素差异阈值验收、完整 WCAG 审计、真实语音/相机/小艺服务检查或线上视频逐帧校核。跨浏览器、触屏真机和原生 HarmonyOS 手势尚未验证。本站数值为复刻估值，模拟反馈不能作为小艺真实功能或性能结论。

## 2.0 专项验证

- Three.js 0.186.1；默认运行时实际 backend = WebGPU，强制兼容运行时 = WebGL2。两种后端使用相同 TSL 图，均已成功绘制 14.5 秒等指定时点。
- 在生产预览逐页等待 GPU 初始化：overview / components / motion / icons / patterns 的全部可见光球均 ready，无 pageerror 或 console error。
- 桌面 1600px 与手机 390px 的新版动效和图标库截图均已检查；44 枚参考重绘、30 枚风格扩展。所有 74 SVG 下载内容与源几何一致。
- 28 个参数都有单位、范围、默认值和证据，38 个光场拟合时点全部有限，无 NaN / Infinity；L10 代理 SHA-256 校核通过。
- 18/18 原始媒体哈希再次通过。5 段视频的全长解码为 1.0 建库时的检查，2.0 未再次重复解码。
- TSL 是重建模型：14–16 秒交错姿态与拖影、主环细节和背景光场仍有可见差异。没有像素一致性验收；功能测试不证明完整视觉一致。
- 生产包保留 Three.js 动态加载；渲染模块约 888 kB / gzip 244 kB，构建有 500 kB chunk 提示。没有隐藏该提示，未做真实设备性能基准。
- 本次修改仅在本地，尚未追加 GitHub 推送。

## 2.1 常用控件验证

- 新增 9 个可复用控件、6 组交互示例：卡片、Slider、Chip / 底部建议、Toast、开关与选择、进度与加载。
- 新增 8 条官方参考 W10–W17，3 张 OpenHarmony 示例衍生图；链接、许可证、衍生步骤和 SHA-256 均记录在来源清单中。华为卡片指南仅核对搜索索引正文，未宣称打开其完整页面。
- 7 项新增浏览器用例覆盖卡片展开与互斥选择、Slider 键盘与指针操作、Chip 删除与恢复、底部建议和输入、Toast 到期与替换及卸载清理、开关 / 单选 / 多选混合状态、进度暂停与完成及重置、全局搜索和官方示例展开。
- 初轮发现单选标记 SVG 拦截点击，已修正原生输入的命中层级；生产预览全量 22 项复测通过。
- 已人工复核桌面卡片、Slider、Chip、开关与选择，以及手机底部 Chip、Toast / 进度页面；修正环形进度中心图标尺寸和整页截图的隐藏跳转链接残影。
- `npm run build`、`npm run check`、`git diff --check` 通过。现有 TSL / 图标库用例同时通过，18/18 原始媒体哈希仍一致。
- 尺寸和配色标注为网页复刻估值；Toast 的 CSS px 与 HarmonyOS vp 不等同。示例为本地状态模拟，尚未验证真机软键盘避让、触屏体验或原生 HarmonyOS 一致性。
- 本轮修改保存在本地，未推送 GitHub。

## 2.2 交付检查范围

本轮覆盖全站中英切换、Markdown 双语、透明 TSL 背景和 W18 看世界示例。英文八个页面首轮均无中文展示文案残留或桌面横向溢出；原始文件名和参考图中文字保留原样。新增浏览器检查对两种语言/尺寸、语言记忆与状态保持、看世界状态以及 WebGPU/WebGL2 四个时点的画布边缘 alpha 做验证。最终结果以本节的交付记录为准。

---

## English

Date: 2026-09-25. Environment: macOS, Node.js 24.11.1, Chrome 153.0.8010.54, Vite 7.3.6. This file distinguishes historical checks from the final 2.2 verification recorded below.

### English handoff audit · 2026-09-25

README now opens in English and offers separate designer and developer reading paths. All 11 Markdown files, including README and AGENTS, retain complete Chinese and English sections. In the English sections, the only Han characters are the language name “中文” and the preserved original directory path `../小艺/`.

All 18 local references, 18 web sources, 14 color tokens, 77 icons and five motion segments now carry English metadata aligned with the translation catalog. Original filenames, URLs, IDs and hashes are preserved. The inventory command retains English fields, and generated downloads match the source JSON. The English reference dialog shows translated titles, categories and observations plus a link to the original-filename manifest; navigation closes the dialog.

A dynamic English audit covered all six pattern states and the components, references, icons, motion and handoff pages. The only visible Han text was the intentional “中文” language-switch option. Fresh English and Chinese site previews were reviewed. Production build, integrity and bilingual checks passed, including 18/18 original-media hashes; the production preview passed **33/33 browser tests in 37.0 seconds**, including English reference details and downloadable metadata.

### Companion edge-light delivery · 2026-09-25

Fifteen clean top-edge chroma profiles from L11/L15/L16/L18 measured 8–9 source pixels to half strength and 14–18px to 10%, at a reference height of 1828px. Thirteen palettes were sampled from L14 seconds 0–12; the recorded app boundary was consistently x=1667px. Source hashes, profiles and colors are in `reference/edge-light-analysis.json`.

`CompanionEdgeGlow` is a reusable TSL rounded-rectangle distance field with six annotated controls, bilingual JSON export, pause/explicit time, reduced motion and resource cleanup. It replaces the companion's fixed inset box shadows. Diffusion is mainly inward, with conservative 4% outer opacity by default.

Build and integrity checks passed, including 838 English entries, 11 bilingual Markdown files and 18/18 original hashes. The production suite passed 31/31 cases in 37.2s. Two new cases check WebGPU/WebGL2 center and canvas-edge alpha=0, actual half/tenth decay widths, increased pixels after widening, pause stability, content clicks, reset, bilingual export, reduced motion and companion exit. An initial label association targeting output was fixed with explicit slider IDs. Pixel profiles locate their actual peak to account for one-pixel screenshot rounding. Expanded reuse tables have a mobile horizontal-scroll container. After the navigation shortcut was added, six relevant layout, language and edge-light cases passed again in 6.9s.

Visual review covered Chinese desktop, English mobile, the integrated companion, original straight-edge crops and six L14 observation times. Source pixels are distinct from native vp. Narrow-core separation, outer halo and the one-second loop join remain labeled estimates; no Huawei-device or performance benchmark claim is made. Delivery includes the accepted orb color correction and the user-requested update to the existing public GitHub repository, without deployment or unrelated branch merging.

### Orb color correction · 2026-09-25

The previous transparent shader treated background-subtracted RGB residuals as light colors, introducing green/yellow absent from the reviewed source frames and weakening the blue core. It now uses 38 direct L10 color samples while preserving transparent output; the recorded background is never copied into the live canvas.

Source frames at 1, 5, 10, 14.5, 15.5 and 20 seconds were visually reviewed. At the four single/expanding-ring times (1, 5, 10, 20), the annulus at normalized radii .41–.50 with alpha>.2 was measured using HSV hue 70°–165° and saturation>.15 as the green-regression criterion. The source measured 0%; the old renderer measured 19.365%, 30.557%, 27.381% and 14.783%; the corrected renderer measured 0% at all four times. This threshold detects unwanted hue shifts, not whole-image similarity.

Median core RGB within radius .1 was `(88,140,230)`, `(91,145,231)`, `(87,141,230)`, `(88,140,230)` in the source and `(89,141,232)`, `(92,146,232)`, `(89,142,231)`, `(89,141,231)` in corrected transparent PNGs. White-background composites depend on alpha; these measurements do not imply pixel identity on arbitrary backgrounds.

Build, integrity, 808 English catalog entries and bilingual-document checks passed. The production preview passed 29/29 browser cases in 34.9s. Existing transparency cases now also check color on WebGPU and WebGL2: nonempty output, zero-alpha borders, green fraction below 0.1%, and ordinary-state core channel error below 12/255. Equal-size source/before/after crops are in ignored `qa/color-review/comparison.png`. Fast intersecting poses and band geometry still differ. The color correction was local at that verification point and is included in the subsequent companion edge-light delivery.

### Established checks through 2.1

The production build and integrity checks passed. The 2.1 inventory contained 18 local media records, 43 catalog derivatives, 46 tokens and 17 web sources. All 18 original-media SHA-256 hashes matched. Three official control figures had valid hashes and attribution. Five videos passed full-length video-stream decoding during the initial inventory; 2.0 and 2.1 did not repeat that decode.

The 2.1 production preview on port 5198 passed 22/22 browser checks in 27.3s, using `PLAYWRIGHT_BASE_URL=http://127.0.0.1:5198 npm test`. These cover eight pages at 1440px and 390px without page overflow or runtime errors; writing generation/replacement/reopening; companion expansion/collapse/exit/reopen and cancellation; hold-to-talk; conversation/camera states; selection/results/back/download; drag and keyboard alternatives; search, filters, video frames, Escape and token downloads.

Motion checks exercise actual WebGPU and WebGL2 drawing, seeking, unchanged paused output, parameter-dependent images, JSON round trips and reduced motion. Icon checks exercise search, controls, SVG and ZIP downloads. The archive passed CRC checks for 77 files and XML parsing for 75 SVGs including the sprite. All 74 standalone downloads match source geometry. Of the icons, 44 are reference redraws and 30 style extensions.

The 28 parameters include units, ranges, defaults and evidence. All 38 light-field samples are finite, with no NaN/Infinity. The L10 proxy hash passed. Visible orbs on overview, components, motion, icons and patterns initialized successfully in production. Desktop 1600px and mobile 390px motion/icon views were inspected.

Nine common controls and six groups add seven checks: card expansion/exclusive selection; slider keys, endpoints, steps, pointer and disabled states; chip removal/restoration and dock input; toast expiry/replacement/focus/unmount; switch, radio and mixed checkbox states; progress pause/completion/reset/reduced motion; global control search and official figure expansion.

### Fixes verified

- Mobile code blocks no longer widen CSS grids: grid items have min-width:0 and code scrolls internally.
- Companion reopen has an explicit accessible name, avoiding ambiguity with the orb's image label.
- The scaled writing preview no longer clips its bottom input.
- TSL canvas size follows the host without ResizeObserver feedback.
- Native radio inputs sit above decorative marks so SVGs do not intercept clicks; the full production suite was rerun.
- Ring progress targets only its direct SVG, preserving center-icon size. Hidden skip links no longer appear as artifacts in full-page screenshots, while remaining keyboard-accessible.

### Video decoding details

Initial null-output FFmpeg runs reported non-monotonic DTS on three variable-frame-rate recordings, an output timestamp issue rather than damaged content. Rechecking with `-map 0:v:0 -fps_mode passthrough -enc_time_base 1:1000000 -xerror -f null -` preserved sufficient time-base precision and decoded all video streams without errors. Originals were not transcoded or changed. Audio streams and exhaustive manual video review were not claimed.

### Limits

No real Huawei device, native HarmonyOS gestures, touch hardware, cross-browser matrix, full WCAG audit, live voice/camera/Xiaoyi service, online video frame-by-frame review or pixel-difference acceptance threshold was verified. CSS px and native vp are not equivalent; native soft-keyboard avoidance remains untested. Simulated responses cannot establish real Xiaoyi functionality or performance.

The TSL reconstruction still differs in fast intersecting poses/trails around 14–16s, main-ring detail and highlights. Functional tests do not establish pixel identity. Three.js remains dynamically loaded at roughly 888kB / gzip 244kB; the existing 500kB chunk warning remains visible. No real-device performance benchmark was performed.

### 2.2 verification scope

The update covers language switching across the complete site, bilingual Markdown, transparent TSL composition and W18 Look at the World. An initial English scan found no untranslated presentation copy or desktop overflow on all eight pages. Original filenames and Chinese inside reference images are intentionally preserved. New tests exercise both viewport sizes, language persistence and state preservation, vision state transitions in both languages, and canvas-border alpha at four times on both WebGPU and WebGL2. Final results are recorded below. Test scripts are in `scripts/browser.spec.js`; ignored local artifacts and the JSON report are under `qa/`.

### Final 2.2 results

Production build, integrity and bilingual checks passed. The production preview passed **29/29 browser tests in 32.3 seconds**. Both languages render eight pages at 1440px / 390px without horizontal overflow. Language persistence, state preservation, literal user input and English reference/icon searches passed.

There are 802 English catalog entries; all ten Markdown files include both languages and navigation links. Icon and motion-parameter downloads include English metadata. Each of WebGPU and WebGL2 passed RGBA border checks at 1, 5, 14.5 and 20 seconds: all canvas-edge alpha values were zero, with non-empty visible orb pixels. White, dark, blue and pink compositions were visually reviewed.

Vision captions, camera facing, mute, camera off, hang-up and restart passed in both languages. Three full reference figures and two crops passed hash verification; they are not live capture. The library now contains 77 icons (47 redraws, 30 extensions), with CRC checks passing for all 80 ZIP members. All 18 original-media hashes and 18 web-source records passed.

Desktop English motion/vision and mobile sliders/vision were visually reviewed. Known fast-motion fitting differences and the Three.js bundle warning remain documented. Initial camera tests found duplicate old/new controls in the DOM; mutually exclusive rendering fixed them. Transparency tests read the browser-composited PNG instead of a discarded GPU drawing buffer and also require visible orb pixels, preventing an empty canvas from falsely passing.
