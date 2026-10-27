import { describe, expect, it } from 'vitest'

import { listStaticRedirects } from '@/lib/redirects'

describe('Legacy redirect table', () => {
  it('có đủ redirect từ survey SPA cũ', () => {
    const list = listStaticRedirects()
    expect(list.length).toBeGreaterThanOrEqual(10)
    expect(list.some((r) => r.fromPath === '/contact')).toBe(true)
  })
})
