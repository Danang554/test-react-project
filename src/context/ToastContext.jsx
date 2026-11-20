import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
  success: () => {},
  error: () => {},
  warning: () => {},
  info: () => {},
})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    ({ type = 'info', message, title, validationErrors, duration = 4000 }) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9)
      const toast = { id, type, message, title, validationErrors }

      setToasts((prev) => [...prev, toast])

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }

      return id
    },
    [removeToast],
  )

  const success = useCallback(
    (message, title = 'Success') => addToast({ type: 'success', message, title }),
    [addToast],
  )

  const error = useCallback(
    (message, title = 'Error', validationErrors = null) =>
      addToast({ type: 'error', message, title, validationErrors, duration: 6000 }),
    [addToast],
  )

  const warning = useCallback(
    (message, title = 'Warning') => addToast({ type: 'warning', message, title }),
    [addToast],
  )

  const info = useCallback(
    (message, title = 'Information') => addToast({ type: 'info', message, title }),
    [addToast],
  )

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
