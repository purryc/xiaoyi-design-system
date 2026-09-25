# 伴随态边缘光 · Companion edge light

[中文](#中文) · [English](#english)

## 中文

可复用的透明 **Three.js TSL** 圆角矩形边缘光，已用于伴随阅读与动效页独立示例。原片主观效果为贴边的浅色细光，主要向应用内部扩散；不能把深色伴随区的大范围背景渐变当成边缘泛光。

### 参考与测量

- 静态依据：L11、L15、L16、L18，原图均为 2584×1828；动态配色：L14 文章分析录屏前 0–12 秒，1920×1360。
- `python3 scripts/analyze-edge-light.py` 校验原件 SHA-256 后，只读原图/原片。对顶部四个无文字区域（x=450/850/1250/1650，左右各 30px）取 RGB 中位数，使用 `max(RGB)-min(RGB)` 测量颜色向内消退。低于 15/255 的近中性区域被排除，共保留 15 条剖面。
- 峰值位于原图 y=0–1；向内约 **8–9px 降至一半，14–18px 降至 10%**。这是从边界向内的距离，不是双侧 FWHM，不是 HarmonyOS vp，也不是 CSS `blur()` 半径。
- 当前 520px 高示例按 `520/1828` 缩放：半峰距离约 **2.3–2.6 CSS px**，10% 距离约 **4.0–5.1 CSS px**。高斯拟合采用 1/e 宽度 9.6 原图像素。
- 单独的亮核无法从截图唯一分离：2px 窄核宽度与 5% 权重是估值。外侧也无法可靠分离出独立强泛光，因此默认仅 4% 余光、1/e 宽度 4px；两者明确标为估值。
- 伴随边缘可见浅蓝、粉紫、青色和浅暖色。它与 L10 光球的调色不同；不可将光球的去绿/去黄规则套用到伴随边缘。

`reference/edge-light-analysis.json` 保存全部测量剖面、来源哈希、13 个时点的 16 色角向采样。动态样本来自录屏合成后 RGB，不是华为原始 shader 参数。每秒取一帧；16 个位置按上、右、下、左顺时针，每边四个色点，角点用相邻直边插值。颜色转线性 RGB 后以非负权重插值。0–12s 后增加 1s 回到首帧，**这个循环衔接为复刻处理**，不是测得的官方循环周期。

### 模型与参数

令 d 为圆角矩形有符号距离，负值在内部，`G(d,w)=exp(-(d/w)^2)`。

- 内侧 alpha：`opacity * (.05*G(-d,lineWidth)+.95*G(-d,innerWidth))`。
- 外侧 alpha：`opacity * outerOpacity * G(d,outerWidth)`；outerWidth=0 完全关闭外侧。
- 距离 2.5–3 倍最大对应宽度时软裁到精确 0；中心和画布外边界完全透明。默认圆角读取宿主左上圆角，统一应用到四角。多圆角不等的宿主需统一圆角或另行扩展 SDF。
- 所有 width 参数单位为 **ref px（1828px 高原图）**。`实际 CSS px = 参数 × 宿主高度 / 1828`。与响应式缩放绑定，尺寸变化不会保持固定像素粗细。

| key | 默认 | 范围 | 意义 / 依据 |
| --- | --- | --- | --- |
| lineWidth | 2 ref px | 0.5–8 | 窄核 1/e 半宽；拟合估值，520px 高时约 .57px |
| innerWidth | 9.6 ref px | 2–50 | 内侧 1/e 半宽；测量拟合，520px 高时约 2.73px |
| outerWidth | 4 ref px | 0–40 | 外侧 1/e 半宽；保守估值，0 关闭外侧 |
| outerOpacity | .04 | 0–.5 | 外侧最高 alpha；保守估值 |
| opacity | 1 | 0–1 | 整体 alpha 倍率；复用控制 |
| speed | 1 | 0–3 | 时间播放倍率；0 保持当前时间，复用控制 |

动态和便携 JSON 导出都带中英参数说明：`public/downloads/xiaoyi-edge-light.parameters.json`。只接受有限数值，超范围数值自动限制；NaN、Infinity 与未知键不传入 GPU。

### React 复用

依赖项目现有 React 与 Three.js 0.186.1。复制 `CompanionEdgeGlow.jsx`、`edge-renderer.js`、`edge-parameters.js`、`edge-glow.css` 和 `reference/edge-light-analysis.json`，保持相对目录或调整导入；无需整个设计系统网站。

```jsx
import { CompanionEdgeGlow } from './motion/CompanionEdgeGlow';

<div style={{ position: 'relative', borderRadius: 24, background: '#fff' }}>
  <div style={{ borderRadius: 'inherit', overflow: 'hidden' }}>
    {children}
  </div>
  <CompanionEdgeGlow
    active={true}
    paused={false}
    parameters={{ innerWidth: 9.6, outerWidth: 4, outerOpacity: 0.04 }}
  />
</div>
```

宿主必须有实际宽高和 `position: relative`。叠加层不拦截鼠标、触摸和键盘；内容层独立裁圆角。宿主 `overflow:hidden` 会裁掉外侧余光，需要外发散时让宿主 overflow visible。组件自身给画布预留足够 padding，不改变文档布局。它不增加全屏遮罩。

- `active={false}`：清空效果，保留内容。
- `paused`：冻结当前颜色；`time={5}`：确定性渲染源时间位置，停止自动计时。
- `radius={24}`：显式 CSS px 圆角；默认 null 读取宿主。宿主需使用统一的像素圆角，百分比圆角不支持自动解析。
- 减少动态效果、离屏和隐藏页面时停止持续绘制。卸载释放 GPU 资源。默认 WebGPU，`?backend=webgl` 验证同一 TSL 图的 WebGL2 后端。
- 不把参数直接映射到真实小艺的待机/聆听/思考含义；边缘色彩顺序是参考采样重建。

### 验证边界

浏览器检查覆盖渲染后端、暂停、中心与边界透明、剖面半峰和 10% 距离、加宽后有效像素增长、内容点击、参数复位/双语导出、减少动态效果和退出伴随。测量与原件哈希可重跑。亮核、外侧余光、圆角细节、连续帧颜色和循环接缝仍属重建，不宣称逐像素一致。

## English

A reusable, transparent **Three.js TSL** rounded-rectangle edge light, integrated into the companion-reading demo and a standalone motion-page specimen. The reference has a fine pale edge with diffusion mainly toward the app interior. The broad dark-sidebar background gradient is separate from the edge effect.

### Evidence and measurement

Static sources L11, L15, L16 and L18 are 2584×1828 images. Dynamic colors come from seconds 0–12 of the 1920×1360 L14 recording. Run `python3 scripts/analyze-edge-light.py` to verify source SHA-256 hashes and regenerate the analysis without modifying originals.

The script takes median RGB across 60px-wide clean top-edge strips centered at x=450, 850, 1250 and 1650. Chroma `max(RGB)-min(RGB)` measures inward color decay. Near-neutral strips below 15/255 are excluded, leaving 15 profiles. Peaks occur at y=0–1; strength halves approximately **8–9 source pixels inward** and reaches 10% at **14–18px**. These are one-sided distances from the boundary, not full two-sided FWHM, native HarmonyOS vp or CSS blur radii.

At a 520px host height, the scale is 520/1828: half strength at **2.3–2.6 CSS px**, 10% at **4.0–5.1px**. The fitted Gaussian 1/e width is 9.6 source pixels. The separate narrow core is not uniquely identifiable from screenshots: its 2px width and 5% weight are estimates. External halo separation is also uncertain, so the default is a conservative 4% opacity with a 4px 1/e width.

Companion edges include pale blue, pink-violet, cyan and pale warm tones. Their colors are sampled independently of the L10 orb. The orb's green/yellow correction must not remove observed colors from this border.

`reference/edge-light-analysis.json` contains all profiles, source hashes and 13 sets of 16 perimeter colors. These are composited recording RGB samples, not Huawei's original shader values. Four knots per side run clockwise through top, right, bottom and left; corner knots average neighboring straight-edge samples. Colors convert to linear RGB and interpolate with non-negative weights. Playback uses 0–12s, followed by a 1s return to the first frame. This loop join is a reconstruction choice, not a measured official period.

### Model and controls

Let d be the signed rounded-rectangle distance, negative inside, and `G(d,w)=exp(-(d/w)^2)`. Inner alpha is `opacity*(.05*G(-d,lineWidth)+.95*G(-d,innerWidth))`; outer alpha is `opacity*outerOpacity*G(d,outerWidth)`. An outer width of zero disables external light. Fields taper to exactly zero at 2.5–3 times the corresponding maximum width. The center and canvas perimeter remain fully transparent.

Every width is in **ref px**, relative to a 1828px-high source: `rendered CSS px = parameter * host height / 1828`. Responsive height changes scale the effect. The default corner radius reads the host's top-left CSS radius and applies it uniformly; unequal or percentage corner radii require an explicit numeric radius or an extended SDF.

| Key | Default | Range | Meaning / evidence |
| --- | --- | --- | --- |
| lineWidth | 2 ref px | .5–8 | Narrow-core 1/e width; estimated, .57px at 520px height |
| innerWidth | 9.6 ref px | 2–50 | Inward 1/e width; measured fit, 2.73px at 520px height |
| outerWidth | 4 ref px | 0–40 | External 1/e width; conservative estimate; zero disables it |
| outerOpacity | .04 | 0–.5 | Maximum external alpha; conservative estimate |
| opacity | 1 | 0–1 | Overall alpha multiplier; reuse control |
| speed | 1 | 0–3 | Playback multiplier; zero holds current time |

Live and portable parameter exports include Chinese and English descriptions: `public/downloads/xiaoyi-edge-light.parameters.json`. Finite values are clamped to their range; invalid values use defaults and unknown keys never enter GPU uniforms.

### React integration

Use the existing React and Three.js 0.186.1 dependencies. Copy `CompanionEdgeGlow.jsx`, `edge-renderer.js`, `edge-parameters.js`, `edge-glow.css` and `reference/edge-light-analysis.json`, preserving or adjusting relative imports. The full documentation app is not required. Use the JSX example above: place the overlay inside a positioned surface with actual dimensions and a uniform pixel radius, and clip content in a separate inner element.

The effect does not intercept pointer or keyboard input or add a scrim. Its padded canvas extends beyond the host without changing layout. Host overflow must be visible if external diffusion is desired. `active={false}` clears the light while retaining content. `paused` freezes color; `time={5}` renders a deterministic source-time sample. `radius={24}` supplies an explicit CSS-pixel radius; null reads the host radius. Percentage radii are not automatically resolved.

Reduced motion, offscreen content and hidden pages stop continuous rendering. Unmount releases GPU resources. WebGPU is preferred; `?backend=webgl` selects the same TSL graph's WebGL2 backend. No camera or microphone is required. Color stages are not asserted to represent native Xiaoyi listening/thinking semantics.

### Verification limits

Browser checks cover both rendering backends, pause stability, center/border transparency, measured half/tenth decay widths, increased diffusion after widening, content clicks, reset and bilingual export, reduced motion and companion exit. Source hashes and measurements are reproducible. Narrow-core separation, outer halo, corner detail, continuous colors and loop joining remain reconstructed; no pixel-identity claim is made.
