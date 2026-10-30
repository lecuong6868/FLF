#!/usr/bin/env node
/**
 * Kiểm thử trình duyệt thật — header/menu phương án B.
 * Desktop 1440 × Mobile 390: liên kết, dropdown, chu-de ×5, mobile a11y, overflow, JS.
 *
 * Chạy:
 *   source scripts/browser-env.sh   # nếu thiếu lib hệ thống
 *   npm install && npx playwright install chromium
 *   node scripts/test-header-menu.mjs
 */
import { createServer } from "node:http";
import { createReadStream, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const port = Number(process.env.FLF_TEST_PORT || 4177);
/** URL gốc HTTPS đã triển khai (vd. https://lecuong6868.github.io/FLF). Không có → chạy server local. */
const remoteBase = (process.env.FLF_BASE_URL || "").replace(/\/$/, "");
const outDir = join(root, "mockups", "test-runs");
const reportPath = join(root, "docs", "KIEM-TRA-TRINH-DUYET.json");

function optionBBase() {
  if (remoteBase) return `${remoteBase}/option-b/`;
  return `http://127.0.0.1:${port}/option-b/`;
}

const TOPIC_FILTERS = [
  ["dau-tu", "Đầu tư"],
  ["thue", "Thuế"],
  ["quan-tri-dn", "Quản trị doanh nghiệp"],
  ["rui-ro", "Quản trị rủi ro"],
  ["giay-phep", "Giấy phép"],
];

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".md": "text/markdown; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
};

const results = [];
let failed = 0;

function record(name, ok, detail = "") {
  results.push({ name, ok, detail });
  const mark = ok ? "PASS" : "FAIL";
  if (!ok) failed++;
  console.log(`${mark}  ${name}${detail ? " — " + detail : ""}`);
}

function startServer() {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
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
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

async function collectPageErrors(page) {
  const errors = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  return errors;
}

async function measureOverflow(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    return {
      scrollWidth: Math.max(doc.scrollWidth, body.scrollWidth),
      clientWidth: doc.clientWidth,
      overflow: Math.max(doc.scrollWidth, body.scrollWidth) - doc.clientWidth,
    };
  });
}

