/**
 * Khởi động PostgreSQL nhúng (không cần Docker / không cần locale en_US).
 * Gọi trực tiếp initdb + pg_ctl từ @embedded-postgres/linux-x64.
 */
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../..')

const port = Number(process.env.EMBEDDED_PG_PORT || 54329)
const user = process.env.POSTGRES_USER || 'flf'
const password = process.env.POSTGRES_PASSWORD || 'flf_local_only'
const database = process.env.POSTGRES_DB || 'flf'
const dataDir = path.join(root, '.data', 'pg')

function findBinDir(): string {
  const candidate = path.join(
    root,
    'node_modules',
    '@embedded-postgres',
    'linux-x64',
    'native',
    'bin',
  )
  if (fs.existsSync(path.join(candidate, 'initdb'))) return candidate
  throw new Error(`Không tìm thấy initdb tại ${candidate}`)
}

function run(bin: string, args: string[], opts: { env?: NodeJS.ProcessEnv; cwd?: string } = {}) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(bin, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, LC_ALL: 'C.UTF-8', LANG: 'C.UTF-8', ...(opts.env || {}) },
      cwd: opts.cwd,
    })
    let out = ''
    child.stdout.on('data', (d) => {
      out += d
      process.stdout.write(d)
    })
    child.stderr.on('data', (d) => {
      out += d
      process.stderr.write(d)
    })
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${path.basename(bin)} exited ${code}\n${out}`))
    })
  })
}

async function ensureCluster(binDir: string) {
  fs.mkdirSync(dataDir, { recursive: true })
  if (fs.existsSync(path.join(dataDir, 'PG_VERSION'))) return

  const pwFile = path.join(root, '.data', 'pwfile')
  fs.writeFileSync(pwFile, `${password}\n`)
  console.log('[embedded-pg] initdb…')
  await run(path.join(binDir, 'initdb'), [
    `-D`,
    dataDir,
    `-U`,
    user,
    `--pwfile=${pwFile}`,
    `--auth=password`,
    `--encoding=UTF8`,
    `--locale=C.UTF-8`,
  ])
}

async function start(binDir: string) {
  const logFile = path.join(root, '.data', 'postgres.log')
  console.log(`[embedded-pg] pg_ctl start — port ${port}`)
  await run(path.join(binDir, 'pg_ctl'), [
    '-D',
    dataDir,
    '-l',
    logFile,
    '-o',
    `-p ${port}`,
    'start',
  ])
}

async function createDb(binDir: string) {
  const libDir = path.join(binDir, '..', 'lib')
  await new Promise<void>((resolve) => {
    const child = spawn(
      path.join(binDir, 'postgres'), // use createdb via psql? may not ship createdb
      [],
      { stdio: 'ignore' },
    )
    child.kill()
    resolve()
  })

  // Dùng node-pg nếu có; fallback: SQL qua postgres --single không tiện.
  // Gói linux-x64 thường có createdb cạnh initdb.
  const createdb = path.join(binDir, 'createdb')
  if (fs.existsSync(createdb)) {
    try {
      await run(
        createdb,
        ['-h', '127.0.0.1', '-p', String(port), '-U', user, database],
        { env: { ...process.env, PGPASSWORD: password, LD_LIBRARY_PATH: libDir } },
      )
      console.log(`[embedded-pg] database "${database}" created`)
    } catch (e) {
      const msg = (e as Error).message
      if (/already exists/i.test(msg)) {
        console.log(`[embedded-pg] database "${database}" already exists`)
      } else {
        // thử tạo qua SQL bằng node pg
        const pg = await import('pg')
        const client = new pg.Client({
          host: '127.0.0.1',
          port,
          user,
          password,
          database: 'postgres',
        })
        await client.connect()
        const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [database])
        if (res.rowCount === 0) {
          await client.query(`CREATE DATABASE "${database}"`)
          console.log(`[embedded-pg] database "${database}" created via SQL`)
        } else {
          console.log(`[embedded-pg] database "${database}" already exists`)
        }
        await client.end()
      }
    }
  } else {
    const pg = await import('pg')
    const client = new pg.Client({
      host: '127.0.0.1',
      port,
      user,
      password,
      database: 'postgres',
    })
    await client.connect()
    const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [database])
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${database}"`)
      console.log(`[embedded-pg] database "${database}" created via SQL`)
    } else {
      console.log(`[embedded-pg] database "${database}" already exists`)
    }
    await client.end()
  }
}

async function stop(binDir: string) {
  try {
    await run(path.join(binDir, 'pg_ctl'), ['-D', dataDir, '-m', 'fast', 'stop'])
  } catch {
    /* ignore */
  }
}

async function main() {
  const binDir = findBinDir()
  // đảm bảo lib path
  process.env.LD_LIBRARY_PATH = [path.join(binDir, '..', 'lib'), process.env.LD_LIBRARY_PATH || '']
    .filter(Boolean)
    .join(':')

  await ensureCluster(binDir)
  await start(binDir)
  // đợi accept connection
  await new Promise((r) => setTimeout(r, 800))
  await createDb(binDir)

  const url = `postgresql://${user}:${password}@127.0.0.1:${port}/${database}`
  console.log(`[embedded-pg] DATABASE_URL=${url}`)
  console.log('[embedded-pg] đang chạy — Ctrl+C để dừng')

  const shutdown = async () => {
    console.log('\n[embedded-pg] dừng…')
    await stop(binDir)
    process.exit(0)
  }
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
  await new Promise(() => {})
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
