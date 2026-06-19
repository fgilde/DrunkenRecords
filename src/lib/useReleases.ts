import { useEffect, useState } from 'react'
import { BANDS } from '../data/bands'
import type { ReleasesResponse } from '../../functions/api/releases'

// Fallback aus den Stammdaten, falls /api/releases (noch) nicht erreichbar ist.
function fallback(): ReleasesResponse {
  const bands: ReleasesResponse['bands'] = {}
  let albums = 0
  let singles = 0
  for (const b of BANDS) {
    const a = b.fallbackReleases.albums
    const s = b.fallbackReleases.singles
    bands[b.key] = { key: b.key, albums: a, singles: s, total: a + s }
    albums += a
    singles += s
  }
  return { bands, totals: { albums, singles, total: albums + singles }, updatedAt: '' }
}

// Geteilter Singleton-Fetch, damit mehrere Komponenten (Releases + Story)
// nur einen Request auslösen.
let inflight: Promise<ReleasesResponse> | null = null
function load(): Promise<ReleasesResponse> {
  if (!inflight) {
    inflight = fetch('/api/releases').then((r) => {
      if (!r.ok) throw new Error(`releases ${r.status}`)
      return r.json() as Promise<ReleasesResponse>
    })
  }
  return inflight
}

export interface ReleasesState {
  data: ReleasesResponse
  loading: boolean
}

export function useReleases(): ReleasesState {
  const [data, setData] = useState<ReleasesResponse>(fallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    load()
      .then((d) => {
        if (!cancelled) {
          setData(d)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          inflight = null // erlaubt erneuten Versuch beim nächsten Mount
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading }
}
