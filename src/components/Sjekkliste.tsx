import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, Plus, Trash2, RotateCcw } from 'lucide-react'
import type { SjekklisteElement } from '../data'
import { STANDARD_SJEKKLISTE } from '../data'

const STORAGE_KEY = 'min-ferie-sjekkliste-v1'

function lastFraStorage(): SjekklisteElement[] {
  try {
    const lagret = localStorage.getItem(STORAGE_KEY)
    if (lagret) return JSON.parse(lagret)
  } catch {}
  return STANDARD_SJEKKLISTE.map((el) => ({ ...el, fullfort: false }))
}

function lagreTilStorage(liste: SjekklisteElement[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(liste))
  } catch {}
}

const KATEGORIER = ['Transport', 'Overnatting', 'Dokumenter', 'Helse', 'Pakking', 'Annet']

interface SjekklisteRadProps {
  element: SjekklisteElement
  onToggle: (id: string) => void
  onSlett: (id: string) => void
}

function SjekklisteRad({ element, onToggle, onSlett }: SjekklisteRadProps) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 group py-2.5 px-4 rounded-xl hover:bg-white/[0.03] transition-colors"
    >
      <button
        onClick={() => onToggle(element.id)}
        className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-full cursor-pointer"
        aria-label={element.fullfort ? 'Merk som ugjort' : 'Merk som gjort'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {element.fullfort ? (
            <motion.div
              key="ferdig"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CheckCircle2 size={20} className="text-emerald-400" />
            </motion.div>
          ) : (
            <motion.div
              key="tom"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Circle size={20} className="text-slate-600 group-hover:text-slate-500 transition-colors" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <span
        className={`flex-1 text-sm transition-all duration-300 ${
          element.fullfort ? 'line-through text-slate-600' : 'text-slate-300'
        }`}
      >
        {element.tekst}
      </span>

      <button
        onClick={() => onSlett(element.id)}
        className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 rounded-lg hover:bg-rose-500/10 cursor-pointer"
        aria-label="Slett"
      >
        <Trash2 size={13} className="text-rose-400" />
      </button>
    </motion.li>
  )
}

export function Sjekkliste() {
  const [liste, setListe] = useState<SjekklisteElement[]>(lastFraStorage)
  const [aktivKategori, setAktivKategori] = useState<string>('Alle')
  const [nyttElement, setNyttElement] = useState('')
  const [nyKategori, setNyKategori] = useState('Annet')
  const [visLeggTil, setVisLeggTil] = useState(false)

  useEffect(() => {
    lagreTilStorage(liste)
  }, [liste])

  function toggleElement(id: string) {
    setListe((prev) => prev.map((el) => (el.id === id ? { ...el, fullfort: !el.fullfort } : el)))
  }

  function slettElement(id: string) {
    setListe((prev) => prev.filter((el) => el.id !== id))
  }

  function leggTilElement() {
    const tekst = nyttElement.trim()
    if (!tekst) return
    const nytt: SjekklisteElement = {
      id: `custom-${Date.now()}`,
      tekst,
      kategori: nyKategori,
      fullfort: false,
    }
    setListe((prev) => [...prev, nytt])
    setNyttElement('')
    setVisLeggTil(false)
  }

  function tilbakestill() {
    if (!confirm('Tilbakestille hele sjekklisten?')) return
    setListe(STANDARD_SJEKKLISTE.map((el) => ({ ...el, fullfort: false })))
  }

  const alleKategorier = useMemo(() => {
    const kats = Array.from(new Set(liste.map((el) => el.kategori)))
    return ['Alle', ...kats]
  }, [liste])

  const filtrert = aktivKategori === 'Alle' ? liste : liste.filter((el) => el.kategori === aktivKategori)
  const fullfort = filtrert.filter((el) => el.fullfort).length
  const total = filtrert.length
  const fremgang = total > 0 ? (fullfort / total) * 100 : 0

  // Group by category for display
  const gruppert = useMemo(() => {
    const grupper: Record<string, SjekklisteElement[]> = {}
    filtrert.forEach((el) => {
      if (!grupper[el.kategori]) grupper[el.kategori] = []
      grupper[el.kategori].push(el)
    })
    return grupper
  }, [filtrert])

  return (
    <section className="px-4 mb-20 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display font-600 text-2xl text-white mb-1"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
              Sjekkliste
            </h2>
            <p className="text-slate-400 text-sm">{fullfort} av {total} fullfort</p>
          </div>
          <button
            onClick={tilbakestill}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors text-xs p-2 rounded-lg hover:bg-white/5 cursor-pointer"
            title="Tilbakestill"
          >
            <RotateCcw size={13} />
            Tilbakestill
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #10b981, #34d399)' }}
            animate={{ width: `${fremgang}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hidden mb-6 pb-1">
        {alleKategorier.map((kat) => (
          <button
            key={kat}
            onClick={() => setAktivKategori(kat)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
              aktivKategori === kat
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-white/10'
            }`}
          >
            {kat}
          </button>
        ))}
      </div>

      {/* Checklist grouped by category */}
      <div className="glass rounded-2xl overflow-hidden">
        <AnimatePresence mode="popLayout">
          {Object.entries(gruppert).map(([kategori, elementer]) => (
            <motion.div
              key={kategori}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {aktivKategori === 'Alle' && (
                <div className="px-4 pt-4 pb-1">
                  <span className="text-xs text-slate-600 uppercase tracking-widest font-medium">{kategori}</span>
                </div>
              )}
              <ul className="py-1 px-0">
                <AnimatePresence>
                  {elementer.map((el) => (
                    <SjekklisteRad
                      key={el.id}
                      element={el}
                      onToggle={toggleElement}
                      onSlett={slettElement}
                    />
                  ))}
                </AnimatePresence>
              </ul>
              {aktivKategori === 'Alle' && <div className="h-px bg-white/5 mx-4" />}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add item section */}
        <AnimatePresence>
          {visLeggTil ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-white/5"
            >
              <div className="p-4 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={nyttElement}
                  onChange={(e) => setNyttElement(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && leggTilElement()}
                  placeholder="Nytt element..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all"
                  autoFocus
                />
                <select
                  value={nyKategori}
                  onChange={(e) => setNyKategori(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-amber-500/50 cursor-pointer"
                >
                  {KATEGORIER.map((k) => (
                    <option key={k} value={k} className="bg-slate-900">{k}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={leggTilElement}
                    disabled={!nyttElement.trim()}
                    className="flex-1 sm:flex-none bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Legg til
                  </button>
                  <button
                    onClick={() => { setVisLeggTil(false); setNyttElement('') }}
                    className="px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors text-sm cursor-pointer"
                  >
                    Avbryt
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-t border-white/5"
            >
              <button
                onClick={() => setVisLeggTil(true)}
                className="w-full flex items-center gap-2 px-6 py-3.5 text-slate-500 hover:text-slate-300 hover:bg-white/[0.02] transition-all text-sm cursor-pointer"
              >
                <Plus size={15} />
                Legg til element
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
