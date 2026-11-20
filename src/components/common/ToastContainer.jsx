import React from 'react'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { cn } from '../../utils/cn'

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (!toasts || toasts.length === 0) return null

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const styles = {
    success: 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-100',
    error: 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800/80 text-rose-900 dark:text-rose-100',
    warning: 'bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-100',
    info: 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-200 dark:border-indigo-800/80 text-indigo-900 dark:text-indigo-100',
  }

  const iconColors = {
    success: 'text-emerald-500',
    error: 'text-rose-500',
    warning: 'text-amber-500',
    info: 'text-indigo-500',
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const IconComponent = icons[toast.type] || Info
        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5',
              styles[toast.type] || styles.info,
            )}
          >
            <IconComponent
              className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconColors[toast.type] || iconColors.info)}
            />
            <div className="flex-1 min-w-0">
              {toast.title && <h5 className="text-xs font-bold leading-tight">{toast.title}</h5>}
              <p className="text-xs mt-0.5 leading-relaxed opacity-90">{toast.message}</p>
              {toast.validationErrors && (
                <div className="mt-2 text-[11px] font-mono bg-white/50 dark:bg-black/30 p-2 rounded-lg border border-black/5 dark:border-white/5 space-y-0.5">
                  {Array.isArray(toast.validationErrors) ? (
                    toast.validationErrors.map((e, idx) => (
                      <div key={idx}>&bull; {e.message || JSON.stringify(e)}</div>
                    ))
                  ) : (
                    <div>&bull; {JSON.stringify(toast.validationErrors)}</div>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg opacity-60 hover:opacity-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
