#!/usr/bin/env node
/**
 * Kiểm tra tĩnh: file bắt buộc, chữ Việt, menu mục mới, không nội dung bịa.
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
  "option-a/tin-tuc/index.html",
  "option-a/tin-tuc/bai-mau.html",
  "option-a/quy-dinh-moi/index.html",
  "option-a/quy-dinh-moi/bai-mau.html",
  "option-a/quy-dinh-moi/du-thao.html",
  "option-a/quy-dinh-moi/chua-hieu-luc.html",
  "option-a/chuyen-muc/index.html",
  "option-a/chuyen-muc/bai-mau.html",
  "option-b/tin-tuc/index.html",
  "option-b/quy-dinh-moi/index.html",
  "option-b/chuyen-muc/index.html",
  "shared/content.js",
  "shared/render.js",
  "public/brand/logo-color.png",
  "public/brand/first-legal-force.png",
  "mockups/A-desktop-1440.png",
  "mockups/A-mobile-390.png",
  "mockups/B-desktop-1440.png",
  "mockups/B-mobile-390.png",
  "mockups/B-mobile-390-menu-open.png",
  "docs/SO-DO-TRANG.md",
  "docs/NOI-DUNG-MAU.md",
  "docs/DE-XUAT-HUONG.md",
  "docs/KIEM-TRA.md",
  "docs/KIEM-TRA-TRINH-DUYET.json",
  "docs/PREVIEW-URL.md",
  "docs/BAN-GIAO-HEADER.md",
  "docs/DEPLOY-CAU-HINH.md",
  "scripts/test-header-menu.mjs",
  "scripts/verify-preview-url.mjs",
  "scripts/bootstrap-browser-libs.sh",
  "scripts/browser-env.sh",
  "robots.txt",
  "README.md",
];

let failed = 0;

const indexHtml = readFileSync(join(root, "index.html"), "utf8");
const indexRequired = [
  'name="robots" content="noindex',
  "Bản thiết kế chờ duyệt",
  "Flow khách",
  "Luật sư đối tác duyệt",
  "Phân biệt: minh họa vs đã hoạt động",
  "data-zoom",
  "Quy định mới",
  "Chuyên mục",
  "Lỗi MXH không làm mất bài web",
  "AI tạo bản nháp",
];
for (const phrase of indexRequired) {
  if (!indexHtml.includes(phrase)) {
    console.error("THIẾU TRONG index.html:", phrase);
    failed++;
  } else {
    console.log("OK index:", phrase.slice(0, 48));
  }
}

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
  "Quy định mới",
  "Chuyên mục",
  "Tin tức",
  "Đang có hiệu lực",
  "Dự thảo",
  "Chưa có hiệu lực",
  "Quản trị rủi ro",
  "Lao động & nhân sự",
  "Hợp đồng & giao dịch",
  "Tuân thủ & bảo vệ dữ liệu",
];
for (const phrase of phrases) {
  if (!content.includes(phrase)) {
    console.error("THIẾU CỤM TỪ:", phrase);
    failed++;
  } else {
    console.log("OK phrase:", phrase);
  }
}

// Nav labels must appear
for (const label of ["Tin tức", "Quy định mới", "Chuyên mục"]) {
  if (!content.includes(`label: "${label}"`)) {
    console.error("THIẾU NAV:", label);
    failed++;
  } else {
    console.log("OK nav:", label);
  }
}

// Chuyên mục submenu (phương án B đã chốt)
for (const label of ["Đầu tư", "Thuế", "Quản trị doanh nghiệp", "Quản trị rủi ro", "Giấy phép"]) {
  if (!content.includes(`label: "${label}"`)) {
    console.error("THIẾU CHUYÊN MỤC CON:", label);
    failed++;
  } else {
    console.log("OK chuyên mục:", label);
  }
}
if (!content.includes("chuyen-muc/?chu-de=")) {
  console.error("THIẾU link hợp lệ chuyên mục (?chu-de=)");
  failed++;
} else {
  console.log("OK chuyên mục query links");
}

const render = readFileSync(join(root, "shared/render.js"), "utf8");
for (const phrase of [
  'aria-expanded',
  'Escape',
  'aria-hidden',
  'data-menu-toggle',
  'submenu',
  'chu-de',
]) {
  if (!render.includes(phrase)) {
    console.error("THIẾU TRONG render.js:", phrase);
    failed++;
  } else {
    console.log("OK render:", phrase);
  }
}

const headerB = readFileSync(join(root, "option-b/index.html"), "utf8");
for (const phrase of ["data-menu-backdrop", "aria-controls=\"mobile-nav\"", "data-menu-toggle"]) {
  if (!headerB.includes(phrase)) {
    console.error("THIẾU TRONG option-b header:", phrase);
    failed++;
  } else {
    console.log("OK option-b header:", phrase);
  }
}

const cssB = readFileSync(join(root, "option-b/styles.css"), "utf8");
for (const phrase of [".submenu", ".nav-sub-toggle", "body.nav-open", ".menu-backdrop"]) {
  if (!cssB.includes(phrase)) {
    console.error("THIẾU CSS B:", phrase);
    failed++;
  } else {
    console.log("OK css B:", phrase);
  }
}

const soDo = readFileSync(join(root, "docs/SO-DO-TRANG.md"), "utf8");
for (const phrase of [
  "Quy định mới",
  "Chuyên mục",
  "AI tạo bản nháp",
  "Luật sư đối tác duyệt",
  "Chống đăng trùng",
]) {
  if (!soDo.includes(phrase)) {
    console.error("THIẾU TRONG SO-DO-TRANG.md:", phrase);
    failed++;
  } else {
    console.log("OK so-do:", phrase);
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

// Quick link sanity: section pages reference shared scripts
for (const rel of [
  "option-a/quy-dinh-moi/bai-mau.html",
  "option-b/chuyen-muc/index.html",
]) {
  const html = readFileSync(join(root, rel), "utf8");
  if (!html.includes("shared/content.js") || !html.includes("noindex")) {
    console.error("TRANG MỤC THIẾU script/noindex:", rel);
    failed++;
  } else {
    console.log("OK section page:", rel);
  }
}

if (failed) {
  console.error(`\nFAIL: ${failed} lỗi`);
  process.exit(1);
}
console.log("\nPASS: kiểm tra tĩnh đạt");
