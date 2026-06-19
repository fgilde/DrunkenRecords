# DrunkenRecords

Website für das Independent Music Label **DrunkenRecords** — schwarz, cinematisch, neon, voll animiert.
Echte **Vite + React + TypeScript**-App, deployt als **Cloudflare Worker mit Static Assets**.

## Bands
- **Eyirish** — Irish Punk · Rock · Folk
- **0,5er** — Deutschpop · Rock · HipHop
- **Die PapiBaras** — Kindergerechter Rock

## Features
- **Echte Release-Zahlen** (Alben + Singles) je Band — live von der iTunes/Apple-Music-API,
  ohne API-Key, über den Worker (`/api/releases`).
- **Echte YouTube-Musikvideos** je Band — neuestes Video eingebettet + „Alle Videos"-Modal
  mit allen Clips (keyless via RSS der „- Topic"-Kanäle, daher nur Musik).
- **audiola.de-Promo** — bewirbt das hauseigene, kostenlose Audio-Tool mit großem Logo.

## Tech-Stack
- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + TypeScript (statischer Build → `dist/`)
- [Cloudflare Worker mit Static Assets](https://developers.cloudflare.com/workers/static-assets/):
  der Worker serviert `dist/` und beantwortet `/api/releases` dynamisch.

## Lokal entwickeln
```bash
npm install
npm run dev
```
Der Vite-Dev-Server serviert auch `/api/releases` lokal (siehe `vite.config.ts`), sodass die echten
Release-Zahlen ohne weiteres Setup funktionieren.

Den echten Worker (inkl. Static-Assets-Routing) lokal testen:
```bash
npm run build
npm run cf:dev          # = wrangler dev  ->  http://127.0.0.1:8787
```

## Build & Deploy
```bash
npm run build           # tsc --noEmit && vite build -> dist/
npm run deploy          # build + wrangler deploy
```

## Deployment auf Cloudflare (Workers Builds / Git-Integration)
Das Projekt ist ein **Worker mit Static Assets**, konfiguriert über `wrangler.jsonc`
(Worker-Name `drunkenrecords`, Assets aus `./dist`, Binding `ASSETS`).

In den Build-Einstellungen des Workers (Einstellungen → Erstellen → Build-Konfiguration):

| Feld | Wert |
| --- | --- |
| **Build-Befehl** | `npm run build` |
| **Bereitstellungsbefehl** (Deploy command) | `npx wrangler deploy` |
| **Stammverzeichnis / Pfad** (Root directory) | *(leer / `/`)* — **nicht** `/dist` |

> ⚠️ `/dist` ist das Build-**Ausgabeverzeichnis**, nicht die Repo-Wurzel. Steht es im Feld
> „Stammverzeichnis/Pfad", schlägt der Build mit *„root directory not found"* fehl. Den Pfad
> zur Wurzel (leer) setzen — das `dist/`-Verzeichnis kennt Cloudflare aus `wrangler.jsonc`.

Es sind **keine Secrets / API-Keys** nötig — alle Datenquellen sind keyless. Die `drunkenrecords.de`-
Domain bleibt über die bestehende Worker-Route verbunden.

## Projektstruktur
```
index.html              # Vite-Entry (Fonts, Meta, #root)
wrangler.jsonc          # Cloudflare Worker + Static-Assets-Konfiguration
src/
  main.tsx              # React-Mount
  App.tsx               # Seitenkomposition
  data/bands.ts         # Stammdaten der Bands (IDs, Links, Bilder, Farben)
  styles/global.css     # gesamtes Design (Keyframes, Hover/Focus)
  hooks/useDrunkenFx.ts # Cursor-Glow, Parallax, Scroll-Progress, Reveals
  lib/useReleases.ts    # Fetch der Release-Zahlen (mit Fallback)
  lib/useVideos.ts      # Fetch der Musikvideos
  components/           # Nav, Hero, Marquee, Bands, Releases, Videos, VideoModal, Story, AudiolaPromo, Booking, Footer ...
worker/
  index.ts              # Worker-Entry: /api/releases, /api/videos + Static-Assets-Fallback
  releases.ts           # echte Release-Zahlen via iTunes (auch vom Dev-Server genutzt)
  videos.ts             # Musikvideos via YouTube-RSS (auch vom Dev-Server genutzt)
legacy/                 # ursprüngliche Design-Component-Dateien (Archiv)
```

## Datenquellen
- **Releases:** `https://itunes.apple.com/lookup?id=<appleArtistId>&entity=album` — Alben/Singles
  werden über Trackanzahl und „… - Single"-Namenskonvention klassifiziert (`worker/releases.ts`).
- **Videos:** YouTube-RSS-Feed je Kanal (`feeds/videos.xml?channel_id=…`, `worker/videos.ts`).
  Für Eyirish wird der **„Eyirish - Topic"-Kanal** genutzt (nur Musik) statt `@eyirish`
  (enthält fremde AmbiWall-Videos). Wiedergabe über `youtube-nocookie.com`.

## Legacy
Die ursprünglich mit Claude Design erstellte Version (Design-Component-Format) liegt unter
`legacy/` (`DrunkenRecords.dc.html`, `support.js`, `image-slot.js`, gebündeltes `index.html`).
