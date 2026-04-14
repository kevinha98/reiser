import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plane, MapPin } from 'lucide-react'
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
        <span className="text-2xl sm:text-3xl font-display font-700 text-gradient-gold tabular-nums">
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
    <header className="relative overflow-hidden pt-16 pb-12 px-4">
      {/* Ambient glow */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, #d99b26 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(ellipse, #0ea5e9 0%, transparent 70%)' }} />
      </div>

      <div className="relative max-w-5xl mx-auto text-center" style={{ zIndex: 1 }}>
        {/* Destination tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 glass-gold rounded-full px-4 py-1.5 mb-6"
        >
          <MapPin size={13} className="text-amber-400" />
          <span className="text-xs text-amber-300 font-medium tracking-wide uppercase">Thailand 2026</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-700 text-4xl sm:text-6xl text-white mb-3 leading-tight"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
        >
          Min Ferie
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-sm sm:text-base mb-10 max-w-lg mx-auto"
        >
          {REISEDATOER.avreiseFly} · {REISEDATOER.totaltNetter} netter · 2026
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
            <span className="text-amber-200 font-medium">Du er på ferie! 🎉</span>
          </motion.div>
        )}
      </div>
    </header>
  )
}
