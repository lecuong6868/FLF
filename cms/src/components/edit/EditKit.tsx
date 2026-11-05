'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { PAGE_BLOCKS } from '@/blocks'
import { THEME_COLORS } from '@/globals/Theme'
import { type BlockData, BlockView } from '@/components/Blocks'
import { PostView } from '@/components/PostView'
import { type Lang, type SectionKey, themeCss } from '@/lib/shared'
import { api, json, toSave } from './api'
import { type F, FieldList } from './Fields'
import './editor.css'

/* ---------------- Bật/tắt chế độ sửa (nhớ trong trình duyệt) ---------------- */
export function useEditOn(): [boolean, (v: boolean) => void] {
  const [on, setOn] = useState(true)
  useEffect(() => {
    try { setOn(localStorage.getItem('flf-edit') !== 'off') } catch {}
    const h = (e: Event) => setOn((e as CustomEvent).detail)
    window.addEventListener('flf-edit', h)
    return () => window.removeEventListener('flf-edit', h)
  }, [])
  const set = (v: boolean) => {
    try { localStorage.setItem('flf-edit', v ? 'on' : 'off') } catch {}
    window.dispatchEvent(new CustomEvent('flf-edit', { detail: v }))
  }
  return [on, set]
}

/* Chỉ 1 ngăn kéo mở một lúc */
export function useCloseOnOther(id: string, close: () => void) {
  useEffect(() => {
    const h = (e: Event) => { if ((e as CustomEvent).detail !== id) close() }
    window.addEventListener('ce-open', h)
    return () => window.removeEventListener('ce-open', h)
  }, [id, close])
}
export const announceOpen = (id: string) => window.dispatchEvent(new CustomEvent('ce-open', { detail: id }))

/* ---------------- Ngăn kéo bên phải ---------------- */
export function Drawer({ title, onClose, children, footer, tabs }: {
  title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode
  tabs?: { id: string; label: string; active: boolean; onClick: () => void }[]
}) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  return (
    <div className="ce-drawer" role="dialog" aria-label={title}>
      <div className="ce-drawer-head">
        <strong>{title}</strong>
        <button type="button" className="ce-x" onClick={onClose} aria-label="Đóng">✕</button>
      </div>
      {tabs ? <div className="ce-tabs">{tabs.map((t) => <button key={t.id} type="button" className={t.active ? 'on' : ''} onClick={t.onClick}>{t.label}</button>)}</div> : null}
      <div className="ce-drawer-body">{children}</div>
      {footer ? <div className="ce-drawer-foot">{footer}</div> : null}
    </div>
  )
}

/* ---------------- Thanh lưu ở cuối màn hình ---------------- */
function SaveBar({ dirty, saving, msg, onSave, onDiscard }: { dirty: boolean; saving: boolean; msg: string; onSave: () => void; onDiscard: () => void }) {
  if (!dirty && !msg) return null
  return (
    <div className={`ce-savebar ${dirty ? 'dirty' : ''}`}>
      <span>{saving ? 'Đang lưu…' : dirty ? '● Có thay đổi chưa lưu — đang xem trước trên trang' : msg}</span>
      {dirty ? (
        <span className="ce-row">
          <button type="button" className="ce-btn ghost" onClick={onDiscard} disabled={saving}>Hủy thay đổi</button>
          <button type="button" className="ce-btn primary" onClick={onSave} disabled={saving}>💾 Lưu & đăng</button>
        </span>
      ) : null}
    </div>
  )
}

function useUnsavedGuard(dirty: boolean) {
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = '' } }
    window.addEventListener('beforeunload', h)
    return () => window.removeEventListener('beforeunload', h)
  }, [dirty])
}

const blockLabel = (slug: string) => (PAGE_BLOCKS.find((b) => b.slug === slug)?.labels?.singular as string) || slug
const blockFields = (slug: string) => (PAGE_BLOCKS.find((b) => b.slug === slug)?.fields || []) as F[]

function blockSummary(b: any): string {
  return b.title || b.headline || b.index || ''
}

