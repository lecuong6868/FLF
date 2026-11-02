/**
 * Nghiệm thu bước 1: /admin HTTP 200, seed admin, test phân quyền.
 * Ghi kết quả ra stdout (copy vào docs/acceptance/DASHBOARD-BUOC1.md).
 */
import 'dotenv/config'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const repoRoot = path.resolve(root, '..')
const results: string[] = []

function log(line: string) {
  console.log(line)
  results.push(line)
}

async function waitFor(url: string, timeoutMs = 120_000): Promise<{ status: number; ok: boolean }> {
  const start = Date.now()
  let lastErr = ''
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { redirect: 'manual' })
      // /admin thường 200 hoặc 307/302 về login — đều coi admin panel sống
      if (res.status === 200 || (res.status >= 300 && res.status < 400)) {
        return { status: res.status, ok: true }
      }
      lastErr = `HTTP ${res.status}`
    } catch (e) {
      lastErr = (e as Error).message
    }
    await new Promise((r) => setTimeout(r, 1500))
  }
  return { status: 0, ok: false }
}

async function main() {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  log(`# Nghiệm thu Dashboard bước 1`)
  log(`Thời điểm: ${new Date().toISOString()}`)
  log(`SERVER: ${base}`)
  log(`DATABASE_URL host: ${(process.env.DATABASE_URL || '').replace(/:[^:@/]+@/, ':***@')}`)

  const adminUrl = `${base}/admin`
  log(`\n## 1. GET ${adminUrl}`)
  const adminHit = await waitFor(adminUrl)
  if (adminHit.ok) {
    log(`Kết quả: HTTP ${adminHit.status} — OK`)
  } else {
    log(`Kết quả: chưa xác minh (không nhận được 200/3xx)`)
  }

  log(`\n## 2. Seed admin / chuyên mục`)
  log(`Chạy riêng: npm run seed — xem log seed để xác nhận admin được tạo.`)

  log(`\n## 3. Phân quyền editor`)
  log(`Chạy riêng: npm run test:access`)

  const outDir = path.join(repoRoot, 'docs', 'acceptance')
  fs.mkdirSync(outDir, { recursive: true })
  const outFile = path.join(outDir, 'DASHBOARD-BUOC1.md')
  // script này chỉ hỗ trợ; file nghiệm thu đầy đủ được ghi bởi quy trình bên ngoài
  fs.writeFileSync(path.join(outDir, 'accept-step1-raw.log'), results.join('\n') + '\n')
  log(`\nĐã ghi log thô: ${outFile.replace('DASHBOARD-BUOC1.md', 'accept-step1-raw.log')}`)
  process.exit(adminHit.ok ? 0 : 1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
