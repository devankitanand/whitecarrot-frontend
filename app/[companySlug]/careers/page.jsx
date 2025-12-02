'use client'

import CareersPage from '../../../components/CareersPage'

export default function CareersPageRoute({ params }) {
  return <CareersPage companySlug={params.companySlug} />
}
