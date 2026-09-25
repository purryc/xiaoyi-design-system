import fs from "node:fs";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
fs.mkdirSync("qa", { recursive: true });
execFileSync(process.execPath, ["scripts/extract-i18n.mjs"]);
const catalog = JSON.parse(fs.readFileSync("src/i18n/en.json"));
const strings = JSON.parse(fs.readFileSync("qa/i18n-strings.json"));
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const matcher = new RegExp(
  Object.keys(catalog)
    .sort((a, b) => b.length - a.length)
    .map(escape)
    .join("|"),
  "g",
);
const exempt = (s) =>
  s.startsWith("../") || /\.(png|jpe?g|mov|mp4|webp)$/.test(s);
const missing = strings.filter(
  (s) =>
    !exempt(s) &&
    /[\u3400-\u9fff]/.test(catalog[s] || s.replace(matcher, (m) => catalog[m])),
);
assert.deepEqual(missing, [], "Missing English source strings");
for (const file of [
  "README.md",
  "AGENTS.md",
  ...fs
    .readdirSync("docs")
    .filter((f) => f.endsWith(".md"))
    .map((f) => "docs/" + f),
]) {
  const md = fs.readFileSync(file, "utf8");
  const englishSection = md
    .split(/^## English[ \t]*$/m)[1]
    ?.split(/\n---\n\n## 中文/)[0];
  assert(englishSection, `${file}: English section missing`);
  assert(/[\u3400-\u9fff]/.test(md), `${file}: Chinese section missing`);
  assert(
    englishSection.trim().length > 500,
    `${file}: English section incomplete`,
  );
  const readableEnglish = englishSection
    .replaceAll("../小艺/", "../source-media/")
    .replaceAll("中文", "Chinese");
  assert(
    !/[\u3400-\u9fff]/.test(readableEnglish),
    `${file}: untranslated Chinese in English section`,
  );
}
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const assertEnglishField = (row, chineseField, englishField, context) => {
  const source = row[chineseField];
  if (source === undefined) return;
  assert.equal(
    row[englishField],
    catalog[source] || source,
    `${context}: ${englishField} must match English catalog`,
  );
  assert(
    !/[\u3400-\u9fff]/.test(row[englishField]),
    `${context}: ${englishField} contains Chinese`,
  );
};
const manifest = readJson("reference/manifest.json");
for (const item of manifest.items)
  for (const field of ["title", "category", "observation"])
    assertEnglishField(item, field, `${field}En`, item.id);
const web = JSON.parse(fs.readFileSync("reference/web-sources.json"));
for (const source of web)
  for (const field of ["title", "scope", "note", "evidence"])
    assertEnglishField(source, field, `${field}En`, source.id);
const tokens = readJson("tokens/xiaoyi.tokens.json");
for (const [id, color] of Object.entries(tokens.color)) {
  assertEnglishField(color, "label", "labelEn", `token ${id}`);
  assertEnglishField(color, "$description", "descriptionEn", `token ${id}`);
}
const motion = readJson("reference/motion-analysis.json");
for (const [index, segment] of motion.segments.entries())
  assertEnglishField(segment, "label", "labelEn", `motion segment ${index}`);
const icons = readJson("public/icons/manifest.json");
for (const icon of icons.icons)
  for (const field of ["label", "category", "confidence", "note"])
    assertEnglishField(icon, field, `${field}En`, `icon ${icon.id}`);
const vision = web.find((s) => s.id === "W18");
assert.equal(vision.figures.length, 5);
const crypto = await import("node:crypto");
for (const f of vision.figures)
  assert.equal(
    crypto
      .createHash("sha256")
      .update(fs.readFileSync("public" + f.path))
      .digest("hex"),
    f.sha256,
  );
console.log(
  `PASS: ${Object.keys(catalog).length} English entries, UI source coverage, bilingual Markdown and 5 vision hashes.`,
);
