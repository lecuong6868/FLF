import Link from 'next/link'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/seo/JsonLd'
import { isLocale, type AppLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import { getPayloadClient } from '@/lib/payload'
import { breadcrumbJsonLd, hreflangAlternates } from '@/lib/seo/build'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = (isLocale(raw) ? raw : 'vi') as AppLocale
  const dict = getDictionary(locale)
  return {
    title: dict.services.title,
    description: dict.services.lead,
    alternates: hreflangAlternates('/services'),
  }
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as AppLocale
  const dict = getDictionary(locale)

  let docs: { id: string | number; title?: string | null; slug?: string | null; summary?: string | null }[] =
    []
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'practice-areas',
      locale,
      sort: 'order',
      limit: 50,
      depth: 0,
    })
    docs = res.docs
  } catch {
    // empty
  }

  return (
    <section className="section">
      <div className="container-flf">
        <JsonLd
          data={breadcrumbJsonLd([
            { name: dict.nav.home, path: `/${locale}` },
            { name: dict.services.title, path: `/${locale}/services` },
          ])}
        />
        <h1 className="section-title">{dict.services.title}</h1>
        <p className="section-lead">{dict.services.lead}</p>
        <div className="grid-cards">
          {docs.map((area) => (
            <Link key={area.id} className="service-link" href={`/${locale}/services/${area.slug}`}>
              <h3>{area.title}</h3>
              <p>{area.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
