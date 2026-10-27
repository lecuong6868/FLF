import { createHash } from 'crypto'
import { NextResponse } from 'next/server'

import { contactSchema } from '@/lib/contactSchema'
import { sendContactNotification } from '@/lib/email/send'
import { getPayloadClient } from '@/lib/payload'
import { clientIp, rateLimit } from '@/lib/rateLimit'

export async function POST(req: Request) {
  const ip = clientIp(req)
  const limited = rateLimit(`contact:${ip}`, 5, 15 * 60 * 1000)
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: 'Quá nhiều yêu cầu. Thử lại sau.' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfterSec) } },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON không hợp lệ' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Dữ liệu không hợp lệ hoặc thiếu đồng ý NĐ 13/2023.' },
      { status: 400 },
    )
  }

  // Honeypot: bots fill hidden "website"
  if (parsed.data.website) {
    return NextResponse.json({ ok: true })
  }

  const ipHash = createHash('sha256').update(ip).digest('hex').slice(0, 32)

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'contact-submissions',
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || undefined,
        subject: parsed.data.subject || undefined,
        message: parsed.data.message,
        consentNd13: true,
        locale: parsed.data.locale || 'vi',
        ipHash,
      },
      overrideAccess: true,
    })

    await sendContactNotification({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      subject: parsed.data.subject,
      message: parsed.data.message,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact]', err)
    return NextResponse.json({ ok: false, error: 'Lỗi máy chủ' }, { status: 500 })
  }
}
