import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useHealth } from '../../context/HealthContext'
import { useToast } from '../../context/ToastContext'
import { todosApi } from '../../api/todos'
import { categoriesApi } from '../../api/categories'
import { usersApi } from '../../api/users'
import TodoModal from '../../components/todo/TodoModal'
import CategoryModal from '../../components/category/CategoryModal'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'
import {
  CheckSquare,
  Clock,
  FolderKanban,
  Users,
  Plus,
  ArrowRight,
  Activity,
  CheckCircle2,
  Circle,
  Database,
  Server,
  Zap,
  Code2,
} from 'lucide-react'

export default function DashboardPage() {
  const { user, isAdmin } = useAuth()
  const { isOnline, latency, dbStatus, checkHealth } = useHealth()
  const toast = useToast()

  const [loading, setLoading] = useState(true)
  const [todos, setTodos] = useState([])
  const [totalTodos, setTotalTodos] = useState(0)
  const [categories, setCategories] = useState([])
  const [totalCategories, setTotalCategories] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)

  // Modals
  const [showTodoModal, setShowTodoModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)

  const loadDashboardData = useCallback(async () => {
    setLoading(true)
    try {
      const promises = [
        todosApi.getTodos({ page: 1, limit: 6 }),
        categoriesApi.getCategories({ page: 1, limit: 50 }),
      ]

      if (isAdmin) {
        promises.push(usersApi.getUsers({ page: 1, limit: 5 }))
      }

      const results = await Promise.allSettled(promises)

      // Process Todos
      if (results[0].status === 'fulfilled') {
        const data = results[0].value?.data?.data || []
        setTodos(data)
        setTotalTodos(results[0].value?.data?.pagination?.total_items || data.length)
      }

      // Process Categories
      if (results[1].status === 'fulfilled') {
        const catData = results[1].value?.data?.data || []
        setCategories(catData)
        setTotalCategories(results[1].value?.data?.pagination?.total_items || catData.length)
      }

      // Process Users
      if (isAdmin && results[2] && results[2].status === 'fulfilled') {
        setTotalUsers(results[2].value?.data?.pagination?.total_items || 0)
      }
    } catch {
      // Ignore background load error
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  const handleToggleComplete = async (todo) => {
    try {
      const updated = await todosApi.toggleComplete(todo.id, todo.is_completed)
      setTodos((prev) =>
        prev.map((t) => (t.id === todo.id ? { ...t, is_completed: !todo.is_completed } : t)),
      )
      toast.success(updated.data?.message || 'Todo updated')
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to update todo status')
    }
  }

  const handleSaveTodo = async (payload) => {
    setModalLoading(true)
    try {
      const res = await todosApi.createTodo(payload)
      toast.success(res.data?.message || 'Todo created successfully')
      setShowTodoModal(false)
      loadDashboardData()
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to create todo', 'Error', err.validationErrors)
    } finally {
      setModalLoading(false)
    }
  }

  const handleSaveCategory = async (payload) => {
    setModalLoading(true)
    try {
      const res = await categoriesApi.createCategory(payload)
      toast.success(res.data?.message || 'Category created successfully')
      setShowCategoryModal(false)
      loadDashboardData()
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to create category', 'Error', err.validationErrors)
    } finally {
      setModalLoading(false)
    }
  }

  const completedCount = todos.filter((t) => t.is_completed).length
  const pendingCount = todos.filter((t) => !t.is_completed).length

  return (
    <div className="space-y-6">
      {/* Welcome Header & Server Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Hi, {user?.name || 'Explorer'}!
            </h2>
            {isAdmin && (
              <span className="px-2 py-0.5 text-[11px] font-bold uppercase rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
                Admin
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Welcome to your Node.js REST API testing dashboard. Everything is connected in real-time.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTodoModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Todo</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCategoryModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Category</span>
          </button>

          <Link
            to="/api-explorer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800/60 transition"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>API Explorer</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Todos */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors duration-200">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Todos</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{totalTodos}</div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Scoped to your account</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors duration-200">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Categories</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{totalCategories}</div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Custom organizational tags</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>

        {/* Completed Rate */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors duration-200">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Completed (Recent)</span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {completedCount} <span className="text-xs text-slate-400 font-normal">/ {todos.length}</span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">{pendingCount} pending</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Backend Health & Users */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors duration-200">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {isAdmin ? 'System Users' : 'Backend Status'}
            </span>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {isAdmin ? (
                totalUsers
              ) : (
                <span className={isOnline ? 'text-emerald-500' : 'text-rose-500'}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              DB {dbStatus} &bull; {latency}ms
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            {isAdmin ? <Users className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
          </div>
        </div>
      </div>

      {/* Main Content Split: Recent Todos & Quick API Endpoints */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Todos Column (2/3 width) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  Recent Todo Items
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click the circle checkbox to toggle completion directly in Node.js backend.
                </p>
              </div>
              <Link
                to="/todos"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <LoadingSpinner text="Fetching todos from Node API..." />
            ) : todos.length === 0 ? (
              <EmptyState
                icon={CheckSquare}
                title="No tasks yet"
                description="Get started by creating your very first todo task."
                actionLabel="Create Todo"
                onAction={() => setShowTodoModal(true)}
                actionIcon={Plus}
              />
            ) : (
              <div className="space-y-2.5">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80 hover:bg-slate-100/80 dark:hover:bg-slate-800/70 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => handleToggleComplete(todo)}
                        className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer flex-shrink-0"
                      >
                        {todo.is_completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <div
                          className={`text-xs font-semibold truncate ${
                            todo.is_completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {todo.title}
                        </div>
                        {todo.description && (
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                            {todo.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                      {todo.category_name && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {todo.category_name}
                        </span>
                      )}
                      <StatusBadge status={todo.is_completed} type="todo-status" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Synchronized with MySQL table `todos`</span>
            <Link to="/trash" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              View deleted items
            </Link>
          </div>
        </div>

        {/* Right Column: Server & API Summary (1/3 width) */}
        <div className="space-y-6">
          {/* API Explorer Promotion Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-md border border-indigo-800/50 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-indigo-300 mb-4 backdrop-blur-xs">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-1.5">Interactive API Explorer</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Directly dispatch requests to all 26 Node.js REST endpoints with live payload editing, header inspection, and JSON responses.
              </p>
            </div>

            <Link
              to="/api-explorer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-950 bg-white hover:bg-slate-100 transition shadow-sm"
            >
              <span>Launch API Explorer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Categories Quick List Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Categories</h4>
              <Link
                to="/categories"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Manage
              </Link>
            </div>

            {categories.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No categories created yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 10).map((cat) => (
                  <span
                    key={cat.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span>{cat.name}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <TodoModal
        open={showTodoModal}
        onClose={() => setShowTodoModal(false)}
        onSave={handleSaveTodo}
        categories={categories}
        loading={modalLoading}
      />

      <CategoryModal
        open={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSave={handleSaveCategory}
        loading={modalLoading}
      />
    </div>
  )
}
