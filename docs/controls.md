# 常用控件 · 2.1

[中文](#中文) · [English](#english)

## 中文

已在组件库新增六组示例、九个可复用 React 导出：Card、Slider、ActionChip、BottomChips、Toast、Switch、Checkbox、RadioGroup、Progress。入口为 `#components`，可按类别筛选或从顶部搜索。原有按钮、消息、服务卡片和交互面板继续保留。

## Reference 与还原范围

新增 W10–W17 八条一手资料，完整地址、阅读范围、访问日期在 `reference/web-sources.json`。卡片层级依据华为设计指南；Slider、Chip、Toast、选择控件与进度依据 OpenHarmony 官方文档。底部建议的排列、浅紫色表面和输入区延续本地 L09 / L15 的小艺参考。

OpenHarmony API 说明可支撑行为与状态，不能直接证明某个小艺版本的具体界面。本次为小艺设计系统的常用控件补全，具体文案、网页布局、颜色与尺寸属于研究性重建。未调用 ArkUI 或系统服务。

| 类型          | 参考                                                                                                                                                  | 核对内容                                                                    |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 信息/操作卡片 | [W10 华为鸿蒙卡片](https://developer.huawei.com/consumer/cn/doc/design-guides/harmonyos-widget2-0000002731312633)                                     | 信息层级与核心操作；官方正文由搜索索引读取，直接抓取受限                    |
| Slider        | [W11 官方文档与图](https://github.com/openharmony/docs/blob/master/zh-cn/application-dev/reference/apis-arkui/arkui-ts/ts-basic-components-slider.md) | 细轨道 / 内嵌形态，范围、步长、步长点、提示                                 |
| Chip          | [W12 官方文档与图](https://github.com/openharmony/docs/blob/master/zh-cn/application-dev/reference/apis-arkui/arkui-ts/ohos-arkui-advanced-Chip.md)   | 激活、禁用、图标、独立关闭动作                                              |
| Toast         | [W13 官方文档与图](https://github.com/openharmony/docs/blob/master/zh-cn/application-dev/reference/apis-arkui/js-apis-promptAction.md)                | API 12+ 浅色圆角示例；默认 1500ms，范围 1500–10000ms；原生 bottom 默认 80vp |
| Switch        | [W14 Toggle](https://github.com/openharmony/docs/blob/master/zh-cn/application-dev/reference/apis-arkui/arkui-ts/ts-basic-components-toggle.md)       | 开/关状态与变化事件                                                         |
| Radio         | [W15 Radio](https://github.com/openharmony/docs/blob/master/zh-cn/application-dev/reference/apis-arkui/arkui-ts/ts-basic-components-radio.md)         | 互斥；API 12+ 默认勾选图案                                                  |
| Checkbox      | [W16 Checkbox](https://github.com/openharmony/docs/blob/master/zh-cn/application-dev/reference/apis-arkui/arkui-ts/ts-basic-components-checkbox.md)   | 独立选择状态；混合状态为网页可用性补充                                      |
| Progress      | [W17 Progress](https://github.com/openharmony/docs/blob/master/zh-cn/application-dev/reference/apis-arkui/arkui-ts/ts-basic-components-progress.md)   | value / total 与线形、环形形态                                              |

三张官方示例预览位于 `public/reference/controls/W11–W13.jpg`。由原图或 GIF 代表帧缩放并转换 JPEG；记录原始 URL、抽帧序号、原始及派生 SHA-256。作者 OpenHarmony contributors，许可 [CC BY 4.0](https://github.com/openharmony/docs/blob/master/LICENSE)。组件旁的“查看官方示例图”可展开核对，图像没有作为控件本身的贴图。

## 复用与参数

```jsx
import {
  Card,
  Slider,
  ActionChip,
  BottomChips,
  Toast,
  Switch,
  Checkbox,
  RadioGroup,
  Progress,
} from "./src/components";
```

也可从 `src/controls/index.jsx` 单独导入；该文件会引入 `controls.css`。需要项目的 `tokens.css` 与通用字体/按钮样式。

| 导出        | Props 与默认值                                                                                                                          | 状态 / 注意                                                                                                                  |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Card        | title, eyebrow, description, icon, children, footer; variant='surface'; selected=false                                                  | surface / tinted，内容与 footer 操作分开；不创建可嵌套按钮的整卡点击                                                         |
| Slider      | label, value, onChange; min=0, max=100, step=1, unit='%'; variant='outset'; disabled=false, showSteps=false, showTips=true, formatValue | 受控数值；outset / inset；原生 range 提供鼠标、触摸与方向键/Home/End。值钳制到有效范围，非法范围恢复 100 单位跨度            |
| ActionChip  | children, icon, onClick, onClose, closeLabel; selected=undefined, disabled=false, size='normal'                                         | selected 未传时为动作按钮；传布尔值时有 aria-pressed。关闭按钮单独命名与响应，不触发主动作                                   |
| BottomChips | items=[{id,label,icon,disabled}], selected, onSelect, label='小艺建议', disabled=false                                                  | 在所属 dock 内布局与横向滚动；焦点进入时自动露出相应建议。外层负责停靠位置                                                   |
| Toast       | toast=null 或 {id,message,duration}; onDismiss; bottom=80; variant='light'; position='contained'                                        | id 每次触发唯一；duration 默认/下限 1500、上限 10000ms；light 参考、dark 为扩展；contained 相对宿主，viewport 相对浏览器视口 |
| Switch      | label, description, checked, onChange, disabled=false                                                                                   | 原生 checkbox + role=switch；Space 切换，禁用不可操作                                                                        |
| Checkbox    | children, checked, onChange, disabled=false, indeterminate=false                                                                        | 原生多选；混合态同步 DOM indeterminate 与 aria-checked=mixed；父组件负责分组逻辑                                             |
| RadioGroup  | label, options=[{value,label,disabled}], value, onChange; disabled=false, segmented=false                                               | 同一组只选一个；原生方向键切换；segmented 仍保持单选语义                                                                     |
| Progress    | label, value=0, total=100, variant='linear', indeterminate=false                                                                        | linear / ring；值钳制到 0–total；未知进度不提供 aria-valuenow；示例定时增长仅为本地模拟                                      |

### 数值与视觉

`src/controls/catalog.js` 是界面参数标注与来源 ID 的元数据源。CSS 使用已有色彩与圆角 Tokens，并保留以下估值：

| 项               | 网页实现值                                                                              |
| ---------------- | --------------------------------------------------------------------------------------- |
| 卡片             | 圆角 20px、内边距 20px（窄屏 17px）；小卡片 16px 圆角                                   |
| Slider           | 细轨道 4px、内嵌轨道 24px、滑动命中高度 44px、细轨道滑块 24px；刻度点最多 21 个         |
| Chip             | 常规最小高 40px、紧凑 32px、间距 8px；常规/紧凑圆角 20/16px                             |
| Toast            | 默认底部 80 CSS px + safe-area；字体 13px（窄屏 12px），圆角 26px；入场 180ms、位移 8px |
| Switch           | 44×28px、滑块 22px、位移 16px；变化 180ms                                               |
| Checkbox / Radio | 标记 22px，选择行最小高 44px                                                            |
| Progress         | 线形高 6px；环形画布 72px、圆半径 30px、笔画 4px；未知进度周期 1400ms                   |

CSS px 与原生 vp 并不构成设备无关的精确换算。Toast bottom=80 是网页近似；没有实现 ArkUI 的软键盘自动避让，嵌入真机网页时应由宿主根据 VisualViewport / 安全区域处理。

## 行为与无障碍

- 卡片：展开按钮提供 aria-expanded；可选择卡片通过 aria-pressed 说明状态；禁用保留布局。
- Slider：顶部始终显示当前值；焦点/拖动显示气泡；label 与 input 关联；不创建重复的读屏滑块。
- Chip：可关闭标签包含独立关闭按钮；底部建议作为 action，不保持虚假的选中态；长列表不撑宽页面。
- Toast：挂在稳定的 polite live region，不抢焦点、不阻断底层点击、不增加遮罩。相同宿主仅显示最新一条；替换及卸载清除旧定时器。
- 进度：aria-valuenow 随实际示例值变化；停止后不继续递增；完成状态可重置。
- prefers-reduced-motion：移除 Toast 入场和不确定进度旋转；反馈仍保留文字与静态形态。

## 演示内容边界

卡片内日程、建议回复、文档处理和网络提示均为本地示例；“复制内容”按钮展示 Toast 状态，不读取或修改系统剪贴板。没有新增账号、网络调用或权限请求。真实复制功能仍位于已有 AssistantMessage 控件。

---

## English

Six specimen groups and nine reusable React exports are available under `#components`: Card, Slider, ActionChip, BottomChips, Toast, Switch, Checkbox, RadioGroup and Progress. Category filters and global search locate them. Existing buttons, messages, service cards and assistant panels remain available.

### References and scope

W10–W17 add eight primary sources. Full URLs, access dates and reading scope are in `reference/web-sources.json` and the linked reference table above. Huawei's card guide supports hierarchy. Official OpenHarmony Slider, Chip, PromptAction, Toggle, Radio, Checkbox and Progress documentation supports behavior. Dock arrangement, pale violet surfaces and input positioning follow local L09 / L15.

Framework APIs do not establish a particular Xiaoyi release's exact appearance. Copy, web layout, colors and dimensions are research reconstructions. No ArkUI or system service is invoked. W10's indexed text was readable, but direct fetching was restricted. Slider references cover OutSet/InSet, range, steps and tips; Chip covers activation, disabled state, icons and separate deletion. Toast's API 12+ figure is light, with native default bottom 80vp and duration 1500–10000ms. Radio uses the API 12+ tick; mixed checkboxes are a web accessibility extension. Progress uses value/total with linear or ring forms.

Three figures under `public/reference/controls/W11–W13.jpg` were resized from original images or representative GIF frames and converted to JPEG. URLs, frame index, source/derivative SHA-256 and transformations are recorded. Credit: OpenHarmony contributors, [CC BY 4.0](https://github.com/openharmony/docs/blob/master/LICENSE). Expand View official example beside the specimen. The images are references, not control textures.

### Reuse and props

Import the nine exports from `src/components` as in the code above, or directly from `src/controls/index.jsx`, which imports `controls.css`. Shared tokens and typography/button styles are required.

| Export      | Props and defaults                                                                                                                      | States / behavior                                                                                                                                                              |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Card        | title, eyebrow, description, icon, children, footer; variant='surface'; selected=false                                                  | surface / tinted; content and footer actions are separate; no whole-card nested button                                                                                         |
| Slider      | label, value, onChange; min=0, max=100, step=1, unit='%'; variant='outset'; disabled=false, showSteps=false, showTips=true, formatValue | Controlled value; outset / inset; native range supports pointer, touch, arrows, Home/End. Clamp values; invalid ranges recover to a 100-unit span                              |
| ActionChip  | children, icon, onClick, onClose, closeLabel; selected=undefined, disabled=false, size='normal'                                         | Without selected: action button. Boolean selected adds aria-pressed. Separately named close button does not trigger the main action                                            |
| BottomChips | items=[{id,label,icon,disabled}], selected, onSelect, label='Xiaoyi suggestions', disabled=false                                        | Horizontal scroll within the dock; focus reveals its suggestion. Host controls docking                                                                                         |
| Toast       | toast=null or {id,message,duration}; onDismiss; bottom=80; variant='light'; position='contained'                                        | Unique id per trigger. Duration default/minimum 1500, maximum 10000ms. Light follows reference; dark is an extension. Contained is host-relative; viewport is browser-relative |
| Switch      | label, description, checked, onChange, disabled=false                                                                                   | Native checkbox with switch role; Space toggles; disabled blocks changes                                                                                                       |
| Checkbox    | children, checked, onChange, disabled=false, indeterminate=false                                                                        | Native checkbox; synchronize DOM indeterminate and aria-checked=mixed. Parent owns group logic                                                                                 |
| RadioGroup  | label, options=[{value,label,disabled}], value, onChange; disabled=false, segmented=false                                               | Exclusive group with native arrow keys; segmented retains radio semantics                                                                                                      |
| Progress    | label, value=0, total=100, variant='linear', indeterminate=false                                                                        | Linear/ring; clamp 0–total; unknown progress omits aria-valuenow. Timer growth is a local simulation                                                                           |

### Dimensions and appearance

`src/controls/catalog.js` owns annotation and source IDs. CSS reuses tokens, with these estimated web values:

| Item             | Implementation                                                                           |
| ---------------- | ---------------------------------------------------------------------------------------- |
| Card             | Radius 20px; padding 20px / narrow 17px; small-card radius 16px                          |
| Slider           | Thin track 4px, inset 24px, target height 44px, thumb 24px; up to 21 marks               |
| Chip             | Regular minimum height 40px, compact 32px, gap 8px; radii 20/16px                        |
| Toast            | Bottom 80 CSS px + safe-area; font 13px / narrow 12px; radius 26px; entry 180ms over 8px |
| Switch           | 44×28px; thumb 22px; travel 16px; transition 180ms                                       |
| Checkbox / Radio | Mark 22px; target row at least 44px                                                      |
| Progress         | Linear 6px; ring canvas 72px, radius 30px, stroke 4px; unknown cycle 1400ms              |

CSS px is not an exact device-independent conversion of native vp. Toast bottom=80 is approximate. Native ArkUI keyboard avoidance is not implemented; an embedded mobile host should account for VisualViewport and safe areas.

### Behavior and accessibility

Expandable cards expose aria-expanded; selected cards expose aria-pressed. Disabled states preserve layout. Sliders always show their current value, add focus/drag tips and associate labels with native inputs, without duplicate slider roles. Closable chips have independent close buttons; dock actions do not maintain a false selection state. Long lists stay within the page.

Toast uses a stable polite live region, does not steal focus, block pointer input or add a scrim. Only the latest message is shown per host; replacement and unmount clear previous timers. Progress values reflect the actual demo state, stop when paused and reset after completion. Reduced motion removes toast entry animation and indeterminate rotation while preserving text and static feedback.

Calendar data, suggestion replies, document processing and network messages are local examples. Copy content only demonstrates a toast; it does not access the clipboard. Actual copying remains in AssistantMessage. No accounts, service requests or permissions are introduced.
