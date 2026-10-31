#!/usr/bin/env node
/**
 * Mô phỏng base path /FLF/ bằng máy chủ cục bộ và kiểm tra HTTP 200 + liên kết tương đối.
 * Không cần GitHub Pages.
 *
 *   npm run verify:basepath
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const preview = path.join(root, "FLF-preview");
const port = Number(process.env.FLF_TEST_PORT || 4175);
const base = `http://127.0.0.1:${port}/FLF`;

const paths = [
  "/",
  "/vi/",
  "/vi/index.html",
  "/en/",
  "/en/index.html",
  "/vi/gioi-thieu/",
  "/en/about/",
  "/vi/quy-dinh-moi/",
  "/en/regulations/",
  "/vi/chuyen-muc/",
  "/en/topics/",
  "/vi/quy-dinh-moi/cau-truc-mau.html",
  "/en/regulations/layout-sample.html",
  "/assets/styles.css",
  "/assets/home.js",
  "/public/brand/logo-color.png",
];

function contentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".ttf")) return "font/ttf";
  return "application/octet-stream";
}

function resolveUnderPreview(urlPath) {
  let rel = urlPath.replace(/^\/FLF\/?/, "");
  if (!rel || rel.endsWith("/")) rel = path.join(rel, "index.html");
  const abs = path.normalize(path.join(preview, rel));
  if (!abs.startsWith(preview)) return null;
  return abs;
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      if (!urlPath.startsWith("/FLF")) {
        res.writeHead(404).end("Not under /FLF");
        return;
      }
      const filePath = resolveUnderPreview(urlPath);
      if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404).end("Not found");
        return;
      }
      res.writeHead(200, { "Content-Type": contentType(filePath) });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

async function check(p) {
  const url = `${base}${p === "/" ? "/" : p}`;
  const res = await fetch(url, { redirect: "follow" });
  const ok = res.status === 200;
  console.log(ok ? "OK  " : "FAIL", res.status, p);
  if (!ok) return false;
  if (p.endsWith(".css") || p.endsWith(".js") || p.endsWith(".png")) return true;
  const text = await res.text();
  if (p.includes("/vi/") && !text.includes("First Legal Force")) {
    console.error("FAIL thiếu nội dung VI", p);
    return false;
  }
  if (p.includes("/en/") && !text.includes("First Legal Force")) {
    console.error("FAIL thiếu nội dung EN", p);
    return false;
  }
  return true;
}

async function main() {
  if (!fs.existsSync(path.join(preview, "vi/index.html"))) {
    console.error("Thiếu FLF-preview/vi/index.html");
    process.exit(1);
  }
  const server = await startServer();
  let failed = 0;
  try {
    console.log("Mô phỏng base path:", base + "/");
    for (const p of paths) {
      if (!(await check(p))) failed++;
    }
    // Roundtrip chuyển ngữ: lấy href từ HTML và resolve
    const vi = await (await fetch(`${base}/vi/index.html`)).text();
    const en = await (await fetch(`${base}/en/index.html`)).text();
    const viAbout = await (await fetch(`${base}/vi/gioi-thieu/index.html`)).text();
    const enAbout = await (await fetch(`${base}/en/about/index.html`)).text();
    for (const [label, html, needle] of [
      ["VI home→EN", vi, "../en/index.html"],
      ["EN home→VI", en, "../vi/index.html"],
      ["VI about→EN about", viAbout, "../../en/about/index.html"],
      ["EN about→VI about", enAbout, "../../vi/gioi-thieu/index.html"],
    ]) {
      if (!html.includes(needle)) {
        console.error("FAIL", label, "thiếu", needle);
        failed++;
      } else {
        console.log("OK  ", label);
      }
    }
  } finally {
    server.close();
  }
  if (failed) {
    console.error(`\nCHƯA ĐẠT: ${failed} lỗi dưới base path /FLF/`);
    process.exit(1);
  }
  console.log("\nĐẠT: asset/menu/chuyển ngữ hoạt động dưới /FLF/ (mô phỏng local).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
