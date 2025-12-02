'use client'

import { useState, useEffect } from 'react'
import JobDetailPage from '../../../../components/JobDetailPage'
import Loader from '../../../../components/Loader'

export default function JobDetailPageRoute({ params }) {
  const [slugs, setSlugs] = useState({ companySlug: null, jobSlug: null })

  useEffect(() => {
    if (params?.companySlug && params?.jobSlug) {
      setSlugs({ companySlug: params.companySlug, jobSlug: params.jobSlug })
    }
  }, [params])

  if (!slugs.companySlug || !slugs.jobSlug) {
    return <Loader message="Loading..." />
  }

  return <JobDetailPage companySlug={slugs.companySlug} jobSlug={slugs.jobSlug} />
}

