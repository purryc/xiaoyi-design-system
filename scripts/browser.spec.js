import { test, expect } from "@playwright/test";
import fs from "node:fs";
const orbColors = JSON.parse(
  fs.readFileSync(
    new URL("../reference/orb-color-samples.json", import.meta.url),
  ),
);
const pages = [
  "overview",
  "foundations",
  "components",
  "motion",
  "icons",
  "patterns",
  "reference",
  "handoff",
];
for (const width of [1440, 390])
  test(`all pages render without overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const route of pages) {
      await page.goto("/#" + route);
      await expect(page.locator("main h1")).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
      const broken = await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs
            .filter((i) => i.complete && i.naturalWidth === 0)
            .map((i) => i.src),
        );
      expect(broken).toEqual([]);
      await page.screenshot({
        path: `qa/${route}-${width}.png`,
        fullPage: true,
      });
    }
    expect(errors).toEqual([]);
  });
test("reference filtering, detail frames and Escape", async ({ page }) => {
  await page.goto("/#reference");
  await expect(page.locator(".reference-card")).toHaveCount(18);
  await page.getByRole("button", { name: "录屏 / 动效", exact: true }).click();
  await expect(page.locator(".reference-card")).toHaveCount(5);
  await page.getByLabel("搜索参考").fill("L10");
  await expect(page.locator(".reference-card")).toHaveCount(1);
  await page.locator(".reference-card").click();
  await expect(page.locator("dialog")).toBeVisible();
  await page.locator(".frame-strip button").nth(3).click();
  await expect(page.locator(".dialog-image img")).toHaveAttribute(
    "src",
    "/reference/L10-4.jpg",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog")).not.toBeVisible();
});
test("global search navigates and opens reference", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("搜索设计系统").fill("组件");
  await page.locator(".search-results button").first().click();
  await expect(page).toHaveURL(/#components$/);
  await page.getByLabel("搜索设计系统").fill("L09");
  await page.locator(".search-results button").click();
  await expect(page.locator("dialog h2")).toHaveText("小艺帮写");
});
test("writing generates, applies and reopens", async ({ page }) => {
  await page.goto("/#patterns");
  await page.getByRole("button", { name: "上下文帮写", exact: true }).click();
  const demo = page.locator(".pattern-canvas");
  await demo.getByRole("button", { name: "摘要", exact: true }).click();
  await expect(demo.getByText("正在生成…")).toBeVisible();
  await demo.getByRole("button", { name: "替换原文", exact: true }).click();
  await expect(demo.locator(".xy-writing-sheet")).toHaveCount(0);
  await expect(demo.locator(".note-content p")).toContainText("交互设计需要");
  await demo.getByRole("button", { name: "小艺帮写", exact: true }).click();
  await expect(demo.locator(".writing-tools button")).toHaveCount(7);
  await demo.getByLabel("关闭帮写").click();
  await expect(demo.locator(".xy-writing-sheet")).toHaveCount(0);
});
test("companion expands, collapses, exits and restores", async ({ page }) => {
  await page.goto("/#patterns");
  const demo = page.locator(".pattern-canvas");
  await demo.getByRole("button", { name: "总结一下", exact: true }).click();
  await expect(demo.locator(".companion-demo")).toHaveClass(/expanded/);
  await expect(demo.locator(".rail-answer")).toContainText("正在理解");
  await expect(demo.locator(".rail-answer")).toContainText("这篇文章讨论");
  await demo.getByRole("button", { name: "收起", exact: true }).click();
  await expect(demo.locator(".companion-demo")).not.toHaveClass(/expanded/);
  await demo.getByLabel("退出伴随").click();
  await expect(demo.locator(".companion-rail")).toHaveCount(0);
  await demo.getByRole("button", { name: "小艺伴随", exact: true }).click();
  await expect(demo.locator(".companion-rail")).toBeVisible();
});
test("keyboard hold to talk transitions through listening", async ({
  page,
}) => {
  await page.goto("/#patterns");
  const demo = page.locator(".pattern-canvas");
  await demo.getByLabel("按住说话").focus();
  await page.keyboard.down("Space");
  await expect(demo.locator(".rail-status")).toHaveText("正在聆听…");
  await page.keyboard.up("Space");
  await expect(demo.locator(".rail-answer")).toContainText("正在理解");
  await expect(demo.locator(".rail-answer")).toContainText("这篇文章讨论");
});
test("closing companion cancels a pending reply", async ({ page }) => {
  await page.goto("/#patterns");
  const d = page.locator(".pattern-canvas");
  await d.getByRole("button", { name: "总结一下", exact: true }).click();
  await d.getByLabel("退出伴随").click();
  await d.getByRole("button", { name: "小艺伴随", exact: true }).click();
  await page.waitForTimeout(1400);
  await expect(d.locator(".rail-answer")).toHaveCount(0);
  await expect(d.locator(".rail-status")).toHaveText("");
});
test("conversation submission and camera simulation", async ({ page }) => {
  await page.goto("/#patterns");
  await page.getByRole("button", { name: "全屏对话", exact: true }).click();
  const d = page.locator(".pattern-canvas");
  await expect(d.getByLabel("发送", { exact: true })).toBeDisabled();
  await d.getByPlaceholder("有什么可以帮你？").fill("明天的日程");
  await d.getByLabel("发送", { exact: true }).click();
  await expect(d.locator(".xy-assistant-message")).toContainText("设计讨论会");
  await d.getByLabel("实时对话", { exact: true }).click();
  await d.getByLabel("打开摄像头示例").click();
  await expect(d.locator(".vision-demo")).toHaveAttribute("data-camera", "on");
  await d.getByLabel("挂断").click();
  await expect(d.locator(".xy-assistant-message")).toBeVisible();
});
test("selection result returns to selection, save downloads", async ({
  page,
}) => {
  await page.goto("/#patterns");
  await page.getByRole("button", { name: "圈选问答", exact: true }).click();
  const d = page.locator(".pattern-canvas");
  await d.getByLabel("圈选图片", { exact: true }).click();
  await d.getByRole("button", { name: "识图搜索", exact: true }).click();
  await expect(d.locator(".image-result")).toBeVisible();
  await d.getByLabel("关闭识图结果").click();
  const download = page.waitForEvent("download");
  await d.getByRole("button", { name: "保存", exact: true }).click();
  expect((await download).suggestedFilename()).toBe(
    "xiaoyi-selection-example.svg",
  );
  await d.getByLabel("退出圈选").click();
  await expect(d.locator(".selection-outline")).toHaveCount(0);
});
test("drag and keyboard alternative receive content", async ({ page }) => {
  await page.goto("/#patterns");
  await page.getByRole("button", { name: "拖给小艺", exact: true }).click();
  const d = page.locator(".pattern-canvas");
  await d.locator(".drag-document").dragTo(d.getByLabel("小艺导航条"));
  await expect(d.getByRole("status")).toContainText("已接收");
  await d.getByRole("button", { name: "重置示例" }).click();
  await d.getByRole("button", { name: "发送给小艺" }).click();
  await expect(d.getByRole("status")).toContainText("已接收");
});
test("TSL WebGPU timeline, pause, parameters and reduced motion", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#motion");
  const orb = page.locator(".reference-render"),
    canvas = orb.locator("canvas");
  await expect(orb).toHaveAttribute("data-render-status", "ready");
  await expect(canvas).toHaveAttribute("data-time", /\d/);
  await page.getByLabel("参考时间轴", { exact: true }).fill("5");
  await expect(canvas).toHaveAttribute("data-time", "5.000");
  await expect(canvas).toHaveAttribute("data-paused", "true");
  const before = await canvas.screenshot();
  await page.waitForTimeout(250);
  expect((await canvas.screenshot()).equals(before)).toBeTruthy();
  await page.getByLabel("主环半径", { exact: true }).fill("0.65");
  await page.waitForTimeout(120);
  expect((await canvas.screenshot()).equals(before)).toBeFalsy();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "导出参数", exact: true }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe("xiaoyi-motion.parameters.json");
  await page.getByLabel("导入动效参数").setInputFiles({
    name: "settings.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        parameters: { radius: 0.39, maxFps: 15, cyan: "#ff0033" },
      }),
    ),
  });
  await expect(page.getByLabel("主环半径", { exact: true })).toHaveValue(
    "0.39",
  );
  await page.getByRole("button", { name: "播放动效", exact: true }).click();
  await expect(canvas).not.toHaveAttribute("data-time", "5.000");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(canvas).toHaveAttribute("data-paused", "true");
  const frozen = await canvas.getAttribute("data-time");
  await page.waitForTimeout(250);
  expect(await canvas.getAttribute("data-time")).toBe(frozen);
  expect(errors).toEqual([]);
});
test("same TSL graph renders with WebGL2 fallback", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/?backend=webgl#motion");
  const orb = page.locator(".reference-render");
  await expect(orb).toHaveAttribute("data-render-status", "ready");
  await expect(orb).toHaveAttribute("data-backend", "WebGL2 · TSL");
  await page.getByLabel("参考时间轴", { exact: true }).fill("14.5");
  await expect(orb.locator("canvas")).toHaveAttribute("data-time", "14.500");
  await page.screenshot({ path: "qa/tsl-webgl.png" });
  expect(errors).toEqual([]);
});
test("icon library search, controls, SVG and ZIP downloads", async ({
  page,
  request,
}) => {
  await page.goto("/#icons");
  await expect(page.locator(".icon-tile")).toHaveCount(77);
  await page.getByLabel("搜索图标").fill("摘要");
  await expect(page.locator(".icon-tile")).toHaveCount(1);
  await page.locator(".icon-tile").click();
  await page.getByLabel("图标尺寸").selectOption("48");
  await page.getByLabel("图标笔画").selectOption("2.5");
  await expect(page.locator(".icon-tile svg")).toHaveAttribute("width", "48");
  await expect(page.locator(".icon-tile svg")).toHaveAttribute(
    "stroke-width",
    "2.5",
  );
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "下载 SVG", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("xiaoyi-summarize.svg");
  await page.getByLabel("搜索图标").fill("nothing");
  await expect(page.getByText("没有匹配的图标。")).toBeVisible();
  await page.getByRole("button", { name: "清除筛选" }).click();
  await expect(page.locator(".icon-tile")).toHaveCount(77);
  const manifest = await (await request.get("/icons/manifest.json")).json();
  expect(manifest.icons).toHaveLength(77);
  expect((await request.get("/downloads/xiaoyi-icons.zip")).ok()).toBeTruthy();
});
test("portable token downloads match count", async ({ request }) => {
  const data = await (
    await request.get("/downloads/xiaoyi.tokens.json")
  ).json();
  expect(Object.keys(data.color)).toHaveLength(14);
  expect(data.color.primary.$value).toBe("#0a59f7");
  expect((await request.get("/downloads/tokens.css")).ok()).toBeTruthy();
});

test("common cards expand and selection remains exclusive", async ({
  page,
}) => {
  await page.goto("/#components");
  await page.getByRole("button", { name: "卡片", exact: true }).click();
  const scope = page.locator("#component-content-cards");
  const details = scope.getByRole("button", { name: "查看详情", exact: true });
  await details.click();
  await expect(scope.getByText("参会人：林然、周宁、陈悦")).toBeVisible();
  await scope.getByRole("button", { name: "收起详情" }).click();
  await expect(scope.locator(".card-detail")).toHaveCount(0);
  await scope.getByRole("button", { name: "简洁 快速获取要点" }).click();
  await expect(
    scope.getByRole("button", { name: "简洁 快速获取要点" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    scope.getByRole("button", { name: "完整 展开更多细节" }),
  ).toHaveAttribute("aria-pressed", "false");
  await expect(
    scope.getByRole("button", { name: "深度研究 暂不可用" }),
  ).toBeDisabled();
});
test("sliders support keyboard, endpoints, steps, pointer and disabled state", async ({
  page,
}) => {
  await page.goto("/#components");
  await page.getByRole("button", { name: "Slider", exact: true }).click();
  const volume = page.getByRole("slider", { name: "音量", exact: true });
  await volume.focus();
  await page.keyboard.press("ArrowRight");
  await expect(volume).toHaveValue("65");
  await page.keyboard.press("End");
  await expect(volume).toHaveValue("100");
  await page.keyboard.press("Home");
  await expect(volume).toHaveValue("0");
  const box = await volume.boundingBox();
  await page.mouse.click(box.x + box.width * 0.7, box.y + box.height / 2);
  expect(+(await volume.inputValue())).toBeGreaterThan(60);
  expect(+(await volume.inputValue())).toBeLessThan(80);
  const speed = page.getByRole("slider", { name: "朗读速度", exact: true });
  await speed.focus();
  await page.keyboard.press("ArrowRight");
  await expect(speed).toHaveValue("1.25");
  await expect(speed).toHaveAttribute("aria-valuetext", "1.25×");
  await expect(
    page.getByRole("slider", { name: "不可用", exact: true }),
  ).toBeDisabled();
});
test("chips filter, remove, restore and bottom dock submits", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#components");
  await page.getByRole("button", { name: "底部 Chip", exact: true }).click();
  const scope = page.locator("#component-bottom-chips");
  await scope.getByRole("button", { name: "已收藏", exact: true }).click();
  await expect(scope.getByText("收藏内容 · 3 项")).toBeVisible();
  await scope.getByRole("button", { name: "移除设计周报" }).click();
  await expect(scope.getByRole("button", { name: "移除设计周报" })).toHaveCount(
    0,
  );
  await scope.getByRole("button", { name: "恢复标签" }).click();
  await expect(
    scope.getByRole("button", { name: "移除设计周报" }),
  ).toBeVisible();
  await scope.getByRole("button", { name: "生成脑图", exact: true }).click();
  await expect(scope.locator(".dock-reply")).toContainText("四个分支");
  await scope.getByRole("button", { name: "翻译全文", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(scope.locator(".dock-reply")).toContainText(
    "contextual assistance",
  );
  await scope.getByLabel("底部输入", { exact: true }).fill("明天几点开会");
  await scope.getByLabel("发送底部问题").click();
  await expect(scope.locator(".dock-reply")).toHaveText(
    "已记录问题：明天几点开会",
  );
  await expect(scope.getByLabel("发送底部问题")).toBeDisabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});
test("toast expiry, replacement, focus and unmount", async ({ page }) => {
  await page.clock.install();
  await page.goto("/#components");
  await page.getByRole("button", { name: "Toast / 进度", exact: true }).click();
  const scope = page.locator("#component-toast");
  const action = scope.getByRole("button", { name: "完成操作", exact: true });
  await action.click();
  await expect(action).toBeFocused();
  await expect(scope.locator(".xy-toast")).toHaveText("已完成");
  await page.clock.runFor(1000);
  await scope.getByRole("button", { name: "复制内容" }).click();
  await page.clock.runFor(600);
  await expect(scope.locator(".xy-toast")).toHaveText("已复制");
  await page.clock.runFor(950);
  await expect(scope.locator(".xy-toast")).toHaveCount(0);
  await scope.getByLabel("Toast 持续时间").selectOption("5000");
  await scope.getByRole("button", { name: "显示长提示" }).click();
  await page.clock.runFor(1600);
  await expect(scope.locator(".xy-toast")).toContainText("网络连接不可用");
  await page.getByRole("button", { name: "Slider", exact: true }).click();
  await page.clock.runFor(5000);
  await page.getByRole("button", { name: "Toast / 进度", exact: true }).click();
  await expect(page.locator(".xy-toast")).toHaveCount(0);
});
test("switch, radio, mixed checkbox and segmented state", async ({ page }) => {
  await page.goto("/#components");
  await page.getByRole("button", { name: "开关 / 选择", exact: true }).click();
  const scope = page.locator("#component-choice-controls");
  const toggle = scope.getByRole("switch", { name: /自动朗读/ });
  await expect(toggle).toBeChecked();
  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(toggle).not.toBeChecked();
  await expect(
    scope.getByRole("switch", { name: "跨设备接续" }),
  ).toBeDisabled();
  await scope.getByRole("radio", { name: "仅耳机", exact: true }).check();
  await expect(
    scope.getByRole("radio", { name: "自动", exact: true }),
  ).not.toBeChecked();
  await expect(
    scope.getByRole("radio", { name: "仅耳机", exact: true }),
  ).toBeChecked();
  const all = scope.getByRole("checkbox", { name: "全部内容", exact: true });
  await expect(all).toHaveAttribute("aria-checked", "mixed");
  await all.click();
  await expect(scope.getByRole("checkbox", { name: "图片说明" })).toBeChecked();
  await all.click();
  await expect(
    scope.getByRole("checkbox", { name: "正文内容" }),
  ).not.toBeChecked();
  await scope.getByRole("radio", { name: "列表", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    scope.getByRole("radio", { name: "脑图", exact: true }),
  ).toBeChecked();
});
test("progress completes, pauses, resets and reduced motion is static", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/#components");
  await page.getByRole("button", { name: "Toast / 进度", exact: true }).click();
  const scope = page.locator("#component-progress");
  const progress = scope.getByRole("progressbar", {
    name: "文档整理进度",
    exact: true,
  });
  await scope.getByRole("button", { name: "继续整理" }).click();
  await page.clock.runFor(500);
  await scope.getByRole("button", { name: "暂停", exact: true }).click();
  const frozen = await progress.getAttribute("aria-valuenow");
  await page.clock.runFor(500);
  await expect(progress).toHaveAttribute("aria-valuenow", frozen);
  await scope.getByRole("button", { name: "继续整理" }).click();
  await page.clock.runFor(5000);
  await expect(progress).toHaveAttribute("aria-valuenow", "100");
  await expect(scope.getByText("整理完成", { exact: true })).toBeVisible();
  await scope.getByRole("button", { name: "重置进度" }).click();
  await expect(progress).toHaveAttribute("aria-valuenow", "0");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await scope
      .locator(".is-indeterminate .xy-progress-ring > svg")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});
test("control search and official reference previews", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("搜索设计系统").fill("Slider");
  await page.locator(".search-results button").click();
  await expect(page).toHaveURL(/#components$/);
  await expect(page.locator("#component-sliders")).toBeVisible();
  await expect(page.locator("#component-content-cards")).toHaveCount(0);
  await page
    .locator("#component-sliders")
    .getByText("查看官方示例图", { exact: true })
    .click();
  const img = page.locator("#component-sliders .control-reference img");
  await expect(img).toBeVisible();
  expect(
    await img.evaluate((el) => el.complete && el.naturalWidth > 0),
  ).toBeTruthy();
  await expect(
    page.locator("#component-sliders .control-source-links a"),
  ).toHaveAttribute("href", /openharmony\/docs/);
});

for (const width of [1440, 390])
  test(`English coverage and responsive layout at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const id of [
      "overview",
      "foundations",
      "components",
      "motion",
      "icons",
      "patterns",
      "reference",
      "handoff",
    ]) {
      await page.goto(`/?lang=en#${id}`);
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
      await expect(page.locator("main h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      const untranslated = await page.locator("main").evaluate((main) => {
        const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
        const found = [];
        while (walker.nextNode()) {
          const n = walker.currentNode;
          if (n.parentElement.closest('[translate="no"]')) continue;
          if (
            /[\u3400-\u9fff]/.test(n.textContent) &&
            !n.textContent.match(/\.(png|jpe?g|mp4|mov)/)
          )
            found.push(n.textContent);
        }
        return found;
      });
      expect(untranslated).toEqual([]);
    }
    expect(errors).toEqual([]);
  });
