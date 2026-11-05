'use client'
import React, { useEffect, useRef, useState } from 'react'

import type { Lang } from '@/lib/shared'

const TXT = {
  vi: {
    name: 'Họ và tên *', email: 'Email', phone: 'Điện thoại', message: 'Nhu cầu cần trao đổi *', send: 'Gửi yêu cầu', sending: 'Đang gửi…',
    needContact: 'Vui lòng để lại email hoặc số điện thoại.', needName: 'Vui lòng nhập họ tên và nội dung.', needConsent: 'Vui lòng tick ô đồng ý xử lý dữ liệu.',
    badEmail: 'Email chưa đúng định dạng.', tooMany: 'Bạn đã gửi nhiều lần, vui lòng thử lại sau ít phút.', fail: 'Gửi chưa được, vui lòng thử lại.',
    ok: 'Cảm ơn bạn! FLF đã nhận yêu cầu và sẽ liên hệ lại trong giờ làm việc.', again: 'Gửi yêu cầu khác',
    consent: 'Tôi đồng ý để FLF liên hệ và xử lý dữ liệu cá nhân của tôi nhằm phản hồi yêu cầu này (Nghị định 13/2023/NĐ-CP).',
  },
  en: {
    name: 'Full name *', email: 'Email', phone: 'Phone', message: 'What would you like to discuss? *', send: 'Send request', sending: 'Sending…',
    needContact: 'Please leave an email or phone number.', needName: 'Please enter your name and message.', needConsent: 'Please tick the data-processing consent box.',
    badEmail: 'Please check your email address.', tooMany: 'Too many requests, please try again in a few minutes.', fail: 'Could not send, please try again.',
    ok: 'Thank you! FLF has received your request and will get back to you during business hours.', again: 'Send another request',
    consent: 'I agree that FLF may contact me and process my personal data to respond to this request (Decree 13/2023/ND-CP).',
  },
}

export function ContactForm({ lang, button, consentText }: { lang: Lang; button?: string; consentText?: string }) {
  const t = TXT[lang]
  const started = useRef(Date.now())
  const msgRef = useRef<HTMLTextAreaElement>(null)
  // Câu hỏi từ khung "Hỏi trợ lý" trên banner → điền sẵn vào ô nội dung
  useEffect(() => {
    const h = (e: Event) => {
      const v = (e as CustomEvent).detail as string
      if (msgRef.current) { msgRef.current.value = v; setTimeout(() => msgRef.current?.focus({ preventScroll: true }), 400) }
    }
    window.addEventListener('flf-ask', h)
    return () => window.removeEventListener('flf-ask', h)
  }, [])
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [err, setErr] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const v = (k: string) => String(f.get(k) || '').trim()
    if (!v('name') || !v('message')) return setErr(t.needName)
    if (!v('email') && !v('phone')) return setErr(t.needContact)
    if (!f.get('consent')) return setErr(t.needConsent)
    setErr(''); setState('sending')
    try {
      const r = await fetch('/api/contact-requests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: v('name'), email: v('email'), phone: v('phone'), message: v('message'), website: v('website'),
          consent: true, lang, page: window.location.pathname, startedAt: started.current,
        }),
      })
      const j = await r.json().catch(() => ({}))
      if (r.ok && j.ok) return setState('done')
      setErr(j.error === 'too_many' ? t.tooMany : j.error === 'email' ? t.badEmail : t.fail)
    } catch {
      setErr(t.fail)
    }
    setState('idle')
  }

  if (state === 'done') {
    return (
      <div className="contact-form contact-done" role="status">
        <p className="lead">✓ {t.ok}</p>
        <button type="button" className="btn" onClick={() => { started.current = Date.now(); setState('idle') }}>{t.again}</button>
      </div>
    )
  }
  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <label>{t.name}<input type="text" name="name" autoComplete="name" maxLength={120} required /></label>
      <label>{t.email}<input type="email" name="email" autoComplete="email" maxLength={160} /></label>
      <label>{t.phone}<input type="tel" name="phone" autoComplete="tel" maxLength={40} /></label>
      <label>{t.message}<textarea ref={msgRef} name="message" maxLength={5000} required></textarea></label>
      {/* Bẫy bot: người thật không thấy ô này */}
      <label aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        Website<input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="consent"><input type="checkbox" name="consent" value="1" /><span>{consentText || t.consent}</span></label>
      <div className="form-actions"><button className="btn" type="submit" disabled={state === 'sending'}>{state === 'sending' ? t.sending : button || t.send}</button></div>
      {err ? <p className="form-note" role="alert" style={{ display: 'block' }}>{err}</p> : null}
    </form>
  )
}
