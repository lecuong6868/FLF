import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../payload.config'

const CATEGORIES = [
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

  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      items: [
        { label: 'Trang chủ', href: '/vi' },
        { label: 'Chuyên mục', href: '/vi/chuyen-muc' },
        { label: 'Quy định mới', href: '/vi/quy-dinh-moi' },
      ],
    },
    locale: 'vi',
    overrideAccess: true,
  })

  console.log('[seed] xong')
  process.exit(0)
}

main().catch((err) => {
  console.error('[seed] lỗi', err)
  process.exit(1)
})
