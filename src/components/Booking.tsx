import { useState, type FormEvent } from 'react'

export default function Booking() {
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section id="booking" className="dr-booking">
      <div data-blob className="dr-booking-blob" />
      <div className="dr-booking-inner">
        <div className="dr-reveal dr-booking-text">
          <span className="dr-eyebrow">[ 06 — Booking ]</span>
          <h2 className="dr-booking-title">
            Lust auf
            <br />
            Lärm?
          </h2>
          <p className="dr-booking-p">
            Festival, Club, Kindergeburtstag mit Anspruch — wir bringen die Band. Schreib uns, wir
            melden uns mit voller Lautstärke zurück.
          </p>
          <a href="mailto:booking@drunkenrecords.de" className="dr-booking-mail">
            <span className="dr-booking-mail-dot" />
            booking@drunkenrecords.de
          </a>
        </div>

        <form className="dr-reveal dr-form" onSubmit={onSubmit}>
          <div className="dr-field">
            <label className="dr-label">Name</label>
            <input className="dr-input" type="text" placeholder="Dein Name" />
          </div>
          <div className="dr-field">
            <label className="dr-label">E-Mail</label>
            <input className="dr-input" type="email" placeholder="du@example.com" />
          </div>
          <div className="dr-field">
            <label className="dr-label">Nachricht</label>
            <textarea
              className="dr-input dr-textarea"
              rows={3}
              placeholder="Welche Band, welcher Anlass?"
            />
          </div>
          <button type="submit" className="dr-form-submit">
            Anfrage senden →
          </button>
          {sent && (
            <span className="dr-form-sent">✓ Prost! Anfrage notiert — wir melden uns.</span>
          )}
        </form>
      </div>
    </section>
  )
}
