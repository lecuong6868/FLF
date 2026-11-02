'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useMemo, useState } from 'react'

import { lexicalToTiptap, tiptapToLexical } from './lexical'

/** Ô soạn thảo có thanh công cụ (giống Word thu nhỏ). Lưu ra định dạng của CMS. */
export function RichEditor({ value, onChange, adminHref }: { value: any; onChange: (v: any) => void; adminHref?: string }) {
  const initial = useMemo(() => (value ? lexicalToTiptap(value) : { type: 'doc', content: [{ type: 'paragraph' }] }), []) // eslint-disable-line react-hooks/exhaustive-deps
  const [linkOpen, setLinkOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [newTab, setNewTab] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] }, codeBlock: false, horizontalRule: false }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer' } }),
    ],
    content: initial || undefined,
    onUpdate: ({ editor: ed }) => onChange(tiptapToLexical(ed.getJSON())),
    editorProps: { attributes: { class: 'ce-rich-area article-body' } },
  })

  if (initial === null) {
    return (
      <p className="ce-hint">
        Bài này có thành phần đặc biệt (ảnh chèn giữa bài, bảng…) nên cần sửa trong trình soạn thảo đầy đủ.{' '}
        {adminHref ? <a href={adminHref} target="_blank" rel="noreferrer">Mở trình soạn thảo đầy đủ ↗</a> : null}
      </p>
    )
  }
  if (!editor) return <div className="ce-rich"><p className="ce-hint">Đang mở ô soạn thảo…</p></div>

  const B = ({ on, title, act, children }: { on?: boolean; title: string; act: () => void; children: React.ReactNode }) => (
    <button type="button" title={title} className={on ? 'on' : ''} onMouseDown={(e) => e.preventDefault()} onClick={act}>{children}</button>
  )
  const c = () => editor.chain().focus()
  const openLink = () => {
    const prev = editor.getAttributes('link')
    setUrl(prev.href || ''); setNewTab(prev.target === '_blank'); setLinkOpen(true)
  }
  const applyLink = () => {
    if (!url.trim()) c().extendMarkRange('link').unsetLink().run()
    else {
      const href = /^(https?:|mailto:|tel:|\/|#)/.test(url.trim()) ? url.trim() : 'https://' + url.trim()
      c().extendMarkRange('link').setLink({ href, target: newTab ? '_blank' : null } as any).run()
    }
    setLinkOpen(false)
  }

  return (
    <div className="ce-rich">
      <div className="ce-rich-bar">
        <select value={editor.isActive('heading', { level: 2 }) ? '2' : editor.isActive('heading', { level: 3 }) ? '3' : editor.isActive('heading', { level: 4 }) ? '4' : 'p'}
          onChange={(e) => { const v = e.target.value; if (v === 'p') c().setParagraph().run(); else c().toggleHeading({ level: Number(v) as 2 | 3 | 4 }).run() }}>
          <option value="p">Đoạn văn</option><option value="2">Tiêu đề lớn</option><option value="3">Tiêu đề vừa</option><option value="4">Tiêu đề nhỏ</option>
        </select>
        <B title="In đậm (Ctrl+B)" on={editor.isActive('bold')} act={() => c().toggleBold().run()}><b>B</b></B>
        <B title="In nghiêng (Ctrl+I)" on={editor.isActive('italic')} act={() => c().toggleItalic().run()}><i>I</i></B>
        <B title="Gạch chân (Ctrl+U)" on={editor.isActive('underline')} act={() => c().toggleUnderline().run()}><u>U</u></B>
        <B title="Gạch ngang" on={editor.isActive('strike')} act={() => c().toggleStrike().run()}><s>S</s></B>
        <span className="sep" />
        <B title="Chèn / sửa link" on={editor.isActive('link')} act={openLink}>🔗</B>
        <B title="Danh sách chấm" on={editor.isActive('bulletList')} act={() => c().toggleBulletList().run()}>• ≡</B>
        <B title="Danh sách số" on={editor.isActive('orderedList')} act={() => c().toggleOrderedList().run()}>1. ≡</B>
        <B title="Trích dẫn" on={editor.isActive('blockquote')} act={() => c().toggleBlockquote().run()}>❝</B>
        <span className="sep" />
        <B title="Hoàn tác (Ctrl+Z)" act={() => c().undo().run()}>↶</B>
        <B title="Làm lại" act={() => c().redo().run()}>↷</B>
        <B title="Xóa định dạng" act={() => c().unsetAllMarks().clearNodes().run()}>⌫</B>
      </div>
      {linkOpen ? (
        <div className="ce-rich-link">
          <input type="text" autoFocus placeholder="Dán link, ví dụ https://… hoặc /vi/gioi-thieu" value={url} onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyLink() } }} />
          <label className="ce-check"><input type="checkbox" checked={newTab} onChange={(e) => setNewTab(e.target.checked)} /> Mở tab mới</label>
          <span className="ce-row">
            <button type="button" className="ce-btn primary sm" onClick={applyLink}>Áp dụng</button>
            {editor.isActive('link') ? <button type="button" className="ce-btn sm danger" onClick={() => { c().extendMarkRange('link').unsetLink().run(); setLinkOpen(false) }}>Bỏ link</button> : null}
            <button type="button" className="ce-link" onClick={() => setLinkOpen(false)}>Hủy</button>
          </span>
        </div>
      ) : null}
      <EditorContent editor={editor} />
      <p className="ce-hint">Bôi đen chữ rồi bấm nút để định dạng. Dán từ Word / Google Docs vẫn giữ in đậm, link, danh sách.</p>
    </div>
  )
}
