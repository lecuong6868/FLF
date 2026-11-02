import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { Shell } from '@/components/Shell'
import { asLang, getPosts, isSection, mediaAlt, mediaUrl, SECTIONS, T, TOPICS } from '@/lib/site'

export const dynamic = 'force-dynamic'

type P = { params: Promise<{ lang: string; section: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang, section } = await params
  const l = asLang(lang)
  return l && isSection(section) ? { title: SECTIONS[section][l] } : {}
}

export default async function SectionList({ params }: P) {
  const { lang: rawLang, section } = await params
  const lang = asLang(rawLang)
  if (!lang || !isSection(section)) notFound()
  const posts = await getPosts(section, lang)
  const t = T[lang]
  const topics = Array.from(new Set(posts.map((p) => p.topic).filter(Boolean))) as string[]
  return (
    <Shell lang={lang} path={`/${section}`}>
      <section className="page-hero">
        <div className="wrap">
          <h1>{SECTIONS[section][lang]}</h1>
          <p className="lead">{SECTIONS[section].lead[lang]}</p>
        </div>
      </section>
      <section className="content-section">
        <div className="wrap">
          {topics.length > 1 ? (
            <div className="chip-row" data-topic-filters aria-label="Topics">
              <button type="button" className="chip is-active" data-topic="all">{lang === 'vi' ? 'Tất cả' : 'All'}</button>
              {topics.map((tp) => (
                <button type="button" className="chip" data-topic={tp} key={tp}>{TOPICS[tp]?.[lang] || tp}</button>
              ))}
            </div>
          ) : null}
          {posts.length ? (
            <div className="post-list" data-post-list>
              {posts.map((p) => {
                const url = `/${lang}/${section}/${p.slug}`
                const img = mediaUrl(p.featuredImage as never)
                return (
                  <article className="post-card" data-topic={p.topic || ''} key={p.id}>
                    {img ? <a href={url}><img src={img} alt={mediaAlt(p.featuredImage as never)} loading="lazy" style={{ width: '100%', height: 'auto', borderRadius: 6, marginBottom: '0.75rem' }} /></a> : null}
                    <p className="post-meta">
                      {p.topic ? <span className="pill pill-topic">{TOPICS[p.topic]?.[lang] || p.topic}</span> : null}
                      {p.publishedAt ? <time dateTime={p.publishedAt}> {p.publishedAt.slice(0, 10)}</time> : null}
                    </p>
                    <h3><a href={url}>{p.title}</a></h3>
                    {p.excerpt ? <p>{p.excerpt}</p> : null}
                    <a className="text-link" href={url}>{t.read}</a>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="empty-state" role="status"><p><strong>{t.empty}</strong></p></div>
          )}
        </div>
      </section>
    </Shell>
  )
}
