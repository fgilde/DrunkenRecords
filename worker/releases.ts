// Geteilte Logik: ermittelt die echten Release-Zahlen (Alben + Singles) der drei
// Bands über die iTunes-Lookup-API — keyless, kein API-Key nötig.
// Wird vom Worker (worker/index.ts) UND vom Vite-Dev-Server (vite.config.ts) genutzt.

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

// Single = Name endet auf "- Single" oder hat höchstens einen Track;
// alles andere (mehr Tracks, EPs) zählt als Album.
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
    headers: { 'user-agent': 'DrunkenRecords/1.0 (+https://drunkenrecords.de)' },
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
