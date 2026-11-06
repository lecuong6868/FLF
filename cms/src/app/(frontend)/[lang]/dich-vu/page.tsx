import { cmsPage } from '@/components/CmsPage'

export const dynamic = 'force-dynamic'
const p = cmsPage('dich-vu', '/dich-vu', { vi: 'Dịch vụ', en: 'Services' })
export const generateMetadata = p.generateMetadata
export default p.Page