test("language choice persists and preserves slider state and user input", async ({
  page,
}) => {
  await page.goto("/?lang=zh#components");
  await page.getByRole("button", { name: "Slider", exact: true }).click();
  await page.getByRole("slider", { name: "音量", exact: true }).fill("73");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(
    page.getByRole("slider", { name: "Volume", exact: true }),
  ).toHaveValue("73");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.goto("/#patterns");
  await page
    .getByRole("button", { name: "Full-screen conversation", exact: true })
    .click();
  await page.getByPlaceholder("How can I help?").fill("阅读笔记");
  await page
    .locator(".pattern-canvas")
    .getByRole("button", { name: "Send", exact: true })
    .click();
  await expect(page.locator(".xy-user-message")).toHaveText("阅读笔记");
  await page.goto("/?lang=en#reference");
  await page
    .getByRole("textbox", { name: "Search references", exact: true })
    .fill("Voice listening");
  await expect(page.locator(".reference-card")).toHaveCount(1);
  await page.goto("/?lang=en#icons");
  await page
    .getByRole("textbox", { name: "Search icons", exact: true })
    .fill("End call");
  await expect(page.locator(".icon-tile")).toHaveCount(1);
  await page.goto("/?lang=en#patterns");
  await page
    .getByRole("button", { name: "Full-screen conversation", exact: true })
    .click();
  await page.getByPlaceholder("How can I help?").fill("阅读笔记");
  await page
    .locator(".pattern-canvas")
    .getByRole("button", { name: "Send", exact: true })
    .click();
  await page.getByRole("button", { name: "中文", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.locator(".xy-user-message")).toHaveText("阅读笔记");
});
test("English reference details and portable metadata stay readable", async ({
  page,
  request,
}) => {
  await page.goto("/?lang=en#reference");
  await expect(page.locator(".language-switch")).toHaveAttribute(
    "aria-label",
    "Language",
  );
  await page.locator(".reference-card").filter({ hasText: "L18" }).click();
  const dialog = page.locator("dialog.reference-dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("link", { name: /manifest.json/ }),
  ).toBeVisible();
  const visibleText = await dialog.innerText();
  expect(visibleText).not.toMatch(/[\u3400-\u9fff]/);
  const downloadedManifest = await (
    await request.get("/downloads/manifest.json")
  ).json();
  const source = downloadedManifest.items.find((item) => item.id === "L18");
  expect(source.filename).toMatch(/[\u3400-\u9fff]/);
  expect(source.titleEn).toBeTruthy();
  expect(source.observationEn).not.toMatch(/[\u3400-\u9fff]/);
  const web = await (await request.get("/downloads/web-sources.json")).json();
  expect(
    web.every(
      (item) => item.scopeEn && (item.note ? item.noteEn : item.evidenceEn),
    ),
  ).toBe(true);
  const tokens = await (
    await request.get("/downloads/xiaoyi.tokens.json")
  ).json();
  expect(
    Object.values(tokens.color).every(
      (color) => color.labelEn && color.descriptionEn,
    ),
  ).toBe(true);
  await page.evaluate(() => {
    location.hash = "motion";
  });
  await expect(dialog).not.toBeVisible();
});
test("all English pattern states keep visible copy and accessible names translated", async ({
  page,
}) => {
  await page.goto("/?lang=en#patterns");
  for (const label of [
    "Look at the World",
    "Companion reading",
    "Contextual writing",
    "Full-screen conversation",
    "Circle to ask",
    "Drag to Xiaoyi",
  ]) {
    await page
      .getByRole("button", { name: label, exact: true })
      .first()
      .click();
    const untranslated = await page.locator("main").evaluate((main) => {
      const found = [];
      const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (
          node.parentElement.getClientRects().length &&
          /[\u3400-\u9fff]/.test(node.textContent)
        )
          found.push(node.textContent.trim());
      }
      for (const element of main.querySelectorAll(
        "[aria-label],[title],[placeholder],[alt]",
      )) {
        if (!element.getClientRects().length) continue;
        for (const name of ["aria-label", "title", "placeholder", "alt"]) {
          const value = element.getAttribute(name);
          if (value && /[\u3400-\u9fff]/.test(value))
            found.push(`${name}: ${value}`);
        }
      }
      return found;
    });
    expect(untranslated, label).toEqual([]);
  }
});
for (const language of ["zh", "en"])
  test(`vision example and reference controls in ${language}`, async ({
    page,
  }) => {
    await page.goto(`/?lang=${language}#patterns`);
    const labels =
      language === "en"
        ? [
            "Look at the World",
            "Captions",
            "Flip camera",
            "Mute",
            "Turn camera off",
            "Hang up",
            "Start again",
          ]
        : [
            "小艺看世界",
            "字幕",
            "翻转摄像头",
            "静音",
            "关闭摄像头",
            "挂断",
            "重新开始",
          ];
    await page.getByRole("button", { name: labels[0], exact: true }).click();
    const demo = page.locator(".vision-demo");
    await expect(demo).toHaveAttribute("data-camera", "on");
    await expect(page.locator(".vision-reference img")).toHaveCount(3);
    await demo.getByRole("button", { name: labels[1], exact: true }).click();
    await expect(demo.locator(".vision-captions")).toBeVisible();
    await demo.getByRole("button", { name: labels[2], exact: true }).click();
    await expect(demo).toHaveAttribute("data-facing", "front");
    await demo.getByRole("button", { name: labels[3], exact: true }).click();
    await expect(
      demo.locator(".vision-actions button").first(),
    ).toHaveAttribute("aria-pressed", "true");
    await demo.getByRole("button", { name: labels[4], exact: true }).click();
    await expect(demo).toHaveAttribute("data-camera", "off");
    await expect(
      demo.getByRole("button", { name: labels[2], exact: true }),
    ).toBeDisabled();
    await demo.getByRole("button", { name: labels[5], exact: true }).click();
    await expect(demo).toHaveCount(0);
    await page.getByRole("button", { name: labels[6], exact: true }).click();
    await expect(page.locator(".vision-demo")).toHaveAttribute(
      "data-camera",
      "on",
    );
  });
