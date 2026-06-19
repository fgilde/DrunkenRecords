import type { CSSProperties } from 'react'
import { BANDS } from '../data/bands'
import { useReleases } from '../lib/useReleases'

export default function Releases() {
  const { data, loading } = useReleases()

  return (
    <section id="releases" className="dr-releases">
      <div className="dr-wrap">
        <div className="dr-reveal dr-releases-head">
          <div>
            <span className="dr-eyebrow">[ 02 — Musik ]</span>
            <h2 className="dr-section-title">Releases</h2>
          </div>
          <p className="dr-releases-lede">
            Keine Platzhalter — die echte Diskografie, live abspielbar von Spotify und mit echten
            Zahlen direkt aus den Stores.
          </p>
        </div>

        <div className="dr-reveal dr-grid">
          {BANDS.map((band) => {
            const r = data.bands[band.key]
            const albums = r?.albums ?? band.fallbackReleases.albums
            const singles = r?.singles ?? band.fallbackReleases.singles
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
                <div className={`dr-release-counts${loading ? ' is-loading' : ''}`}>
                  <span>
                    <b>{albums}</b>
                    {albums === 1 ? 'Album' : 'Alben'}
                  </span>
                  <span>
                    <b>{singles}</b>
                    {singles === 1 ? 'Single' : 'Singles'}
                  </span>
                </div>
                <iframe
                  title={`${band.name} auf Spotify`}
                  src={`https://open.spotify.com/embed/artist/${band.spotifyArtistId}?theme=0`}
                  className="dr-embed"
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
