import type { AppLocale } from './config'
import { en } from './dictionaries/en'
import { vi, type Dictionary } from './dictionaries/vi'

const map: Record<AppLocale, Dictionary> = { vi, en }

export function getDictionary(locale: AppLocale): Dictionary {
  return map[locale] || vi
}