for (const backend of ["webgpu", "webgl"])
  test(`transparent TSL borders and reference colors across time and backgrounds on ${backend}`, async ({
    page,
  }) => {
    await page.goto(
      `/?lang=en${backend === "webgl" ? "&backend=webgl" : ""}#motion`,
    );
    const orb = page.locator(".render-figure .tsl-orb");
    await expect(orb).toHaveAttribute("data-render-status", "ready");
    if (backend === "webgl")
      await expect(orb).toHaveAttribute("data-backend", /WebGL2/);
    for (const [time, surface] of [
      [1, "White"],
      [5, "Dark"],
      [14.5, "Blue"],
      [20, "Pink"],
    ]) {
      await page
        .getByRole("slider", { name: "Reference timeline", exact: true })
        .fill(String(time));
      await page.getByRole("button", { name: surface, exact: true }).click();
      await expect(orb.locator("canvas")).toHaveAttribute(
        "data-time",
        time.toFixed(3),
      );
      // Browser compositing retains GPU output after the drawing buffer is discarded.
      // Capture against a transparent ancestor chain, then inspect actual PNG alpha.
      await orb.evaluate((el) => {
        for (let p = el; p; p = p.parentElement) {
          p.dataset.alphaTestStyle = p.getAttribute("style") || "";
          p.style.setProperty("background", "transparent", "important");
          p.style.setProperty("box-shadow", "none", "important");
        }
      });
      const png = await orb
        .locator("canvas")
        .screenshot({ omitBackground: true });
      const pixels = await page.evaluate(async (base64) => {
        const img = new Image();
        img.src = "data:image/png;base64," + base64;
        await img.decode();
        const c = document.createElement("canvas");
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const { data } = ctx.getImageData(0, 0, c.width, c.height);
        let border = 0,
          visible = 0,
          green = 0,
          ringPixels = 0;
        const core = [[], [], []];
        for (let y = 0; y < c.height; y++)
          for (let x = 0; x < c.width; x++) {
            const alpha = data[(y * c.width + x) * 4 + 3];
            if (x === 0 || y === 0 || x === c.width - 1 || y === c.height - 1)
              border = Math.max(border, alpha);
            if (alpha > 20) visible++;
            const radius = Math.hypot(
              (x - c.width / 2) / (c.height / 2) - 0.035,
              (c.height / 2 - y) / (c.height / 2),
            );
            const rgb = Array.from(
              data.slice((y * c.width + x) * 4, (y * c.width + x) * 4 + 3),
            );
            if (radius < 0.1) rgb.forEach((v, i) => core[i].push(v));
            if (radius > 0.41 && radius < 0.5 && alpha > 51) {
              ringPixels++;
              const [r, g, b] = rgb,
                max = Math.max(...rgb),
                min = Math.min(...rgb),
                delta = max - min;
              let hue = 0;
              if (delta)
                hue =
                  60 *
                  (max === r
                    ? ((g - b) / delta + 6) % 6
                    : max === g
                      ? (b - r) / delta + 2
                      : (r - g) / delta + 4);
              if (hue > 70 && hue < 165 && delta / Math.max(1, max) > 0.15)
                green++;
            }
          }
        return {
          border,
          visible,
          ringPixels,
          greenRatio: green / Math.max(1, ringPixels),
          core: core.map(
            (channel) =>
              channel.sort((a, b) => a - b)[Math.floor(channel.length / 2)],
          ),
        };
      }, png.toString("base64"));
      await orb.evaluate((el) => {
        for (let p = el; p; p = p.parentElement) {
          p.setAttribute("style", p.dataset.alphaTestStyle);
          delete p.dataset.alphaTestStyle;
        }
      });
      expect(pixels.border).toBe(0);
      expect(pixels.visible).toBeGreaterThan(100);
      expect(pixels.ringPixels).toBeGreaterThan(100);
      expect(pixels.greenRatio).toBeLessThan(0.001);
      if (time !== 14.5) {
        const source = orbColors.frames.find((f) => f.time === time).coreSrgb;
        source.forEach((value, i) =>
          expect(Math.abs(pixels.core[i] - value * 255)).toBeLessThan(12),
        );
      }
    }
  });

