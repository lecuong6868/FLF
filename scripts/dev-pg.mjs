/**
 * Chạy PostgreSQL nhúng cho máy dev không có Docker.
 * Usage: node scripts/dev-pg.mjs
 */
import EmbeddedPostgres from 'embedded-postgres'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const port = Number(process.env.PG_PORT || 54329)

const pg = new EmbeddedPostgres({
  databaseDir: path.join(root, '.pgdata'),
  user: process.env.POSTGRES_USER || 'flf',
  password: process.env.POSTGRES_PASSWORD || 'flf_dev_password',
  port,
  persistent: true,
})

await pg.initialise().catch(() => {})
await pg.start()
try {
  await pg.createDatabase(process.env.POSTGRES_DB || 'flf')
} catch {
  // already exists
}

console.log(`PostgreSQL sẵn sàng tại 127.0.0.1:${port}`)
console.log(
  `DATABASE_URL=postgresql://${process.env.POSTGRES_USER || 'flf'}:${process.env.POSTGRES_PASSWORD || 'flf_dev_password'}@127.0.0.1:${port}/${process.env.POSTGRES_DB || 'flf'}`,
)

process.on('SIGINT', async () => {
  await pg.stop()
  process.exit(0)
})
process.on('SIGTERM', async () => {
  await pg.stop()
  process.exit(0)
})
