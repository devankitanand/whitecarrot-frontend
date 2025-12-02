'use client'

import { useEffect, useState } from 'react'
import { companyAPI, jobAPI } from '../utils/api'
import { CareersPageContent } from './PreviewPage'
import '../styles/CareersPage.css'

const CareersPage = ({ companySlug }) => {
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

  useEffect(() => {
    if (company && typeof window !== 'undefined') {
      document.title = `Careers at ${company.name}`
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', `Join ${company.name}. Explore open positions and learn about our culture.`)
      } else {
        const meta = document.createElement('meta')
        meta.name = 'description'
        meta.content = `Join ${company.name}. Explore open positions and learn about our culture.`
        document.head.appendChild(meta)
      }

      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: company.name,
        url: window.location.origin,
        logo: company.brand?.logo,
        sameAs: [],
        jobPostings: jobs.map(job => ({
          '@type': 'JobPosting',
          title: job.title,
          description: job.description,
          employmentType: job.jobType,
          jobLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              addressLocality: job.location
            }
          },
          baseSalary: job.salary && (job.salary.min || job.salary.max) ? {
            '@type': 'MonetaryAmount',
            currency: job.salary.currency || 'USD',
            value: {
              '@type': 'QuantitativeValue',
              minValue: job.salary.min,
              maxValue: job.salary.max
            }
          } : undefined
        }))
      }

      let script = document.querySelector('script[type="application/ld+json"]')
      if (script) {
        script.textContent = JSON.stringify(structuredData)
      } else {
        script = document.createElement('script')
        script.type = 'application/ld+json'
        script.textContent = JSON.stringify(structuredData)
        document.head.appendChild(script)
      }
    }
  }, [company, jobs])

  if (loading) {
    return <div className="loading-container">Loading...</div>
  }

  if (!company) {
    return <div className="loading-container">Company not found</div>
  }

  return <CareersPageContent company={company} jobs={jobs} companySlug={companySlug} />
}

export default CareersPage
