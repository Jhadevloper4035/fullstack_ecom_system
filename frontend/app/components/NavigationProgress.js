'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(false)
  }, [pathname, searchParams])

  return (
    <>
      {loading && (
        <div className="progress-bar-container">
          <div className="progress-bar"></div>
        </div>
      )}

      <style jsx>{`
        .progress-bar-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          z-index: 99999;
          background: rgba(255, 255, 255, 0.2);
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%);
          background-size: 200% 100%;
          animation: loading 1.5s ease-in-out infinite;
          box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
        }

        @keyframes loading {
          0% {
            width: 0%;
            background-position: 0% 50%;
          }
          50% {
            width: 70%;
            background-position: 100% 50%;
          }
          100% {
            width: 100%;
            background-position: 0% 50%;
          }
        }
      `}</style>
    </>
  )
}
