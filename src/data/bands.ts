// Zentrale Stammdaten der drei Bands im Label.
// Die `appleArtistId` wird (auch) von der Pages Function genutzt, um die echten
// Release-Zahlen über die iTunes-API zu ermitteln — Keys müssen mit functions/api/releases.ts
// übereinstimmen: 'eyirish' | 'null5er' | 'papibaras'.

export type BandKey = 'eyirish' | 'null5er' | 'papibaras'

export interface PlatformLink {
  label: string
  href: string
  /** Hervorgehobener Button (Band-Website) statt Outline-Pill. */
  primary?: boolean
}

export interface DescSegment {
  t: string
  /** hellerer Akzent-Text wie im Original-Design. */
  em?: boolean
}

export interface Band {
  key: BandKey
  name: string
  genre: string
  /** Akzentfarbe der Band. */
  accent: string
  /** Akzentfarbe mit Transparenz (für Border der Genre-Pill). */
  accentSoft: string
  /** Hintergrund-Glow hinter dem Band-Bild. */
  figureGlow: string
  description: DescSegment[]
  tags: string[]
  image: { src: string; fit: 'contain' | 'cover'; pad: boolean; alt: string }
  /** Kurzes Genre-Label im Releases-/Videos-Header. */
  releaseTag: string
  spotifyArtistId: string
  appleArtistId: number
  youtubeChannelId: string
  /** Uploads-Playlist = Kanal-ID mit UC -> UU (für keyless Embed). */
  uploadsPlaylistId: string
  website: string
  links: PlatformLink[]
  /** Fallback-Zahlen, falls die Live-API nicht erreichbar ist (Stand 2026-06). */
  fallbackReleases: { albums: number; singles: number }
}

