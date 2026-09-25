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
assert.equal(web.length, 18);
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

const { iconLibrary, iconSvg } = await import("../src/icons/icon-data.js");
const { parameterSchema, sanitizeParameters } =
  await import("../src/motion/parameters.js");
assert.equal(iconLibrary.length, 77);
assert.equal(new Set(iconLibrary.map((i) => i.id)).size, 77);
const aliases = iconLibrary.flatMap((i) => [i.id, ...i.aliases]);
assert.equal(new Set(aliases).size, aliases.length);
for (const i of iconLibrary) {
  assert.equal(fs.readFileSync(`public/icons/${i.id}.svg`, "utf8"), iconSvg(i));
  assert(i.source && i.note);
}
assert.equal(parameterSchema.length, 28);
for (const p of parameterSchema) {
  assert(p.unit && p.evidence && p.description);
  if (p.type !== "color") assert(p.default >= p.min && p.default <= p.max);
}
assert.equal(
  sanitizeParameters({ radius: 1e9, cyan: "red", maxFps: NaN }).radius,
  0.7,
);
assert.equal(
  sanitizeParameters({ radius: 1e9, cyan: "red", maxFps: NaN }).cyan,
  "#70efff",
);
const motion = JSON.parse(fs.readFileSync("reference/motion-analysis.json"));
const fit = JSON.parse(fs.readFileSync("reference/light-field-fit.json"));
assert.equal(motion.frames.length, 38);
assert.equal(fit.frames.length, 38);
const sampledColors = JSON.parse(
  fs.readFileSync("reference/orb-color-samples.json"),
);
assert.equal(
  sampledColors.sourceSha256,
  manifest.items.find((x) => x.id === "L10").sha256,
);
assert.equal(sampledColors.frames.length, motion.frames.length);
for (const [i, f] of sampledColors.frames.entries()) {
  assert.equal(f.time, motion.frames[i].time);
  for (const [key, count] of [
    ["ringSrgb", 16],
    ["glowSrgb", 16],
    ["bodySrgb", 4],
  ]) {
    assert.equal(f[key].length, count);
    for (const color of f[key]) {
      assert.equal(color.length, 3);
      assert(color.every((x) => Number.isFinite(x) && x >= 0 && x <= 1));
    }
  }
  assert.equal(f.coreSrgb.length, 3);
  assert(f.coreSrgb.every((x) => Number.isFinite(x) && x >= 0 && x <= 1));
}
for (let i = 0; i < motion.frames.length; i++) {
  const f = fit.frames[i];
  assert.equal(f.time, motion.frames[i].time);
  assert.equal(f.background.length, 10);
  assert.equal(f.radius.length, 9);
  assert.equal(f.radiance.length, 9);
  assert(
    [...f.background.flat(), ...f.radius, ...f.radiance.flat()].every(
      Number.isFinite,
    ),
  );
  assert(fs.existsSync("public" + motion.frames[i].preview));
}
assert.equal(
  crypto
    .createHash("sha256")
    .update(fs.readFileSync("public" + motion.proxy.path))
    .digest("hex"),
  motion.proxy.sha256,
);
assert(!fs.readFileSync("src/styles.css", "utf8").includes(".xy-orb::after"));
console.log(
  "PASS: 77 unique SVGs and aliases, 28 annotated parameters, 38 finite light-field fits and comparison proxy SHA-256.",
);

const { controlItems } = await import("../src/controls/catalog.js");
assert.equal(controlItems.length, 6);
for (const item of controlItems) {
  assert(item.code && item.params.length && item.description);
  for (const id of item.sources) assert(web.some((s) => s.id === id));
  for (const id of item.local || [])
    assert(manifest.items.some((s) => s.id === id));
}
const figures = web.filter((s) => s.figure);
assert.equal(figures.length, 3);
for (const source of figures) {
  assert(source.figure.attribution && source.figure.licenseUrl);
  assert.equal(
    crypto
      .createHash("sha256")
      .update(fs.readFileSync("public" + source.preview))
      .digest("hex"),
    source.figure.previewSha256,
  );
}
assert(fs.existsSync("docs/controls.md"));
console.log(
  "PASS: 6 control specimens, all source IDs resolved, 3 official figure hashes and attribution.",
);

const edgeAnalysis = JSON.parse(
  fs.readFileSync("reference/edge-light-analysis.json"),
);
assert.equal(edgeAnalysis.profiles.length, 15);
assert(
  edgeAnalysis.profiles.every(
    (p) =>
      p.halfWidth >= 8 &&
      p.halfWidth <= 9 &&
      p.tenthWidth >= 14 &&
      p.tenthWidth <= 18,
  ),
);
assert.equal(edgeAnalysis.frames.length, 13);
for (const source of edgeAnalysis.sources)
  assert.equal(
    source.sha256,
    manifest.items.find((x) => x.id === source.id).sha256,
  );
for (const f of edgeAnalysis.frames) {
  assert.equal(f.colors.length, 16);
  assert(
    f.colors.every(
      (c) =>
        c.length === 3 &&
        c.every((v) => Number.isFinite(v) && v >= 0 && v <= 1),
    ),
  );
}
const { edgeDefaults, sanitizeEdgeParameters } =
  await import("../src/motion/edge-parameters.js");
assert.equal(sanitizeEdgeParameters({ innerWidth: 1e9 }).innerWidth, 50);
assert.equal(
  sanitizeEdgeParameters({ innerWidth: NaN }).innerWidth,
  edgeDefaults.innerWidth,
);
assert.equal(sanitizeEdgeParameters({ outerOpacity: -2 }).outerOpacity, 0);
assert.equal(Object.keys(sanitizeEdgeParameters({ unknown: 4 })).length, 6);
const edgeExport = JSON.parse(
  fs.readFileSync("public/downloads/xiaoyi-edge-light.parameters.json"),
);
assert.deepEqual(edgeExport.parameters, edgeDefaults);
assert(edgeExport.schema.every((p) => p.unit && p.labelEn && p.descriptionEn));
console.log(
  "PASS: 15 measured edge profiles, 13 palette frames, 6 bounded parameters and bilingual edge export.",
);
