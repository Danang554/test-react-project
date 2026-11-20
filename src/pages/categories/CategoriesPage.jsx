import React, { useState, useEffect, useCallback, useRef } from 'react'
import { categoriesApi } from '../../api/categories'
import { useToast } from '../../context/ToastContext'
import CategoryModal from '../../components/category/CategoryModal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import PaginationBar from '../../components/common/PaginationBar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { formatDate } from '../../utils/formatters'
import {
  FolderKanban,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Calendar,
} from 'lucide-react'

export default function CategoriesPage() {
  const toast = useToast()

  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total_items: 0, total_pages: 1 })
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')

  // Create / Edit Modal
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)

  // Delete Confirm Dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const searchTimeoutRef = useRef(null)

  const loadCategories = useCallback(
    async (page = 1, limit = 10) => {
      setLoading(true)
      try {
        const params = {
          page,
          limit,
        }
        if (searchInput.trim()) params.search = searchInput.trim()

        const res = await categoriesApi.getCategories(params)
        setCategories(res.data?.data || [])
        if (res.data?.pagination) {
          setPagination(res.data.pagination)
        }
      } catch (err) {
        toast.error(err.displayMessage || 'Failed to fetch categories')
      } finally {
        setLoading(false)
      }
    },
    [searchInput, toast],
  )

  useEffect(() => {
    loadCategories(1, pagination.limit)
  }, [loadCategories])

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchInput(val)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => {
      loadCategories(1, pagination.limit)
    }, 350)
  }

  const openCreateModal = () => {
    setEditingCategory(null)
    setShowModal(true)
  }

  const openEditModal = async (cat) => {
    try {
      const res = await categoriesApi.getCategoryById(cat.id)
      setEditingCategory(res.data?.data || cat)
    } catch {
      setEditingCategory(cat)
    }
    setShowModal(true)
  }

  const handleSaveCategory = async (payload) => {
    setModalLoading(true)
    try {
      if (payload.id) {
        await categoriesApi.updateCategory(payload.id, payload)
        toast.success('Category updated successfully')
      } else {
        await categoriesApi.createCategory(payload)
        toast.success('Category created successfully')
      }
      setShowModal(false)
      loadCategories(pagination.page, pagination.limit)
    } catch (err) {
      toast.error(
        err.displayMessage || 'Failed to save category',
        'Validation Error',
        err.validationErrors,
      )
    } finally {
      setModalLoading(false)
    }
  }

  const confirmDelete = (cat) => {
    setCategoryToDelete(cat)
    setShowDeleteConfirm(true)
  }

  const handleDelete = async () => {
    if (!categoryToDelete) return
    setDeleteLoading(true)
    try {
      await categoriesApi.deleteCategory(categoryToDelete.id)
      toast.success('Category moved to trash (soft deleted)')
      setShowDeleteConfirm(false)
      setCategoryToDelete(null)
      loadCategories(pagination.page, pagination.limit)
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to delete category')
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
              Categories
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
              {pagination.total_items} items
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Organize tasks into categories with full CRUD & soft-delete capabilities.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search categories by name or description..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
          />
        </div>

        {searchInput && (
          <button
            type="button"
            onClick={() => {
              setSearchInput('')
              loadCategories(1, pagination.limit)
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Categories Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading categories from Node.js database..." />
        ) : categories.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No categories found"
            description="Create categories to label and filter your todos."
            actionLabel="Create Category"
            onAction={openCreateModal}
            actionIcon={Plus}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-indigo-500/30 transition group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                        <FolderKanban className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {cat.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        type="button"
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => confirmDelete(cat)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
                        title="Delete (Soft)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[32px]">
                    {cat.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(cat.created_at)}</span>
                  </span>
                  <span className="font-mono text-[10px]">ID: #{cat.id}</span>
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
              onPageChange={(p) => loadCategories(p, pagination.limit)}
              onLimitChange={(l) => loadCategories(1, l)}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      <CategoryModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveCategory}
        initialData={editingCategory}
        loading={modalLoading}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Move Category to Trash?"
        message={`Are you sure you want to soft delete "${categoryToDelete?.name}"? You can restore it later in the Trash Bin.`}
        confirmText="Move to Trash"
        type="danger"
        loading={deleteLoading}
      />
    </div>
  )
}
