import type { CSSProperties } from 'react'

interface Props {
  src?: string
  alt?: string
  fit?: 'contain' | 'cover'
  pad?: boolean
  placeholder?: string
}

// Schlanker Ersatz für das ursprüngliche <image-slot> Custom-Element:
// rendert ein <img> mit object-fit, optionalem Innenabstand und einem
// Platzhalter, falls keine Quelle gesetzt ist.
export default function ImageSlot({
  src,
  alt = '',
  fit = 'cover',
  pad = false,
  placeholder = 'Bild',
}: Props) {
  if (!src) {
    const ph: CSSProperties = {
      display: 'flex',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '10%',
      color: '#5c5a54',
      fontFamily: "'Space Mono', monospace",
      fontSize: 13,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
    }
    return <div style={ph}>{placeholder}</div>
  }

  const img: CSSProperties = {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: fit,
    padding: pad ? '11%' : 0,
    boxSizing: 'border-box',
  }
  return <img src={src} alt={alt} loading="lazy" style={img} />
}
