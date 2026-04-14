import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars (including VITE_RADICAL_API_KEY from .env.local) for server-side use
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    base: './', // GitHub Pages compatible
    server: {
      proxy: {
        // In dev: proxy /api/chat → gateway, injecting the API key server-side
        '/api/chat': {
          target: 'https://gateway.raicode.no',
          changeOrigin: true,
          rewrite: () => '/v1/chat/completions',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Authorization', `Bearer ${env.VITE_RADICAL_API_KEY}`)
            })
          },
        },
      },
    },
  }
})
