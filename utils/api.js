import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

// Add request interceptor to include auth token from localStorage
axios.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (email, password) => axios.post(`${API_BASE_URL}/auth/login`, { email, password }),
  register: (email, password, companyName, companySlug) =>
    axios.post(`${API_BASE_URL}/auth/register`, { email, password, companyName, companySlug })
}

export const companyAPI = {
  getPublic: (slug) => axios.get(`${API_BASE_URL}/companies/public/${slug}`),
  getMyCompany: () => axios.get(`${API_BASE_URL}/companies/my-company`),
  updateMyCompany: (data) => axios.put(`${API_BASE_URL}/companies/my-company`, data),
  addSection: (data) => axios.post(`${API_BASE_URL}/companies/my-company/sections`, data),
  updateSection: (sectionId, data) => axios.put(`${API_BASE_URL}/companies/my-company/sections/${sectionId}`, data),
  deleteSection: (sectionId) => axios.delete(`${API_BASE_URL}/companies/my-company/sections/${sectionId}`),
  reorderSections: (sectionIds) => axios.put(`${API_BASE_URL}/companies/my-company/sections/reorder`, { sectionIds }),
  checkSlugAvailability: (slug) => axios.get(`${API_BASE_URL}/companies/check-slug/${slug}`),
  updateSlug: (slug) => axios.put(`${API_BASE_URL}/companies/my-company/slug`, { slug })
}

export const jobAPI = {
  getByCompany: (slug, filters = {}) => {
    const params = new URLSearchParams()
    if (filters.location) params.append('location', filters.location)
    if (filters.jobType) params.append('jobType', filters.jobType)
    if (filters.search) params.append('search', filters.search)
    return axios.get(`${API_BASE_URL}/jobs/company/${slug}?${params.toString()}`)
  },
  getBySlug: (companySlug, jobSlug) => axios.get(`${API_BASE_URL}/jobs/company/${companySlug}/${jobSlug}`),
  getMyJobs: () => axios.get(`${API_BASE_URL}/jobs/my-jobs`),
  createJob: (data) => axios.post(`${API_BASE_URL}/jobs/my-jobs`, data),
  updateJob: (jobId, data) => axios.put(`${API_BASE_URL}/jobs/my-jobs/${jobId}`, data),
  deleteJob: (jobId) => axios.delete(`${API_BASE_URL}/jobs/my-jobs/${jobId}`),
  checkSlugAvailability: (slug) => axios.get(`${API_BASE_URL}/jobs/check-slug/${slug}`)
}
