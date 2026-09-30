import { test, expect } from "@playwright/test";
const tabs = (page) => page.locator(".xy-v7-flow-tabs").first();
const route = (page, hash = "patterns", params = "") =>
  page.goto(`/?design=v7&lang=en${params}#${hash}`);
for (const width of [1440, 390])
  for (const lang of ["zh", "en"])
    test(`v7 all routes ${lang} ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 950 });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      for (const hash of [
        "overview",
        "foundations",
        "components",
        "motion",
        "icons",
        "patterns",
        "reference",
        "handoff",
      ]) {
        await page.goto(`/?design=v7&lang=${lang}#${hash}`);
        await expect(page.locator("main h1").first()).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBeTruthy();
        if (lang === "en") {
          const copy = await page.locator("main").innerText();
          expect(copy.replace(/中文/g, "")).not.toMatch(/[\u3400-\u9fff]/);
        }
        expect(
          await page
            .locator("img")
            .evaluateAll((imgs) =>
              imgs
                .filter((i) => i.complete && i.naturalWidth === 0)
                .map((i) => i.src),
            ),
        ).toEqual([]);
      }
      expect(errors).toEqual([]);
    });
test("v7 is default; version and language persist independently", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-design", "v7");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await page.getByLabel("Design edition").selectOption("legacy");
  await expect(page).toHaveURL(/design=legacy/);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByLabel("Design edition")).toHaveValue("legacy");
  await page.goto("/?design=v7&lang=zh#patterns");
  await expect(page.getByLabel("设计版本")).toHaveValue("v7");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
});
test("floating response grows, stops, switches input and retains state on expansion", async ({
  page,
}) => {
  await route(page);
  await page
    .getByRole("button", { name: "Activate Xiaoyi", exact: true })
    .click();
  await expect(page.locator(".xy-v7-listening")).toBeVisible();
  const assistant = page.locator(".xy-v7-assistant");
  await expect(assistant).toHaveAttribute("data-status", "streaming", {
    timeout: 10000,
  });
  await expect(page.locator(".xy-v7-answer")).not.toBeEmpty();
  await assistant
    .getByRole("button", { name: "Stop generating", exact: true })
    .click();
  await expect(assistant).toHaveAttribute("data-status", "stopped");
  const text = await assistant.locator(".xy-v7-answer").innerText();
  await page.waitForTimeout(300);
  expect(await assistant.locator(".xy-v7-answer").innerText()).toBe(text);
  await assistant
    .getByRole("button", { name: "Expand conversation", exact: true })
    .click();
  await expect(assistant).toHaveClass(/is-expanded/);
  expect(await assistant.locator(".xy-v7-answer").innerText()).toBe(text);
  await assistant
    .getByRole("button", { name: "Type a message", exact: true })
    .click();
  await expect(assistant.locator(".xy-v7-keyboard")).toBeVisible();
  await expect(assistant.getByLabel("Message Xiaoyi")).toBeFocused();
  await assistant.getByLabel("Message Xiaoyi").fill("A second question");
  await assistant.getByRole("button", { name: "Send", exact: true }).click();
  await expect(assistant.locator(".xy-v7-user")).toHaveText(
    "A second question",
  );
  await assistant.getByRole("button", { name: "Close", exact: true }).click();
  await expect(page.locator(".xy-v7-assistant")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Activate Xiaoyi", exact: true }),
  ).toBeVisible();
});
test("skills carousel, filtering and Try open a conversation", async ({
  page,
}) => {
  await route(page);
  await tabs(page)
    .getByRole("button", { name: "Skills gallery", exact: true })
    .click();
  const gallery = page.locator(".xy-v7-skills");
  await gallery.getByRole("button", { name: "Next slide" }).click();
  await expect(gallery.locator(".xy-v7-skill-hero h3")).toHaveText(
    "Discover the night nearby",
  );
  await gallery.getByLabel("Search skills").fill("charging");
  await expect(
    gallery.locator(".xy-v7-skill-list .xy-v7-skill-row"),
  ).toHaveCount(1);
  await gallery
    .locator(".xy-v7-skill-list")
    .getByRole("button", { name: "Try", exact: true })
    .click();
  await expect(page.locator(".xy-v7-conversation .xy-v7-user")).toHaveText(
    "Smart charging",
  );
});
test("selection can change target and shape, search returns without invented results, ask retains attachment", async ({
  page,
}) => {
  await route(page);
  await tabs(page)
    .getByRole("button", { name: "Select and ask", exact: true })
    .click();
  const phone = page.locator(".xy-v7-shopping");
  await phone.getByRole("button", { name: "Select shoe", exact: true }).click();
  await expect(phone.locator(".xy-v7-selected-shoe")).toBeVisible();
  await phone.getByLabel("Selection shape").click();
  await expect(phone.getByLabel("Selection shape")).toHaveText("Rectangle");
  await phone
    .getByRole("button", { name: "Visual search", exact: true })
    .click();
  await expect(phone.locator(".xy-v7-search-sheet")).toBeVisible();
  await phone
    .locator(".xy-v7-search-sheet")
    .getByRole("button", { name: "Close", exact: true })
    .click();
  await phone.getByRole("button", { name: "Ask Xiaoyi", exact: true }).click();
  await expect(phone.locator(".xy-v7-attachment")).toBeVisible();
  await phone
    .getByRole("button", {
      name: "Are these shoes suitable for everyday walking?",
      exact: true,
    })
    .click();
  await expect(phone.locator(".xy-v7-assistant")).toHaveAttribute(
    "data-status",
    "querying",
  );
  await phone
    .locator(".xy-v7-assistant")
    .getByRole("button", { name: "Close", exact: true })
    .click();
  await expect(phone.locator(".xy-v7-selection-layer")).toBeVisible();
});
test("writing requirements generate, stop, regenerate, copy and insert into editable host", async ({
  page,
}) => {
  await route(page);
  await tabs(page)
    .getByRole("button", { name: "Writing assistant", exact: true })
    .click();
  const sheet = page.locator(".xy-v7-writing-sheet");
  await sheet.getByRole("button", { name: "Event plan", exact: true }).click();
  await sheet.getByLabel("Tone", { exact: true }).selectOption("formal");
  await sheet.getByLabel("Length", { exact: true }).selectOption("long");
  await sheet.getByRole("button", { name: "Generate", exact: true }).click();
  await expect(sheet).toHaveAttribute("data-status", "streaming");
  await sheet
    .getByRole("button", { name: "Stop generating", exact: true })
    .click();
  await expect(sheet).toHaveAttribute("data-status", "stopped");
  await sheet.getByRole("button", { name: "Regenerate", exact: true }).click();
  await expect(sheet).toHaveAttribute("data-status", "complete", {
    timeout: 15000,
  });
  await expect(sheet.locator(".xy-v7-answer")).toContainText(
    "Thank you for your support",
  );
  const text = await sheet.locator(".xy-v7-answer").innerText();
  await sheet.getByRole("button", { name: "Add", exact: true }).click();
  await expect(sheet).toHaveCount(0);
  await expect(page.locator(".xy-v7-host-editor textarea")).toHaveValue(text);
  await page.locator(".xy-v7-host-editor textarea").fill("Edited locally");
  await expect(page.locator(".xy-v7-host-editor textarea")).toHaveValue(
    "Edited locally",
  );
});
test("v7 reference selects matching static states and exports annotated parameters", async ({
  page,
}) => {
  await route(page, "motion");
  await page
    .locator(".xy-v7-frame-list")
    .getByRole("button", { name: "273s · writing-options", exact: true })
    .click();
  await expect(page.locator(".xy-v7-comparison img").first()).toHaveAttribute(
    "src",
    "/reference/v7/L19-writing-options.jpg",
  );
  await expect(
    page.locator(".xy-v7-comparison .xy-v7-writing-sheet"),
  ).toHaveAttribute("data-status", "idle");
  await page
    .locator(".xy-v7-frame-list")
    .getByRole("button", { name: "53s · sources", exact: true })
    .click();
  await expect(
    page.locator('.xy-v7-comparison [data-snapshot="sources"]'),
  ).toBeVisible();
  await expect(page.locator(".xy-v7-comparison .xy-v7-sources li")).toHaveCount(
    3,
  );
  const snapshotText = await page
    .locator(".xy-v7-comparison .xy-v7-answer")
    .innerText();
  await page.waitForTimeout(850);
  expect(
    await page.locator(".xy-v7-comparison .xy-v7-answer").innerText(),
  ).toBe(snapshotText);
  const dl = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export parameters", exact: false })
    .click();
  expect((await dl).suggestedFilename()).toBe("xiaoyi-v7-bloom.json");
  const params = await (
    await page.request.get("/downloads/xiaoyi-v7.parameters.json")
  ).json();
  expect(params.schema).toHaveLength(12);
  expect(params.schema.every((p) => p.labelEn && p.descriptionEn)).toBeTruthy();
});
for (const backend of ["webgpu", "webgl"])
  test(`v7 five TSL effects have transparent borders on ${backend}`, async ({
    page,
  }) => {
    await route(page, "motion", backend === "webgl" ? "&backend=webgl" : "");
    const preview = page.locator(".xy-v7-lab-preview"),
      light = preview.locator(".xy-v7-light"),
      canvas = light.locator("canvas");
    await expect(light).toHaveAttribute("data-render-status", "ready", {
      timeout: 15000,
    });
    if (backend === "webgl")
      await expect(canvas).toHaveAttribute("data-backend", /WebGL2/);
    for (const effect of [
      "Activation bloom",
      "Surface highlight",
      "Selection contour",
      "Writing light field",
      "Multicolor emblem",
    ]) {
      await tabs(page)
        .getByRole("button", { name: effect, exact: true })
        .click();
      await expect(light).toHaveAttribute("data-render-status", "ready");
      for (const background of ["white", "black", "color", "picture"]) {
        await page.getByLabel("Host background").selectOption(background);
        await expect(preview).toHaveAttribute("data-background", background);
      }
      await canvas.scrollIntoViewIfNeeded();
      await page.waitForTimeout(120);
      await canvas.evaluate((el) => {
        for (let p = el; p; p = p.parentElement) {
          p.dataset.savedStyle = p.getAttribute("style") || "";
          p.style.setProperty("background", "transparent", "important");
          p.style.setProperty("box-shadow", "none", "important");
        }
      });
      const png = await canvas.screenshot({ omitBackground: true });
      const result = await page.evaluate(async (b64) => {
        const image = new Image();
        image.src = "data:image/png;base64," + b64;
        await image.decode();
        const c = document.createElement("canvas");
        c.width = image.width;
        c.height = image.height;
        const x = c.getContext("2d");
        x.drawImage(image, 0, 0);
        const d = x.getImageData(0, 0, c.width, c.height).data;
        let border = 0,
          visible = 0;
        for (let y = 0; y < c.height; y++)
          for (let x = 0; x < c.width; x++) {
            const a = d[(y * c.width + x) * 4 + 3];
            if (x === 0 || y === 0 || x === c.width - 1 || y === c.height - 1)
              border = Math.max(border, a);
            if (a > 15) visible++;
          }
        return { border, visible };
      }, png.toString("base64"));
      expect(result.border).toBe(0);
      expect(result.visible).toBeGreaterThan(10);
      await canvas.evaluate((el) => {
        for (let p = el; p; p = p.parentElement) {
          p.setAttribute("style", p.dataset.savedStyle || "");
          delete p.dataset.savedStyle;
        }
      });
    }
    await expect(page.locator('[data-render-status="error"]')).toHaveCount(0);
  });
