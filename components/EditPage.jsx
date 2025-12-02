'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { companyAPI, jobAPI } from '../utils/api'
import '../styles/EditPage.css'

const EditPage = ({ companySlug }) => {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [company, setCompany] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('brand')

  useEffect(() => {
    loadData()
  }, [companySlug])

  const loadData = async () => {
    try {
      const [companyRes, jobsRes] = await Promise.all([
        companyAPI.getMyCompany(),
        jobAPI.getMyJobs()
      ])
      setCompany(companyRes.data)
      setJobs(jobsRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' })
    }, 3000)
  }

  const handleBrandUpdate = async (updates) => {
    setSaving(true)
    try {
      const { data } = await companyAPI.updateMyCompany({
        brand: { ...company.brand, ...updates }
      })
      setCompany(data)
      showToast('Brand theme updated successfully!', 'success')
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update brand theme', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleSectionAdd = async (type, title, content) => {
    setSaving(true)
    try {
      const { data } = await companyAPI.addSection({ type, title, content })
      setCompany(data)
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add section')
    } finally {
      setSaving(false)
    }
  }

  const handleSectionUpdate = async (sectionId, updates) => {
    setSaving(true)
    try {
      const { data } = await companyAPI.updateSection(sectionId, updates)
      setCompany(data)
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update section')
    } finally {
      setSaving(false)
    }
  }

  const handleSectionDelete = async (sectionId) => {
    if (!confirm('Delete this section?')) return
    setSaving(true)
    try {
      const { data } = await companyAPI.deleteSection(sectionId)
      setCompany(data)
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete section')
    } finally {
      setSaving(false)
    }
  }

  const handleSectionReorder = async (sectionIds) => {
    setSaving(true)
    try {
      const { data } = await companyAPI.reorderSections(sectionIds)
      setCompany(data)
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reorder sections')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="loading-container">Loading...</div>
  }

  if (!company) {
    return <div className="loading-container">Company not found</div>
  }

  return (
    <div className="edit-page">
      {toast.show && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? '✓' : '✗'} {toast.message}
        </div>
      )}
      <header className="edit-header">
        <div className="edit-header-content">
          <div className="edit-header-logo">
            <img
              src="https://cdn.prod.website-files.com/606ae3d0421be519a377bc90/65c294caac5353582e66fe69_logo-blue.png"
              alt="Logo"
            />
          </div>
          <div className="edit-header-actions">
            <button
              onClick={() => router.push(`/${companySlug}/preview`)}
              className="btn-secondary"
            >
              Preview
            </button>
            <a
              href={`/${companySlug}/careers`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              View Public Page
            </a>
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
      </header>

      <div className="edit-content">
        <nav className="edit-tabs">
          <button
            className={activeTab === 'brand' ? 'active' : ''}
            onClick={() => setActiveTab('brand')}
          >
            Brand
          </button>
          <button
            className={activeTab === 'sections' ? 'active' : ''}
            onClick={() => setActiveTab('sections')}
          >
            Content Sections
          </button>
          <button
            className={activeTab === 'jobs' ? 'active' : ''}
            onClick={() => setActiveTab('jobs')}
          >
            Jobs
          </button>
          <button
            className={activeTab === 'slug' ? 'active' : ''}
            onClick={() => setActiveTab('slug')}
          >
            Slug
          </button>
        </nav>

        <div className="edit-panel">
          {activeTab === 'brand' && (
            <BrandTab company={company} onUpdate={handleBrandUpdate} saving={saving} />
          )}
          {activeTab === 'sections' && (
            <SectionsTab
              company={company}
              onAdd={handleSectionAdd}
              onUpdate={handleSectionUpdate}
              onDelete={handleSectionDelete}
              onReorder={handleSectionReorder}
              saving={saving}
            />
          )}
          {activeTab === 'jobs' && (
            <JobsTab jobs={jobs} onRefresh={loadData} />
          )}
          {activeTab === 'slug' && (
            <SlugTab company={company} onUpdate={loadData} user={user} />
          )}
        </div>
      </div>
    </div>
  )
}

const BrandTab = ({ company, onUpdate, saving }) => {
  const [primaryColor, setPrimaryColor] = useState(company.brand?.primaryColor || '#3B82F6')
  const [secondaryColor, setSecondaryColor] = useState(company.brand?.secondaryColor || '#1E40AF')
  const [logo, setLogo] = useState(company.brand?.logo || '')
  const [banner, setBanner] = useState(company.brand?.banner || '')
  const [cultureVideo, setCultureVideo] = useState(company.brand?.cultureVideo || '')
  const [subtitle, setSubtitle] = useState(company.brand?.subtitle || 'Join our team and help shape the future')

  const handleSave = () => {
    onUpdate({ primaryColor, secondaryColor, logo, banner, cultureVideo, subtitle })
  }

  return (
    <div className="brand-tab">
      <h2>Brand Theme</h2>
      <div className="form-section">
        <div className="form-row">
          <div className="form-group">
            <label>Primary Color</label>
            <div className="color-input-group">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#3B82F6"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Secondary Color</label>
            <div className="color-input-group">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                placeholder="#1E40AF"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Logo URL</label>
          <input
            type="url"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            placeholder="https://example.com/logo.png"
          />
        </div>

        <div className="form-group">
          <label>Banner Image URL</label>
          <input
            type="url"
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
            placeholder="https://example.com/banner.jpg"
          />
        </div>

        <div className="form-group">
          <label>Culture Video URL</label>
          <input
            type="url"
            value={cultureVideo}
            onChange={(e) => setCultureVideo(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>

        <div className="form-group">
          <label>Subtitle</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Join our team and help shape the future"
          />
          <small>This appears below your company name on the careers page</small>
        </div>

        <button onClick={handleSave} className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

const SectionsTab = ({ company, onAdd, onUpdate, onDelete, onReorder, saving }) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSection, setNewSection] = useState({ type: 'about', title: '', content: '' })

  const sections = [...(company.contentSections || [])].sort((a, b) => (a.order || 0) - (b.order || 0))
  const existingTypes = sections.map(s => s.type)
  const allTypes = [
    { value: 'about', label: 'About Us' },
    { value: 'life', label: 'Life at Company' },
    { value: 'benefits', label: 'Benefits' },
    { value: 'values', label: 'Values' },
    { value: 'custom', label: 'Custom' }
  ]
  const availableTypes = allTypes.filter(type => !existingTypes.includes(type.value) || type.value === 'custom')

  const handleAdd = () => {
    if (existingTypes.includes(newSection.type) && newSection.type !== 'custom') {
      return
    }
    onAdd(newSection.type, newSection.title, newSection.content)
    const nextAvailableType = availableTypes.length > 0 ? availableTypes[0].value : 'custom'
    setNewSection({ type: nextAvailableType, title: '', content: '' })
    setShowAddForm(false)
  }

  return (
    <div className="sections-tab">
      <div className="sections-header">
        <h2>Content Sections</h2>
        <button onClick={() => {
          if (!showAddForm) {
            const nextAvailableType = availableTypes.length > 0 ? availableTypes[0].value : 'custom'
            setNewSection({ type: nextAvailableType, title: '', content: '' })
          }
          setShowAddForm(!showAddForm)
        }} className="btn-primary">
          {showAddForm ? 'Cancel' : '+ Add Section'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-section-form">
          <div className="form-group">
            <label>Type</label>
            <select
              value={newSection.type}
              onChange={(e) => setNewSection({ ...newSection, type: e.target.value })}
            >
              {availableTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            {availableTypes.length === 1 && availableTypes[0].value === 'custom' && (
              <small style={{ color: '#666', marginTop: '4px' }}>
                All standard section types have been used. Only Custom sections are available.
              </small>
            )}
          </div>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={newSection.title}
              onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
              placeholder="Section Title"
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea
              value={newSection.content}
              onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
              placeholder="Section content (supports markdown)"
              rows={6}
            />
          </div>
          <button onClick={handleAdd} className="btn-primary" disabled={saving}>
            Add Section
          </button>
        </div>
      )}

      <div className="sections-list">
        {sections.map((section) => (
          <SectionItem
            key={section._id}
            section={section}
            onUpdate={onUpdate}
            onDelete={onDelete}
            saving={saving}
          />
        ))}
        {sections.length === 0 && (
          <p className="empty-state">No sections yet. Add your first section above.</p>
        )}
      </div>
    </div>
  )
}

const SectionItem = ({ section, onUpdate, onDelete, saving }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(section.title || '')
  const [content, setContent] = useState(section.content || '')

  const handleSave = () => {
    onUpdate(section._id, { title, content })
    setIsEditing(false)
  }

  return (
    <div className="section-item">
      <div className="section-main">
        <div className="section-header">
          <span className="section-type">{section.type}</span>
        </div>
        {isEditing ? (
          <div className="section-edit">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
              rows={4}
            />
          </div>
        ) : (
          <div className="section-content">
            <h3>{title}</h3>
            <p>{content}</p>
          </div>
        )}
      </div>
      <div className="section-actions">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="btn-small" disabled={saving}>
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="btn-small btn-secondary">
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="btn-small">
              Edit
            </button>
            <button onClick={() => onDelete(section._id)} className="btn-small btn-danger">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const SlugTab = ({ company, onUpdate, user }) => {
  const { login } = useAuth()
  const currentSlug = user?.companySlug || company?.slug || ''
  const [newSlug, setNewSlug] = useState(currentSlug)
  const [checking, setChecking] = useState(false)
  const [available, setAvailable] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [isCurrentSlug, setIsCurrentSlug] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    const slug = user?.companySlug || company?.slug || ''
    setNewSlug(slug)
  }, [company?.slug, user?.companySlug])

  const handleSlugChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    setNewSlug(value)
    const isCurrent = value === currentSlug
    setIsCurrentSlug(isCurrent)
    if (isCurrent) {
      setAvailable(null)
      setError('')
    } else {
      setAvailable(null)
      setError('')
    }
  }

  const checkAvailability = async () => {
    if (!newSlug) {
      setAvailable(null)
      setIsCurrentSlug(false)
      return
    }
    
    if (newSlug === currentSlug) {
      setIsCurrentSlug(true)
      setAvailable(null)
      setError('')
      return
    }
    
    setIsCurrentSlug(false)

    if (!newSlug.match(/^[a-z0-9\-]+$/)) {
      setError('Slug can only contain lowercase letters, numbers, and hyphens')
      setAvailable(false)
      return
    }

    setChecking(true)
    setError('')
    try {
      const { data } = await companyAPI.checkSlugAvailability(newSlug)
      setAvailable(data.available)
      if (!data.available) {
        setError(`Slug "${newSlug}" is not available - it already exists`)
        setAvailable(false)
      } else {
        setError('')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to check availability')
      setAvailable(false)
    } finally {
      setChecking(false)
    }
  }

  const handleSave = async () => {
    if (newSlug === currentSlug) {
      return
    }

    if (!available) {
      setError('Please check availability first')
      return
    }

    setSaving(true)
    setError('')
    try {
      const { data } = await companyAPI.updateSlug(newSlug)
      
      // Update user in AuthContext with new companySlug
      if (data.user && user) {
        const updatedUser = {
          ...user,
          companySlug: data.user.companySlug
        }
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        if (token) {
          login(token, updatedUser)
        }
      }
      
      await onUpdate()
      if (typeof window !== 'undefined') {
        window.location.href = `/${newSlug}/edit`
      } else {
        router.replace(`/${newSlug}/edit`)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update slug')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="slug-tab">
      <h2>Company Slug</h2>
      <div className="form-section">
        <div className="form-group">
          <label>New Slug</label>
          <div className="slug-input-group">
            <input
              type="text"
              value={newSlug}
              onChange={handleSlugChange}
              placeholder="new-slug"
              pattern="[a-z0-9\-]+"
            />
            <button
              type="button"
              onClick={checkAvailability}
              className="btn-secondary"
              disabled={checking || !newSlug || newSlug === currentSlug}
            >
              {checking ? 'Checking...' : 'Check Availability'}
            </button>
          </div>
          {isCurrentSlug && newSlug && (
            <div className="availability-message current-slug">
              ℹ This is your current slug. No changes needed.
            </div>
          )}
          {available === true && !isCurrentSlug && (
            <div className="availability-message available">
              ✓ This slug is available!
            </div>
          )}
          {available === false && !isCurrentSlug && (
            <div className="availability-message unavailable">
              ✗ {error || `Slug "${newSlug}" is not available - it already exists`}
            </div>
          )}
          {error && available !== false && available !== true && !isCurrentSlug && (
            <div className="availability-message unavailable">
              {error}
            </div>
          )}
          <small>Slug can only contain lowercase letters, numbers, and hyphens</small>
        </div>

        <button
          onClick={handleSave}
          className="btn-primary"
          disabled={saving || !available || newSlug === currentSlug}
        >
          {saving ? 'Saving...' : 'Update Slug'}
        </button>
      </div>
    </div>
  )
}

const JobsTab = ({ jobs, onRefresh }) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    department: '',
    location: '',
    jobType: 'Full-time',
    description: '',
    requirements: '',
    salary: { min: '', max: '', currency: 'USD' }
  })
  const [saving, setSaving] = useState(false)
  const [checkingSlug, setCheckingSlug] = useState(false)
  const [slugAvailable, setSlugAvailable] = useState(null)
  const [slugError, setSlugError] = useState('')
  const [isCurrentSlug, setIsCurrentSlug] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(r => r.trim())
      }
      if (editingJob) {
        await jobAPI.updateJob(editingJob._id, data)
      } else {
        await jobAPI.createJob(data)
      }
      onRefresh()
      setShowAddForm(false)
      setEditingJob(null)
      setFormData({
        title: '',
        slug: '',
        department: '',
        location: '',
        jobType: 'Full-time',
        description: '',
        requirements: '',
        salary: { min: '', max: '', currency: 'USD' }
      })
      setSlugAvailable(null)
      setSlugError('')
      setIsCurrentSlug(false)
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save job')
    } finally {
      setSaving(false)
    }
  }

  const handleSlugChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    setFormData({ ...formData, slug: value })
    const isCurrent = editingJob && value === editingJob.slug
    setIsCurrentSlug(isCurrent)
    if (isCurrent) {
      setSlugAvailable(null)
      setSlugError('')
    } else {
      setSlugAvailable(null)
      setSlugError('')
    }
  }

  const checkSlugAvailability = async () => {
    if (!formData.slug) {
      setSlugAvailable(null)
      setIsCurrentSlug(false)
      return
    }
    
    if (editingJob && formData.slug === editingJob.slug) {
      setIsCurrentSlug(true)
      setSlugAvailable(null)
      setSlugError('')
      return
    }
    
    setIsCurrentSlug(false)

    if (!formData.slug.match(/^[a-z0-9\-]+$/)) {
      setSlugError('Slug can only contain lowercase letters, numbers, and hyphens')
      setSlugAvailable(false)
      return
    }

    setCheckingSlug(true)
    setSlugError('')
    try {
      const { data } = await jobAPI.checkSlugAvailability(formData.slug)
      setSlugAvailable(data.available)
      if (!data.available) {
        setSlugError(`Job slug "${formData.slug}" is not available - it already exists`)
        setSlugAvailable(false)
      } else {
        setSlugError('')
      }
    } catch (err) {
      setSlugError(err.response?.data?.error || 'Failed to check availability')
      setSlugAvailable(false)
    } finally {
      setCheckingSlug(false)
    }
  }

  const handleEdit = (job) => {
    setEditingJob(job)
    setFormData({
      title: job.title,
      slug: job.slug || '',
      department: job.department || '',
      location: job.location,
      jobType: job.jobType,
      description: job.description,
      requirements: (job.requirements || []).join('\n'),
      salary: job.salary || { min: '', max: '', currency: 'USD' }
    })
    setSlugAvailable(null)
    setSlugError('')
    setIsCurrentSlug(false)
    setShowAddForm(true)
  }

  const handleDelete = async (jobId) => {
    if (!confirm('Delete this job?')) return
    setSaving(true)
    try {
      await jobAPI.deleteJob(jobId)
      onRefresh()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete job')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="jobs-tab">
      <div className="jobs-header">
        <h2>Jobs</h2>
        <button onClick={() => {
          setShowAddForm(!showAddForm)
          setEditingJob(null)
          setFormData({
            title: '',
            slug: '',
            department: '',
            location: '',
            jobType: 'Full-time',
            description: '',
            requirements: '',
            salary: { min: '', max: '', currency: 'USD' }
          })
          setSlugAvailable(null)
          setSlugError('')
          setIsCurrentSlug(false)
        }} className="btn-primary">
          {showAddForm ? 'Cancel' : '+ Add Job'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="job-form">
          <div className="form-row">
            <div className="form-group">
              <label>Job Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Job Slug</label>
              <div className="slug-input-group">
                <input
                  type="text"
                  value={formData.slug}
                  onChange={handleSlugChange}
                  placeholder="job-slug"
                  pattern="[a-z0-9\-]+"
                />
                <button
                  type="button"
                  onClick={checkSlugAvailability}
                  className="btn-secondary"
                  disabled={checkingSlug || !formData.slug || (editingJob && formData.slug === editingJob.slug)}
                >
                  {checkingSlug ? 'Checking...' : 'Check Availability'}
                </button>
              </div>
              {isCurrentSlug && formData.slug && (
                <div className="availability-message current-slug">
                  ℹ This is the current slug for this job.
                </div>
              )}
              {slugAvailable === true && !isCurrentSlug && (
                <div className="availability-message available">
                  ✓ This slug is available!
                </div>
              )}
              {slugAvailable === false && !isCurrentSlug && (
                <div className="availability-message unavailable">
                  ✗ {slugError || `Job slug "${formData.slug}" is not available - it already exists`}
                </div>
              )}
              {slugError && slugAvailable !== false && slugAvailable !== true && !isCurrentSlug && (
                <div className="availability-message unavailable">
                  {slugError}
                </div>
              )}
              <small>Slug can only contain lowercase letters, numbers, and hyphens</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Job Type *</label>
              <select
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={6}
            />
          </div>

          <div className="form-group">
            <label>Requirements (one per line)</label>
            <textarea
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Salary Min</label>
              <input
                type="number"
                value={formData.salary.min}
                onChange={(e) => setFormData({
                  ...formData,
                  salary: { ...formData.salary, min: e.target.value }
                })}
              />
            </div>
            <div className="form-group">
              <label>Salary Max</label>
              <input
                type="number"
                value={formData.salary.max}
                onChange={(e) => setFormData({
                  ...formData,
                  salary: { ...formData.salary, max: e.target.value }
                })}
              />
            </div>
            <div className="form-group">
              <label>Currency</label>
              <input
                type="text"
                value={formData.salary.currency}
                onChange={(e) => setFormData({
                  ...formData,
                  salary: { ...formData.salary, currency: e.target.value }
                })}
                placeholder="USD"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : editingJob ? 'Update Job' : 'Create Job'}
          </button>
        </form>
      )}

      <div className="jobs-list">
        {jobs.map((job) => (
          <div key={job._id} className="job-item">
            <div className="job-info">
              <h3>{job.title}</h3>
              <p className="job-meta">
                {job.location} • {job.jobType} {job.department && `• ${job.department}`}
              </p>
              <p className="job-status">{job.status}</p>
            </div>
            <div className="job-actions">
              <button onClick={() => handleEdit(job)} className="btn-small">
                Edit
              </button>
              <button onClick={() => handleDelete(job._id)} className="btn-small btn-danger">
                Delete
              </button>
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <p className="empty-state">No jobs yet. Add your first job above.</p>
        )}
      </div>
    </div>
  )
}

export default EditPage
