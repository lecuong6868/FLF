import type { GlobalConfig } from 'payload'

import { admins, anyone } from '@/access/roles'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: { vi: 'Cài đặt website', en: 'Site settings' },
  access: {
    read: anyone,
    update: admins,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'First Legal Force',
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      label: { vi: 'Khẩu hiệu', en: 'Tagline' },
    },
    {
      name: 'homeIntro',
      type: 'textarea',
      localized: true,
      label: { vi: 'Đoạn giới thiệu trang chủ', en: 'Home intro' },
    },
    {
      name: 'aboutContent',
      type: 'richText',
      localized: true,
      label: { vi: 'Nội dung Giới thiệu', en: 'About content' },
    },
    {
      name: 'privacyPolicy',
      type: 'richText',
      localized: true,
      label: { vi: 'Chính sách bảo mật', en: 'Privacy policy' },
    },
    {
      name: 'defaultOgImage',
      type: 'upload',
      relationTo: 'media',
      label: 'OG Image mặc định',
    },
    {
      name: 'googleSiteVerification',
      type: 'text',
      label: 'Google Search Console verification',
    },
  ],
}
