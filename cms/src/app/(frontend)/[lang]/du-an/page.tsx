import { cmsPage } from '@/components/CmsPage'

export const dynamic = 'force-dynamic'
const p = cmsPage('du-an', '/du-an', { vi: 'Dự án', en: 'Projects' })
export const generateMetadata = p.generateMetadata
export default p.Page
