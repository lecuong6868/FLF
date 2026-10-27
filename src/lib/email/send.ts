import nodemailer from 'nodemailer'

export type ContactMailPayload = {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export async function sendContactNotification(payload: ContactMailPayload): Promise<void> {
  const host = process.env.SMTP_HOST
  const to = process.env.CONTACT_NOTIFY_TO || process.env.SMTP_FROM
  if (!host || !to) {
    console.warn('[email] SMTP chưa cấu hình — bỏ qua gửi email thông báo.')
    return
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
  })

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    replyTo: payload.email,
    subject: `[FLF Liên hệ] ${payload.subject || 'Tin nhắn mới'} — ${payload.name}`,
    text: [
      `Họ tên: ${payload.name}`,
      `Email: ${payload.email}`,
      `Điện thoại: ${payload.phone || '—'}`,
      `Chủ đề: ${payload.subject || '—'}`,
      '',
      payload.message,
    ].join('\n'),
  })
}
