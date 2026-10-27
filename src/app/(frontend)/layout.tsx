import { Be_Vietnam_Pro, Source_Serif_4 } from 'next/font/google'
import React from 'react'

import './styles.css'

const sans = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const display = Source_Serif_4({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

/**
 * Root layout cho nhóm frontend (song song với layout Payload admin).
 */
export default function FrontendGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${sans.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  )
}
