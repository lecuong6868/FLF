import type { Metadata } from 'next'
import React from 'react'
import './styles.css'

const previewMode = process.env.PREVIEW_MODE === 'true'

export const metadata: Metadata = {
  title: previewMode ? 'FLF CMS (bản thử — noindex)' : 'FLF CMS',
  description: 'Dashboard quản trị First Legal Force (Payload CMS).',
  robots: previewMode
    ? { index: false, follow: false, nocache: true, noarchive: true }
    : { index: true, follow: true },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="vi">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
