'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

/** Gọi API Payload bằng phiên đăng nhập hiện tại (cookie). */
export async function api(path: string, opts: RequestInit = {}) {
  const r = await fetch(path, { credentials: 'include', ...opts })
  const j = await r.json().catch(() => ({}))
  if (!r.ok) {
    const msg = j?.errors?.[0]?.message || j?.message || `Lỗi ${r.status}`
    throw new Error(r.status === 403 ? 'Không có quyền thực hiện (phiên đăng nhập hết hạn, hoặc mục này cần quyền admin). Thử tải lại trang.' : msg)
  }
  return j
}

export const json = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

export async function uploadImage(file: File) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('_payload', JSON.stringify({ alt: file.name.replace(/\.[^.]+$/, '') }))
  const j = await api('/api/media', { method: 'POST', body: fd })
  return j.doc
}

/** Ảnh (đối tượng media đầy đủ) → chỉ giữ id khi lưu. */
export function toSave(v: any): any {
  if (Array.isArray(v)) return v.map(toSave)
  if (v && typeof v === 'object') {
    if ('mimeType' in v && 'filename' in v && v.id != null) return v.id
    const o: any = {}
    for (const [k, x] of Object.entries(v)) o[k] = toSave(x)
    return o
  }
  return v
}

/** Rich text (Lexical) ↔ chữ thường (mỗi đoạn cách nhau 1 dòng trống). */
export function richToText(r: any): string {
  const paras = r?.root?.children || []
  const txt = (n: any): string => (n.text != null ? n.text : (n.children || []).map(txt).join(''))
  return paras.map(txt).join('\n\n')
}
export function textToRich(t: string) {
  const paras = t.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)
  return {
    root: {
      type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
      children: paras.map((text) => ({
        type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0,
        children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
      })),
    },
  }
}
export function richIsSimple(r: any): boolean {
  const paras = r?.root?.children || []
  return paras.every((p: any) => p.type === 'paragraph' && (p.children || []).every((c: any) => c.type === 'text' && !c.format))
}
