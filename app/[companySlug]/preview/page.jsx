'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '../../../components/ProtectedRoute'
import PreviewPage from '../../../components/PreviewPage'
import Loader from '../../../components/Loader'

export default function PreviewPageRoute({ params }) {
  const [companySlug, setCompanySlug] = useState(null)

  useEffect(() => {
    if (params?.companySlug) {
      setCompanySlug(params.companySlug)
    }
  }, [params])

  if (!companySlug) {
    return <Loader message="Loading..." />
  }

  return (
    <ProtectedRoute>
      <PreviewPage companySlug={companySlug} />
    </ProtectedRoute>
  )
}
