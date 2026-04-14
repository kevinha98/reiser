# ?? Min Ferie — Thailand 2026

Et moderne reisedashboard for en Thailand-tur (august–september 2026). Bygget med React 19, Framer Motion og Tailwind CSS. Gir en interaktiv oversikt over destinasjoner, animert rutekart, nedtelling, budsjettoversikt og sjekkliste.

> **Live demo:** [kevinha98.github.io/reiser](https://kevinha98.github.io/reiser/)

---

## Funksjoner

| Funksjon | Beskrivelse |
| --- | --- |
| **Nedtelling** | Sanntids nedtelling til avreise (CPH ? BKK, 11. aug 2026) |
| **Destinasjonskort** | 3D-tilt-kort med luksusbilder for hvert reisestopp |
| **Rutekart** | Animert SVG-kart som viser hele reiseruten gjennom Thailand |
| **Reiseplan** | Kronologisk oversikt over fly og hotell-innsjekk |
| **Budsjettoversikt** | Totalkostnader fordelt på transport og overnatting |
| **Sjekkliste** | Interaktiv sjekkliste med lokal lagringstilstand |

---

## Reiseplan

| Datoer | Destinasjon | Hotell | Netter |
| --- | --- | --- | --- |
| 11. aug | Avreise CPH ? BKK (Business Class) | — | — |
| 12.–15. aug | Bangkok | Hope Land Hotel Sukhumvit 8 | 3 |
| 15.–22. aug | Koh Samui | Lamai Coconut Beach Resort | 7 |
| 22.–29. aug | Phuket | Chanalai Flora Resort, Kata Beach | 7 |
| 29. aug – 1. sep | Bangkok | Mandarin Hotel Centre Point | 3 |
| 1. sep | Hjemreise BKK ? CPH (Business Class) | — | — |

---

## Teknisk stack

| Lag | Teknologi |
| --- | --- |
| **Rammeverk** | [React 19](https://react.dev/) + [TypeScript 6](https://www.typescriptlang.org/) |
| **Byggverktøy** | [Vite 8](https://vitejs.dev/) med `base: './'` for GitHub Pages |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) + egne glass-verktøyklasser |
| **Animasjon** | [Framer Motion 11](https://www.framer.com/motion/) — 3D-tilt, strekanimering, inngangsanimasjoner |
| **Ikoner** | [Lucide React](https://lucide.dev/) |
| **Fonter** | DM Sans (600/700) + Inter (400/500) via Google Fonts |
| **Bilder** | Unsplash CDN — kuraterte luksusbilder per destinasjon |
| **Publisering** | [GitHub Actions](https://github.com/features/actions) ? [GitHub Pages](https://pages.github.com/) |
| **Tilstand** | `localStorage` med nøkkel `min-ferie-sjekkliste-v2` for sjekkliste |

---

## Kom i gang

### Krav

- [Node.js](https://nodejs.org/) v18+ (testet på v22.14.0)
- npm

### Installasjon og oppstart

```bash
# Klon repoet
git clone https://github.com/kevinha98/reiser.git
cd reiser

# Installer avhengigheter
npm install

# Start dev-server
npm run dev
```

Åpne [http://localhost:5173](http://localhost:5173) i nettleseren.

---

## Bygg og publisering

```bash
# Produksjonsbygg (genererer til ./dist/)
npm run build

# Forhåndsvis produksjonsbygget lokalt
npm run preview
```

**Automatisk publisering** via GitHub Actions ved push til `main`:

```
push til main ? npm ci ? npm run build ? deploy ./dist ? GitHub Pages
```

`base: './'` i `vite.config.ts` sikrer at stier fungerer korrekt på GitHub Pages.

---

## Prosjektstruktur

```text
min-ferie/
+-- .github/
¦   +-- workflows/
¦       +-- deploy.yml          # GitHub Actions ? Pages-publisering
+-- public/                     # Statiske filer
+-- scripts/
¦   +-- verify.py               # Playwright smoke-test
¦   +-- verify_map.py           # Visuell kartverifisering
+-- src/
¦   +-- components/
¦   ¦   +-- Budsjett.tsx        # Budsjettoversikt og utgiftstabell
¦   ¦   +-- Destinasjoner.tsx   # Rutenett med destinasjonskort
¦   ¦   +-- DestinasjonKort.tsx # 3D-tilt destinasjonskort med bilde
¦   ¦   +-- Header.tsx          # Hero-seksjon med nedtelling
¦   ¦   +-- KartSeksjon.tsx     # Animert SVG-rutekart
¦   ¦   +-- Sjekkliste.tsx      # Interaktiv sjekkliste
¦   ¦   +-- Tidslinje.tsx       # Kronologisk reiseplan
¦   +-- App.tsx                 # Rotoppsett
¦   +-- data.ts                 # Eneste kilde til sannhet for reisedata
¦   +-- index.css               # Tailwind + egne glass-verktøyklasser
¦   +-- main.tsx                # Inngangspunkt
+-- index.html
+-- package.json
+-- tailwind.config.js
+-- tsconfig.json
+-- vite.config.ts
```

---

## Designsystem

### Farger

| Token | Verdi | Bruk |
| --- | --- | --- |
| Bakgrunn | `#080b10` | Sidebunn |
| Gull | `amber-400` `#f59e0b` | Bangkok, primær aksent |
| Hav | `sky-400` `#38bdf8` | Koh Samui |
| Jungel | `emerald-400` `#34d399` | Phuket |
| Primær tekst | `white` | Overskrifter |
| Sekundær tekst | `slate-400/500` | Brødtekst, etiketter |
| Nedtonet tekst | `slate-600/700` | Undertekster |

### Glass-verktøyklasse

```css
.glass {
  backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
}
```

### Typografi

- **Overskrifter:** DM Sans, vekt 600
- **Brødtekst:** Inter, vekt 400/500
- **Tall:** Tabular nums via Tailwind `tabular-nums`

---

## Tilgjengelighet

WCAG 2.1 AA-kompatibel (verifisert med [axe-core](https://github.com/dequelabs/axe-core) 4.9.1 via Playwright):

- ? 0 brudd på desktop (1440px) og mobil (390px)
- ? Dekorative elementer markert med `aria-hidden="true"`
- ? Alle interaktive elementer har tilgjengelige etiketter
- ? Tilstrekkelig fargekontrast

Kjør smoke-test (krever dev-server på port 5173 eller 5174):

```bash
python scripts/verify.py
```

---

## Lisens

Privat prosjekt — ikke lisensiert for offentlig bruk.

---

*Bygget med React, Framer Motion og Tailwind CSS*
