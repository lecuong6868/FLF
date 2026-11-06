import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { Shell } from '@/components/Shell'
import { NewPostButton } from '@/components/edit/EditKit'
import { asLang, getEditor, getPosts, isSection, mediaAlt, mediaUrl, SECTIONS, T, TOPICS } from '@/lib/site'

export const dynamic = 'force-dynamic'

type P = { params: Promise<{ lang: string; section: string }>; searchParams: Promise<{ 'chu-de'?: string; topic?: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang, section } = await params
  const l = asLang(lang)
  return l && isSection(section) ? { title: SECTIONS[section][l] } : {}
}

export default async function SectionList({ params, searchParams }: P) {
  const { lang: rawLang, section } = await params
  const sp = await searchParams
  const lang = asLang(rawLang)
  if (!lang || !isSection(section)) notFound()
  const editor = await getEditor()
  const posts = await getPosts(section, lang, !!editor)
  const t = T[lang]
  // Chuyên mục: luôn hiện đủ các chủ đề (kể cả chưa có bài); mục khác: chỉ chủ đề đang có bài
  const used = Array.from(new Set(posts.map((p) => p.topic).filter(Boolean))) as string[]
  const topics = section === 'chuyen-muc' ? Object.keys(TOPICS) : used
  const active = (() => { const t = sp['chu-de'] || sp.topic || 'all'; return t === 'all' || TOPICS[t] ? t : 'all' })()
  const count = (t: string) => posts.filter((p) => p.topic === t).length
  const visible = posts.filter((p) => active === 'all' || p.topic === active)
  return (
    <Shell lang={lang} path={`/${section}`} adminHref="/admin/collections/posts">
      <section className="page-hero">
        <div className="wrap">
          <h1>{SECTIONS[section][lang]}</h1>
          <p className="lead">{SECTIONS[section].lead[lang]}</p>
        </div>
      </section>
      <section className="content-section">
        <div className="wrap">
          {editor ? <NewPostButton lang={lang} section={section} topic={active !== 'all' ? active : undefined} /> : null}
          {topics.length > 1 || section === 'chuyen-muc' ? (
            <div className="chip-row" data-topic-filters aria-label="Topics">
              <button type="button" className={`chip${active === 'all' ? ' is-active' : ''}`} data-topic="all">{lang === 'vi' ? 'Tất cả' : 'All'} ({posts.length})</button>
              {topics.map((tp) => (
                <button type="button" className={`chip${active === tp ? ' is-active' : ''}`} data-topic={tp} key={tp}>{TOPICS[tp]?.[lang] || tp} ({count(tp)})</button>
              ))}
            </div>
          ) : null}
          {posts.length ? (
            <div className="post-list" data-post-list>
              {posts.map((p) => {
                const hide = !visible.includes(p)
                const url = `/${lang}/${section}/${p.slug}`
                const img = mediaUrl(p.featuredImage as never)
                return (
                  <article className="post-card" data-topic={p.topic || ''} key={p.id} hidden={hide}>
                    {img ? <a href={url}><img src={img} alt={mediaAlt(p.featuredImage as never)} loading="lazy" style={{ width: '100%', height: 'auto', borderRadius: 6, marginBottom: '0.75rem' }} /></a> : null}
                    <p className="post-meta">
                      {p.topic ? <span className="pill pill-topic">{TOPICS[p.topic]?.[lang] || p.topic}</span> : null}
                      {p.publishedAt ? <time dateTime={p.publishedAt}> {p.publishedAt.slice(0, 10)}</time> : null}
                    </p>
                    <h3><a href={url}>{p.title}</a>{p.status !== 'published' ? <span className="badge-draft">{p.status === 'pending_review' ? 'Chờ duyệt' : 'Nháp'}</span> : null}</h3>
                    {p.excerpt ? <p>{p.excerpt}</p> : null}
                    <a className="text-link" href={url}>{t.read}</a>
                  </article>
                )
              })}
            </div>
          ) : null}
          <div className="empty-state" role="status" data-topic-empty hidden={visible.length > 0}>
            <p><strong>{active !== 'all' ? (lang === 'vi' ? 'Chưa có bài trong chủ đề này.' : 'No articles in this topic yet.') : t.empty}</strong></p>
          </div>
        </div>
      </section>
    </Shell>
  )
}
