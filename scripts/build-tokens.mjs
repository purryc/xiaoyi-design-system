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

const v7 = JSON.parse(fs.readFileSync("tokens/xiaoyi-v7.tokens.json", "utf8"));
const v7Css =
  "/* L19 reconstruction estimates; scoped, legacy tokens are unchanged. */\n.xy-v7-theme {\n" +
  Object.entries(v7.values)
    .map(([key, t]) => `  --xy-v7-${key}: ${t.$value};`)
    .join("\n") +
  "\n}\n";
fs.writeFileSync("src/v7/tokens.css", v7Css);
for (const file of [
  "tokens/xiaoyi-v7.tokens.json",
  "reference/v7-analysis.json",
])
  fs.copyFileSync(file, "public/downloads/" + file.split("/").pop());
fs.writeFileSync("public/downloads/xiaoyi-v7.css", v7Css);
const { v7Defaults, v7ParameterSchema } =
  await import("../src/v7/parameters.js");
fs.writeFileSync(
  "public/downloads/xiaoyi-v7.parameters.json",
  JSON.stringify(
    { source: "L19", parameters: v7Defaults, schema: v7ParameterSchema },
    null,
    2,
  ) + "\n",
);

const referenceManifest = JSON.parse(
  fs.readFileSync("reference/manifest.json", "utf8"),
);
for (const edition of ["v6", "v7"]) {
  fs.writeFileSync(
    `public/downloads/manifest-${edition}.json`,
    JSON.stringify(
      {
        ...referenceManifest,
        designEdition: edition,
        items: referenceManifest.items.filter(
          (item) => item.designEdition === edition,
        ),
      },
      null,
      2,
    ) + "\n",
  );
}
