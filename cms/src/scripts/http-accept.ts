/**
 * Nghiệm thu HTTP (không cần load Payload trực tiếp):
 * 1) GET /admin → 200 hoặc 3xx
 * 2) POST /api/users/login (admin) → có token
 * 3) Editor tạo nháp + chuyển chờ duyệt; bị chặn khi published; admin đăng được
 *
 * Biến môi trường:
 *   BASE_URL (mặc định http://127.0.0.1:3000)
 *   SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD
 *   SEED_EDITOR_EMAIL / SEED_EDITOR_PASSWORD
 *   ACCEPT_OUT (tuỳ chọn — đường dẫn file log)
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'

const lines: string[] = []

function log(msg: string) {
  console.log(msg)
  lines.push(msg)
}

function maskSecret(s: string): string {
  if (!s) return '(empty)'
  if (s.length <= 4) return '****'
  return `${s.slice(0, 2)}…${s.slice(-2)} (len=${s.length})`
}

async function waitForAdmin(base: string, timeoutMs = 180_000): Promise<number> {
  const url = `${base}/admin`
  const start = Date.now()
  let last = 0
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { redirect: 'manual' })
      last = res.status
      if (res.status === 200 || (res.status >= 300 && res.status < 400)) {
        return res.status
      }
    } catch {
      last = 0
    }
    await new Promise((r) => setTimeout(r, 2000))
  }
  return last
}

async function login(
  base: string,
  email: string,
  password: string,
): Promise<{ token: string; role: string; status: number; body: unknown }> {
  const res = await fetch(`${base}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const body = (await res.json().catch(() => ({}))) as {
    token?: string
    user?: { role?: string }
    errors?: unknown
  }
  return {
    token: body.token || '',
    role: body.user?.role || '',
    status: res.status,
    body,
  }
}

async function api(
  base: string,
  token: string,
  method: string,
  pathname: string,
  body?: unknown,
): Promise<{ status: number; json: Record<string, unknown> }> {
  const res = await fetch(`${base}${pathname}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>
  return { status: res.status, json }
}

async function main() {
  const base = (process.env.BASE_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://127.0.0.1:3000').replace(
    /\/$/,
    '',
  )
  const adminEmail = process.env.SEED_ADMIN_EMAIL || ''
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || ''
  const editorEmail = process.env.SEED_EDITOR_EMAIL || ''
  const editorPassword = process.env.SEED_EDITOR_PASSWORD || ''

  let failed = false

  log('# Nghiệm thu HTTP — FLF CMS Preview')
  log(`Thời điểm UTC: ${new Date().toISOString()}`)
  log(`BASE_URL: ${base}`)
  log(`Admin email: ${adminEmail || '(thiếu)'}`)
  log(`Admin password: ${maskSecret(adminPassword)}`)
  log(`Editor email: ${editorEmail || '(thiếu)'}`)
  log(`Editor password: ${maskSecret(editorPassword)}`)
  log('')

  // 1) GET /admin
  log('## 1. GET /admin')
  const adminStatus = await waitForAdmin(base)
  if (adminStatus === 200 || (adminStatus >= 300 && adminStatus < 400)) {
    log(`Kết quả: HTTP ${adminStatus} — OK`)
  } else {
    log(`Kết quả: HTTP ${adminStatus || 'unreachable'} — FAIL`)
    failed = true
  }

  // 2) Login admin
  log('')
  log('## 2. POST /api/users/login (admin)')
  if (!adminEmail || !adminPassword) {
    log('FAIL: thiếu SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD')
    failed = true
  } else {
    const adminLogin = await login(base, adminEmail, adminPassword)
    if (adminLogin.status === 200 && adminLogin.token) {
      log(`Kết quả: HTTP ${adminLogin.status} — nhận token OK (role=${adminLogin.role || '?'})`)
      if (adminLogin.role && adminLogin.role !== 'admin') {
        log(`FAIL: kỳ vọng role=admin, nhận ${adminLogin.role}`)
        failed = true
      }
    } else {
      log(`Kết quả: HTTP ${adminLogin.status} — FAIL (không có token)`)
      log(`Body (rút gọn): ${JSON.stringify(adminLogin.body).slice(0, 400)}`)
      failed = true
    }
  }

  // 3) Phân quyền editor / admin qua REST
  log('')
  log('## 3. Phân quyền editor / admin (REST)')
  if (!editorEmail || !editorPassword || !adminEmail || !adminPassword) {
    log('FAIL: thiếu thông tin seed editor/admin')
    failed = true
  } else {
    const editorLogin = await login(base, editorEmail, editorPassword)
    if (!(editorLogin.status === 200 && editorLogin.token)) {
      log(`FAIL: login editor HTTP ${editorLogin.status}`)
      failed = true
    } else if (editorLogin.role !== 'editor') {
      log(`FAIL: role editor kỳ vọng 'editor', nhận '${editorLogin.role}'`)
      failed = true
    } else {
      log(`Login editor OK (role=editor, có token)`)
      const slug = `http-accept-${Date.now()}`
      const created = await api(base, editorLogin.token, 'POST', '/api/posts?locale=vi', {
        title: 'Bài kiểm thử HTTP phân quyền',
        slug,
        status: 'draft',
        excerpt: 'Bài nháp tự động — không chứa nội dung pháp lý.',
      })
      const doc = created.json.doc as { id?: string | number } | undefined
      const postId = doc?.id ?? (created.json.id as string | number | undefined)
      if (created.status >= 200 && created.status < 300 && postId != null) {
        log(`Editor tạo nháp OK id=${postId}`)
      } else {
        log(`FAIL: editor tạo nháp HTTP ${created.status} ${JSON.stringify(created.json).slice(0, 300)}`)
        failed = true
      }

      if (postId != null) {
        const pending = await api(base, editorLogin.token, 'PATCH', `/api/posts/${postId}?locale=vi`, {
          status: 'pending_review',
        })
        if (pending.status >= 200 && pending.status < 300) {
          log('Editor chuyển Chờ duyệt OK')
        } else {
          log(`FAIL: chuyển pending_review HTTP ${pending.status}`)
          failed = true
        }

        const publishTry = await api(base, editorLogin.token, 'PATCH', `/api/posts/${postId}?locale=vi`, {
          status: 'published',
        })
        const publishBlocked =
          publishTry.status === 403 ||
          publishTry.status === 401 ||
          publishTry.status >= 400 ||
          Boolean((publishTry.json as { errors?: unknown }).errors)
        if (publishBlocked) {
          log(
            `Editor KHÔNG đăng được (đúng kỳ vọng): HTTP ${publishTry.status}`,
          )
        } else {
          log(`FAIL: editor vẫn đăng được — HTTP ${publishTry.status}`)
          failed = true
        }

        const adminLogin = await login(base, adminEmail, adminPassword)
        if (adminLogin.token) {
          const published = await api(base, adminLogin.token, 'PATCH', `/api/posts/${postId}?locale=vi`, {
            status: 'published',
            publishedAt: new Date().toISOString(),
          })
          if (published.status >= 200 && published.status < 300) {
            log(`Admin đăng bài OK HTTP ${published.status}`)
          } else {
            log(`FAIL: admin đăng bài HTTP ${published.status} ${JSON.stringify(published.json).slice(0, 300)}`)
            failed = true
          }
          await api(base, adminLogin.token, 'DELETE', `/api/posts/${postId}`)
          log('Đã dọn bài test')
        }
      }
    }
  }

  log('')
  log(failed ? '## TỔNG: FAIL' : '## TỔNG: PASS')

  const out = process.env.ACCEPT_OUT
  if (out) {
    fs.mkdirSync(path.dirname(out), { recursive: true })
    fs.writeFileSync(out, lines.join('\n') + '\n', 'utf8')
    log(`Đã ghi: ${out}`)
  }

  process.exit(failed ? 1 : 0)
}

main().catch((err) => {
  console.error('[http-accept] lỗi', err)
  process.exit(1)
})
