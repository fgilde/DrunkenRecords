import type { CSSProperties } from 'react'
import { BANDS } from '../data/bands'

export default function Videos() {
  return (
    <section id="videos" className="dr-videos">
      <div className="dr-reveal dr-releases-head">
        <div>
          <span className="dr-eyebrow">[ 03 — Bewegtbild ]</span>
          <h2 className="dr-section-title">Videos</h2>
        </div>
        <p className="dr-releases-lede">
          Direkt vom YouTube-Kanal jeder Band — Musikvideos, Live-Clips und mehr. Immer die
          aktuellen Uploads.
        </p>
      </div>

      <div className="dr-reveal dr-grid">
        {BANDS.map((band) => (
          <div key={band.key} style={{ '--band': band.accent } as CSSProperties}>
            <div className="dr-release-head">
              <span
                className="dr-release-dot"
                style={{ background: band.accent, boxShadow: `0 0 10px ${band.accent}` }}
              />
              <span className="dr-release-name">{band.name}</span>
              <span className="dr-release-tag">{band.releaseTag}</span>
            </div>
            <div className="dr-video-frame">
              <iframe
                className="dr-video-embed"
                title={`${band.name} auf YouTube`}
                src={`https://www.youtube-nocookie.com/embed/videoseries?list=${band.uploadsPlaylistId}`}
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
