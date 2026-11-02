'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'

import { api, uploadImage } from './api'
import { RichEditor } from './RichEditor'

export type F = Record<string, any>

const isColor = (f: F) => /Mã màu/.test(f?.admin?.description || '')
const COLOR_PRESETS = ['#003050', '#001524', '#0a3a55', '#a02020', '#102130', '#617484', '#f3f6f8', '#ffffff', '#e8eef3', '#c9a227']

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="ce-color">
      <input type="color" value={/^#[0-9a-f]{6}$/i.test(value || '') ? value : '#ffffff'} onChange={(e) => onChange(e.target.value)} />
      <input type="text" value={value || ''} placeholder="Mặc định" onChange={(e) => onChange(e.target.value)} />
      <div className="ce-swatches">
        {COLOR_PRESETS.map((c) => (
          <button type="button" key={c} title={c} style={{ background: c }} onClick={() => onChange(c)} />
        ))}
        <button type="button" className="ce-link" onClick={() => onChange('')}>Mặc định</button>
      </div>
    </div>
  )
}

function MediaLibrary({ onPick, onClose }: { onPick: (m: any) => void; onClose: () => void }) {
  const [items, setItems] = useState<any[] | null>(null)
  useEffect(() => {
    api('/api/media?limit=80&sort=-createdAt').then((j) => setItems(j.docs)).catch(() => setItems([]))
  }, [])
  return (
    <div className="ce-lib">
      <div className="ce-lib-head"><strong>Thư viện ảnh</strong><button type="button" className="ce-link" onClick={onClose}>Đóng</button></div>
      {items === null ? <p>Đang tải…</p> : items.length === 0 ? <p>Chưa có ảnh nào. Bấm “Tải ảnh lên”.</p> : (
        <div className="ce-lib-grid">
          {items.filter((m) => /^image\//.test(m.mimeType || '')).map((m) => (
            <button type="button" key={m.id} onClick={() => onPick(m)} title={m.alt || m.filename}>
              <img src={m.url} alt={m.alt || ''} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ImageInput({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [lib, setLib] = useState(false)
  const url = value && typeof value === 'object' ? value.url : null
  return (
    <div className="ce-image">
      {url ? <img src={url} alt="" /> : <div className="ce-image-empty">Chưa có ảnh</div>}
      <div className="ce-row">
        <button type="button" className="ce-btn" disabled={busy} onClick={() => ref.current?.click()}>{busy ? 'Đang tải…' : '⬆ Tải ảnh lên'}</button>
        <button type="button" className="ce-btn ghost" onClick={() => setLib(true)}>🖼 Chọn từ thư viện</button>
        {value ? <button type="button" className="ce-link danger" onClick={() => onChange(null)}>Bỏ ảnh</button> : null}
      </div>
      {err ? <p className="ce-err">{err}</p> : null}
      <input ref={ref} type="file" accept="image/*" hidden onChange={async (e) => {
        const f = e.target.files?.[0]
        if (!f) return
        setBusy(true); setErr('')
        try { onChange(await uploadImage(f)) } catch (x: any) { setErr(x.message) } finally { setBusy(false); e.target.value = '' }
      }} />
      {lib ? <MediaLibrary onClose={() => setLib(false)} onPick={(m) => { onChange(m); setLib(false) }} /> : null}
    </div>
  )
}

function ArrayInput({ field, value, onChange, adminHref }: { field: F; value: any[]; onChange: (v: any[]) => void; adminHref?: string }) {
  const rows = value || []
  const [open, setOpen] = useState<number | null>(rows.length ? 0 : null)
  const set = (i: number, v: any) => onChange(rows.map((r, k) => (k === i ? v : r)))
  const move = (i: number, d: number) => {
    const j = i + d
    if (j < 0 || j >= rows.length) return
    const n = [...rows]; [n[i], n[j]] = [n[j], n[i]]; onChange(n); setOpen(j)
  }
  const label = field.labels?.singular || 'Mục'
  return (
    <div className="ce-array">
      {rows.map((r, i) => (
        <div className="ce-array-item" key={r.id || i}>
          <div className="ce-array-head" onClick={() => setOpen(open === i ? null : i)}>
            <span>{open === i ? '▾' : '▸'} {label} {i + 1}{r.title || r.label ? `: ${r.title || r.label}` : ''}</span>
            <span className="ce-row" onClick={(e) => e.stopPropagation()}>
              <button type="button" title="Lên" onClick={() => move(i, -1)}>↑</button>
              <button type="button" title="Xuống" onClick={() => move(i, 1)}>↓</button>
              <button type="button" title="Xóa" className="danger" onClick={() => { if (confirm(`Xóa ${label.toLowerCase()} ${i + 1}?`)) onChange(rows.filter((_, k) => k !== i)) }}>✕</button>
            </span>
          </div>
          {open === i ? <div className="ce-array-body"><FieldList fields={field.fields} value={r} onChange={(v) => set(i, v)} adminHref={adminHref} /></div> : null}
        </div>
      ))}
      <button type="button" className="ce-btn ghost" onClick={() => { onChange([...rows, {}]); setOpen(rows.length) }}>＋ Thêm {label.toLowerCase()}</button>
    </div>
  )
}

export function FieldInput({ field, value, onChange, adminHref }: { field: F; value: any; onChange: (v: any) => void; adminHref?: string }) {
  switch (field.type) {
    case 'text':
      return isColor(field) ? <ColorInput value={value} onChange={onChange} /> : <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} />
    case 'email':
      return <input type="email" value={value || ''} onChange={(e) => onChange(e.target.value)} />
    case 'textarea':
      return <textarea rows={Math.min(10, Math.max(3, String(value || '').split('\n').length + 1))} value={value || ''} onChange={(e) => onChange(e.target.value)} />
    case 'checkbox':
      return <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
    case 'date':
      return <input type="date" value={(value || '').slice(0, 10)} onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)} />
    case 'select':
      return (
        <select value={value ?? field.defaultValue ?? ''} onChange={(e) => onChange(e.target.value || null)}>
          {!field.required && !field.defaultValue ? <option value="">— Không chọn —</option> : null}
          {field.options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )
    case 'upload':
      return <ImageInput value={value} onChange={onChange} />
    case 'richText':
      return <RichEditor value={value} onChange={onChange} adminHref={adminHref} />
    case 'group':
      return <div className="ce-group"><FieldList fields={field.fields} value={value || {}} onChange={onChange} adminHref={adminHref} /></div>
    case 'array':
      return <ArrayInput field={field} value={value} onChange={onChange} adminHref={adminHref} />
    default:
      return null
  }
}

export function FieldList({ fields, value, onChange, adminHref }: { fields: F[]; value: any; onChange: (v: any) => void; adminHref?: string }) {
  const v = value || {}
  return (
    <>
      {fields.filter((f) => f.name && !f.admin?.hidden).map((f) => (
        <div className={`ce-field ce-${f.type}`} key={f.name}>
          {f.type === 'checkbox' ? (
            <label className="ce-check"><FieldInput field={f} value={v[f.name]} onChange={(x) => onChange({ ...v, [f.name]: x })} /> {f.label}</label>
          ) : (
            <>
              <label className="ce-label">{f.label}</label>
              <FieldInput field={f} value={v[f.name]} onChange={(x) => onChange({ ...v, [f.name]: x })} adminHref={adminHref} />
              {f.admin?.description && !isColor(f) && f.type !== 'upload' ? <p className="ce-hint">{f.admin.description}</p> : null}
            </>
          )}
        </div>
      ))}
    </>
  )
}
