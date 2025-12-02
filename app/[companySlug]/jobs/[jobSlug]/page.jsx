'use client'

import JobDetailPage from '../../../../components/JobDetailPage'

export default function JobDetailPageRoute({ params }) {
  return <JobDetailPage companySlug={params.companySlug} jobSlug={params.jobSlug} />
}

