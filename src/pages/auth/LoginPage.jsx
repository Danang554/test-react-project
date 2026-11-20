import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { LogIn, KeyRound, Mail, UserCheck, Shield } from 'lucide-react'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const redirectPath = location.state?.from?.pathname || '/'

  // const setDemoCredentials = (e, p) => {
  //   setEmail(e)
  //   setPassword(p)
  //   setErrors({})
  // }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!email.trim()) {
      newErrors.email = 'Email address is required'
    }
    if (!password) {
      newErrors.password = 'Password is required'
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const res = await login({
      email: email.trim(),
      password,
    })

    if (res.success) {
      navigate(redirectPath, { replace: true })
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Sign in to your account</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Authenticate using JWT to access protected Node.js endpoints.
        </p>
      </div>

      {/* Quick Demo Accounts Helper */}
      {/* <div className="mb-6 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Quick Demo Accounts
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">Default pass: password</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setDemoCredentials('admin@example.com', 'password')}
            className="flex items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 text-left transition group cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            <div className="min-w-0">
              <div className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate">Admin</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-400 truncate">admin@example.com</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDemoCredentials('user@example.com', 'password')}
            className="flex items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-left transition group cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <div className="min-w-0">
              <div className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate">Test User</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-400 truncate">user@example.com</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDemoCredentials('shin@example.com', 'password')}
            className="flex items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 text-left transition group cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            <div className="min-w-0">
              <div className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate">Shin (Admin)</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-400 truncate">shin@example.com</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDemoCredentials('nao@example.com', 'password')}
            className="flex items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-left transition group cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <div className="min-w-0">
              <div className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate">Nao (User)</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-400 truncate">nao@example.com</div>
            </div>
          </button>
        </div>
      </div> */}

      <form onSubmit={handleSubmit} className="space-y-4">
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
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }))
              }}
              placeholder="you@example.com"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
            />
          </div>
          {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }))
              }}
              placeholder="••••••••"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
            />
          </div>
          {errors.password && <p className="text-[11px] text-rose-500 mt-1">{errors.password}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition cursor-pointer disabled:opacity-50 mt-2"
        >
          {loading ? (
            <LoadingSpinner size="xs" inline text="Signing in..." />
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Don't have an account yet?{' '}
        <Link
          to="/auth/register"
          className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Create Account
        </Link>
      </div>
    </div>
  )
}
