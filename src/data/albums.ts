import type { BandKey } from './bands'

// Neueste Alben für den Plattenspieler im Hero. Audio liegt unter public/albums/<band>/NN.mp3
// (96 kbps), Cover als public/albums/<band>/cover.webp. Titel wie bei Apple Music/Spotify.

export interface Album {
  band: BandKey
  title: string
  /** [Titel, Dauer in Sekunden] in Album-Reihenfolge. */
  tracks: [string, number][]
}

export const ALBUMS: Album[] = [
  {
    band: 'papibaras',
    title: 'Wir haben Ferien',
    tracks: [
      ['Mach die Bahn frei', 202.2],
      ['Das darf man nicht sagen', 206.3],
      ['Wir sind Bunt', 170.8],
      ['Wir haben Ferien', 237.2],
      ['Du bist genug', 196.4],
      ['Groß', 235.6],
      ['Bauch in die Sonne', 180.0],
      ['We speak English', 192.4],
      ['Lecker Brot', 182.0],
      ['Mit deinen Augen sehen', 214.3],
      ['Anna Anaconda', 150.0],
    ],
  },
  {
    band: 'eyirish',
    title: 'The Celtic Reworks',
    tracks: [
      ['Drunken Sailor', 189.5],
      ['All for Me Grog', 174.9],
      ['Auld Lang Syne', 192.5],
      ['Black Velvet Band', 289.8],
      ['Leaving of Liverpool', 200.6],
      ['House of Rising Sun', 144.8],
      ['Wild Rover', 230.0],
      ['Johnny I Hardly Knew Ye', 295.4],
      ['Whiskey in the Jar', 234.6],
      ['Ill Tell Me Ma', 176.9],
      ['Sloop Flo G', 190.9],
      ['Rocky Road to Dublin', 209.9],
      ['Excursion Around the Bay', 224.8],
    ],
  },
  {
    band: 'null5er',
    title: 'Politisch korrekt',
    tracks: [
      ['Wutbürger', 276.3],
      ['Antifa', 227.4],
      ['Du wählst dumm', 197.2],
      ['Epschwein', 199.4],
      ['Die Welt ist am Ende', 187.0],
      ['KI im Kopf', 177.3],
      ['Digitale Hölle', 269.5],
      ['Lebe jetzt', 189.6],
      ['Suff Can Can', 254.9],
      ['Zu alt für den Scheiß', 249.4],
      ['Der beste Freund', 283.8],
    ],
  },
]

export const trackUrl = (a: Album, i: number) =>
  `/albums/${a.band}/${String(i + 1).padStart(2, '0')}.mp3`
export const coverUrl = (a: Album) => `/albums/${a.band}/cover.webp`
