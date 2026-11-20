import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import ProtectedRoute from './ProtectedRoute'
import GuestRoute from './GuestRoute'
import LoadingSpinner from '../components/common/LoadingSpinner'

// Lazy loaded page components for optimal bundle splitting
const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'))
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'))
const TodosPage = lazy(() => import('../pages/todos/TodosPage'))
const CategoriesPage = lazy(() => import('../pages/categories/CategoriesPage'))
const TrashPage = lazy(() => import('../pages/trash/TrashPage'))
const UsersPage = lazy(() => import('../pages/users/UsersPage'))
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'))
const ApiExplorerPage = lazy(() => import('../pages/api-explorer/ApiExplorerPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

const PageSuspense = ({ children }) => (
  <Suspense
    fallback={
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner text="Loading page..." />
      </div>
    }
  >
    {children}
  </Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: (
      <GuestRoute>
        <AuthLayout />
      </GuestRoute>
    ),
    children: [
      {
        path: 'login',
        element: (
          <PageSuspense>
            <LoginPage />
          </PageSuspense>
        ),
      },
      {
        path: 'register',
        element: (
          <PageSuspense>
            <RegisterPage />
          </PageSuspense>
        ),
      },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PageSuspense>
            <DashboardPage />
          </PageSuspense>
        ),
      },
      {
        path: 'todos',
        element: (
          <PageSuspense>
            <TodosPage />
          </PageSuspense>
        ),
      },
      {
        path: 'categories',
        element: (
          <PageSuspense>
            <CategoriesPage />
          </PageSuspense>
        ),
      },
      {
        path: 'trash',
        element: (
          <PageSuspense>
            <TrashPage />
          </PageSuspense>
        ),
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute requiresAdmin>
            <PageSuspense>
              <UsersPage />
            </PageSuspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <PageSuspense>
            <ProfilePage />
          </PageSuspense>
        ),
      },
      {
        path: 'api-explorer',
        element: (
          <PageSuspense>
            <ApiExplorerPage />
          </PageSuspense>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: '/register',
    element: <Navigate to="/auth/register" replace />,
  },
  {
    path: '*',
    element: (
      <PageSuspense>
        <NotFoundPage />
      </PageSuspense>
    ),
  },
])
