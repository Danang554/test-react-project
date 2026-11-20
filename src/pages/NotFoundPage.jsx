import React from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 shadow-md shadow-indigo-500/10">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-2">
        404
      </h1>
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
        Page Not Found
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed">
        The route you are trying to access does not exist in this Single Page Application.
      </p>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  )
}
