'use client'
import React, { useState } from 'react'

import type { Lang } from '@/lib/shared'

const TXT = {
  vi: { eyebrow: 'Hỏi nhanh trợ lý FLF', title: 'Doanh nghiệp của bạn đang gặp vấn đề gì?', label: 'Câu hỏi của bạn', ph: 'Gõ câu hỏi…', ask: 'Hỏi', note: 'Thông tin tham khảo, không thay thế ý kiến tư vấn chính thức.' },
  en: { eyebrow: 'Ask the FLF assistant', title: 'What is your business facing?', label: 'Your question', ph: 'Type your question…', ask: 'Ask', note: 'For reference only; does not replace formal advice.' },
}

/**
 * Khung hỏi trên banner. Hiện tại: câu hỏi được chuyển xuống form Liên hệ (điền sẵn) để chuyên viên trả lời.
 * Bước 4 sẽ nối với trợ lý AI thật.
 */
export function AskBox({ lang, eyebrow, title, suggestions, disclaimer }: { lang: Lang; eyebrow?: string; title?: string; suggestions?: string[]; disclaimer?: string }) {
  const t = TXT[lang]
  const [q, setQ] = useState('')
  const send = (text: string) => {
    const v = text.trim()
    if (!v) return
    window.dispatchEvent(new CustomEvent('flf-ask', { detail: v }))
    document.getElementById('lien-he')?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <form id="hoi" className="ask-card" onSubmit={(e) => { e.preventDefault(); send(q) }}>
      <p className="ask-eyebrow">{eyebrow || t.eyebrow}</p>
      <h2>{title || t.title}</h2>
      {suggestions?.length ? (
        <div className="ask-sugs">
          {suggestions.map((s, i) => <button key={i} type="button" onClick={() => setQ(s)}>{s}</button>)}
        </div>
      ) : null}
      <label htmlFor="ask-input">{t.label}</label>
      <div className="ask-row">
        <input id="ask-input" type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.ph} />
        <button type="submit">{t.ask}</button>
      </div>
      <p className="ask-note">{disclaimer || t.note}</p>
    </form>
  )
}
