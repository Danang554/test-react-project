import React, { useState, useEffect, useCallback, useRef } from 'react'
import { usersApi } from '../../api/users'
import { useToast } from '../../context/ToastContext'
import UserModal from '../../components/user/UserModal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import PaginationBar from '../../components/common/PaginationBar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import { formatDate } from '../../utils/formatters'
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Shield,
  User as UserIcon,
  X,
  Mail,
  Calendar,
} from 'lucide-react'

export default function UsersPage() {
  const toast = useToast()

  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total_items: 0, total_pages: 1 })
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')

  // Create / Edit Modal
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)

  // Delete Confirm Dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const searchTimeoutRef = useRef(null)

  const loadUsers = useCallback(
    async (page = 1, limit = 10) => {
      setLoading(true)
      try {
        const params = { page, limit }
        if (searchInput.trim()) params.search = searchInput.trim()

        const res = await usersApi.getUsers(params)
        setUsers(res.data?.data || [])
        if (res.data?.pagination) {
          setPagination(res.data.pagination)
        }
      } catch (err) {
        toast.error(err.displayMessage || 'Failed to fetch users')
      } finally {
        setLoading(false)
      }
    },
    [searchInput, toast],
  )

  useEffect(() => {
    loadUsers(1, pagination.limit)
  }, [loadUsers])

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchInput(val)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => {
      loadUsers(1, pagination.limit)
    }, 350)
  }

  const openCreateModal = () => {
    setEditingUser(null)
    setShowModal(true)
  }

  const openEditModal = async (u) => {
    try {
      const res = await usersApi.getUserById(u.id)
      setEditingUser(res.data?.data || u)
    } catch {
      setEditingUser(u)
    }
    setShowModal(true)
  }

  const handleSaveUser = async (payload) => {
    setModalLoading(true)
    try {
      if (payload.id) {
        await usersApi.updateUser(payload.id, payload)
        toast.success('User updated successfully')
      } else {
        await usersApi.createUser(payload)
        toast.success('User created successfully')
      }
      setShowModal(false)
      loadUsers(pagination.page, pagination.limit)
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to save user', 'Validation Error', err.validationErrors)
    } finally {
      setModalLoading(false)
    }
  }

  const confirmDelete = (u) => {
    setUserToDelete(u)
    setShowDeleteConfirm(true)
  }

  const handleDelete = async () => {
    if (!userToDelete) return
    setDeleteLoading(true)
    try {
      await usersApi.deleteUser(userToDelete.id)
      toast.success('User soft deleted')
      setShowDeleteConfirm(false)
      setUserToDelete(null)
      loadUsers(pagination.page, pagination.limit)
    } catch (err) {
      toast.error(err.displayMessage || 'Failed to delete user')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              User Management
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60">
              {pagination.total_items} registered
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Administrator endpoint controls: create users, assign privileges, and audit accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New User</span>
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
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
          />
        </div>

        {searchInput && (
          <button
            type="button"
            onClick={() => {
              setSearchInput('')
              loadUsers(1, pagination.limit)
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading users from Node API..." />
        ) : users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users found"
            description="No users matched your search criteria."
            actionLabel="Create User"
            onAction={openCreateModal}
            actionIcon={Plus}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">User</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Registered</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          {u.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {u.name}
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" />
                            <span>{u.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <StatusBadge status={u.is_admin} type="role" />
                    </td>

                    <td className="py-4 px-6 text-slate-400 dark:text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(u.created_at)}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(u)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDelete(u)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                          title="Delete User (Soft)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {pagination.total_items > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-800 p-2">
            <PaginationBar
              pagination={pagination}
              onPageChange={(p) => loadUsers(p, pagination.limit)}
              onLimitChange={(l) => loadUsers(1, l)}
            />
          </div>
        )}
      </div>

      {/* User Modal */}
      <UserModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveUser}
        initialData={editingUser}
        loading={modalLoading}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Move User to Trash?"
        message={`Are you sure you want to soft delete user "${userToDelete?.name}"? You can restore it later in the Trash Bin.`}
        confirmText="Move to Trash"
        type="danger"
        loading={deleteLoading}
      />
    </div>
  )
}
