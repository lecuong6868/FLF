import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { Shell } from '@/components/Shell'
import { asLang, getPost, isSection, mediaAlt, mediaUrl, SECTIONS, T, TOPICS } from '@/lib/site'

export const dynamic = 'force-dynamic'

type P = { params: Promise<{ lang: string; section: string; slug: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang, slug } = await params
  const l = asLang(lang)
  if (!l) return {}
  const post = await getPost(slug, l)
  return post ? { title: post.seo?.title || post.title, description: post.seo?.description || post.excerpt || undefined } : {}
}

export default async function PostPage({ params }: P) {
  const { lang: rawLang, section, slug } = await params
  const lang = asLang(rawLang)
  if (!lang || !isSection(section)) notFound()
  const post = await getPost(slug, lang)
  if (!post) notFound()
  const img = mediaUrl(post.featuredImage as never)
  return (
    <Shell lang={lang} path={`/${section}/${slug}`}>
      <article className="article-wrap">
        <p className="back-row"><a href={`/${lang}/${section}`}>{T[lang].back} {SECTIONS[section][lang]}</a></p>
        <p className="kicker">{SECTIONS[section][lang]}{post.topic ? ` · ${TOPICS[post.topic]?.[lang] || post.topic}` : ''}</p>
        <h1>{post.title}</h1>
        {post.publishedAt ? <p className="post-meta"><time dateTime={post.publishedAt}>{post.publishedAt.slice(0, 10)}</time></p> : null}
        {img ? <img src={img} alt={mediaAlt(post.featuredImage as never)} style={{ width: '100%', height: 'auto', borderRadius: 6, margin: '1rem 0' }} /> : null}
        {post.excerpt ? <p className="lead">{post.excerpt}</p> : null}
        {post.content ? <div className="article-body"><RichText data={post.content} /></div> : null}
      </article>
    </Shell>
  )
}
