# React 组件 API

[中文](#中文) · [English](#english)

## 中文

导入入口 `src/components.jsx`。样式依赖 `src/tokens.css` 与 `src/styles.css`。目前为源码组件库，不是独立发布的软件包。

| 导出               | 主要属性                                                                        | 状态/行为                               | 来源                      |
| ------------------ | ------------------------------------------------------------------------------- | --------------------------------------- | ------------------------- |
| `Icon`             | `name, size=20, strokeWidth=1.65`                                               | 77 枚自绘 SVG，装饰性图标 aria-hidden   | L09 / L15 外形参考        |
| `IconButton`       | `icon, label, ...buttonProps`                                                   | label 为可访问名称；原生 disabled/focus | 推断的工程封装            |
| `Button`           | `variant=primary, icon, children`                                               | primary/secondary/ghost；按下、禁用     | L02 / L09                 |
| `Chip`             | `active, icon, children`                                                        | 普通与选择态；onClick 由调用者提供      | L15 / L16                 |
| `Orb`              | `state=idle, size=100, paused=false, parameters={}, time=null, reference=false` | idle/listening/thinking/speaking/error  | L10 / L18；语义见设计规格 |
| `AssistantInput`   | `onSubmit, placeholder, disabled`                                               | 去首尾空白、空输入禁发、提交后清空      | L07 / L09 / L11           |
| `UserMessage`      | `children`                                                                      | 右对齐气泡                              | L11                       |
| `AssistantMessage` | `children`                                                                      | 左对齐文本；字符串复制                  | L11                       |
| `ServiceCard`      | `type=calendar`                                                                 | calendar/travel 两类静态结构            | L01 / L05；内容为示例     |
| `WritingSheet`     | `onClose, onApply`                                                              | 类型/生成中/结果/替换；卸载清理         | L09                       |
| `WritingDemo`      | 无                                                                              | 完整笔记+面板演示；本地状态             | L09                       |
| `Article`          | `selected, onSelect`                                                            | 阅读容器，选中文本视觉可选              | L13 / L15；内容为示例     |
| `CompanionDemo`    | `initialExpanded=false`                                                         | 窄栏/展开/关闭；按住输入、取消生成      | L11 / L14 / L15 / L18     |
| `ConversationDemo` | 无                                                                              | 本地消息、实时对话、看世界示例          | L06 / L07 / L08           |
| `Landscape`        | 无                                                                              | 自绘树与山湖 SVG；非源图复制            | 原型示例                  |
| `SelectionDemo`    | 无                                                                              | 固定选区、结果、返回、下载、文本复制    | L12；识别能力模拟         |
| `NavigationBar`    | `onDrop, onClick`                                                               | HTML text/plain 拖入、悬停高亮          | L07 视觉 + W03 行为       |
| `DragDemo`         | 无                                                                              | 拖入文档与触屏/键盘替代                 | W03                       |

`writingTools` 导出工具配置（图标名与中文标签）。`icons` 导出替代图标映射。

## 集成示例

```jsx
const [value, setValue] = useState("");
const [open, setOpen] = useState(true);

return (
  <>
    <p>{value}</p>
    {open && <WritingSheet onClose={() => setOpen(false)} onApply={setValue} />}
  </>
);
```

`WritingSheet` 定位为绝对底部：宿主必须设置 `position: relative` 与合适尺寸。示例组件包含固定文案，接入真实服务时应把生成逻辑移到上层，并处理权限、取消、失败、重试与外部副作用。

## CSS 与变量

所有基础变量以 `--xy-` 开头。只有部分演示样式严格使用语义变量；细节光效、文档装饰与缩放布局包含明确的局部值。变更 Tokens 后运行 `npm run build`，生成 CSS 与下载副本，再执行 `npm run check`。

组件样式和站点排版目前合并在一个 CSS 文件。将组件嵌入已有产品时，先隔离全局排版规则；无需引入参考缩略图或整个文档站点。

## 当前不包含

原生 ArkUI/ArkTS 组件、Figma 组件库、官方图标字体包、真实语音合成/识别、智能图像分割、实时相机识别、系统手势接口、完整暗色主题、真实个人日程数据。

## TSL 与图标复用

`Orb` 是 `TslOrb` 的兼容导出，动态加载 `orb-renderer.js`；组件卸载时销毁 geometry / material / renderer 和观察器。`time` 为秒，传入时采用受控时间轴；`reference` 仅使用原片比例，背景仍透明。尺寸由宿主决定，不创建真实麦克风输入。

`CompanionEdgeGlow` 从 `src/motion/CompanionEdgeGlow.jsx` 单独导出。将其放在有实际尺寸和统一圆角的相对定位宿主内；参数单位、透明叠加和完整 React 示例见[伴随边缘光复用说明](edge-light.md)。

`<Icon name="summarize" size={24} strokeWidth={1.65}/>` 可使用规范英文 ID 或旧名称别名。单枚 SVG、sprite 与来源见 `public/icons/`。[图标规格](icons.md)与[动效模型](motion.md)记录全部参数。

## 常用控件补全 · 2.1

增加 Card、Slider、ActionChip、BottomChips、Toast、Switch、Checkbox、RadioGroup、Progress 九个导出，与原有组件共同从 `src/components.jsx` 复用。组件库增加六组可操作示例、分类筛选与顶部搜索。完整 Props、状态、尺寸估值和 Reference 见 [常用控件规格](controls.md)。

## 看世界与双语 · 2.2

`src/vision/VisionDemo.jsx` 导出 VisionDemo 与 VisionReference。VisionDemo 支持 embedded=false、onHangup；摄像头、前后镜头、字幕、静音、挂断/重开都是本地状态。照片来自 W18 官方示例裁切，不读取设备。界面通过 LanguageProvider 与 JSX 展示边界翻译；状态键、文件名、URL 和用户输入保持原值。

---

## English

Import from `src/components.jsx`, with `src/tokens.css` and `src/styles.css`. This is a source library, not a separately published package.

| Export           | Main props                                                                    | State / behavior                                              | Source                                       |
| ---------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------- |
| Icon             | name, size=20, strokeWidth=1.65                                               | 77 SVGs; decorative aria-hidden                               | L09 / L15                                    |
| IconButton       | icon, label, buttonProps                                                      | Accessible label; native disabled/focus                       | Engineering wrapper                          |
| Button           | variant=primary, icon, children                                               | primary / secondary / ghost; pressed and disabled             | L02 / L09                                    |
| Chip             | active, icon, children                                                        | Default or selected; caller supplies onClick                  | L15 / L16                                    |
| Orb              | state=idle, size=100, paused=false, parameters={}, time=null, reference=false | idle / listening / thinking / speaking / error                | L10 / L18; semantics in design specification |
| AssistantInput   | onSubmit, placeholder, disabled                                               | Trim input; block empty submission; clear after sending       | L07 / L09 / L11                              |
| UserMessage      | children, literal=false                                                       | Right-aligned bubble; literal preserves user-entered language | L11                                          |
| AssistantMessage | children                                                                      | Left-aligned text; string copy action                         | L11                                          |
| ServiceCard      | type=calendar                                                                 | Static calendar / travel structures                           | L01 / L05; fictional content                 |
| WritingSheet     | onClose, onApply                                                              | Type / generating / result / replace; unmount cleanup         | L09                                          |
| WritingDemo      | None                                                                          | Note and sheet with local state                               | L09                                          |
| Article          | selected, onSelect                                                            | Reading container with optional selection appearance          | L13 / L15; fictional content                 |
| CompanionDemo    | initialExpanded=false                                                         | Narrow / expanded / closed; hold to talk; cancel generation   | L11 / L14 / L15 / L18                        |
| ConversationDemo | None                                                                          | Local messages, live call and vision example                  | L06 / L07 / L08 / W18                        |
| Landscape        | None                                                                          | Self-drawn tree, mountain and lake SVG                        | Prototype illustration                       |
| SelectionDemo    | None                                                                          | Fixed selection, results, back, download, text copy           | L12; simulated recognition                   |
| NavigationBar    | onDrop, onClick                                                               | HTML text/plain drop and hover highlight                      | L07 visual + W03 behavior                    |
| DragDemo         | None                                                                          | Document drag and touch/keyboard alternative                  | W03                                          |

`writingTools` exports tool names and labels; `icons` exports the icon lookup. The integration example in the Chinese section uses `WritingSheet` with parent-managed visibility and replacement text; its code is language-independent. The host must provide relative positioning and suitable dimensions because the sheet is anchored to its bottom. For a real service, move generation logic to the parent and handle permissions, cancellation, failures, retries and external side effects.

All base variables use `--xy-`. Some demo details, light effects and scaled layouts use explicit local values. After changing tokens, run `npm run build` and `npm run check`. Isolate global site typography before embedding; reference previews and the entire documentation site are not required.

Not included: native ArkUI / ArkTS, a Figma library, official icon fonts, real speech recognition/synthesis, smart segmentation, live camera recognition, system gestures, a complete dark theme or personal calendar data.

### Motion, icons and common controls

`Orb` is a compatible export of `TslOrb` and dynamically loads its renderer. Unmounting disposes geometry, material, renderer, animation frame and observers. `time` is controlled seconds; `reference` changes framing only and keeps transparency. The host sets dimensions; no microphone is accessed.

`CompanionEdgeGlow` is exported separately from `src/motion/CompanionEdgeGlow.jsx`. Place it inside a positioned host with real dimensions and a uniform corner radius. See the [edge-light reuse guide](edge-light.md#english) for units, transparent composition, all six parameters and a complete React example.

Use `<Icon name="summarize" size={24} strokeWidth={1.65}/>` with a canonical ID or legacy alias. SVGs, sprite and manifest are under `public/icons/`. See [icons](icons.md#english) and [motion](motion.md#english).

Nine common controls are also exported: Card, Slider, ActionChip, BottomChips, Toast, Switch, Checkbox, RadioGroup and Progress. Six interactive groups include filters and global search. Complete props, state rules, dimensions and sources are in [controls](controls.md#english).

### Vision and localization

`src/vision/VisionDemo.jsx` exports `VisionDemo` and `VisionReference`. Props: `embedded=false`, `onHangup`. Camera, facing, captions, mute, hang-up and restart are local states. Images are crops from W18, never live capture.

`LanguageProvider` and a JSX presentation boundary translate visible text and accessible names. State keys, source filenames, URLs and user input retain their original values. Use the configured JSX import source when copying the localization system into another application.
