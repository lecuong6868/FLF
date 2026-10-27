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
    title: dict.partners.title,
    description: dict.partners.lead,
    alternates: hreflangAlternates('/partners'),
  }
}

export default async function PartnersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as AppLocale
  const dict = getDictionary(locale)

  let docs: {
    id: string | number
    name?: string | null
    description?: string | null
    website?: string | null
    specialties?: string[] | null
  }[] = []

  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'legal-partners',
      locale,
      where: { published: { equals: true } },
      sort: 'order',
      limit: 50,
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
            { name: dict.partners.title, path: `/${locale}/partners` },
          ])}
        />
        <h1 className="section-title">{dict.partners.title}</h1>
        <p className="section-lead">{dict.partners.lead}</p>
        <div className="grid-cards">
          {docs.length ? (
            docs.map((p) => (
              <article key={p.id} className="service-link">
                <h3>{p.name}</h3>
                {p.description ? <p>{p.description}</p> : null}
                {p.specialties?.length ? (
                  <p style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
                    {p.specialties.join(' · ')}
                  </p>
                ) : null}
                {p.website ? (
                  <p style={{ marginTop: '0.75rem' }}>
                    <a href={p.website} rel="noopener noreferrer" target="_blank">
                      Website
                    </a>
                  </p>
                ) : null}
              </article>
            ))
          ) : (
            <p className="section-lead">
              {locale === 'vi'
                ? 'Danh sách đối tác sẽ được cập nhật trên Dashboard (không bịa tên công ty luật).'
                : 'Partner listings will be maintained in the Dashboard (no fabricated law firm names).'}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
