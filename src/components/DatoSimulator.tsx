import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FlaskConical, X } from 'lucide-react'
import { useReisefase } from '../context/reisefase-context'

const HURTIGVALG: { etikett: string; dato: string | null }[] = [
  { etikett: 'Nå (ekte)', dato: null },
  { etikett: 'Før (2. aug)', dato: '2026-08-02' },
  { etikett: 'Avreise (11. aug)', dato: '2026-08-11' },
  { etikett: 'Koh Samui (18. aug)', dato: '2026-08-18' },
  { etikett: 'Phuket (25. aug)', dato: '2026-08-25' },
  { etikett: 'Siste dag (1. sep)', dato: '2026-09-01' },
  { etikett: 'Hjemme (3. sep)', dato: '2026-09-03' },
]

function synligVedStart(): boolean {
  try {
    return (
      new URLSearchParams(window.location.search).has('sim') ||
      !!localStorage.getItem('min-ferie-simdato')
    )
  } catch {
    return false
  }
}

export function DatoSimulator() {
  const { simDato, settSimDato, fase, dagNr, totalDager } = useReisefase()
  const [åpen, setÅpen] = useState(false)
  const [vis] = useState(synligVedStart)

  if (!vis) return null

  return (
    <div className="fixed bottom-4 right-4 z-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <AnimatePresence>
        {åpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="mb-3 w-64 rounded-2xl p-4"
            style={{
              background: 'rgba(12,16,22,0.95)',
              border: '1px solid rgba(245,223,168,0.25)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-amber-200 text-xs font-semibold uppercase tracking-widest">
                Simuler dato
              </span>
              <button
                onClick={() => setÅpen(false)}
                className="text-slate-500 hover:text-slate-300 cursor-pointer"
                aria-label="Lukk simulator"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-slate-400 text-[11px] mb-3">
              Fase: <span className="text-amber-300">{fase}</span>
              {fase === 'under' && (
                <> · Dag {dagNr} av {totalDager}</>
              )}
            </p>

            <input
              type="date"
              value={simDato ?? ''}
              onChange={(e) => settSimDato(e.target.value || null)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 mb-3 focus:outline-none focus:border-amber-500/50"
            />

            <div className="flex flex-col gap-1">
              {HURTIGVALG.map((v) => {
                const aktiv = (v.dato ?? null) === (simDato ?? null)
                return (
                  <button
                    key={v.etikett}
                    onClick={() => settSimDato(v.dato)}
                    className={`text-left text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                      aktiv
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {v.etikett}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setÅpen((o) => !o)}
        whileTap={{ scale: 0.94 }}
        className="flex items-center gap-2 rounded-full px-4 py-2.5 cursor-pointer"
        style={{
          background: simDato ? 'rgba(245,223,168,0.15)' : 'rgba(12,16,22,0.9)',
          border: `1px solid ${simDato ? 'rgba(245,223,168,0.4)' : 'rgba(255,255,255,0.12)'}`,
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        }}
      >
        <FlaskConical size={14} className={simDato ? 'text-amber-300' : 'text-slate-400'} strokeWidth={1.75} />
        <span className={`text-xs font-medium ${simDato ? 'text-amber-200' : 'text-slate-300'}`}>
          {simDato ? `Simulerer ${simDato}` : 'Simuler dato'}
        </span>
      </motion.button>
    </div>
  )
}
