import { motion } from 'framer-motion'
import { Scissors, MapPin, Tag, Clock, Ruler, Shirt } from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Skredder {
  rank: number
  by: string
  hotell: string
  farge: string
  rangFarge: string
  dress: string
  skjorte: string
  leveringstid: string
  avstand: string
  tips: string[]
  skjorteTips?: string[]
  advarsel?: string
}

const SKREDDERE: Skredder[] = [
  {
    rank: 1,
    by: 'Bangkok',
    hotell: 'Hope Land Hotel Sukhumvit 8',
    farge: '#f59e0b',
    rangFarge: 'rgba(245,158,11,0.12)',
    dress: '4 000 – 8 000 THB',
    skjorte: '700 – 1 500 THB',
    leveringstid: '24 – 72 t (prøving dag 2)',
    avstand: 'Gangavstand fra hotellet — Sukhumvit soi 7–11',
    tips: [
      'Kom tidlig på dag 1 for mål, hent dag 3',
      'Be alltid om to prøvinger',
      'Sjekk at sømmer er håndstied, ikke maskinsydd',
      'Be om stoff-attest (100 % ull vs. blanding)',
    ],
    skjorteTips: [
      'Velg 2-ply poplin eller oxford-bomull — holder formen',
      'Semi-spread krage er tryggeste valg for norsk bruk',
      'Mål-attest: brystkrets, midjeomfang, skulder, ermlengde',
      'Bestill 2–3 skjorter på én gang — rabatt og ett malsett',
      'Leveringstid 24–48 t — nok tid i begge Bangkok-opphold',
    ],
  },
  {
    rank: 2,
    by: 'Phuket',
    hotell: 'Chanalai Flora Resort, Kata Beach',
    farge: '#34d399',
    rangFarge: 'rgba(52,211,153,0.08)',
    dress: '7 000 – 14 000 THB',
    skjorte: '1 200 – 2 500 THB',
    leveringstid: '48 – 96 t',
    avstand: 'Patong-området ~9 km (Grab)',
    tips: [
      'Patong har mange skreddere — sammenlign minst tre',
      'Unngå butikker som tilbyr ferdig om 2 timer',
    ],
    advarsel: 'Svært varierende kvalitet i Patong',
  },
  {
    rank: 3,
    by: 'Koh Samui',
    hotell: 'Lamai Coconut Beach Resort',
    farge: '#38bdf8',
    rangFarge: 'rgba(56,189,248,0.08)',
    dress: '9 000 – 18 000 THB',
    skjorte: '1 500 – 3 000 THB',
    leveringstid: '72 – 120 t',
    avstand: 'Chaweng-gaten ~10 km',
    tips: [
      'Dyrere og færre alternativer enn Bangkok',
      'Kun aktuelt om Bangkok ikke rekkes',
    ],
  },
]

// ─── Rank badge ────────────────────────────────────────────────────────────────

function RangMerke({ rank, farge }: { rank: number; farge: string }) {
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
      style={{
        background: farge + '22',
        border: `1px solid ${farge}55`,
      }}
    >
      <span
        className="text-xs font-bold tabular-nums"
        style={{ color: farge, fontFamily: "'DM Sans', sans-serif" }}
      >
        {rank}
      </span>
    </div>
  )
}

// ─── Price row ─────────────────────────────────────────────────────────────────

function PrisRad({ label, value, farge }: { label: string; value: string; farge: string }) {
  return (
    <div
      className="flex items-center justify-between py-2 border-b"
      style={{ borderColor: 'rgba(255,255,255,0.05)' }}
    >
      <span
        className="text-slate-500 text-xs"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {label}
      </span>
      <span
        className="text-xs font-semibold tabular-nums"
        style={{ color: farge, fontFamily: "'DM Sans', sans-serif" }}
      >
        {value}
      </span>
    </div>
  )
}

// ─── Winner card (Bangkok) ─────────────────────────────────────────────────────

