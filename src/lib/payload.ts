import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Config } from '@/payload-types'

export async function getPayloadClient() {
  return getPayload({ config: configPromise })
}

export type Locale = Config['locale']

export async function getCompanyInfo(locale: Locale = 'vi') {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'company-info', locale, depth: 1 })
}

export async function getSiteSettings(locale: Locale = 'vi') {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', locale, depth: 1 })
}

export async function getNavigation(locale: Locale = 'vi') {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'navigation', locale, depth: 1 })
}
