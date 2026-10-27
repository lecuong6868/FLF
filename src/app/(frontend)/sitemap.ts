import type { MetadataRoute } from 'next'

import { locales } from '@/i18n/config'
import { absoluteUrl } from '@/lib/seo/build'

const staticPaths = ['', '/about', '/services', '/partners', '/news', '/contact', '/privacy']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: absoluteUrl(`/${locale}${path}`),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.7,
      })
    }
  }

  try {
    const { getPayloadClient } = await import('@/lib/payload')
    const payload = await getPayloadClient()
    const [areas, posts] = await Promise.all([
      payload.find({ collection: 'practice-areas', limit: 100, depth: 0 }),
      payload.find({
        collection: 'posts',
        where: { status: { equals: 'published' } },
        limit: 200,
        depth: 0,
      }),
    ])

    for (const locale of locales) {
      for (const area of areas.docs) {
        if (!area.slug) continue
        entries.push({
          url: absoluteUrl(`/${locale}/services/${area.slug}`),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
      for (const post of posts.docs) {
        if (!post.slug) continue
        entries.push({
          url: absoluteUrl(`/${locale}/news/${post.slug}`),
          lastModified: post.publishedAt || post.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      }
    }
  } catch {
    // DB offline during build — static entries vẫn đủ
  }

  return entries
}
