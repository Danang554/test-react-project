import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AppSidebar from '../components/common/AppSidebar'
import AppHeader from '../components/common/AppHeader'
import ToastContainer from '../components/common/ToastContainer'

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Sidebar */}
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <AppHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        <footer className="py-4 px-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500">
          Node.js REST API SPA Frontend &bull; Built with React 19, React Router, Tailwind CSS & Axios
        </footer>
      </div>

      {/* Global Toast Container */}
      <ToastContainer />
    </div>
  )
}
