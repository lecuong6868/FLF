import { getPayload } from 'payload'

import config from '@/payload.config'

import { DEFAULT_NAV, type Lang, type SectionKey } from './shared'

export * from './shared'

export async function cms() {
  return getPayload({ config: await config })
}

export async function getSettings(lang: Lang) {
  const p = await cms()
  const [settings, nav] = await Promise.all([
    p.findGlobal({ slug: 'site-settings', locale: lang, depth: 1 }),
    p.findGlobal({ slug: 'navigation', locale: lang }),
  ])
  const items = (nav?.items || []).filter((i) => i?.label && i?.href) as { label: string; href: string; openInNewTab?: boolean | null }[]
  return { settings, nav: items.length >= 3 ? items : DEFAULT_NAV[lang] }
}

export async function getPage(slug: string, lang: Lang) {
  const p = await cms()
  const r = await p.find({ collection: 'pages', where: { slug: { equals: slug }, status: { equals: 'published' } }, locale: lang, depth: 2, limit: 1 })
  return r.docs[0] || null
}

export async function getPosts(section: SectionKey, lang: Lang, drafts = false) {
  const p = await cms()
  const cat = await p.find({ collection: 'categories', where: { slug: { equals: section } }, limit: 1 })
  if (!cat.docs[0]) return []
  const r = await p.find({
    collection: 'posts',
    where: drafts ? { category: { equals: cat.docs[0].id } } : { category: { equals: cat.docs[0].id }, status: { equals: 'published' } },
    locale: lang, depth: 1, limit: 100, sort: '-publishedAt',
  })
  return r.docs
}

export async function getPost(slug: string, lang: Lang, drafts = false) {
  const p = await cms()
  const r = await p.find({ collection: 'posts', where: drafts ? { slug: { equals: slug } } : { slug: { equals: slug }, status: { equals: 'published' } }, locale: lang, depth: 2, limit: 1 })
  return r.docs[0] || null
}

export async function getTheme() {
  const p = await cms()
  return p.findGlobal({ slug: 'theme' })
}

/** Người đang xem có phải nhân viên CMS đã đăng nhập không (để hiện nút Sửa). */
export async function getEditor() {
  const { headers } = await import('next/headers')
  const p = await cms()
  try {
    const { user } = await p.auth({ headers: await headers() })
    return user && ['admin', 'editor', 'reviewer'].includes((user as { role?: string }).role || '') ? user : null
  } catch {
    return null
  }
}
