import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { type BlockData, Blocks } from '@/components/Blocks'
import { Shell } from '@/components/Shell'
import { EditablePage } from '@/components/edit/EditKit'
import { asLang, getEditor, getPage, getPosts, getProjects, getSettings } from '@/lib/site'

type P = { params: Promise<{ lang: string }> }

/** Trang dựng bằng khối (Trang chủ, Giới thiệu, Dịch vụ, Dự án): lấy dữ liệu + cho admin sửa ngay trên trang. */
export function cmsPage(slug: string, path: string, fallback: { vi: string; en: string }) {
  async function generateMetadata({ params }: P): Promise<Metadata> {
    const lang = asLang((await params).lang)
    if (!lang) return {}
    const page = await getPage(slug, lang)
    return { title: page?.seo?.title || fallback[lang], description: page?.seo?.description || undefined }
  }
  async function Page({ params }: P) {
    const lang = asLang((await params).lang)
    if (!lang) notFound()
    const editor = (await getEditor()) as { role?: string } | null
    const canEdit = !!editor && ['admin', 'reviewer'].includes(editor.role || '')
    const [page, projects, docs, articles, settings] = await Promise.all([
      getPage(slug, lang), getProjects(lang, !!editor), getPosts('quy-dinh-moi', lang, false, 5),
      getPosts('chuyen-muc', lang, false, 2), getSettings(lang).then((r) => r.settings),
    ])
    const data: BlockData = { projects, docs, articles, settings } as BlockData
    const isHome = slug === 'trang-chu'
    return (
      <Shell adminHref={page ? `/admin/collections/pages/${page.id}?locale=${lang}` : '/admin'} lang={lang} path={path}>
        {page ? (canEdit
          ? <EditablePage pageId={page.id} initial={(page.layout || []) as never} lang={lang} isHome={isHome} data={data} />
          : <Blocks blocks={page.layout as never} lang={lang} isHome={isHome} data={data} />)
          : <section className="page-hero"><div className="wrap"><h1>{fallback[lang]}</h1><p>{lang === 'vi' ? `Trang "${slug}" chưa được đăng trong CMS.` : 'Not published yet.'}</p></div></section>}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        {canEdit && slug === 'du-an' ? <p className="wrap" style={{ padding: '0 0 40px' }}><a className="btn btn-outline" href="/admin/collections/projects">{lang === 'vi' ? '⚙ Quản lý danh sách dự án (thêm / sửa / xóa)' : 'Manage projects'}</a></p> : null}
      </Shell>
    )
  }
  return { generateMetadata, Page }
}