test("reduced motion pauses v7 GPU time and switching edition disposes demo", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await route(page);
  await page
    .getByRole("button", { name: "Activate Xiaoyi", exact: true })
    .click();
  await expect(
    page.locator(".xy-v7-phone>.xy-v7-light canvas"),
  ).toHaveAttribute("data-paused", "true");
  const canvas = page.locator(".xy-v7-phone>.xy-v7-light canvas");
  const time = await canvas.getAttribute("data-time");
  await page.waitForTimeout(200);
  expect(await canvas.getAttribute("data-time")).toBe(time);
  await page.getByLabel("Design edition").selectOption("legacy");
  await expect(page.locator(".xy-v7-phone")).toHaveCount(0);
  await expect(page.locator("main h1")).toBeVisible();
});

test("v7 mobile keyboard and writing stay within the phone; close cancels work", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await route(page);
  await page
    .getByRole("button", { name: "Activate Xiaoyi", exact: true })
    .click();
  const assistant = page.locator(".xy-v7-assistant");
  await expect(assistant).toHaveAttribute("data-status", "streaming", {
    timeout: 10000,
  });
  await assistant
    .getByRole("button", { name: "Type a message", exact: true })
    .click();
  await expect(assistant.locator(".xy-v7-keyboard")).toBeVisible();
  await expect(assistant.getByLabel("Message Xiaoyi")).toBeFocused();
  const bounds = await assistant.evaluate((el) => {
    const p = el.closest(".xy-v7-phone").getBoundingClientRect(),
      a = el.getBoundingClientRect();
    return {
      left: a.left >= p.left,
      right: a.right <= p.right + 1,
      top: a.top >= p.top,
      bottom: a.bottom <= p.bottom + 1,
    };
  });
  expect(Object.values(bounds).every(Boolean)).toBeTruthy();
  await tabs(page)
    .getByRole("button", { name: "Writing assistant", exact: true })
    .click();
  const sheet = page.locator(".xy-v7-writing-sheet");
  await sheet.getByRole("button", { name: "Generate", exact: true }).click();
  await expect(sheet).toHaveAttribute("data-status", "querying");
  await sheet.getByRole("button", { name: "Close", exact: true }).click();
  await page.waitForTimeout(800);
  await expect(sheet).toHaveCount(0);
  await expect(page.locator(".xy-v7-host-editor textarea")).toHaveValue("");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});

test("v7 language switch preserves a user draft and selected requirements", async ({
  page,
}) => {
  await route(page);
  await tabs(page)
    .getByRole("button", { name: "Writing assistant", exact: true })
    .click();
  const sheet = page.locator(".xy-v7-writing-sheet");
  await sheet
    .getByLabel("Write an event plan")
    .fill("My original draft 阅读笔记");
  await sheet.getByLabel("Tone", { exact: true }).selectOption("formal");
  await page.getByRole("button", { name: "中文", exact: true }).click();
  await expect(sheet.getByLabel("写一篇方案策划")).toHaveValue(
    "My original draft 阅读笔记",
  );
  await expect(sheet.getByLabel("语气", { exact: true })).toHaveValue("formal");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(sheet.getByLabel("Write an event plan")).toHaveValue(
    "My original draft 阅读笔记",
  );
});
