import { computeReleases } from './releases'

// Cloudflare Worker mit Static Assets:
// - /api/releases -> echte Release-Zahlen (live von iTunes, mit Edge-Cache)
// - alles andere -> statische Dateien aus dist/ (ASSETS-Binding)
interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/api/releases') {
      const cf = globalThis as unknown as { caches?: { default?: Cache } }
      const cache = cf.caches?.default
      const cacheKey = new URL('/api/releases', url.origin).toString()

      if (cache) {
        const hit = await cache.match(cacheKey)
        if (hit) return hit
      }

      const data = await computeReleases()
      const res = new Response(JSON.stringify(data), {
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'public, max-age=600, s-maxage=3600',
          'access-control-allow-origin': '*',
        },
      })
      if (cache) await cache.put(cacheKey, res.clone())
      return res
    }

    return env.ASSETS.fetch(request)
  },
}
