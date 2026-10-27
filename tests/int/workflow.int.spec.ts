import { describe, expect, it } from 'vitest'

import { validateStrongPassword } from '@/lib/auth/password'
import { generateTotpSecret, verifyTotp } from '@/lib/auth/totp'
import { contactSchema } from '@/lib/contactSchema'
import { rateLimit } from '@/lib/rateLimit'
import { findStaticRedirect, normalizePath } from '@/lib/redirects'
import { canPublishLegalPost, canTransitionStatus } from '@/hooks/postsWorkflow'

describe('Phân quyền & workflow duyệt bài', () => {
  it('editor không được xuất bản', () => {
    const r = canTransitionStatus({ role: 'editor', from: 'pending_review', to: 'published' })
    expect(r.ok).toBe(false)
  })

  it('admin được xuất bản bài không pháp lý', () => {
    expect(
      canPublishLegalPost({
        role: 'admin',
        status: 'published',
        isLegalContent: false,
        lawyerApproved: false,
      }).ok,
    ).toBe(true)
  })

  it('chặn xuất bản bài pháp lý chưa có luật sư duyệt', () => {
    const r = canPublishLegalPost({
      role: 'admin',
      status: 'published',
      isLegalContent: true,
      lawyerApproved: false,
    })
    expect(r.ok).toBe(false)
    expect(r.reason).toMatch(/luật sư/i)
  })

  it('cho phép xuất bản bài pháp lý đã duyệt', () => {
    expect(
      canPublishLegalPost({
        role: 'admin',
        status: 'published',
        isLegalContent: true,
        lawyerApproved: true,
      }).ok,
    ).toBe(true)
  })
})

describe('Form liên hệ NĐ 13', () => {
  it('từ chối khi thiếu đồng ý', () => {
    const r = contactSchema.safeParse({
      name: 'Nguyen Van A',
      email: 'a@example.com',
      message: 'Xin chào FLF, tôi cần tư vấn.',
      consentNd13: false,
    })
    expect(r.success).toBe(false)
  })

  it('chấp nhận khi có đồng ý', () => {
    const r = contactSchema.safeParse({
      name: 'Nguyen Van A',
      email: 'a@example.com',
      message: 'Xin chào FLF, tôi cần tư vấn.',
      consentNd13: true,
    })
    expect(r.success).toBe(true)
  })
})

describe('Redirect 301 legacy', () => {
  it('map /services/1 sang trang lĩnh vực mới', () => {
    const r = findStaticRedirect('/services/1')
    expect(r?.toPath).toBe('/vi/services/thanh-lap-doanh-nghiep-fdi')
    expect(normalizePath('/about/')).toBe('/about')
  })

  it('map /blog sang /vi/news', () => {
    expect(findStaticRedirect('/blog')?.toPath).toBe('/vi/news')
  })
})

describe('Bảo mật cơ bản', () => {
  it('mật khẩu yếu bị từ chối', () => {
    expect(validateStrongPassword('password').ok).toBe(false)
    expect(validateStrongPassword('Abcdef1!xxxx').ok).toBe(true)
  })

  it('TOTP verify đúng mã', async () => {
    const { secret } = generateTotpSecret('test@flf.vn')
    const { TOTP, Secret } = await import('otpauth')
    const token = new TOTP({
      secret: Secret.fromBase32(secret),
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
    }).generate()
    expect(verifyTotp(secret, token)).toBe(true)
    expect(verifyTotp(secret, '000000')).toBe(false)
  })

  it('rate limit chặn sau N lần', () => {
    const key = `test-${Date.now()}`
    expect(rateLimit(key, 2, 60_000).ok).toBe(true)
    expect(rateLimit(key, 2, 60_000).ok).toBe(true)
    expect(rateLimit(key, 2, 60_000).ok).toBe(false)
  })
})
