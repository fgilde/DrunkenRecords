// Bewirbt das hauseigene, kostenlose Audio-Tool audiola.de mit großem Logo.
export default function AudiolaPromo() {
  return (
    <section className="dr-audiola">
      <div className="dr-reveal dr-audiola-card">
        <div className="dr-audiola-glow" />
        <a
          className="dr-audiola-logo-link"
          href="https://audiola.de"
          target="_blank"
          rel="noopener"
          aria-label="audiola.de öffnen"
        >
          <img
            className="dr-audiola-logo"
            src="https://audiola.de/assets/logo.png"
            alt="audiola.de Logo"
            loading="lazy"
          />
        </a>
        <div className="dr-audiola-body">
          <span className="dr-eyebrow">[ Tool — audiola.de ]</span>
          <h2 className="dr-audiola-title">
            Kostenloses
            <br />
            <span className="dr-accent">Audio-Tool</span>
          </h2>
          <p className="dr-audiola-text">
            Unser hauseigenes, kostenloses Audio-Tool: Songs in Stems zerlegen, auf einer
            Mehrspur-Timeline arrangieren, Stimmen per lokaler KI tauschen und auf
            Broadcast-Lautstärke mastern — alles in einer App.
          </p>
          <div className="dr-audiola-cta">
            <a className="dr-btn-primary" href="https://audiola.de" target="_blank" rel="noopener">
              Zu audiola.de →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
