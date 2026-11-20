import React, { useState, useMemo } from 'react'
import apiClient from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import {
  Code2,
  Play,
  Copy,
  Check,
  Server,
  Shield,
  Layers,
  ArrowRight,
  RotateCcw,
  Search,
  Key,
} from 'lucide-react'
import { cn } from '../../utils/cn'

const ENDPOINTS_DEF = [
  // Health
  {
    id: 'health',
    group: 'Health',
    method: 'GET',
    path: '/health',
    description: 'Check service & database connectivity status',
    auth: false,
    params: [],
    body: null,
  },
  // Auth
  {
    id: 'auth-register',
    group: 'Auth',
    method: 'POST',
    path: '/api/auth/register',
    description: 'Register a new user account in Node.js backend',
    auth: false,
    params: [],
    body: JSON.stringify(
      {
        name: 'React Tester',
        email: `tester_${Math.floor(Math.random() * 9000 + 1000)}@example.com`,
        password: 'password123',
      },
      null,
      2,
    ),
  },
  {
    id: 'auth-login',
    group: 'Auth',
    method: 'POST',
    path: '/api/auth/login',
    description: 'Login with credentials and receive JWT bearer token',
    auth: false,
    params: [],
    body: JSON.stringify(
      {
        email: 'admin@example.com',
        password: 'password',
      },
      null,
      2,
    ),
  },
  {
    id: 'auth-logout',
    group: 'Auth',
    method: 'POST',
    path: '/api/auth/logout',
    description: 'Revoke and blacklist current JWT token in database',
    auth: true,
    params: [],
    body: null,
  },
  // Profile
  {
    id: 'profile-get',
    group: 'Profile',
    method: 'GET',
    path: '/api/profile',
    description: 'Retrieve current authenticated user profile',
    auth: true,
    params: [],
    body: null,
  },
  {
    id: 'profile-patch',
    group: 'Profile',
    method: 'PATCH',
    path: '/api/profile',
    description: 'Update current authenticated user profile',
    auth: true,
    params: [],
    body: JSON.stringify(
      {
        name: 'Updated Name',
        email: 'admin@example.com',
      },
      null,
      2,
    ),
  },
  // Category
  {
    id: 'category-list',
    group: 'Category',
    method: 'GET',
    path: '/api/category',
    description: 'Get list of user categories with pagination & search',
    auth: true,
    params: [
      { name: 'page', value: '1', enabled: true },
      { name: 'limit', value: '10', enabled: true },
      { name: 'search', value: '', enabled: false },
    ],
    body: null,
  },
  {
    id: 'category-create',
    group: 'Category',
    method: 'POST',
    path: '/api/category',
    description: 'Create a new user category',
    auth: true,
    params: [],
    body: JSON.stringify(
      {
        name: 'Urgent Tasks',
        description: 'Priority tasks requiring prompt attention',
      },
      null,
      2,
    ),
  },
  {
    id: 'category-detail',
    group: 'Category',
    method: 'GET',
    path: '/api/category/:id',
    description: 'Get category detail by ID',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    params: [],
    body: null,
  },
  {
    id: 'category-update',
    group: 'Category',
    method: 'PATCH',
    path: '/api/category/:id',
    description: 'Update category by ID',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    params: [],
    body: JSON.stringify(
      {
        name: 'Renamed Category',
        description: 'Updated category description',
      },
      null,
      2,
    ),
  },
  {
    id: 'category-delete',
    group: 'Category',
    method: 'DELETE',
    path: '/api/category/:id',
    description: 'Soft delete category by ID',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    params: [],
    body: null,
  },
  {
    id: 'category-deleted-list',
    group: 'Category',
    method: 'GET',
    path: '/api/category/deleted',
    description: 'Get list of soft-deleted categories',
    auth: true,
    params: [
      { name: 'page', value: '1', enabled: true },
      { name: 'limit', value: '10', enabled: true },
      { name: 'search', value: '', enabled: false },
    ],
    body: null,
  },
  {
    id: 'category-restore',
    group: 'Category',
    method: 'PATCH',
    path: '/api/category/:id/restore',
    description: 'Restore soft-deleted category by ID',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    params: [],
    body: null,
  },
  {
    id: 'category-permanent',
    group: 'Category',
    method: 'DELETE',
    path: '/api/category/:id/permanent',
    description: 'Permanently purge category by ID from MySQL',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    params: [],
    body: null,
  },
  // Todo
  {
    id: 'todo-list',
    group: 'Todo',
    method: 'GET',
    path: '/api/todo',
    description: 'Get creator-scoped todos with pagination & filter',
    auth: true,
    params: [
      { name: 'page', value: '1', enabled: true },
      { name: 'limit', value: '10', enabled: true },
      { name: 'search', value: '', enabled: false },
      { name: 'is_completed', value: '', enabled: false },
      { name: 'category_id', value: '', enabled: false },
    ],
    body: null,
  },
  {
    id: 'todo-create',
    group: 'Todo',
    method: 'POST',
    path: '/api/todo',
    description: 'Create a new todo task',
    auth: true,
    params: [],
    body: JSON.stringify(
      {
        title: 'Complete REST API test suite',
        description: 'Dispatched directly from interactive API Explorer',
        category_id: null,
        is_completed: false,
      },
      null,
      2,
    ),
  },
  {
    id: 'todo-detail',
    group: 'Todo',
    method: 'GET',
    path: '/api/todo/:id',
    description: 'Get detail of single todo by ID',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    params: [],
    body: null,
  },
  {
    id: 'todo-update',
    group: 'Todo',
    method: 'PATCH',
    path: '/api/todo/:id',
    description: 'Update todo title, description, category or completion',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    params: [],
    body: JSON.stringify(
      {
        title: 'Updated Todo Title',
        description: 'New description content',
        is_completed: true,
      },
      null,
      2,
    ),
  },
  {
    id: 'todo-delete',
    group: 'Todo',
    method: 'DELETE',
    path: '/api/todo/:id',
    description: 'Soft delete todo by ID (moves to trash)',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    params: [],
    body: null,
  },
  {
    id: 'todo-deleted-list',
    group: 'Todo',
    method: 'GET',
    path: '/api/todo/deleted',
    description: 'Get list of soft-deleted todos in trash',
    auth: true,
    params: [
      { name: 'page', value: '1', enabled: true },
      { name: 'limit', value: '10', enabled: true },
      { name: 'search', value: '', enabled: false },
    ],
    body: null,
  },
  {
    id: 'todo-restore',
    group: 'Todo',
    method: 'PATCH',
    path: '/api/todo/:id/restore',
    description: 'Restore soft-deleted todo from trash',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    params: [],
    body: null,
  },
  {
    id: 'todo-permanent',
    group: 'Todo',
    method: 'DELETE',
    path: '/api/todo/:id/permanent',
    description: 'Permanently purge todo from database',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    params: [],
    body: null,
  },
  // User (Admin)
  {
    id: 'user-list',
    group: 'User (Admin)',
    method: 'GET',
    path: '/api/user',
    description: 'Get list of users with pagination (Admin only)',
    auth: true,
    params: [
      { name: 'page', value: '1', enabled: true },
      { name: 'limit', value: '10', enabled: true },
      { name: 'search', value: '', enabled: false },
    ],
    body: null,
  },
  {
    id: 'user-create',
    group: 'User (Admin)',
    method: 'POST',
    path: '/api/user',
    description: 'Create new user account directly as Administrator',
    auth: true,
    params: [],
    body: JSON.stringify(
      {
        name: 'Admin Created User',
        email: `managed_${Math.floor(Math.random() * 9000 + 1000)}@example.com`,
        password: 'password123',
        is_admin: false,
      },
      null,
      2,
    ),
  },
  {
    id: 'user-detail',
    group: 'User (Admin)',
    method: 'GET',
    path: '/api/user/:id',
    description: 'Get user detail by ID (Admin only)',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    params: [],
    body: null,
  },
  {
    id: 'user-update',
    group: 'User (Admin)',
    method: 'PATCH',
    path: '/api/user/:id',
    description: 'Update user name, email, or role (Admin only)',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    params: [],
    body: JSON.stringify(
      {
        name: 'Updated User Name',
        is_admin: true,
      },
      null,
      2,
    ),
  },
  {
    id: 'user-delete',
    group: 'User (Admin)',
    method: 'DELETE',
    path: '/api/user/:id',
    description: 'Soft delete user by ID (Admin only)',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    params: [],
    body: null,
  },
  {
    id: 'user-deleted-list',
    group: 'User (Admin)',
    method: 'GET',
    path: '/api/user/deleted',
    description: 'Get list of soft-deleted users (Admin only)',
    auth: true,
    params: [
      { name: 'page', value: '1', enabled: true },
      { name: 'limit', value: '10', enabled: true },
      { name: 'search', value: '', enabled: false },
    ],
    body: null,
  },
  {
    id: 'user-restore',
    group: 'User (Admin)',
    method: 'PATCH',
    path: '/api/user/:id/restore',
    description: 'Restore soft-deleted user (Admin only)',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    params: [],
    body: null,
  },
  {
    id: 'user-permanent',
    group: 'User (Admin)',
    method: 'DELETE',
    path: '/api/user/:id/permanent',
    description: 'Permanently purge user record from MySQL (Admin only)',
    auth: true,
    pathParam: { name: 'id', value: '1' },
    params: [],
    body: null,
  },
]

