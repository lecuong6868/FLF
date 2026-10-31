#!/usr/bin/env node
/**
 * Kiểm tra trang Giới thiệu / About VI/EN: tồn tại, metadata, chuyển ngữ giữ đúng trang,
 * liên kết trang chủ đúng ngôn ngữ, không localStorage/fetch, không form giả thành công.
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
  assert(fs.existsSync(p), `exists: ${rel}`);
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "";
}

const viAbout = read("vi/gioi-thieu/index.html");
const enAbout = read("en/about/index.html");
const viHome = read("vi/index.html");
const enHome = read("en/index.html");

assert(viAbout.includes('lang="vi"'), "vi about html lang");
assert(enAbout.includes('lang="en"'), "en about html lang");
assert(/<title>.*Giới thiệu|Giới thiệu.*<\/title>/i.test(viAbout) || viAbout.includes("Giới thiệu FLF"), "vi about title");
assert(/About FLF|About —/i.test(enAbout) && enAbout.includes("<title>"), "en about title");
assert(viAbout.includes('name="description"'), "vi about description");
assert(enAbout.includes('name="description"'), "en about description");

/* Language switch stays on About pair */
assert(
  viAbout.includes('href="../../en/about/index.html"'),
  "VI About → EN About relative"
);
assert(
  enAbout.includes('href="../../vi/gioi-thieu/index.html"'),
  "EN About → VI About relative"
);

/* Home links correct locale */
assert(viAbout.includes('href="../index.html"'), "VI About → VI home");
assert(enAbout.includes('href="../index.html"'), "EN About → EN home");
assert(viAbout.includes("../index.html#contact"), "VI About CTA → VI contact");
assert(enAbout.includes("../index.html#contact"), "EN About CTA → EN contact");

/* Home nav points to About pages */
assert(viHome.includes("./gioi-thieu/index.html"), "VI home nav → Giới thiệu");
assert(enHome.includes("./about/index.html"), "EN home nav → About");

for (const [label, html] of [
  ["vi-about", viAbout],
  ["en-about", enAbout],
]) {
  assert(!/localStorage/.test(html), `${label}: no localStorage`);
  assert(!/fetch\s*\(/.test(html), `${label}: no fetch()`);
  assert(/aria-current="page"/.test(html), `${label}: current page marked`);
  assert(/MST: 0314193708|Tax code \(MST\): 0314193708/.test(html), `${label}: MST`);
  assert(/chờ xác nhận|pending confirmation/i.test(html), `${label}: address pending`);
  assert(
    !/yêu cầu của bạn đã được gửi|request (was |has been )?sent successfully|gửi thành công\./i.test(html),
    `${label}: no fake success claim`
  );
}

/* Content themes: needs, intake, scope, deliverables; law partner brief */
assert(/nhu cầu|tiếp nhận|phạm vi|đầu ra/i.test(viAbout), "vi about core themes");
assert(/needs|intake|scope|deliverable/i.test(enAbout), "en about core themes");
assert(/công ty luật đối tác|partner law firms/i.test(viAbout + enAbout), "law partner mention present");
assert(!/chứng nhận|certification|số năm hoạt động|years in business|top \d|hàng đầu/i.test(viAbout + enAbout), "no unverified claims");

console.log(`PASS ${ok.length}`);
ok.forEach((m) => console.log("  ✓", m));
if (errors.length) {
  console.log(`FAIL ${errors.length}`);
  errors.forEach((m) => console.log("  ✗", m));
  process.exit(1);
}
console.log("verify-about-bilingual: ALL PASS");
