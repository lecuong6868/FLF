/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Chuyển đổi 2 chiều: nội dung CMS (Lexical JSON) ↔ ô soạn thảo trên web (TipTap JSON).
 * Hỗ trợ: đoạn văn, tiêu đề H2–H4, in đậm, nghiêng, gạch chân, gạch ngang, link, danh sách chấm/số, trích dẫn, xuống dòng.
 * Nút không hỗ trợ (ảnh chèn giữa bài, bảng…) → báo để mở trình soạn thảo đầy đủ trong /admin.
 */

const BOLD = 1, ITALIC = 2, STRIKE = 4, UNDERLINE = 8, CODE = 16

const base = { format: '', indent: 0, version: 1, direction: 'ltr' as const }

/* ---------- Lexical → TipTap ---------- */
function marksFrom(format: number, link?: any) {
  const m: any[] = []
  if (format & BOLD) m.push({ type: 'bold' })
  if (format & ITALIC) m.push({ type: 'italic' })
  if (format & UNDERLINE) m.push({ type: 'underline' })
  if (format & STRIKE) m.push({ type: 'strike' })
  if (format & CODE) m.push({ type: 'code' })
  if (link) m.push({ type: 'link', attrs: { href: link.url || '#', target: link.newTab ? '_blank' : null } })
  return m
}

function inlineToTip(nodes: any[], link?: any): any[] {
  const out: any[] = []
  for (const n of nodes || []) {
    if (n.type === 'text') {
      if (!n.text) continue
      const marks = marksFrom(n.format || 0, link)
      out.push(marks.length ? { type: 'text', text: n.text, marks } : { type: 'text', text: n.text })
    } else if (n.type === 'linebreak') out.push({ type: 'hardBreak' })
    else if (n.type === 'link' || n.type === 'autolink') out.push(...inlineToTip(n.children, n.fields || {}))
    else if (n.type === 'tab') out.push({ type: 'text', text: '\t' })
    else throw new Error('unsupported:' + n.type)
  }
  return out
}

function blockToTip(n: any): any {
  switch (n.type) {
    case 'paragraph': return { type: 'paragraph', content: inlineToTip(n.children) }
    case 'heading': return { type: 'heading', attrs: { level: Math.min(4, Math.max(2, Number(String(n.tag).slice(1)) || 2)) }, content: inlineToTip(n.children) }
    case 'quote': return { type: 'blockquote', content: [{ type: 'paragraph', content: inlineToTip(n.children) }] }
    case 'list': return {
      type: n.listType === 'number' ? 'orderedList' : 'bulletList',
      content: (n.children || []).map((li: any) => {
        const inl = (li.children || []).filter((c: any) => c.type !== 'list')
        const nested = (li.children || []).filter((c: any) => c.type === 'list').map(blockToTip)
        return { type: 'listItem', content: [{ type: 'paragraph', content: inlineToTip(inl) }, ...nested] }
      }),
    }
    default: throw new Error('unsupported:' + n.type)
  }
}

/** Trả null nếu có nội dung ô soạn thảo trên web chưa hỗ trợ. */
export function lexicalToTiptap(r: any): any | null {
  try {
    const kids = r?.root?.children || []
    const content = kids.map(blockToTip).map((b: any) => (b.content && b.content.length === 0 && b.type === 'paragraph' ? { type: 'paragraph' } : b))
    return { type: 'doc', content: content.length ? content : [{ type: 'paragraph' }] }
  } catch {
    return null
  }
}

/* ---------- TipTap → Lexical ---------- */
function textNode(text: string, format: number) {
  return { type: 'text', text, format, detail: 0, mode: 'normal', style: '', version: 1 }
}

function inlineToLex(nodes: any[]): any[] {
  const out: any[] = []
  for (const n of nodes || []) {
    if (n.type === 'hardBreak') { out.push({ type: 'linebreak', version: 1 }); continue }
    if (n.type !== 'text') continue
    let format = 0
    let link: any = null
    for (const m of n.marks || []) {
      if (m.type === 'bold') format |= BOLD
      else if (m.type === 'italic') format |= ITALIC
      else if (m.type === 'underline') format |= UNDERLINE
      else if (m.type === 'strike') format |= STRIKE
      else if (m.type === 'code') format |= CODE
      else if (m.type === 'link') link = m.attrs
    }
    const t = textNode(n.text, format)
    if (link) {
      const prev = out[out.length - 1]
      if (prev?.type === 'link' && prev.fields.url === link.href) prev.children.push(t)
      else out.push({ ...base, type: 'link', fields: { url: link.href, newTab: link.target === '_blank', linkType: 'custom' }, children: [t] })
    } else out.push(t)
  }
  return out
}

function blockToLex(n: any): any[] {
  switch (n.type) {
    case 'paragraph': return [{ ...base, type: 'paragraph', textFormat: 0, textStyle: '', children: inlineToLex(n.content) }]
    case 'heading': return [{ ...base, type: 'heading', tag: `h${n.attrs?.level || 2}`, children: inlineToLex(n.content) }]
    case 'blockquote': return (n.content || []).map((p: any) => ({ ...base, type: 'quote', children: inlineToLex(p.content) }))
    case 'bulletList':
    case 'orderedList': {
      const number = n.type === 'orderedList'
      return [{
        ...base, type: 'list', listType: number ? 'number' : 'bullet', start: 1, tag: number ? 'ol' : 'ul',
        children: (n.content || []).map((li: any, i: number) => {
          const kids: any[] = []
          for (const c of li.content || []) {
            if (c.type === 'paragraph') { if (kids.length) kids.push({ type: 'linebreak', version: 1 }); kids.push(...inlineToLex(c.content)) }
            else kids.push(...blockToLex(c))
          }
          return { ...base, type: 'listitem', value: i + 1, checked: undefined, children: kids }
        }),
      }]
    }
    default: return []
  }
}

export function tiptapToLexical(doc: any) {
  return { root: { ...base, type: 'root', children: (doc?.content || []).flatMap(blockToLex) } }
}
