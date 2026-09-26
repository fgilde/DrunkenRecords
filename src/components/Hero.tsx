import { useEffect, useRef, useState } from 'react'
import type { BandKey } from '../data/bands'
import { Engine } from '../lib/deck'
import type { Viz } from '../lib/heroViz'
import DjMixer from './DjMixer'
import Turntable from './Turntable'

type Side = 'a' | 'b'

export default function Hero() {
  const viz = useRef<HTMLDivElement>(null)
  const [engine] = useState(() => new Engine())
  const [dj, setDj] = useState(false)
  // Mixer bei jedem Öffnen frisch mounten, damit Regler und (zurückgesetzte) Engine übereinstimmen.
  const [session, setSession] = useState(0)
  const djOnly = useRef<HTMLDivElement[]>([])
  const bars = useRef<Viz | null>(null)
  const barsLoading = useRef(false)
  const status = useRef({
    a: { on: false, band: null as BandKey | null },
    b: { on: false, band: null as BandKey | null },
  })

  useEffect(() => () => engine.close(), [engine])

  // Farbe der Hintergrund-Balken folgt dem hörbaren Pegel je Deck (Fader + Crossfader):
  // nur rechts hörbar = Farbe von Deck B, beide gleich laut = Mischfarbe.
  useEffect(() => {
    const w = { a: 0, b: 0 }
    const id = window.setInterval(() => {
      const st = status.current
      if (!bars.current || !(st.a.on || st.b.on)) return
      const parts: [BandKey, number][] = []
      ;(['a', 'b'] as const).forEach((side, i) => {
        const lvl = st[side].on ? engine.channels[i].level() : 0
        w[side] = w[side] * 0.75 + lvl * 0.25
        if (st[side].band) parts.push([st[side].band!, w[side]])
      })
      bars.current.setMix(parts)
    }, 80)
    return () => window.clearInterval(id)
  }, [engine])

  // Deck B + Mixer sind nur im DJ-Modus bedienbar (bleiben für die Animation im DOM).
  useEffect(() => {
    djOnly.current.forEach((el) => (el.inert = !dj))
  }, [dj])

  const toggleDj = () => {
    if (dj) engine.reset()
    else setSession((n) => n + 1)
    setDj(!dj)
  }

  // Hintergrund-Balken: an, solange ein Deck spielt (Farbe setzt der Pegel-Loop oben).
  const onStatus = (side: Side, on: boolean, band: BandKey | null) => {
    const st = status.current
    st[side] = { on, band }
    const any = st.a.on || st.b.on
    if (bars.current) {
      bars.current.setActive(any)
    } else if (any && !barsLoading.current && engine.output && viz.current) {
      barsLoading.current = true
      void import('../lib/heroViz').then(({ createBars }) => {
        bars.current = createBars(engine.output!, viz.current!)
        onStatus(side, on, band)
      })
    }
  }

  return (
    <section id="top" className={`dr-hero${dj ? ' is-dj' : ''}`}>
      <div data-blob className="dr-blob dr-hero-blob-1" />
      <div data-blob className="dr-blob dr-hero-blob-2" />
      <div className="dr-hero-grid" />
      <div ref={viz} className="dr-hero-viz" aria-hidden="true" />

      <div className="dr-hero-content">
        <div className="dr-eyebrow-row">
          <span className="dr-eyebrow-line" />
          <span className="dr-eyebrow">Independent Music Label · Est. 2023</span>
        </div>
        <h1 className="dr-hero-title">
          <span>Drunken</span>
          <span className="dr-hero-title-stroke">
            Records
          </span>
        </h1>
        <p className="dr-hero-lede">
          Drei Bands. Ein Sound, der nie ganz nüchtern wird.{' '}
          <span className="dr-strong">
            Irish Punk, Deutschpop und Rock für die ganze Familie
          </span>{' '}
          — alles unter einem verdammt lauten Dach.
        </p>
        <div className="dr-hero-cta-row">
          <a href="#bands" className="dr-btn-primary">
            Bands entdecken →
          </a>
          <a href="#booking" className="dr-btn-ghost">
            Kontakt aufnehmen
          </a>
        </div>
      </div>

      <Turntable side="a" engine={engine} channel={engine.channels[0]} dj={dj} onStatus={onStatus}>
        <button className="dr-dj-toggle" onClick={toggleDj} hidden={dj}>
          ⇄ Mischpult öffnen
        </button>
      </Turntable>
      <div ref={(el) => el && (djOnly.current[0] = el)} className="dr-dj-wrap">
        <DjMixer key={session} engine={engine} active={dj} onClose={toggleDj} />
      </div>
      <div ref={(el) => el && (djOnly.current[1] = el)} className="dr-dj-wrap">
        <Turntable side="b" engine={engine} channel={engine.channels[1]} dj={dj} onStatus={onStatus} />
      </div>

      <div className="dr-scrollcue">
        <div className="dr-scrollcue-mouse">
          <span className="dr-scrollcue-dot" />
        </div>
        <span className="dr-scrollcue-label">Scroll</span>
      </div>
    </section>
  )
}
