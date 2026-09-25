# Xiaoyi Design System · 小艺设计系统

基于真实截图和录屏复刻的小艺设计系统，用于设计研究、交互审阅和原型开发。包含可浏览的文档站点、React 组件、CSS 变量、可编辑 JSON Tokens 和 5 个完整交互样例。

这是独立研究复刻，**不是华为官方设计系统**。结构依据参考还原；数值和动效语义的推断均有标注。AI、麦克风、摄像头、识图、跨应用操作为本地模拟，不调用真实小艺服务。

![系统预览](docs/preview.png)

## 开始使用

需要 Node.js 20.19+ 或 22.12+。

```sh
npm ci
npm run dev
```

打开 [本地设计系统](http://127.0.0.1:5197)。端口固定为 5197，避免悄悄打开另一个项目。

```sh
npm run build    # 重新生成 tokens.css 与下载资源，构建静态站点
npm run check    # 清单、来源、原始媒体哈希、Tokens 与下载资源一致性
npm test         # Chrome 中检查页面、交互、下载与减少动态效果
```

浏览器测试默认使用本机 Chrome。如未安装 Chrome，可安装 Playwright Chromium 并从 `playwright.config.js` 中移除 `channel: 'chrome'`。原始参考不随仓库上传，克隆后仍能独立运行站点与浏览器测试；`check` 会明确报告是否验证到本地原始媒体。

## 内容

| 内容 | 范围 |
| --- | --- |
| 设计基础 | 46 个变量：14 色、11 间距、6 圆角、7 字号、6 时长、2 曲线 |
| 组件 | 光球、按钮、图标按钮、建议胶囊、输入条、消息、服务卡片、帮写面板、伴随侧栏、圈选结果、导航条 |
| 动效 | 待机、聆听、思考、回应；暂停、尺寸、明暗表面、减少动态效果 |
| 交互范式 | 伴随阅读、上下文帮写、全屏对话、圈选问答、拖给小艺 |
| 参考 | 18 个本地文件（13 图、5 视频；其中两图是同一内容），43 张轻量衍生预览，9 条网络资料 |
| 文档 | 设计规格、组件 API、状态与来源、还原边界、验证报告 |

## 目录

- `src/components.jsx`：独立导出的 React 组件与演示组合。
- `src/main.jsx`：7 个页面与文档导航、全局搜索、参考对话框。
- `src/styles.css`：组件及文档样式，使用 `.xy-` 前缀区分基础组件。
- `tokens/xiaoyi.tokens.json`：可编辑变量源。采用带 `$type` / `$value` 的本项目格式，未承诺通过最新 DTCG 验证。
- `src/tokens.css`：由源 Tokens 生成；不要手动修改。
- `reference/manifest.json`：文件来源、哈希、分辨率、时长、采样时间与观察记录。
- `reference/web-sources.json`：官方说明和视频平台线索。
- `public/reference/`：原图缩略图及录屏采样帧，保留来源关系。
- `docs/`：交付文档与站点预览。
- `scripts/`：生成、完整性检查与浏览器测试。
- `qa/`：本地测试记录和截图，不提交。

完整原始参考保留在相邻 `../小艺/` 中，未更名、移动、改写或复制原始媒体。要重新生成预览，运行 `npm run inventory`（需要 Python Pillow 与 FFmpeg；脚本默认使用 macOS Arial Unicode 字体），然后 `npm run build`。观察文字会按哈希保留。`seed-data.py` 是首次建库的初始化脚本，不应作为日常更新命令。

## 复用

```jsx
import { Orb, Chip, AssistantInput } from './src/components.jsx';
import './src/tokens.css';
import './src/styles.css';

<Orb state="listening" size={96} />
<Chip onClick={() => summarize()}>总结一下</Chip>
<AssistantInput onSubmit={(text) => submit(text)} />
```

这份组件源码适合直接移入 React 原型。当前样式含文档站点的全局排版规则，嵌入既有产品时需先隔离全局 `body` / `button` 等选择器；本次没有发布 npm 包。详见 [组件 API](docs/components.md)。

## 证据与版本

- [设计规格](docs/design-spec.md)：视觉基础、布局比例、状态模型、行为与边界。
- [完整证据表](docs/evidence.md)：每个本地来源和网站的覆盖范围。
- [验证报告](docs/verification.md)：实际执行的检查、浏览器与局限。
- [GitHub 仓库](https://github.com/purryc/xiaoyi-design-system)：私有源码与文档备份；没有部署公网服务。

小艺 / HarmonyOS 品牌、截图及视频素材的权利归各自权利人。Lucide 图标按其 ISC 许可使用，属于原图标的替代。HarmonyOS Sans 不随项目分发，优先读取本机字体，否则回退系统中文字体。见 [归属说明](docs/attribution.md)。
