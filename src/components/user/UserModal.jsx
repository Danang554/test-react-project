import React, { useState, useEffect } from 'react'
import ModalDialog from '../common/ModalDialog'
import LoadingSpinner from '../common/LoadingSpinner'

export default function UserModal({
  open = false,
  onClose = () => {},
  onSave = () => {},
  initialData = null,
  loading = false,
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setEmail(initialData.email || '')
      setPassword('')
      setIsAdmin(!!initialData.is_admin)
    } else {
      setName('')
      setEmail('')
      setPassword('')
      setIsAdmin(false)
    }
    setErrors({})
  }, [initialData, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    if (!email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = 'Must be a valid email address'
    }

    if (!initialData?.id) {
      if (!password || password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }
    } else if (password && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      is_admin: isAdmin,
    }

    if (password) {
      payload.password = password
    }

    if (initialData?.id) {
      payload.id = initialData.id
    }

    onSave(payload)
  }

  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      title={initialData?.id ? 'Edit User Account' : 'Create New User'}
      description="Manage application users and assign administrative roles."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (errors.name) setErrors((prev) => ({ ...prev, name: null }))
            }}
            placeholder="John Doe"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
          />
          {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors((prev) => ({ ...prev, email: null }))
            }}
            placeholder="john@example.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
          />
          {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {initialData?.id ? 'New Password (leave empty to keep current)' : 'Password *'}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors((prev) => ({ ...prev, password: null }))
            }}
            placeholder={initialData?.id ? '••••••••' : 'Min 6 characters'}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
          />
          {errors.password && <p className="text-[11px] text-rose-500 mt-1">{errors.password}</p>}
        </div>

        {/* Admin Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            id="user-is-admin"
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 dark:bg-slate-950"
          />
          <label
            htmlFor="user-is-admin"
            className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Grant Administrator Privileges (Admin Role)
          </label>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? <LoadingSpinner size="xs" inline /> : initialData?.id ? 'Save Changes' : 'Create User'}
          </button>
        </div>
      </form>
    </ModalDialog>
  )
}
