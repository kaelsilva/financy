import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'












function contentSecurityPolicy(backendUrl: string): Plugin {
  const apiOrigin = backendUrl ? new URL(backendUrl).origin : ''

  const directives = [
    "default-src 'self'",
    "script-src 'self'",
     
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self' ${apiOrigin}`.trim(),
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ]

  return {
    name: 'financy:csp',
    apply: 'build',
    transformIndexHtml: () => [
      {
        tag: 'meta',
        attrs: {
          'http-equiv': 'Content-Security-Policy',
          content: directives.join('; '),
        },
        injectTo: 'head-prepend',
      },
    ],
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, 'VITE_')

  return {
    plugins: [
      react(),
      tailwindcss(),
      contentSecurityPolicy(env.VITE_BACKEND_URL ?? ''),
    ],
    resolve: {
      alias: {
        // "@/pages/login" resolve para "src/pages/login"
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
  }
})
