import { AuthProvider } from '../contexts/AuthContext'
import '../styles/index.css'

export const metadata = {
  title: 'Careers Page Builder',
  description: 'Build and manage your careers page',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