/* ================= Trang (Trang chủ / Giới thiệu) ================= */
export function EditablePage({ pageId, initial, lang, isHome, data }: { pageId: number | string; initial: any[]; lang: Lang; isHome: boolean; data?: BlockData }) {
  const router = useRouter()
  const [on] = useEditOn()
  const [saved, setSaved] = useState<any[]>(initial || [])
  const [blocks, setBlocks] = useState<any[]>(initial || [])
  const [edit, setEdit] = useState<number | null>(null)
  const [tab, setTab] = useState<'content' | 'look'>('content')
  const [adding, setAdding] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const dirty = useMemo(() => JSON.stringify(blocks) !== JSON.stringify(saved), [blocks, saved])
  useUnsavedGuard(dirty)
  const adminHref = `/admin/collections/pages/${pageId}?locale=${lang}`
  const closeEdit = useCallback(() => setEdit(null), [])
  useCloseOnOther('page', closeEdit)
  useEffect(() => { if (edit != null) announceOpen('page') }, [edit])

  const update = (i: number, v: any) => setBlocks((bs) => bs.map((b, k) => (k === i ? v : b)))
  const move = (i: number, d: number) => setBlocks((bs) => {
    const j = i + d
    if (j < 0 || j >= bs.length) return bs
    const n = [...bs]; [n[i], n[j]] = [n[j], n[i]]; return n
  })
  const remove = (i: number) => { if (confirm(`Xóa phần "${blockLabel(blocks[i].blockType)}${blockSummary(blocks[i]) ? ': ' + blockSummary(blocks[i]) : ''}"?`)) { setBlocks((bs) => bs.filter((_, k) => k !== i)); setEdit(null) } }
  const add = (at: number, slug: string) => {
    setBlocks((bs) => [...bs.slice(0, at), { blockType: slug }, ...bs.slice(at)])
    setAdding(null); setEdit(at); setTab('content')
  }
  const save = async () => {
    setSaving(true); setMsg('')
    try {
      const j = await api(`/api/pages/${pageId}?locale=${lang}&depth=2`, json('PATCH', { layout: toSave(blocks) }))
      const fresh = j.doc?.layout || blocks
      setBlocks(fresh); setSaved(fresh)
      setMsg('✓ Đã lưu — khách xem web sẽ thấy ngay.')
      router.refresh()
      setTimeout(() => setMsg(''), 4000)
    } catch (e: any) { setMsg('✕ ' + e.message) } finally { setSaving(false) }
  }

  const AddBtn = ({ at }: { at: number }) => on ? (
    <div className="ce-add">
      <button type="button" onClick={() => setAdding(adding === at ? null : at)}>＋ Thêm phần ở đây</button>
      {adding === at ? (
        <div className="ce-add-menu">
          {PAGE_BLOCKS.map((b) => <button type="button" key={b.slug} onClick={() => add(at, b.slug)}>{b.labels?.singular as string}</button>)}
        </div>
      ) : null}
    </div>
  ) : null

  const cur = edit != null ? blocks[edit] : null
  const fields = cur ? blockFields(cur.blockType) : []
  return (
    <>
      {blocks.map((b, i) => {
        const hidden = b.appearance?.hidden
        if (!on && hidden) return null
        return (
          <React.Fragment key={b.id || `new-${i}`}>
            {i === 0 ? <AddBtn at={0} /> : null}
            <div className={`ce-block ${on ? 'on' : ''} ${edit === i ? 'active' : ''} ${hidden ? 'is-hidden' : ''}`}>
              {on ? (
                <div className="ce-tools">
                  <span className="ce-tag">{blockLabel(b.blockType)}{hidden ? ' · đang ẩn' : ''}</span>
                  <button type="button" className="ce-btn primary sm" onClick={() => { setEdit(i); setTab('content') }}>✏️ Sửa</button>
                  <button type="button" className="ce-btn sm" onClick={() => { setEdit(i); setTab('look') }} title="Màu sắc, khoảng cách">🎨</button>
                  <button type="button" className="ce-btn sm" onClick={() => move(i, -1)} title="Đưa lên">↑</button>
                  <button type="button" className="ce-btn sm" onClick={() => move(i, 1)} title="Đưa xuống">↓</button>
                  <button type="button" className="ce-btn sm" title={hidden ? 'Hiện lại' : 'Tạm ẩn'}
                    onClick={() => update(i, { ...b, appearance: { ...(b.appearance || {}), hidden: !hidden } })}>{hidden ? '👁 Hiện' : '🙈'}</button>
                  <button type="button" className="ce-btn sm danger" onClick={() => remove(i)} title="Xóa phần">🗑</button>
                </div>
              ) : null}
              <div onDoubleClick={() => on && (setEdit(i), setTab('content'))}>
                <BlockView b={b} lang={lang} isHome={isHome} data={data} />
              </div>
            </div>
            <AddBtn at={i + 1} />
          </React.Fragment>
        )
      })}
      {blocks.length === 0 ? <AddBtn at={0} /> : null}
      {cur && on ? (
        <Drawer
          title={`${blockLabel(cur.blockType)}${blockSummary(cur) ? ' — ' + blockSummary(cur).slice(0, 40) : ''} (${lang.toUpperCase()})`}
          onClose={() => setEdit(null)}
          tabs={[
            { id: 'content', label: 'Nội dung & hình ảnh', active: tab === 'content', onClick: () => setTab('content') },
            { id: 'look', label: 'Màu sắc & bố cục', active: tab === 'look', onClick: () => setTab('look') },
          ]}
          footer={<><span className="ce-hint">{msg || 'Thay đổi hiện ngay trên trang. Bấm Lưu để đăng.'}</span><button type="button" className="ce-btn primary" disabled={!dirty || saving} onClick={save}>💾 Lưu & đăng</button></>}
        >
          <FieldList
            key={`${edit}-${tab}`}
            fields={fields.filter((f) => (tab === 'look' ? f.name === 'appearance' || f.name === 'style' || f.name === 'columns' : f.name !== 'appearance' && f.name !== 'style' && f.name !== 'columns' && f.name !== 'anchor'))
              .flatMap((f) => (f.name === 'appearance' ? f.fields : [f]))}
            value={tab === 'look' ? { ...cur, ...(cur.appearance || {}) } : cur}
            onChange={(v) => {
              if (tab === 'look') {
                const { bg, text, spacing, hidden, ...rest } = v
                update(edit!, { ...rest, appearance: { ...(cur.appearance || {}), bg, text, spacing, hidden } })
              } else update(edit!, v)
            }}
            adminHref={adminHref}
          />
          {tab === 'look' && cur.anchor !== undefined ? null : null}
        </Drawer>
      ) : null}
      {edit == null ? <SaveBar dirty={dirty} saving={saving} msg={msg} onSave={save} onDiscard={() => { setBlocks(saved); setEdit(null) }} /> : null}
    </>
  )
}

