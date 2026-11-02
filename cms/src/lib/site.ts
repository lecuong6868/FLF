import { getPayload } from 'payload'

import config from '@/payload.config'

export type Lang = 'vi' | 'en'
export const LANGS: Lang[] = ['vi', 'en']

export function asLang(v: string): Lang | null {
  return v === 'vi' || v === 'en' ? v : null
}

export async function cms() {
  return getPayload({ config: await config })
}

/** Mục web công khai ↔ chuyên mục (categories.slug) trong CMS. */
export const SECTIONS = {
  'tin-tuc': { vi: 'Tin tức', en: 'News', lead: {
    vi: 'Hoạt động, thông báo và cập nhật từ FLF.',
    en: 'Activities, announcements and updates from FLF.',
  } },
  'quy-dinh-moi': { vi: 'Quy định mới', en: 'New regulations', lead: {
    vi: 'Cập nhật văn bản / chính sách liên quan doanh nghiệp, chỉ đăng sau khi biên tập đối chiếu nguồn chính thức.',
    en: 'Updates on regulations and policies relevant to businesses, published only after editors verify official sources.',
  } },
  'chuyen-muc': { vi: 'Chuyên mục', en: 'Topics', lead: {
    vi: 'Bài phân tích theo chủ đề nhu cầu doanh nghiệp.',
    en: 'Analysis articles grouped by business topic.',
  } },
} as const
export type SectionKey = keyof typeof SECTIONS
export const isSection = (s: string): s is SectionKey => s in SECTIONS

export const TOPICS: Record<string, { vi: string; en: string }> = {
  'dau-tu': { vi: 'Đầu tư', en: 'Investment' },
  thue: { vi: 'Thuế', en: 'Tax' },
  'quan-tri-dn': { vi: 'Quản trị doanh nghiệp', en: 'Corporate governance' },
  'rui-ro': { vi: 'Quản trị rủi ro', en: 'Risk management' },
  'giay-phep': { vi: 'Giấy phép', en: 'Licensing' },
  'lao-dong': { vi: 'Lao động & nhân sự', en: 'Labour & HR' },
  'hop-dong': { vi: 'Hợp đồng & giao dịch', en: 'Contracts & transactions' },
  'tuan-thu': { vi: 'Tuân thủ & bảo vệ dữ liệu', en: 'Compliance & data protection' },
}

export const T = {
  vi: {
    skip: 'Bỏ qua đến nội dung chính', menu: 'Menu', open: 'Mở menu', close: 'Đóng menu', cta: 'Trao đổi nhu cầu',
    home: 'Trang chủ', connect: 'Kết nối', back: '← Quay lại danh sách', read: 'Đọc bài', empty: 'Chưa có bài viết nào được đăng.',
    name: 'Họ và tên', email: 'Email', message: 'Nhu cầu cần trao đổi', send: 'Gửi yêu cầu',
    formNote: 'Form đang ở chế độ xem thử — yêu cầu chưa được gửi đi. Vui lòng liên hệ qua email/điện thoại bên dưới.',
    preview: 'Bản thử website mới · nội dung lấy từ CMS', other: 'English version →', taxCode: 'MST',
  },
  en: {
    skip: 'Skip to main content', menu: 'Menu', open: 'Open menu', close: 'Close menu', cta: 'Discuss your needs',
    home: 'Home', connect: 'Connect', back: '← Back to list', read: 'Read article', empty: 'No articles published yet.',
    name: 'Full name', email: 'Email', message: 'What would you like to discuss?', send: 'Send request',
    formNote: 'This form is in preview mode — your request has not been sent. Please use the email/phone below.',
    preview: 'New website preview · content from the CMS', other: 'Tiếng Việt →', taxCode: 'Tax code',
  },
} as const

export const DEFAULT_NAV: Record<Lang, { label: string; href: string; openInNewTab?: boolean | null }[]> = {
  vi: [
    { label: 'Trang chủ', href: '/' },
    { label: 'Giới thiệu', href: '/gioi-thieu' },
    { label: 'Lĩnh vực', href: '/#services' },
    { label: 'Tin tức', href: '/tin-tuc' },
    { label: 'Quy định mới', href: '/quy-dinh-moi' },
    { label: 'Chuyên mục', href: '/chuyen-muc' },
    { label: 'Liên hệ', href: '/#contact' },
  ],
  en: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/gioi-thieu' },
    { label: 'Services', href: '/#services' },
    { label: 'News', href: '/tin-tuc' },
    { label: 'New regulations', href: '/quy-dinh-moi' },
    { label: 'Topics', href: '/chuyen-muc' },
    { label: 'Contact', href: '/#contact' },
  ],
}

/** Đường dẫn nội bộ → thêm /vi hoặc /en. Chấp nhận '/x', '/vi/x', '#x', 'https://…'. */
export function href(h: string | null | undefined, lang: Lang): string {
  if (!h) return '#'
  if (/^(https?:|mailto:|tel:)/.test(h)) return h
  if (h.startsWith('#')) return `/${lang}${h}`
  let p = h.replace(/^\/(vi|en)(?=\/|#|$)/, '')
  if (!p.startsWith('/')) p = '/' + p
  if (p === '/') return `/${lang}`
  if (p.startsWith('/#')) return `/${lang}${p.slice(1)}`
  return `/${lang}${p}`
}

type MediaLike = { url?: string | null; alt?: string | null } | number | string | null | undefined
export function mediaUrl(m: MediaLike): string | null {
  return m && typeof m === 'object' && m.url ? m.url : null
}
export function mediaAlt(m: MediaLike): string {
  return m && typeof m === 'object' && m.alt ? m.alt : ''
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

export async function getPosts(section: SectionKey, lang: Lang) {
  const p = await cms()
  const cat = await p.find({ collection: 'categories', where: { slug: { equals: section } }, limit: 1 })
  if (!cat.docs[0]) return []
  const r = await p.find({
    collection: 'posts',
    where: { category: { equals: cat.docs[0].id }, status: { equals: 'published' } },
    locale: lang, depth: 1, limit: 100, sort: '-publishedAt',
  })
  return r.docs
}

export async function getPost(slug: string, lang: Lang) {
  const p = await cms()
  const r = await p.find({ collection: 'posts', where: { slug: { equals: slug }, status: { equals: 'published' } }, locale: lang, depth: 2, limit: 1 })
  return r.docs[0] || null
}
