import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { EditablePost } from '@/components/edit/EditKit'
import { PostView } from '@/components/PostView'
import { Shell } from '@/components/Shell'
import { asLang, getEditor, getPost, isSection } from '@/lib/site'

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
  const editor = await getEditor()
  const post = await getPost(slug, lang, !!editor)
  if (!post) notFound()
  return (
    <Shell lang={lang} path={`/${section}/${slug}`} adminHref={`/admin/collections/posts/${post.id}?locale=${lang}`}>
      {editor ? <EditablePost initial={post} lang={lang} section={section} role={(editor as { role?: string }).role || ''} /> : <PostView post={post} lang={lang} section={section} />}
    </Shell>
  )
}
