import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <div className="home">
      <div className="content">
        <p className="eyebrow">First Legal Force</p>
        <h1>FLF CMS — Dashboard bước 1</h1>
        <p>
          Khung quản trị Next.js + Payload + PostgreSQL. Site công khai vẫn dùng FLF-preview;
          giai đoạn này chỉ dựng admin, collections và phân quyền.
        </p>
        {user ? <p>Đã đăng nhập: {user.email}</p> : <p>Chưa đăng nhập.</p>}
        <div className="links">
          <a className="admin" href={payloadConfig.routes.admin}>
            Vào Admin
          </a>
        </div>
      </div>
    </div>
  )
}
