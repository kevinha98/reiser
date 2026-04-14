import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plane, MapPin, Star } from 'lucide-react'
import { REISEDATOER } from '../data'

function beregnNedtelling(målDato: string) {
  const nå = new Date()
  const mål = new Date(målDato)
  const diff = mål.getTime() - nå.getTime()

  if (diff <= 0) return null

  const dager = Math.floor(diff / (1000 * 60 * 60 * 24))
  const timer = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutter = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const sekunder = Math.floor((diff % (1000 * 60)) / 1000)
  return { dager, timer, minutter, sekunder }
}

interface NedtellingEnhetProps {
  verdi: number
  etikett: string
  forsinkelse: number
}

function NedtellingEnhet({ verdi, etikett, forsinkelse }: NedtellingEnhetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: forsinkelse, duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center"
    >
      <motion.div
        key={verdi}
        initial={{ rotateX: -90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="glass rounded-xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-2"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <span className="text-2xl sm:text-3xl font-display tabular-nums text-white font-semibold"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
          {String(verdi).padStart(2, '0')}
        </span>
      </motion.div>
      <span className="text-xs text-slate-500 uppercase tracking-widest font-medium">{etikett}</span>
    </motion.div>
  )
}

export function Header() {
  const [nedtelling, setNedtelling] = useState(beregnNedtelling(REISEDATOER.avreiseDato))

  useEffect(() => {
    const id = setInterval(() => {
      setNedtelling(beregnNedtelling(REISEDATOER.avreiseDato))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const avreist = nedtelling === null

  return (
    <header className="relative overflow-hidden pt-20 pb-14 px-4">
      <div className="relative max-w-5xl mx-auto text-center">
        {/* Tags row */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-3 mb-8"
        >
          <div className="inline-flex items-center gap-1.5 border border-white/10 rounded-full px-3.5 py-1.5">
            <MapPin size={11} className="text-slate-500" />
            <span className="text-xs text-slate-400 tracking-wide">Thailand 2026</span>
          </div>
          <div className="inline-flex items-center gap-1.5 border border-amber-500/25 rounded-full px-3.5 py-1.5 bg-amber-500/5">
            <Star size={11} className="text-amber-400" fill="currentColor" />
            <span className="text-xs text-amber-300 tracking-wide">Business Class</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl text-white mb-4 leading-tight tracking-tight"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
        >
          Min Ferie
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-500 text-sm mb-12 max-w-lg mx-auto"
        >
          {REISEDATOER.avreiseFly} · {REISEDATOER.totaltNetter} netter
        </motion.p>

        {/* Countdown or travelling indicator */}
        {!avreist ? (
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-slate-500 text-xs uppercase tracking-widest mb-5"
            >
              Avreise om
            </motion.p>
            <div className="flex items-start justify-center gap-4 sm:gap-6">
              <NedtellingEnhet verdi={nedtelling.dager} etikett="dager" forsinkelse={0.35} />
              <span className="text-slate-600 text-2xl mt-4">:</span>
              <NedtellingEnhet verdi={nedtelling.timer} etikett="timer" forsinkelse={0.4} />
              <span className="text-slate-600 text-2xl mt-4">:</span>
              <NedtellingEnhet verdi={nedtelling.minutter} etikett="min" forsinkelse={0.45} />
              <span className="text-slate-600 text-2xl mt-4">:</span>
              <NedtellingEnhet verdi={nedtelling.sekunder} etikett="sek" forsinkelse={0.5} />
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-3 glass-gold rounded-2xl px-8 py-4"
          >
            <motion.div
              animate={{ x: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <Plane size={20} className="text-amber-400" />
            </motion.div>
            <span className="text-amber-200 font-medium">Du er på ferie!</span>
          </motion.div>
        )}
      </div>
    </header>
  )
}
