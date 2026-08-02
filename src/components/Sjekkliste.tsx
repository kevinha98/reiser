import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, Plus, Trash2, RotateCcw, Eye, EyeOff } from 'lucide-react'
import type { SjekklisteElement } from '../data'
import { STANDARD_SJEKKLISTE } from '../data'
import { useReisefase } from '../context/reisefase-context'

const STORAGE_KEY = 'min-ferie-sjekkliste-v2'

function lastFraStorage(): SjekklisteElement[] {
  const standard = STANDARD_SJEKKLISTE.map((el) => ({ ...el, fullfort: false }))
  try {
    const lagret = localStorage.getItem(STORAGE_KEY)
    if (!lagret) return standard
    const parsed: SjekklisteElement[] = JSON.parse(lagret)
    // Fletting: standardelementene er fasit for innhold, men behold avkryssing fra lagring.
    const statusById = new Map(parsed.map((el) => [el.id, el.fullfort]))
    const standardIds = new Set(STANDARD_SJEKKLISTE.map((el) => el.id))
    const flettet = standard.map((el) => ({ ...el, fullfort: statusById.get(el.id) ?? false }))
    const egne = parsed.filter((el) => !standardIds.has(el.id))
    return [...flettet, ...egne]
  } catch {
    // localStorage utilgjengelig eller korrupt — fall tilbake til standardlisten
  }
  return standard
}

function lagreTilStorage(liste: SjekklisteElement[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(liste))
  } catch {
    // localStorage utilgjengelig (privat modus / full kvote) — ignorer lagring
  }
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
        className={`flex-1 text-sm transition-[color,text-decoration-color] duration-200 ${
          element.fullfort ? 'line-through text-slate-600' : 'text-slate-300'
        }`}
      >
        {element.tekst}
        {element.lenke && (
          <>
            {' '}
            <a
              href={element.lenke}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-amber-400 hover:text-amber-300 underline underline-offset-2"
            >
              {element.lenkeTekst ?? 'Lenke'} →
            </a>
          </>
        )}
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
  const [visFerdigeForOppgaver, setVisFerdigeForOppgaver] = useState(false)
  const { fase } = useReisefase()

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

  // Under reisen: ferdige "før avreise"-oppgaver er ikke lenger relevante og skjules som standard
  const erForOppgave = (el: SjekklisteElement) => (el.fase ?? 'før') === 'før'
  const ferdigeForCount = filtrert.filter((el) => erForOppgave(el) && el.fullfort).length
  const kanDekluttre = fase !== 'før' && ferdigeForCount > 0
  const synlige =
    kanDekluttre && !visFerdigeForOppgaver
      ? filtrert.filter((el) => !(erForOppgave(el) && el.fullfort))
      : filtrert

  // Group by category for display
  const gruppert = useMemo(() => {
    const grupper: Record<string, SjekklisteElement[]> = {}
    synlige.forEach((el) => {
      if (!grupper[el.kategori]) grupper[el.kategori] = []
      grupper[el.kategori].push(el)
    })
    return grupper
  }, [synlige])

  return (
    <section className="px-4 mb-20 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", duration: 0.45, bounce: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display font-600 text-2xl text-white mb-1"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
              Sjekkliste
            </h2>
            <p className="text-slate-400 text-sm">{fullfort} av {total} fullført</p>
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
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          />
        </div>
      </motion.div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hidden mb-6 pb-1">
        {alleKategorier.map((kat) => (
          <motion.button
            key={kat}
            onClick={() => setAktivKategori(kat)}
            whileTap={{ scale: 0.95 }}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium cursor-pointer ${
              aktivKategori === kat
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-white/10'
            }`}
            style={{ transition: 'background-color 120ms ease-out, color 120ms ease-out, border-color 120ms ease-out' }}
          >
            {kat}
          </motion.button>
        ))}
      </div>

      {/* Under reisen: veksle synlighet for ferdige før-avreise-oppgaver */}
      {kanDekluttre && (
        <button
          onClick={() => setVisFerdigeForOppgaver((v) => !v)}
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-4 -mt-1 cursor-pointer"
        >
          {visFerdigeForOppgaver ? <EyeOff size={13} /> : <Eye size={13} />}
          {visFerdigeForOppgaver
            ? `Skjul ${ferdigeForCount} ferdige før-avreise-oppgaver`
            : `Vis ${ferdigeForCount} ferdige før-avreise-oppgaver`}
        </button>
      )}

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
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:bg-white/8"
                  style={{ transition: 'border-color 150ms ease-out, background-color 150ms ease-out' }}
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
                className="w-full flex items-center gap-2 px-6 py-3.5 text-slate-500 hover:text-slate-300 hover:bg-white/[0.02] text-sm cursor-pointer"
                style={{ transition: 'color 120ms ease-out, background-color 120ms ease-out' }}
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
