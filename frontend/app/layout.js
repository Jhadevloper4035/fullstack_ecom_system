'use client'

import "../public/scss/main.scss";
import "../public/css/image-compare-viewer.min.css";
import BootstrapClient from './components/BootstrapClient'
import NavigationProgress from './components/NavigationProgress'
import { AuthProvider } from '@/context/AuthContext'
import Context from '@/context/Context';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
      </head>
      <body>
        <AuthProvider>
          <Context >
            <NavigationProgress />
            {children}
            <BootstrapClient />
          </Context>
        </AuthProvider>
      </body>
    </html>
  )
}
