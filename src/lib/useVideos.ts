import { useEffect, useState } from 'react'
import type { VideosResponse } from '../../worker/videos'

const EMPTY: VideosResponse = { bands: {}, updatedAt: '' }

// Geteilter Singleton-Fetch, damit nur ein Request ausgelöst wird.
let inflight: Promise<VideosResponse> | null = null
function load(): Promise<VideosResponse> {
  if (!inflight) {
    inflight = fetch('/api/videos').then((r) => {
      if (!r.ok) throw new Error(`videos ${r.status}`)
      return r.json() as Promise<VideosResponse>
    })
  }
  return inflight
}

export interface VideosState {
  data: VideosResponse
  loading: boolean
}

export function useVideos(): VideosState {
  const [data, setData] = useState<VideosResponse>(EMPTY)
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
          inflight = null
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading }
}
