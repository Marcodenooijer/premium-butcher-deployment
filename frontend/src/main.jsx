import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './contexts/AuthContext'
import AuthenticatedApp from './AuthenticatedApp'
import './index.css'

// Import i18n configuration
import './i18n/config'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  </React.StrictMode>,
)
