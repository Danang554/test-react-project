import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import { HealthProvider } from './context/HealthContext'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <HealthProvider>
            <RouterProvider router={router} />
          </HealthProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
