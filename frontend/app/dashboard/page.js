'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [sessionInfo, setSessionInfo] = useState(null)

  useEffect(() => {
    loadUser()
    loadSessionInfo()
  }, [])

  const loadUser = async () => {
    try {
      const response = await authApi.getCurrentUser()
      console.log('API Response:', response)

      if (response.success) {
        // Handle nested user object structure
        const userData = response.user?.user?.user || response.user?.user || response.user
        setUser(userData)
        console.log('User data loaded:', userData)
      }
    } catch (error) {
      console.error('Error loading user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadSessionInfo = () => {
    // Get session info from browser
    const loginTime = localStorage.getItem('loginTime')
    const userAgent = navigator.userAgent
    const platform = navigator.platform

    setSessionInfo({
      loginTime: loginTime ? new Date(loginTime) : new Date(),
      browser: getBrowserInfo(),
      os: getOSInfo(),
      userAgent: userAgent.substring(0, 50) + '...'
    })
  }

  const getBrowserInfo = () => {
    const ua = navigator.userAgent
    if (ua.indexOf('Firefox') > -1) return 'Firefox'
    if (ua.indexOf('Chrome') > -1) return 'Chrome'
    if (ua.indexOf('Safari') > -1) return 'Safari'
    if (ua.indexOf('Edge') > -1) return 'Edge'
    return 'Unknown'
  }

  const getOSInfo = () => {
    const platform = navigator.platform
    if (platform.indexOf('Win') > -1) return 'Windows'
    if (platform.indexOf('Mac') > -1) return 'macOS'
    if (platform.indexOf('Linux') > -1) return 'Linux'
    return platform
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await authApi.logout()
      localStorage.removeItem('loginTime')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/login')
    }
  }

  const handleLogoutAll = async () => {
    if (confirm('Are you sure you want to logout from all devices? This will invalidate all your active sessions.')) {
      try {
        await authApi.logoutAll()
        localStorage.removeItem('loginTime')
        router.push('/login')
      } catch (error) {
        console.error('Logout all error:', error)
        router.push('/login')
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeAgo = (date) => {
    if (!date) return 'Unknown'
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)

    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + ' years ago'

    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + ' months ago'

    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + ' days ago'

    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + ' hours ago'

    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + ' minutes ago'

    return Math.floor(seconds) + ' seconds ago'
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-opacity-50">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">
            🔐 Auth System
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle me-1"></i>
                  {user?.email}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); setActiveTab('profile'); }}>
                      <i className="bi bi-person me-2"></i>
                      Profile
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); setActiveTab('addresses'); }}>
                      <i className="bi bi-geo-alt me-2"></i>
                      Addresses
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); setActiveTab('security'); }}>
                      <i className="bi bi-shield-lock me-2"></i>
                      Security
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout} disabled={loggingOut}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      {loggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogoutAll}>
                      <i className="bi bi-shield-x me-2"></i>
                      Logout All Devices
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Welcome Card */}
            <div className="card card-auth mb-4 fade-in">
              <div className="card-body p-4">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h2 className="mb-2">Welcome back, {user?.email?.split('@')[0]}! 👋</h2>
                    <p className="text-muted mb-0">
                      Last login: {sessionInfo ? getTimeAgo(sessionInfo.loginTime) : 'Just now'}
                    </p>
                  </div>
                  <div className="col-md-4 text-md-end mt-3 mt-md-0">
                    {user.isVerified ? (
                      <span className="badge bg-success fs-6 px-3 py-2">
                        <i className="bi bi-check-circle me-1"></i>
                        Verified Account
                      </span>
                    ) : (
                      <span className="badge bg-warning text-dark fs-6 px-3 py-2">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        Pending Verification
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <ul className="nav nav-tabs mb-4 bg-white rounded-top border-0 shadow-sm" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <i className="bi bi-speedometer2 me-2"></i>
                  Overview
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="bi bi-person me-2"></i>
                  Profile
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'addresses' ? 'active' : ''}`}
                  onClick={() => setActiveTab('addresses')}
                >
                  <i className="bi bi-geo-alt me-2"></i>
                  Addresses
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  <i className="bi bi-shield-lock me-2"></i>
                  Security
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'sessions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sessions')}
                >
                  <i className="bi bi-pc-display me-2"></i>
                  Sessions
                </button>
              </li>
            </ul>

            {/* Tab Content */}
            <div className="tab-content">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="fade-in">
                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title">
                            <i className="bi bi-person-badge text-primary me-2"></i>
                            Account Information
                          </h5>
                          <hr />
                          <div className="mb-3">
                            <label className="text-muted small">Email Address</label>
                            <p className="mb-0 fw-semibold">{user?.email}</p>
                          </div>
                          <div className="mb-3">
                            <label className="text-muted small">User ID</label>
                            <p className="mb-0 fw-semibold font-monospace small text-break">{user?.id}</p>
                          </div>
                          <div className="mb-3">
                            <label className="text-muted small">Account Created</label>
                            <p className="mb-0">{formatDate(user?.createdAt)}</p>
                          </div>
                          <div>
                            <label className="text-muted small">Account Status</label>
                            <p className="mb-0">
                              <span className="badge bg-success">Active</span>
                              {user?.isVerified && (
                                <span className="badge bg-info ms-2">Verified</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title">
                            <i className="bi bi-shield-check text-success me-2"></i>
                            Security Features
                          </h5>
                          <hr />
                          <ul className="list-unstyled mb-0">
                            <li className="mb-2 d-flex align-items-center">
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                              <span>JWT Token Authentication</span>
                            </li>
                            <li className="mb-2 d-flex align-items-center">
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                              <span>Automatic Token Rotation</span>
                            </li>
                            <li className="mb-2 d-flex align-items-center">
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                              <span>Bcrypt Password Hashing</span>
                            </li>
                            <li className="mb-2 d-flex align-items-center">
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                              <span>Rate Limiting Protection</span>
                            </li>
                            <li className="mb-2 d-flex align-items-center">
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                              <span>Session Management</span>
                            </li>
                            <li className="mb-0 d-flex align-items-center">
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                              <span>HTTPS Encryption</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="row g-4">
                    <div className="col-md-4">
                      <div className="card border-0 shadow-sm text-center h-100">
                        <div className="card-body py-4">
                          <div className="display-4 text-primary mb-2">
                            <i className="bi bi-lightning-charge-fill"></i>
                          </div>
                          <h3 className="mb-1">Fast</h3>
                          <p className="text-muted mb-0">Average 15ms response time</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="card border-0 shadow-sm text-center h-100">
                        <div className="card-body py-4">
                          <div className="display-4 text-success mb-2">
                            <i className="bi bi-shield-lock-fill"></i>
                          </div>
                          <h3 className="mb-1">Secure</h3>
                          <p className="text-muted mb-0">Enterprise-grade security</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="card border-0 shadow-sm text-center h-100">
                        <div className="card-body py-4">
                          <div className="display-4 text-info mb-2">
                            <i className="bi bi-layers-fill"></i>
                          </div>
                          <h3 className="mb-1">Scalable</h3>
                          <p className="text-muted mb-0">Production-ready architecture</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="card border-0 shadow-sm fade-in">
                  <div className="card-body p-4">
                    <h4 className="card-title mb-4">
                      <i className="bi bi-person-circle me-2"></i>
                      Profile Details
                    </h4>

                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <label className="form-label text-muted small">Email Address</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-envelope"></i>
                          </span>
                          <input
                            type="email"
                            className="form-control"
                            value={user?.email || ''}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-md-6 mb-4">
                        <label className="form-label text-muted small">User ID</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-fingerprint"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control font-monospace small"
                            value={user?.id || ''}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-md-6 mb-4">
                        <label className="form-label text-muted small">Account Created</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-calendar-plus"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            value={formatDate(user?.createdAt) || 'N/A'}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-md-6 mb-4">
                        <label className="form-label text-muted small">Last Updated</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-clock-history"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            value={formatDate(user?.updatedAt) || 'N/A'}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-md-6 mb-4">
                        <label className="form-label text-muted small">Email Verification Status</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-patch-check"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            value={user?.isVerified ? 'Verified ✓' : 'Not Verified'}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-md-6 mb-4">
                        <label className="form-label text-muted small">Account Status</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-activity"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            value="Active"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    <div className="alert alert-info d-flex align-items-center">
                      <i className="bi bi-info-circle-fill me-2"></i>
                      <div>
                        <strong>Profile Information:</strong> Your profile data is securely stored and encrypted.
                        Contact support if you need to update your email address.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="fade-in">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="card-title mb-0">
                          <i className="bi bi-geo-alt me-2"></i>
                          Saved Addresses
                        </h4>
                        <button className="btn btn-primary">
                          <i className="bi bi-plus-circle me-1"></i>
                          Add New Address
                        </button>
                      </div>

                      {user?.addresses && user.addresses.length > 0 ? (
                        <div className="row g-4">
                          {user.addresses.map((address, index) => (
                            <div key={address._id || index} className="col-12">
                              <div className={`card h-100 ${address.isDefault ? 'border-primary' : 'border-0'}`}>
                                <div className="card-body">
                                  <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                      <h5 className="mb-1">
                                        <i className={`bi ${address.type === 'home' ? 'bi-house-door' : address.type === 'work' ? 'bi-briefcase' : 'bi-geo-alt'} me-2`}></i>
                                        {address.fullName}
                                        {address.isDefault && (
                                          <span className="badge bg-primary ms-2">Default</span>
                                        )}
                                      </h5>
                                      <p className="text-muted small mb-0 text-uppercase">
                                        <i className="bi bi-tag me-1"></i>
                                        {address.type}
                                      </p>
                                    </div>
                                    <div className="dropdown">
                                      <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                        <i className="bi bi-three-dots-vertical"></i>
                                      </button>
                                      <ul className="dropdown-menu dropdown-menu-end">
                                        <li>
                                          <a className="dropdown-item" href="#">
                                            <i className="bi bi-pencil me-2"></i>
                                            Edit
                                          </a>
                                        </li>
                                        {!address.isDefault && (
                                          <li>
                                            <a className="dropdown-item" href="#">
                                              <i className="bi bi-star me-2"></i>
                                              Set as Default
                                            </a>
                                          </li>
                                        )}
                                        <li>
                                          <hr className="dropdown-divider" />
                                        </li>
                                        <li>
                                          <a className="dropdown-item text-danger" href="#">
                                            <i className="bi bi-trash me-2"></i>
                                            Delete
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>

                                  <div className="row g-3">
                                    <div className="col-md-6">
                                      <div className="d-flex align-items-start">
                                        <i className="bi bi-geo-alt-fill text-primary me-2 mt-1"></i>
                                        <div className="flex-grow-1">
                                          <small className="text-muted d-block">Address</small>
                                          <p className="mb-0">
                                            {address.addressLine1}
                                            {address.addressLine2 && <>, {address.addressLine2}</>}
                                            {address.landmark && (
                                              <><br /><small className="text-muted">Near {address.landmark}</small></>
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-md-6">
                                      <div className="d-flex align-items-start">
                                        <i className="bi bi-building text-primary me-2 mt-1"></i>
                                        <div className="flex-grow-1">
                                          <small className="text-muted d-block">City & State</small>
                                          <p className="mb-0">{address.city}, {address.state}</p>
                                          <small className="text-muted">{address.country} - {address.postalCode}</small>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-md-6">
                                      <div className="d-flex align-items-start">
                                        <i className="bi bi-telephone text-primary me-2 mt-1"></i>
                                        <div className="flex-grow-1">
                                          <small className="text-muted d-block">Phone Numbers</small>
                                          <p className="mb-0">{address.phoneNumber}</p>
                                          {address.alternatePhone && address.alternatePhone !== address.phoneNumber && (
                                            <small className="text-muted">Alt: {address.alternatePhone}</small>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {address.deliveryInstructions && (
                                      <div className="col-md-6">
                                        <div className="d-flex align-items-start">
                                          <i className="bi bi-info-circle text-primary me-2 mt-1"></i>
                                          <div className="flex-grow-1">
                                            <small className="text-muted d-block">Delivery Instructions</small>
                                            <p className="mb-0 small">{address.deliveryInstructions}</p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  <hr className="my-3" />

                                  <div className="d-flex justify-content-between align-items-center">
                                    <small className="text-muted">
                                      <i className="bi bi-clock me-1"></i>
                                      Added {getTimeAgo(address.createdAt)}
                                    </small>
                                    <div className="btn-group btn-group-sm">
                                      <button className="btn btn-outline-primary">
                                        <i className="bi bi-pencil"></i> Edit
                                      </button>
                                      {!address.isDefault && (
                                        <button className="btn btn-outline-danger">
                                          <i className="bi bi-trash"></i>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-5">
                          <div className="display-1 text-muted mb-3">
                            <i className="bi bi-geo-alt"></i>
                          </div>
                          <h5 className="mb-3">No Addresses Found</h5>
                          <p className="text-muted mb-4">
                            You haven't added any addresses yet. Add your first address to get started.
                          </p>
                          <button className="btn btn-primary">
                            <i className="bi bi-plus-circle me-2"></i>
                            Add Your First Address
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="fade-in">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                          <h5 className="card-title">
                            <i className="bi bi-key text-warning me-2"></i>
                            Password Security
                          </h5>
                          <hr />
                          <p className="text-muted">
                            Your password is securely hashed using bcrypt with salt rounds.
                          </p>
                          <ul className="list-unstyled mb-3">
                            <li className="mb-2">
                              <i className="bi bi-check-circle text-success me-2"></i>
                              Minimum 8 characters
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-check-circle text-success me-2"></i>
                              Bcrypt hashing algorithm
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-check-circle text-success me-2"></i>
                              Never stored in plain text
                            </li>
                          </ul>
                          <button
                            className="btn btn-outline-primary w-100"
                            onClick={() => router.push('/forgot-password')}
                          >
                            <i className="bi bi-arrow-clockwise me-2"></i>
                            Change Password
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                          <h5 className="card-title">
                            <i className="bi bi-shield-lock text-success me-2"></i>
                            Token Security
                          </h5>
                          <hr />
                          <p className="text-muted">
                            Your session is protected with JWT tokens and automatic rotation.
                          </p>
                          <ul className="list-unstyled mb-3">
                            <li className="mb-2">
                              <i className="bi bi-check-circle text-success me-2"></i>
                              Access token: 15 minutes
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-check-circle text-success me-2"></i>
                              Refresh token: 7 days
                            </li>
                            <li className="mb-2">
                              <i className="bi bi-check-circle text-success me-2"></i>
                              Automatic token rotation
                            </li>
                          </ul>
                          <button
                            className="btn btn-outline-danger w-100"
                            onClick={handleLogoutAll}
                          >
                            <i className="bi bi-shield-x me-2"></i>
                            Revoke All Sessions
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="card border-0 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title">
                            <i className="bi bi-diagram-3 text-info me-2"></i>
                            Security Timeline
                          </h5>
                          <hr />
                          <div className="timeline">
                            <div className="timeline-item mb-3">
                              <div className="d-flex align-items-start">
                                <div className="timeline-marker bg-success text-white rounded-circle p-2 me-3">
                                  <i className="bi bi-check"></i>
                                </div>
                                <div className="flex-grow-1">
                                  <h6 className="mb-1">Account Created</h6>
                                  <p className="text-muted small mb-0">
                                    {formatDate(user?.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {user?.isVerified && (
                              <div className="timeline-item mb-3">
                                <div className="d-flex align-items-start">
                                  <div className="timeline-marker bg-info text-white rounded-circle p-2 me-3">
                                    <i className="bi bi-patch-check"></i>
                                  </div>
                                  <div className="flex-grow-1">
                                    <h6 className="mb-1">Email Verified</h6>
                                    <p className="text-muted small mb-0">
                                      Successfully verified email address
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="timeline-item">
                              <div className="d-flex align-items-start">
                                <div className="timeline-marker bg-primary text-white rounded-circle p-2 me-3">
                                  <i className="bi bi-box-arrow-in-right"></i>
                                </div>
                                <div className="flex-grow-1">
                                  <h6 className="mb-1">Current Session</h6>
                                  <p className="text-muted small mb-0">
                                    Logged in {sessionInfo ? getTimeAgo(sessionInfo.loginTime) : 'just now'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sessions Tab */}
              {activeTab === 'sessions' && (
                <div className="card border-0 shadow-sm fade-in">
                  <div className="card-body p-4">
                    <h4 className="card-title mb-4">
                      <i className="bi bi-pc-display me-2"></i>
                      Active Sessions
                    </h4>

                    <div className="alert alert-info d-flex align-items-start mb-4">
                      <i className="bi bi-info-circle-fill me-3 mt-1"></i>
                      <div>
                        <strong>About Sessions:</strong> This is your current active session.
                        You can revoke all sessions using the "Logout All Devices" button to sign out from all locations.
                      </div>
                    </div>

                    {/* Current Session */}
                    <div className="card border-success mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h5 className="card-title mb-1">
                              <i className="bi bi-circle-fill text-success me-2" style={{ fontSize: '0.5rem' }}></i>
                              Current Session
                            </h5>
                            <p className="text-muted small mb-0">This device</p>
                          </div>
                          <span className="badge bg-success">Active Now</span>
                        </div>

                        <div className="row g-3">
                          <div className="col-md-6">
                            <div className="d-flex align-items-center">
                              <i className="bi bi-browser-chrome text-primary me-2 fs-5"></i>
                              <div>
                                <small className="text-muted d-block">Browser</small>
                                <strong>{sessionInfo?.browser || 'Unknown'}</strong>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="d-flex align-items-center">
                              <i className="bi bi-laptop text-primary me-2 fs-5"></i>
                              <div>
                                <small className="text-muted d-block">Operating System</small>
                                <strong>{sessionInfo?.os || 'Unknown'}</strong>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="d-flex align-items-center">
                              <i className="bi bi-clock text-primary me-2 fs-5"></i>
                              <div>
                                <small className="text-muted d-block">Login Time</small>
                                <strong>
                                  {sessionInfo ? getTimeAgo(sessionInfo.loginTime) : 'Just now'}
                                </strong>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="d-flex align-items-center">
                              <i className="bi bi-geo-alt text-primary me-2 fs-5"></i>
                              <div>
                                <small className="text-muted d-block">Location</small>
                                <strong>Current Location</strong>
                              </div>
                            </div>
                          </div>
                        </div>

                        <hr className="my-3" />

                        <div className="d-flex justify-content-between align-items-center">
                          <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
                            <i className="bi bi-box-arrow-right me-1"></i>
                            Logout This Device
                          </button>
                          <button className="btn btn-sm btn-outline-warning" onClick={handleLogoutAll}>
                            <i className="bi bi-shield-x me-1"></i>
                            Logout All Devices
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Session Management Info */}
                    <div className="card bg-light border-0">
                      <div className="card-body">
                        <h6 className="mb-3">
                          <i className="bi bi-info-circle me-2"></i>
                          Session Management
                        </h6>
                        <ul className="mb-0 ps-3">
                          <li className="mb-2">Sessions automatically expire after 7 days of inactivity</li>
                          <li className="mb-2">You can manually logout from all devices at any time</li>
                          <li className="mb-2">Tokens are automatically rotated for enhanced security</li>
                          <li className="mb-0">All sessions use encrypted JWT tokens</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}