/* ================= Bài viết ================= */
const POST_FIELDS: F[] = [
  { name: 'title', type: 'text', label: 'Tiêu đề' },
  { name: 'excerpt', type: 'textarea', label: 'Tóm tắt (hiện ở danh sách)' },
  { name: 'featuredImage', type: 'upload', label: 'Ảnh đại diện' },
  { name: 'content', type: 'richText', label: 'Nội dung bài' },
]
const POST_META: F[] = [
  { name: 'layoutStyle', type: 'select', label: 'Bố cục bài viết', defaultValue: 'standard', options: [
    { label: 'Chuẩn (cột đọc giữa trang)', value: 'standard' },
    { label: 'Rộng (ảnh lớn tràn khung)', value: 'wide' },
    { label: 'Ảnh bên trái, chữ bên phải', value: 'image-left' },
    { label: 'Ảnh bìa nền tối (kiểu tạp chí)', value: 'cover' },
  ] },
  { name: 'status', type: 'select', label: 'Trạng thái', defaultValue: 'draft', options: [
    { label: 'Nháp (khách không thấy)', value: 'draft' },
    { label: 'Chờ duyệt', value: 'pending_review' },
    { label: 'Đã đăng (khách thấy)', value: 'published' },
  ] },
  { name: 'topic', type: 'select', label: 'Chủ đề', options: [
    { label: 'Đầu tư', value: 'dau-tu' }, { label: 'Thuế', value: 'thue' }, { label: 'Quản trị doanh nghiệp', value: 'quan-tri-dn' },
    { label: 'Quản trị rủi ro', value: 'rui-ro' }, { label: 'Giấy phép', value: 'giay-phep' }, { label: 'Lao động & nhân sự', value: 'lao-dong' },
    { label: 'Hợp đồng & giao dịch', value: 'hop-dong' }, { label: 'Tuân thủ & bảo vệ dữ liệu', value: 'tuan-thu' },
    { label: 'M&A', value: 'm-a' }, { label: 'Startup', value: 'startup' }, { label: 'Blockchain', value: 'blockchain' }, { label: 'AI', value: 'ai' },
  ] },
  { name: 'docStatus', type: 'select', label: 'VBPL — Tình trạng', options: [
    { label: 'Sắp hiệu lực', value: 'sap-hieu-luc' }, { label: 'Đã hiệu lực', value: 'da-hieu-luc' }, { label: 'Dự thảo', value: 'du-thao' },
  ] },
  { name: 'docField', type: 'select', label: 'VBPL — Lĩnh vực', options: [
    { label: 'Doanh nghiệp', value: 'doanh-nghiep' }, { label: 'Đầu tư', value: 'dau-tu' }, { label: 'Thuế', value: 'thue' },
    { label: 'Lao động', value: 'lao-dong' }, { label: 'Đất đai', value: 'dat-dai' }, { label: 'Công nghệ', value: 'cong-nghe' },
  ] },
  { name: 'docNumber', type: 'text', label: 'VBPL — Số hiệu (vd: 18/2026/NĐ-CP)' },
  { name: 'issuedAt', type: 'date', label: 'VBPL — Ngày ban hành' },
  { name: 'effectiveAt', type: 'date', label: 'VBPL — Ngày hiệu lực' },
  { name: 'sourceUrl', type: 'text', label: 'VBPL — Link văn bản gốc' },
  { name: 'publishedAt', type: 'date', label: 'Ngày đăng' },
  { name: 'slug', type: 'text', label: 'Đường dẫn (slug)', admin: { description: 'Chỉ chữ thường không dấu và dấu gạch ngang.' } },
]
const PICK = ['title', 'excerpt', 'featuredImage', 'content', 'layoutStyle', 'status', 'topic', 'publishedAt', 'slug', 'docStatus', 'docField', 'docNumber', 'issuedAt', 'effectiveAt', 'sourceUrl']

