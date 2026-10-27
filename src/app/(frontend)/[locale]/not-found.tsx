import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-crimson">404</p>
      <h1 className="mt-3 font-display text-4xl text-navy">Không tìm thấy trang</h1>
      <p className="mt-3 text-ink/70">Page not found.</p>
      <Link href="/vi" className="mt-8 inline-block text-crimson">
        ← First Legal Force
      </Link>
    </div>
  )
}
