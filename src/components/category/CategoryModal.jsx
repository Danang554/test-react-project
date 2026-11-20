import React, { useState, useEffect } from 'react'
import ModalDialog from '../common/ModalDialog'
import LoadingSpinner from '../common/LoadingSpinner'

export default function CategoryModal({
  open = false,
  onClose = () => {},
  onSave = () => {},
  initialData = null,
  loading = false,
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setDescription(initialData.description || '')
    } else {
      setName('')
      setDescription('')
    }
    setErrors({})
  }, [initialData, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!name.trim()) {
      newErrors.name = 'Category name is required'
    } else if (name.trim().length > 100) {
      newErrors.name = 'Name cannot exceed 100 characters'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const payload = {
      name: name.trim(),
      description: description.trim() || null,
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
      title={initialData?.id ? 'Edit Category' : 'Create New Category'}
      description="Categories help organize your todo tasks into structured groups."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Category Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (errors.name) setErrors((prev) => ({ ...prev, name: null }))
            }}
            placeholder="e.g. Work, Personal, Urgent"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
          />
          {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
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
            placeholder="Brief explanation of this category..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition resize-none"
          />
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
            {loading ? <LoadingSpinner size="xs" inline /> : initialData?.id ? 'Save Changes' : 'Create Category'}
          </button>
        </div>
      </form>
    </ModalDialog>
  )
}
