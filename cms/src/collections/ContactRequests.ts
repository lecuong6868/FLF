import type { CollectionConfig, PayloadRequest } from 'payload'

import { admins } from '../access/roles'

/** Chống spam đơn giản: tối đa 5 lần gửi / 10 phút cho mỗi địa chỉ IP (lưu trong bộ nhớ). */
const hits = new Map<string, number[]>()
function rateLimited(ip: string): boolean {
  const now = Date.now()
  const arr = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000)
  arr.push(now)
  hits.set(ip, arr)
  if (hits.size > 5000) hits.clear()
  return arr.length > 5
}

const clip = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '')

async function submit(req: PayloadRequest) {
  const body = (await req.json?.().catch(() => null)) as Record<string, unknown> | null
  if (!body) return Response.json({ ok: false, error: 'bad_request' }, { status: 400 })
  // Bẫy bot: ô ẩn "website" phải trống; form phải mở ít nhất 3 giây trước khi gửi
  const started = Number(body.startedAt || 0)
  if (body.website || !started || Date.now() - started < 3000) return Response.json({ ok: true })
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
  if (rateLimited(ip)) return Response.json({ ok: false, error: 'too_many' }, { status: 429 })

  const name = clip(body.name, 120)
  const email = clip(body.email, 160)
  const phone = clip(body.phone, 40)
  const message = clip(body.message, 5000)
  if (!name || !message || (!email && !phone)) return Response.json({ ok: false, error: 'missing' }, { status: 400 })
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ ok: false, error: 'email' }, { status: 400 })
  if (body.consent !== true) return Response.json({ ok: false, error: 'consent' }, { status: 400 })

  await req.payload.create({
    collection: 'contact-requests',
    overrideAccess: true,
    data: {
      name, email, phone, message,
      consent: true,
      lang: body.lang === 'en' ? 'en' : 'vi',
      page: clip(body.page, 300),
      status: 'new',
    },
  })
  return Response.json({ ok: true })
}

export const ContactRequests: CollectionConfig = {
  slug: 'contact-requests',
  labels: { singular: 'Yêu cầu liên hệ', plural: 'Yêu cầu liên hệ' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phone', 'status', 'createdAt'],
    group: 'Khách hàng',
    description: 'Yêu cầu khách gửi từ form Liên hệ trên web. Chỉ admin xem được.',
  },
  access: {
    create: () => false, // khách gửi qua /api/contact-requests/submit (có chống spam)
    read: admins,
    update: admins,
    delete: admins,
  },
  endpoints: [{ path: '/submit', method: 'post', handler: submit }],
  fields: [
    { name: 'name', type: 'text', label: 'Họ tên', required: true },
    { name: 'email', type: 'email', label: 'Email' },
    { name: 'phone', type: 'text', label: 'Điện thoại' },
    { name: 'message', type: 'textarea', label: 'Nội dung', required: true },
    {
      name: 'status', type: 'select', label: 'Tình trạng', defaultValue: 'new',
      options: [
        { label: '🔴 Mới', value: 'new' },
        { label: '🟡 Đang xử lý', value: 'processing' },
        { label: '🟢 Đã xong', value: 'done' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'note', type: 'textarea', label: 'Ghi chú nội bộ (khách không thấy)' },
    { name: 'consent', type: 'checkbox', label: 'Đồng ý xử lý dữ liệu (NĐ 13/2023)', admin: { readOnly: true, position: 'sidebar' } },
    { name: 'lang', type: 'text', label: 'Ngôn ngữ', admin: { readOnly: true, position: 'sidebar' } },
    { name: 'page', type: 'text', label: 'Gửi từ trang', admin: { readOnly: true, position: 'sidebar' } },
  ],
}
