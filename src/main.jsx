import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { logFrontendError } from './utils/logger'

// Global Unhandled Rejection & Error listeners
window.addEventListener('error', (event) => {
  logFrontendError(event.error || event.message, {
    file: event.filename,
    line: event.lineno,
    col: event.colno,
    info: 'Global window.onerror',
  })
})

window.addEventListener('unhandledrejection', (event) => {
  logFrontendError(event.reason, {
    info: 'Unhandled Promise Rejection',
  })
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