export function EditablePost({ initial, lang, section, role }: { initial: any; lang: Lang; section: SectionKey; role: string }) {
  const canPublish = role === 'admin' || role === 'reviewer'
  const router = useRouter()
  const [on] = useEditOn()
  const [saved, setSaved] = useState<any>(initial)
  const [post, setPost] = useState<any>(initial)
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'content' | 'meta'>('content')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const dirty = JSON.stringify(post) !== JSON.stringify(saved)
  useUnsavedGuard(dirty)
  const closeOpen = useCallback(() => setOpen(false), [])
  useCloseOnOther('post', closeOpen)
  useEffect(() => { if (open) announceOpen('post') }, [open])
  const save = async () => {
    setSaving(true); setMsg('')
    try {
      const data = Object.fromEntries(PICK.map((k) => [k, post[k]]))
      const j = await api(`/api/posts/${post.id}?locale=${lang}&depth=2`, json('PATCH', toSave(data)))
      setPost(j.doc); setSaved(j.doc)
      setMsg('✓ Đã lưu.')
      if (j.doc.slug !== initial.slug) { window.location.href = `/${lang}/${section}/${j.doc.slug}`; return }
      router.refresh(); setTimeout(() => setMsg(''), 4000)
    } catch (e: any) { setMsg('✕ ' + e.message) } finally { setSaving(false) }
  }
  const del = async () => {
    if (!confirm('Xóa hẳn bài viết này? Không khôi phục được.')) return
    try { await api(`/api/posts/${post.id}`, { method: 'DELETE' }); window.location.href = `/${lang}/${section}` } catch (e: any) { setMsg('✕ ' + e.message) }
  }
  return (
    <>
      <div className={`ce-block ${on ? 'on' : ''} ${open ? 'active' : ''}`}>
        {on ? (
          <div className="ce-tools">
            <span className="ce-tag">Bài viết · {post.status === 'published' ? 'Đã đăng' : post.status === 'pending_review' ? 'Chờ duyệt' : 'Nháp'}</span>
            <button type="button" className="ce-btn primary sm" onClick={() => { setOpen(true); setTab('content') }}>✏️ Sửa bài</button>
            <button type="button" className="ce-btn sm" onClick={() => { setOpen(true); setTab('meta') }}>🧩 Bố cục & đăng bài</button>
            {role === 'admin' ? <button type="button" className="ce-btn sm danger" onClick={del}>🗑</button> : null}
          </div>
        ) : null}
        <div onDoubleClick={() => on && setOpen(true)}><PostView post={post} lang={lang} section={section} /></div>
      </div>
      {open && on ? (
        <Drawer title={`Bài viết (${lang.toUpperCase()})`} onClose={() => setOpen(false)}
          tabs={[
            { id: 'content', label: 'Nội dung & ảnh', active: tab === 'content', onClick: () => setTab('content') },
            { id: 'meta', label: 'Bố cục & đăng bài', active: tab === 'meta', onClick: () => setTab('meta') },
          ]}
          footer={<><span className="ce-hint">{msg || 'Xem trước ngay trên trang.'}</span><button type="button" className="ce-btn primary" disabled={!dirty || saving} onClick={save}>💾 Lưu</button></>}>
          <FieldList fields={tab === 'content' ? POST_FIELDS : canPublish ? POST_META : POST_META.map((f) => (f.name === 'status' ? { ...f, label: 'Trạng thái (bài của anh/chị cần người duyệt đăng)', options: f.options.filter((o: any) => o.value !== 'published' || post.status === 'published') } : f))}
            value={post} onChange={setPost} adminHref={`/admin/collections/posts/${post.id}?locale=${lang}`} />
        </Drawer>
      ) : null}
      {!open ? <SaveBar dirty={dirty} saving={saving} msg={msg} onSave={save} onDiscard={() => setPost(saved)} /> : null}
    </>
  )
}

