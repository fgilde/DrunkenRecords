import { useEffect, useState, type CSSProperties } from 'react'
import type { Band } from '../data/bands'
import type { VideoItem } from '../../worker/videos'

interface Props {
  band: Band
  videos: VideoItem[]
  onClose: () => void
}

// In-Page-Modal mit Lightbox-Player oben und Thumbnail-Grid aller Videos darunter.
export default function VideoModal({ band, videos, onClose }: Props) {
  const [active, setActive] = useState<VideoItem | undefined>(videos[0])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div
      className="dr-modal-overlay"
      onClick={onClose}
      style={{ '--band': band.accent } as CSSProperties}
    >
      <div
        className="dr-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Videos von ${band.name}`}
      >
        <div className="dr-modal-head">
          <div className="dr-modal-titlewrap">
            <span
              className="dr-release-dot"
              style={{ background: band.accent, boxShadow: `0 0 10px ${band.accent}` }}
            />
            <span className="dr-modal-title">{band.name}</span>
            <span className="dr-release-tag">{videos.length} Videos</span>
          </div>
          <button className="dr-modal-close" onClick={onClose} aria-label="Schließen">
            ✕
          </button>
        </div>

        {active && (
          <div className="dr-modal-player">
            <iframe
              key={active.id}
              className="dr-video-embed"
              title={active.title}
              src={`https://www.youtube-nocookie.com/embed/${active.id}?autoplay=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        )}

        <div className="dr-modal-grid">
          {videos.map((v) => (
            <button
              key={v.id}
              className={`dr-video-card${active?.id === v.id ? ' is-active' : ''}`}
              onClick={() => setActive(v)}
              title={v.title}
            >
              <span className="dr-video-thumb">
                <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" />
              </span>
              <span className="dr-video-card-title">{v.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
