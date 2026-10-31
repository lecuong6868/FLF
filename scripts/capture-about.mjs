#!/usr/bin/env node
/**
 * Chụp trang Giới thiệu / About VI/EN ở 390px và 1440px qua file://
 * + roundtrip VI→EN→VI giữ đúng trang About.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "FLF-preview/screenshots/about-20261031");
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

  const shotName = `${label}-${width}.png`;
  await page.screenshot({ path: path.join(outDir, shotName), fullPage: false });

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

  results.push({
    label,
    width,
    url,
    overflowX,
    consoleErrors,
    shotName,
    menuShot,
  });
  await context.close();
}

try {
  await shot("vi-about", "vi/gioi-thieu/index.html", 1440, 900);
  await shot("vi-about", "vi/gioi-thieu/index.html", 390, 844);
  await shot("en-about", "en/about/index.html", 1440, 900);
  await shot("en-about", "en/about/index.html", 390, 844);

  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto(
    pathToFileURL(path.join(root, "FLF-preview/vi/gioi-thieu/index.html")).href
  );
  await page.locator('.lang-switch a[hreflang="en"]').first().click();
  await page.waitForTimeout(300);
  const onEnAbout = /\/en\/about\//.test(page.url());
  await page.locator('.lang-switch a[hreflang="vi"]').first().click();
  await page.waitForTimeout(300);
  const onViAbout = /\/vi\/gioi-thieu\//.test(page.url());
  results.push({ navRoundtripAbout: { onEnAbout, onViAbout } });
  await context.close();
} finally {
  await browser.close();
}

const reportPath = path.join(outDir, "capture-results.json");
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));

const failed = results.some((r) => {
  if (r.navRoundtripAbout) return !(r.navRoundtripAbout.onEnAbout && r.navRoundtripAbout.onViAbout);
  return r.overflowX || (r.consoleErrors && r.consoleErrors.length);
});
if (failed) {
  console.error("capture-about: FAIL");
  process.exit(1);
}
console.log("capture-about: ALL PASS →", outDir);
