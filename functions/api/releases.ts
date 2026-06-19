// Cloudflare Pages Function: ermittelt die echten Release-Zahlen (Alben + Singles)
// der drei Bands über die iTunes-Lookup-API — keyless, kein API-Key nötig.
//
// Die reine Logik (computeReleases) wird auch vom Vite-Dev-Server genutzt
// (siehe vite.config.ts), damit `npm run dev` ohne wrangler funktioniert.

export interface BandReleases {
  key: string
  albums: number
  singles: number
  total: number
}

export interface ReleasesResponse {
  bands: Record<string, BandReleases>
  totals: { albums: number; singles: number; total: number }
  updatedAt: string
}

// Apple-Artist-IDs — Keys müssen mit src/data/bands.ts übereinstimmen.
const ARTISTS: { key: string; appleArtistId: number }[] = [
  { key: 'eyirish', appleArtistId: 1755193672 },
  { key: 'null5er', appleArtistId: 1750242664 },
  { key: 'papibaras', appleArtistId: 6780271557 },
]

interface ITunesItem {
  wrapperType?: string
  collectionName?: string
  trackCount?: number
}

// Single = Name endet auf "- Single"/"- EP" wird als Album gezählt;
// alles mit mehr als einem Track gilt als Album/EP.
function classify(items: ITunesItem[]): { albums: number; singles: number } {
  let albums = 0
  let singles = 0
  for (const it of items) {
    if (it.wrapperType !== 'collection') continue
    const name = it.collectionName ?? ''
    const isSingle = /-\s*single\s*$/i.test(name) || (it.trackCount ?? 0) <= 1
    if (isSingle) singles++
    else albums++
  }
  return { albums, singles }
}

async function fetchArtist(appleArtistId: number): Promise<{ albums: number; singles: number }> {
  const url = `https://itunes.apple.com/lookup?id=${appleArtistId}&entity=album&limit=200&country=DE`
  const res = await fetch(url, {
    headers: { 'user-agent': 'DrunkenRecords/1.0 (+https://drunkenrecords.com)' },
  })
  if (!res.ok) throw new Error(`iTunes ${res.status}`)
  const data = (await res.json()) as { results?: ITunesItem[] }
  return classify(data.results ?? [])
}

export async function computeReleases(): Promise<ReleasesResponse> {
  const settled = await Promise.allSettled(ARTISTS.map((a) => fetchArtist(a.appleArtistId)))
  const bands: Record<string, BandReleases> = {}
  const totals = { albums: 0, singles: 0, total: 0 }
  settled.forEach((r, i) => {
    if (r.status !== 'fulfilled') return
    const key = ARTISTS[i].key
    const { albums, singles } = r.value
    bands[key] = { key, albums, singles, total: albums + singles }
    totals.albums += albums
    totals.singles += singles
  })
  totals.total = totals.albums + totals.singles
  return { bands, totals, updatedAt: new Date().toISOString() }
}

// Cloudflare Pages Function Entry. Edge-Cache ~1h über Cache API + Cache-Control,
// damit iTunes nicht bei jedem Aufruf getroffen wird.
export const onRequest = async (context: {
  request: Request
  waitUntil: (p: Promise<unknown>) => void
}): Promise<Response> => {
  const cf = globalThis as unknown as { caches?: { default?: Cache } }
  const cache = cf.caches?.default
  const cacheKey = new URL('/api/releases', context.request.url).toString()

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

  if (cache) context.waitUntil(cache.put(cacheKey, res.clone()))
  return res
}
