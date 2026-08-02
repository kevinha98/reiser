import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Map, Armchair, Wallet, ListChecks } from "lucide-react"
import { Header } from "./components/Header"
import { Destinasjoner } from "./components/Destinasjoner"
import { KartSeksjon } from "./components/KartSeksjon"
import { Tidslinje } from "./components/Tidslinje"
import { Lounger } from "./components/Lounger"
import { Budsjett } from "./components/Budsjett"
import { Sjekkliste } from "./components/Sjekkliste"
import { NaKort } from "./components/NaKort"
import { DatoSimulator } from "./components/DatoSimulator"
import { ReisefaseProvider } from "./context/Reisefase"
import { useReisefase } from "./context/reisefase-context"

type TabId = "forside" | "lounger" | "budsjett" | "sjekkliste"

const TABS: { id: TabId; label: string; Icon: typeof Map }[] = [
  { id: "forside", label: "Forside", Icon: Map },
  { id: "lounger", label: "Lounger", Icon: Armchair },
  { id: "budsjett", label: "Budsjett", Icon: Wallet },
  { id: "sjekkliste", label: "Sjekkliste", Icon: ListChecks },
]

function AppInnhold() {
  const { fase } = useReisefase()
  const [tab, setTab] = useState<TabId>(() => (fase === "etter" ? "budsjett" : "forside"))

  return (
    <div className="min-h-dvh" style={{ background: "#080b10" }}>
      <div className="relative z-10">
        <Header />

        {/* Sticky tab bar */}
        <div
          className="sticky top-0 z-30"
          style={{
            background: "rgba(8,11,16,0.85)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <nav
            role="tablist"
            aria-label="Seksjoner"
            className="max-w-5xl mx-auto flex gap-1 px-4 py-2 overflow-x-auto scrollbar-hidden"
          >
            {TABS.map(({ id, label, Icon }) => {
              const active = tab === id
              return (
                <motion.button
                  key={id}
                  role="tab"
                  aria-selected={active}
                  aria-controls={`panel-${id}`}
                  id={`tab-${id}`}
                  onClick={() => setTab(id)}
                  whileTap={{ scale: 0.96 }}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm flex-shrink-0"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: active ? "#f5dfa8" : "rgba(148,163,184,0.9)",
                    fontWeight: active ? 600 : 500,
                    transition: "color 150ms ease-out",
                  }}
                >
                  {active && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "rgba(245,223,168,0.10)",
                        border: "1px solid rgba(245,223,168,0.30)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon size={15} strokeWidth={1.75} className="relative z-10" />
                  <span className="relative z-10">{label}</span>
                </motion.button>
              )
            })}
          </nav>
        </div>

        {/* Tab content */}
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              id={`panel-${tab}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
            >
              {tab === "forside" && (
                <>
                  <NaKort onNaviger={setTab} />
                  <Destinasjoner />
                  <KartSeksjon />
                  <Tidslinje />
                </>
              )}
              {tab === "lounger" && <Lounger />}
              {tab === "budsjett" && <Budsjett />}
              {tab === "sjekkliste" && <Sjekkliste />}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="pb-16 text-center">
          <p className="text-slate-500 text-xs">Thailand · 2026</p>
        </footer>
      </div>

      <DatoSimulator />
    </div>
  )
}

export default function App() {
  return (
    <ReisefaseProvider>
      <AppInnhold />
    </ReisefaseProvider>
  )
}
