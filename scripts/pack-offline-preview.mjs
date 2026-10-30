#!/usr/bin/env node
/**
 * Đóng gói bản xem thử offline FLF (phương án B) → FLF-preview.zip
 * Sau giải nén: mở index.html bằng trình duyệt (file://), không cần server.
 */
import { cpSync, mkdirSync, rmSync, writeFileSync, readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "FLF-preview");
const ZIP_PATH = join(ROOT, "FLF-preview.zip");

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src)) {
    const s = join(src, name);
    const d = join(dest, name);
    if (statSync(s).isDirectory()) copyDir(s, d);
    else cpSync(s, d);
  }
}

function mustExist(p, label) {
  if (!existsSync(p)) throw new Error(`Thiếu ${label}: ${p}`);
}

mustExist(join(ROOT, "option-b", "index.html"), "option-b");
mustExist(join(ROOT, "shared", "content.js"), "shared");
mustExist(join(ROOT, "public", "brand", "logo-color.png"), "logo");
mustExist(join(ROOT, "public", "fonts", "NotoSans-VI.ttf"), "fonts");

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

copyDir(join(ROOT, "option-b"), join(OUT_DIR, "option-b"));
copyDir(join(ROOT, "shared"), join(OUT_DIR, "shared"));
copyDir(join(ROOT, "public"), join(OUT_DIR, "public"));

const launcher = `<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>FLF — Bản xem thử offline (phương án B)</title>
    <link rel="icon" href="public/brand/logo-color.png" type="image/png" />
    <meta http-equiv="refresh" content="0; url=option-b/index.html" />
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: system-ui, sans-serif;
        background: #f3f6f8;
        color: #102130;
      }
      a {
        color: #003050;
        font-weight: 600;
        font-size: 1.1rem;
      }
      p { color: #617484; max-width: 36rem; text-align: center; }
    </style>
  </head>
  <body>
    <div>
      <p>Đang mở preview phương án B…</p>
      <p><a href="option-b/index.html">Mở trang chủ FLF (offline)</a></p>
      <p>Nếu trình duyệt chặn tự chuyển hướng khi mở file://, hãy bấm liên kết trên.</p>
    </div>
  </body>
</html>
`;
writeFileSync(join(OUT_DIR, "index.html"), launcher, "utf8");

const readmeOffline = `# FLF — Bản xem thử offline (phương án B)

## Cách mở (không cần cài đặt)

1. Giải nén \`FLF-preview.zip\`
2. Mở file \`index.html\` bằng trình duyệt (Chrome / Edge / Firefox)
3. Hoặc mở trực tiếp \`option-b/index.html\`

Không cần Node, Python, server hay GitHub Pages.

## Nội dung gói

- \`option-b/\` — giao diện phương án B (trang chủ, Tin tức, Quy định mới, Chuyên mục)
- \`shared/\` — nội dung & script menu
- \`public/brand/\` — logo khách gửi
- \`public/fonts/\` — font local (offline)

## Lưu ý

- Đây là **bản thiết kế chờ duyệt** (mockup), không phải website chính thức flf.vn.
- Form / nút liên hệ chỉ **minh họa** — không gửi dữ liệu, không báo gửi thành công giả.
- CMS, AI, MXH chưa có trong gói này.
`;
writeFileSync(join(OUT_DIR, "README.md"), readmeOffline, "utf8");

const shotsSrc = join(ROOT, "mockups", "offline");
const shotsDest = join(OUT_DIR, "screenshots");
if (existsSync(shotsSrc)) {
  mkdirSync(shotsDest, { recursive: true });
  for (const name of readdirSync(shotsSrc)) {
    if (name.endsWith(".png")) cpSync(join(shotsSrc, name), join(shotsDest, name));
  }
}
const docsDest = join(OUT_DIR, "docs");
mkdirSync(docsDest, { recursive: true });
for (const name of ["KIEM-TRA-OFFLINE.md", "KIEM-TRA-OFFLINE.json"]) {
  const p = join(ROOT, "docs", name);
  if (existsSync(p)) cpSync(p, join(docsDest, name));
}

rmSync(ZIP_PATH, { force: true });

let zipOk = false;
try {
  execFileSync("zip", ["-r", "-q", ZIP_PATH, "FLF-preview"], { cwd: ROOT });
  zipOk = true;
} catch {
  /* fallback: Python zipfile */
  const py = `
import zipfile, os
root = ${JSON.stringify(ROOT)}
out = ${JSON.stringify(ZIP_PATH)}
base = ${JSON.stringify(OUT_DIR)}
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    for dirpath, _, files in os.walk(base):
        for f in files:
            full = os.path.join(dirpath, f)
            arc = os.path.relpath(full, root)
            z.write(full, arc)
print("zipped", out)
`;
  execFileSync("python3", ["-c", py], { cwd: ROOT });
  zipOk = true;
}

const size = statSync(ZIP_PATH).size;
const report = {
  ok: zipOk,
  zip: relative(ROOT, ZIP_PATH),
  folder: relative(ROOT, OUT_DIR),
  bytes: size,
  mb: Math.round((size / 1024 / 1024) * 100) / 100,
  entry: "FLF-preview/index.html → option-b/index.html",
  createdAt: new Date().toISOString(),
};
writeFileSync(join(ROOT, "docs", "OFFLINE-PACK.json"), JSON.stringify(report, null, 2) + "\n", "utf8");
console.log(JSON.stringify(report, null, 2));
console.log("\nOK — giải nén FLF-preview.zip rồi mở FLF-preview/index.html");
