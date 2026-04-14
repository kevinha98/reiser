import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Moon, Building2, TreePalm, Waves } from 'lucide-react'
import type { Destinasjon } from '../data'

const IKONER = {
  gold: Building2,
  ocean: Waves,
  jungle: TreePalm,
}

const FARGER = {
  gold: {
    glass: 'glass-gold',
    tekst: 'text-amber-300',
    underlinje: 'bg-amber-500',
    subtekst: 'text-amber-300/80',
    glow: 'rgba(217, 155, 38, 0.15)',
    iconBg: 'bg-amber-500/10',
    badge: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
  },
  ocean: {
    glass: 'glass-ocean',
    tekst: 'text-sky-300',
    underlinje: 'bg-sky-500',
    subtekst: 'text-sky-300/80',
    glow: 'rgba(14, 165, 233, 0.12)',
    iconBg: 'bg-sky-500/10',
    badge: 'bg-sky-500/10 text-sky-300 border border-sky-500/20',
  },
  jungle: {
    glass: 'glass-jungle',
    tekst: 'text-emerald-300',
    underlinje: 'bg-emerald-500',
    subtekst: 'text-emerald-300/80',
    glow: 'rgba(34, 197, 94, 0.12)',
    iconBg: 'bg-emerald-500/10',
    badge: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
  },
}

interface DestinasjonKortProps {
  destinasjon: Destinasjon
  indeks: number
}

export function DestinasjonKort({ destinasjon, indeks }: DestinasjonKortProps) {
  const f = FARGER[destinasjon.farge]
  const Ikon = IKONER[destinasjon.farge]

  const kortRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 25 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 25 })

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = kortRef.current?.getBoundingClientRect()
    if (!rect) return
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    x.set(nx)
    y.set(ny)
  }

  function onMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: indeks * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="perspective-1000"
    >
      <motion.div
        ref={kortRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className={`${f.glass} rounded-2xl p-6 cursor-default relative overflow-hidden`}
      >
        {/* Glow spot */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${f.glow}, transparent 70%)`, zIndex: 0 }}
        />

        {/* Content lifted in Z */}
        <div style={{ transform: 'translateZ(20px)', position: 'relative', zIndex: 1 }}>
          {/* Top row */}
          <div className="flex items-start justify-between mb-4">
            <div className={`${f.iconBg} rounded-xl w-11 h-11 flex items-center justify-center flex-shrink-0`}>
              <Ikon size={19} className={f.tekst} />
            </div>
            <span className={`${f.badge} text-xs rounded-full px-2.5 py-1 font-medium`}>
              {destinasjon.periode}
            </span>
          </div>

          {/* Name + description */}
          <h3 className={`font-display font-600 text-xl text-white mb-1`}
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
            {destinasjon.navn}
          </h3>
          <p className="text-slate-400 text-sm mb-4 leading-relaxed">{destinasjon.beskrivelse}</p>

          {/* Divider */}
          <div className="h-px bg-white/5 mb-4" />

          {/* Hotel + nights */}
          <div className="flex items-end justify-between">
            <div>
              <p className={`text-xs ${f.subtekst} uppercase tracking-wider mb-0.5`}>Hotell</p>
              <p className="text-slate-300 text-sm font-medium leading-snug">{destinasjon.hotell}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-4">
              <Moon size={13} className="text-slate-500" />
              <span className="text-slate-400 text-sm">{destinasjon.netter} netter</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
