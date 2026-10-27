import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { defaultLocale, isLocale, locales } from '@/i18n/config'
import { findStaticRedirect, normalizePath } from '@/lib/redirects'

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
}

function withSecurity(res: NextResponse): NextResponse {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(k, v)
  }
  return res
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const normalized = normalizePath(pathname)

  // Legacy SPA redirects (301)
  const legacy = findStaticRedirect(normalized)
  if (legacy) {
    const url = request.nextUrl.clone()
    url.pathname = legacy.toPath
    return withSecurity(NextResponse.redirect(url, legacy.permanent === false ? 302 : 301))
  }

  // Skip admin/api/static
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/brand') ||
    pathname.includes('.')
  ) {
    return withSecurity(NextResponse.next())
  }

  const first = pathname.split('/').filter(Boolean)[0]
  if (!first || !isLocale(first)) {
    const url = request.nextUrl.clone()
    url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
    return withSecurity(NextResponse.redirect(url))
  }

  // Ensure unknown locale codes redirect to default
  if (first && !locales.includes(first as (typeof locales)[number]) && pathname.startsWith(`/${first}`)) {
    const url = request.nextUrl.clone()
    url.pathname = `/${defaultLocale}`
    return withSecurity(NextResponse.redirect(url))
  }

  return withSecurity(NextResponse.next())
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
