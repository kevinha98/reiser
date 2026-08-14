import { motion } from 'framer-motion'
import { Scissors, MapPin, Calendar, Shirt, Truck } from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────────────

const BESTILLING = {
  navn: 'Alex Modern Tailor',
  url: 'https://sites.google.com/view/alexmoderntailor/home',
  farge: '#f59e0b',
  rader: [
    { Ikon: Calendar, label: 'Bestilt', verdi: 'Fre 14. aug' },
    { Ikon: Shirt, label: 'Antall', verdi: '5 skjorter' },
    { Ikon: Truck, label: 'Levering', verdi: 'Lør 29. aug kl. 18:00' },
    { Ikon: MapPin, label: 'Leveres til', verdi: 'Mandarin Hotel, Centre Point' },
  ],
  husk: [
    'Prøv alle fem før budet drar',
    'Ta bilde av målsettet — gjør etterbestilling hjemmefra enkelt',
  ],
}

// ─── Info row ─────────────────────────────────────────────────────────────────

function InfoRad({
  Ikon,
  label,
  verdi,
}: {
  Ikon: typeof Calendar
  label: string
  verdi: string
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 py-2.5 border-b"
      style={{ borderColor: 'rgba(255,255,255,0.05)' }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <Ikon size={12} className="text-slate-600 flex-shrink-0" strokeWidth={1.5} />
        <span
          className="text-slate-500 text-xs"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {label}
        </span>
      </div>
      <span
        className="text-slate-300 text-xs font-medium text-right"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {verdi}
      </span>
    </div>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────

export function Skredder() {
  const b = BESTILLING

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Heading — left-aligned per taste-skill anti-center bias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)',
              }}
            >
              <Scissors size={15} className="text-slate-400" strokeWidth={1.5} />
            </div>
            <p
              className="text-slate-600 text-xs uppercase tracking-[0.2em]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Shopping
            </p>
          </div>
          <h2
            className="text-white text-3xl mb-2"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
          >
            Skredder
          </h2>
          <p
            className="text-slate-500 text-sm max-w-lg"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Bestilt i Bangkok 14. august — leveres til hotellet før hjemreisen.
          </p>
        </motion.div>

        {/* Order card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          className="max-w-md"
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: `1px solid ${b.farge}30`,
            borderRadius: '1.25rem',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
            backdropFilter: 'blur(16px)',
            padding: '1.75rem',
          }}
        >
          <div className="flex items-center gap-2.5 mb-5">
            <Scissors size={14} style={{ color: b.farge }} strokeWidth={1.5} />
            <h3
              className="text-white font-semibold text-base"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {b.navn}
            </h3>
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-[11px] transition-opacity hover:opacity-60"
              style={{ color: b.farge, fontFamily: "'DM Sans', sans-serif" }}
            >
              Nettside →
            </a>
          </div>

          <div className="mb-5">
            {b.rader.map((r) => (
              <InfoRad key={r.label} Ikon={r.Ikon} label={r.label} verdi={r.verdi} />
            ))}
          </div>

          <ul className="space-y-2">
            {b.husk.map((h) => (
              <li key={h} className="flex items-start gap-2">
                <div
                  className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5"
                  style={{ background: b.farge }}
                />
                <span
                  className="text-slate-500 text-[11px] leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {h}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
