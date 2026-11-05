import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

import config from '../payload.config'

const CATEGORIES = [
  {
    slug: 'tin-tuc',
    title: { vi: 'Tin tức', en: 'News' },
    description: { vi: 'Hoạt động, thông báo của FLF.', en: 'FLF activities and announcements.' },
  },
  {
    slug: 'quy-dinh-moi',
    title: { vi: 'Quy định mới', en: 'New regulations' },
    description: {
      vi: 'Chuyên mục quy định mới (theo cấu trúc FLF-preview). Nội dung pháp lý sẽ bổ sung sau khi đối chiếu nguồn chính thức.',
      en: 'New regulations section (from FLF-preview structure). Legal content will be added after official source verification.',
    },
  },
  {
    slug: 'chuyen-muc',
    title: { vi: 'Chuyên mục', en: 'Topics' },
    description: {
      vi: 'Chuyên mục bài viết theo chủ đề (theo cấu trúc FLF-preview).',
      en: 'Topic articles section (from FLF-preview structure).',
    },
  },
]

async function ensureUser(payload: Awaited<ReturnType<typeof getPayload>>, opts: {
  email: string
  password: string
  role: 'admin' | 'editor' | 'reviewer'
  name: string
  updatePassword?: boolean
}) {
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: opts.email } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs[0]) {
    const data: Record<string, unknown> = { role: opts.role, name: opts.name }
    if (opts.updatePassword) {
      data.password = opts.password
    }
    await payload.update({
      collection: 'users',
      id: existing.docs[0].id,
      data,
      overrideAccess: true,
    })
    console.log(
      `[seed] cập nhật user ${opts.email} (role=${opts.role}${opts.updatePassword ? ', password' : ''})`,
    )
    return existing.docs[0]
  }
  const created = await payload.create({
    collection: 'users',
    data: {
      email: opts.email,
      password: opts.password,
      role: opts.role,
      name: opts.name,
    },
    overrideAccess: true,
  })
  console.log(`[seed] tạo user ${opts.email} (role=${opts.role})`)
  return created
}

async function ensureCategory(
  payload: Awaited<ReturnType<typeof getPayload>>,
  item: (typeof CATEGORIES)[number],
) {
  const existing = await payload.find({
    collection: 'categories',
    where: { slug: { equals: item.slug } },
    limit: 1,
    overrideAccess: true,
    locale: 'vi',
  })
  if (existing.docs[0]) {
    console.log(`[seed] chuyên mục đã có: ${item.slug}`)
    return existing.docs[0]
  }
  const created = await payload.create({
    collection: 'categories',
    data: {
      slug: item.slug,
      title: item.title.vi,
      description: item.description.vi,
    },
    locale: 'vi',
    overrideAccess: true,
  })
  await payload.update({
    collection: 'categories',
    id: created.id,
    data: {
      title: item.title.en,
      description: item.description.en,
    },
    locale: 'en',
    overrideAccess: true,
  })
  console.log(`[seed] tạo chuyên mục: ${item.slug}`)
  return created
}

type PayloadT = Awaited<ReturnType<typeof getPayload>>

/** Đoạn văn → richText (Lexical) tối giản. */
function rich(paragraphs: string[]) {
  return {
    root: {
      type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
      children: paragraphs.map((text) => ({
        type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0,
        children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
      })),
    },
  }
}

const NAV = {
  vi: [['Giới thiệu', '/gioi-thieu'], ['Dịch vụ', '/dich-vu'], ['Tư vấn đặc biệt', '/#dac-biet'], ['Dự án', '/du-an'], ['VBPL', '/quy-dinh-moi'], ['Chuyên mục', '/chuyen-muc'], ['Liên hệ', '/#lien-he']],
  en: ['About', 'Services', 'Special advisory', 'Projects', 'New laws', 'Topics', 'Contact'],
}

/**
 * Nạp nội dung ban đầu cho web — CHỈ khi còn trống, không bao giờ ghi đè nội dung anh đã sửa trong CMS.
 */
