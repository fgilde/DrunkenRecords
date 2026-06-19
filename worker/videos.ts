// Geteilte Logik: holt die Musikvideos je Band keyless über die YouTube-RSS-Feeds
// der jeweiligen Kanäle. Für Eyirish wird bewusst der "- Topic"-Kanal (nur Musik)
// genutzt statt des @eyirish-Kanals (enthält fremde AmbiWall-Videos).
// Wird vom Worker (worker/index.ts) UND vom Vite-Dev-Server (vite.config.ts) genutzt.

export interface VideoItem {
  id: string
  title: string
  published: string
}

export interface VideosResponse {
  bands: Record<string, VideoItem[]>
  updatedAt: string
}

// Kanal-IDs der Musik-Quellen — Keys müssen mit src/data/bands.ts übereinstimmen.
const CHANNELS: { key: string; channelId: string }[] = [
  { key: 'eyirish', channelId: 'UChTZTmuHmRfo3cGd_kqkLKg' }, // "Eyirish - Topic"
  { key: 'null5er', channelId: 'UCU6n-cFsjVpSyUvKEx72kww' }, // "0,5er - Topic"
  { key: 'papibaras', channelId: 'UCYZOsBnLVeQCCpXAG0E6Phw' }, // "Die PapiBaras - Topic"
]

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
}

function parseFeed(xml: string): VideoItem[] {
  const items: VideoItem[] = []
  // Jeder <entry> ist ein Video; der Kanal-Titel steht außerhalb von <entry>.
  const entries = xml.split('<entry>').slice(1)
  for (const e of entries) {
    const id = e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]
    const title = e.match(/<title>([^<]*)<\/title>/)?.[1]
    const published = e.match(/<published>([^<]+)<\/published>/)?.[1]
    if (id && title) items.push({ id, title: decodeEntities(title), published: published ?? '' })
  }
  return items
}

async function fetchChannel(channelId: string): Promise<VideoItem[]> {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
  const res = await fetch(url, {
    headers: { 'user-agent': 'DrunkenRecords/1.0 (+https://drunkenrecords.de)' },
  })
  if (!res.ok) throw new Error(`youtube ${res.status}`)
  return parseFeed(await res.text())
}

export async function computeVideos(): Promise<VideosResponse> {
  const settled = await Promise.allSettled(CHANNELS.map((c) => fetchChannel(c.channelId)))
  const bands: Record<string, VideoItem[]> = {}
  settled.forEach((r, i) => {
    bands[CHANNELS[i].key] = r.status === 'fulfilled' ? r.value : []
  })
  return { bands, updatedAt: new Date().toISOString() }
}
