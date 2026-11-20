import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { todosApi } from '../../api/todos'
import { categoriesApi } from '../../api/categories'
import { usersApi } from '../../api/users'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import PaginationBar from '../../components/common/PaginationBar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import { formatDate } from '../../utils/formatters'
import {
  Trash2,
  RotateCcw,
  AlertOctagon,
  CheckSquare,
  FolderKanban,
  Users,
  Search,
  X,
  Calendar,
} from 'lucide-react'
import { cn } from '../../utils/cn'

export default function TrashPage() {
  const { isAdmin } = useAuth()
  const toast = useToast()

  const [activeTab, setActiveTab] = useState('todos') // 'todos' | 'categories' | 'users'
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total_items: 0, total_pages: 1 })
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')

  // Dialog State
  const [showConfirm, setShowConfirm] = useState(false)
  const [actionType, setActionType] = useState('restore') // 'restore' | 'permanent'
  const [targetItem, setTargetItem] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const searchTimeoutRef = useRef(null)

  const loadDeletedItems = useCallback(
    async (page = 1, limit = 10) => {
      setLoading(true)
      try {
        const params = { page, limit }
        if (searchInput.trim()) params.search = searchInput.trim()

        let res
        if (activeTab === 'todos') {
          res = await todosApi.getDeletedTodos(params)
        } else if (activeTab === 'categories') {
          res = await categoriesApi.getDeletedCategories(params)
        } else if (activeTab === 'users' && isAdmin) {
          res = await usersApi.getDeletedUsers(params)
        }

        if (res?.data) {
          setItems(res.data.data || [])
          if (res.data.pagination) {
            setPagination(res.data.pagination)
          }
        }
      } catch (err) {
        toast.error(err.displayMessage || 'Failed to fetch deleted items')
      } finally {
        setLoading(false)
      }
    },
    [activeTab, searchInput, isAdmin, toast],
  )

  useEffect(() => {
    loadDeletedItems(1, pagination.limit)
  }, [activeTab, loadDeletedItems])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSearchInput('')
  }

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchInput(val)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => {
      loadDeletedItems(1, pagination.limit)
    }, 350)
  }

  const askRestore = (item) => {
    setActionType('restore')
    setTargetItem(item)
    setShowConfirm(true)
  }

  const askPermanentDelete = (item) => {
    setActionType('permanent')
    setTargetItem(item)
    setShowConfirm(true)
  }

  const handleConfirmAction = async () => {
    if (!targetItem) return
    setActionLoading(true)
    const id = targetItem.id

    try {
      if (actionType === 'restore') {
        if (activeTab === 'todos') {
          await todosApi.restoreTodo(id)
        } else if (activeTab === 'categories') {
          await categoriesApi.restoreCategory(id)
        } else if (activeTab === 'users') {
          await usersApi.restoreUser(id)
        }
        toast.success(`Item restored successfully`)
      } else {
        if (activeTab === 'todos') {
          await todosApi.permanentDeleteTodo(id)
        } else if (activeTab === 'categories') {
          await categoriesApi.permanentDeleteCategory(id)
        } else if (activeTab === 'users') {
          await usersApi.permanentDeleteUser(id)
        }
        toast.success(`Item permanently deleted`)
      }

      setShowConfirm(false)
      setTargetItem(null)
      loadDeletedItems(pagination.page, pagination.limit)
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to perform action')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Trash Bin (Soft Deleted Records)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
              {pagination.total_items} in trash
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Restore records back into active status or purge them permanently from database.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => handleTabChange('todos')}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer',
              activeTab === 'todos'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
            )}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Todos</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('categories')}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer',
              activeTab === 'categories'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
            )}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Categories</span>
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => handleTabChange('users')}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer',
                activeTab === 'users'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
              )}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Users</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder={`Search deleted ${activeTab}...`}
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
          />
        </div>

        {searchInput && (
          <button
            type="button"
            onClick={() => {
              setSearchInput('')
              loadDeletedItems(1, pagination.limit)
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Table / List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner text={`Fetching deleted ${activeTab}...`} />
        ) : items.length === 0 ? (
          <EmptyState
            icon={Trash2}
            title={`Trash bin for ${activeTab} is clean`}
            description="No deleted records exist in this category."
          />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {item.title || item.name}
                    </h4>
                    {activeTab === 'todos' && (
                      <StatusBadge status={item.is_completed} type="todo-status" />
                    )}
                    {activeTab === 'users' && (
                      <StatusBadge status={item.is_admin} type="role" />
                    )}
                  </div>

                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-1">
                    {item.description || item.email || 'No description.'}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Deleted: {formatDate(item.deleted_at || item.updated_at)}</span>
                    </span>
                    <span className="font-mono text-[10px]">ID: #{item.id}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => askRestore(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/60 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => askPermanentDelete(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800/60 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Purge</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {pagination.total_items > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-800 p-2">
            <PaginationBar
              pagination={pagination}
              onPageChange={(p) => loadDeletedItems(p, pagination.limit)}
              onLimitChange={(l) => loadDeletedItems(1, l)}
            />
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmAction}
        title={actionType === 'restore' ? 'Restore Record?' : 'Permanently Delete Record?'}
        message={
          actionType === 'restore'
            ? `Restore "${targetItem?.title || targetItem?.name}" back to the active list?`
            : `WARNING: This will PERMANENTLY remove "${targetItem?.title || targetItem?.name}" from the database. This action CANNOT be undone.`
        }
        confirmText={actionType === 'restore' ? 'Yes, Restore' : 'Yes, Delete Permanently'}
        type={actionType === 'restore' ? 'restore' : 'danger'}
        loading={actionLoading}
      />
    </div>
  )
}
