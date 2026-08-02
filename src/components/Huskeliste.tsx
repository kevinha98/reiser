import { motion } from 'framer-motion'
import { NotebookPen } from 'lucide-react'
import { HUSKELISTE } from '../data'
import type { HuskelisteElement } from '../data'

const REKKEFØLGE = ['Transport', 'Overnatting', 'Dokumenter', 'Helse', 'Pakking', 'Annet']

export function Huskeliste() {
  const grupper: Record<string, HuskelisteElement[]> = {}
  HUSKELISTE.forEach((el) => {
    if (!grupper[el.kategori]) grupper[el.kategori] = []
    grupper[el.kategori].push(el)
  })
  const kategorier = Object.keys(grupper).sort(
    (a, b) => REKKEFØLGE.indexOf(a) - REKKEFØLGE.indexOf(b),
  )

  return (
    <section className="px-4 mb-20 max-w-5xl mx-auto pt-8">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', duration: 0.45, bounce: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)',
            }}
          >
            <NotebookPen size={15} className="text-slate-400" strokeWidth={1.5} />
          </div>
          <p className="text-slate-600 text-xs uppercase tracking-[0.2em]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Til reisen
          </p>
        </div>
        <h2 className="text-white text-2xl mb-1" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
          Huskeliste
        </h2>
        <p className="text-slate-400 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Ting å huske på før og under reisen.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kategorier.map((kat, i) => (
          <motion.div
            key={kat}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0.1, delay: i * 0.05 }}
            className="glass rounded-2xl p-5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <span className="text-xs text-slate-600 uppercase tracking-widest font-medium">{kat}</span>
            <ul className="mt-3 space-y-2.5">
              {grupper[kat].map((el) => (
                <li key={el.id} className="flex items-baseline gap-2.5">
                  <span
                    className="flex-shrink-0 rounded-full"
                    style={{ width: 5, height: 5, background: '#f5dfa8', marginTop: 7 }}
                  />
                  <span className="text-slate-300 text-sm leading-relaxed">
                    {el.tekst}
                    {el.lenke && (
                      <>
                        {' '}
                        <a
                          href={el.lenke}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:text-amber-300 underline underline-offset-2"
                        >
                          {el.lenkeTekst ?? 'Lenke'} →
                        </a>
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
