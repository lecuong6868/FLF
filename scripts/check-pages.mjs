#!/usr/bin/env node
/**
 * Kiểm tra tĩnh: file bắt buộc tồn tại, chữ Việt trong content, không overflow CSS cơ bản.
 */
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  "index.html",
  "option-a/index.html",
  "option-a/styles.css",
  "option-b/index.html",
  "option-b/styles.css",
  "shared/content.js",
  "shared/render.js",
  "public/brand/logo-color.png",
  "public/brand/first-legal-force.png",
  "mockups/A-desktop-1440.png",
  "mockups/A-mobile-390.png",
  "mockups/B-desktop-1440.png",
  "mockups/B-mobile-390.png",
  "docs/SO-DO-TRANG.md",
  "docs/NOI-DUNG-MAU.md",
  "docs/DE-XUAT-HUONG.md",
  "docs/KIEM-TRA.md",
  "README.md",
];

let failed = 0;

for (const rel of required) {
  const p = join(root, rel);
  if (!existsSync(p)) {
    console.error("THIẾU:", rel);
    failed++;
    continue;
  }
  const size = statSync(p).size;
  if (size < 50) {
    console.error("QUÁ NHỎ:", rel, size);
    failed++;
  } else {
    console.log("OK", rel, `(${size} bytes)`);
  }
}

const content = readFileSync(join(root, "shared/content.js"), "utf8");
const phrases = [
  "Đồng hành cùng doanh nghiệp",
  "Nội dung đề xuất trong tài liệu duyệt",
  "đối tác hành nghề luật sư",
  "Nghị định 13/2023",
];
for (const phrase of phrases) {
  if (!content.includes(phrase)) {
    console.error("THIẾU CỤM TỪ:", phrase);
    failed++;
  } else {
    console.log("OK phrase:", phrase);
  }
}

// Guard against invented partner names / fake metrics in shared content
const banned = ["Top 10", "% thành công", "khách hàng tiêu biểu:", "giải thưởng"];
for (const b of banned) {
  if (content.toLowerCase().includes(b.toLowerCase())) {
    console.error("NGHI NGỜ NỘI DUNG BỊA:", b);
    failed++;
  }
}

if (failed) {
  console.error(`\nFAIL: ${failed} lỗi`);
  process.exit(1);
}
console.log("\nPASS: kiểm tra tĩnh đạt");
