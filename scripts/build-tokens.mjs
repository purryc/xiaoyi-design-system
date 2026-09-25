import fs from "node:fs";
const tokens = JSON.parse(fs.readFileSync("tokens/xiaoyi.tokens.json", "utf8"));
const lines = [
  "/* Generated from tokens/xiaoyi.tokens.json. Numeric values are reconstruction estimates. */",
  ":root {",
];
for (const [group, items] of Object.entries(tokens)) {
  if (group.startsWith("$") || group === "meta") continue;
  for (const [name, t] of Object.entries(items)) {
    const v = t.$value;
    const value =
      group === "easing"
        ? `cubic-bezier(${v.join(",")})`
        : typeof v === "object"
          ? `${v.value}${v.unit}`
          : v;
    lines.push(
      `  --xy-${group.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}-${name}: ${value};`,
    );
  }
}
lines.push("}");
fs.writeFileSync("src/tokens.css", lines.join("\n") + "\n");
fs.mkdirSync("public/downloads", { recursive: true });
for (const file of [
  "tokens/xiaoyi.tokens.json",
  "src/tokens.css",
  "reference/manifest.json",
  "reference/web-sources.json",
])
  fs.copyFileSync(file, "public/downloads/" + file.split("/").pop());
console.log("Generated CSS and portable downloads.");
