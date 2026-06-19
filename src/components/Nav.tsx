const NAV_LINKS = [
  { href: '#bands', label: 'Bands' },
  { href: '#releases', label: 'Releases' },
  { href: '#videos', label: 'Videos' },
  { href: '#story', label: 'Story' },
  { href: '#join', label: 'Mitmachen' },
]

export default function Nav() {
  return (
    <nav className="dr-nav">
      <a href="#top" className="dr-logo">
        <span className="dr-logo-dot" />
        <span className="dr-logo-name">Drunken</span>
        <span className="dr-logo-sub">Records</span>
      </a>
      <div className="dr-nav-links">
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} className="dr-nav-link">
            {l.label}
          </a>
        ))}
        <a href="#booking" className="dr-nav-cta">
          Booking
        </a>
      </div>
    </nav>
  )
}