async function edgePixels(page) {
  const canvas = page.locator(".edge-lab .companion-edge-glow canvas");
  await page
    .locator(".edge-surface-content")
    .evaluate((el) => (el.style.visibility = "hidden"));
  await canvas.evaluate((el) => {
    for (let p = el.parentElement; p; p = p.parentElement) {
      p.dataset.edgeStyle = p.getAttribute("style") || "";
      p.style.setProperty("background", "transparent", "important");
      p.style.setProperty("box-shadow", "none", "important");
    }
  });
  const png = await canvas.screenshot({ omitBackground: true });
  const padding = Number(await canvas.getAttribute("data-padding"));
  const result = await page.evaluate(
    async ({ base64, padding }) => {
      const img = new Image();
      img.src = "data:image/png;base64," + base64;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const { data } = ctx.getImageData(0, 0, c.width, c.height);
      let visible = 0,
        border = 0;
      for (let y = 0; y < c.height; y++)
        for (let x = 0; x < c.width; x++) {
          const a = data[(y * c.width + x) * 4 + 3];
          if (a > 5) visible++;
          if (x === 0 || y === 0 || x === c.width - 1 || y === c.height - 1)
            border = Math.max(border, a);
        }
      const at = (x, y) => data[(y * c.width + x) * 4 + 3],
        x = Math.floor(c.width / 2),
        profile = Array.from({ length: 30 }, (_, y) =>
          at(x, Math.round(padding) + y),
        );
      const peak = Math.max(...profile.slice(0, 5)),
        start = profile.indexOf(peak);
      return {
        visible,
        border,
        center: at(x, Math.floor(c.height / 2)),
        half: profile.slice(start).findIndex((v) => v <= peak * 0.5),
        tenth: profile.slice(start).findIndex((v) => v <= peak * 0.1),
      };
    },
    { base64: png.toString("base64"), padding },
  );
  await canvas.evaluate((el) => {
    for (let p = el.parentElement; p; p = p.parentElement) {
      p.setAttribute("style", p.dataset.edgeStyle);
      delete p.dataset.edgeStyle;
    }
  });
  await page
    .locator(".edge-surface-content")
    .evaluate((el) => (el.style.visibility = ""));
  return result;
}
for (const backend of ["webgpu", "webgl"])
  test(`companion edge diffusion, transparency and reuse on ${backend}`, async ({
    page,
  }) => {
    await page.goto(
      `/?lang=en${backend === "webgl" ? "&backend=webgl" : ""}#motion`,
    );
    const lab = page.locator(".edge-lab"),
      effect = lab.locator(".companion-edge-glow");
    await lab.scrollIntoViewIfNeeded();
    await expect(effect).toHaveAttribute("data-render-status", "ready");
    await expect(effect).toHaveAttribute(
      "data-backend",
      backend === "webgl" ? /WebGL2/ : /WebGPU/,
    );
    await lab
      .getByRole("button", { name: "Pause edge light", exact: true })
      .click();
    const canvas = effect.locator("canvas");
    await expect(canvas).toHaveAttribute("data-paused", "true");
    const first = await canvas.screenshot();
    await page.waitForTimeout(120);
    expect((await canvas.screenshot()).equals(first)).toBeTruthy();
    const narrow = await edgePixels(page);

    expect(narrow.center).toBe(0);
    expect(narrow.border).toBe(0);
    expect(narrow.visible).toBeGreaterThan(300);
    const h = await page
      .locator(".edge-surface")
      .evaluate((el) => el.clientHeight);
    expect(Math.abs(narrow.half - (8 * h) / 1828)).toBeLessThan(1.3);
    expect(Math.abs(narrow.tenth - (15 * h) / 1828)).toBeLessThan(1.5);
    await lab.getByLabel("Inward diffusion width", { exact: false }).fill("30");
    const broad = await edgePixels(page);
    expect(broad.visible).toBeGreaterThan(narrow.visible * 1.8);
    expect(broad.half).toBeGreaterThan(narrow.half + 2);
    expect(broad.center).toBe(0);
    await lab.getByRole("button", { name: "Save", exact: true }).click();
    await expect(
      lab.getByRole("button", { name: "Saved", exact: true }),
    ).toBeVisible();
    await lab
      .getByRole("button", { name: "Reset edge light", exact: true })
      .click();
    await expect(
      lab.getByLabel("Inward diffusion width", { exact: false }),
    ).toHaveValue("9.6");
    const download = page.waitForEvent("download");
    await lab
      .getByRole("button", { name: "Export edge parameters", exact: true })
      .click();
    const payload = JSON.parse(fs.readFileSync(await (await download).path()));
    expect(payload.parameters.innerWidth).toBe(9.6);
    expect(payload.schema).toHaveLength(6);
    expect(
      payload.schema.every((p) => p.labelEn && p.descriptionEn),
    ).toBeTruthy();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await lab
      .getByRole("button", { name: "Play edge light", exact: true })
      .click();
    await expect(canvas).toHaveAttribute("data-paused", "true");
    await page.goto("/?lang=en#patterns");
    const companion = page.locator(".pattern-canvas .companion-edge-glow");
    await expect(companion).toHaveAttribute("data-render-status", "ready");
    await page
      .locator(".pattern-canvas")
      .getByLabel("Exit companion", { exact: true })
      .click();
    await expect(companion).toHaveAttribute("data-active", "false");
  });
