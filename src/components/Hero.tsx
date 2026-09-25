export default function Hero() {
  return (
    <section id="top" className="dr-hero">
      <div data-blob className="dr-blob dr-hero-blob-1" />
      <div data-blob className="dr-blob dr-hero-blob-2" />
      <div className="dr-hero-grid" />

      <div className="dr-vinyl-wrap" aria-hidden="true">
        <div className="dr-vinyl">
          <svg className="dr-vinyl-label" viewBox="0 0 200 200">
            <defs>
              <path id="dr-vinyl-arc" d="M100,100 m-68,0 a68,68 0 1,1 136,0 a68,68 0 1,1 -136,0" />
            </defs>
            <circle cx="100" cy="100" r="96" fill="#c2ff3a" />
            <text className="dr-vinyl-arc-text">
              <textPath href="#dr-vinyl-arc">
                Drunken Records · Side A · Est. 2023 · Loud as hell ·
              </textPath>
            </text>
            <text x="100" y="116" textAnchor="middle" className="dr-vinyl-dr">
              DR
            </text>
            <circle cx="100" cy="100" r="5" fill="#0a0a0b" />
          </svg>
        </div>
        <div className="dr-vinyl-arm" />
      </div>

      <div className="dr-hero-content">
        <div className="dr-eyebrow-row">
          <span className="dr-eyebrow-line" />
          <span className="dr-eyebrow">Independent Music Label · Est. 2023</span>
        </div>
        <h1 className="dr-hero-title">
          <span>Drunken</span>
          <span className="dr-hero-title-stroke">
            Records<span className="dr-hero-title-dot">●</span>
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
            Booking anfragen
          </a>
        </div>
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
