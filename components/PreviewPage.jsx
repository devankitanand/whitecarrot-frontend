'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { companyAPI, jobAPI } from '../utils/api'
import '../styles/CareersPage.css'

const PreviewPage = ({ companySlug }) => {
  const router = useRouter()
  const { logout } = useAuth()
  const [company, setCompany] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [companySlug])

  const loadData = async () => {
    try {
      const [companyRes, jobsRes] = await Promise.all([
        companyAPI.getPublic(companySlug),
        jobAPI.getByCompany(companySlug)
      ])
      setCompany(companyRes.data)
      setJobs(jobsRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading-container">Loading preview...</div>
  }

  if (!company) {
    return <div className="loading-container">Company not found</div>
  }

  return (
    <CareersPageContent
      company={company}
      jobs={jobs}
      isPreview={true}
      onBack={() => router.push(`/${companySlug}/edit`)}
      companySlug={companySlug}
    />
  )
}

export const CareersPageContent = ({ company, jobs, isPreview = false, onBack, companySlug }) => {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: ''
  })
  const [filteredJobs, setFilteredJobs] = useState(jobs)
  const router = useRouter()
  const { logout } = useAuth()

  useEffect(() => {
    let filtered = [...jobs]

    if (filters.search) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    if (filters.jobType) {
      filtered = filtered.filter(job => job.jobType === filters.jobType)
    }

    setFilteredJobs(filtered)
  }, [filters, jobs])

  const brand = company.brand || {}
  const sections = [...(company.contentSections || [])].sort((a, b) => (a.order || 0) - (b.order || 0))

  const uniqueLocations = [...new Set(jobs.map(j => j.location))].sort()
  const uniqueJobTypes = [...new Set(jobs.map(j => j.jobType))].sort()
  const getCultureVideoEmbedUrl = (url) => {
    if (!url) return null

    try {
      const parsed = new URL(url)

      if (parsed.hostname.includes('youtube.com') || parsed.hostname === 'youtu.be') {
        let videoId = null

        if (parsed.hostname === 'youtu.be') {
          videoId = parsed.pathname.slice(1)
        } else if (parsed.pathname === '/watch') {
          videoId = parsed.searchParams.get('v')
        } else if (parsed.pathname.startsWith('/embed/')) {
          videoId = parsed.pathname.replace('/embed/', '')
        } else if (parsed.pathname.startsWith('/shorts/')) {
          videoId = parsed.pathname.replace('/shorts/', '')
        }

        if (!videoId) return null

        return `https://www.youtube.com/embed/${videoId}`
      }

      return url
    } catch {
      return url
    }
  }

  const cultureVideoEmbedUrl = getCultureVideoEmbedUrl(brand.cultureVideo)

  return (
    <div
      className="careers-page"
      style={{
        '--primary-color': brand.primaryColor || '#3B82F6',
        '--secondary-color': brand.secondaryColor || '#1E40AF'
      }}
    >
      {isPreview && (
        <div className="preview-banner">
          <span>Preview Mode</span>
          <div className="preview-banner-actions">
            <button onClick={onBack} className="btn-secondary">Back to Edit</button>
            <button
              onClick={() => {
                logout()
                router.push('/login')
              }}
              className="btn-logout"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      <header className="careers-header">
        {brand.banner && (
          <div className="careers-banner">
            <img src={brand.banner} alt={company.name} />
          </div>
        )}
        <div className="careers-header-content">
          {brand.logo && (
            <img src={brand.logo} alt={`${company.name} logo`} className="company-logo" />
          )}
          <h1>{company.name}</h1>
          <p className="careers-subtitle">{brand.subtitle || 'Join our team and help shape the future'}</p>
        </div>
      </header>

      {cultureVideoEmbedUrl && (
        <section className="culture-video-section">
          <div className="container">
            <div className="video-wrapper">
              <iframe
                src={cultureVideoEmbedUrl}
                title="Culture Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {sections.length > 0 && (
        <section className="content-sections">
          <div className="container">
            {sections.map((section) => (
              <div key={section._id} className="content-section">
                <h2>{section.title}</h2>
                <div className="section-content" dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br />') }} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="jobs-section">
        <div className="container">
          <h2>Open Positions</h2>

          <div className="jobs-filters">
            <div className="filter-group">
              <label htmlFor="search">Search Jobs</label>
              <input
                id="search"
                type="text"
                placeholder="Job title..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="location">Location</label>
              <select
                id="location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              >
                <option value="">All Locations</option>
                {uniqueLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="jobType">Job Type</label>
              <select
                id="jobType"
                value={filters.jobType}
                onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
              >
                <option value="">All Types</option>
                {uniqueJobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="jobs-list">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job._id} className="job-card">
                  <div className="job-card-header">
                    <h3>{job.title}</h3>
                    {job.department && <span className="job-department">{job.department}</span>}
                  </div>
                  <div className="job-card-meta">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.jobType}</span>
                    {job.salary && (job.salary.min || job.salary.max) && (
                      <>
                        <span>•</span>
                        <span>
                          {job.salary.min && job.salary.max
                            ? `${job.salary.currency} ${job.salary.min} - ${job.salary.max}`
                            : job.salary.min
                            ? `${job.salary.currency} ${job.salary.min}+`
                            : `${job.salary.currency} up to ${job.salary.max}`}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="job-description">{job.description.substring(0, 200)}...</p>
                  <button 
                    className="job-apply-btn"
                    onClick={() => {
                      const slug = companySlug || company.slug
                      const jobSlug = job.slug || job._id
                      router.push(`/${slug}/jobs/${jobSlug}`)
                    }}
                  >
                    Apply
                  </button>
                </div>
              ))
            ) : (
              <div className="no-jobs">
                <p>No jobs found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="careers-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} {company.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default PreviewPage
