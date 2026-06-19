import { useState, type CSSProperties } from 'react'
import { BANDS, type Band } from '../data/bands'
import { useVideos } from '../lib/useVideos'
import VideoModal from './VideoModal'

export default function Videos() {
  const { data } = useVideos()
  const [openBand, setOpenBand] = useState<Band | null>(null)

  return (
    <section id="videos" className="dr-videos">
      <div className="dr-reveal dr-releases-head">
        <div>
          <span className="dr-eyebrow">[ 03 — Bewegtbild ]</span>
          <h2 className="dr-section-title">Videos</h2>
        </div>
        <p className="dr-releases-lede">
          Direkt von YouTube — das neueste Musikvideo jeder Band. Für die komplette Übersicht „Alle
          Videos" öffnen.
        </p>
      </div>

      <div className="dr-reveal dr-grid">
        {BANDS.map((band) => {
          const vids = data.bands[band.key] ?? []
          const latest = vids[0]
          return (
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
                {latest ? (
                  <iframe
                    className="dr-video-embed"
                    title={`${band.name} – ${latest.title}`}
                    src={`https://www.youtube-nocookie.com/embed/${latest.id}?rel=0`}
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <div className="dr-video-empty">Videos laden …</div>
                )}
              </div>
              <button
                className="dr-videos-btn"
                onClick={() => setOpenBand(band)}
                disabled={!vids.length}
              >
                Alle Videos{vids.length ? ` (${vids.length})` : ''} →
              </button>
            </div>
          )
        })}
      </div>

      {openBand && (
        <VideoModal
          band={openBand}
          videos={data.bands[openBand.key] ?? []}
          onClose={() => setOpenBand(null)}
        />
      )}
    </section>
  )
}
