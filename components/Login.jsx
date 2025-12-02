'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { authAPI, companyAPI } from '../utils/api'
import '../styles/Login.css'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companySlug, setCompanySlug] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSlug, setCheckingSlug] = useState(false)
  const [slugAvailable, setSlugAvailable] = useState(null)
  const [slugError, setSlugError] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const checkSlugAvailability = async (slug) => {
    if (!slug || !slug.match(/^[a-z0-9\-]+$/)) {
      setSlugAvailable(null)
      setSlugError('')
      return
    }

    setCheckingSlug(true)
    setSlugError('')
    try {
      const { data } = await companyAPI.checkSlugAvailability(slug)
      setSlugAvailable(data.available)
      if (!data.available) {
        setSlugError(`Slug "${slug}" is not available - it already exists`)
      }
    } catch (err) {
      setSlugError(err.response?.data?.error || 'Failed to check availability')
      setSlugAvailable(false)
    } finally {
      setCheckingSlug(false)
    }
  }

  useEffect(() => {
    if (!isLogin && companySlug) {
      const timer = setTimeout(() => {
        checkSlugAvailability(companySlug)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [companySlug, isLogin])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!isLogin && companySlug) {
      if (slugAvailable === null) {
        await checkSlugAvailability(companySlug)
        return
      }
      if (!slugAvailable) {
        setError('Please choose an available slug')
        return
      }
    }

    setLoading(true)

    try {
      if (isLogin) {
        const { data } = await authAPI.login(email, password)
        login(data.token, data.user)
        router.push(`/${data.user.companySlug}/edit`)
      } else {
        const { data } = await authAPI.register(email, password, companyName, companySlug)
        login(data.token, data.user)
        router.push(`/${data.user.companySlug}/edit`)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <img 
            src="https://cdn.prod.website-files.com/606ae3d0421be519a377bc90/65c294caac5353582e66fe69_logo-blue.png" 
            alt="Logo" 
          />
        </div>
        <h1>Careers Page Builder</h1>
        <p className="login-subtitle">
          {isLogin ? 'Sign in to manage your careers page' : 'Create your account to get started'}
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  placeholder="Acme Inc."
                />
              </div>

              <div className="form-group">
                <label htmlFor="companySlug">Company URL Slug</label>
                <input
                  id="companySlug"
                  type="text"
                  value={companySlug}
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
                    setCompanySlug(value)
                    setSlugAvailable(null)
                    setSlugError('')
                  }}
                  required
                  placeholder="acme"
                  pattern="[a-z0-9\-]+"
                />
                {checkingSlug && (
                  <small style={{ color: '#666' }}>Checking availability...</small>
                )}
                {slugAvailable === true && !checkingSlug && (
                  <div className="slug-availability available">
                    ✓ This slug is available!
                  </div>
                )}
                {slugAvailable === false && !checkingSlug && (
                  <div className="slug-availability unavailable">
                    ✗ {slugError || `Slug "${companySlug}" is not available - it already exists`}
                  </div>
                )}
                <small>Your careers page will be at: /{companySlug || 'company'}/careers</small>
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading || (!isLogin && companySlug && slugAvailable === false) || checkingSlug}
          >
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="login-switch">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
              setSlugAvailable(null)
              setSlugError('')
              setCompanySlug('')
            }}
            className="link-button"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
