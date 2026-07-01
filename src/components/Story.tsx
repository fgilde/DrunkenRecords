import { useReleases } from '../lib/useReleases'
import CountUp from './CountUp'
import ImageSlot from './ImageSlot'

export default function Story() {
  const { data } = useReleases()

  return (
    <section id="story" className="dr-story">
      <div className="dr-story-flex">
        <div className="dr-reveal dr-story-text">
          <span className="dr-eyebrow">[ 04 — Story ]</span>
          <h2 className="dr-story-title">
            Aus der Kneipe
            <br />
            auf die Bühne
          </h2>
          <p className="dr-story-p">
            Drunken Records ist als Schnapsidee zwischen Tresen und Tonstudio entstanden — und genau
            so klingt&apos;s bis heute. Wir nehmen auf, was nach Mitternacht am ehrlichsten ist:{' '}
            <span className="dr-strong">Musik, die nach echtem Leben schmeckt.</span>
          </p>
          <p className="dr-story-p dr-story-p--tight">
            Drei Bands, eine Crew, kein Bock auf Mainstream-Schema. Wir machen alles selbst — vom
            ersten Riff bis zum letzten Pressdruck.
          </p>

          <div className="dr-stats">
            <div>
              <CountUp value={3} className="dr-stat-num" />
              <span className="dr-stat-label">Bands im Roster</span>
            </div>
            <div>
              <div className="dr-stat-num">2023</div>
              <span className="dr-stat-label">Gegründet</span>
            </div>
            <div>
              <div className="dr-stat-num">∞</div>
              <span className="dr-stat-label">Liter Inspiration</span>
            </div>
            <div>
              {data ? (
                <CountUp value={data.totals.total} className="dr-stat-num" />
              ) : (
                <div className="dr-stat-num">–</div>
              )}
              <span className="dr-stat-label">
                {data
                  ? `Releases · ${data.totals.albums} Alben / ${data.totals.singles} Singles`
                  : 'Releases gesamt'}
              </span>
            </div>
          </div>
        </div>

        <div className="dr-reveal dr-story-figure">
          <div className="dr-story-figure-glow" />
          <div className="dr-story-img-frame">
            <ImageSlot placeholder="Studio / Crew / Live-Foto" />
          </div>
        </div>
      </div>
    </section>
  )
}
