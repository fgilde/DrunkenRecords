export default function Hero() {
  return (
    <section id="top" className="dr-hero">
      <div data-blob className="dr-blob dr-hero-blob-1" />
      <div data-blob className="dr-blob dr-hero-blob-2" />
      <div className="dr-hero-grid" />

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
