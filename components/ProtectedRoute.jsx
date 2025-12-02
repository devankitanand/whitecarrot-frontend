'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>
  }

  if (!user) {
    return null
  }

  return children
}

export default ProtectedRoute
