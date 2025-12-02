'use client'

import { useState, useEffect } from 'react'
import CareersPage from '../../../components/CareersPage'
import Loader from '../../../components/Loader'

export default function CareersPageRoute({ params }) {
  const [companySlug, setCompanySlug] = useState(null)

  useEffect(() => {
    if (params?.companySlug) {
      setCompanySlug(params.companySlug)
    }
  }, [params])

  if (!companySlug) {
    return <Loader message="Loading..." />
  }

  return <CareersPage companySlug={companySlug} />
}
