import { Header } from './components/Header'
import { Destinasjoner } from './components/Destinasjoner'
import { KartSeksjon } from './components/KartSeksjon'
import { Tidslinje } from './components/Tidslinje'
import { Lounger } from './components/Lounger'
import { Budsjett } from './components/Budsjett'
import { Sjekkliste } from './components/Sjekkliste'

export default function App() {
  return (
    <div className="min-h-dvh" style={{ background: '#080b10' }}>
      <div className="relative z-10">
        <Header />

        <main>
          <Destinasjoner />
          <KartSeksjon />
          <Tidslinje />
          <Lounger />
          <Budsjett />
          <Sjekkliste />
        </main>

        <footer className="pb-16 text-center">
          <p className="text-slate-500 text-xs">Thailand · 2026</p>
        </footer>
      </div>
    </div>
  )
}

