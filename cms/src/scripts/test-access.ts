import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../payload.config'

async function main() {
  const payload = await getPayload({ config })

  const editorEmail = process.env.SEED_EDITOR_EMAIL
  const editorPassword = process.env.SEED_EDITOR_PASSWORD
  if (!editorEmail || !editorPassword) {
    throw new Error('Cần SEED_EDITOR_EMAIL / SEED_EDITOR_PASSWORD để kiểm thử phân quyền')
  }

  const login = await payload.login({
    collection: 'users',
    data: { email: editorEmail, password: editorPassword },
  })
  const editorUser = login.user
  if (!editorUser || editorUser.role !== 'editor') {
    throw new Error(`User ${editorEmail} không phải editor`)
  }

  const draft = await payload.create({
    collection: 'posts',
    data: {
      title: 'Bài kiểm thử phân quyền',
      slug: `test-access-${Date.now()}`,
      status: 'draft',
      excerpt: 'Bài nháp do editor tạo — không chứa nội dung pháp lý.',
    },
    user: editorUser,
    overrideAccess: false,
    locale: 'vi',
  })
  console.log(`[test-access] editor tạo nháp OK id=${draft.id}`)

  await payload.update({
    collection: 'posts',
    id: draft.id,
    data: { status: 'pending_review' },
    user: editorUser,
    overrideAccess: false,
  })
  console.log('[test-access] editor chuyển Chờ duyệt OK')

  let publishBlocked = false
  try {
    await payload.update({
      collection: 'posts',
      id: draft.id,
      data: { status: 'published' },
      user: editorUser,
      overrideAccess: false,
    })
  } catch (err) {
    publishBlocked = true
    console.log(`[test-access] editor KHÔNG đăng được (đúng kỳ vọng): ${(err as Error).message}`)
  }

  if (!publishBlocked) {
    throw new Error('FAIL: editor vẫn đăng được bài — phân quyền sai')
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL
  const adminPassword = process.env.SEED_ADMIN_PASSWORD
  if (!adminEmail || !adminPassword) {
    throw new Error('Thiếu SEED_ADMIN_*')
  }
  const adminLogin = await payload.login({
    collection: 'users',
    data: { email: adminEmail, password: adminPassword },
  })
  const published = await payload.update({
    collection: 'posts',
    id: draft.id,
    data: { status: 'published', publishedAt: new Date().toISOString() },
    user: adminLogin.user,
    overrideAccess: false,
  })
  console.log(`[test-access] admin đăng bài OK status=${published.status}`)

  // dọn bài test
  await payload.delete({
    collection: 'posts',
    id: draft.id,
    overrideAccess: true,
  })
  console.log('[test-access] PASS')
  process.exit(0)
}

main().catch((err) => {
  console.error('[test-access] FAIL', err)
  process.exit(1)
})
