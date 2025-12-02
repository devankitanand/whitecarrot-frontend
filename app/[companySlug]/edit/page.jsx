'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '../../../components/ProtectedRoute'
import EditPage from '../../../components/EditPage'
import Loader from '../../../components/Loader'

export default function EditPageRoute({ params }) {
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
      <EditPage companySlug={companySlug} />
    </ProtectedRoute>
  )
}
