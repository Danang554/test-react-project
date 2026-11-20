import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/auth'
import { profileApi } from '../api/profile'
import { useToast } from './ToastContext'

const AuthContext = createContext({
  user: null,
  token: '',
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  fetchProfile: async () => {},
  updateProfile: async () => {},
})

export function AuthProvider({ children }) {
  const toast = useToast()

  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null')
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  const isAuthenticated = !!token
  const isAdmin = !!user?.is_admin

  const setSession = useCallback((newToken, newUser) => {
    setToken(newToken || '')
    setUser(newUser || null)
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser))
    } else {
      localStorage.removeItem('user')
    }
  }, [])

  const clearSession = useCallback(() => {
    setSession('', null)
  }, [setSession])

  // Listen to 401 token expiration event from axios client
  useEffect(() => {
    const handleExpired = () => {
      clearSession()
      toast.warning('Session expired. Please log in again.')
    }
    window.addEventListener('auth:expired', handleExpired)
    return () => window.removeEventListener('auth:expired', handleExpired)
  }, [clearSession, toast])

  const login = async (credentials) => {
    setLoading(true)
    try {
      const res = await authApi.login(credentials)
      const data = res.data.data
      setSession(data.token, data.user)
      toast.success(res.data.message || 'Login successful! Welcome back.')
      return { success: true, data }
    } catch (err) {
      toast.error(
        err.displayMessage || 'Login failed. Please check your credentials.',
        'Authentication Error',
        err.validationErrors,
      )
      return { success: false, error: err }
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload) => {
    setLoading(true)
    try {
      const res = await authApi.register(payload)
      toast.success(res.data.message || 'Registration successful! You can now login.')
      return { success: true, data: res.data.data }
    } catch (err) {
      toast.error(
        err.displayMessage || 'Registration failed',
        'Registration Error',
        err.validationErrors,
      )
      return { success: false, error: err }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      if (token) {
        await authApi.logout()
      }
    } catch {
      // Ignore backend logout errors (e.g. token already expired/revoked)
    } finally {
      clearSession()
      setLoading(false)
      toast.info('You have been logged out.')
    }
  }

  const fetchProfile = async () => {
    if (!token) return null
    try {
      const res = await profileApi.getProfile()
      const userData = res.data.data
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return userData
    } catch (err) {
      if (err.response?.status === 401) {
        clearSession()
      }
      return null
    }
  }

  const updateProfile = async (payload) => {
    setLoading(true)
    try {
      const res = await profileApi.updateProfile(payload)
      const updatedUser = res.data.data
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      toast.success(res.data.message || 'Profile updated successfully')
      return { success: true, data: updatedUser }
    } catch (err) {
      toast.error(
        err.displayMessage || 'Failed to update profile',
        'Validation Error',
        err.validationErrors,
      )
      return { success: false, error: err }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        register,
        logout,
        fetchProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
