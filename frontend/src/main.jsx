import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './contexts/AuthContext'
import AuthenticatedApp from './AuthenticatedApp'
import { PostHogProvider } from 'posthog-js/react'
import './index.css'

// Import i18n configuration
import './i18n/config'

// ===================================================================
// POSTHOG CONFIGURATION
// ===================================================================
const posthogOptions = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY} options={posthogOptions}>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </PostHogProvider>
  </React.StrictMode>,
)