async function testDesktop(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  const errors = await collectPageErrors(page);
  const base = optionBBase();

  await page.goto(base, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForSelector("[data-nav] a", { timeout: 15000 });

  // Menu labels
  const labels = await page.locator("[data-nav] > li > a, [data-nav] .nav-parent").allTextContents();
  const joined = labels.map((t) => t.replace(/\s+/g, " ").trim()).join(" | ");
  record(
    "desktop: có Tin tức / Quy định mới / Chuyên mục",
    joined.includes("Tin tức") && joined.includes("Quy định mới") && joined.includes("Chuyên mục"),
    joined
  );

  // Top links
  for (const [label, pathPart] of [
    ["Tin tức", "/option-b/tin-tuc"],
    ["Quy định mới", "/option-b/quy-dinh-moi"],
  ]) {
    const href = await page.locator(`[data-nav] a`, { hasText: label }).first().getAttribute("href");
    const abs = new URL(href, base).pathname.replace(/\/$/, "");
    record(`desktop: link ${label}`, abs.includes(pathPart.replace(/\/$/, "")), href);
  }

  // Dropdown Chuyên mục + 5 chủ đề
  const trigger = page.locator("[data-nav] [data-submenu-trigger]");
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  const expanded = await trigger.getAttribute("aria-expanded");
  record("desktop: mở submenu bằng ArrowDown", expanded === "true", `aria-expanded=${expanded}`);

  const subLinks = page.locator("[data-nav] .submenu a");
  const subCount = await subLinks.count();
  record("desktop: submenu có 5 mục", subCount === 5, `count=${subCount}`);

  for (const [slug, label] of TOPIC_FILTERS) {
    const link = subLinks.filter({ hasText: label }).first();
    const href = await link.getAttribute("href");
    const okHref = href && href.includes(`chu-de=${slug}`);
    record(`desktop: submenu ${label} → chu-de=${slug}`, !!okHref, href || "");
  }

  await page.keyboard.press("Escape");
  const afterEsc = await trigger.getAttribute("aria-expanded");
  record("desktop: Escape đóng submenu", afterEsc === "false", `aria-expanded=${afterEsc}`);

  // Navigate each topic filter page
  for (const [slug] of TOPIC_FILTERS) {
    const url = `${base}chuyen-muc/?chu-de=${slug}`;
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(300);
    const active = await page.evaluate((s) => {
      const chip = document.querySelector(`[data-topic-filter][data-topic="${s}"], button[data-topic="${s}"], [data-filter="${s}"]`);
      // fallback: URL still has param + list rendered
      const params = new URLSearchParams(location.search);
      return params.get("chu-de") === s;
    }, slug);
    record(`desktop: trang lọc chu-de=${slug}`, active, page.url());
  }

  await page.goto(base, { waitUntil: "networkidle" });
  const overflow = await measureOverflow(page);
  record("desktop 1440: không tràn ngang", overflow.overflow <= 1, JSON.stringify(overflow));

  mkdirSync(outDir, { recursive: true });
  const shot = join(outDir, "B-desktop-1440-live.png");
  await page.screenshot({ path: shot, fullPage: false });
  // copy to mockups root for docs
  await page.screenshot({ path: join(root, "mockups/B-desktop-1440.png"), fullPage: false });
  record("desktop: chụp ảnh", existsSync(shot), shot);

  const jsOk = errors.filter((e) => !/favicon|Fontconfig|dbus|GLib-GIO|platform_font/i.test(e));
  record("desktop: không lỗi JS ảnh hưởng", jsOk.length === 0, jsOk.slice(0, 3).join("; "));

  await context.close();
}

async function testMobile(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  const errors = await collectPageErrors(page);
  const base = optionBBase();

  await page.goto(base, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForSelector("[data-menu-toggle]", { timeout: 15000 });

  const toggle = page.locator("[data-menu-toggle]");
  const panel = page.locator("[data-mobile-panel]");
  const backdrop = page.locator("[data-menu-backdrop]");

  // Closed by default
  const initiallyHidden = await panel.isHidden();
  record("mobile: panel đóng mặc định", initiallyHidden);

  await toggle.click();
  await page.waitForTimeout(200);
  const openExpanded = await toggle.getAttribute("aria-expanded");
  const panelOpen = await panel.evaluate((el) => el.classList.contains("is-open") && !el.hidden);
  const backdropOpen = await backdrop.evaluate((el) => !el.hidden && el.classList.contains("is-open"));
  const bodyNav = await page.evaluate(() => document.body.classList.contains("nav-open"));
  record("mobile: mở menu (aria/panel/backdrop/body)", openExpanded === "true" && panelOpen && backdropOpen && bodyNav);

  // Focus moved into panel
  const focusInPanel = await page.evaluate(() => {
    const panel = document.querySelector("[data-mobile-panel]");
    return panel && panel.contains(document.activeElement);
  });
  record("mobile: focus vào panel khi mở", focusInPanel);

  // Accordion Chuyên mục + 5 links
  const subToggle = panel.locator(".nav-sub-toggle").first();
  await subToggle.click();
  await page.waitForTimeout(150);
  const subExpanded = await subToggle.getAttribute("aria-expanded");
  const mobileSub = panel.locator(".submenu").first();
  const subVisible = await mobileSub.evaluate((el) => !el.hasAttribute("hidden"));
  const mobileSubCount = await mobileSub.locator("a").count();
  record("mobile: accordion Chuyên mục mở", subExpanded === "true" && subVisible, `links=${mobileSubCount}`);
  record("mobile: accordion có 5 chủ đề", mobileSubCount === 5);

  for (const [slug, label] of TOPIC_FILTERS) {
    const href = await mobileSub.locator("a", { hasText: label }).getAttribute("href");
    record(`mobile: submenu ${label}`, href && href.includes(`chu-de=${slug}`), href || "");
  }

  // Tab / Shift+Tab focus trap
  const beforeTrap = await page.evaluate(() => document.activeElement?.tagName);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  // After Shift+Tab from first, should wrap to last still inside panel
  const stillInPanel = await page.evaluate(() => {
    const panel = document.querySelector("[data-mobile-panel]");
    return panel && panel.contains(document.activeElement);
  });
  record("mobile: Tab/Shift+Tab giữ focus trong panel", stillInPanel, `active=${beforeTrap}`);

  // Escape closes + returns focus to toggle
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  const closedExpanded = await toggle.getAttribute("aria-expanded");
  const panelClosed = await panel.isHidden();
  const focusBack = await page.evaluate(() => {
    const t = document.querySelector("[data-menu-toggle]");
    return document.activeElement === t;
  });
  record("mobile: Escape đóng menu", closedExpanded === "false" && panelClosed);
  record("mobile: Escape trả focus về nút Menu", focusBack);

  // Re-open and close via backdrop
  await toggle.click();
  await page.waitForTimeout(150);
  await backdrop.click({ position: { x: 5, y: 5 }, force: true });
  await page.waitForTimeout(150);
  const afterBackdrop = await toggle.getAttribute("aria-expanded");
  record("mobile: backdrop đóng menu", afterBackdrop === "false");

  // Overflow
  await page.goto(base, { waitUntil: "networkidle" });
  const overflowClosed = await measureOverflow(page);
  record("mobile 390 (đóng): không tràn ngang", overflowClosed.overflow <= 1, JSON.stringify(overflowClosed));

  await toggle.click();
  await page.waitForTimeout(200);
  const overflowOpen = await measureOverflow(page);
  record("mobile 390 (mở): không tràn ngang", overflowOpen.overflow <= 1, JSON.stringify(overflowOpen));

  mkdirSync(outDir, { recursive: true });
  await page.screenshot({ path: join(outDir, "B-mobile-390-menu-open-live.png"), fullPage: false });
  await page.screenshot({ path: join(root, "mockups/B-mobile-390-menu-open.png"), fullPage: false });

  await page.keyboard.press("Escape");
  await page.waitForTimeout(150);
  await page.screenshot({ path: join(outDir, "B-mobile-390-live.png"), fullPage: false });
  await page.screenshot({ path: join(root, "mockups/B-mobile-390.png"), fullPage: false });
  record("mobile: chụp ảnh", true);

  const jsOk = errors.filter((e) => !/favicon|Fontconfig|dbus|GLib-GIO|platform_font|TextRunHarfBuzz/i.test(e));
  record("mobile: không lỗi JS ảnh hưởng", jsOk.length === 0, jsOk.slice(0, 3).join("; "));

  await context.close();
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  let server = null;
  if (!remoteBase) {
    server = await startServer();
  } else {
    console.log("Kiểm thử trên URL triển khai:", remoteBase);
  }
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
    });
  } catch (err) {
    if (server) server.close();
    console.error("Không khởi động được Chromium:", err.message);
    console.error("Thử: bash scripts/bootstrap-browser-libs.sh && source scripts/browser-env.sh");
    writeFileSync(
      reportPath,
      JSON.stringify(
        {
          at: new Date().toISOString(),
          ok: false,
          reason: String(err.message),
          results: [],
        },
        null,
        2
      )
    );
    process.exit(1);
  }

  try {
    await testDesktop(browser);
    await testMobile(browser);
  } finally {
    await browser.close();
    if (server) server.close();
  }

  const summary = {
    at: new Date().toISOString(),
    commitHint: "PR #7 (c8364c5) — header/menu phương án B",
    target: remoteBase || `http://127.0.0.1:${port}`,
    viewport: ["1440x900", "390x844"],
    ok: failed === 0,
    failed,
    total: results.length,
    results,
    screenshots: [
      "mockups/B-desktop-1440.png",
      "mockups/B-mobile-390.png",
      "mockups/B-mobile-390-menu-open.png",
      "mockups/test-runs/B-desktop-1440-live.png",
      "mockups/test-runs/B-mobile-390-live.png",
      "mockups/test-runs/B-mobile-390-menu-open-live.png",
    ],
  };
  writeFileSync(reportPath, JSON.stringify(summary, null, 2));
  console.log("\n---");
  console.log(failed === 0 ? `PASS: ${results.length}/${results.length} ca` : `FAIL: ${failed}/${results.length} ca lỗi`);
  console.log("Báo cáo:", reportPath);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
