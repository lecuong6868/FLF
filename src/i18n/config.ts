export const locales = ['vi', 'en'] as const
export type AppLocale = (typeof locales)[number]
export const defaultLocale: AppLocale = 'vi'

export function isLocale(value: string): value is AppLocale {
  return (locales as readonly string[]).includes(value)
}
