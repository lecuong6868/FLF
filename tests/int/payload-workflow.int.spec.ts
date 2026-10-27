/**
 * Integration với Payload + PostgreSQL thật (cần DATABASE_URL).
 * Bỏ qua nếu không có DB.
 */
import 'dotenv/config'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const hasDb = Boolean(process.env.DATABASE_URL)

describe.skipIf(!hasDb)('Payload workflow (DB)', () => {
  let payload: Awaited<ReturnType<typeof import('payload').getPayload>>
  let adminId: number
  let editorId: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let adminUser: any

  beforeAll(async () => {
    process.env.PAYLOAD_SECRET ||= 'test-secret-at-least-32-characters-long'
    const { getPayload } = await import('payload')
    const config = (await import('@payload-config')).default
    payload = await getPayload({ config })

    const stamp = Date.now()
    const admin = await payload.create({
      collection: 'users',
      data: {
        email: `admin-test-${stamp}@flf.vn`,
        password: 'TestAdmin!Abc123',
        name: 'Admin Test',
        role: 'admin',
      },
      overrideAccess: true,
    })
    adminId = Number(admin.id)
    adminUser = { ...admin, collection: 'users' }

    const editor = await payload.create({
      collection: 'users',
      data: {
        email: `editor-test-${stamp}@flf.vn`,
        password: 'TestEditor!Abc123',
        name: 'Editor Test',
        role: 'editor',
      },
      overrideAccess: true,
    })
    editorId = Number(editor.id)
  }, 120_000)

  afterAll(async () => {
    if (!payload) return
    try {
      if (adminId) await payload.delete({ collection: 'users', id: adminId, overrideAccess: true })
      if (editorId) await payload.delete({ collection: 'users', id: editorId, overrideAccess: true })
    } catch {
      // ignore cleanup errors
    }
  })

  it('chặn xuất bản bài pháp lý chưa có luật sư duyệt', async () => {
    const stamp = Date.now()
    await expect(
      payload.create({
        collection: 'posts',
        data: {
          title: `Legal blocked ${stamp}`,
          slug: `legal-blocked-${stamp}`,
          status: 'published',
          isLegalContent: true,
          lawyerApproved: false,
          author: adminId,
        },
        user: adminUser,
        overrideAccess: false,
      }),
    ).rejects.toThrow(/luật sư/i)
  })

  it('admin xuất bản bài pháp lý đã duyệt được', async () => {
    const stamp = Date.now()
    const doc = await payload.create({
      collection: 'posts',
      data: {
        title: `Legal ok ${stamp}`,
        slug: `legal-ok-${stamp}`,
        status: 'published',
        isLegalContent: true,
        lawyerApproved: true,
        author: adminId,
      },
      user: adminUser,
      overrideAccess: false,
    })
    expect(doc.status).toBe('published')
    await payload.delete({ collection: 'posts', id: doc.id, overrideAccess: true })
  })

  it('lưu contact submission có consent NĐ 13', async () => {
    const doc = await payload.create({
      collection: 'contact-submissions',
      data: {
        name: 'Nguyen Van A',
        email: 'a@example.com',
        message: 'Xin chào FLF, tôi cần tư vấn.',
        consentNd13: true,
        locale: 'vi',
      },
      overrideAccess: true,
    })
    expect(doc.consentNd13).toBe(true)
    await payload.delete({ collection: 'contact-submissions', id: doc.id, overrideAccess: true })
  })
})