async function seedSite(payload: PayloadT) {
  // Trang/bài tạo với quyền admin (hook chặn đăng nếu không rõ người đăng)
  const admin = (await payload.find({ collection: 'users', where: { role: { equals: 'admin' } }, limit: 1, overrideAccess: true })).docs[0]
  if (!admin) {
    console.log('[seed] chưa có admin — bỏ qua nạp trang/bài')
    return
  }
  const user = { ...admin, collection: 'users' } as never
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
  if (!settings?.companyLegalName) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        companyLegalName: 'CÔNG TY CỔ PHẦN GIẢI PHÁP LIÊN MINH LUẬT VIỆT NAM',
        companyTradeName: 'First Legal Force (FLF)',
        taxCode: '0314193708',
        registeredAddress: '01 Trần Khánh Dư, Phường Tân Định, TP. Hồ Chí Minh',
        facebookUrl: 'https://www.facebook.com/firstlegalforce',
        linkedinUrl: 'https://www.linkedin.com/company/firstlegalforce/home/',
      },
      overrideAccess: true,
    })
    console.log('[seed] thông tin công ty')
  }

  const nav = await payload.findGlobal({ slug: 'navigation', locale: 'vi', overrideAccess: true })
  const items = (nav?.items || []) as { href?: string }[]
  const oldDefault = !items.some((i) => i?.href === '/du-an') // menu cũ (trước bản thiết kế A) → thay 1 lần
  if (!items.length || oldDefault) {
    const saved = await payload.updateGlobal({
      slug: 'navigation', locale: 'vi', overrideAccess: true,
      data: { items: NAV.vi.map(([label, href]) => ({ label, href, openInNewTab: false })) },
    })
    await payload.updateGlobal({
      slug: 'navigation', locale: 'en', overrideAccess: true,
      data: { items: (saved.items || []).map((it, i) => ({ id: it.id, label: NAV.en[i], href: it.href, openInNewTab: false })) },
    })
    console.log('[seed] menu VI/EN')
  }

  const dir = path.dirname(fileURLToPath(import.meta.url))
  const pages = JSON.parse(fs.readFileSync(path.join(dir, 'seed-pages.json'), 'utf8')) as Record<string, { vi: unknown[]; en: unknown[] }>
  const titles: Record<string, { vi: string; en: string }> = {
    'trang-chu': { vi: 'Trang chủ', en: 'Home' },
    'gioi-thieu': { vi: 'Giới thiệu', en: 'About' },
    'dich-vu': { vi: 'Dịch vụ', en: 'Services' },
    'du-an': { vi: 'Dự án', en: 'Projects' },
  }
  const NEW_FIRST = ['heroAsk', 'pageHero'] // trang còn bố cục cũ (trước thiết kế A) → thay 1 lần, sau đó không đụng nữa
  for (const [slug, layout] of Object.entries(pages)) {
    const found = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, overrideAccess: true })
    const old = found.docs[0]
    if (old) {
      const first = ((old.layout || []) as { blockType?: string }[])[0]?.blockType
      if (first && NEW_FIRST.includes(first)) continue
      await payload.update({ collection: 'pages', id: old.id, locale: 'vi', overrideAccess: true, user, data: { layout: layout.vi as never } })
      await payload.update({ collection: 'pages', id: old.id, locale: 'en', overrideAccess: true, user, data: { layout: layout.en as never } })
      console.log(`[seed] trang ${slug}: thay bố cục cũ bằng thiết kế A`)
      continue
    }
    const doc = await payload.create({
      collection: 'pages', locale: 'vi', overrideAccess: true, user,
      data: { title: titles[slug]?.vi || slug, slug, status: 'published', layout: layout.vi as never },
    })
    await payload.update({
      collection: 'pages', id: doc.id, locale: 'en', overrideAccess: true, user,
      data: { title: titles[slug]?.en || slug, layout: layout.en as never },
    })
    console.log(`[seed] trang ${slug} (VI/EN)`)
  }

  const anyProject = await payload.find({ collection: 'projects', limit: 1, overrideAccess: true })
  if (!anyProject.totalDocs) {
    const ex = [
      ['blockchain', 'dau-tu', true], ['ai', 'tu-van', false], ['fintech', 'ho-tro', false],
      ['other', 'dau-tu', false], ['other', 'tu-van', false], ['other', 'ho-tro', false],
    ] as const
    for (const [i, [field, role, featured]] of ex.entries()) {
      const doc = await payload.create({
        collection: 'projects', locale: 'vi', overrideAccess: true, user,
        data: {
          name: `[Tên dự án ${i + 1}]`, field, role, featured, order: i + 1, status: 'published', url: 'https://example.com',
          fieldLabel: field === 'other' ? '[Lĩnh vực]' : undefined,
          summary: '[Một – hai câu giới thiệu dự án: giải quyết vấn đề gì, cho ai.]',
          stage: featured ? '[Seed / Series A]' : undefined, support: featured ? '[Cấu trúc pháp lý, gọi vốn]' : undefined,
        } as never,
      })
      await payload.update({
        collection: 'projects', id: doc.id, locale: 'en', overrideAccess: true, user,
        data: { fieldLabel: field === 'other' ? '[Field]' : undefined, summary: '[One or two sentences: what problem it solves, for whom.]' } as never,
      })
    }
    console.log('[seed] 6 dự án mẫu')
  }

  const anyPost = await payload.find({ collection: 'posts', limit: 1, overrideAccess: true })
  if (!anyPost.totalDocs) {
    const cats = await payload.find({ collection: 'categories', limit: 20, overrideAccess: true })
    const cat = (s: string) => cats.docs.find((c) => c.slug === s)?.id
    const samples = [
      {
        cat: 'tin-tuc', slug: 'thong-bao-website-moi', topic: undefined,
        vi: ['Thông báo: FLF đang hoàn thiện website mới', 'Bài mẫu trong mục Tin tức — anh/chị sửa hoặc xóa trong CMS.', ['Đây là bài viết mẫu để kiểm tra giao diện danh sách và trang chi tiết.', 'Vào CMS → Bài viết để sửa tiêu đề, nội dung, ảnh đại diện, hoặc đổi trạng thái.']],
        en: ['Notice: FLF is preparing its new website', 'Sample article in News — edit or delete it in the CMS.', ['This is a sample article used to check the list and detail layouts.', 'Go to CMS → Posts to edit the title, content, featured image or status.']],
      },
      {
        cat: 'chuyen-muc', slug: 'lam-ro-nhu-cau-truoc-khi-dau-tu', topic: 'dau-tu',
        vi: ['Làm rõ nhu cầu trước khi mở rộng đầu tư', 'Bài chuyên mục mẫu theo chủ đề Đầu tư.', ['Trước khi mở rộng đầu tư, doanh nghiệp thường cần làm rõ bài toán vận hành, phạm vi tư vấn và phần việc nào cần đối tác hành nghề luật sư.', 'Nội dung minh họa — không thay thế tư vấn chuyên môn.']],
        en: ['Clarify your needs before expanding investment', 'Sample Topics article on Investment.', ['Before expanding investment, a business usually needs to clarify its operating challenge, advisory scope, and which work needs a licensed law firm partner.', 'Illustrative content — not a substitute for professional advice.']],
      },
    ] as const
    for (const sp of samples) {
      const doc = await payload.create({
        collection: 'posts', locale: 'vi', overrideAccess: true, user,
        data: {
          title: sp.vi[0], slug: sp.slug, status: 'published', category: cat(sp.cat), topic: sp.topic,
          excerpt: sp.vi[1], content: rich([...sp.vi[2]]) as never, publishedAt: new Date().toISOString(),
        } as never,
      })
      await payload.update({
        collection: 'posts', id: doc.id, locale: 'en', overrideAccess: true, user,
        data: { title: sp.en[0], excerpt: sp.en[1], content: rich([...sp.en[2]]) as never } as never,
      })
    }
    console.log('[seed] 2 bài mẫu')
  }
}

