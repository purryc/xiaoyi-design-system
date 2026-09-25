/** Hand-authored 24×24 stroke geometry. No external icon package or bitmap tracing. */
const P = (d) => ["path", { d }],
  C = (cx, cy, r) => ["circle", { cx, cy, r }],
  R = (x, y, width, height, rx = 0) => ["rect", { x, y, width, height, rx }],
  L = (x1, y1, x2, y2) => ["line", { x1, y1, x2, y2 }];
const entries = [
  [
    "phone-end",
    "挂断电话",
    "声音",
    [],
    [
      [
        "path",
        {
          d: "M3 10.5c5-5.2 13-5.2 18 0v4c0 .8-.6 1.3-1.4 1.1l-4-1c-.6-.2-1-.6-1-1.2v-2a10 10 0 0 0-5.2 0v2c0 .6-.4 1-1 1.2l-4 1C3.6 15.8 3 15.3 3 14.5Z",
          fill: "currentColor",
          stroke: "none",
        },
      ],
    ],
    "W18",
  ],
  [
    "camera-flip",
    "翻转摄像头",
    "输入",
    [],
    [
      P("M5 8h3l1-3h6l1 3h3v9H5Z"),
      C(12, 12, 3),
      P("M3 15c-2 4 3 6 8 6m10-6c2 4-3 6-8 6m-4-2 2 2-2 2"),
    ],
    "W18",
  ],
  [
    "video-camera",
    "视频通话",
    "输入",
    [],
    [
      [
        "rect",
        {
          x: 3,
          y: 6,
          width: 12,
          height: 12,
          rx: 3,
          fill: "currentColor",
          stroke: "none",
        },
      ],
      [
        "path",
        { d: "m17 9 4-2v10l-4-2Z", fill: "currentColor", stroke: "none" },
      ],
    ],
    "W18",
  ],
  [
    "arrow-up",
    "向上",
    "导航",
    ["ArrowUp"],
    [P("M12 20V4m-6 6 6-6 6 6")],
    "L09",
  ],
  [
    "arrow-down",
    "向下",
    "导航",
    ["ArrowDown"],
    [P("M12 4v16m-6-6 6 6 6-6")],
    "L11",
  ],
  [
    "arrow-left",
    "返回",
    "导航",
    ["ArrowLeft"],
    [P("m14.5 4.5-7.5 7.5 7.5 7.5")],
    "L09,L15",
  ],
  [
    "arrow-right",
    "前进",
    "导航",
    ["ArrowRight"],
    [P("m9.5 4.5 7.5 7.5-7.5 7.5")],
    "extension",
  ],
  [
    "chevron-down",
    "下拉",
    "导航",
    ["ChevronDown"],
    [P("m6.5 9.5 5.5 5 5.5-5")],
    "L12",
  ],
  [
    "chevron-up",
    "上拉",
    "导航",
    ["ChevronUp"],
    [P("m6.5 14.5 5.5-5 5.5 5")],
    "extension",
  ],
  [
    "chevron-left",
    "上一项",
    "导航",
    ["ChevronLeft"],
    [P("m14.5 6.5-5 5.5 5 5.5")],
    "extension",
  ],
  [
    "chevron-right",
    "下一项",
    "导航",
    ["ChevronRight"],
    [P("m9.5 6.5 5 5.5-5 5.5")],
    "L17",
  ],
  [
    "close",
    "关闭",
    "导航",
    ["X"],
    [P("m5.5 5.5 13 13m0-13-13 13")],
    "L09,L11,L12",
  ],
  ["plus", "添加", "导航", ["Plus"], [P("M12 5v14M5 12h14")], "L15"],
  ["minus", "减去", "导航", ["Minus"], [P("M5 12h14")], "extension"],
  [
    "more",
    "更多",
    "导航",
    ["MoreHorizontal"],
    [C(5, 12, 1), C(12, 12, 1), C(19, 12, 1)],
    "extension",
  ],
  [
    "grid-four",
    "四点菜单",
    "导航",
    ["Grip"],
    [C(7, 6.5, 1.5), C(17, 6.5, 1.5), C(7, 17.5, 1.5), C(17, 17.5, 1.5)],
    "L09,L15",
  ],
  [
    "menu",
    "菜单",
    "导航",
    ["Menu"],
    [P("M4 6h16M4 12h16M4 18h16")],
    "extension",
  ],
  [
    "expand",
    "展开",
    "导航",
    ["Maximize"],
    [P("M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5")],
    "L06",
  ],
  [
    "collapse",
    "收起",
    "导航",
    ["Minimize"],
    [P("M4 9h5V4m11 5h-5V4M4 15h5v5m11-5h-5v5")],
    "extension",
  ],
  [
    "undo",
    "撤销",
    "编辑",
    ["Undo"],
    [P("M8 5 3.5 9 8 13M4 9h10.5a5.5 5.5 0 0 1 0 11H7")],
    "L09",
  ],
  [
    "redo",
    "重做",
    "编辑",
    ["Redo"],
    [P("m16 5 4.5 4-4.5 4m4-4H9.5a5.5 5.5 0 0 0 0 11H17")],
    "L09",
  ],
  [
    "keyboard",
    "键盘",
    "输入",
    ["Keyboard"],
    [
      R(3, 6, 18, 13, 3),
      P(
        "M6.5 10h.01m3.5 0h.01m3.5 0h.01m3.5 0h.01M6.5 13h.01m3.5 0h.01m3.5 0h.01m3.5 0h.01M8 16h8",
      ),
    ],
    "L06,L11",
  ],
  [
    "microphone",
    "麦克风",
    "输入",
    ["Mic"],
    [R(9, 3, 6, 12, 3), P("M5.5 11v1a6.5 6.5 0 0 0 13 0v-1M12 18.5V22")],
    "L06,L18",
  ],
  [
    "microphone-off",
    "麦克风关闭",
    "输入",
    ["MicOff"],
    [
      P(
        "M9 7V6a3 3 0 0 1 6 0v5M9 10v2a3 3 0 0 0 4.5 2.6M5.5 11v1a6.5 6.5 0 0 0 11.2 4.5M18.5 11v1a6.5 6.5 0 0 1-.3 2M12 18.5V22M3 3l18 18",
      ),
    ],
    "extension",
  ],
  [
    "camera",
    "摄像头",
    "输入",
    ["Camera"],
    [
      P(
        "M8 6 9.5 3.5h5L16 6h3.5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z",
      ),
      C(12, 12.5, 4),
    ],
    "L06",
  ],
  [
    "camera-off",
    "关闭摄像头",
    "输入",
    ["CameraOff"],
    [
      P(
        "M8.5 4.5h6L16 7h3.5a2 2 0 0 1 2 2v7M18 20H4.5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2H6M9.2 10.2a4 4 0 0 0 5.6 5.6M3 3l18 18",
      ),
    ],
    "L06",
  ],
  [
    "headphones",
    "耳机",
    "声音",
    ["Headphones"],
    [P("M4 14V11a8 8 0 0 1 16 0v3"), R(3, 12, 4, 8, 2), R(17, 12, 4, 8, 2)],
    "L15",
  ],
  [
    "volume",
    "声音",
    "声音",
    ["Volume2"],
    [P("M4 9h4l5-4v14l-5-4H4ZM17 8a6 6 0 0 1 0 8m2.5-10.5a9.5 9.5 0 0 1 0 13")],
    "L11",
  ],
  [
    "volume-off",
    "静音",
    "声音",
    ["VolumeX"],
    [P("M4 9h4l5-4v14l-5-4H4Zm13 1 5 5m0-5-5 5")],
    "L11",
  ],
  [
    "audio-wave",
    "声波",
    "声音",
    ["AudioLines"],
    [P("M3 10v4m3-8v12m3-14v16m3-12v8m3-11v14m3-11v8m3-6v4")],
    "L09",
  ],
  [
    "send",
    "发送",
    "输入",
    ["Send"],
    [C(12, 12, 9), P("M12 17V7m-4 4 4-4 4 4")],
    "L09",
  ],
  [
    "attach",
    "附件",
    "输入",
    ["Paperclip"],
    [
      P(
        "m8 13 6.5-6.5a2.1 2.1 0 0 1 3 3L9 18a4 4 0 0 1-5.7-5.7l9-9a5.8 5.8 0 0 1 8.2 8.2l-8.2 8.2",
      ),
    ],
    "extension",
  ],
  [
    "image",
    "图片",
    "内容",
    ["Image"],
    [R(3, 3, 18, 18, 3), C(8, 8, 1.5), P("m4 17 5-5 4 4 3-3 5 5")],
    "L12",
  ],
  [
    "scan",
    "识图搜索",
    "智能",
    ["ScanLine"],
    [
      P(
        "M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3M3 12h18",
      ),
    ],
    "L12",
  ],
  [
    "eye",
    "识别屏幕",
    "智能",
    ["Eye"],
    [P("M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"), C(12, 12, 3)],
    "L15",
  ],
  [
    "sparkles",
    "小艺智能",
    "智能",
    ["Sparkles"],
    [
      P(
        "M12 3c.8 5.5 3.5 8.2 9 9-5.5.8-8.2 3.5-9 9-.8-5.5-3.5-8.2-9-9 5.5-.8 8.2-3.5 9-9ZM20 2v4m-2-2h4",
      ),
    ],
    "L09,L12",
  ],
  [
    "summarize",
    "摘要",
    "帮写",
    ["Summarize"],
    [
      P(
        "M12 4h4a3 3 0 0 1 3 3v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8M9 11h6m-6 4h6M6 2c.4 2.3 1.7 3.6 4 4-2.3.4-3.6 1.7-4 4-.4-2.3-1.7-3.6-4-4 2.3-.4 3.6-1.7 4-4Z",
      ),
    ],
    "L09",
  ],
  [
    "proofread",
    "校正文本",
    "帮写",
    ["Proofread"],
    [
      P(
        "M19 10V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7M8 7h7M8 11h5m1 6 3 3 5-6",
      ),
    ],
    "L09",
  ],
  [
    "rewrite",
    "润色改写",
    "帮写",
    ["Rewrite"],
    [
      P(
        "m7 17 9-9 3 3-9 9-4 1ZM16 8l1.5-1.5a2.1 2.1 0 0 1 3 3L19 11M6 2c.3 2.1 1.9 3.7 4 4-2.1.3-3.7 1.9-4 4-.3-2.1-1.9-3.7-4-4 2.1-.3 3.7-1.9 4-4ZM19 17v5m-2.5-2.5h5",
      ),
    ],
    "L09",
  ],
  [
    "tone",
    "语气改写",
    "帮写",
    ["Tone"],
    [P("M4.6 5.5a9 9 0 1 0 14.8 0M8 9v6m4-8v10m4-7v4M9 3h6")],
    "L09",
  ],
  [
    "expand-text",
    "扩写",
    "帮写",
    ["ExpandText"],
    [R(8, 6, 12, 15, 2), P("M15 3H6a2 2 0 0 0-2 2v12M12 10h4m-4 4h4m-4 3h4")],
    "L09",
  ],
  [
    "paragraph",
    "分段小结",
    "帮写",
    ["Paragraph"],
    [
      P(
        "m3 6 1.5 1.5L7 4m3 2h11M3 12l1.5 1.5L7 10m3 2h11M3 18l1.5 1.5L7 16m3 2h11",
      ),
    ],
    "L09",
  ],
  [
    "meeting",
    "会议排版",
    "帮写",
    ["Meeting"],
    [
      P("M8 5V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1M3 10h18"),
      R(3, 5, 18, 16, 2.5),
      P("M8 14h8m-8 4h6"),
    ],
    "L09",
  ],
  [
    "mindmap",
    "生成脑图",
    "智能",
    ["Mindmap"],
    [
      R(2, 9, 7, 6, 2),
      R(15, 2, 7, 5, 1.5),
      R(15, 17, 7, 5, 1.5),
      P("M9 12h3V4.5h3M12 12v7.5h3"),
    ],
    "extension",
  ],
  [
    "translate",
    "翻译",
    "智能",
    ["Translate"],
    [
      P(
        "M3 5h12M9 2v3m-3 3c1.5 5 4 7 8 8m-2-11c-.7 5.5-3.5 9-8.5 12M13 21l4-11 4 11m-6.5-4h5",
      ),
    ],
    "L13",
  ],
  [
    "circle-select",
    "圈选",
    "智能",
    ["CircleSelect"],
    [
      P(
        "M18.6 17.6c3.2-2.4 3.5-7.2 1.2-10.5S13 2.8 8 4.2 1.4 10 3.7 14.5s7.6 6.5 11.2 3.7C19.5 14.6 13.6 13 12 16c-1.6 3 1 6 4.5 5",
      ),
    ],
    "L12",
  ],
  [
    "screen-analyze",
    "识屏分析",
    "智能",
    ["ScreenAnalyze"],
    [
      R(3, 3, 18, 15, 3),
      P("M8 22h8m-4-4v4M7 10s2-3 5-3 5 3 5 3-2 3-5 3-5-3-5-3Z"),
      C(12, 10, 1),
    ],
    "extension",
  ],
  [
    "bookmark",
    "收藏",
    "内容",
    ["Bookmark"],
    [P("M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-4Z")],
    "extension",
  ],
  [
    "file",
    "文档",
    "内容",
    ["FileText"],
    [
      P(
        "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9ZM14 3v6h6M8 13h8m-8 4h6",
      ),
    ],
    "L05,L07",
  ],
  [
    "clipboard",
    "剪贴板",
    "内容",
    ["Clipboard"],
    [
      P(
        "M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2",
      ),
      R(8, 2, 8, 5, 2),
    ],
    "extension",
  ],
  [
    "copy",
    "复制",
    "编辑",
    ["Copy"],
    [R(8, 8, 12, 13, 2), P("M15 4V3H5a2 2 0 0 0-2 2v11h1")],
    "L13",
  ],
  [
    "book",
    "阅读",
    "内容",
    ["BookOpen"],
    [
      P(
        "M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v15",
      ),
    ],
    "extension",
  ],
  [
    "folder",
    "文件夹",
    "内容",
    ["Folder"],
    [
      P(
        "M3 7V5a2 2 0 0 1 2-2h4l3 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm0 1h18",
      ),
    ],
    "extension",
  ],
  [
    "calendar",
    "日历",
    "服务",
    ["Calendar"],
    [R(3, 5, 18, 16, 3), P("M7 2v6m10-6v6M3 10h18M7 14h2m6 0h2m-10 4h2")],
    "extension",
  ],
  [
    "clock",
    "时间",
    "服务",
    ["Clock"],
    [C(12, 12, 9), P("M12 6v6l4 3")],
    "extension",
  ],
  [
    "map-pin",
    "位置",
    "服务",
    ["MapPin"],
    [P("M12 22s8-8 8-13a8 8 0 0 0-16 0c0 5 8 13 8 13Z"), C(12, 9, 3)],
    "extension",
  ],
  [
    "search",
    "搜索",
    "导航",
    ["Search"],
    [C(10.5, 10.5, 7), P("m16 16 5 5")],
    "L11,L15",
  ],
  [
    "edit",
    "编辑",
    "编辑",
    ["PenLine"],
    [P("m4 15 12-12a2.1 2.1 0 0 1 3 3L7 18l-4 1Zm10-10 3 3M3 22h18")],
    "L09",
  ],
  ["check", "完成", "反馈", ["Check"], [P("m3 12 6 6L21 5")], "L09"],
  [
    "list-checks",
    "校验清单",
    "反馈",
    ["ListChecks"],
    [P("m3 6 2 2 3-4m3 2h10M3 12l2 2 3-4m3 2h10M3 18l2 2 3-4m3 2h10")],
    "extension",
  ],
  [
    "heart",
    "喜欢",
    "反馈",
    ["Heart"],
    [P("M12 21 4 13C-2 6 7-1 12 6c5-7 14 0 8 7Z")],
    "L15",
  ],
  [
    "star",
    "星标",
    "反馈",
    ["Star"],
    [P("m12 2 3.1 6.5 7.1 1-5.1 5 .9 7-6-3.2L6 21.5l.9-7-5.1-5 7.1-1Z")],
    "L15",
  ],
  [
    "share",
    "分享",
    "内容",
    ["Share2"],
    [P("M15 8V3l7 7-7 7v-5c-6 0-9 3-11 7 0-7 3-11 11-11Z")],
    "L12,L13",
  ],
  [
    "refresh",
    "重新生成",
    "反馈",
    ["RefreshCw"],
    [
      P(
        "M20 8a8.5 8.5 0 0 0-14.5-3L3 8m0-5v5h5m-4 8a8.5 8.5 0 0 0 14.5 3L21 16m0 5v-5h-5",
      ),
    ],
    "extension",
  ],
  [
    "settings",
    "设置",
    "导航",
    ["Settings"],
    [
      P(
        "M10 2h4l.8 3 2 .9 2.7-.9 2 3.5-2 2.1v2.3l2 2.1-2 3.5-2.7-.9-2 .9-.8 3h-4l-.8-3-2-.9-2.7.9-2-3.5 2-2.1v-2.3l-2-2.1 2-3.5 2.7.9 2-.9Z",
      ),
      C(12, 11.85, 3),
    ],
    "extension",
  ],
  [
    "download",
    "下载",
    "内容",
    ["Download"],
    [P("M12 2v13m-5-5 5 5 5-5M3 15v5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-5")],
    "extension",
  ],
  [
    "upload",
    "上传",
    "内容",
    ["Upload"],
    [P("M12 15V2M7 7l5-5 5 5M3 15v5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-5")],
    "extension",
  ],
  [
    "trash",
    "删除",
    "编辑",
    ["Trash"],
    [P("M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7")],
    "extension",
  ],
  [
    "link",
    "链接",
    "内容",
    ["Link"],
    [
      P(
        "m10 14 4-4m-5.5-.5-2 2a3.2 3.2 0 0 0 4.5 4.5l3-3a3.2 3.2 0 0 0 0-4.5m1 2 2-2A3.2 3.2 0 0 0 12.5 4l-3 3a3.2 3.2 0 0 0 0 4.5",
      ),
    ],
    "extension",
  ],
  [
    "message",
    "对话",
    "内容",
    ["MessageCircle"],
    [
      P(
        "M21 11a9 9 0 0 1-9 9c-1.7 0-3.2-.4-4.5-1.2L3 21l1.2-4.5A9 9 0 1 1 21 11Z",
      ),
      C(8, 11, 0.6),
      C(12, 11, 0.6),
      C(16, 11, 0.6),
    ],
    "L15",
  ],
  ["stop", "停止", "声音", ["Square"], [R(5, 5, 14, 14, 3)], "L11"],
  [
    "align-left",
    "段落",
    "编辑",
    ["AlignLeft"],
    [P("M3 5h18M3 10h12M3 15h18M3 20h12")],
    "extension",
  ],
  ["play", "播放", "声音", ["Play"], [P("M7 3v18l14-9Z")], "L11"],
  [
    "pause",
    "暂停",
    "声音",
    ["Pause"],
    [R(6, 3, 3, 18, 1), R(15, 3, 3, 18, 1)],
    "extension",
  ],
  [
    "history",
    "历史",
    "内容",
    ["History"],
    [P("M3 10a9 9 0 1 1 1.5 7M3 4v6h6M12 7v5l4 2")],
    "extension",
  ],
  [
    "warning",
    "提醒",
    "反馈",
    ["Warning"],
    [
      P(
        "M10 4a2.3 2.3 0 0 1 4 0l8 14a2 2 0 0 1-1.8 3H3.8A2 2 0 0 1 2 18ZM12 8v6",
      ),
      C(12, 17.5, 0.6),
    ],
    "extension",
  ],
  [
    "info",
    "信息",
    "反馈",
    ["Info"],
    [C(12, 12, 9), P("M12 11v6"), C(12, 7, 0.6)],
    "extension",
  ],
];
export const iconLibrary = entries.map(
  ([id, label, category, aliases, nodes, source]) => ({
    id,
    label,
    category,
    aliases,
    nodes,
    source,
    viewBox: "0 0 24 24",
    strokeWidth: 1.65,
    cap: "round",
    join: "round",
    confidence: source === "extension" ? "风格扩展" : "参考重绘",
    note:
      source === "extension"
        ? "为完整系统补充的图标，无直接小艺截图证据。"
        : "据参考中的语义与轮廓人工重绘，路径与笔画参数为拟合值，非官方矢量原件。",
  }),
);
export const iconByName = Object.fromEntries(
  iconLibrary.flatMap((icon) => [
    [icon.id, icon],
    ...icon.aliases.map((alias) => [alias, icon]),
  ]),
);
export function iconSvg(
  icon,
  { size = 24, strokeWidth = 1.65, color = "currentColor" } = {},
) {
  const safeColor = /^(#[0-9a-f]{6}|currentColor)$/i.test(color)
    ? color
    : "currentColor";
  const width = Math.max(0.5, Math.min(4, Number(strokeWidth) || 1.65));
  const dimension = Math.max(12, Math.min(512, Number(size) || 24));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${dimension}" height="${dimension}" viewBox="0 0 24 24" fill="none" stroke="${safeColor}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${icon.nodes
    .map(
      ([tag, attrs]) =>
        `<${tag} ${Object.entries(attrs)
          .map(([k, v]) => `${k}="${v}"`)
          .join(" ")}/>`,
    )
    .join("")}</svg>`;
}
