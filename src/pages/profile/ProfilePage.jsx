import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import StatusBadge from '../../components/common/StatusBadge'
import { formatDate } from '../../utils/formatters'
import {
  UserCheck,
  Save,
  Mail,
  User,
  KeyRound,
  Shield,
  Calendar,
  IdCard,
} from 'lucide-react'

export default function ProfilePage() {
  const { user, fetchProfile, updateProfile } = useAuth()
  const toast = useToast()

  const [loadingProfile, setLoadingProfile] = useState(true)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    const initProfile = async () => {
      setLoadingProfile(true)
      const data = await fetchProfile()
      if (data) {
        setName(data.name || '')
        setEmail(data.email || '')
      } else if (user) {
        setName(user.name || '')
        setEmail(user.email || '')
      }
      setLoadingProfile(false)
    }
    initProfile()
  }, [])

  const handleUpdate = async (e) => {
    e.preventDefault()
    const errors = {}

    if (!name.trim() || name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }
    if (!email.trim()) {
      errors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errors.email = 'Must be a valid email address'
    }
    if (password) {
      if (password.length < 6) {
        errors.password = 'New password must be at least 6 characters'
      }
      if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setSaving(true)
    const payload = {
      name: name.trim(),
      email: email.trim(),
    }
    if (password) {
      payload.password = password
    }

    const res = await updateProfile(payload)
    setSaving(false)

    if (res.success) {
      setPassword('')
      setConfirmPassword('')
      setFormErrors({})
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Profile Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors duration-200">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-indigo-500/20">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {user?.name || 'My Profile'}
              </h2>
              <StatusBadge status={user?.is_admin} type="role" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user?.email}</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
          <IdCard className="w-4 h-4 text-indigo-500" />
          <span>User ID #{user?.id}</span>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="mb-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Account Information & Security
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Updates are sent directly to <code className="font-mono text-indigo-500">PATCH /api/profile</code>.
          </p>
        </div>

        {loadingProfile ? (
          <LoadingSpinner text="Fetching current profile..." />
        ) : (
          <form onSubmit={handleUpdate} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: null }))
                    }}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                  />
                </div>
                {formErrors.name && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: null }))
                    }}
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                  />
                </div>
                {formErrors.email && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.email}</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
                Change Password (Optional)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (formErrors.password)
                          setFormErrors((prev) => ({ ...prev, password: null }))
                      }}
                      placeholder="Leave empty to keep unchanged"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                    />
                  </div>
                  {formErrors.password && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        if (formErrors.confirmPassword)
                          setFormErrors((prev) => ({ ...prev, confirmPassword: null }))
                      }}
                      placeholder="Re-type new password"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                    />
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <LoadingSpinner size="xs" inline text="Saving..." />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