async function main() {
  // Hỗ trợ DATABASE_URI (TASK) lẫn DATABASE_URL
  if (!process.env.DATABASE_URL && process.env.DATABASE_URI) {
    process.env.DATABASE_URL = process.env.DATABASE_URI
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL
  const adminPassword = process.env.SEED_ADMIN_PASSWORD
  if (!adminEmail || !adminPassword) {
    throw new Error('Thiếu SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD trong .env')
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('Thiếu DATABASE_URL hoặc DATABASE_URI')
  }
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('Thiếu PAYLOAD_SECRET')
  }

  const updatePassword = process.env.SEED_UPDATE_PASSWORD === 'true'
  const payload = await getPayload({ config })

  await ensureUser(payload, {
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
    name: 'FLF Admin',
    updatePassword,
  })

  const editorEmail = process.env.SEED_EDITOR_EMAIL
  const editorPassword = process.env.SEED_EDITOR_PASSWORD
  if (editorEmail && editorPassword) {
    await ensureUser(payload, {
      email: editorEmail,
      password: editorPassword,
      role: 'editor',
      name: 'FLF Editor',
      updatePassword,
    })
  }

  for (const cat of CATEGORIES) {
    await ensureCategory(payload, cat)
  }

  await seedSite(payload)

  console.log('[seed] xong')
  process.exit(0)
}

main().catch((err) => {
  console.error('[seed] lỗi', err)
  process.exit(1)
})
