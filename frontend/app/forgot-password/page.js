'use client'

import { useState } from 'react'
import Link from 'next/link'
import { authApi } from '@/lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await authApi.requestPasswordReset(email)
      
      if (response.success) {
        setMessage({
          type: 'success',
          text: response.message || 'If the email exists, a password reset link has been sent.',
        })
        setEmail('')
      }
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.error || 'An error occurred. Please try again.',
      })
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
                  <div className="display-1 mb-3">
                    <i className="bi bi-key text-primary"></i>
                  </div>
                  <h2 className="mb-2">Forgot Password?</h2>
                  <p className="text-muted">
                    No worries! Enter your email and we&apos;ll send you reset instructions.
                  </p>
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
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label">
                      Email address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      disabled={loading}
                    />
                    <div className="form-text">
                      We&apos;ll send password reset instructions to this email
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-gradient-primary w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Send Reset Link
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <Link href="/login">
                      <i className="bi bi-arrow-left me-1"></i>
                      Back to login
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            <div className="text-center mt-3">
              <Link href="/" className="text-white small">
                <i className="bi bi-house me-1"></i>
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