/* ================= Nút "Viết bài mới" trên trang danh sách ================= */
export function NewPostButton({ lang, section, topic }: { lang: Lang; section: SectionKey; topic?: string }) {
  const [on] = useEditOn()
  const [busy, setBusy] = useState(false)
  if (!on) return null
  return (
    <button type="button" className="ce-btn primary ce-newpost" disabled={busy} onClick={async () => {
      const title = prompt('Tiêu đề bài viết mới:')
      if (!title) return
      setBusy(true)
      try {
        const cat = await api(`/api/categories?where[slug][equals]=${section}&limit=1`)
        const slug = title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) + '-' + Date.now().toString(36).slice(-4)
        await api(`/api/posts?locale=${lang}`, json('POST', { title, slug, status: 'draft', category: cat.docs[0]?.id, topic: topic || undefined, publishedAt: new Date().toISOString() }))
        window.location.href = `/${lang}/${section}/${slug}`
      } catch (e: any) { alert(e.message); setBusy(false) }
    }}>＋ Viết bài mới</button>
  )
}

/* ================= Hộp yêu cầu liên hệ (chỉ admin) ================= */
const ST = [
  { v: 'new', label: '🔴 Mới' },
  { v: 'processing', label: '🟡 Đang xử lý' },
  { v: 'done', label: '🟢 Đã xong' },
]
function fmtTime(s: string) {
  try { return new Date(s).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) } catch { return s }
}

