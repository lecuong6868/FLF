import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/seo/JsonLd'
import { isLocale, type AppLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import { getPayloadClient } from '@/lib/payload'
import { articleJsonLd, breadcrumbJsonLd, hreflangAlternates } from '@/lib/seo/build'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  const locale = (isLocale(raw) ? raw : 'vi') as AppLocale
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'posts',
      locale,
      where: {
        and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
      },
      limit: 1,
    })
    const doc = res.docs[0]
    if (!doc) return { title: slug }
    return {
      title: doc.meta?.title || doc.title,
      description: doc.meta?.description || doc.excerpt || undefined,
      alternates: hreflangAlternates(`/news/${slug}`),
    }
  } catch {
    return { title: slug }
  }
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as AppLocale
  const dict = getDictionary(locale)

  let doc: {
    title?: string | null
    excerpt?: string | null
    publishedAt?: string | null
    updatedAt?: string
  } | null = null

  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'posts',
      locale,
      where: {
        and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
      },
      limit: 1,
    })
    doc = res.docs[0] || null
  } catch {
    doc = null
  }

  if (!doc) notFound()

  return (
    <section className="section">
      <div className="container-flf">
        <JsonLd
          data={[
            breadcrumbJsonLd([
              { name: dict.nav.home, path: `/${locale}` },
              { name: dict.news.title, path: `/${locale}/news` },
              { name: doc.title || slug, path: `/${locale}/news/${slug}` },
            ]),
            articleJsonLd({
              title: doc.title || slug,
              description: doc.excerpt,
              path: `/${locale}/news/${slug}`,
              datePublished: doc.publishedAt,
              dateModified: doc.updatedAt,
              locale,
            }),
          ]}
        />
        <h1 className="section-title">{doc.title}</h1>
        {doc.excerpt ? <p className="section-lead">{doc.excerpt}</p> : null}
        <div className="prose-flf" style={{ marginTop: '2rem' }}>
          <p>
            {locale === 'vi'
              ? 'Nội dung đầy đủ được quản lý bằng trình soạn thảo trong Dashboard. Mọi bài pháp lý chỉ công khai sau khi Admin xác nhận luật sư đối tác đã duyệt.'
              : 'Full content is managed in the Dashboard editor. Legal-topic posts go public only after Admin confirms partner-lawyer approval.'}
          </p>
        </div>
      </div>
    </section>
  )
}
