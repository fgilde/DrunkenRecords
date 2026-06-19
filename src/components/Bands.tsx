import type { CSSProperties } from 'react'
import { BANDS } from '../data/bands'
import ImageSlot from './ImageSlot'

export default function Bands() {
  return (
    <section id="bands" className="dr-bands">
      <div className="dr-reveal dr-section-head">
        <div>
          <span className="dr-eyebrow">[ 01 — Roster ]</span>
          <h2 className="dr-section-title">Die Bands</h2>
        </div>
        <span className="dr-section-meta">03 Acts / 01 Familie</span>
      </div>

      {BANDS.map((band, i) => {
        const cls = [
          'dr-reveal',
          'dr-band',
          i % 2 === 1 ? 'dr-band--reverse' : '',
          i > 0 ? 'dr-band--bordered' : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <div key={band.key} className={cls} style={{ '--band': band.accent } as CSSProperties}>
            <div className="dr-band-figure">
              <div className="dr-band-figure-glow" style={{ background: band.figureGlow }} />
              <div className="dr-band-img-frame">
                <ImageSlot
                  src={band.image.src}
                  alt={band.image.alt}
                  fit={band.image.fit}
                  pad={band.image.pad}
                  placeholder={band.name}
                />
              </div>
            </div>

            <div className="dr-band-info">
              <div className="dr-pill" style={{ borderColor: band.accentSoft, color: band.accent }}>
                <span className="dr-pill-dot" style={{ background: band.accent }} />
                {band.genre}
              </div>
              <h3 className={`dr-band-name${band.key === 'papibaras' ? ' dr-band-name--sm' : ''}`}>
                {band.name}
              </h3>
              <p className="dr-band-desc">
                {band.description.map((s, j) =>
                  s.em ? (
                    <span key={j} className="dr-strong">
                      {s.t}
                    </span>
                  ) : (
                    <span key={j}>{s.t}</span>
                  ),
                )}
              </p>
              <div className="dr-tags">
                {band.tags.map((t) => (
                  <span key={t} className="dr-tag">
                    {t}
                  </span>
                ))}
              </div>
              <div className="dr-platforms">
                <div className="dr-platforms-label">Überall hören</div>
                <div className="dr-platforms-list">
                  {band.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener"
                      className={`dr-platform${l.primary ? ' dr-platform--primary' : ''}`}
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}
