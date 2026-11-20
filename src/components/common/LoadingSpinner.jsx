import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function LoadingSpinner({
  size = 'md',
  className = '',
  text = '',
  inline = false,
}) {
  const sizeClasses = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }

  const spinner = (
    <Loader2
      className={cn(
        'animate-spin text-indigo-600 dark:text-indigo-400',
        sizeClasses[size] || sizeClasses.md,
        className,
      )}
    />
  )

  if (inline) {
    return (
      <span className="inline-flex items-center gap-2">
        {spinner}
        {text && <span className="text-xs text-slate-500 dark:text-slate-400">{text}</span>}
      </span>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
      {spinner}
      {text && <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{text}</p>}
    </div>
  )
}
