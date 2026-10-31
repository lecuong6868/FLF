#!/usr/bin/env node
/**
 * Kiểm thử bản offline qua file:// (Playwright).
 * Chụp ảnh 390px và 1440px; kiểm tra CSS/ảnh/menu.
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PREVIEW = join(ROOT, "FLF-preview", "option-b", "index.html");
const OUT_SHOTS = join(ROOT, "mockups", "offline");
const OUT_JSON = join(ROOT, "docs", "KIEM-TRA-OFFLINE.json");

if (!existsSync(PREVIEW)) {
  console.error("Chưa có FLF-preview/. Chạy: npm run pack:offline");
  process.exit(1);
}

const homeUrl = pathToFileURL(PREVIEW).href;
const results = [];
let failed = 0;

function ok(name, pass, detail = "") {
  results.push({ name, pass, detail });
  if (!pass) failed += 1;
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
}

mkdirSync(OUT_SHOTS, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

page.on("pageerror", (err) => {
  ok("no-pageerror", false, String(err));
});

const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});

/* Desktop 1440 */
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(homeUrl, { waitUntil: "load" });
await page.waitForTimeout(400);

ok("home-title", (await page.title()).includes("FLF") || (await page.title()).includes("Phương án B"));
ok(
  "logo-visible",
  await page.locator('.brand img[src*="logo-color"]').first().isVisible()
);
ok("css-header", await page.locator(".site-header").isVisible());
ok("nav-desktop", await page.locator(".nav-desktop [data-nav] a").count().then((n) => n >= 6));

const logoBox = await page.locator('.brand img').first().boundingBox();
ok("logo-loaded-size", !!logoBox && logoBox.width > 20, JSON.stringify(logoBox));

/* Dropdown Chuyên mục */
const chuyenMuc = page.locator(".nav-desktop .has-children").first();
await chuyenMuc.hover();
await page.waitForTimeout(200);
ok("dropdown-open", await chuyenMuc.locator(".submenu").isVisible());
const topicLinks = await chuyenMuc.locator(".submenu a").count();
ok("dropdown-5-topics", topicLinks >= 5, `count=${topicLinks}`);

await page.screenshot({ path: join(OUT_SHOTS, "B-desktop-1440-file.png"), fullPage: false });

/* Navigate tin tức via explicit index.html */
const tinHref = await page.locator('.nav-desktop a', { hasText: "Tin tức" }).first().getAttribute("href");
ok("tin-tuc-href-index", tinHref && tinHref.includes("index.html"), tinHref || "");
await page.locator('.nav-desktop a', { hasText: "Tin tức" }).first().click();
await page.waitForTimeout(300);
ok("tin-tuc-page", page.url().includes("tin-tuc") && (await page.locator("h1").count()) > 0);

await page.goto(homeUrl, { waitUntil: "load" });
await page.waitForTimeout(200);

/* Contact demo — không báo thành công giả */
await page.locator("[data-contact-cta]").first().click();
await page.waitForTimeout(150);
const demoNote = page.locator("#flf-demo-contact-note");
ok("contact-demo-note", await demoNote.isVisible());
const noteText = await demoNote.textContent();
const noteLower = (noteText || "").toLowerCase();
ok(
  "contact-no-fake-success",
  noteLower.includes("chưa được gửi") &&
    noteLower.includes("minh họa") &&
    noteLower.includes("không có thông báo gửi thành công giả") &&
    !/yêu cầu đã được gửi|gửi thành công\./i.test(noteText),
  noteText.slice(0, 140)
);

/* Mobile 390 */
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(homeUrl, { waitUntil: "load" });
await page.waitForTimeout(300);
await page.screenshot({ path: join(OUT_SHOTS, "B-mobile-390-file.png"), fullPage: false });

const toggle = page.locator("[data-menu-toggle]");
ok("menu-toggle-visible", await toggle.isVisible());
await toggle.click();
await page.waitForTimeout(250);
ok("mobile-open", await page.locator("[data-mobile-panel].is-open").isVisible());
ok("backdrop-open", await page.locator("[data-menu-backdrop].is-open").isVisible());
await page.screenshot({ path: join(OUT_SHOTS, "B-mobile-390-menu-open-file.png"), fullPage: false });

await page.keyboard.press("Escape");
await page.waitForTimeout(200);
ok("mobile-escape-close", !(await page.locator("[data-mobile-panel].is-open").isVisible()));

/* Chuyên mục filter via query on file:// */
const topicUrl =
  pathToFileURL(join(ROOT, "FLF-preview", "option-b", "chuyen-muc", "index.html")).href +
  "?chu-de=thue";
await page.goto(topicUrl, { waitUntil: "load" });
await page.waitForTimeout(300);
ok(
  "topic-filter-query",
  await page.locator('.chip.is-active[data-topic="thue"]').isVisible()
);

const badConsole = consoleErrors.filter(
  (t) => !/Failed to load resource.*fonts\.google/i.test(t)
);
ok("no-console-error", badConsole.length === 0, badConsole.slice(0, 3).join(" | "));

await browser.close();

const summary = {
  protocol: "file://",
  home: homeUrl,
  pass: failed === 0,
  failed,
  total: results.length,
  shots: [
    "mockups/offline/B-desktop-1440-file.png",
    "mockups/offline/B-mobile-390-file.png",
    "mockups/offline/B-mobile-390-menu-open-file.png",
  ],
  results,
  at: new Date().toISOString(),
};
writeFileSync(OUT_JSON, JSON.stringify(summary, null, 2) + "\n", "utf8");
console.log("\n" + (failed === 0 ? "ALL PASS" : `${failed} FAILED`) + ` (${results.length} checks)`);
console.log("Shots:", summary.shots.join(", "));
process.exit(failed === 0 ? 0 : 1);
