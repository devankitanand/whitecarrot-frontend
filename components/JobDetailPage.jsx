'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { companyAPI, jobAPI } from '../utils/api'
import '../styles/JobDetailPage.css'

const JobDetailPage = ({ companySlug, jobSlug }) => {
  const router = useRouter()
  const [company, setCompany] = useState(null)
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (companySlug && jobSlug) {
      loadData()
    }
  }, [companySlug, jobSlug])

  const loadData = async () => {
    if (!companySlug || !jobSlug) return
    
    setLoading(true)
    try {
      const [companyRes, jobRes] = await Promise.all([
        companyAPI.getPublic(companySlug),
        jobAPI.getBySlug(companySlug, jobSlug)
      ])
      setCompany(companyRes.data)
      setJob(jobRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !companySlug || !jobSlug) {
    return <div className="loading-container"><div className="loader-wrapper"><div className="spinner"></div><p className="loading-message">Loading...</p></div></div>
  }

  if (!company || !job) {
    return <div className="loading-container"><div className="loader-wrapper"><div className="spinner"></div><p className="loading-message">Job not found</p></div></div>
  }

  const brand = company.brand || {}

  return (
    <div
      className="job-detail-page"
      style={{
        '--primary-color': brand.primaryColor || '#3B82F6',
        '--secondary-color': brand.secondaryColor || '#1E40AF'
      }}
    >
      <header className="job-detail-header">
        <div className="container">
          <button onClick={() => router.push(`/${companySlug}/careers`)} className="back-btn">
            ← Back to Jobs
          </button>
          {brand.logo && (
            <img src={brand.logo} alt={`${company.name} logo`} className="company-logo" />
          )}
        </div>
      </header>

      <div className="job-detail-content">
        <div className="container">
          <div className="job-detail-main">
            <div className="job-detail-info">
              <h1>{job.title}</h1>
              
              <div className="job-meta-info">
                <div className="meta-item">
                  <span className="meta-label">Location:</span>
                  <span className="meta-value">{job.location}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Job Type:</span>
                  <span className="meta-value">{job.jobType}</span>
                </div>
                {job.department && (
                  <div className="meta-item">
                    <span className="meta-label">Department:</span>
                    <span className="meta-value">{job.department}</span>
                  </div>
                )}
                {job.salary && (job.salary.min || job.salary.max) && (
                  <div className="meta-item">
                    <span className="meta-label">Salary:</span>
                    <span className="meta-value">
                      {job.salary.min && job.salary.max
                        ? `${job.salary.currency} ${job.salary.min} - ${job.salary.max}`
                        : job.salary.min
                        ? `${job.salary.currency} ${job.salary.min}+`
                        : `${job.salary.currency} up to ${job.salary.max}`}
                    </span>
                  </div>
                )}
              </div>

              <div className="job-description-section">
                <h2>Job Description</h2>
                <div className="job-description-text">
                  {job.description.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {job.requirements && job.requirements.length > 0 && (
                <div className="job-requirements-section">
                  <h2>Requirements</h2>
                  <ul className="requirements-list">
                    {job.requirements.map((requirement, index) => (
                      <li key={index}>{requirement}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="job-apply-section">
                <button className="apply-btn">Apply Now</button>
              </div>
            </div>

            <div className="job-detail-sidebar">
              <div className="company-info-card">
                <h3>{company.name}</h3>
                {brand.subtitle && <p className="company-subtitle">{brand.subtitle}</p>}
                <button 
                  onClick={() => router.push(`/${companySlug}/careers`)}
                  className="view-all-jobs-btn"
                >
                  View All Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetailPage

