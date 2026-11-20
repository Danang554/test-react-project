import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import ThemeToggle from '../components/common/ThemeToggle'
import ToastContainer from '../components/common/ToastContainer'
import { Zap } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 transition-colors duration-200 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-8 z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
              NodeTodo API
            </h1>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              Frontend Client Tester
            </span>
          </div>
        </Link>
        <ThemeToggle />
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 z-10">
        <Outlet />
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500 z-10">
        Connected to Node.js Backend &bull; Clean Architecture
      </div>

      <ToastContainer />
    </div>
  )
}
