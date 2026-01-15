'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setMessage(null)

    try {
      const response = await authApi.login(formData.email, formData.password)

      if (response.success) {
        // Store login time
        localStorage.setItem('loginTime', new Date().toISOString())
        
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' })
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        // Validation errors
        const fieldErrors = {}
        error.response.data.errors.forEach((err) => {
          fieldErrors[err.field] = err.message
        })
        setErrors(fieldErrors)
      } else if (error.response?.data?.error) {
        setMessage({ type: 'danger', text: error.response.data.error })
      } else {
        setMessage({ type: 'danger', text: 'An error occurred. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="card card-auth fade-in">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="logo-text mb-2">Welcome Back</h2>
                  <p className="text-muted">Sign in to your account</p>
                </div>

                {message && (
                  <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                    {message.text}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setMessage(null)}
                      aria-label="Close"
                    ></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email address
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      disabled={loading}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <Link href="/forgot-password" className="small">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-gradient-primary w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <p className="mb-0">
                      Don&apos;t have an account?{' '}
                      <Link href="/register">Sign up</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            <div className="text-center mt-3">
              <Link href="/" className="text-white small">
                <i className="bi bi-arrow-left me-1"></i>
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
