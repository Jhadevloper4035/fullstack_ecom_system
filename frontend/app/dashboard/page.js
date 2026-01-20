'use client'

import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()

  const [activeTab, setActiveTab] = useState('overview')
  const [sessionInfo, setSessionInfo] = useState(null)

  /* ---------------- AUTH GUARDS ---------------- */

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [loading, user, router])

  /* ---------------- SESSION INFO ---------------- */

  useEffect(() => {
    if (!user) return

    const loginTime = localStorage.getItem('loginTime')

    setSessionInfo({
      loginTime: loginTime ? new Date(loginTime) : new Date(),
      browser: getBrowserInfo(),
      os: getOSInfo(),
      userAgent: navigator.userAgent.substring(0, 50) + '...',
    })
  }, [user])

  const getBrowserInfo = () => {
    const ua = navigator.userAgent
    if (ua.includes('Firefox')) return 'Firefox'
    if (ua.includes('Chrome')) return 'Chrome'
    if (ua.includes('Safari')) return 'Safari'
    if (ua.includes('Edge')) return 'Edge'
    return 'Unknown'
  }

  const getOSInfo = () => {
    const platform = navigator.platform
    if (platform.includes('Win')) return 'Windows'
    if (platform.includes('Mac')) return 'macOS'
    if (platform.includes('Linux')) return 'Linux'
    return platform
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    const units = [
      [31536000, 'year'],
      [2592000, 'month'],
      [86400, 'day'],
      [3600, 'hour'],
      [60, 'minute'],
    ]

    for (const [unitSeconds, label] of units) {
      const interval = Math.floor(seconds / unitSeconds)
      if (interval >= 1) return `${interval} ${label}${interval > 1 ? 's' : ''} ago`
    }

    return `${seconds} seconds ago`
  }

  /* ---------------- LOADING STATE ---------------- */

  if (loading || !user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" />
      </div>
    )
  }

  /* ---------------- UI ---------------- */

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-opacity-50">
        <div className="container">
          <span className="navbar-brand fw-bold">🔐 Auth System</span>

          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                <i className="bi bi-person-circle me-1" />
                {user.email}
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button className="dropdown-item" onClick={() => setActiveTab('profile')}>
                    Profile
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => setActiveTab('security')}>
                    Security
                  </button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={logout}>
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-5">
        <div className="card mb-4">
          <div className="card-body">
            <h2>Welcome back, {user.email.split('@')[0]} 👋</h2>
            <p className="text-muted">
              Last login: {sessionInfo ? getTimeAgo(sessionInfo.loginTime) : 'Just now'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          {['overview', 'profile', 'security', 'sessions'].map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="card">
            <div className="card-body">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Created:</strong> {formatDate(user.createdAt)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
