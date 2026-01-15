'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { authApi } from '@/lib/api'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (token) {
      verifyEmail()
    } else {
      setStatus('error')
      setMessage('Invalid verification link')
    }
  }, [token])

  const verifyEmail = async () => {
    try {
      const response = await authApi.verifyEmail(token)
      
      if (response.success) {
        setStatus('success')
        setMessage('Email verified successfully! You can now login.')
      } else {
        setStatus('error')
        setMessage(response.error || 'Verification failed')
      }
    } catch (error) {
      setStatus('error')
      setMessage(error.response?.data?.error || 'Invalid or expired verification link')
    }
  }

  return (
    <div className="auth-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="card card-auth fade-in">
              <div className="card-body p-5 text-center">
                {status === 'loading' && (
                  <>
                    <div className="spinner-border text-primary mb-4" style={{ width: '4rem', height: '4rem' }} role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <h3 className="mb-2">Verifying your email...</h3>
                    <p className="text-muted">Please wait while we verify your email address</p>
                  </>
                )}

                {status === 'success' && (
                  <>
                    <div className="display-1 text-success mb-4">
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                    <h3 className="mb-3">Email Verified!</h3>
                    <p className="text-muted mb-4">{message}</p>
                    <Link href="/login" className="btn btn-gradient-primary">
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Go to Login
                    </Link>
                  </>
                )}

                {status === 'error' && (
                  <>
                    <div className="display-1 text-danger mb-4">
                      <i className="bi bi-x-circle-fill"></i>
                    </div>
                    <h3 className="mb-3">Verification Failed</h3>
                    <div className="alert alert-danger" role="alert">
                      {message}
                    </div>
                    <p className="text-muted mb-4">
                      The verification link may have expired or is invalid.
                    </p>
                    <div className="d-grid gap-2">
                      <Link href="/register" className="btn btn-gradient-primary">
                        Register Again
                      </Link>
                      <Link href="/login" className="btn btn-outline-secondary">
                        Back to Login
                      </Link>
                    </div>
                  </>
                )}
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
