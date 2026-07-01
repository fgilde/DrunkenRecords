import { useEffect, useState } from 'react'
import type { ReleasesResponse } from '../../worker/releases'

// Einzige Wahrheit sind die Live-Zahlen aus /api/releases (iTunes).
// Keine hartcodierten Zahlen -> nichts, das je „veraltet". Bei einem seltenen
// Aussetzer bleibt data null und die UI zeigt „–" statt einer falschen Zahl.

// Geteilter Fetch, damit Releases + Story nur einen Request auslösen.
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
  data: ReleasesResponse | null
  loading: boolean
}

export function useReleases(): ReleasesState {
  const [data, setData] = useState<ReleasesResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    let attempts = 0

    const run = () => {
      load()
        .then((d) => {
          if (cancelled) return
          setData(d)
          setLoading(false)
        })
        .catch(() => {
          inflight = null // erlaubt einen erneuten Versuch
          if (cancelled) return
          attempts += 1
          if (attempts < 3) {
            window.setTimeout(run, 1500 * attempts)
          } else {
            setLoading(false)
          }
        })
    }
    run()

    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading }
}
