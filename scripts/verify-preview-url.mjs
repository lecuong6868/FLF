#!/usr/bin/env node
/**
 * Xác minh URL preview HTTPS công khai (GitHub Pages).
 * Không đăng nhập. Thoát 0 chỉ khi các đường dẫn chính trả HTTP 200
 * và HTML có noindex + nội dung trang chủ / Giới thiệu.
 *
 *   FLF_BASE_URL=https://lecuong6868.github.io/FLF node scripts/verify-preview-url.mjs
 *   npm run verify:preview
 */
const base = (process.env.FLF_BASE_URL || "https://lecuong6868.github.io/FLF").replace(
  /\/$/,
  ""
);

const paths = [
  "/",
  "/vi/",
  "/vi/index.html",
  "/en/",
  "/en/index.html",
  "/vi/gioi-thieu/",
  "/vi/gioi-thieu/index.html",
  "/en/about/",
  "/en/about/index.html",
  "/assets/styles.css",
  "/assets/home.js",
  "/public/brand/logo-color.png",
  "/public/brand/first-legal-force.png",
  "/robots.txt",
];

const htmlChecks = {
  "/": ["noindex", "Tiếng Việt", "English"],
  "/vi/": ["noindex", "First Legal Force", "Giới thiệu", "chưa được gửi"],
  "/vi/index.html": ["noindex", "First Legal Force", "gioi-thieu"],
  "/en/": ["noindex", "First Legal Force", "About", "was not sent"],
  "/en/index.html": ["noindex", "First Legal Force", "about"],
  "/vi/gioi-thieu/": ["noindex", "Giới thiệu", "en/about"],
  "/vi/gioi-thieu/index.html": ["noindex", "Giới thiệu", "en/about"],
  "/en/about/": ["noindex", "About", "gioi-thieu"],
  "/en/about/index.html": ["noindex", "About", "gioi-thieu"],
};

let failed = 0;

async function check(path) {
  const url = `${base}${path}`;
  let res;
  try {
    res = await fetch(url, { redirect: "follow" });
  } catch (err) {
    console.error("FAIL fetch", url, err.message);
    failed++;
    return;
  }
  const ok = res.status === 200;
  console.log(ok ? "OK  " : "FAIL", res.status, path);
  if (!ok) {
    failed++;
    return;
  }
  const needles = htmlChecks[path];
  if (!needles) return;
  const text = await res.text();
  for (const needle of needles) {
    if (!text.includes(needle)) {
      console.error("FAIL thiếu trong HTML:", needle, "—", path);
      failed++;
    }
  }
}

async function main() {
  console.log("Xác minh preview:", base);
  for (const p of paths) await check(p);
  if (failed) {
    console.error(`\nCHƯA ĐẠT: ${failed} lỗi. Không gửi link này làm bàn giao.`);
    process.exit(1);
  }
  console.log("\nĐẠT: URL HTTPS công khai, trang chủ + Giới thiệu VI/EN tải được.");
  console.log(
    "URL bàn giao: VI",
    base + "/vi/",
    "| EN",
    base + "/en/",
    "| Giới thiệu",
    base + "/vi/gioi-thieu/",
    "| About",
    base + "/en/about/"
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
