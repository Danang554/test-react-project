import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Helper untuk mencatat error log FE ke file disk
function writeLogToFile({ level = 'ERROR', message = '', stack = '', component = '', url = '', info = '', file = '', line = '', col = '' }) {
  const now = new Date()
  const dateFolder = now.toISOString().split('T')[0] // YYYY-MM-DD
  const timeStr = now.toTimeString().split(' ')[0] // HH:mm:ss
  const timestamp = `${dateFolder} ${timeStr}`

  const logDir = path.resolve(process.cwd(), 'logs')
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
  }

  const logFilePath = path.join(logDir, `fe-${dateFolder}.log`)

  const context = {}
  if (component) context.component = component
  if (info) context.info = info
  if (url) context.url = url
  if (file) context.file = `${file}:${line}:${col}`

  const contextStr = Object.keys(context).length > 0 ? ' ' + JSON.stringify(context) : ''
  let logEntry = `[${timestamp}] local.${level.toUpperCase()}: ${message}${contextStr}\n`
  if (stack) {
    logEntry += `[stacktrace]\n${stack}\n`
  }
  logEntry += `\n`

  fs.appendFileSync(logFilePath, logEntry, 'utf-8')
}

// Vite plugin untuk menangani endpoint logging internal FE
function frontendLoggerPlugin() {
  return {
    name: 'frontend-logger-plugin',
    configureServer(server) {
      server.middlewares.use('/__fe_log', (req, res) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const data = JSON.parse(body)
              writeLogToFile(data)
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ status: 'ok' }))
            } catch (err) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        } else {
          res.statusCode = 405
          res.end()
        }
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use('/__fe_log', (req, res) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const data = JSON.parse(body)
              writeLogToFile(data)
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ status: 'ok' }))
            } catch (err) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        } else {
          res.statusCode = 405
          res.end()
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Port Frontend dinamis dari .env (default: 5174)
  const port = parseInt(process.env.VITE_PORT || env.VITE_PORT || env.PORT || '5174', 10)

  // URL / Domain Backend (Node.js REST API, default: http://127.0.0.1:5000)
  let rawBackend =
    process.env.VITE_BACKEND_URL ||
    env.VITE_BACKEND_URL ||
    env.VITE_API_BASE_URL ||
    'http://127.0.0.1:5000'

  const isRunningInDocker = fs.existsSync('/.dockerenv') || process.env.IS_DOCKER === 'true'
  if (isRunningInDocker) {
    rawBackend = rawBackend.replace(/(https?:\/\/)(127\.0\.0\.1|localhost)(:\d+)?/, (match, proto, host, p) => {
      return `${proto}host.docker.internal${p || ''}`
    })
  }

  const backendTarget = rawBackend.replace(/\/+$/, '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      frontendLoggerPlugin(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port,
      host: true,
      proxy: {
        '/health': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      port,
      host: true,
      proxy: {
        '/health': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
