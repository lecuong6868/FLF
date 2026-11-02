import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { Blocks } from '@/components/Blocks'
import { Shell } from '@/components/Shell'
import { asLang, getPage } from '@/lib/site'
import { RichText } from '@payloadcms/richtext-lexical/react'

export const dynamic = 'force-dynamic'

type P = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const lang = asLang((await params).lang)
  if (!lang) return {}
  const page = await getPage('gioi-thieu', lang)
  return { title: page?.seo?.title || (lang === 'vi' ? 'Giới thiệu' : 'About'), description: page?.seo?.description || undefined }
}

export default async function About({ params }: P) {
  const lang = asLang((await params).lang)
  if (!lang) notFound()
  const page = await getPage('gioi-thieu', lang)
  return (
    <Shell lang={lang} path="/gioi-thieu">
      {page ? (
        <>
          <Blocks blocks={page.layout as never} lang={lang} isHome={false} />
          {page.content ? <section className="section about"><div className="wrap narrow article-body"><RichText data={page.content} /></div></section> : null}
        </>
      ) : (
        <section className="page-hero"><div className="wrap"><h1>First Legal Force</h1><p className="lead">{lang === 'vi' ? 'Trang Giới thiệu chưa được đăng trong CMS (Trang → slug "gioi-thieu", trạng thái Đã đăng).' : 'About page is not published in the CMS yet.'}</p></div></section>
      )}
    </Shell>
  )
}
