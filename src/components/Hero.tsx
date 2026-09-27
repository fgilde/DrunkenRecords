import { useEffect, useRef, useState } from 'react'

// Plattenspieler + DJ-Mischpult kommen als freie Web-Component von Audiola
// (<audiola-turntable>, https://audiola.de/turntable.html). Der Hero-Text steckt als Slot
// darin und fährt beim Öffnen des Mischpults heraus.
export default function Hero() {
  const deck = useRef<HTMLElement>(null)
  const [dj, setDj] = useState(false)

  useEffect(() => {
    const el = deck.current
    const onMode = (e: Event) => setDj((e as CustomEvent<{ mode: string }>).detail.mode === 'dj')
    el?.addEventListener('modechange', onMode)
    return () => el?.removeEventListener('modechange', onMode)
  }, [])

  return (
    <section id="top" className={`dr-hero${dj ? ' is-dj' : ''}`}>
      <div data-blob className="dr-blob dr-hero-blob-1" />
      <div data-blob className="dr-blob dr-hero-blob-2" />
      <div className="dr-hero-grid" />

      <audiola-turntable ref={deck} records="/albums/albums.json" logo="/logo-560.webp" lang="de">
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
      </audiola-turntable>

      <div className="dr-scrollcue">
        <div className="dr-scrollcue-mouse">
          <span className="dr-scrollcue-dot" />
        </div>
        <span className="dr-scrollcue-label">Scroll</span>
      </div>
    </section>
  )
}
