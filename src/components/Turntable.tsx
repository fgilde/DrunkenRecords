import {
  useEffect,
  useReducer,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import { ALBUMS, coverUrl, trackUrl, type Album } from '../data/albums'
import { BANDS } from '../data/bands'
import { Deck } from '../lib/deck'
import type { HeroViz } from '../lib/heroViz'

// Interaktiver Plattenspieler im Hero:
// - Cover anklicken = Platte wechseln (startet Track 1)
// - Tonarm ziehen = Position auf der Platte wählen (außen = Track 1, innen = letzter Track),
//   zurück auf die Ablage = Stopp
// - Platte mit der Maus drehen = Scratchen (Richtung + Tempo folgen der Hand)

const DEG_PER_SEC = 200 // 33⅓ rpm
const ARM_REST = -8 // Ablage neben der Platte
const ARM_OUTER = 4 // Nadel auf der äußersten Rille
const ARM_INNER = 27 // Nadel an der Auslaufrille
const PIVOT = { x: 0.98, y: 0.02 } // Tonarm-Lager relativ zur Bühne

const bandOf = (a: Album) => BANDS.find((b) => b.key === a.band)!
const angleAround = (x: number, y: number, cx: number, cy: number) =>
  (Math.atan2(y - cy, x - cx) * 180) / Math.PI
const wrap180 = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180

export default function Turntable({ vizRef }: { vizRef: RefObject<HTMLDivElement> }) {
  const [, rerender] = useReducer((n: number) => n + 1, 0)
  const stage = useRef<HTMLDivElement>(null)
  const platter = useRef<HTMLDivElement>(null)
  const arm = useRef<HTMLDivElement>(null)
  const deck = useRef<Deck>()
  const ring = useRef<HTMLDivElement>(null)
  const viz = useRef<HeroViz | null>(null)
  const vizLoading = useRef(false)
  // Veränderlicher Zustand in einem Ref, damit rAF-Loop und Pointer-Handler nie veralten.
  const s = useRef({
    album: null as Album | null,
    track: 0,
    loaded: '', // "band/track" des Buffers im Worklet
    needle: false, // Nadel auf der Platte = Ton
    loading: false,
    pos: 0,
    rate: 1,
    angle: 0,
    armAngle: ARM_REST,
    scratch: null as null | { last: number; t: number; vel: number },
    armDrag: false,
  }).current

  // Audio erst nach Nutzer-Geste starten; Visualisierung wird dabei lazy nachgeladen.
  const unlock = () => {
    void deck.current!.unlock().then(async () => {
      if (vizLoading.current || !vizRef.current || !ring.current) return
      vizLoading.current = true
      const { createHeroViz } = await import('../lib/heroViz')
      viz.current = createHeroViz(deck.current!.output!, vizRef.current, ring.current)
      rerender()
    })
  }

  const play = (album: Album, track: number, offset = 0) => {
    const key = `${album.band}/${track}`
    Object.assign(s, { album, track, needle: true, pos: offset })
    if (s.loaded === key) {
      deck.current!.seek(offset)
    } else {
      s.loading = true
      s.loaded = ''
      deck.current!.load(trackUrl(album, track), offset).then((ok) => {
        if (!ok) return
        s.loaded = key
        s.loading = false
        rerender()
      })
    }
    rerender()
  }

  const stop = () => {
    s.needle = false
    rerender()
  }

  const selectAlbum = (album: Album) => {
    unlock()
    play(album, 0)
  }

  const toggle = () => {
    unlock()
    if (!s.album) return play(ALBUMS[0], 0)
    if (s.needle) return stop()
    s.needle = true
    rerender()
  }

  const step = (d: number) => {
    if (!s.album) return
    const t = s.track + d
    if (t < 0 || t >= s.album.tracks.length) return
    play(s.album, t)
  }

  useEffect(() => {
    const d = (deck.current = new Deck())
    d.onPosition = (pos, ended) => {
      if (s.loading) return
      s.pos = pos
      if (!ended || !s.needle || !s.album) return
      if (s.track + 1 < s.album.tracks.length) play(s.album, s.track + 1)
      else Object.assign(s, { needle: false, track: 0, pos: 0 }), d.seek(0), rerender()
    }

    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (s.scratch) {
        // Hand steht still → Platte steht still.
        if (now - s.scratch.t > 50) s.scratch.vel *= 0.6
        s.rate = s.scratch.vel
      } else {
        // Motor zieht die Platte zurück auf Nenndrehzahl.
        s.rate += (1 - s.rate) * Math.min(1, dt * 5)
        if (Math.abs(1 - s.rate) < 0.002) s.rate = 1
        s.angle += s.rate * DEG_PER_SEC * dt
      }
      const audible = s.needle && !s.loading && !s.armDrag
      d.setRate(audible ? s.rate : 0)

      if (!s.armDrag) {
        let target = ARM_REST
        if (s.needle && s.album) {
          const [, dur] = s.album.tracks[s.track]
          const p = (s.track + Math.min(1, s.pos / dur)) / s.album.tracks.length
          target = ARM_OUTER + (ARM_INNER - ARM_OUTER) * p
        }
        s.armAngle += (target - s.armAngle) * Math.min(1, dt * 6)
      }
      if (platter.current) platter.current.style.transform = `rotate(${s.angle}deg)`
      if (arm.current) arm.current.style.transform = `rotate(${s.armAngle}deg)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      d.close()
    }
  }, [])

  useEffect(() => {
    if (s.album) viz.current?.setBand(s.album.band)
    viz.current?.setActive(s.needle && !s.loading)
  })

  // --- Scratchen ---
  const center = () => {
    const r = stage.current!.getBoundingClientRect()
    return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, r }
  }
  const onPlatterDown = (e: ReactPointerEvent) => {
    unlock()
    e.currentTarget.setPointerCapture(e.pointerId)
    const { cx, cy } = center()
    s.scratch = { last: angleAround(e.clientX, e.clientY, cx, cy), t: performance.now(), vel: 0 }
  }
  const onPlatterMove = (e: ReactPointerEvent) => {
    if (!s.scratch) return
    const { cx, cy } = center()
    const a = angleAround(e.clientX, e.clientY, cx, cy)
    const now = performance.now()
    const delta = wrap180(a - s.scratch.last)
    const dt = Math.max(0.004, (now - s.scratch.t) / 1000)
    s.angle += delta
    const inst = Math.max(-4, Math.min(4, delta / dt / DEG_PER_SEC))
    s.scratch.vel = s.scratch.vel * 0.5 + inst * 0.5
    s.scratch.last = a
    s.scratch.t = now
  }
  const onPlatterUp = () => {
    s.scratch = null
  }

  // --- Tonarm ---
  const armAngleAt = (e: ReactPointerEvent) => {
    const { r } = center()
    const px = r.left + PIVOT.x * r.width
    const py = r.top + PIVOT.y * r.height
    const a = (Math.atan2(-(e.clientX - px), e.clientY - py) * 180) / Math.PI
    return Math.max(ARM_REST, Math.min(ARM_INNER + 2, a))
  }
  const onArmDown = (e: ReactPointerEvent) => {
    unlock()
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    s.armDrag = true
  }
  const onArmMove = (e: ReactPointerEvent) => {
    if (s.armDrag) s.armAngle = armAngleAt(e)
  }
  const onArmUp = (e: ReactPointerEvent) => {
    if (!s.armDrag) return
    s.armDrag = false
    const a = armAngleAt(e)
    if (a < ARM_OUTER - 1.5) return stop()
    const album = s.album ?? ALBUMS[0]
    const p = Math.min(0.999, Math.max(0, (a - ARM_OUTER) / (ARM_INNER - ARM_OUTER)))
    const n = album.tracks.length
    const track = Math.floor(p * n)
    play(album, track, (p * n - track) * album.tracks[track][1])
  }

  const album = s.album
  const band = album && bandOf(album)
  const playing = s.needle

  return (
    <div
      className="dr-deck"
      style={band ? ({ '--deck-accent': band.accent } as React.CSSProperties) : undefined}
    >
      <div ref={stage} className="dr-deck-stage">
        <div ref={ring} className="dr-deck-ring" aria-hidden="true" />
        <div
          key={album?.band ?? 'idle'}
          className="dr-deck-disc"
          onPointerDown={onPlatterDown}
          onPointerMove={onPlatterMove}
          onPointerUp={onPlatterUp}
          onPointerCancel={onPlatterUp}
        >
          <div ref={platter} className="dr-vinyl">
            {album && (
              <img className="dr-deck-label" src={coverUrl(album)} alt="" draggable={false} />
            )}
          </div>
        </div>
        {!album && <img className="dr-vinyl-logo" src="/logo-560.webp" alt="" draggable={false} />}
        <div
          ref={arm}
          className="dr-vinyl-arm"
          onPointerDown={onArmDown}
          onPointerMove={onArmMove}
          onPointerUp={onArmUp}
          onPointerCancel={onArmUp}
        />
      </div>

      <div className="dr-deck-ui">
        <div className="dr-deck-sleeves">
          {ALBUMS.map((a) => (
            <button
              key={a.band}
              className="dr-deck-sleeve"
              aria-pressed={album === a}
              title={`${bandOf(a).name} – ${a.title}`}
              onClick={() => selectAlbum(a)}
            >
              <img src={coverUrl(a)} alt={`${bandOf(a).name} – ${a.title}`} />
            </button>
          ))}
        </div>
        <div className="dr-deck-now">
          <div className="dr-deck-meta" aria-live="polite">
            {album ? (
              <>
                <span className="dr-deck-band">
                  {band!.name} · {album.title}
                </span>
                <span className="dr-deck-track">
                  {String(s.track + 1).padStart(2, '0')} · {album.tracks[s.track][0]}
                  {s.loading && ' · lädt …'}
                </span>
              </>
            ) : (
              <>
                <span className="dr-deck-band">Platte wählen</span>
                <span className="dr-deck-track">Arm auflegen · Platte drehen zum Scratchen</span>
              </>
            )}
          </div>
          <div className="dr-deck-controls">
            <button className="dr-deck-btn" onClick={() => step(-1)} aria-label="Vorheriger Track">
              ⏮
            </button>
            <button
              className="dr-deck-btn dr-deck-btn-main"
              onClick={toggle}
              aria-label={playing ? 'Pause' : 'Abspielen'}
            >
              {playing ? '❚❚' : '▶'}
            </button>
            <button className="dr-deck-btn" onClick={() => step(1)} aria-label="Nächster Track">
              ⏭
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
