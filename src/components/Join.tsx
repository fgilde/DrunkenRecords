import { useState, type FormEvent } from 'react'

// Zieladresse für Band-Vorstellungen / Demos.
// HINWEIS: Stelle sicher, dass dieses Postfach existiert (oder ändere die Adresse).
const SUBMIT_EMAIL = 'demos@drunkenrecords.com'

interface Service {
  icon: string
  title: string
  text: string
}

const SERVICES: Service[] = [
  {
    icon: '🌐',
    title: 'Webseite',
    text: 'Eine eigene Band-Website wie diese hier — auf Wunsch komplett von uns gebaut und gehostet.',
  },
  {
    icon: '🚀',
    title: 'Distribution',
    text: 'Deine Musik überall: Spotify, Apple Music, Amazon, Deezer & Co. — wir bringen sie in die Stores.',
  },
  {
    icon: '📣',
    title: 'Vermarktung',
    text: 'Promo, Social Media, Playlist-Pitching und Reichweite, damit dich die Leute auch hören.',
  },
  {
    icon: '🎤',
    title: 'Booking & Support',
    text: 'Live-Anfragen, Beratung und Rückhalt — du machst die Musik, wir kümmern uns um den Rest.',
  },
]

export default function Join() {
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = e.currentTarget
    const val = (n: string) =>
      (f.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement | null)?.value.trim() ?? ''

    const band = val('band')
    const body = [
      `Band: ${band}`,
      `Genre / Stil: ${val('genre')}`,
      `Ansprechpartner: ${val('name')}`,
      `E-Mail: ${val('email')}`,
      `Demo-Link: ${val('demo')}`,
      '',
      val('message'),
    ].join('\n')

    const subject = `Band-Vorstellung: ${band || 'Neue Band'}`
    window.location.href = `mailto:${SUBMIT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <section id="join" className="dr-join">
      <div className="dr-wrap">
        <div className="dr-reveal dr-releases-head">
          <div>
            <span className="dr-eyebrow">[ 05 — Mitmachen ]</span>
            <h2 className="dr-section-title">
              Deine Band
              <br />
              bei uns
            </h2>
          </div>
          <p className="dr-releases-lede">
            Du machst ehrliche Musik mit Haltung? Wir nehmen dich in die Bande auf — und kümmern uns
            um alles drumherum.
          </p>
        </div>

        <div className="dr-reveal dr-services">
          {SERVICES.map((s) => (
            <div key={s.title} className="dr-service-card">
              <span className="dr-service-icon" aria-hidden="true">
                {s.icon}
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>

        <div className="dr-reveal dr-join-pitch">
          <div className="dr-join-pitch-intro">
            <span className="dr-eyebrow">[ Demo einschicken ]</span>
            <h3 className="dr-join-pitch-title">Stell deine Band vor</h3>
            <p>
              Schick uns Bandname, Genre und einen Link zu eurem Demo (SoundCloud, YouTube, Spotify,
              Dropbox, WeTransfer …). Wir hören rein und melden uns.
            </p>
            <a href={`mailto:${SUBMIT_EMAIL}`} className="dr-booking-mail">
              <span className="dr-booking-mail-dot" />
              {SUBMIT_EMAIL}
            </a>
          </div>

          <form className="dr-form" onSubmit={onSubmit}>
            <div className="dr-field">
              <label className="dr-label">Bandname</label>
              <input className="dr-input" name="band" type="text" placeholder="Wie heißt ihr?" required />
            </div>
            <div className="dr-field">
              <label className="dr-label">Genre / Stil</label>
              <input className="dr-input" name="genre" type="text" placeholder="Punk, Pop, Rock …" />
            </div>
            <div className="dr-field">
              <label className="dr-label">Ansprechpartner</label>
              <input className="dr-input" name="name" type="text" placeholder="Dein Name" />
            </div>
            <div className="dr-field">
              <label className="dr-label">E-Mail</label>
              <input className="dr-input" name="email" type="email" placeholder="du@example.com" required />
            </div>
            <div className="dr-field">
              <label className="dr-label">Demo-Link</label>
              <input
                className="dr-input"
                name="demo"
                type="url"
                placeholder="https://… (SoundCloud, YouTube, Dropbox …)"
                required
              />
            </div>
            <div className="dr-field">
              <label className="dr-label">Über euch</label>
              <textarea
                className="dr-input dr-textarea"
                name="message"
                rows={3}
                placeholder="Worum geht's bei euch? Was sucht ihr?"
              />
            </div>
            <button type="submit" className="dr-form-submit">
              Band vorstellen →
            </button>
            {sent && (
              <span className="dr-form-sent">
                ✓ Dein Mailprogramm öffnet sich — schick die Mail ab, dann hören wir rein!
              </span>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
