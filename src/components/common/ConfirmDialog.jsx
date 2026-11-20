import React from 'react'
import ModalDialog from './ModalDialog'
import LoadingSpinner from './LoadingSpinner'
import { AlertTriangle, RotateCcw, Trash2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function ConfirmDialog({
  open = false,
  onClose = () => {},
  onConfirm = () => {},
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger', // danger | warning | info | restore
  loading = false,
}) {
  const typeIcons = {
    danger: Trash2,
    warning: AlertTriangle,
    restore: RotateCcw,
    info: AlertTriangle,
  }

  const IconComponent = typeIcons[type] || Trash2

  const typeColors = {
    danger: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400',
    warning: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
    restore: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
    info: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400',
  }

  const btnColors = {
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20',
    restore: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
    info: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20',
  }

  return (
    <ModalDialog open={open} onClose={onClose} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center">
        <div
          className={cn(
            'w-12 h-12 rounded-2xl flex items-center justify-center mb-4',
            typeColors[type] || typeColors.danger,
          )}
        >
          <IconComponent className="w-6 h-6" />
        </div>

        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">{title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-xs">{message}</p>

        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={cn(
              'flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md transition cursor-pointer disabled:opacity-50',
              btnColors[type] || btnColors.danger,
            )}
          >
            {loading ? <LoadingSpinner size="xs" inline /> : confirmText}
          </button>
        </div>
      </div>
    </ModalDialog>
  )
}
