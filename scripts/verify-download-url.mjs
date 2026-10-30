#!/usr/bin/env node
/** Tải URL bàn giao (không auth) và đối chiếu SHA-256 / magic ZIP. */
import { createHash } from "node:crypto";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// URL chính: raw GitHub theo TÊN NHÁNH — không chứa chuỗi hex dài (tránh hệ thống bàn giao che thành [đã ẩn]).
const URL =
  process.env.FLF_DOWNLOAD_URL ||
  "https://raw.githubusercontent.com/lecuong6868/FLF/aat/20261030-154651/FLF-preview.zip";
const EXPECT_SHA =
  process.env.FLF_EXPECT_SHA256 ||
  "5cf4cd68bace42e33465dc7a17d1c817b97e24c4be8117234326d72200be4036";
const EXPECT_BYTES = Number(process.env.FLF_EXPECT_BYTES || 2436515);

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "docs");
mkdirSync(outDir, { recursive: true });

const res = await fetch(URL, {
  redirect: "follow",
  headers: {
    Accept: "*/*",
    "User-Agent": "FLF-download-verify/1.0",
  },
});
const buf = Buffer.from(await res.arrayBuffer());
const sha256 = createHash("sha256").update(buf).digest("hex");
const magic = buf.subarray(0, 4).toString("hex");
const report = {
  url: URL,
  httpStatus: res.status,
  contentType: res.headers.get("content-type"),
  bytes: buf.length,
  magicHex: magic,
  isZipMagic: magic === "504b0304",
  sha256,
  sha256Match: sha256 === EXPECT_SHA,
  bytesMatch: buf.length === EXPECT_BYTES,
  ok:
    res.status === 200 &&
    magic === "504b0304" &&
    sha256 === EXPECT_SHA &&
    buf.length === EXPECT_BYTES,
};
writeFileSync(join(outDir, "DOWNLOAD-URL-LIVE.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
process.exit(report.ok ? 0 : 1);
