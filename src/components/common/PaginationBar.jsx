import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function PaginationBar({
  pagination = { page: 1, limit: 10, total_items: 0, total_pages: 1 },
  onPageChange = () => {},
  onLimitChange = null,
  className = '',
}) {
  const { page = 1, limit = 10, total_items = 0, total_pages = 1 } = pagination

  const startItem = total_items === 0 ? 0 : (page - 1) * limit + 1
  const endItem = Math.min(page * limit, total_items)

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-xs text-slate-500 dark:text-slate-400',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span>
          Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{startItem}</span> to{' '}
          <span className="font-semibold text-slate-800 dark:text-slate-200">{endItem}</span> of{' '}
          <span className="font-semibold text-slate-800 dark:text-slate-200">{total_items}</span> items
        </span>

        {onLimitChange && (
          <div className="flex items-center gap-1.5 ml-4">
            <span className="text-[11px]">Per page:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3 py-1 font-medium text-slate-700 dark:text-slate-300">
          Page {page} of {Math.max(1, total_pages)}
        </span>

        <button
          type="button"
          disabled={page >= total_pages}
          onClick={() => onPageChange(page + 1)}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
