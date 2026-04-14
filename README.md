# 🌴 Min Ferie — Thailand 2026

A modern, luxury travel dashboard for a Thailand trip (August–September 2026). Built with React 19, Framer Motion 11, and Tailwind CSS. Features an interactive destination overview, animated route map, live countdown, budget tracker, interactive checklist, and an AI travel assistant.

> **Live demo:** [kevinha98.github.io/reiser](https://kevinha98.github.io/reiser/)

---

## ✨ Features

| Feature | Description |
|---|---|
| **Live Countdown** | Real-time countdown timer to departure (CPH → BKK, 11 Aug 2026) |
| **Destination Cards** | 3D-tilt luxury destination cards with curated photography |
| **Route Map** | Animated SVG map showing the full journey across Thailand |
| **Timeline** | Chronological view of all flights and hotel check-ins |
| **Budget Tracker** | Summary of costs split by transport and accommodation |
| **Checklist** | Interactive pre-travel checklist with localStorage persistence |
| **AI Assistant** | Floating chatbot powered by Claude Sonnet (Radical Gateway) |

---

## 🗺️ Itinerary

| Dates | Destination | Hotel | Nights |
|---|---|---|---|
| 11 Aug | Departure CPH → BKK (Business Class) | — | — |
| 12–15 Aug | Bangkok | Hope Land Hotel Sukhumvit 8 | 3 |
| 15–22 Aug | Koh Samui | Lamai Coconut Beach Resort | 7 |
| 22–29 Aug | Phuket | Chanalai Flora Resort, Kata Beach | 7 |
| 29 Aug – 1 Sep | Bangkok | Mandarin Hotel Centre Point | 3 |
| 1 Sep | Return BKK → CPH (Business Class) | — | — |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [TypeScript 6](https://www.typescriptlang.org/) |
| **Build** | [Vite 8](https://vitejs.dev/) with `base: './'` for GitHub Pages |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) + custom glass utilities |
| **Animation** | [Framer Motion 11](https://www.framer.com/motion/) — 3D tilt, path drawing, entrance animations |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Fonts** | DM Sans (600/700) + Inter (400/500) via Google Fonts |
| **AI** | [Radical Gateway](https://gateway.raicode.no) → Claude Sonnet (`eu-sonnet-4-6`) |
| **Deploy** | [GitHub Actions](https://github.com/features/actions) → [GitHub Pages](https://pages.github.com/) |
| **State** | `localStorage` key `min-ferie-sjekkliste-v2` for checklist persistence |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ (tested on v22.14.0)
- npm (or pnpm/yarn)

### Install & run

```bash
# Clone
git clone https://github.com/kevinha98/reiser.git
cd reiser

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### AI Chatbot setup

The AI travel assistant requires a Radical Gateway API key.

1. Copy the example env file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and replace `your_api_key_here` with your key:
   ```
   VITE_RADICAL_API_KEY=your_actual_api_key
   ```

3. Get an API key from [gateway.raicode.no](https://gateway.raicode.no) (Azure AD or personal token).

> **Note:** Without an API key, all other features work. The chatbot button shows a "key missing" notice.

---

## 📁 Project Structure

```
min-ferie/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions → Pages deployment
├── public/                     # Static assets
├── src/
│   ├── api/
│   │   └── chatApi.ts          # Radical Gateway API wrapper
│   ├── components/
│   │   ├── Budsjett.tsx        # Budget summary + expense table
│   │   ├── Chatbot.tsx         # Floating AI chat panel
│   │   ├── Destinasjoner.tsx   # Destination cards grid
│   │   ├── DestinasjonKort.tsx # 3D-tilt destination card
│   │   ├── Header.tsx          # Hero section + countdown
│   │   ├── KartSeksjon.tsx     # Animated SVG route map
│   │   ├── Sjekkliste.tsx      # Interactive checklist
│   │   └── Tidslinje.tsx       # Journey timeline
│   ├── App.tsx                 # Root layout
│   ├── data.ts                 # Single source of truth for all trip data
│   ├── index.css               # Tailwind + custom glass utilities
│   └── main.tsx                # Entry point
├── .env.local                  # Local env vars (gitignored)
├── .env.local.example          # Template for API key setup
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🏗️ Build & Deploy

```bash
# Production build
npm run build         # Outputs to ./dist/

# Preview production build locally
npm run preview
```

**Automatic deployment** via GitHub Actions on every push to `main`:

```yaml
# .github/workflows/deploy.yml
# Runs: npm ci → npm run build → deploy ./dist to GitHub Pages
```

The `base: './'` in `vite.config.ts` ensures asset paths work correctly on GitHub Pages.

---

## 🎨 Design System

### Colors

| Token | Value | Usage |
|---|---|---|
| Background | `#080b10` | Page background |
| Gold | `amber-400` `#f59e0b` | Bangkok, primary accent |
| Ocean | `sky-400` `#38bdf8` | Koh Samui |
| Jungle | `emerald-400` `#34d399` | Phuket |
| Text primary | `white` | Headings |
| Text secondary | `slate-400/500` | Body, labels |
| Text muted | `slate-600/700` | Subtitles |

### Glass Utility

```css
.glass {
  backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
}
```

### Typography

- **Display/Headings:** DM Sans, weight 600
- **Body:** Inter, weight 400/500
- **Mono/Numbers:** Tabular nums via Tailwind `tabular-nums`

---

## ♿ Accessibility

WCAG 2.1 AA compliant (audited with [axe-core](https://github.com/dequelabs/axe-core) 4.9.1 via Playwright):

- ✅ 0 violations on desktop (1440px) and mobile (390px)
- ✅ Decorative elements marked `aria-hidden="true"`
- ✅ All interactive elements have accessible labels
- ✅ Sufficient color contrast ratios

Re-run audit (requires dev server running on port 5173):

```bash
python scripts/wcag_audit.py
```

---

## 🔒 Security

- **API keys** are stored in `.env.local` (gitignored), never committed
- **No server-side code** — fully static export
- **CSP-friendly** — no inline scripts beyond Vite's bundle
- **HTTPS-only** external requests (Unsplash CDN, Radical Gateway)

---

## 📝 License

Private project — not licensed for public use.

---

*Built with ❤️ using React, Framer Motion, and Claude Sonnet*
