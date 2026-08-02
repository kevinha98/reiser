import { motion } from 'framer-motion'
import { Plane, MapPin, Hotel, Wallet, ListChecks, Armchair, Ticket, Sparkles, ArrowRight } from 'lucide-react'
import { useReisefase } from '../context/reisefase-context'
import { kortDato } from '../lib/reisefase'
import { REISEDATOER } from '../data'
import type { LucideIcon } from 'lucide-react'

type Fane = 'forside' | 'lounger' | 'aktiviteter' | 'budsjett' | 'huskeliste'

interface Handling {
  etikett: string
  fane: Fane
  Icon: LucideIcon
}

function Chip({ h, onNaviger }: { h: Handling; onNaviger: (f: Fane) => void }) {
  return (
    <button
      onClick={() => onNaviger(h.fane)}
      className="group inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium cursor-pointer"
      style={{
        background: 'rgba(245,223,168,0.10)',
        border: '1px solid rgba(245,223,168,0.28)',
        color: '#f5dfa8',
        transition: 'background-color 150ms ease-out',
      }}
    >
      <h.Icon size={13} strokeWidth={1.75} />
      {h.etikett}
      <ArrowRight
        size={12}
        strokeWidth={2}
        className="group-hover:translate-x-0.5"
        style={{ transition: 'transform 150ms cubic-bezier(0.23,1,0.32,1)' }}
      />
    </button>
  )
}

export function NaKort({ onNaviger }: { onNaviger: (f: Fane) => void }) {
  const { fase, dagNr, totalDager, dagerTil, gjeldende, neste } = useReisefase()

  let eyebrow: string
  let tittel: string
  let undertittel: string
  let hotellLink: string | undefined
  let Ikon: LucideIcon
  let handlinger: Handling[]

  if (fase === 'før') {
    eyebrow = 'Før avreise'
    tittel = dagerTil === 0 ? 'Avreise i dag!' : `${dagerTil} ${dagerTil === 1 ? 'dag' : 'dager'} til avreise`
    undertittel = REISEDATOER.avreiseFly
    Ikon = Plane
    handlinger = [
      { etikett: 'Huskeliste', fane: 'huskeliste', Icon: ListChecks },
      { etikett: 'Aktiviteter', fane: 'aktiviteter', Icon: Ticket },
      { etikett: 'Utreise-lounger', fane: 'lounger', Icon: Armchair },
    ]
  } else if (fase === 'under') {
    eyebrow = `Akkurat nå · Dag ${dagNr} av ${totalDager}`
    if (gjeldende) {
      tittel = gjeldende.navn
      undertittel = `I natt: ${gjeldende.hotell}`
      hotellLink = gjeldende.hotellLink
      Ikon = MapPin
    } else if (neste) {
      tittel = `På vei til ${neste.navn}`
      undertittel = `Ankomst ${kortDato(neste.datoFra)}`
      Ikon = Plane
    } else {
      tittel = 'På reise'
      undertittel = REISEDATOER.hjemkomstFly
      Ikon = Plane
    }
    handlinger = [
      { etikett: 'Aktiviteter', fane: 'aktiviteter', Icon: Ticket },
      { etikett: 'Lounger', fane: 'lounger', Icon: Armchair },
      { etikett: 'Budsjett', fane: 'budsjett', Icon: Wallet },
    ]
  } else {
    eyebrow = 'Reisen er over'
    tittel = 'Vel hjemme'
    undertittel = 'Gjør opp reiseregnskapet og del utleggene'
    Ikon = Wallet
    handlinger = [{ etikett: 'Budsjett', fane: 'budsjett', Icon: Wallet }]
  }

  return (
    <section className="px-4 pt-8 pb-2 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="glass-gold rounded-3xl p-6 sm:p-7 relative overflow-hidden"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div
          className="absolute -right-10 -top-10 w-56 h-56 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #f5dfa8, transparent 70%)' }}
        />
        <div className="relative flex items-start gap-4">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(245,223,168,0.14)', border: '1px solid rgba(245,223,168,0.30)' }}
          >
            <Ikon size={20} className="text-amber-300" strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles size={11} className="text-amber-400/80" strokeWidth={2} />
              <span className="text-amber-300/80 text-[11px] font-semibold uppercase tracking-[0.18em]">
                {eyebrow}
              </span>
            </div>
            <h2 className="text-white text-2xl sm:text-3xl font-semibold leading-tight mb-1">
              {tittel}
            </h2>
            {hotellLink ? (
              <a
                href={hotellLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-300 text-sm hover:text-amber-200 transition-colors"
              >
                <Hotel size={13} strokeWidth={1.75} />
                {undertittel}
              </a>
            ) : (
              <p className="text-slate-300 text-sm">{undertittel}</p>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              {handlinger.map((h) => (
                <Chip key={h.etikett} h={h} onNaviger={onNaviger} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