export const BANDS: Band[] = [
  {
    key: 'eyirish',
    name: 'Eyirish',
    genre: 'Irish Punk · Rock · Folk',
    accent: '#b8ff2e',
    accentSoft: 'rgba(184,255,46,.4)',
    figureGlow: 'radial-gradient(circle at 30% 30%, rgba(184,255,46,.22), transparent 70%)',
    description: [
      {
        t: 'Whiskey-getränkter Irish Punk mit Fiddle, Bodhrán und einem Refrain, den die ganze Kneipe grölt. Drei Akkorde, ein Pint, kein Limit. ',
      },
      { t: 'Folk-Tradition trifft auf Punk-Energie.', em: true },
    ],
    tags: ['Fiddle', 'Tin Whistle', 'Singalong'],
    image: {
      src: 'https://www.eyirish.de/assets/logo-center-DCymEqKZ.png',
      fit: 'contain',
      pad: true,
      alt: 'Eyirish Logo',
    },
    releaseTag: 'Irish Punk',
    spotifyArtistId: '7cc1XBu3FdO1r8iqx9MRxO',
    appleArtistId: 1755193672,
    youtubeChannelId: 'UCXT5-iCTs2GZVINjJsVZjQw',
    uploadsPlaylistId: 'UUXT5-iCTs2GZVINjJsVZjQw',
    website: 'https://www.eyirish.de',
    links: [
      { label: 'Spotify', href: 'https://open.spotify.com/intl-de/artist/7cc1XBu3FdO1r8iqx9MRxO' },
      { label: 'Apple Music', href: 'https://music.apple.com/de/artist/eyirish/1755193672' },
      { label: 'Amazon', href: 'https://music.amazon.de/artists/B0DNXL9YZY' },
      { label: 'Deezer', href: 'https://www.deezer.com/search/Eyirish' },
      { label: 'YouTube', href: 'https://www.youtube.com/@eyirish' },
      { label: 'eyirish.de ↗', href: 'https://www.eyirish.de', primary: true },
    ],
    fallbackReleases: { albums: 2, singles: 9 },
  },
  {
    key: 'null5er',
    name: '0,5er',
    genre: 'Deutschpop · Rock · HipHop',
    accent: '#ff7a3d',
    accentSoft: 'rgba(255,122,61,.4)',
    figureGlow: 'radial-gradient(circle at 70% 30%, rgba(255,122,61,.2), transparent 70%)',
    description: [
      {
        t: 'Ein halber Liter Lebensgefühl. Deutsche Texte zwischen Pop-Hook, Rock-Gitarre und HipHop-Flow — ',
      },
      { t: 'ehrlich, frech und tanzbar.', em: true },
      { t: ' Musik für die letzte Runde und den ersten Kaffee danach.' },
    ],
    tags: ['Deutsch', 'Flow', 'Hooks'],
    image: {
      src: 'https://www.null5er.de/images/avatar.png',
      fit: 'contain',
      pad: true,
      alt: '0,5er Logo',
    },
    releaseTag: 'Deutschpop',
    spotifyArtistId: '0Vj9eTq3IH9zbX0k9Q4GzJ',
    appleArtistId: 1750242664,
    youtubeChannelId: 'UCU6n-cFsjVpSyUvKEx72kww',
    uploadsPlaylistId: 'UUU6n-cFsjVpSyUvKEx72kww',
    website: 'https://www.null5er.de',
    links: [
      { label: 'Spotify', href: 'https://open.spotify.com/intl-de/artist/0Vj9eTq3IH9zbX0k9Q4GzJ' },
      { label: 'Apple Music', href: 'https://music.apple.com/de/artist/0-5er/1750242664' },
      { label: 'Amazon', href: 'https://music.amazon.de/artists/B0D6757VGJ' },
      { label: 'Deezer', href: 'https://www.deezer.com/de/artist/395362611' },
      { label: 'YouTube', href: 'https://www.youtube.com/channel/UCU6n-cFsjVpSyUvKEx72kww' },
      { label: 'null5er.de ↗', href: 'https://www.null5er.de', primary: true },
    ],
    fallbackReleases: { albums: 3, singles: 3 },
  },
  {
    key: 'papibaras',
    name: 'Die PapiBaras',
    genre: 'Kindergerechter Rock',
    accent: '#3de0ff',
    accentSoft: 'rgba(61,224,255,.4)',
    figureGlow: 'radial-gradient(circle at 30% 30%, rgba(61,224,255,.2), transparent 70%)',
    description: [
      {
        t: 'Echte Rockmusik für die ganze Familie. Riffs zum Mitwackeln, Texte zum Mitsingen und null Langeweile — ',
      },
      { t: 'laut genug für die Kids, gut genug für die Eltern.', em: true },
      { t: ' Capybara-Power auf der Bühne.' },
    ],
    tags: ['Familie', 'Mitsingen', 'Live-Spaß'],
    image: {
      src: 'https://i.scdn.co/image/ab67616d00001e027671c6944f11a26d601b63e9',
      fit: 'cover',
      pad: false,
      alt: 'Die PapiBaras',
    },
    releaseTag: 'Familienrock',
    spotifyArtistId: '6jn0ANUkdqKGqWcr819Jew',
    appleArtistId: 6780271557,
    youtubeChannelId: 'UCYZOsBnLVeQCCpXAG0E6Phw',
    uploadsPlaylistId: 'UUYZOsBnLVeQCCpXAG0E6Phw',
    website: 'https://papibaras.de',
    links: [
      { label: 'Spotify', href: 'https://open.spotify.com/intl-de/artist/6jn0ANUkdqKGqWcr819Jew' },
      { label: 'Apple Music', href: 'https://music.apple.com/de/artist/die-papibaras/6780271557' },
      { label: 'Amazon', href: 'https://music.amazon.de/artists/B0H5B7NF3W/die-papibaras' },
      { label: 'Deezer', href: 'https://www.deezer.com/de/artist/396760961' },
      { label: 'YouTube', href: 'https://www.youtube.com/channel/UCYZOsBnLVeQCCpXAG0E6Phw' },
      { label: 'papibaras.de ↗', href: 'https://papibaras.de', primary: true },
    ],
    fallbackReleases: { albums: 0, singles: 1 },
  },
]