export default function ApiExplorerPage() {
  const { token, isAuthenticated } = useAuth()
  const toast = useToast()

  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS_DEF[0])
  const [filterGroup, setFilterGroup] = useState('ALL')
  const [searchFilter, setSearchFilter] = useState('')

  // Request state
  const [pathParamVal, setPathParamVal] = useState('1')
  const [queryParams, setQueryParams] = useState([])
  const [bodyText, setBodyText] = useState('')
  const [includeAuth, setIncludeAuth] = useState(true)

  // Response state
  const [sending, setSending] = useState(false)
  const [responseStatus, setResponseStatus] = useState(null)
  const [responseDuration, setResponseDuration] = useState(null)
  const [responseHeaders, setResponseHeaders] = useState(null)
  const [responseData, setResponseData] = useState(null)
  const [copied, setCopied] = useState(false)

  // Initialize selected endpoint state
  const selectEndpoint = (ep) => {
    setSelectedEndpoint(ep)
    setPathParamVal(ep.pathParam?.value || '1')
    setQueryParams(
      ep.params
        ? ep.params.map((p) => ({ ...p, enabled: p.enabled !== undefined ? p.enabled : true }))
        : [],
    )
    setBodyText(ep.body || '')
    setIncludeAuth(ep.auth)
    setResponseStatus(null)
    setResponseDuration(null)
    setResponseHeaders(null)
    setResponseData(null)
  }

  const groups = useMemo(() => {
    const set = new Set(ENDPOINTS_DEF.map((e) => e.group))
    return ['ALL', ...Array.from(set)]
  }, [])

  const filteredEndpoints = useMemo(() => {
    return ENDPOINTS_DEF.filter((e) => {
      const matchGroup = filterGroup === 'ALL' || e.group === filterGroup
      const matchSearch =
        !searchFilter ||
        e.path.toLowerCase().includes(searchFilter.toLowerCase()) ||
        e.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
        e.method.toLowerCase().includes(searchFilter.toLowerCase())
      return matchGroup && matchSearch
    })
  }, [filterGroup, searchFilter])

  // Computed URL
  const resolvedUrl = useMemo(() => {
    let p = selectedEndpoint.path
    if (selectedEndpoint.pathParam) {
      p = p.replace(`:${selectedEndpoint.pathParam.name}`, pathParamVal || '1')
    }
    const activeParams = queryParams.filter((qp) => qp.enabled && qp.value)
    if (activeParams.length > 0) {
      const qs = activeParams
        .map((qp) => `${encodeURIComponent(qp.name)}=${encodeURIComponent(qp.value)}`)
        .join('&')
      p += `?${qs}`
    }
    return p
  }, [selectedEndpoint, pathParamVal, queryParams])

  const handleSend = async () => {
    setSending(true)
    setResponseStatus(null)
    setResponseDuration(null)
    setResponseHeaders(null)
    setResponseData(null)

    const startTime = Date.now()

    let url = selectedEndpoint.path
    if (selectedEndpoint.pathParam) {
      url = url.replace(`:${selectedEndpoint.pathParam.name}`, pathParamVal || '1')
    }

    const params = {}
    queryParams.forEach((qp) => {
      if (qp.enabled && qp.value !== '') {
        params[qp.name] = qp.value
      }
    })

    let data = null
    if (bodyText && ['POST', 'PATCH', 'PUT'].includes(selectedEndpoint.method)) {
      try {
        data = JSON.parse(bodyText)
      } catch (err) {
        toast.error('Invalid JSON body syntax', 'Format Error')
        setSending(false)
        return
      }
    }

    const headers = {}
    if (includeAuth && token) {
      headers.Authorization = `Bearer ${token}`
    } else if (!includeAuth) {
      headers.Authorization = undefined
    }

    try {
      const res = await apiClient({
        method: selectedEndpoint.method.toLowerCase(),
        url,
        params,
        data,
        headers,
      })

      const duration = Date.now() - startTime
      setResponseDuration(duration)
      setResponseStatus(res.status)
      setResponseHeaders(res.headers)
      setResponseData(res.data)
      toast.success(`${selectedEndpoint.method} ${url} completed with HTTP ${res.status}`)
    } catch (err) {
      const duration = Date.now() - startTime
      setResponseDuration(duration)
      if (err.response) {
        setResponseStatus(err.response.status)
        setResponseHeaders(err.response.headers)
        setResponseData(err.response.data)
      } else {
        setResponseStatus(0)
        setResponseData({ error: err.message || 'Network connection refused' })
      }
      toast.error(
        err.displayMessage || `Request failed with HTTP ${err.response?.status || 'ERR'}`,
      )
    } finally {
      setSending(false)
    }
  }

  const copyResponse = () => {
    if (!responseData) return
    navigator.clipboard.writeText(JSON.stringify(responseData, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.info('Response JSON copied to clipboard')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Interactive API Explorer
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 font-mono">
              26 Endpoints
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dispatch live HTTP requests against all Node.js backend routes with real-time inspection.
          </p>
        </div>

        {/* Global Bearer Token Status Indicator */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Key className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-slate-500">JWT Token:</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
              {token ? `${token.substring(0, 10)}...` : 'Not Logged In'}
            </span>
          </div>
        </div>
      </div>

      {/* Explorer Layout: Left Side List & Right Side Runner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Endpoint Directory (5 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter endpoints..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
            />
          </div>

          {/* Group Chips */}
          <div className="flex flex-wrap gap-1 pb-1 border-b border-slate-100 dark:border-slate-800">
            {groups.map((grp) => (
              <button
                key={grp}
                type="button"
                onClick={() => setFilterGroup(grp)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer',
                  filterGroup === grp
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
                )}
              >
                {grp}
              </button>
            ))}
          </div>

          {/* Endpoints Scroll List */}
          <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredEndpoints.map((ep) => {
              const isSelected = selectedEndpoint.id === ep.id
              return (
                <button
                  key={ep.id}
                  type="button"
                  onClick={() => selectEndpoint(ep)}
                  className={cn(
                    'w-full text-left p-2.5 rounded-2xl border transition cursor-pointer flex flex-col gap-1',
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 shadow-xs'
                      : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={ep.method} type="method" />
                      <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                        {ep.path}
                      </span>
                    </div>
                    {ep.auth && (
                      <Shield className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" title="Requires Auth" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {ep.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Side: Request Composer & Response Viewer (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Request Composer Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5">
            {/* Target URL Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Request Endpoint
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeAuth}
                      onChange={(e) => setIncludeAuth(e.target.checked)}
                      className="w-3.5 h-3.5 text-indigo-600 rounded"
                    />
                    <span>Attach Bearer Token</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 px-2">
                  <StatusBadge status={selectedEndpoint.method} type="method" />
                </div>
                <div className="flex-1 font-mono text-xs text-slate-800 dark:text-slate-200 flex items-center px-2 py-1 select-all break-all">
                  {resolvedUrl}
                </div>
                <button
                  type="button"
                  disabled={sending}
                  onClick={handleSend}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/25 transition cursor-pointer disabled:opacity-50"
                >
                  {sending ? (
                    <LoadingSpinner size="xs" inline />
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Send Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Path Variables */}
            {selectedEndpoint.pathParam && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Path Variable (:{selectedEndpoint.pathParam.name})
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-500">ID:</span>
                  <input
                    type="text"
                    value={pathParamVal}
                    onChange={(e) => setPathParamVal(e.target.value)}
                    placeholder="e.g. 1"
                    className="w-48 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-mono outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Query Parameters */}
            {queryParams.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Query Parameters
                </span>
                <div className="space-y-2">
                  {queryParams.map((qp, idx) => (
                    <div key={qp.name} className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={qp.enabled}
                        onChange={(e) => {
                          const updated = [...queryParams]
                          updated[idx].enabled = e.target.checked
                          setQueryParams(updated)
                        }}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span className="font-mono w-28 text-slate-600 dark:text-slate-400 truncate">
                        {qp.name}
                      </span>
                      <input
                        type="text"
                        value={qp.value}
                        onChange={(e) => {
                          const updated = [...queryParams]
                          updated[idx].value = e.target.value
                          setQueryParams(updated)
                        }}
                        placeholder={`value for ${qp.name}`}
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-mono outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request Body Editor (for POST/PATCH) */}
            {['POST', 'PATCH', 'PUT'].includes(selectedEndpoint.method) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Request Body (JSON)
                  </span>
                  <button
                    type="button"
                    onClick={() => setBodyText(selectedEndpoint.body || '{}')}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Default Body</span>
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 font-mono text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Response Inspector Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Response Inspector
                </h4>
                {responseStatus !== null && (
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono',
                      responseStatus >= 200 && responseStatus < 300
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-500/20',
                    )}
                  >
                    Status: {responseStatus}
                  </span>
                )}
                {responseDuration !== null && (
                  <span className="text-xs text-slate-400 font-mono">
                    Time: {responseDuration} ms
                  </span>
                )}
              </div>

              {responseData && (
                <button
                  type="button"
                  onClick={copyResponse}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              )}
            </div>

            {/* Output Screen */}
            {sending ? (
              <div className="p-12 text-center">
                <LoadingSpinner text="Executing request to Node.js backend..." />
              </div>
            ) : responseData ? (
              <pre className="p-4 rounded-2xl bg-slate-950 text-slate-100 text-xs font-mono overflow-x-auto max-h-[450px] leading-relaxed border border-slate-800">
                {JSON.stringify(responseData, null, 2)}
              </pre>
            ) : (
              <div className="p-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                Click "Send Request" above to execute this endpoint and inspect the live response.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
