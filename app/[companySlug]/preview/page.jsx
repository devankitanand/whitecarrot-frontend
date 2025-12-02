'use client'

import ProtectedRoute from '../../../components/ProtectedRoute'
import PreviewPage from '../../../components/PreviewPage'

export default function PreviewPageRoute({ params }) {
  return (
    <ProtectedRoute>
      <PreviewPage companySlug={params.companySlug} />
    </ProtectedRoute>
  )
}
