import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { DOC_FIELDS, DOC_STATUS, type Lang, mediaAlt, mediaUrl, SECTIONS, type SectionKey, T, TOPICS } from '@/lib/shared'

/* eslint-disable @typescript-eslint/no-explicit-any */
/** Trang chi tiết bài viết — 4 kiểu bố cục chọn trong CMS. */
export function PostView({ post, lang, section }: { post: any; lang: Lang; section: SectionKey }) {
  const img = mediaUrl(post.featuredImage)
  const alt = mediaAlt(post.featuredImage)
  const style = post.layoutStyle || 'standard'
  const kicker = `${SECTIONS[section][lang]}${post.topic ? ` · ${TOPICS[post.topic]?.[lang] || post.topic}` : ''}`
  const date = post.publishedAt ? <p className="post-meta"><time dateTime={post.publishedAt}>{String(post.publishedAt).slice(0, 10)}</time></p> : null
  const back = <p className="back-row"><a href={`/${lang}/${section}`}>{T[lang].back} {SECTIONS[section][lang]}</a></p>
  const t = T[lang]
  const vi = lang === 'vi'
  const d = (x?: string) => (x ? String(x).slice(0, 10).split('-').reverse().join('/') : '')
  const st = DOC_STATUS[post.docStatus]
  const docBox = section === 'quy-dinh-moi' && (post.docNumber || st || post.effectiveAt || post.sourceUrl) ? (
    <div className="doc-box">
      {st ? <span className={`st st-${st.tone}`}>{st[lang]}</span> : null}
      {post.docNumber ? <div><strong>{vi ? 'Số hiệu' : 'Number'}:</strong> {post.docNumber}</div> : null}
      {DOC_FIELDS[post.docField] ? <div><strong>{vi ? 'Lĩnh vực' : 'Field'}:</strong> {DOC_FIELDS[post.docField][lang]}</div> : null}
      {post.issuedAt ? <div><strong>{t.issued}:</strong> {d(post.issuedAt)}</div> : null}
      {post.effectiveAt ? <div><strong>{t.effect}:</strong> {d(post.effectiveAt)}</div> : null}
      {post.sourceUrl ? <div><a href={post.sourceUrl} target="_blank" rel="noopener noreferrer">{t.source} ↗</a></div> : null}
    </div>
  ) : null
  const body = (
    <>
      {post.excerpt ? <p className="lead">{post.excerpt}</p> : null}
      {docBox}
      {post.content ? <div className="article-body"><RichText data={post.content} /></div> : null}
      <aside className="article-cta">
        <div><h2>{vi ? 'Cần áp dụng vào doanh nghiệp của bạn?' : 'Need to apply this to your business?'}</h2><p>{vi ? 'Chuyên viên FLF phản hồi việc cần làm, thời gian và chi phí.' : 'An FLF consultant will reply with what to do, timing and cost.'}</p></div>
        <a className="btn" href={`/${lang}#lien-he`}>{t.cta}</a>
      </aside>
    </>
  )

  if (style === 'cover') {
    return (
      <article>
        <header className="post-cover" style={img ? { backgroundImage: `linear-gradient(rgba(0,21,36,.55),rgba(0,21,36,.85)), url(${img})` } : undefined}>
          <div className="article-wrap">
            {back}
            <p className="kicker">{kicker}</p>
            <h1>{post.title}</h1>
            {date}
          </div>
        </header>
        <div className="article-wrap">{body}</div>
      </article>
    )
  }
  if (style === 'image-left') {
    return (
      <article className="article-wrap article-wide">
        {back}
        <div className="post-split">
          <div>{img ? <img src={img} alt={alt} className="post-img" /> : null}</div>
          <div>
            <p className="kicker">{kicker}</p>
            <h1>{post.title}</h1>
            {date}
            {body}
          </div>
        </div>
      </article>
    )
  }
  return (
    <article className={`article-wrap${style === 'wide' ? ' article-wide' : ''}`}>
      {back}
      <p className="kicker">{kicker}</p>
      <h1>{post.title}</h1>
      {date}
      {img ? <img src={img} alt={alt} className="post-img" /> : null}
      {body}
    </article>
  )
}
