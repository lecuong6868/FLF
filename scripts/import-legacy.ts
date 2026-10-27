/**
 * Import redirect + báo cáo từ khảo sát site cũ (React SPA, không còn WordPress REST).
 * Chạy: npx tsx scripts/import-legacy.ts
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

import config from '../src/payload.config'
import legacyRedirects from '../data/legacy-redirects.json'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(dirname, '..')

type LegacyRedirect = {
  fromPath: string
  toPath: string
  note?: string
}

async function main() {
  const surveyPath = path.join(root, 'docs/migration/SURVEY.md')
  const report = {
    source: 'flf.vn React SPA (+ zip trong repo)',
    surveyDoc: fs.existsSync(surveyPath) ? 'docs/migration/SURVEY.md' : null,
    redirectsPrepared: (legacyRedirects as LegacyRedirect[]).length,
    redirectsImported: 0,
    notes: [
      'Site cũ không còn WordPress REST API — không import post/page qua wp/v2.',
      'Nội dung lĩnh vực được seed mẫu trong scripts/seed.ts; bài tin cần biên tập lại trên Dashboard.',
    ] as string[],
  }

  const payload = await getPayload({ config })

  for (const r of legacyRedirects as LegacyRedirect[]) {
    if (!r.fromPath || r.fromPath === '/') continue
    try {
      const existing = await payload.find({
        collection: 'redirects',
        where: { fromPath: { equals: r.fromPath } },
        limit: 1,
        overrideAccess: true,
      })
      if (existing.docs.length) continue
      await payload.create({
        collection: 'redirects',
        data: {
          fromPath: r.fromPath,
          toPath: r.toPath,
          permanent: true,
          note: r.note,
        },
        overrideAccess: true,
      })
      report.redirectsImported += 1
    } catch (err) {
      report.notes.push(`Redirect ${r.fromPath}: ${(err as Error).message}`)
    }
  }

  const out = path.join(root, 'docs/migration/import-report.json')
  fs.writeFileSync(out, JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report, null, 2))
  console.log('Đã ghi', out)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
