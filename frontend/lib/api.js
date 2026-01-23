import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost'

// Create axios instance
const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add access token to requests
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        const refreshToken = Cookies.get('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        const response = await axios.post(
          `${API_URL}/api/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        )

        const { accessToken } = response.data

        // Save new access token
        Cookies.set('accessToken', accessToken, {
          expires: 1 / 96, // 15 minutes
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        })

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')

        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Auth API functions
export const authApi = {
  register: async (email, password, confirmPassword) => {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      confirmPassword,
    })
    return response.data
  },

  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    })

    if (response.data.success) {
      // Store access token in cookie
      Cookies.set('accessToken', response.data.accessToken, {
        expires: 1 / 96, // 15 minutes
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
    }

    return response.data
  },

  verifyEmail: async (token) => {
    const response = await apiClient.post('/auth/verify-email', { token })
    return response.data
  },

  requestPasswordReset: async (email) => {
    const response = await apiClient.post('/auth/request-password-reset', { email })
    return response.data
  },

  resetPassword: async (token, password, confirmPassword) => {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      password,
      confirmPassword,
    })
    return response.data
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')
    }
  },

  logoutAll: async () => {
    try {
      await apiClient.post('/auth/logout-all')
    } finally {
      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')
    }
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },

  refreshToken: async () => {
    const refreshToken = Cookies.get('refreshToken')
    const response = await apiClient.post('/auth/refresh-token', {
      refreshToken,
    })

    if (response.data.success) {
      Cookies.set('accessToken', response.data.accessToken, {
        expires: 1 / 96, // 15 minutes
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
    }

    return response.data
  },
}

export default apiClient
