import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { Connect } from 'vite'
import { computeReleases } from './worker/releases'
import { computeVideos } from './worker/videos'

// Dev-only: serviert /api/* lokal (npm run dev), damit die echte Logik ohne
// wrangler getestet werden kann. In Produktion übernimmt das der Worker
// (worker/index.ts).
function jsonRoute(compute: () => Promise<unknown>): Connect.SimpleHandleFunction {
  return async (_req, res) => {
    try {
      const data = await compute()
      res.setHeader('content-type', 'application/json; charset=utf-8')
      res.setHeader('cache-control', 'no-store')
      res.end(JSON.stringify(data))
    } catch (err) {
      res.statusCode = 502
      res.setHeader('content-type', 'application/json; charset=utf-8')
      res.end(JSON.stringify({ error: String(err) }))
    }
  }
}

export default defineConfig({
  // Respektiert einen vom Tooling zugewiesenen Port (PORT), sonst 5173.
  server: {
    port: Number(process.env.PORT) || 5173,
  },
  plugins: [
    react(),
    {
      name: 'dev-api',
      configureServer(server) {
        server.middlewares.use('/api/releases', jsonRoute(computeReleases))
        server.middlewares.use('/api/videos', jsonRoute(computeVideos))
      },
    },
  ],
})
