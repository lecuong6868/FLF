import legacy from '../../data/legacy-redirects.json'

export type RedirectRule = {
  fromPath: string
  toPath: string
  permanent?: boolean
  note?: string
}

const staticMap = new Map<string, RedirectRule>(
  (legacy as RedirectRule[]).map((r) => [normalizePath(r.fromPath), { ...r, permanent: true }]),
)

export function normalizePath(pathname: string): string {
  if (!pathname) return '/'
  const noQuery = pathname.split('?')[0] || '/'
  if (noQuery.length > 1 && noQuery.endsWith('/')) {
    return noQuery.slice(0, -1)
  }
  return noQuery || '/'
}

export function findStaticRedirect(pathname: string): RedirectRule | null {
  return staticMap.get(normalizePath(pathname)) || null
}

export function listStaticRedirects(): RedirectRule[] {
  return Array.from(staticMap.values())
}
