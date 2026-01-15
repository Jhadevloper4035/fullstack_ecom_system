import './globals.css'
import BootstrapClient from './components/BootstrapClient'
import NavigationProgress from './components/NavigationProgress'

export const metadata = {
  title: 'Auth System - Secure Authentication',
  description: 'Production-ready authentication system with JWT and token rotation',
}

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
        <NavigationProgress />
        {children}
        <BootstrapClient />
      </body>
    </html>
  )
}
