import React from 'react'
import { cn } from '../../utils/cn'

export default function StatusBadge({ status, type = 'status', className = '' }) {
  // Methods badge: GET, POST, PATCH, DELETE
  if (type === 'method') {
    const methodUpper = String(status).toUpperCase()
    const methodColors = {
      GET: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      POST: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      PATCH: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      PUT: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      DELETE: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    }
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center px-2 py-0.5 font-mono text-[11px] font-bold rounded-md border tracking-wide uppercase',
          methodColors[methodUpper] || 'bg-slate-500/10 text-slate-600 border-slate-500/20',
          className,
        )}
      >
        {methodUpper}
      </span>
    )
  }

  // Boolean or String completion status
  if (type === 'todo-status') {
    const isCompleted = status === true || status === 1 || status === 'true'
    return isCompleted ? (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60',
          className,
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Completed
      </span>
    ) : (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60',
          className,
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        Pending
      </span>
    )
  }

  // Role badge (Admin vs User)
  if (type === 'role') {
    const isAdmin = status === true || status === 1 || status === 'true' || status === 'admin'
    return isAdmin ? (
      <span
        className={cn(
          'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 uppercase tracking-wider',
          className,
        )}
      >
        Admin
      </span>
    ) : (
      <span
        className={cn(
          'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
          className,
        )}
      >
        User
      </span>
    )
  }

  // General Status Badge
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
        className,
      )}
    >
      {String(status)}
    </span>
  )
}
