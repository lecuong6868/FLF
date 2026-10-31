#!/usr/bin/env node
/**
 * Chụp trang chủ VI/EN ở 390px và 1440px qua file://
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "FLF-preview/screenshots/home-20261031");
fs.mkdirSync(outDir, { recursive: true });

const { chromium } = await import("playwright");

const browser = await chromium.launch({ headless: true });
const results = [];

async function shot(label, fileRel, width, height) {
  const filePath = path.join(root, "FLF-preview", fileRel);
  const url = pathToFileURL(filePath).href;
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("pageerror", (err) => consoleErrors.push(String(err)));
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  await page.goto(url, { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(400);

  const overflowX = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
  });

  const langLink = width < 800
    ? await page.locator(".mobile-panel a[hreflang], .lang-switch a").first().getAttribute("href").catch(() => null)
    : await page.locator(".lang-switch a").first().getAttribute("href");

  const shotName = `${label}-${width}.png`;
  await page.screenshot({ path: path.join(outDir, shotName), fullPage: false });

  /* Mobile menu open */
  let menuShot = null;
  if (width <= 430) {
    const toggle = page.locator("[data-menu-toggle]");
    if (await toggle.count()) {
      await toggle.click();
      await page.waitForTimeout(250);
      menuShot = `${label}-${width}-menu-open.png`;
      await page.screenshot({ path: path.join(outDir, menuShot), fullPage: false });
      await page.keyboard.press("Escape");
    }
  }

  /* Form demo — must NOT show fake success */
  await page.locator("[data-preview-form] button[type=submit]").click();
  await page.waitForTimeout(200);
  const noteVisible = await page.locator("[data-form-note]").isVisible();
  const bodyText = await page.locator("body").innerText();
  const fakeSuccess =
    /gửi thành công/i.test(bodyText) && !/không có thông báo.*gửi thành công|no fake/i.test(bodyText);

  results.push({
    label,
    width,
    url,
    overflowX,
    consoleErrors,
    langLink,
    noteVisible,
    fakeSuccess,
    shotName,
    menuShot,
  });

  await context.close();
}

try {
  await shot("vi-home", "vi/index.html", 1440, 900);
  await shot("vi-home", "vi/index.html", 390, 844);
  await shot("en-home", "en/index.html", 1440, 900);
  await shot("en-home", "en/index.html", 390, 844);

  /* VI → EN → VI navigation via file:// */
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto(pathToFileURL(path.join(root, "FLF-preview/vi/index.html")).href);
  await page.locator('.lang-switch a[hreflang="en"]').first().click();
  await page.waitForTimeout(300);
  const onEn = page.url().includes("/en/");
  await page.locator('.lang-switch a[hreflang="vi"]').first().click();
  await page.waitForTimeout(300);
  const onVi = page.url().includes("/vi/");
  results.push({ navRoundtrip: { onEn, onVi } });
  await context.close();
} finally {
  await browser.close();
}

const reportPath = path.join(outDir, "capture-results.json");
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));

const failed = results.some((r) => {
  if (r.navRoundtrip) return !(r.navRoundtrip.onEn && r.navRoundtrip.onVi);
  return r.overflowX || (r.consoleErrors && r.consoleErrors.length) || r.fakeSuccess || !r.noteVisible;
});
if (failed) {
  console.error("capture-home: FAIL");
  process.exit(1);
}
console.log("capture-home: ALL PASS →", outDir);
