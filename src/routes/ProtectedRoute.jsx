import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function ProtectedRoute({ children, requiresAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const toast = useToast()
  const location = useLocation()

  if (loading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  if (requiresAdmin && !isAdmin) {
    toast.warning('Access denied: Administrator privileges required.')
    return <Navigate to="/" replace />
  }

  return children
}
