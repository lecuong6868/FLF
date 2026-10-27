'use client'

import { useState } from 'react'

import type { Dictionary } from '@/i18n/dictionaries/vi'
import type { AppLocale } from '@/i18n/config'

export function ContactForm({ locale, dict }: { locale: AppLocale; dict: Dictionary }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')
    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone'),
          subject: data.get('subject'),
          message: data.get('message'),
          consentNd13: data.get('consentNd13') === 'on',
          website: data.get('website'),
          locale,
        }),
      })
      const json = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok || !json.ok) {
        setStatus('err')
        setMessage(json.error || dict.contact.error)
        return
      }
      setStatus('ok')
      setMessage(dict.contact.success)
      form.reset()
    } catch {
      setStatus('err')
      setMessage(dict.contact.error)
    }
  }

  return (
    <form className="form-grid" onSubmit={onSubmit} noValidate>
      <label>
        {dict.contact.name}
        <input name="name" required autoComplete="name" />
      </label>
      <label>
        {dict.contact.email}
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label>
        {dict.contact.phone}
        <input name="phone" type="tel" autoComplete="tel" />
      </label>
      <label>
        {dict.contact.subject}
        <input name="subject" />
      </label>
      <label>
        {dict.contact.message}
        <textarea name="message" required rows={6} />
      </label>
      <label className="hp-field" aria-hidden="true">
        {dict.contact.honeypot}
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="consent">
        <input name="consentNd13" type="checkbox" required />
        <span>{dict.contact.consent}</span>
      </label>
      <button className="btn btn-primary" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? dict.cta.sending : dict.cta.send}
      </button>
      {message ? (
        <p role="status" style={{ color: status === 'ok' ? '#0b6b3a' : '#a80d26', margin: 0 }}>
          {message}
        </p>
      ) : null}
    </form>
  )
}
