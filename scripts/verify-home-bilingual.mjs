#!/usr/bin/env node
/**
 * Kiểm tra trang chủ Preview VI/EN: file tồn tại, metadata, chuyển ngữ tương đối,
 * không phụ thuộc localStorage/fetch cho nội dung, form không báo gửi thành công giả.
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

const entry = read("index.html");
const vi = read("vi/index.html");
const en = read("en/index.html");
read("assets/styles.css");
read("assets/home.js");
read("public/brand/logo-color.png");
read("public/brand/first-legal-force.png");

assert(entry.includes('href="vi/index.html"'), "entry links to vi/");
assert(entry.includes('href="en/index.html"'), "entry links to en/");

assert(vi.includes('lang="vi"'), "vi html lang");
assert(en.includes('lang="en"'), "en html lang");
assert(vi.includes("<title>") && vi.includes("First Legal Force"), "vi title");
assert(en.includes("<title>") && en.includes("First Legal Force"), "en title");
assert(vi.includes('name="description"'), "vi meta description");
assert(en.includes('name="description"'), "en meta description");

assert(vi.includes('href="../en/index.html"'), "VI→EN relative switch");
assert(en.includes('href="../vi/index.html"'), "EN→VI relative switch");
assert(vi.includes("./gioi-thieu/index.html"), "VI home links to Giới thiệu page");
assert(en.includes("./about/index.html"), "EN home links to About page");

for (const [label, html] of [
  ["vi", vi],
  ["en", en],
]) {
  assert(!/localStorage/.test(html), `${label}: no localStorage in HTML`);
  assert(!/fetch\s*\(/.test(html), `${label}: no fetch() in HTML`);
  assert(/data-preview-form/.test(html), `${label}: preview form present`);
  assert(
    (/id="about"/.test(html) || /gioi-thieu\/index\.html|about\/index\.html/.test(html)) &&
      /#services/.test(html) &&
      /#process/.test(html),
    `${label}: section anchors`
  );
  assert(
    (/#why/.test(html) || /id="why"/.test(html)) && /#contact/.test(html),
    `${label}: why + contact`
  );
  assert(
    /quy-dinh-moi\/index\.html|regulations\/index\.html/.test(html),
    `${label}: regulations nav`
  );
  assert(
    /chuyen-muc\/index\.html|topics\/index\.html/.test(html),
    `${label}: topics nav`
  );
  assert(
    /chưa được gửi|was not sent|chưa có backend|no backend/i.test(html),
    `${label}: form states preview/no-send`
  );
  assert(/data-form-note/.test(html), `${label}: form note element`);
}

const homeJs = fs.readFileSync(path.join(preview, "assets/home.js"), "utf8");
const homeJsCode = homeJs.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
assert(!/localStorage/.test(homeJsCode), "home.js: no localStorage usage");
assert(/preventDefault/.test(homeJs), "home.js: form preventDefault");
assert(/form-note|Preview|backend/i.test(homeJs), "home.js: preview form note path");

/* Không tự nhận trang option-b đã song ngữ trên EN */
assert(!en.includes("../option-b/tin-tuc/"), "en home does not claim option-b as EN");

console.log(`PASS ${ok.length}`);
ok.forEach((m) => console.log("  ✓", m));
if (errors.length) {
  console.log(`FAIL ${errors.length}`);
  errors.forEach((m) => console.log("  ✗", m));
  process.exit(1);
}
console.log("verify-home-bilingual: ALL PASS");
