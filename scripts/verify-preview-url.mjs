#!/usr/bin/env node
/**
 * Xác minh URL preview HTTPS công khai (GitHub Pages hoặc host khác).
 * Không đăng nhập. Thoát 0 chỉ khi các đường dẫn chính trả HTTP 200
 * và HTML có noindex + dấu hiệu phương án B.
 *
 *   FLF_BASE_URL=https://lecuong6868.github.io/FLF node scripts/verify-preview-url.mjs
 *   npm run verify:preview
 */
const base = (process.env.FLF_BASE_URL || "https://lecuong6868.github.io/FLF").replace(/\/$/, "");

const paths = [
  "/",
  "/option-b/",
  "/option-b/styles.css",
  "/option-b/tin-tuc/",
  "/option-b/quy-dinh-moi/",
  "/option-b/chuyen-muc/",
  "/option-b/chuyen-muc/?chu-de=dau-tu",
  "/public/brand/logo-color.png",
  "/public/brand/first-legal-force.png",
  "/shared/content.js",
  "/shared/render.js",
  "/robots.txt",
];

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
  if (path === "/option-b/" || path === "/") {
    const text = await res.text();
    for (const needle of ["noindex", "Bản thiết kế chờ duyệt", "Chuyên mục"]) {
      if (!text.includes(needle)) {
        console.error("FAIL thiếu trong HTML:", needle, "—", path);
        failed++;
      }
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
  console.log("\nĐẠT: URL HTTPS công khai, tài nguyên chính tải được, có noindex.");
  console.log("Tiếp: FLF_BASE_URL=" + base + " npm run test:menu");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
