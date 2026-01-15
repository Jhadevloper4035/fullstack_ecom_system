import Link from 'next/link'

export default function Home() {
  return (
    <div className="auth-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card card-auth fade-in">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h1 className="logo-text mb-2">🔐 Auth System</h1>
                  <p className="text-muted">
                    Production-ready authentication with JWT & Token Rotation
                  </p>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <Link href="/login" className="btn btn-gradient-primary btn-lg w-100">
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Login
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <Link href="/register" className="btn btn-outline-primary btn-lg w-100">
                      <i className="bi bi-person-plus me-2"></i>
                      Register
                    </Link>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="features">
                  <h5 className="text-center mb-3">Features</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="bi bi-shield-check text-success me-2"></i>
                      JWT Authentication with Token Rotation
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-envelope-check text-success me-2"></i>
                      Email Verification
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-key text-success me-2"></i>
                      Secure Password Reset
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-speedometer2 text-success me-2"></i>
                      Rate Limiting Protection
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-lock text-success me-2"></i>
                      BCrypt Password Hashing
                    </li>
                  </ul>
                </div>

                <div className="text-center mt-4">
                  <p className="text-muted small mb-0">
                    Secured with industry best practices
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-3">
              <p className="text-white small">
                Built with Next.js 15, Express, PostgreSQL, Redis & RabbitMQ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
