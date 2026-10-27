import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/seo/JsonLd'
import { isLocale, type AppLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import { getPayloadClient } from '@/lib/payload'
import { breadcrumbJsonLd, hreflangAlternates } from '@/lib/seo/build'

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
      collection: 'practice-areas',
      locale,
      where: { slug: { equals: slug } },
      limit: 1,
    })
    const doc = res.docs[0]
    if (!doc) return { title: slug }
    return {
      title: doc.meta?.title || doc.title,
      description: doc.meta?.description || doc.summary || undefined,
      alternates: hreflangAlternates(`/services/${slug}`),
    }
  } catch {
    return { title: slug }
  }
}

export default async function ServiceDetailPage({
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
    summary?: string | null
    body?: unknown
  } | null = null

  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'practice-areas',
      locale,
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
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
          data={breadcrumbJsonLd([
            { name: dict.nav.home, path: `/${locale}` },
            { name: dict.services.title, path: `/${locale}/services` },
            { name: doc.title || slug, path: `/${locale}/services/${slug}` },
          ])}
        />
        <h1 className="section-title">{doc.title}</h1>
        {doc.summary ? <p className="section-lead">{doc.summary}</p> : null}
        <div className="prose-flf" style={{ marginTop: '2rem' }}>
          <p>
            {locale === 'vi'
              ? 'Thông tin mang tính giới thiệu. Nội dung tư vấn cụ thể phụ thuộc hồ sơ và được thực hiện qua quy trình phù hợp, có sự tham gia của đối tác hành nghề luật sư khi thuộc lĩnh vực đặc thù.'
              : 'This information is introductory. Specific advice depends on each matter and follows appropriate processes, involving partner law practices when specialized legal work is required.'}
          </p>
        </div>
      </div>
    </section>
  )
}
