import type { CollectionConfig } from 'payload'

import { admins } from '@/access/roles'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: {
    singular: { vi: 'Liên hệ', en: 'Contact submission' },
    plural: { vi: 'Liên hệ', en: 'Contact submissions' },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'createdAt', 'consentNd13'],
    group: { vi: 'Biểu mẫu', en: 'Forms' },
  },
  access: {
    create: () => true,
    delete: admins,
    read: admins,
    update: admins,
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: { vi: 'Họ tên', en: 'Name' } },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', label: { vi: 'Điện thoại', en: 'Phone' } },
    { name: 'subject', type: 'text', label: { vi: 'Chủ đề', en: 'Subject' } },
    { name: 'message', type: 'textarea', required: true, label: { vi: 'Nội dung', en: 'Message' } },
    {
      name: 'consentNd13',
      type: 'checkbox',
      required: true,
      label: {
        vi: 'Đồng ý xử lý dữ liệu cá nhân (NĐ 13/2023)',
        en: 'Consent to personal data processing (Decree 13/2023)',
      },
    },
    {
      name: 'locale',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'ipHash',
      type: 'text',
      admin: { readOnly: true, position: 'sidebar' },
    },
  ],
}
