import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { computeReleases } from './functions/api/releases'

// Dev-only: serviert /api/releases lokal (npm run dev), damit die echte
// Release-Logik ohne wrangler getestet werden kann. In Produktion übernimmt
// das die Cloudflare Pages Function unter functions/api/releases.ts.
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'dev-api-releases',
      configureServer(server) {
        server.middlewares.use('/api/releases', async (_req, res) => {
          try {
            const data = await computeReleases()
            res.setHeader('content-type', 'application/json; charset=utf-8')
            res.setHeader('cache-control', 'no-store')
            res.end(JSON.stringify(data))
          } catch (err) {
            res.statusCode = 502
            res.setHeader('content-type', 'application/json; charset=utf-8')
            res.end(JSON.stringify({ error: String(err) }))
          }
        })
      },
    },
  ],
})
