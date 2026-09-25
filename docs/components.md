# React 组件 API

导入入口 `src/components.jsx`。样式依赖 `src/tokens.css` 与 `src/styles.css`。目前为源码组件库，不是独立发布的软件包。

| 导出 | 主要属性 | 状态/行为 | 来源 |
| --- | --- | --- | --- |
| `Icon` | `name, size=20` | Lucide 替代图标，装饰性图标 aria-hidden | L09 / L15 外形参考 |
| `IconButton` | `icon, label, ...buttonProps` | label 为可访问名称；原生 disabled/focus | 推断的工程封装 |
| `Button` | `variant=primary, icon, children` | primary/secondary/ghost；按下、禁用 | L02 / L09 |
| `Chip` | `active, icon, children` | 普通与选择态；onClick 由调用者提供 | L15 / L16 |
| `Orb` | `state=idle, size=100, paused=false` | idle/listening/thinking/speaking/error | L10 / L18；语义见设计规格 |
| `AssistantInput` | `onSubmit, placeholder, disabled` | 去首尾空白、空输入禁发、提交后清空 | L07 / L09 / L11 |
| `UserMessage` | `children` | 右对齐气泡 | L11 |
| `AssistantMessage` | `children` | 左对齐文本；字符串复制 | L11 |
| `ServiceCard` | `type=calendar` | calendar/travel 两类静态结构 | L01 / L05；内容为示例 |
| `WritingSheet` | `onClose, onApply` | 类型/生成中/结果/替换；卸载清理 | L09 |
| `WritingDemo` | 无 | 完整笔记+面板演示；本地状态 | L09 |
| `Article` | `selected, onSelect` | 阅读容器，选中文本视觉可选 | L13 / L15；内容为示例 |
| `CompanionDemo` | `initialExpanded=false` | 窄栏/展开/关闭；按住输入、取消生成 | L11 / L14 / L15 / L18 |
| `ConversationDemo` | 无 | 本地消息、实时对话、相机占位 | L06 / L07 / L08 |
| `Landscape` | 无 | 自绘树与山湖 SVG；非源图复制 | 原型示例 |
| `SelectionDemo` | 无 | 固定选区、结果、返回、下载、文本复制 | L12；识别能力模拟 |
| `NavigationBar` | `onDrop, onClick` | HTML text/plain 拖入、悬停高亮 | L07 视觉 + W03 行为 |
| `DragDemo` | 无 | 拖入文档与触屏/键盘替代 | W03 |

`writingTools` 导出工具配置（图标名与中文标签）。`icons` 导出替代图标映射。

## 集成示例

```jsx
const [value, setValue] = useState('');
const [open, setOpen] = useState(true);

return <>
  <p>{value}</p>
  {open && <WritingSheet
    onClose={() => setOpen(false)}
    onApply={setValue}
  />}
</>;
```

`WritingSheet` 定位为绝对底部：宿主必须设置 `position: relative` 与合适尺寸。示例组件包含固定文案，接入真实服务时应把生成逻辑移到上层，并处理权限、取消、失败、重试与外部副作用。

## CSS 与变量

所有基础变量以 `--xy-` 开头。只有部分演示样式严格使用语义变量；细节光效、文档装饰与缩放布局包含明确的局部值。变更 Tokens 后运行 `npm run build`，生成 CSS 与下载副本，再执行 `npm run check`。

组件样式和站点排版目前合并在一个 CSS 文件。将组件嵌入已有产品时，先隔离全局排版规则；无需引入参考缩略图或整个文档站点。

## 当前不包含

原生 ArkUI/ArkTS 组件、Figma 组件库、官方图标字体包、真实语音合成/识别、智能图像分割、实时相机识别、系统手势接口、完整暗色主题、真实个人日程数据。