function VinnerKort({ s }: { s: Skredder }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.05 }}
      className="relative h-full flex flex-col"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: `1px solid ${s.farge}30`,
        borderRadius: '1.25rem',
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 0 transparent`,
        backdropFilter: 'blur(16px)',
        padding: '2rem',
      }}
    >
      {/* Rank + heading */}
      <div className="flex items-center gap-3 mb-6">
        <RangMerke rank={s.rank} farge={s.farge} />
        <div>
          <h3
            className="text-white font-semibold text-xl leading-tight"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {s.by}
          </h3>
          <p
            className="text-slate-600 text-[11px] mt-0.5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {s.hotell}
          </p>
        </div>
        <div
          className="ml-auto px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
          style={{
            background: s.farge + '18',
            color: s.farge,
            border: `1px solid ${s.farge}35`,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Billigst
        </div>
      </div>

      {/* Price table */}
      <div className="mb-6">
        <p
          className="text-slate-600 text-[10px] uppercase tracking-[0.2em] mb-3"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Prisoversikt
        </p>
        <PrisRad label="Dress (2-delt, ull)" value={s.dress} farge={s.farge} />
        <PrisRad label="Skjorte (skreddersydd)" value={s.skjorte} farge={s.farge} />
        <div className="flex items-center justify-between pt-2">
          <span
            className="text-slate-500 text-xs"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Leveringstid
          </span>
          <span
            className="text-slate-300 text-xs tabular-nums"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {s.leveringstid}
          </span>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-start gap-2 mb-6">
        <MapPin size={13} className="text-slate-600 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
        <p
          className="text-slate-500 text-xs leading-relaxed"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {s.avstand}
        </p>
      </div>

      {/* General tips */}
      <div
        className="rounded-xl p-4 mb-3"
        style={{
          background: s.farge + '08',
          border: `1px solid ${s.farge}20`,
        }}
      >
        <p
          className="text-[10px] uppercase tracking-[0.2em] mb-3"
          style={{ color: s.farge, fontFamily: "'DM Sans', sans-serif" }}
        >
          Skreddertips
        </p>
        <ul className="space-y-2">
          {s.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <Ruler
                size={11}
                className="flex-shrink-0 mt-0.5"
                style={{ color: s.farge }}
                strokeWidth={1.5}
              />
              <span
                className="text-slate-400 text-[11px] leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {tip}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Shirt-specific tips */}
      {s.skjorteTips && (
        <div
          className="rounded-xl p-4 flex-1"
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Shirt size={12} className="text-slate-500 flex-shrink-0" strokeWidth={1.5} />
            <p
              className="text-[10px] uppercase tracking-[0.2em] text-slate-500"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Skjorter — Bangkok spesifikt
            </p>
          </div>
          <ul className="space-y-2">
            {s.skjorteTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <div
                  className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5"
                  style={{ background: 'rgba(255,255,255,0.2)' }}
                />
                <span
                  className="text-slate-500 text-[11px] leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {tip}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  )
}

// ─── Compact comparison card ───────────────────────────────────────────────────

function SammenligningKort({ s, delay }: { s: Skredder; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 80, damping: 18, delay }}
      className="flex flex-col"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '1.25rem',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        padding: '1.5rem',
      }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <RangMerke rank={s.rank} farge={s.farge} />
        <div className="flex-1 min-w-0">
          <h4
            className="text-white font-semibold text-sm"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {s.by}
          </h4>
          <p
            className="text-slate-700 text-[10px] truncate"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {s.hotell}
          </p>
        </div>
      </div>

      <div className="space-y-1.5 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Tag size={11} className="text-slate-600" strokeWidth={1.5} />
            <span
              className="text-slate-600 text-[11px]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Dress
            </span>
          </div>
          <span
            className="text-slate-300 text-[11px] font-medium tabular-nums"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {s.dress}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Tag size={11} className="text-slate-600" strokeWidth={1.5} />
            <span
              className="text-slate-600 text-[11px]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Skjorte
            </span>
          </div>
          <span
            className="text-slate-300 text-[11px] font-medium tabular-nums"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {s.skjorte}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock size={11} className="text-slate-600" strokeWidth={1.5} />
            <span
              className="text-slate-600 text-[11px]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Levering
            </span>
          </div>
          <span
            className="text-slate-500 text-[11px] tabular-nums"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {s.leveringstid}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-1.5">
        <MapPin size={11} className="text-slate-700 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
        <p
          className="text-slate-600 text-[10px] leading-relaxed"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {s.avstand}
        </p>
      </div>

      {s.advarsel && (
        <div
          className="mt-3 px-2.5 py-1.5 rounded-lg"
          style={{
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.15)',
          }}
        >
          <p
            className="text-[10px]"
            style={{ color: 'rgba(239,68,68,0.7)', fontFamily: "'DM Sans', sans-serif" }}
          >
            {s.advarsel}
          </p>
        </div>
      )}
    </motion.div>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────

export function Skredder() {
  const vinner = SKREDDERE[0]
  const rest = SKREDDERE.slice(1)

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Heading — left-aligned per taste-skill anti-center bias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
          className="mb-10"
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
            Skreddersydde klær er en av Thailands beste kjøp. Her er prisnivaa og
            praktisk info per destinasjon.
          </p>
        </motion.div>

        {/* Asymmetric grid: 2fr winner | 1fr comparison stack */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">

          {/* Winner — spans 2 cols on md */}
          <div className="md:col-span-2">
            <VinnerKort s={vinner} />
          </div>

          {/* Compact comparison cards */}
          <div className="flex flex-col gap-4">
            {rest.map((s, i) => (
              <SammenligningKort key={s.by} s={s} delay={0.15 + i * 0.08} />
            ))}
          </div>
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-slate-700 text-[10px] text-right mt-4 pr-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Priser er veiledende — prut alltid. THB-kurs ca. 0.27 NOK (juli 2026).
        </motion.p>
      </div>
    </section>
  )
}
