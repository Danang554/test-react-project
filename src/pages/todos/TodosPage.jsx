import React, { useState, useEffect, useCallback, useRef } from 'react'
import { todosApi } from '../../api/todos'
import { categoriesApi } from '../../api/categories'
import { useToast } from '../../context/ToastContext'
import TodoModal from '../../components/todo/TodoModal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import PaginationBar from '../../components/common/PaginationBar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import { formatDate } from '../../utils/formatters'
import {
  CheckSquare,
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
  X,
  Calendar,
  Folder,
} from 'lucide-react'

export default function TodosPage() {
  const toast = useToast()

  const [todos, setTodos] = useState([])
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total_items: 0, total_pages: 1 })
  const [loading, setLoading] = useState(true)

  // Filters
  const [searchInput, setSearchInput] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('') // '', 'true', 'false'

  // Create / Edit Modal
  const [showModal, setShowModal] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)

  // Delete Confirm Dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [todoToDelete, setTodoToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const searchTimeoutRef = useRef(null)

  const loadCategories = useCallback(async () => {
    try {
      const res = await categoriesApi.getCategories({ page: 1, limit: 100 })
      setCategories(res.data?.data || [])
    } catch {
      // Ignore
    }
  }, [])

  const loadTodos = useCallback(
    async (page = 1, limit = 10) => {
      setLoading(true)
      try {
        const params = {
          page,
          limit,
        }
        if (searchInput.trim()) params.search = searchInput.trim()
        if (selectedCategory !== '') params.category_id = Number(selectedCategory)
        if (selectedStatus !== '') params.is_completed = selectedStatus === 'true'

        const res = await todosApi.getTodos(params)
        setTodos(res.data?.data || [])
        if (res.data?.pagination) {
          setPagination(res.data.pagination)
        }
      } catch (err) {
        toast.error(err.displayMessage || 'Failed to fetch todos')
      } finally {
        setLoading(false)
      }
    },
    [searchInput, selectedCategory, selectedStatus, toast],
  )

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  useEffect(() => {
    loadTodos(1, pagination.limit)
  }, [selectedCategory, selectedStatus, loadTodos])

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchInput(val)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => {
      loadTodos(1, pagination.limit)
    }, 350)
  }

  const clearFilters = () => {
    setSearchInput('')
    setSelectedCategory('')
    setSelectedStatus('')
  }

  const handleToggleComplete = async (todo) => {
    try {
      await todosApi.toggleComplete(todo.id, todo.is_completed)
      setTodos((prev) =>
        prev.map((t) => (t.id === todo.id ? { ...t, is_completed: !todo.is_completed } : t)),
      )
      toast.success(todo.is_completed ? 'Task marked as pending' : 'Task marked as completed')
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to toggle status')
    }
  }

  const openCreateModal = () => {
    setEditingTodo(null)
    setShowModal(true)
  }

  const openEditModal = async (todo) => {
    try {
      const res = await todosApi.getTodoById(todo.id)
      setEditingTodo(res.data?.data || todo)
    } catch {
      setEditingTodo(todo)
    }
    setShowModal(true)
  }

  const handleSaveTodo = async (payload) => {
    setModalLoading(true)
    try {
      if (payload.id) {
        await todosApi.updateTodo(payload.id, payload)
        toast.success('Todo updated successfully')
      } else {
        await todosApi.createTodo(payload)
        toast.success('Todo created successfully')
      }
      setShowModal(false)
      loadTodos(pagination.page, pagination.limit)
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to save todo', 'Validation Error', err.validationErrors)
    } finally {
      setModalLoading(false)
    }
  }

  const confirmDelete = (todo) => {
    setTodoToDelete(todo)
    setShowDeleteConfirm(true)
  }

  const handleDelete = async () => {
    if (!todoToDelete) return
    setDeleteLoading(true)
    try {
      await todosApi.deleteTodo(todoToDelete.id)
      toast.success('Todo moved to trash (soft deleted)')
      setShowDeleteConfirm(false)
      setTodoToDelete(null)
      loadTodos(pagination.page, pagination.limit)
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to delete todo')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Todo Management
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
              {pagination.total_items} items
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create, view, filter, edit, complete, and soft-delete user-scoped todos.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Todo</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search todos by title or description..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-36">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="false">Pending</option>
            <option value="true">Completed</option>
          </select>
        </div>

        {/* Clear Filters */}
        {(searchInput || selectedCategory || selectedStatus) && (
          <button
            type="button"
            onClick={clearFilters}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Todo List / Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading todos from Node.js database..." />
        ) : todos.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="No todos found"
            description={
              searchInput || selectedCategory || selectedStatus
                ? 'No tasks matched your active filter criteria.'
                : 'You have no active todos. Create one to get started!'
            }
            actionLabel="Create Todo"
            onAction={openCreateModal}
            actionIcon={Plus}
          />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition group"
              >
                {/* Left: Checkbox & Info */}
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => handleToggleComplete(todo)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer flex-shrink-0"
                    title={todo.is_completed ? 'Mark pending' : 'Mark completed'}
                  >
                    {todo.is_completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        className={`text-xs sm:text-sm font-semibold ${
                          todo.is_completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {todo.title}
                      </h4>
                      <StatusBadge status={todo.is_completed} type="todo-status" />
                    </div>

                    {todo.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {todo.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 mt-2 text-[11px] text-slate-400 dark:text-slate-500">
                      {todo.category_name && (
                        <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
                          <Folder className="w-3 h-3 text-indigo-500" />
                          <span>{todo.category_name}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(todo.created_at)}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => openEditModal(todo)}
                    className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    title="Edit Todo"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmDelete(todo)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                    title="Delete Todo (Soft Delete)"
                  >
                    <Trash2 className="w-4 h-4" />
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
              onPageChange={(p) => loadTodos(p, pagination.limit)}
              onLimitChange={(l) => loadTodos(1, l)}
            />
          </div>
        )}
      </div>

      {/* Todo Modal */}
      <TodoModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveTodo}
        initialData={editingTodo}
        categories={categories}
        loading={modalLoading}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Move to Trash?"
        message={`Are you sure you want to soft delete "${todoToDelete?.title}"? You can restore it later in the Trash Bin.`}
        confirmText="Move to Trash"
        type="danger"
        loading={deleteLoading}
      />
    </div>
  )
}
