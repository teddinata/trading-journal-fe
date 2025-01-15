// src/config/axios.js
import axios from 'axios'

// Get base URL from environment variable
let baseURL = import.meta.env.VITE_API_URL

// Force HTTP in development
if (process.env.NODE_ENV === 'development' && baseURL.startsWith('https://')) {
  baseURL = baseURL.replace('https://', 'http://')
}

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  config => {
    // Force HTTP in development for all requests
    if (process.env.NODE_ENV === 'development' && config.url?.startsWith('https://')) {
      config.url = config.url.replace('https://', 'http://')
    }

    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      })
    }

    return Promise.reject(error)
  }
)

// Log configuration in development
if (process.env.NODE_ENV === 'development') {
  console.log('Axios baseURL:', baseURL)
}

export default axiosInstance