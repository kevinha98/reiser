import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Moon, Building2, TreePalm, Waves } from 'lucide-react'
import type { Destinasjon } from '../data'

const IKONER = {
  gold: Building2,
  ocean: Waves,
  jungle: TreePalm,
}

// Unified muted accent per destination type — colour only in small elements
const AKSENT = {
  gold:   { dot: 'bg-amber-400',   tekst: 'text-amber-400',   ring: 'ring-amber-400/20' },
  ocean:  { dot: 'bg-sky-400',     tekst: 'text-sky-400',     ring: 'ring-sky-400/20'   },
  jungle: { dot: 'bg-emerald-400', tekst: 'text-emerald-400', ring: 'ring-emerald-400/20' },
}

interface DestinasjonKortProps {
  destinasjon: Destinasjon
  indeks: number
}

export function DestinasjonKort({ destinasjon, indeks }: DestinasjonKortProps) {
  const a = AKSENT[destinasjon.farge]
  const Ikon = IKONER[destinasjon.farge]

  const kortRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 180, damping: 28 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 180, damping: 28 })

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = kortRef.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function onMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: indeks * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="perspective-1000"
    >
      <motion.div
        ref={kortRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.015 }}
        transition={{ duration: 0.25 }}
        className="glass rounded-2xl p-6 cursor-default h-full"
      >
        {/* Content lifted in Z */}
        <div style={{ transform: 'translateZ(16px)' }}>
          {/* Accent dot + period */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className={`w-2 h-2 rounded-full ${a.dot}`} />
              <span className="text-slate-500 text-xs tracking-wider uppercase">{destinasjon.periode}</span>
            </div>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ring-1 ${a.ring} bg-white/[0.03]`}>
              <Ikon size={16} className={a.tekst} />
            </div>
          </div>

          {/* Name */}
          <h3 className="text-white text-xl mb-1.5 leading-tight"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
            {destinasjon.navn}
          </h3>
          <p className="text-slate-500 text-sm mb-5 leading-relaxed">{destinasjon.beskrivelse}</p>

          {/* Divider */}
          <div className="h-px bg-white/[0.06] mb-4" />

          {/* Hotel + nights */}
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-slate-600 text-xs uppercase tracking-wider mb-0.5">Overnatting</p>
              <p className="text-slate-300 text-sm leading-snug truncate">{destinasjon.hotell}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Moon size={12} className="text-slate-600" />
              <span className="text-slate-500 text-sm tabular-nums">{destinasjon.netter}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

