// Client-side Frontend Error Logger
// Mengirim error khusus Frontend (React component, Runtime JS, unhandled promise)
// ke server logging internal untuk disimpan di logs/fe-YYYY-MM-DD.log.

export function logFrontendError(error, context = {}) {
  const message =
    error?.message ||
    (typeof error === 'string' ? error : 'Unknown frontend error')
  const stack = error?.stack || ''

  const payload = {
    level: 'ERROR',
    message,
    stack,
    component: context.component || '',
    info: context.info || '',
    file: context.file || '',
    line: context.line || '',
    col: context.col || '',
    url: typeof window !== 'undefined' ? window.location.href : '',
  }

  // Console output for developer in dev tools
  console.error(`[FE-Error] ${message}`, context)

  // Non-blocking transmission to internal Vite logger endpoint
  try {
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      })
      navigator.sendBeacon('/__fe_log', blob)
    } else {
      fetch('/__fe_log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {})
    }
  } catch {}
}
