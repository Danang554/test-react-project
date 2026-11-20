import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { healthApi } from '../api/health'

const HealthContext = createContext({
  isOnline: null,
  latency: 0,
  dbStatus: 'unknown',
  appName: '',
  checking: false,
  checkHealth: async () => {},
})

export function HealthProvider({ children }) {
  const [isOnline, setIsOnline] = useState(null)
  const [latency, setLatency] = useState(0)
  const [dbStatus, setDbStatus] = useState('unknown')
  const [appName, setAppName] = useState('')
  const [checking, setChecking] = useState(false)

  const checkHealth = useCallback(async () => {
    setChecking(true)
    const startTime = Date.now()
    try {
      const res = await healthApi.checkHealth()
      const duration = Date.now() - startTime
      setLatency(duration)

      if (res.status >= 200 && res.status < 300) {
        setIsOnline(true)
        if (res.data?.data) {
          setDbStatus(res.data.data.database || 'connected')
          setAppName(res.data.data.app_name || 'Node REST API')
        }
      } else {
        setIsOnline(false)
      }
    } catch {
      setIsOnline(false)
      setDbStatus('disconnected')
      setLatency(0)
    } finally {
      setChecking(false)
    }
  }, [])

  useEffect(() => {
    checkHealth()
  }, [checkHealth])

  return (
    <HealthContext.Provider
      value={{
        isOnline,
        latency,
        dbStatus,
        appName,
        checking,
        checkHealth,
      }}
    >
      {children}
    </HealthContext.Provider>
  )
}

export function useHealth() {
  return useContext(HealthContext)
}
