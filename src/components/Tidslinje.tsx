import { motion } from 'framer-motion'
import { Plane, MapPin } from 'lucide-react'

interface ReiseEvent {
  dato: string
  dagNr: number
  tittel: string
  undertittel?: string
  type: 'fly' | 'hotell' | 'avreise' | 'hjemkomst'
  farge: 'gold' | 'ocean' | 'jungle' | 'violet'
}

const TIDSLINJE: ReiseEvent[] = [
  {
    dato: 'Tir 11. aug',
    dagNr: 0,
    tittel: 'Avreise fra CPH',
    undertittel: 'CPH → BKK · kl. 11:30 · Business Class',
    type: 'avreise',
    farge: 'violet',
  },
  {
    dato: 'Ons 12. aug',
    dagNr: 2,
    tittel: 'Ankomst Bangkok',
    undertittel: 'Innsjekk · Hope Land Hotel Sukhumvit 8',
    type: 'hotell',
    farge: 'gold',
  },
  {
    dato: 'Lør 15. aug',
    dagNr: 5,
    tittel: 'Fly til Koh Samui',
    undertittel: 'Lamai Coconut Beach Resort · 7 netter',
    type: 'fly',
    farge: 'ocean',
  },
  {
    dato: 'Lør 22. aug',
    dagNr: 12,
    tittel: 'Fly til Phuket',
    undertittel: 'Chanalai Flora Resort, Kata Beach · 7 netter',
    type: 'fly',
    farge: 'jungle',
  },
  {
    dato: 'Lør 29. aug',
    dagNr: 19,
    tittel: 'HKT → BKK',
    undertittel: 'kl. 12:55 → 14:30 · Mandarin Hotel Centre Point',
    type: 'fly',
    farge: 'gold',
  },
  {
    dato: 'Tir 1. sep',
    dagNr: 22,
    tittel: 'Hjemreise til CPH',
    undertittel: 'BKK → CPH · kl. 12:05 → 22:30',
    type: 'hjemkomst',
    farge: 'violet',
  },
]

const FARGE_MAP = {
  gold: {
    dot: 'bg-amber-400',
    ring: 'ring-amber-400/30',
    tekst: 'text-amber-300',
    linje: 'bg-amber-400/30',
  },
  ocean: {
    dot: 'bg-sky-400',
    ring: 'ring-sky-400/30',
    tekst: 'text-sky-300',
    linje: 'bg-sky-400/30',
  },
  jungle: {
    dot: 'bg-emerald-400',
    ring: 'ring-emerald-400/30',
    tekst: 'text-emerald-300',
    linje: 'bg-emerald-400/30',
  },
  violet: {
    dot: 'bg-violet-400',
    ring: 'ring-violet-400/30',
    tekst: 'text-violet-300',
    linje: 'bg-violet-400/30',
  },
}

export function Tidslinje() {
  return (
    <section className="px-4 mb-16 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h2 className="font-display font-600 text-2xl text-white mb-1"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
          Reiseplan
        </h2>
        <p className="text-slate-400 text-sm">11. august – 1. september 2026</p>
      </motion.div>

      <div className="glass rounded-2xl p-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute right-0 top-0 w-64 h-64 opacity-5 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #d99b26, transparent 70%)' }} />

        <div className="relative">
          {TIDSLINJE.map((event, i) => {
            const f = FARGE_MAP[event.farge]
            const erSiste = i === TIDSLINJE.length - 1

            return (
              <motion.div
                key={event.dato}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex gap-4"
              >
                {/* Timeline column */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-0.5 ring-4 ${f.dot} ${f.ring}`} />
                  {!erSiste && (
                    <div className={`w-px flex-1 my-1 ${f.linje} min-h-[32px]`} />
                  )}
                </div>

                {/* Content */}
                <div className={`pb-6 ${erSiste ? '' : ''}`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    {(event.type === 'fly' || event.type === 'avreise' || event.type === 'hjemkomst') && (
                      <Plane
                        size={11}
                        className={`${f.tekst} ${event.type === 'hjemkomst' ? 'rotate-180' : ''}`}
                      />
                    )}
                    {event.type === 'hotell' && (
                      <MapPin size={11} className={f.tekst} />
                    )}
                    <span className={`text-xs font-medium uppercase tracking-wider ${f.tekst}`}>
                      {event.dato} · Dag {event.dagNr}
                    </span>
                  </div>
                  <h3 className="text-white text-base font-medium mb-0.5">{event.tittel}</h3>
                  {event.undertittel && (
                    <p className="text-slate-400 text-sm">{event.undertittel}</p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
