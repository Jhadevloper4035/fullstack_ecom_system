'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

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
      const response = await authApi.register(
        formData.email,
        formData.password,
        formData.confirmPassword
      )

      if (response.success) {
        setMessage({
          type: 'success',
          text: 'Registration successful! Please check your email to verify your account.',
        })
        setFormData({ email: '', password: '', confirmPassword: '' })
        
        setTimeout(() => {
          router.push('/login')
        }, 3000)
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
                  <h2 className="logo-text mb-2">Create Account</h2>
                  <p className="text-muted">Sign up for a new account</p>
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
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a strong password"
                        required
                        disabled={loading}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                      {errors.password && (
                        <div className="invalid-feedback d-block">{errors.password}</div>
                      )}
                    </div>
                    <div className="form-text">
                      Must be at least 8 characters with uppercase, lowercase, number & special character
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                      disabled={loading}
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">{errors.confirmPassword}</div>
                    )}
                  </div>

                  <div className="form-check mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="agreeTerms"
                      required
                    />
                    <label className="form-check-label small" htmlFor="agreeTerms">
                      I agree to the{' '}
                      <Link href="/terms">Terms of Service</Link> and{' '}
                      <Link href="/privacy">Privacy Policy</Link>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-gradient-primary w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus me-2"></i>
                        Create Account
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <p className="mb-0">
                      Already have an account?{' '}
                      <Link href="/login">Sign in</Link>
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
