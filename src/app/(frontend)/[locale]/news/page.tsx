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
    title: dict.news.title,
    description: dict.news.lead,
    alternates: hreflangAlternates('/news'),
  }
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as AppLocale
  const dict = getDictionary(locale)

  let docs: {
    id: string | number
    title?: string | null
    slug?: string | null
    excerpt?: string | null
    publishedAt?: string | null
  }[] = []

  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'posts',
      locale,
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 20,
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
            { name: dict.news.title, path: `/${locale}/news` },
          ])}
        />
        <h1 className="section-title">{dict.news.title}</h1>
        <p className="section-lead">{dict.news.lead}</p>
        <div style={{ display: 'grid', gap: '1.25rem', marginTop: '2rem' }}>
          {docs.length ? (
            docs.map((post) => (
              <article key={post.id} className="service-link">
                <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem' }}>
                  <Link href={`/${locale}/news/${post.slug}`}>{post.title}</Link>
                </h2>
                {post.excerpt ? <p style={{ margin: 0 }}>{post.excerpt}</p> : null}
                <p style={{ marginTop: '0.75rem' }}>
                  <Link href={`/${locale}/news/${post.slug}`}>{dict.news.readMore}</Link>
                </p>
              </article>
            ))
          ) : (
            <p>{dict.news.empty}</p>
          )}
        </div>
      </div>
    </section>
  )
}
