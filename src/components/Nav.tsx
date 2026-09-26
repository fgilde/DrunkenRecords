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
        <img className="dr-logo-img" src="/logo-160.webp" alt="" width="40" height="40" />
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
          Kontakt
        </a>
      </div>
    </nav>
  )
}
