/** Phần dùng chung server + trình duyệt (không import payload ở đây). */

export type Lang = 'vi' | 'en'
export const LANGS: Lang[] = ['vi', 'en']

export function asLang(v: string): Lang | null {
  return v === 'vi' || v === 'en' ? v : null
}

/** Mục web công khai ↔ chuyên mục (categories.slug) trong CMS. */
export const SECTIONS = {
  'tin-tuc': { vi: 'Tin tức', en: 'News', lead: {
    vi: 'Hoạt động, thông báo và cập nhật từ FLF.',
    en: 'Activities, announcements and updates from FLF.',
  } },
  'quy-dinh-moi': { vi: 'Văn bản pháp luật mới', en: 'New legal documents', lead: {
    vi: 'Tóm tắt văn bản mới ảnh hưởng tới doanh nghiệp, cập nhật hằng ngày từ nguồn chính thức. Mỗi bài đều dẫn link văn bản gốc.',
    en: 'Summaries of new legal documents affecting businesses, updated daily from official sources, each linking to the original.',
  } },
  'chuyen-muc': { vi: 'Chuyên mục', en: 'Insights', lead: {
    vi: 'Bài phân tích, hỏi đáp và hướng dẫn thực tế theo chủ đề doanh nghiệp quan tâm.',
    en: 'Analysis, Q&A and practical guides on topics businesses care about.',
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
  'm-a': { vi: 'M&A', en: 'M&A' },
  startup: { vi: 'Startup', en: 'Startups' },
  blockchain: { vi: 'Blockchain', en: 'Blockchain' },
  ai: { vi: 'Trí tuệ nhân tạo', en: 'Artificial intelligence' },
}

/** Văn bản pháp luật: tình trạng hiệu lực + lĩnh vực. */
export const DOC_STATUS: Record<string, { vi: string; en: string; tone: 'red' | 'navy' | 'sand' }> = {
  'sap-hieu-luc': { vi: 'Sắp hiệu lực', en: 'Coming into force', tone: 'red' },
  'da-hieu-luc': { vi: 'Đã hiệu lực', en: 'In force', tone: 'navy' },
  'du-thao': { vi: 'Dự thảo', en: 'Draft', tone: 'sand' },
}
export const DOC_FIELDS: Record<string, { vi: string; en: string }> = {
  'doanh-nghiep': { vi: 'Doanh nghiệp', en: 'Corporate' },
  'dau-tu': { vi: 'Đầu tư', en: 'Investment' },
  thue: { vi: 'Thuế', en: 'Tax' },
  'lao-dong': { vi: 'Lao động', en: 'Labour' },
  'dat-dai': { vi: 'Đất đai', en: 'Land' },
  'cong-nghe': { vi: 'Công nghệ', en: 'Technology' },
}
export const PROJECT_FIELDS: Record<string, { vi: string; en: string }> = {
  blockchain: { vi: 'Blockchain', en: 'Blockchain' },
  ai: { vi: 'Trí tuệ nhân tạo', en: 'Artificial intelligence' },
  fintech: { vi: 'Fintech', en: 'Fintech' },
  ecommerce: { vi: 'Thương mại điện tử', en: 'E-commerce' },
  'real-estate': { vi: 'Bất động sản', en: 'Real estate' },
  other: { vi: 'Khác', en: 'Other' },
}
export const PROJECT_ROLES: Record<string, { vi: string; en: string }> = {
  'dau-tu': { vi: 'FLF đầu tư', en: 'FLF invested' },
  'ho-tro': { vi: 'FLF hỗ trợ', en: 'FLF supported' },
  'tu-van': { vi: 'FLF tư vấn', en: 'FLF advised' },
}

export const T = {
  vi: {
    skip: 'Bỏ qua đến nội dung chính', menu: 'Menu', open: 'Mở menu', close: 'Đóng menu', cta: 'Đặt lịch tư vấn',
    home: 'Trang chủ', connect: 'Kết nối', back: '← Quay lại danh sách', read: 'Đọc bài', empty: 'Chưa có bài viết nào được đăng.',
    name: 'Họ và tên', email: 'Email', message: 'Nhu cầu cần trao đổi', send: 'Gửi yêu cầu',
    formNote: 'Form đang ở chế độ xem thử — yêu cầu chưa được gửi đi. Vui lòng liên hệ qua email/điện thoại bên dưới.',
    preview: 'Bản thử website mới · nội dung lấy từ CMS', other: 'English version →', taxCode: 'MST',
    explore: 'Khám phá', contact: 'Liên hệ', ask: 'Hỏi trợ lý FLF', all: 'Tất cả', more: 'Xem thêm',
    disclaimer: 'Thông tin trên website mang tính tham khảo, không thay thế ý kiến tư vấn chính thức.',
    detail: 'Xem chi tiết', seeAll: 'Xem tất cả →', role: 'Vai trò', field: 'Lĩnh vực', allFields: 'Mọi lĩnh vực',
    projectDetail: 'Xem chi tiết dự án', stage: 'Giai đoạn', support: 'FLF đồng hành', featured: 'Dự án nổi bật',
    search: 'Tìm theo tên, số hiệu văn bản…', soon: 'Hiệu lực trong 30 ngày tới', soonLead: 'Những văn bản doanh nghiệp cần chuẩn bị ngay.',
    effect: 'Hiệu lực', issued: 'Ban hành', source: 'Văn bản gốc', basis: 'Căn cứ', noDocs: 'Chưa có văn bản phù hợp.',
    keyPoint: 'Điểm then chốt', related: 'Bài viết liên quan', articleNote: 'Bài viết mang tính tham khảo, không thay thế ý kiến tư vấn cho trường hợp cụ thể.',
    situation: 'Bạn đang gặp tình huống này?', situationLead: 'FLF rà soát và đề xuất phương án cụ thể.', talk: 'Trao đổi với FLF',
    whatWeDo: 'FLF làm gì', youGet: 'Bạn nhận được', commonCase: 'Doanh nghiệp thường gặp',
  },
  en: {
    skip: 'Skip to main content', menu: 'Menu', open: 'Open menu', close: 'Close menu', cta: 'Book a consultation',
    home: 'Home', connect: 'Connect', back: '← Back to list', read: 'Read article', empty: 'No articles published yet.',
    name: 'Full name', email: 'Email', message: 'What would you like to discuss?', send: 'Send request',
    formNote: 'This form is in preview mode — your request has not been sent. Please use the email/phone below.',
    preview: 'New website preview · content from the CMS', other: 'Tiếng Việt →', taxCode: 'Tax code',
    explore: 'Explore', contact: 'Contact', ask: 'Ask FLF assistant', all: 'All', more: 'Load more',
    disclaimer: 'Information on this website is for reference only and does not replace formal advice.',
    detail: 'Learn more', seeAll: 'See all →', role: 'Role', field: 'Sector', allFields: 'All sectors',
    projectDetail: 'View project', stage: 'Stage', support: 'FLF support', featured: 'Featured project',
    search: 'Search by title or document number…', soon: 'In force within 30 days', soonLead: 'Documents businesses should prepare for now.',
    effect: 'Effective', issued: 'Issued', source: 'Original document', basis: 'Basis', noDocs: 'No matching documents yet.',
    keyPoint: 'Key point', related: 'Related articles', articleNote: 'This article is for reference only and does not replace advice on a specific case.',
    situation: 'Facing this situation?', situationLead: 'FLF reviews it and proposes a concrete plan.', talk: 'Talk to FLF',
    whatWeDo: 'What FLF does', youGet: 'What you get', commonCase: 'Typical situations',
  },
} as const

export const DEFAULT_NAV: Record<Lang, { label: string; href: string; openInNewTab?: boolean | null }[]> = {
  vi: [
    { label: 'Giới thiệu', href: '/gioi-thieu' },
    { label: 'Dịch vụ', href: '/dich-vu' },
    { label: 'Tư vấn đặc biệt', href: '/#dac-biet' },
    { label: 'Dự án', href: '/du-an' },
    { label: 'VBPL', href: '/quy-dinh-moi' },
    { label: 'Chuyên mục', href: '/chuyen-muc' },
    { label: 'Liên hệ', href: '/#lien-he' },
  ],
  en: [
    { label: 'About', href: '/gioi-thieu' },
    { label: 'Services', href: '/dich-vu' },
    { label: 'Special advisory', href: '/#dac-biet' },
    { label: 'Projects', href: '/du-an' },
    { label: 'Legal updates', href: '/quy-dinh-moi' },
    { label: 'Insights', href: '/chuyen-muc' },
    { label: 'Contact', href: '/#lien-he' },
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


/** Màu sắc toàn web (global Theme) → CSS. Chỉ nhận mã màu hợp lệ. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function themeCss(t: any): string {
  if (!t) return ''
  const v: string[] = []
  const map: Record<string, string> = { navy: '--navy', navyDeep: '--navy-deep', red: '--red', ink: '--ink', muted: '--muted', paper: '--paper' }
  const ok = (c: unknown) => typeof c === 'string' && /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\))$/i.test(c.trim())
  for (const [k, css] of Object.entries(map)) if (ok(t[k])) v.push(`${css}:${t[k].trim()}`)
  if (t.headingFont === 'sans') v.push('--display:var(--font)')
  const r = { none: '0px', small: '4px', large: '14px' }[t.radius as string]
  let out = v.length ? `:root{${v.join(';')}}` : ''
  if (r) out += `.btn,.ce-site .post-card,.point,.service-item,.why-item,.contact-form input,.contact-form textarea,.chip{border-radius:${r}}`
  return out
}

