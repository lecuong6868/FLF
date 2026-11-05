import { cmsPage } from '@/components/CmsPage'

export const dynamic = 'force-dynamic'
const p = cmsPage('gioi-thieu', '/gioi-thieu', { vi: 'Giới thiệu', en: 'About' })
export const generateMetadata = p.generateMetadata
export default p.Page
