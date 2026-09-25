# Xiaoyi Icon Library · 2.2

[中文](#中文) · [English](#english)

## 中文

77 枚手绘 SVG；47 枚参考重绘、30 枚风格扩展。统一 24 × 24 坐标、1.65 默认笔画、圆端点和圆连接。参考重绘是轮廓拟合，不是官方 Symbol 文件。只见文字功能名、未确认图形的项目归为扩展。

## 文件

- src/icons/icon-data.js：全部可编辑路径、标签、类别、别名与来源。
- src/icons/Icon.jsx：React 组件，未知 name 明确报错。
- public/icons/*.svg：77 枚独立 currentColor 矢量。
- public/icons/sprite.svg：77 个 symbol，ID 前缀 xy-。
- public/icons/manifest.json：可移植清单与全部几何。
- public/downloads/xiaoyi-icons.zip：以上矢量、sprite、manifest、README 共 80 个文件。

运行 node scripts/build-icons.mjs 可重建所有导出。单枚下载保留当前尺寸、颜色和笔画；完整 ZIP 使用统一默认值。

## React / HTML

```jsx
import { Icon } from "./src/icons/Icon";
<Icon name="summarize" size={24} strokeWidth={1.65} />;
```

```html
<svg width="24" height="24" aria-hidden="true">
  <use href="/icons/sprite.svg#xy-summarize" />
</svg>
```

组件 svg 默认装饰性 aria-hidden；图标按钮需要调用方提供可读的 aria-label。无内嵌字体、位图、外部图标包或线上请求。SVG 下载色值限制为 #RRGGBB 或 currentColor。

## 覆盖与来源

| ID             | 中文       | 类别 | 来源               |
| -------------- | ---------- | ---- | ------------------ |
| arrow-up       | 向上       | 导航 | L09 · 重绘         |
| arrow-down     | 向下       | 导航 | L11 · 重绘         |
| arrow-left     | 返回       | 导航 | L09,L15 · 重绘     |
| arrow-right    | 前进       | 导航 | 风格扩展           |
| chevron-down   | 下拉       | 导航 | L12 · 重绘         |
| chevron-up     | 上拉       | 导航 | 风格扩展           |
| chevron-left   | 上一项     | 导航 | 风格扩展           |
| chevron-right  | 下一项     | 导航 | L17 · 重绘         |
| close          | 关闭       | 导航 | L09,L11,L12 · 重绘 |
| plus           | 添加       | 导航 | L15 · 重绘         |
| minus          | 减去       | 导航 | 风格扩展           |
| more           | 更多       | 导航 | 风格扩展           |
| grid-four      | 四点菜单   | 导航 | L09,L15 · 重绘     |
| menu           | 菜单       | 导航 | 风格扩展           |
| expand         | 展开       | 导航 | L06 · 重绘         |
| collapse       | 收起       | 导航 | 风格扩展           |
| undo           | 撤销       | 编辑 | L09 · 重绘         |
| redo           | 重做       | 编辑 | L09 · 重绘         |
| keyboard       | 键盘       | 输入 | L06,L11 · 重绘     |
| microphone     | 麦克风     | 输入 | L06,L18 · 重绘     |
| microphone-off | 麦克风关闭 | 输入 | 风格扩展           |
| camera         | 摄像头     | 输入 | L06 · 重绘         |
| camera-off     | 关闭摄像头 | 输入 | L06 · 重绘         |
| headphones     | 耳机       | 声音 | L15 · 重绘         |
| volume         | 声音       | 声音 | L11 · 重绘         |
| volume-off     | 静音       | 声音 | L11 · 重绘         |
| audio-wave     | 声波       | 声音 | L09 · 重绘         |
| send           | 发送       | 输入 | L09 · 重绘         |
| attach         | 附件       | 输入 | 风格扩展           |
| image          | 图片       | 内容 | L12 · 重绘         |
| scan           | 识图搜索   | 智能 | L12 · 重绘         |
| eye            | 识别屏幕   | 智能 | L15 · 重绘         |
| sparkles       | 小艺智能   | 智能 | L09,L12 · 重绘     |
| summarize      | 摘要       | 帮写 | L09 · 重绘         |
| proofread      | 校正文本   | 帮写 | L09 · 重绘         |
| rewrite        | 润色改写   | 帮写 | L09 · 重绘         |
| tone           | 语气改写   | 帮写 | L09 · 重绘         |
| expand-text    | 扩写       | 帮写 | L09 · 重绘         |
| paragraph      | 分段小结   | 帮写 | L09 · 重绘         |
| meeting        | 会议排版   | 帮写 | L09 · 重绘         |
| mindmap        | 生成脑图   | 智能 | 风格扩展           |
| translate      | 翻译       | 智能 | L13 · 重绘         |
| circle-select  | 圈选       | 智能 | L12 · 重绘         |
| screen-analyze | 识屏分析   | 智能 | 风格扩展           |
| bookmark       | 收藏       | 内容 | 风格扩展           |
| file           | 文档       | 内容 | L05,L07 · 重绘     |
| clipboard      | 剪贴板     | 内容 | 风格扩展           |
| copy           | 复制       | 编辑 | L13 · 重绘         |
| book           | 阅读       | 内容 | 风格扩展           |
| folder         | 文件夹     | 内容 | 风格扩展           |
| calendar       | 日历       | 服务 | 风格扩展           |
| clock          | 时间       | 服务 | 风格扩展           |
| map-pin        | 位置       | 服务 | 风格扩展           |
| search         | 搜索       | 导航 | L11,L15 · 重绘     |
| edit           | 编辑       | 编辑 | L09 · 重绘         |
| check          | 完成       | 反馈 | L09 · 重绘         |
| list-checks    | 校验清单   | 反馈 | 风格扩展           |
| heart          | 喜欢       | 反馈 | L15 · 重绘         |
| star           | 星标       | 反馈 | L15 · 重绘         |
| share          | 分享       | 内容 | L12,L13 · 重绘     |
| refresh        | 重新生成   | 反馈 | 风格扩展           |
| settings       | 设置       | 导航 | 风格扩展           |
| download       | 下载       | 内容 | 风格扩展           |
| upload         | 上传       | 内容 | 风格扩展           |
| trash          | 删除       | 编辑 | 风格扩展           |
| link           | 链接       | 内容 | 风格扩展           |
| message        | 对话       | 内容 | L15 · 重绘         |
| stop           | 停止       | 声音 | L11 · 重绘         |
| align-left     | 段落       | 编辑 | 风格扩展           |
| play           | 播放       | 声音 | L11 · 重绘         |
| pause          | 暂停       | 声音 | 风格扩展           |
| history        | 历史       | 内容 | 风格扩展           |
| warning        | 提醒       | 反馈 | 风格扩展           |
| info           | 信息       | 反馈 | 风格扩展           |

这套库覆盖本项目所有界面调用和已确认的小艺控件。参考中出现的应用 Logo、第三方品牌与系统状态栏并不等于小艺图标资产，未将这些品牌图形伪装成官方图标包。

---

## English

77 hand-drawn SVGs: 47 reference redraws and 30 style extensions. Shared 24×24 coordinates, default stroke 1.65, round caps and joins. Redraws fit observed contours; they are not official Symbol files. Functions whose labels are visible but whose glyphs are unconfirmed are classified as extensions.

### Files and reuse

- `src/icons/icon-data.js`: editable paths, labels, categories, aliases and provenance.
- `src/icons/Icon.jsx`: React component; unknown names throw an explicit error.
- `public/icons/*.svg`: 77 standalone currentColor vectors.
- `public/icons/sprite.svg`: 77 symbols prefixed `xy-`.
- `public/icons/manifest.json`: portable metadata and geometry.
- `public/downloads/xiaoyi-icons.zip`: 80 files including vectors, sprite, manifest and README.

Run `node scripts/build-icons.mjs` to regenerate exports. Single-icon downloads retain the chosen size, color and stroke; the full ZIP uses defaults. The React and HTML examples above are language-independent. SVGs are decorative by default with aria-hidden; icon buttons require accessible labels from their caller. No embedded fonts, bitmaps, external icon packages or network requests. Download colors accept #RRGGBB or currentColor.

### Coverage and provenance

| ID             | Label               | Category     | Source               |
| -------------- | ------------------- | ------------ | -------------------- |
| arrow-up       | Up                  | Navigation   | L09 · Redraw         |
| arrow-down     | Down                | Navigation   | L11 · Redraw         |
| arrow-left     | Back                | Navigation   | L09,L15 · Redraw     |
| arrow-right    | Forward             | Navigation   | Style extension      |
| chevron-down   | Chevron down        | Navigation   | L12 · Redraw         |
| chevron-up     | Chevron up          | Navigation   | Style extension      |
| chevron-left   | Previous            | Navigation   | Style extension      |
| chevron-right  | Next                | Navigation   | L17 · Redraw         |
| close          | Off                 | Navigation   | L09,L11,L12 · Redraw |
| plus           | Add                 | Navigation   | L15 · Redraw         |
| minus          | Subtract            | Navigation   | Style extension      |
| more           | More                | Navigation   | Style extension      |
| grid-four      | Four-dot menu       | Navigation   | L09,L15 · Redraw     |
| menu           | Menu                | Navigation   | Style extension      |
| expand         | Expand              | Navigation   | L06 · Redraw         |
| collapse       | Collapse            | Navigation   | Style extension      |
| undo           | Undo                | Edit         | L09 · Redraw         |
| redo           | Redo                | Edit         | L09 · Redraw         |
| keyboard       | Keyboard            | Input        | L06,L11 · Redraw     |
| microphone     | Microphone          | Input        | L06,L18 · Redraw     |
| microphone-off | Microphone off      | Input        | Style extension      |
| camera         | Camera              | Input        | L06 · Redraw         |
| camera-off     | Turn camera off     | Input        | L06 · Redraw         |
| headphones     | Headphones          | Sound        | L15 · Redraw         |
| volume         | Sound               | Sound        | L11 · Redraw         |
| volume-off     | Mute                | Sound        | L11 · Redraw         |
| audio-wave     | Sound wave          | Sound        | L09 · Redraw         |
| send           | Send                | Input        | L09 · Redraw         |
| attach         | Attachment          | Input        | Style extension      |
| image          | Image               | Content      | L12 · Redraw         |
| scan           | Visual search       | Intelligence | L12 · Redraw         |
| eye            | Read screen         | Intelligence | L15 · Redraw         |
| sparkles       | Xiaoyi intelligence | Intelligence | L09,L12 · Redraw     |
| summarize      | Summary             | Writing      | L09 · Redraw         |
| proofread      | Proofread           | Writing      | L09 · Redraw         |
| rewrite        | Polish              | Writing      | L09 · Redraw         |
| tone           | Change tone         | Writing      | L09 · Redraw         |
| expand-text    | Expand              | Writing      | L09 · Redraw         |
| paragraph      | Section summaries   | Writing      | L09 · Redraw         |
| meeting        | Meeting format      | Writing      | L09 · Redraw         |
| mindmap        | Create mind map     | Intelligence | Style extension      |
| translate      | Translate           | Intelligence | L13 · Redraw         |
| circle-select  | Circle selection    | Intelligence | L12 · Redraw         |
| screen-analyze | Screen analysis     | Intelligence | Style extension      |
| bookmark       | Save                | Content      | Style extension      |
| file           | Document            | Content      | L05,L07 · Redraw     |
| clipboard      | Clipboard           | Content      | Style extension      |
| copy           | Copy                | Edit         | L13 · Redraw         |
| book           | Reading             | Content      | Style extension      |
| folder         | Folder              | Content      | Style extension      |
| calendar       | Calendar            | Service      | Style extension      |
| clock          | Time                | Service      | Style extension      |
| map-pin        | Location            | Service      | Style extension      |
| search         | Search              | Navigation   | L11,L15 · Redraw     |
| edit           | Edit                | Edit         | L09 · Redraw         |
| check          | Done                | Feedback     | L09 · Redraw         |
| list-checks    | Checklist           | Feedback     | Style extension      |
| heart          | Like                | Feedback     | L15 · Redraw         |
| star           | Star                | Feedback     | L15 · Redraw         |
| share          | Share               | Content      | L12,L13 · Redraw     |
| refresh        | Regenerate          | Feedback     | Style extension      |
| settings       | Settings            | Navigation   | Style extension      |
| download       | Download            | Content      | Style extension      |
| upload         | Upload              | Content      | Style extension      |
| trash          | Delete              | Edit         | Style extension      |
| link           | Link                | Content      | Style extension      |
| message        | Conversation        | Content      | L15 · Redraw         |
| stop           | Stop                | Sound        | L11 · Redraw         |
| align-left     | Paragraph           | Edit         | Style extension      |
| play           | Play                | Sound        | L11 · Redraw         |
| pause          | Pause               | Sound        | Style extension      |
| history        | History             | Content      | Style extension      |
| warning        | Reminder            | Feedback     | Style extension      |
| info           | Information         | Feedback     | Style extension      |

W18 补充：`phone-end` 挂断电话、`camera-flip` 翻转摄像头、`video-camera` 视频通话，均为官方界面参考重绘。

W18 additions: `phone-end` (end call), `camera-flip` (flip camera), `video-camera` (video call), all redrawn from the official interface figures.
