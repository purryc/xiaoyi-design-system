import fs from "node:fs";
import { deflateRawSync } from "node:zlib";
import { iconLibrary, iconSvg } from "../src/icons/icon-data.js";
import { defaults, parameterExport } from "../src/motion/parameters.js";
fs.mkdirSync("public/icons", { recursive: true });
fs.mkdirSync("public/downloads", { recursive: true });
const english = JSON.parse(fs.readFileSync("src/i18n/en.json"));
const files = [];
for (const icon of iconLibrary) {
  const svg = iconSvg(icon);
  fs.writeFileSync(`public/icons/${icon.id}.svg`, svg);
  files.push({ name: `svg/${icon.id}.svg`, data: Buffer.from(svg) });
}
const manifest = JSON.stringify(
  {
    version: "2.2",
    grid: 24,
    defaultStroke: 1.65,
    count: iconLibrary.length,
    icons: iconLibrary.map((i) => ({
      ...i,
      labelEn: english[i.label],
      categoryEn: english[i.category],
      noteEn: english[i.note],
    })),
  },
  null,
  2,
);
const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${iconLibrary
  .map(
    (icon) =>
      `<symbol id="xy-${icon.id}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${iconSvg(
        icon,
      )
        .replace(/^<svg[^>]*>/, "")
        .replace(/<\/svg>$/, "")}</symbol>`,
  )
  .join("")}</svg>`;
fs.writeFileSync("public/icons/manifest.json", manifest);
fs.writeFileSync("public/icons/sprite.svg", sprite);
files.push(
  { name: "manifest.json", data: Buffer.from(manifest) },
  { name: "sprite.svg", data: Buffer.from(sprite) },
  {
    name: "README.txt",
    data: Buffer.from(
      "Xiaoyi icons: hand-authored 24x24 SVG research reconstruction.\nDefault stroke 1.65, round joins and caps. See manifest for source and provenance per icon.\nNot an official Huawei icon distribution.\n小艺图标：24×24 手绘 SVG 研究复刻。默认笔画 1.65，圆端点与圆连接。每枚图标的来源见 manifest；非华为官方图标分发。\n",
    ),
  },
);
// Deterministic ZIP: deflate-compressed files, a standard CRC-32 and central directory; no runtime dependency.
const crcTable = Array.from({ length: 256 }, (_, n) => {
  for (let k = 0; k < 8; k++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
  return n >>> 0;
});
function crc32(b) {
  let c = 0xffffffff;
  for (const byte of b) c = crcTable[(c ^ byte) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
let offset = 0;
const bodies = [],
  centrals = [];
for (const f of files) {
  const name = Buffer.from(f.name),
    body = deflateRawSync(f.data),
    crc = crc32(f.data),
    h = Buffer.alloc(30),
    c = Buffer.alloc(46);
  h.writeUInt32LE(0x04034b50);
  h.writeUInt16LE(20, 4);
  h.writeUInt16LE(8, 8);
  h.writeUInt16LE(23865, 12);
  h.writeUInt32LE(crc, 14);
  h.writeUInt32LE(body.length, 18);
  h.writeUInt32LE(f.data.length, 22);
  h.writeUInt16LE(name.length, 26);
  c.writeUInt32LE(0x02014b50);
  c.writeUInt16LE(20, 4);
  c.writeUInt16LE(20, 6);
  c.writeUInt16LE(8, 10);
  c.writeUInt16LE(23865, 14);
  c.writeUInt32LE(crc, 16);
  c.writeUInt32LE(body.length, 20);
  c.writeUInt32LE(f.data.length, 24);
  c.writeUInt16LE(name.length, 28);
  c.writeUInt32LE(offset, 42);
  bodies.push(h, name, body);
  centrals.push(c, name);
  offset += h.length + name.length + body.length;
}
const central = Buffer.concat(centrals),
  end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50);
end.writeUInt16LE(files.length, 8);
end.writeUInt16LE(files.length, 10);
end.writeUInt32LE(central.length, 12);
end.writeUInt32LE(offset, 16);
fs.writeFileSync(
  "public/downloads/xiaoyi-icons.zip",
  Buffer.concat([...bodies, central, end]),
);
fs.writeFileSync(
  "public/downloads/xiaoyi-motion.parameters.json",
  JSON.stringify(parameterExport(defaults), null, 2),
);
console.log(
  `Generated ${iconLibrary.length} SVG icons, sprite, ZIP and annotated TSL parameter export.`,
);
