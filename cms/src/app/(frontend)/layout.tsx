import type { Metadata } from 'next'
import React from 'react'
import './site.css'

const previewMode = process.env.PREVIEW_MODE === 'true'

export const metadata: Metadata = {
  title: { default: 'First Legal Force (FLF)', template: '%s — FLF' },
  description: 'First Legal Force — tư vấn doanh nghiệp đa lĩnh vực.',
  icons: { icon: '/brand/logo-color.png' },
  robots: previewMode
    ? { index: false, follow: false, nocache: true, noarchive: true }
    : { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
