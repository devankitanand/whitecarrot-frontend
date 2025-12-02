'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'
import Loader from './Loader'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <Loader message="Loading..." />
  }

  if (!user) {
    return null
  }

  return children
}

export default ProtectedRoute
