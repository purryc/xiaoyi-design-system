export const controlItems = [
  {
    id: "content-cards",
    category: "cards",
    title: "信息与操作卡片",
    subtitle: "CONTENT CARDS",
    description:
      "把关键信息、主操作和附属内容放在一个稳定的容器里。包含信息、可展开、可选择和禁用状态。",
    sources: ["W10"],
    local: ["L06", "L11"],
    params: [
      ["圆角", "20 px"],
      ["内边距", "20 px"],
      ["卡片间距", "12 px"],
    ],
    code: '<Card title="设计讨论会" icon="calendar"\n  description="明天 10:00—11:00"\n  footer={<button>查看日程</button>} />',
  },
  {
    id: "sliders",
    category: "sliders",
    title: "Slider 滑动条",
    subtitle: "VALUE CONTROLS",
    description:
      "连续调节与离散刻度共用一套数值模型。细轨道、内嵌轨道、禁用态，支持拖动、点击轨道和键盘。",
    sources: ["W11"],
    params: [
      ["范围", "0–100 / 自定义"],
      ["轨道", "4 / 24 px"],
      ["触控区域", "44 px"],
    ],
    code: '<Slider label="音量" value={volume}\n  min={0} max={100} step={1}\n  onChange={setVolume} />',
  },
  {
    id: "bottom-chips",
    category: "chips",
    title: "底部 Chip 与建议",
    subtitle: "SUGGESTION DOCK",
    description:
      "建议动作紧邻输入区；筛选、可关闭标签与一次性动作各自保持明确状态。长列表在容器内横向滚动。",
    sources: ["W12"],
    local: ["L09", "L15"],
    params: [
      ["常规 / 紧凑", "40 / 32 px"],
      ["间距", "8 px"],
      ["圆角", "20 / 16 px"],
    ],
    code: "<BottomChips items={suggestions}\n  onSelect={runSuggestion} />\n<ActionChip onClose={remove}>报告</ActionChip>",
  },
  {
    id: "toast",
    category: "feedback",
    title: "Toast 底部轻提示",
    subtitle: "TRANSIENT FEEDBACK",
    description:
      "纯文本反馈，完成后短暂出现，不遮罩、不抢焦点。重复触发替换当前消息，结束自动消失。",
    sources: ["W13"],
    params: [
      ["持续时间", "1500–10000 ms"],
      ["默认时间", "1500 ms"],
      ["底部间距", "80 CSS px ≈ 原生 80 vp"],
    ],
    code: '<Toast toast={{ id, message: "已完成",\n  duration: 1500 }}\n  onDismiss={dismiss} bottom={80} />',
  },
  {
    id: "choice-controls",
    category: "choice",
    title: "开关与选择",
    subtitle: "SELECTION CONTROLS",
    description:
      "开关立即改变设置；单选保持互斥；多选支持全选与部分选择。使用原生表单语义和可见的焦点。",
    sources: ["W14", "W15", "W16"],
    params: [
      ["开关", "44 × 28 px"],
      ["选择标记", "22 px"],
      ["控件触控行", "≥44 px"],
    ],
    code: '<Switch label="自动朗读"\n  checked={enabled} onChange={setEnabled} />\n<Checkbox checked={checked}>正文</Checkbox>',
  },
  {
    id: "progress",
    category: "feedback",
    title: "进度与加载",
    subtitle: "PROGRESS & LOADING",
    description:
      "确定进度使用线形或环形；未知进度使用持续反馈。加载、暂停、完成、重置形成可操作的状态。",
    sources: ["W17"],
    params: [
      ["线形轨道", "6 px"],
      ["环形直径", "72 px"],
      ["总量", "total > 0"],
    ],
    code: '<Progress label="整理文档"\n  value={progress} total={100} />\n<Progress variant="ring" indeterminate />',
  },
];
