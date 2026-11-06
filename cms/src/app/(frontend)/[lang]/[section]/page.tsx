import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { DocRow } from '@/components/Blocks'
import { Filters } from '@/components/Filters'
import { Shell } from '@/components/Shell'
import { NewPostButton } from '@/components/edit/EditKit'
import { asLang, DOC_FIELDS, DOC_STATUS, getEditor, getPosts, isSection, mediaUrl, SECTIONS, T, TOPICS } from '@/lib/site'

export const dynamic = 'force-dynamic'

type P = { params: Promise<{ lang: string; section: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang, section } = await params
  const l = asLang(lang)
  return l && isSection(section) ? { title: SECTIONS[section][l] } : {}
}

const opts = (m: Record<string, { vi: string; en: string }>, lang: 'vi' | 'en') => Object.entries(m).map(([value, l]) => ({ value, label: l[lang] }))
const fmt = (d?: string | null) => (d ? d.slice(0, 10).split('-').reverse().join('/') : '')

export default async function SectionList({ params }: P) {
  const { lang: rawLang, section } = await params
  const lang = asLang(rawLang)
  if (!lang || !isSection(section)) notFound()
  const editor = await getEditor()
  const posts = await getPosts(section, lang, !!editor)
  const t = T[lang]
  const vi = lang === 'vi'
  const isDocs = section === 'quy-dinh-moi'
  return (
    <Shell lang={lang} path={`/${section}`} adminHref="/admin/collections/posts">
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow on-dark">{isDocs ? 'VBPL' : SECTIONS[section][lang]}</p>
          <h1>{SECTIONS[section][lang]}</h1>
          <p className="lead">{SECTIONS[section].lead[lang]}</p>
          {editor ? <div style={{ marginTop: 24 }}><NewPostButton lang={lang} section={section} /></div> : null}
        </div>
      </section>
      {isDocs ? (
        <Filters a={opts(DOC_STATUS, lang)} b={opts(DOC_FIELDS, lang)} labelA={vi ? 'Tình trạng' : 'Status'} labelB={vi ? 'Lĩnh vực' : 'Field'}
          allA={vi ? 'Tất cả' : 'All'} allB={vi ? 'Mọi lĩnh vực' : 'All fields'} search={vi ? 'Tìm số hiệu, tên văn bản…' : 'Search number or title…'} empty={t.noDocs}>
          <section className="sec"><div className="wrap layout" style={{ gap: 48 }}>
            <div className="main-col doc-list">{posts.map((d) => <DocRow key={d.id} d={d as never} lang={lang} />)}</div>
            <aside style={{ flex: '1 1 300px', display: 'grid', gap: 24, alignContent: 'start' }}>
              <div className="side-card side-dark">
                <h2>{vi ? 'Văn bản này ảnh hưởng đến doanh nghiệp bạn?' : 'Does this affect your business?'}</h2>
                <p>{vi ? 'Gửi câu hỏi — chuyên viên FLF phản hồi việc cần làm và thời hạn.' : 'Ask us — an FLF consultant will reply with what to do and by when.'}</p>
                <a className="btn" href={`/${lang}#lien-he`}>{t.cta}</a>
              </div>
              <div className="side-card">
                <h2>{vi ? 'Cách chúng tôi cập nhật' : 'How we update'}</h2>
                <p>{vi ? 'Trợ lý AI theo dõi nguồn chính thức và tóm tắt; chuyên viên FLF kiểm tra trước khi đăng.' : 'An AI assistant tracks official sources and summarises; an FLF consultant reviews before publishing.'}</p>
              </div>
            </aside>
          </div></section>
        </Filters>
      ) : (
        <Filters a={opts(TOPICS, lang)} b={[]} labelA={vi ? 'Chủ đề' : 'Topic'} labelB="" allA={vi ? 'Tất cả' : 'All'} allB=""
          search={vi ? 'Tìm bài viết…' : 'Search articles…'} empty={t.empty}>
          <section className="sec"><div className="wrap grid">
            {posts.map((p, i) => {
              const url = `/${lang}/${section}/${p.slug}`
              const img = mediaUrl(p.featuredImage as never)
              return (
                <article className={`art-card${i === 0 ? ' big' : ''}`} data-a={p.topic || ''} data-search={`${p.title} ${p.excerpt || ''}`.toLowerCase()} key={p.id}>
                  <a className="art-img" href={url} style={img ? { backgroundImage: `url(${img})` } : undefined} aria-hidden="true" tabIndex={-1} />
                  <div className="art-body">
                    <p className="mini-kicker">{p.topic ? TOPICS[p.topic]?.[lang] : SECTIONS[section][lang]}{p.publishedAt ? ` · ${fmt(p.publishedAt)}` : ''}</p>
                    <h3><a href={url}>{p.title}</a>{p.status !== 'published' ? <span className="draft-badge">{p.status === 'pending_review' ? 'Chờ duyệt' : 'Nháp'}</span> : null}</h3>
                    {p.excerpt ? <p>{p.excerpt}</p> : null}
                    <a className="link-arrow" href={url}>{t.read} →</a>
                  </div>
                </article>
              )
            })}
          </div></section>
        </Filters>
      )}
    </Shell>
  )
}
