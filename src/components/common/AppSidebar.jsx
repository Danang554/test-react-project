import React from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useHealth } from '../../context/HealthContext'
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Users,
  Trash2,
  Code2,
  UserCheck,
  Zap,
  Server,
  Database,
  X,
} from 'lucide-react'
import { cn } from '../../utils/cn'

export default function AppSidebar({ open = false, onClose = () => {} }) {
  const { user, isAdmin } = useAuth()
  const { isOnline, latency, dbStatus, appName } = useHealth()
  const location = useLocation()

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Todos', path: '/todos', icon: CheckSquare },
    { name: 'Categories', path: '/categories', icon: FolderKanban },
    { name: 'Trash Bin', path: '/trash', icon: Trash2 },
  ]

  if (isAdmin) {
    navItems.push({
      name: 'User Management',
      path: '/users',
      icon: Users,
      badge: 'Admin',
    })
  }

  navItems.push(
    { name: 'API Explorer', path: '/api-explorer', icon: Code2, highlight: true },
    { name: 'My Profile', path: '/profile', icon: UserCheck },
  )

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 dark:bg-slate-950 text-slate-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-slate-800 dark:border-slate-800/80',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Brand header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800 dark:border-slate-800/80">
          <Link to="/" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-white leading-none">
                NodeTodo API
              </h1>
              <span className="text-[11px] font-medium text-slate-400">React SPA Client</span>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Main Menu
          </div>

          {navItems.map((item) => {
            const active = isActive(item.path)
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition group relative',
                  active
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : item.highlight
                    ? 'text-indigo-400 hover:text-white hover:bg-indigo-950/40 border border-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60',
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 transition',
                    active ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400 group-hover:text-white',
                  )}
                />
                <span className="flex-1 truncate">{item.name}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {item.badge}
                  </span>
                )}
                {item.highlight && !active && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                    Test
                  </span>
                )}
              </NavLink>
            )
          })}
        </div>

        {/* Server & Database Live Health Card */}
        <div className="p-4 m-3 rounded-2xl bg-slate-800/50 border border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-slate-400" />
              <span>Backend Status</span>
            </span>
            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold',
                isOnline === true
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : isOnline === false
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
              )}
            >
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          <div className="space-y-1 text-[11px] text-slate-400 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Service:</span>
              <span className="truncate max-w-[120px] text-slate-300">{appName || 'test-node-project'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">DB MySQL:</span>
              <span className={dbStatus === 'connected' ? 'text-emerald-400' : 'text-amber-400'}>
                {dbStatus}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Latency:</span>
              <span className="text-slate-300">{latency} ms</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
