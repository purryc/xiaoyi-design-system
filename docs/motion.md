# Three.js TSL 光球 · 2.2

[中文](#中文) · [English](#english)

## 中文

本实现使用 Three.js 0.186.1 的 `WebGPURenderer` 与 `MeshBasicNodeMaterial.fragmentNode`。主环、拖影、扩散环、旋转环、球心与透明衰减由 TSL 数学节点在 GPU 绘制；没有视频/图片纹理，没有 CSS 环形叠层。左侧视频仅供同步对照。

## 坐标、单位与模型

画布中心为原点，半高为 1，向右/向上为正。1118 × 700 原片中，1 = 350 px；`radius=.46` 是主环参考尺度，实际轮廓会乘入各时点测量半径。RGB 光场系数采用线性光；颜色控件以 sRGB 输入，由 Three.js 转换。

- 高斯核 `G(d,w) = exp(-(d/w)^2)`；w 是 1/e 半宽，不是直径或 FWHM。
- 历史背景拟合（不再参与实时输出）`B(x,y) = b0 + b1*x + b2*y + b3*x*y + Σ bj*G(length(p-cj),wj)`。4 个多项式项 + 6 个高斯场；各时点是 10 个 RGB 向量。
- 六个场的 `(x,y,width)`：`(0,0,.36)`、`(0,0,.7)`、`(-.45,.4,.7)`、`(.45,-.4,.7)`、`(.4,.45,1)`、`(-.4,-.45,1)`。参数保存在 `light-field-fit.json.lobes`。
- 主环中心 `(.035,0)`；半径 `r(θ)=c0+Σ(ck*cos(kθ)+sk*sin(kθ))`，k=1..4。`radius[]` 按常数、cos1、sin1…cos4、sin4 排列，单位半高。三、四阶及二阶系数在拟合后缩小以抑制峰值检测噪声，详见拟合脚本。
- 主环辐射 `radiance[]` 使用相同 9 项结构，每项 RGB 向量；控制高光沿环的不均匀分布。
- 主环亮芯、近场、远场权重 `.68 / .25 / .07`；各宽度与增益对应下表。
- 旋转环以 `cos(tilt)` 压缩局部 x 轴，然后旋转到屏幕。三个环相位为 `a`、`-.85a+.8`、`.6a-.6`，其中 `a=(time-14.5)*gyroSpeed+.05`。这是拟合姿态，不是原产品的真实三维骨架。
- 拖影半径为主环尺度的 `1.09`，位置偏移分别为 `sin(1.6t)` / `cos(1.3t)` 乘 `echoOffset`；宽度 `4*lineWidth`，强度 `0.9*echoOpacity`。
- 最多展开 5 个扩散环；age 为 `(time/ripplePeriod+i/rippleCount) mod 1`，半径增加 `age*rippleTravel`；0–.15 渐入，.45–1 渐出。
- 独立组件构图缩放 `.62`，原片对照为 1；设 edge=framing*min(aspect,1)，透明度在径向 .82*edge–edge 衰减到精确 0；源片比例和图标比例都没有方块背景。

38 个采样时点的完整系数保存在 `reference/light-field-fit.json`。时点间用 `x²(3−2x)` 插值。颜色系数是数据拟合值，不是每帧视频像素缓存；无纹理上传。修改源码模型时需同步更新本说明。

## 时间轴

| 秒          | 观察到的形态   | 阶段权重                              |
| ----------- | -------------- | ------------------------------------- |
| 0–3.3       | 单环与偏心拖影 | echo 为主                             |
| 3.3–13.4    | 同心环扩散     | 3.15–3.75 渐入，13.15–13.6 渐出       |
| 13.4–15.8   | 交错旋转环     | 13.35–13.85 渐入，15.5–16.15 渐出     |
| 15.8–18.6   | 收束与余波     | 16.1–16.7 渐入 .55 强度，18.4–19 渐出 |
| 18.6–23.217 | 单环与偏心拖影 | 回到单环                              |

`idle/listening/thinking/speaking/error` 是设计系统演示语义，与这五段可见形态分开。模式覆盖 ripple/gyro/echo 权重，参数与采样时间仍可变化。23.217 秒回绕，原片头尾并非严格无缝，循环边界存在轻微变化。

## 可调参数

参数源 `src/motion/parameters.js` 同时生成面板、规范表与 JSON。导入仅接收白名单键，拒绝非法色值，有限数值钳制到范围。参数仅在相应阶段生效：例如旋转速度影响旋转环，扩散数量影响扩散阶段。

| 参数 / key                   | 默认    | 范围 / 单位       | 作用与依据                                                                 |
| ---------------------------- | ------- | ----------------- | -------------------------------------------------------------------------- |
| 主环半径 / `radius`          | 0.46    | 0.25–0.7 / H/2    | 以画布半高为 1；0.46 为参考尺度，实际半径随各时点拟合轮廓变化。 拟合 · L10 |
| 亮芯线宽 / `lineWidth`       | 0.006   | 0.002–0.022 / H/2 | 高斯亮芯的半宽，决定细白光线的锐度；700 px 高时默认约 2.1 px。 拟合 · L10  |
| 轮廓起伏 / `wobble`          | 0.012   | 0–0.05 / H/2      | 主环低频形变振幅，0 为完美圆。 拟合 · L10 0–3s                             |
| 拖影偏移 / `echoOffset`      | 0.036   | 0–0.1 / H/2       | 偏心光带相对主环的位移，保留原片的非对称尾迹。 拟合 · L10 0–3s             |
| 旋转环倾角 / `gyroTilt`      | 1.06    | 0–1.42 / rad      | 投影到屏幕的倾角；cos(倾角) 控制椭圆短轴，约 60.7°。 拟合 · L10 14–16s     |
| 近场泛光宽度 / `bloomWidth`  | 0.025   | 0.005–0.09 / H/2  | 亮芯外侧的柔和辉光半宽；独立于线宽。 拟合 · L10                            |
| 远场光晕宽度 / `haloWidth`   | 0.105   | 0.03–0.28 / H/2   | 更低频的大范围彩色散射，让亮线融入底色。 拟合 · L10                        |
| 主环亮度 / `intensity`       | 1.35    | 0.3–3 / ×         | 亮芯增益，过高会使彩色区域趋近白色。 拟合 · L10                            |
| 近场泛光强度 / `bloom`       | 0.72    | 0–1.6 / ×         | 彩色高斯泛光的叠加强度。 拟合 · L10                                        |
| 远场光晕强度 / `halo`        | 0.3     | 0–0.9 / ×         | 大范围散射的强度。 拟合 · L10                                              |
| 球心色深 / `coreDepth`       | 0.68    | 0–1 / ×           | 球心蓝紫色对背景的覆盖程度，0 时接近空心。 拟合 · L10                      |
| 拖影强度 / `echoOpacity`     | 0.34    | 0–0.8 / α         | 主环附近偏心光带的可见度。 拟合 · L10 0–3s                                 |
| 扩散环强度 / `rippleOpacity` | 0.18    | 0–0.6 / α         | 同心外环发光程度，保持次于主环。 拟合 · L10 4–13s                          |
| 扩散环数量 / `rippleCount`   | 3       | 1–5 / 层          | 扩散阶段同时参与计算的同心环数量；默认 3 层。 观察/拟合 · L10              |
| 扩散周期 / `ripplePeriod`    | 3.1     | 1–6 / s           | 一圈从起始半径运动到最外缘所需时间。 拟合 · L10 4–13s                      |
| 扩散距离 / `rippleTravel`    | 0.39    | 0.1–0.65 / H/2    | 外环在一个周期内向外移动的径向距离。 拟合 · L10                            |
| 色带角速度 / `colorSpeed`    | 0.72    | -2–2 / rad/s      | 颜色沿主环的流动速度；负值反向，不影响几何旋转。 拟合 · L10                |
| 环面角速度 / `gyroSpeed`     | 2.25    | 0.2–5 / rad/s     | 交错旋转阶段的几何运动速度。 拟合 · L10 14–16s                             |
| 呼吸周期 / `breathPeriod`    | 3.4     | 1–8 / s           | 微弱半径呼吸的一个完整周期。 拟合 · L10                                    |
| 呼吸幅度 / `breathAmount`    | 0.012   | 0–0.07 / ×radius  | 相对主环半径的呼吸幅度。 拟合 · L10                                        |
| 青色光 / `cyan`              | #54f7ef | #RRGGBB / sRGB    | 主环青色段和冷色散射。 观感拟合 · L10                                      |
| 粉色光 / `pink`              | #ffaadf | #RRGGBB / sRGB    | 主环粉色段与拖影暖色。 观感拟合 · L10                                      |
| 暖白高光 / `warm`            | #fff1d4 | #RRGGBB / sRGB    | 主环最亮部分的暖白色。 观感拟合 · L10                                      |
| 球心蓝 / `coreColor`         | #678ddd | #RRGGBB / sRGB    | 球心基础色，通过 coreDepth 混合。 观感拟合 · L10                           |
| 环境紫 / `auraColor`         | #9184e6 | #RRGGBB / sRGB    | 主环外侧低频紫色光场。 观感拟合 · L10                                      |
| 播放倍率 / `speed`           | 1       | 0.1–2 / ×         | 整个 23.217 s 参考时间轴的速率，1 为原速。 复刻工具                        |
| 渲染像素比 / `pixelRatio`    | 1.5     | 1–2 / DPR         | Canvas 像素密度上限；较大数值更锐利但增加 GPU 工作量。 实现参数            |
| 帧率上限 / `maxFps`          | 60      | 15–60 / fps       | 限制重绘频率；暂停、不可见或减少动态效果时按需绘制。 实现参数              |

## 复用

```jsx
import { TslOrb } from './src/motion/TslOrb';
<TslOrb state="listening" size={160}
  parameters={{ radius: 0.46, cyan: '#54f7ef', maxFps: 30 }} />
<TslOrb state="reference" reference time={14.5} paused />
```

受控 `time` 单位为秒。`reference` 模式需给外层确定宽高或原片纵横比。自动时钟每帧增量限制 0.1 s，防止重新显示时跳跃；脱离视口、后台文档、暂停时不重复重绘。减少动态效果暂停自动时钟，受控寻帧仍可显示指定时刻。

渲染器优先 WebGPU，不支持时同一 TSL 图编译到 WebGL2；`?backend=webgl` 可验证此路径。GPU 初始化失败会明确显示错误，不以静态视频伪装成功。浏览器卸载组件时释放 geometry、material、renderer、RAF 和观察器。

## 重建与代理

```sh
python3 scripts/analyze-motion.py  # Pillow + FFmpeg，保留现有代理元数据
python3 scripts/fit-light-field.py # Pillow + NumPy；显式光场拟合
npm run build
npm run check
npm test
```

代理是本地 L10 转出的 960 px、30fps H.264、CRF20、无音频文件；其 SHA-256 与尺寸记录在 motion-analysis.json。HTML video 是对照时钟，右侧渲染读取相同的 currentTime；视频 seek 完成与下一次 GPU 提交间可能相差一帧。

## 已知拟合误差

阶段顺序、单环/扩散/交错结构均已实现。亮芯宽度、背景颜色分布、角向亮度、扩散环相位和高速环姿态仍有可见差异，特别是 14–16 秒的拖影与交错光带。没有原始 shader 或官方矢量，未通过逐像素一致性验收。页面保留原片并排对照；测试通过表示实现可运行、可操作，不等于图像误差为零。

## 透明合成 · 2.2

所有光球采用 alpha 画布、透明清屏和紧支撑径向边缘。球心为 `G(radial, radius*.88)*coreDepth*.53`，光能为 `clamp(length(light)*.85,0,1)`；两者相加限制后乘边缘衰减得到 alpha。RGB 由球心/环境色与光带组合，按有效覆盖率归一化。录屏背景仅留在左侧 video 和分析数据里，不进入实时颜色合成。白、深、蓝、粉与棋盘格是宿主 CSS 背景，切换时不重建材质。半径调得过大时会在画布内柔和裁切；可增大宿主或用 reference 构图保留更宽扩散范围。

---

## English

This implementation uses Three.js 0.186.1, `WebGPURenderer` and `MeshBasicNodeMaterial.fragmentNode`. TSL math nodes draw the main ring, echo, ripples, rotating rings, core and transparent falloff on the GPU. There are no image/video textures or CSS ring layers. The separate video on the left is a synchronized reference only.

### Coordinates and model

Origin: canvas center. Half-height: 1. Positive axes: right and up. In the 1118×700 source, one unit is 350px. `radius=.46` is a scale applied to measured contours. Radiance uses linear RGB; sRGB color inputs are converted by Three.js.

- Gaussian kernel: `G(d,w)=exp(-(d/w)^2)`. Width is the 1/e half-width, not diameter or FWHM.
- Archived background fit, no longer used in live output: `B=b0+b1*x+b2*y+b3*x*y+Σ bj*G(length(p-cj),wj)`. Four polynomial terms and six Gaussian lobes give ten RGB vectors per sample.
- Archived lobe `(x,y,width)` values: `(0,0,.36)`, `(0,0,.7)`, `(-.45,.4,.7)`, `(.45,-.4,.7)`, `(.4,.45,1)`, `(-.4,-.45,1)`, stored in `light-field-fit.json.lobes`.
- Main-ring center: `(.035,0)`. Radius: `r(θ)=c0+Σ(ck*cos(kθ)+sk*sin(kθ))`, k=1..4. Array order: constant, cos1, sin1…cos4, sin4, in half-height units. Higher-order coefficients are attenuated to reduce peak-detection noise; see the fitting script.
- Radiance uses the same nine-term layout with RGB vectors to vary highlights around the ring.
- Core, near and far profile weights are `.68 / .25 / .07`; widths and gains are exposed below.
- Rotating rings compress local x by `cos(tilt)` and rotate in screen space. Phases: `a`, `-.85a+.8`, `.6a-.6`, where `a=(time-14.5)*gyroSpeed+.05`. This is a fitted projection, not the original product's 3D rig.
- Echo radius is `1.09` times the main scale; offsets use `sin(1.6t)` / `cos(1.3t)` times echoOffset; width is `4*lineWidth`, intensity `0.9*echoOpacity`.
- Up to five ripples are unrolled. Age: `(time/ripplePeriod+i/rippleCount) mod 1`; radius grows by `age*rippleTravel`; fade in 0–.15, fade out .45–1.
- Standalone framing is `.62`; reference framing is 1. With `edge=framing*min(aspect,1)`, alpha fades over `.82*edge–edge` to exactly zero at the boundary in both modes.

The 38 samples in `reference/light-field-fit.json` interpolate using `x²(3−2x)`. These are fitted coefficients, not cached video pixels; no texture upload occurs. Keep this document synchronized when changing the model.

### Timeline

| Seconds     | Observed form                   | Weights                                  |
| ----------- | ------------------------------- | ---------------------------------------- |
| 0–3.3       | Single ring and off-center echo | Echo dominant                            |
| 3.3–13.4    | Concentric expansion            | Fade in 3.15–3.75; out 13.15–13.6        |
| 13.4–15.8   | Intersecting rings              | Fade in 13.35–13.85; out 15.5–16.15      |
| 15.8–18.6   | Contraction and afterglow       | Fade in to .55 at 16.1–16.7; out 18.4–19 |
| 18.6–23.217 | Single ring and echo            | Return to single ring                    |

Idle/listening/thinking/speaking/error are demo semantics, distinct from observed stages. Modes override ripple/gyro/echo weights while sampled time can continue. The 23.217s loop is not perfectly seamless because the source endpoints differ slightly.

### Parameters

`src/motion/parameters.js` generates the panel, specification and JSON. Imports accept allowlisted keys, reject invalid colors and clamp finite numbers. Parameters affect relevant stages only, such as gyro speed during rotation and ripple count during expansion.

| Parameter / key                      | Default | Range / Unit      | Effect and evidence                                                                                            |
| ------------------------------------ | ------- | ----------------- | -------------------------------------------------------------------------------------------------------------- |
| Main ring radius / `radius`          | 0.46    | 0.25–0.7 / H/2    | Half-height is 1; 0.46 is the reference scale. The actual radius follows each sampled contour. Fitted · L10    |
| Bright core width / `lineWidth`      | 0.006   | 0.002–0.022 / H/2 | Gaussian core half-width controls sharpness; approximately 2.1 px at a 700 px height. Fitted · L10             |
| Contour wobble / `wobble`            | 0.012   | 0–0.05 / H/2      | Low-frequency contour deformation; 0 produces a perfect circle. Fitted · L10 0–3s                              |
| Echo offset / `echoOffset`           | 0.036   | 0–0.1 / H/2       | Displacement of the off-center light band, preserving the source's asymmetric trail. Fitted · L10 0–3s         |
| Ring tilt / `gyroTilt`               | 1.06    | 0–1.42 / rad      | Projection tilt; its cosine controls the ellipse's short axis. About 60.7° by default. Fitted · L10 14–16s     |
| Near bloom width / `bloomWidth`      | 0.025   | 0.005–0.09 / H/2  | Soft glow half-width outside the core, independent of line width. Fitted · L10                                 |
| Far halo width / `haloWidth`         | 0.105   | 0.03–0.28 / H/2   | Broad, low-frequency colored scattering blends the bright line into its surroundings. Fitted · L10             |
| Main ring intensity / `intensity`    | 1.35    | 0.3–3 / ×         | Bright-core gain; high values push colored areas toward white. Fitted · L10                                    |
| Near bloom intensity / `bloom`       | 0.72    | 0–1.6 / ×         | Intensity of the added colored Gaussian bloom. Fitted · L10                                                    |
| Far halo intensity / `halo`          | 0.3     | 0–0.9 / ×         | Intensity of broad scattering. Fitted · L10                                                                    |
| Core depth / `coreDepth`             | 0.68    | 0–1 / ×           | Opacity of the blue-violet core over its host; 0 approaches a hollow ring. Fitted · L10                        |
| Echo intensity / `echoOpacity`       | 0.34    | 0–0.8 / α         | Visibility of the off-center band near the main ring. Fitted · L10 0–3s                                        |
| Ripple intensity / `rippleOpacity`   | 0.18    | 0–0.6 / α         | Brightness of concentric outer rings, subordinate to the main ring. Fitted · L10 4–13s                         |
| Ripple count / `rippleCount`         | 3       | 1–5 / rings       | Number of concentric rings computed during expansion; default 3. Observed / Fitted · L10                       |
| Ripple period / `ripplePeriod`       | 3.1     | 1–6 / s           | Time for one ring to travel from its starting radius to the outer edge. Fitted · L10 4–13s                     |
| Ripple travel / `rippleTravel`       | 0.39    | 0.1–0.65 / H/2    | Radial distance traveled by an outer ring during one cycle. Fitted · L10                                       |
| Color angular speed / `colorSpeed`   | 0.72    | -2–2 / rad/s      | Color flow along the ring. Negative values reverse color flow without changing geometry rotation. Fitted · L10 |
| Ring angular speed / `gyroSpeed`     | 2.25    | 0.2–5 / rad/s     | Geometry speed during the intersecting-ring phase. Fitted · L10 14–16s                                         |
| Breathing period / `breathPeriod`    | 3.4     | 1–8 / s           | Duration of one subtle radius-breathing cycle. Fitted · L10                                                    |
| Breathing amplitude / `breathAmount` | 0.012   | 0–0.07 / ×radius  | Breathing amplitude relative to the main ring radius. Fitted · L10                                             |
| Cyan light / `cyan`                  | #54f7ef | #RRGGBB / sRGB    | Cyan ring segments and cool scattering. Visual fit · L10                                                       |
| Pink light / `pink`                  | #ffaadf | #RRGGBB / sRGB    | Pink ring segments and warm echoes. Visual fit · L10                                                           |
| Warm highlights / `warm`             | #fff1d4 | #RRGGBB / sRGB    | Warm white in the brightest parts of the ring. Visual fit · L10                                                |
| Core blue / `coreColor`              | #678ddd | #RRGGBB / sRGB    | Base core color, blended through coreDepth. Visual fit · L10                                                   |
| Aura violet / `auraColor`            | #9184e6 | #RRGGBB / sRGB    | Low-frequency violet light around the main ring. Visual fit · L10                                              |
| Playback speed / `speed`             | 1       | 0.1–2 / ×         | Speed of the 23.217 s timeline; 1 is the original rate. Reconstruction tool                                    |
| Pixel ratio / `pixelRatio`           | 1.5     | 1–2 / DPR         | Canvas pixel-density limit. Higher values sharpen the image but increase GPU work. Implementation parameter    |
| Frame-rate limit / `maxFps`          | 60      | 15–60 / fps       | Limits redraw frequency. Paused, hidden or reduced-motion scenes render on demand. Implementation parameter    |

### Reuse and rendering

Use `TslOrb` as in the JSX example above. `time` is controlled seconds. Reference framing needs a host with defined dimensions or the source aspect ratio. Automatic clock deltas cap at 0.1s to prevent jumps after returning. Hidden, offscreen or paused scenes do not continuously redraw. Reduced motion pauses the automatic clock; explicit seeking still works.

WebGPU is preferred; the same TSL graph compiles to WebGL2 when needed. `?backend=webgl` forces that path. Initialization failure is shown explicitly, never disguised by a static video. Unmount disposes geometry, material, renderer, animation frames and observers.

Rebuild analysis with `python3 scripts/analyze-motion.py` (Pillow + FFmpeg, preserving proxy metadata) and `python3 scripts/fit-light-field.py` (Pillow + NumPy), then build, check and test. The L10 proxy is 960px, 30fps, H.264, CRF20, no audio; its hash and dimensions are recorded. HTML video supplies the comparison clock; a seek and GPU submission can differ by one frame.

### Transparent composition in 2.2

Every orb uses an alpha canvas, transparent clear and compact radial support. Core coverage is `G(radial,radius*.88)*coreDepth*.53`; light energy is `clamp(length(light)*.85,0,1)`. Their clamped sum is multiplied by edge falloff to obtain alpha. RGB combines core/aura color and the light bands, normalized by effective coverage. Recording backgrounds remain in source video and archived analysis only. White, dark, blue, pink and checkerboard surfaces are host CSS; changing them does not rebuild the material. Oversized radius settings softly clip within the canvas; increase host space or use reference framing for wider ripples.

### Known differences

Stage order and single, expanding and intersecting structures are implemented. Bright cores, angular radiance, ripple phase and fast poses still differ, especially at 14–16 seconds. No original shader or official vector source is available and no pixel-identity acceptance test has passed. Side-by-side comparison remains available. Functional tests establish operability, not zero image error.
