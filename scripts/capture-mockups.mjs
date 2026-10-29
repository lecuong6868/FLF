#!/usr/bin/env node
/**
 * Chụp 4 mockup PNG: A/B × desktop 1440 / mobile 390.
 * Chạy: npm run capture  (cần đã npm install + trình duyệt Playwright)
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createReadStream, existsSync } from "node:fs";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const port = 4173;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".md": "text/markdown; charset=utf-8",
  ".json": "application/json",
};

function startServer() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      try {
        let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
        if (urlPath.endsWith("/")) urlPath += "index.html";
        const filePath = join(root, urlPath);
        if (!filePath.startsWith(root) || !existsSync(filePath)) {
          res.writeHead(404);
          res.end("Not found");
          return;
        }
        const type = mime[extname(filePath)] || "application/octet-stream";
        res.writeHead(200, { "Content-Type": type });
        createReadStream(filePath).pipe(res);
      } catch (err) {
        res.writeHead(500);
        res.end(String(err));
      }
    });
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

async function capture(page, url, out, width, height) {
  await page.setViewportSize({ width, height });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(800);
  // Force reveal animations visible for screenshot
  await page.evaluate(() => {
    document.querySelectorAll(".reveal").forEach((el) => {
      el.classList.add("is-visible");
    });
  });
  await page.screenshot({
    path: out,
    fullPage: true,
    type: "png",
  });
  console.log("OK", out);
}

async function main() {
  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const jobs = [
    ["http://127.0.0.1:4173/option-a/", join(root, "mockups/A-desktop-1440.png"), 1440, 900],
    ["http://127.0.0.1:4173/option-a/", join(root, "mockups/A-mobile-390.png"), 390, 844],
    ["http://127.0.0.1:4173/option-b/", join(root, "mockups/B-desktop-1440.png"), 1440, 900],
    ["http://127.0.0.1:4173/option-b/", join(root, "mockups/B-mobile-390.png"), 390, 844],
  ];

  for (const [url, out, w, h] of jobs) {
    await capture(page, url, out, w, h);
  }

  // Sanity: files exist and Vietnamese text present in HTML source
  const htmlA = await readFile(join(root, "option-a/index.html"), "utf8");
  if (!htmlA.includes("lang=\"vi\"")) throw new Error("option-a missing lang=vi");

  await browser.close();
  server.close();
  console.log("Captured 4 mockups.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
