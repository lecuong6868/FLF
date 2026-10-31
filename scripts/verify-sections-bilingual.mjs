#!/usr/bin/env node
/**
 * Kiểm tra Quy định mới / Chuyên mục VI–EN: tồn tại file, menu, chuyển ngữ,
 * trạng thái trống quy định, không bịa số hiệu, không localStorage/fetch.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const preview = path.join(root, "FLF-preview");
const errors = [];
const ok = [];

function assert(cond, msg) {
  if (cond) ok.push(msg);
  else errors.push(msg);
}

function read(rel) {
  const p = path.join(preview, rel);
  const exists = fs.existsSync(p);
  assert(exists, `exists: ${rel}`);
  return exists ? fs.readFileSync(p, "utf8") : "";
}

const required = [
  "vi/quy-dinh-moi/index.html",
  "vi/quy-dinh-moi/cau-truc-mau.html",
  "en/regulations/index.html",
  "en/regulations/layout-sample.html",
  "vi/chuyen-muc/index.html",
  "vi/chuyen-muc/bai-mau.html",
  "vi/chuyen-muc/thue-minh-hoa.html",
  "vi/chuyen-muc/tuan-thu-minh-hoa.html",
  "en/topics/index.html",
  "en/topics/sample-post.html",
  "en/topics/tax-illustration.html",
  "en/topics/compliance-illustration.html",
];

const pages = Object.fromEntries(required.map((rel) => [rel, read(rel)]));

const viHome = read("vi/index.html");
const enHome = read("en/index.html");
const viAbout = read("vi/gioi-thieu/index.html");
const enAbout = read("en/about/index.html");

/* Menu đồng bộ trên trang chủ / giới thiệu */
for (const [label, html] of [
  ["vi-home", viHome],
  ["vi-about", viAbout],
]) {
  assert(html.includes("quy-dinh-moi/index.html"), `${label}: nav Quy định mới`);
  assert(html.includes("chuyen-muc/index.html"), `${label}: nav Chuyên mục`);
}
for (const [label, html] of [
  ["en-home", enHome],
  ["en-about", enAbout],
]) {
  assert(html.includes("regulations/index.html"), `${label}: nav New regulations`);
  assert(html.includes("topics/index.html"), `${label}: nav Topics`);
}

/* Không ghi đè Giới thiệu — vẫn còn nội dung chính */
assert(
  /làm rõ nhu cầu|phạm vi|đối tác/i.test(viAbout),
  "vi about body preserved"
);
assert(/clarify|scope|partner/i.test(enAbout), "en about body preserved");

/* Chuyển ngữ giữ đúng trang */
assert(
  pages["vi/quy-dinh-moi/index.html"].includes("../../en/regulations/index.html"),
  "VI regs → EN regs"
);
assert(
  pages["en/regulations/index.html"].includes("../../vi/quy-dinh-moi/index.html"),
  "EN regs → VI regs"
);
assert(
  pages["vi/chuyen-muc/index.html"].includes("../../en/topics/index.html"),
  "VI topics → EN topics"
);
assert(
  pages["en/topics/index.html"].includes("../../vi/chuyen-muc/index.html"),
  "EN topics → VI topics"
);
assert(
  pages["vi/quy-dinh-moi/cau-truc-mau.html"].includes(
    "../../en/regulations/layout-sample.html"
  ),
  "VI layout sample ↔ EN"
);
assert(
  pages["vi/chuyen-muc/bai-mau.html"].includes("../../en/topics/sample-post.html"),
  "VI topic article ↔ EN"
);

/* Quy định: trạng thái trống, không bịa số hiệu kiểu NĐ/QĐ thật */
const viRegList = pages["vi/quy-dinh-moi/index.html"];
const enRegList = pages["en/regulations/index.html"];
assert(/Chưa có quy định đã xác minh/i.test(viRegList), "VI empty verified list");
assert(/No verified regulations yet/i.test(enRegList), "EN empty verified list");
assert(/empty-state/.test(viRegList) && /empty-state/.test(enRegList), "empty-state markup");

const viDetail = pages["vi/quy-dinh-moi/cau-truc-mau.html"];
assert(/Số văn bản/.test(viDetail), "VI detail has doc number field");
assert(/Cơ quan ban hành/.test(viDetail), "VI detail has issuer field");
assert(/Ngày ban hành/.test(viDetail), "VI detail has issue date");
assert(/Ngày hiệu lực/.test(viDetail), "VI detail has effective date");
assert(/Tình trạng hiệu lực/.test(viDetail), "VI detail has status");
assert(/Tóm tắt tác động/.test(viDetail), "VI detail has impact summary");
assert(/nguồn chính thức/i.test(viDetail), "VI detail has official source");
assert(
  !/\bNĐ\s*-\s*\d|\bQĐ\s*\/\s*\d{4}\b|\bLuật số\b/i.test(viDetail),
  "VI detail does not invent real instrument numbers"
);

const enDetail = pages["en/regulations/layout-sample.html"];
assert(/Document number/.test(enDetail), "EN detail has document number");
assert(/Issuing authority/.test(enDetail), "EN detail has issuer");
assert(/Effective date/.test(enDetail), "EN detail has effective date");
assert(/Official source/.test(enDetail), "EN detail has official source");

/* Chuyên mục có nhóm + bài */
assert(
  pages["vi/chuyen-muc/index.html"].includes('data-topic="dau-tu"'),
  "VI topics has investment group"
);
assert(
  pages["en/topics/index.html"].includes('data-topic="thue"'),
  "EN topics has tax group"
);
assert(
  !/khách hàng tiêu biểu|top\s*1|hàng đầu Việt Nam|doanh thu/i.test(
    pages["vi/chuyen-muc/bai-mau.html"]
  ),
  "VI topic article does not invent achievements"
);

/* Không localStorage / fetch để đổi ngôn ngữ trên trang section */
for (const [rel, html] of Object.entries(pages)) {
  assert(!/localStorage/.test(html), `${rel}: no localStorage`);
  assert(!/fetch\s*\(/.test(html), `${rel}: no fetch()`);
  assert(/lang-switch/.test(html), `${rel}: lang switch present`);
  assert(/data-menu-toggle/.test(html), `${rel}: mobile menu toggle`);
  assert(/data-mobile-panel/.test(html), `${rel}: mobile panel`);
  assert(/MST: 0314193708/.test(html), `${rel}: verified MST in footer`);
}

const homeJs = fs.readFileSync(path.join(preview, "assets/home.js"), "utf8");
assert(/data-topic-filters/.test(homeJs), "home.js: topic filter support");
assert(!/localStorage/.test(homeJs.replace(/\/\*[\s\S]*?\*\//g, "")), "home.js: no localStorage");

/* Không còn trỏ option-b như bản EN trên trang chủ */
assert(!enHome.includes("../option-b/"), "en home does not point to option-b");
assert(
  !viHome.includes("../option-b/quy-dinh-moi/"),
  "vi home uses bilingual quy-dinh-moi not option-b"
);

console.log(`PASS ${ok.length}`);
ok.forEach((m) => console.log("  ✓", m));
if (errors.length) {
  console.error(`FAIL ${errors.length}`);
  errors.forEach((m) => console.error("  ✗", m));
  process.exit(1);
}
console.log("verify-sections-bilingual: OK");
