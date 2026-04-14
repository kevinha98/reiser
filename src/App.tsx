import { Header } from './components/Header'
import { Destinasjoner } from './components/Destinasjoner'
import { Tidslinje } from './components/Tidslinje'
import { Budsjett } from './components/Budsjett'
import { Sjekkliste } from './components/Sjekkliste'

export default function App() {
  return (
    <div className="min-h-dvh" style={{ background: 'linear-gradient(160deg, #0a0d12 0%, #0d1117 40%, #080c10 100%)' }}>
      {/* Grain texture overlay */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />

      <div className="relative z-10">
        <Header />

        <main>
          <Destinasjoner />
          <Tidslinje />
          <Budsjett />
          <Sjekkliste />
        </main>

        <footer className="pb-16 text-center">
          <p className="text-slate-700 text-xs">Min Ferie · Thailand 2025 · Kevin & Hilde</p>
        </footer>
      </div>
    </div>
  )
}

