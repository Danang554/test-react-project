import React, { useState, useEffect } from 'react'
import ModalDialog from '../common/ModalDialog'
import LoadingSpinner from '../common/LoadingSpinner'

export default function TodoModal({
  open = false,
  onClose = () => {},
  onSave = () => {},
  initialData = null,
  categories = [],
  loading = false,
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setDescription(initialData.description || '')
      setCategoryId(initialData.category_id ? String(initialData.category_id) : '')
      setIsCompleted(!!initialData.is_completed)
    } else {
      setTitle('')
      setDescription('')
      setCategoryId('')
      setIsCompleted(false)
    }
    setErrors({})
  }, [initialData, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    } else if (title.trim().length > 255) {
      newErrors.title = 'Title cannot exceed 255 characters'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      category_id: categoryId ? Number(categoryId) : null,
      is_completed: isCompleted,
    }

    if (initialData?.id) {
      payload.id = initialData.id
    }

    onSave(payload)
  }

  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      title={initialData?.id ? 'Edit Todo Task' : 'Create New Todo'}
      description="Fill in the task details to persist in the Node.js database."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (errors.title) setErrors((prev) => ({ ...prev, title: null }))
            }}
            placeholder="e.g. Implement JWT authentication"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
          />
          {errors.title && <p className="text-[11px] text-rose-500 mt-1">{errors.title}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
          >
            <option value="">-- No Category (Uncategorized) --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Additional details, markdown notes or acceptance criteria..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition resize-none"
          />
        </div>

        {/* Status checkbox (for edit or create) */}
        <div className="flex items-center gap-2 pt-1">
          <input
            id="todo-completed"
            type="checkbox"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 dark:bg-slate-950"
          />
          <label
            htmlFor="todo-completed"
            className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Mark as Completed
          </label>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? <LoadingSpinner size="xs" inline /> : initialData?.id ? 'Save Changes' : 'Create Todo'}
          </button>
        </div>
      </form>
    </ModalDialog>
  )
}
