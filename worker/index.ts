import { computeReleases } from './releases'
import { computeVideos } from './videos'

// Cloudflare Worker mit Static Assets:
// - /api/releases -> echte Release-Zahlen (live von iTunes)
// - /api/videos   -> Musikvideos je Band (live von YouTube-RSS)
// - alles andere  -> statische Dateien aus dist/ (ASSETS-Binding)
interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> }
}

async function cachedJson(
  request: Request,
  path: string,
  compute: () => Promise<unknown>,
): Promise<Response> {
  const cf = globalThis as unknown as { caches?: { default?: Cache } }
  const cache = cf.caches?.default
  const cacheKey = new URL(path, new URL(request.url).origin).toString()

  if (cache) {
    const hit = await cache.match(cacheKey)
    if (hit) return hit
  }

  const data = await compute()
  const res = new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=900',
      'access-control-allow-origin': '*',
    },
  })
  if (cache) await cache.put(cacheKey, res.clone())
  return res
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/api/releases') {
      return cachedJson(request, '/api/releases', computeReleases)
    }
    if (url.pathname === '/api/videos') {
      return cachedJson(request, '/api/videos', computeVideos)
    }

    return env.ASSETS.fetch(request)
  },
}
