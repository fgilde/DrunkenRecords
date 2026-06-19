# DrunkenRecords

Website für das Independent Music Label **DrunkenRecords** — schwarz, cinematisch, neon, voll animiert.
Echte **Vite + React + TypeScript**-App, deploybar auf **Cloudflare Pages**.

## Bands
- **Eyirish** — Irish Punk · Rock · Folk
- **0,5er** — Deutschpop · Rock · HipHop
- **Die PapiBaras** — Kindergerechter Rock

## Features
- **Echte Release-Zahlen** (Alben + Singles) je Band — live von der iTunes/Apple-Music-API,
  ohne API-Key, über eine Cloudflare Pages Function (`functions/api/releases.ts`).
- **Echte YouTube-Video-Übersicht** je Band — keyless eingebettete Uploads-Playlists.
- **audiola.de-Promo** — bewirbt das hauseigene, kostenlose Audio-Tool mit großem Logo.

## Tech-Stack
- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + TypeScript
- Cloudflare Pages (statischer Build) + Pages Functions (Serverless-API)

## Lokal entwickeln
```bash
npm install
npm run dev
```
Der Vite-Dev-Server serviert auch `/api/releases` lokal (siehe `vite.config.ts`), sodass die echten
Release-Zahlen ohne weiteres Setup funktionieren.

Optional die Pages Function realitätsnah testen (nach `npm run build`):
```bash
npm run pages:dev
```

## Build
```bash
npm run build      # tsc --noEmit && vite build -> dist/
npm run preview    # gebautes dist/ lokal ansehen
```

## Deployment auf Cloudflare Pages
1. Repo mit Cloudflare Pages verbinden (Git-Integration) oder via Wrangler hochladen.
2. Build-Einstellungen:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. Functions werden automatisch aus dem `functions/`-Verzeichnis übernommen
   (`/api/releases`). `public/_routes.json` sorgt dafür, dass nur `/api/*` die Function
   trifft und alles andere statisch ausgeliefert wird.

Es sind **keine Secrets / API-Keys** nötig — alle Datenquellen sind keyless.

## Projektstruktur
```
index.html              # Vite-Entry (Fonts, Meta, #root)
src/
  main.tsx              # React-Mount
  App.tsx               # Seitenkomposition
  data/bands.ts         # Stammdaten der Bands (IDs, Links, Bilder, Farben)
  styles/global.css     # gesamtes Design (Keyframes, Hover/Focus)
  hooks/useDrunkenFx.ts # Cursor-Glow, Parallax, Scroll-Progress, Reveals
  lib/useReleases.ts    # Fetch der Release-Zahlen (mit Fallback)
  components/           # Nav, Hero, Marquee, Bands, Releases, Videos, Story, AudiolaPromo, Booking, Footer ...
functions/
  api/releases.ts       # Cloudflare Pages Function: echte Release-Zahlen via iTunes
public/_routes.json     # Cloudflare-Routing (nur /api/* -> Function)
legacy/                 # ursprüngliche Design-Component-Dateien (Archiv)
```

## Datenquellen
- **Releases:** `https://itunes.apple.com/lookup?id=<appleArtistId>&entity=album` — Alben/Singles
  werden über Trackanzahl und „… - Single"-Namenskonvention klassifiziert.
- **Videos:** YouTube-Uploads-Playlist je Kanal (`UC…` → `UU…`), eingebettet über
  `youtube-nocookie.com`.

## Legacy
Die ursprünglich mit Claude Design erstellte Version (Design-Component-Format) liegt unter
`legacy/` (`DrunkenRecords.dc.html`, `support.js`, `image-slot.js`, gebündeltes `index.html`).
