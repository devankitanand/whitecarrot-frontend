'use client'

import ProtectedRoute from '../../../components/ProtectedRoute'
import EditPage from '../../../components/EditPage'

export default function EditPageRoute({ params }) {
  return (
    <ProtectedRoute>
      <EditPage companySlug={params.companySlug} />
    </ProtectedRoute>
  )
}
