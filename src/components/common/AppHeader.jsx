import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useHealth } from '../../context/HealthContext'
import ThemeToggle from './ThemeToggle'
import {
  Menu,
  LogOut,
  User,
  Shield,
  Activity,
  RefreshCw,
} from 'lucide-react'
import { cn } from '../../utils/cn'

export default function AppHeader({ onToggleSidebar = () => {} }) {
  const { user, isAdmin, logout } = useAuth()
  const { isOnline, latency, checkHealth, checking } = useHealth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/auth/login')
  }

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left side: Hamburger button & page contextual info */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Node REST API Client</span>
            <span>&bull;</span>
            <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
              v1.0.0
            </span>
          </div>
        </div>

        {/* Right side: Health indicator, Theme Toggle & User menu */}
        <div className="flex items-center gap-2.5">
          {/* Live Backend Health Indicator */}
          <button
            type="button"
            onClick={checkHealth}
            title={`Click to recheck health (${latency}ms)`}
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer group',
              isOnline === true
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-950/70'
                : isOnline === false
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-950/70'
                : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800',
            )}
          >
            <span className="relative flex h-2 w-2">
              {isOnline === true && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={cn(
                  'relative inline-flex rounded-full h-2 w-2',
                  isOnline === true
                    ? 'bg-emerald-500'
                    : isOnline === false
                    ? 'bg-rose-500'
                    : 'bg-slate-400',
                )}
              />
            </span>

            <span className="hidden md:inline font-mono">
              {isOnline ? 'API Online' : 'API Offline'}
            </span>

            {isOnline && (
              <span className="hidden lg:inline text-[11px] opacity-75 font-mono">
                ({latency}ms)
              </span>
            )}

            <RefreshCw
              className={cn(
                'w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform duration-300',
                checking && 'animate-spin text-indigo-500',
              )}
            />
          </button>

          {/* Theme Switcher */}
          <ThemeToggle />

          {/* User Profile Pill & Quick Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <Link
              to="/profile"
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left group"
              title="View Profile"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight flex items-center gap-1.5">
                  <span className="truncate max-w-[110px]">{user?.name || 'Explorer'}</span>
                  {isAdmin && (
                    <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300">
                      ADMIN
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[120px]">
                  {user?.email || 'Logged In'}
                </div>
              </div>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
