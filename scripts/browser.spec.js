import { test, expect } from "@playwright/test";
const pages = [
  "overview",
  "foundations",
  "components",
  "motion",
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
  await expect(d.getByText("视觉对话", { exact: true })).toBeVisible();
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
test("motion pause, resize and reduced motion", async ({ page }) => {
  await page.goto("/#motion");
  await page.getByRole("button", { name: "聆听 多环扩散，回应输入。" }).click();
  await expect(page.locator(".motion-stage .xy-orb")).toHaveClass(/listening/);
  await page.getByRole("button", { name: "暂停动画", exact: true }).click();
  expect(
    await page
      .locator(".motion-stage .ring-one")
      .evaluate((el) => getComputedStyle(el).animationPlayState),
  ).toBe("paused");
  await page.getByLabel("光球尺寸").fill("120");
  await expect(page.locator(".motion-stage .xy-orb")).toHaveCSS(
    "width",
    "120px",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page
      .locator(".motion-stage .ring-one")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});
test("portable token downloads match count", async ({ request }) => {
  const data = await (
    await request.get("/downloads/xiaoyi.tokens.json")
  ).json();
  expect(Object.keys(data.color)).toHaveLength(14);
  expect(data.color.primary.$value).toBe("#0a59f7");
  expect((await request.get("/downloads/tokens.css")).ok()).toBeTruthy();
});
