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
  assert(md.includes("## English"), `${file}: English section missing`);
  assert(/[\u3400-\u9fff]/.test(md), `${file}: Chinese section missing`);
  assert(
    md.split("## English")[1].trim().length > 500,
    `${file}: English section incomplete`,
  );
}
const web = JSON.parse(fs.readFileSync("reference/web-sources.json"));
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