function Inbox({ onClose, onCount }: { onClose: () => void; onCount: (n: number) => void }) {
  const [filter, setFilter] = useState<'new' | 'processing' | 'done' | 'all'>('new')
  const [items, setItems] = useState<any[] | null>(null)
  const [open, setOpen] = useState<any>(null)
  const [msg, setMsg] = useState('')
  const load = useCallback(async () => {
    setItems(null)
    const w = filter === 'all' ? '' : `&where[status][equals]=${filter}`
    try {
      const j = await api(`/api/contact-requests?limit=100&sort=-createdAt${w}`)
      setItems(j.docs)
      const c = await api('/api/contact-requests?limit=0&where[status][equals]=new')
      onCount(c.totalDocs || 0)
    } catch (e: any) { setMsg('✕ ' + e.message); setItems([]) }
  }, [filter, onCount])
  useEffect(() => { load() }, [load])

  const save = async (it: any) => {
    try {
      await api(`/api/contact-requests/${it.id}`, json('PATCH', { status: it.status, note: it.note || '' }))
      setMsg('✓ Đã lưu.'); setOpen(null); load()
    } catch (e: any) { setMsg('✕ ' + e.message) }
  }
  const del = async (it: any) => {
    if (!confirm(`Xóa hẳn yêu cầu của ${it.name}?`)) return
    try { await api(`/api/contact-requests/${it.id}`, { method: 'DELETE' }); setOpen(null); load() } catch (e: any) { setMsg('✕ ' + e.message) }
  }

  return (
    <Drawer title="📥 Yêu cầu liên hệ từ khách" onClose={onClose}
      tabs={[...ST.map((s) => ({ id: s.v, label: s.label, active: filter === s.v, onClick: () => { setFilter(s.v as any); setOpen(null) } })),
        { id: 'all', label: 'Tất cả', active: filter === 'all', onClick: () => { setFilter('all'); setOpen(null) } }]}
      footer={<span className="ce-hint">{msg || 'Bấm vào một yêu cầu để xem chi tiết, đổi tình trạng, ghi chú.'}</span>}>
      {items === null ? <p>Đang tải…</p> : items.length === 0 ? <p className="ce-hint">Không có yêu cầu nào ở mục này.</p> : (
        <div className="ce-inbox">
          {items.map((it) => (
            <div key={it.id} className={`ce-inbox-item ${open?.id === it.id ? 'open' : ''}`}>
              <button type="button" className="ce-inbox-head" onClick={() => setOpen(open?.id === it.id ? null : { ...it })}>
                <span><strong>{it.name}</strong> · {fmtTime(it.createdAt)}</span>
                <span>{ST.find((s) => s.v === it.status)?.label}</span>
                <span className="ce-inbox-preview">{String(it.message || '').slice(0, 90)}</span>
              </button>
              {open?.id === it.id ? (
                <div className="ce-inbox-body">
                  <p>{it.email ? <>📧 <a href={`mailto:${it.email}`}>{it.email}</a><br /></> : null}
                    {it.phone ? <>📞 <a href={`tel:${it.phone}`}>{it.phone}</a><br /></> : null}
                    <span className="ce-hint">Gửi từ {it.page || '—'} · {it.lang === 'en' ? 'English' : 'Tiếng Việt'} · đã đồng ý NĐ 13</span></p>
                  <div className="ce-inbox-msg">{it.message}</div>
                  <FieldList fields={[
                    { name: 'status', type: 'select', label: 'Tình trạng', options: ST.map((s) => ({ label: s.label, value: s.v })) },
                    { name: 'note', type: 'textarea', label: 'Ghi chú nội bộ (khách không thấy)' },
                  ]} value={open} onChange={setOpen} />
                  <div className="ce-row">
                    <button type="button" className="ce-btn primary" onClick={() => save(open)}>💾 Lưu</button>
                    <button type="button" className="ce-btn ghost danger" onClick={() => del(it)}>🗑 Xóa</button>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </Drawer>
  )
}

/* ================= Quản lý tài khoản (chỉ admin) ================= */
const ROLE_LABEL: Record<string, string> = { admin: 'Quản trị', reviewer: 'Người duyệt', editor: 'Người viết bài' }
const ROLE_HELP: Record<string, string> = {
  admin: 'Toàn quyền: trang, bài, màu sắc, menu, công ty, liên hệ, tài khoản.',
  reviewer: 'Sửa trang, viết & đăng bài, sửa menu và thông tin công ty.',
  editor: 'Viết & sửa bài, gửi duyệt — không tự đăng, không sửa trang.',
}
function genPassword() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  const a = new Uint32Array(14); crypto.getRandomValues(a)
  return Array.from(a, (x) => c[x % c.length]).join('')
}

function Accounts({ onClose }: { onClose: () => void }) {
  const [users, setUsers] = useState<any[] | null>(null)
  const [me, setMe] = useState<any>(null)
  const [msg, setMsg] = useState('')
  const [shown, setShown] = useState<{ email: string; password: string } | null>(null)
  const [form, setForm] = useState({ name: '', email: '', role: 'editor' })
  const load = useCallback(async () => {
    try {
      const [u, m] = await Promise.all([api('/api/users?limit=100&sort=email'), api('/api/users/me')])
      setUsers(u.docs); setMe(m.user)
    } catch (e: any) { setMsg('✕ ' + e.message); setUsers([]) }
  }, [])
  useEffect(() => { load() }, [load])

  const create = async () => {
    if (!form.email.trim()) return setMsg('Nhập email.')
    const password = genPassword()
    try {
      await api('/api/users', json('POST', { ...form, email: form.email.trim().toLowerCase(), password }))
      setShown({ email: form.email.trim().toLowerCase(), password }); setForm({ name: '', email: '', role: 'editor' }); setMsg(''); load()
    } catch (e: any) { setMsg('✕ ' + e.message) }
  }
  const setRole = async (u: any, role: string) => {
    if (u.id === me?.id) return setMsg('Không tự đổi vai trò của chính mình.')
    try { await api(`/api/users/${u.id}`, json('PATCH', { role })); setMsg(`✓ Đã đổi vai trò ${u.email}.`); load() } catch (e: any) { setMsg('✕ ' + e.message) }
  }
  const reset = async (u: any) => {
    if (!confirm(`Tạo mật khẩu mới cho ${u.email}? Mật khẩu cũ sẽ không dùng được nữa.`)) return
    const password = genPassword()
    try { await api(`/api/users/${u.id}`, json('PATCH', { password })); setShown({ email: u.email, password }) } catch (e: any) { setMsg('✕ ' + e.message) }
  }
  const remove = async (u: any) => {
    if (u.id === me?.id) return setMsg('Không tự xóa tài khoản đang đăng nhập.')
    if (!confirm(`Xóa tài khoản ${u.email}?`)) return
    try { await api(`/api/users/${u.id}`, { method: 'DELETE' }); load() } catch (e: any) { setMsg('✕ ' + e.message) }
  }

  return (
    <Drawer title="👥 Tài khoản nhân viên" onClose={onClose} footer={<span className="ce-hint">{msg || 'Mật khẩu tạo tự động, chỉ hiện 1 lần — anh gửi riêng cho nhân viên.'}</span>}>
      {shown ? (
        <div className="ce-secret">
          <strong>Mật khẩu cho {shown.email}</strong>
          <code>{shown.password}</code>
          <span className="ce-row">
            <button type="button" className="ce-btn sm" onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/admin\nEmail: ${shown.email}\nMật khẩu: ${shown.password}`).then(() => setMsg('✓ Đã chép.'), () => setMsg('Chép chưa được — anh tự bôi đen để chép.'))}>📋 Chép thông tin đăng nhập</button>
            <button type="button" className="ce-link" onClick={() => setShown(null)}>Đã lưu, ẩn đi</button>
          </span>
          <p className="ce-hint">Mật khẩu này chỉ hiện lúc này. Nhân viên nên đổi lại sau khi đăng nhập.</p>
        </div>
      ) : null}
      <h4 className="ce-h">Tạo tài khoản mới</h4>
      <FieldList fields={[
        { name: 'name', type: 'text', label: 'Họ tên' },
        { name: 'email', type: 'email', label: 'Email đăng nhập' },
        { name: 'role', type: 'select', label: 'Vai trò', defaultValue: 'editor', options: ['editor', 'reviewer', 'admin'].map((r) => ({ value: r, label: ROLE_LABEL[r] })) },
      ]} value={form} onChange={setForm} />
      <p className="ce-hint" style={{ marginTop: '-.5rem' }}>{ROLE_HELP[form.role]}</p>
      <button type="button" className="ce-btn primary" onClick={create}>＋ Tạo tài khoản</button>

      <h4 className="ce-h">Danh sách ({users?.length ?? '…'})</h4>
      {users === null ? <p>Đang tải…</p> : users.map((u) => (
        <div key={u.id} className="ce-user-row">
          <div><strong>{u.name || u.email}</strong>{u.id === me?.id ? <span className="badge-draft" style={{ background: '#dbeafe', color: '#1d4ed8' }}>Anh</span> : null}<br /><span className="ce-hint">{u.email}</span></div>
          <select value={u.role} disabled={u.id === me?.id} onChange={(e) => setRole(u, e.target.value)}>
            {['editor', 'reviewer', 'admin'].map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
          </select>
          <span className="ce-row">
            <button type="button" className="ce-btn sm" onClick={() => reset(u)} title="Tạo mật khẩu mới">🔑</button>
            {u.id !== me?.id ? <button type="button" className="ce-btn sm danger" onClick={() => remove(u)} title="Xóa">🗑</button> : null}
          </span>
        </div>
      ))}
      <div className="ce-roles">
        {['admin', 'reviewer', 'editor'].map((r) => <p key={r}><strong>{ROLE_LABEL[r]}:</strong> {ROLE_HELP[r]}</p>)}
      </div>
    </Drawer>
  )
}

/* ================= Thanh công cụ trên cùng ================= */
const SETTINGS_FIELDS: F[] = [
  { name: 'companyLegalName', type: 'text', label: 'Tên pháp lý công ty' },
  { name: 'companyTradeName', type: 'text', label: 'Tên thương mại' },
  { name: 'taxCode', type: 'text', label: 'Mã số thuế' },
  { name: 'publicAddress', type: 'textarea', label: 'Địa chỉ hiển thị trên web' },
  { name: 'phone', type: 'text', label: 'Điện thoại' },
  { name: 'email', type: 'email', label: 'Email' },
  { name: 'logo', type: 'upload', label: 'Logo (trống = logo mặc định)' },
  { name: 'facebookUrl', type: 'text', label: 'Link Facebook' },
  { name: 'linkedinUrl', type: 'text', label: 'Link LinkedIn' },
]
const NAV_FIELDS: F[] = [{
  name: 'items', type: 'array', label: 'Các mục menu', labels: { singular: 'Mục menu' },
  fields: [
    { name: 'label', type: 'text', label: 'Chữ hiển thị' },
    { name: 'href', type: 'text', label: 'Đường dẫn', admin: { description: 'Ví dụ: / , /gioi-thieu , /#contact , https://…' } },
    { name: 'openInNewTab', type: 'checkbox', label: 'Mở tab mới' },
  ],
}]
const THEME_FIELDS: F[] = [
  ...THEME_COLORS.map((c) => ({ name: c.name, type: 'text', label: c.label, admin: { description: `Mã màu, mặc định ${c.def}` } })),
  { name: 'headingFont', type: 'select', label: 'Kiểu chữ tiêu đề', defaultValue: 'serif', options: [{ label: 'Có chân (sang trọng)', value: 'serif' }, { label: 'Không chân (hiện đại)', value: 'sans' }] },
  { name: 'radius', type: 'select', label: 'Bo góc nút & thẻ', defaultValue: 'small', options: [{ label: 'Vuông', value: 'none' }, { label: 'Bo nhẹ', value: 'small' }, { label: 'Bo tròn', value: 'large' }] },
]

type Panel = null | 'theme' | 'settings' | 'nav'

export function EditorBar({ lang, userName, role, adminHref }: { lang: Lang; userName: string; role: string; adminHref: string }) {
  const [on, setOn] = useEditOn()
  const [panel, setPanel] = useState<Panel>(null)
  const [data, setData] = useState<any>(null)
  const [saved, setSaved] = useState<any>(null)
  const [msg, setMsg] = useState('')
  const [saving, setSaving] = useState(false)
  const slug = { theme: 'theme', settings: 'site-settings', nav: 'navigation' } as const
  const [inbox, setInbox] = useState(false)
  const [newCount, setNewCount] = useState(0)
  const isAdmin = role === 'admin'
  useEffect(() => {
    if (!isAdmin) return
    const tick = () => api('/api/contact-requests?limit=0&where[status][equals]=new').then((j) => setNewCount(j.totalDocs || 0)).catch(() => {})
    tick()
    const t = setInterval(tick, 60000)
    return () => clearInterval(t)
  }, [isAdmin])
  const closeInbox = useCallback(() => setInbox(false), [])
  useCloseOnOther('inbox', closeInbox)
  const [accounts, setAccounts] = useState(false)
  const closeAccounts = useCallback(() => setAccounts(false), [])
  useCloseOnOther('accounts', closeAccounts)

  const closePanel = useCallback(() => setPanel(null), [])
  useCloseOnOther('bar', closePanel)
  const openPanel = useCallback(async (p: Exclude<Panel, null>) => {
    announceOpen('bar')
    setPanel(p); setData(null); setMsg('')
    try {
      const j = await api(`/api/globals/${slug[p]}?locale=${lang}&depth=1`)
      setData(j); setSaved(j)
    } catch (e: any) { setMsg('✕ ' + e.message) }
  }, [lang]) // eslint-disable-line react-hooks/exhaustive-deps

  // Xem trước màu ngay khi chọn
  useEffect(() => {
    if (panel !== 'theme' || !data) return
    let el = document.getElementById('ce-theme-preview') as HTMLStyleElement | null
    if (!el) { el = document.createElement('style'); el.id = 'ce-theme-preview'; document.head.appendChild(el) }
    el.textContent = themeCss(data)
  }, [panel, data])

  const close = () => {
    if (panel === 'theme' && JSON.stringify(data) !== JSON.stringify(saved)) document.getElementById('ce-theme-preview')?.remove()
    setPanel(null)
  }
  const save = async () => {
    if (!panel) return
    setSaving(true); setMsg('')
    try {
      const body = toSave(panel === 'nav' ? { items: data.items } : Object.fromEntries(Object.entries(data).filter(([k]) => !['id', 'globalType', 'createdAt', 'updatedAt'].includes(k))))
      const j = await api(`/api/globals/${slug[panel]}?locale=${lang}&depth=1`, json('POST', body))
      setSaved(j.result || data); setMsg('✓ Đã lưu.')
      setTimeout(() => window.location.reload(), 600)
    } catch (e: any) { setMsg('✕ ' + e.message) } finally { setSaving(false) }
  }

  const fields = panel === 'theme' ? THEME_FIELDS : panel === 'settings' ? SETTINGS_FIELDS : NAV_FIELDS
  const titles = { theme: 'Màu sắc & kiểu chữ (toàn web)', settings: 'Thông tin công ty (chân trang)', nav: `Menu (${lang.toUpperCase()})` }
  return (
    <>
      <div className="ce-bar">
        <span className="ce-brand">✏️ FLF</span>
        <label className="ce-switch">
          <input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} />
          <span>{on ? 'Đang ở chế độ sửa' : 'Xem như khách'}</span>
        </label>
        {isAdmin ? (
          <button type="button" className={newCount ? 'ce-hot' : ''} onClick={() => { announceOpen('inbox'); setPanel(null); setInbox(true) }}>
            📥 Liên hệ{newCount ? <b className="ce-badge">{newCount}</b> : null}
          </button>
        ) : null}
        {isAdmin ? <button type="button" onClick={() => openPanel('theme')}>🎨 Màu sắc</button> : null}
        {isAdmin || role === 'reviewer' ? <button type="button" onClick={() => openPanel('nav')}>☰ Menu</button> : null}
        {isAdmin || role === 'reviewer' ? <button type="button" onClick={() => openPanel('settings')}>🏢 Công ty</button> : null}
        {isAdmin ? <button type="button" onClick={() => { announceOpen('accounts'); setPanel(null); setInbox(false); setAccounts(true) }}>👥 Tài khoản</button> : null}
        <a href={adminHref}>⚙️ Quản trị nâng cao</a>
        <span className="ce-user">{userName} · {ROLE_LABEL[role] || role}</span>
        <button type="button" onClick={async () => { await fetch('/api/users/logout', { method: 'POST', credentials: 'include' }); window.location.reload() }}>Đăng xuất</button>
      </div>
      {inbox ? <Inbox onClose={closeInbox} onCount={setNewCount} /> : null}
      {accounts ? <Accounts onClose={closeAccounts} /> : null}
      {panel ? (
        <Drawer title={titles[panel]} onClose={close}
          footer={<><span className="ce-hint">{msg || (panel === 'theme' ? 'Màu đổi ngay trên trang để anh xem thử.' : '')}</span><button type="button" className="ce-btn primary" disabled={saving || !data} onClick={save}>💾 Lưu</button></>}>
          {data ? <FieldList fields={fields} value={data} onChange={setData} /> : <p>{msg || 'Đang tải…'}</p>}
        </Drawer>
      ) : null}
    </>
  )
}
