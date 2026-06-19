export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="dr-footer">
      <div className="dr-footer-brand">
        <span className="dr-footer-brand-dot" />
        <span className="dr-footer-brand-name">Drunken Records</span>
      </div>
      <div className="dr-footer-links">
        <a className="dr-footer-link" href="#bands">
          Bands
        </a>
        <a className="dr-footer-link" href="#releases">
          Spotify
        </a>
        <a className="dr-footer-link" href="#videos">
          YouTube
        </a>
        <a className="dr-footer-link" href="https://audiola.de" target="_blank" rel="noopener">
          audiola.de
        </a>
      </div>
      <span className="dr-footer-copy">© {year} · Made with stout</span>
    </footer>
  )
}
