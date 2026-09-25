import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
const root = process.cwd(),
  manifest = JSON.parse(fs.readFileSync("reference/manifest.json")),
  web = JSON.parse(fs.readFileSync("reference/web-sources.json")),
  tokens = JSON.parse(fs.readFileSync("tokens/xiaoyi.tokens.json"));
assert.equal(manifest.items.length, 18);
assert.equal(new Set(manifest.items.map((r) => r.id)).size, 18);
let checked = 0,
  local = 0;
for (const item of manifest.items) {
  assert(item.title && item.observation && item.sha256);
  assert(item.width > 0 && item.height > 0);
  const files = [item.preview, ...(item.frames || []).map((f) => f.preview)];
  for (const f of files) {
    assert(fs.statSync(path.join(root, "public", f)).size > 100);
    checked++;
  }
  const original = path.resolve(root, item.source);
  if (fs.existsSync(original)) {
    assert.equal(
      crypto
        .createHash("sha256")
        .update(fs.readFileSync(original))
        .digest("hex"),
      item.sha256,
    );
    local++;
  }
  if (item.frames) {
    assert.equal(item.frames.length, 5);
    assert(item.frames.every((f) => f.time > 0 && f.time < item.duration));
  }
}
assert.equal(web.length, 9);
assert(web.every((s) => s.url.startsWith("https://") && s.scope && s.accessed));
let count = 0;
for (const [group, items] of Object.entries(tokens)) {
  if (group.startsWith("$") || group === "meta") continue;
  for (const [key, t] of Object.entries(items)) {
    assert(t.$type && t.$value !== undefined && t.confidence);
    count++;
    if (group === "color") assert(/^#[0-9a-f]{6}$/i.test(t.$value));
    const variable = `--xy-${group.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}-${key}`;
    assert(fs.readFileSync("src/tokens.css", "utf8").includes(variable));
  }
}
assert.equal(count, 46);
for (const filename of [
  "tokens/xiaoyi.tokens.json",
  "src/tokens.css",
  "reference/manifest.json",
  "reference/web-sources.json",
])
  assert.equal(
    fs.readFileSync(filename, "utf8"),
    fs.readFileSync("public/downloads/" + path.basename(filename), "utf8"),
  );
for (const f of [
  "README.md",
  "docs/design-spec.md",
  "docs/components.md",
  "docs/evidence.md",
  "docs/verification.md",
  "AGENTS.md",
])
  assert(fs.existsSync(f), `Missing ${f}`);
console.log(
  `PASS: ${manifest.items.length} reference records, ${checked} derivatives, ${count} tokens, ${web.length} web sources, portable download parity.`,
);
console.log(
  `Original media hashes verified: ${local}/18${local < 18 ? " (originals are local-only and optional on other machines)" : ""}.`,
);
