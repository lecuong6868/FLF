#!/usr/bin/env node
/**
 * Đóng gói FLF-preview/ → FLF-preview.zip (dùng Python zipfile — không cần binary zip).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const previewDir = path.join(root, "FLF-preview");
const zipPath = path.join(root, "FLF-preview.zip");

if (!fs.existsSync(path.join(previewDir, "vi/index.html"))) {
  console.error("Thiếu FLF-preview/vi/index.html");
  process.exit(1);
}
if (!fs.existsSync(path.join(previewDir, "en/index.html"))) {
  console.error("Thiếu FLF-preview/en/index.html");
  process.exit(1);
}
if (!fs.existsSync(path.join(previewDir, "vi/gioi-thieu/index.html"))) {
  console.error("Thiếu FLF-preview/vi/gioi-thieu/index.html");
  process.exit(1);
}
if (!fs.existsSync(path.join(previewDir, "en/about/index.html"))) {
  console.error("Thiếu FLF-preview/en/about/index.html");
  process.exit(1);
}
const sectionRequired = [
  "vi/quy-dinh-moi/index.html",
  "vi/quy-dinh-moi/cau-truc-mau.html",
  "en/regulations/index.html",
  "en/regulations/layout-sample.html",
  "vi/chuyen-muc/index.html",
  "vi/chuyen-muc/bai-mau.html",
  "en/topics/index.html",
  "en/topics/sample-post.html",
];
for (const rel of sectionRequired) {
  if (!fs.existsSync(path.join(previewDir, rel))) {
    console.error(`Thiếu FLF-preview/${rel}`);
    process.exit(1);
  }
}

if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

const py = `
import zipfile, os, pathlib, sys
root = pathlib.Path(sys.argv[1])
preview = root / "FLF-preview"
zip_path = root / "FLF-preview.zip"
skip = {".DS_Store"}
with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
    for path in preview.rglob("*"):
        if path.is_file() and path.name not in skip:
            zf.write(path, path.relative_to(root).as_posix())
print(zip_path.stat().st_size)
`;

const size = Number(
  execFileSync("python3", ["-c", py, root], { encoding: "utf8" }).trim()
);
console.log(`Wrote ${zipPath} (${(size / 1024 / 1024).toFixed(2)} MB)`);

/* Smoke unpack */
const smoke = `
import zipfile, pathlib, sys, tempfile, shutil
root = pathlib.Path(sys.argv[1])
zip_path = root / "FLF-preview.zip"
tmp = root / ".tmp-preview-unpack"
if tmp.exists():
    shutil.rmtree(tmp)
tmp.mkdir()
with zipfile.ZipFile(zip_path) as zf:
    zf.extractall(tmp)
needed = [
    "FLF-preview/index.html",
    "FLF-preview/vi/index.html",
    "FLF-preview/en/index.html",
    "FLF-preview/vi/gioi-thieu/index.html",
    "FLF-preview/en/about/index.html",
    "FLF-preview/vi/quy-dinh-moi/index.html",
    "FLF-preview/en/regulations/index.html",
    "FLF-preview/vi/chuyen-muc/index.html",
    "FLF-preview/en/topics/index.html",
    "FLF-preview/assets/styles.css",
    "FLF-preview/assets/home.js",
    "FLF-preview/public/brand/logo-color.png",
]
for rel in needed:
    p = tmp / rel
    if not p.exists():
        raise SystemExit(f"ZIP thiếu: {rel}")
vi = (tmp / "FLF-preview/vi/index.html").read_text(encoding="utf-8")
en = (tmp / "FLF-preview/en/index.html").read_text(encoding="utf-8")
vi_about = (tmp / "FLF-preview/vi/gioi-thieu/index.html").read_text(encoding="utf-8")
en_about = (tmp / "FLF-preview/en/about/index.html").read_text(encoding="utf-8")
vi_reg = (tmp / "FLF-preview/vi/quy-dinh-moi/index.html").read_text(encoding="utf-8")
en_reg = (tmp / "FLF-preview/en/regulations/index.html").read_text(encoding="utf-8")
assert "../en/index.html" in vi
assert "../vi/index.html" in en
assert "../../en/about/index.html" in vi_about
assert "../../vi/gioi-thieu/index.html" in en_about
assert "quy-dinh-moi/index.html" in vi
assert "regulations/index.html" in en
assert "../../en/regulations/index.html" in vi_reg
assert "../../vi/quy-dinh-moi/index.html" in en_reg
assert "Chưa có quy định đã xác minh" in vi_reg
shutil.rmtree(tmp)
print("ZIP unpack smoke: OK")
`;
execFileSync("python3", ["-c", smoke, root], { stdio: "inherit" });
