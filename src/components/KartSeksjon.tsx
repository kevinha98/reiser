import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Besok {
  datoFra: string
  datoTil: string
  netter: number
  hotell: string
  ankomst: string
  avgang: string
}

interface RuteStop {
  id: string
  navn: string
  periodeKort: string
  cx: number
  cy: number
  farge: string
  labelSide: "right" | "left"
  iata: string
  flyplass: string
  besok: Besok[]
  beskrivelse: string
}

interface FlygLeg {
  iata: string
  by: string
  ankomst?: string
  avgang?: string
  fly?: string
  flyselskap?: string
  klasse?: string
  opphold?: string
  seter?: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STOPP: RuteStop[] = [
  {
    id: "bkk",
    navn: "Bangkok",
    periodeKort: "12–15 & 29 aug",
    cx: 430,
    cy: 155,
    farge: "#f59e0b",
    labelSide: "right",
    iata: "BKK",
    flyplass: "Suvarnabhumi Airport",
    besok: [
      {
        datoFra: "12. aug",
        datoTil: "15. aug",
        netter: 3,
        hotell: "Hope Land Hotel Sukhumvit 8",
        ankomst: "KL 0843 · AMS → BKK · kl. 09:30 · Sete 2D & 2F",
        avgang: "Internflight BKK → USM · 15. aug",
      },
      {
        datoFra: "29. aug",
        datoTil: "1. sep",
        netter: 3,
        hotell: "Mandarin Hotel Centre Point",
        ankomst: "Internflight HKT → BKK · 29. aug",
        avgang: "KL 0844 · BKK → AMS · kl. 12:05",
      },
    ],
    beskrivelse: "Pulserende storby — streetfood, templer og Sukhumvit-kveldsliv",
  },
  {
    id: "samui",
    navn: "Koh Samui",
    periodeKort: "15–22 aug",
    cx: 510,
    cy: 295,
    farge: "#38bdf8",
    labelSide: "right",
    iata: "USM",
    flyplass: "Koh Samui Airport",
    besok: [
      {
        datoFra: "15. aug",
        datoTil: "22. aug",
        netter: 7,
        hotell: "Lamai Coconut Beach Resort",
        ankomst: "Internflight BKK → USM · 15. aug",
        avgang: "Internflight USM → HKT · 22. aug",
      },
    ],
    beskrivelse: "Tropisk paradisøy — hvite strender, turkist hav og snorkling",
  },
  {
    id: "phuket",
    navn: "Phuket",
    periodeKort: "22–29 aug",
    cx: 340,
    cy: 375,
    farge: "#34d399",
    labelSide: "left",
    iata: "HKT",
    flyplass: "Phuket International Airport",
    besok: [
      {
        datoFra: "22. aug",
        datoTil: "29. aug",
        netter: 7,
        hotell: "Chanalai Flora Resort, Kata Beach",
        ankomst: "Internflight USM → HKT · 22. aug",
        avgang: "KL 0843 · HKT → BKK · 29. aug",
      },
    ],
    beskrivelse: "Kata Beach, snorkling og magiske solnedganger 🌅",
  },
]

const THAILAND_PATH =
  "M 400,22 C 430,28 455,48 468,78 C 480,108 478,138 472,165 C 466,192 455,210 452,235 C 449,260 455,282 460,305 C 465,328 468,348 462,368 C 456,388 442,402 428,412 C 414,422 400,428 386,436 C 372,444 358,448 344,440 C 330,432 320,416 314,398 C 308,380 308,360 302,342 C 296,324 284,310 275,296 C 266,282 260,268 258,252 C 256,236 258,220 256,204 C 254,188 248,174 246,158 C 244,142 248,128 256,116 C 264,104 276,98 286,88 C 296,78 300,64 308,52 C 316,40 326,30 338,25 C 350,20 370,18 400,22 Z"

const RUTE_PATH = "M 430,155 C 450,200 500,240 510,295 C 510,295 460,330 340,375"
const RETUR_PATH = "M 340,375 Q 320,260 430,155"
const FLY_PATH = "M 42,22 Q 180,-20 430,155"

// ─── International itinerary ──────────────────────────────────────────────────

const UTREISE: FlygLeg[] = [
  { iata: "BGO", by: "Bergen", avgang: "05:55", fly: "SK 2861", flyselskap: "SAS", klasse: "Economy" },
  { iata: "CPH", by: "Copenhagen", ankomst: "07:20", avgang: "11:30", fly: "KL 1270", flyselskap: "KLM", klasse: "Flex", opphold: "4t 10m" },
  { iata: "AMS", by: "Amsterdam", ankomst: "12:55", avgang: "17:15", fly: "KL 0843", flyselskap: "KLM", klasse: "Flex", opphold: "4t 20m", seter: "2D, 2F" },
  { iata: "BKK", by: "Bangkok", ankomst: "09:30 (+1)" },
]

const HJEMREISE: FlygLeg[] = [
  { iata: "BKK", by: "Bangkok", avgang: "12:05", fly: "KL 0844", flyselskap: "KLM", klasse: "Flex" },
  { iata: "AMS", by: "Amsterdam", ankomst: "19:10", avgang: "21:05", fly: "KL 1279", flyselskap: "KLM", klasse: "Flex", opphold: "1t 55m" },
  { iata: "CPH", by: "Copenhagen", ankomst: "22:30", avgang: "08:15 (+1)", fly: "SK 2862", flyselskap: "SAS", klasse: "Business Flex", opphold: "neste dag" },
  { iata: "BGO", by: "Bergen", ankomst: "09:40" },
]

// ─── FlygKort sub-component ───────────────────────────────────────────────────

function FlygKort({ tittel, ben }: { tittel: string; ben: FlygLeg[] }) {
  return (
    <div className="glass rounded-2xl p-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <p className="text-slate-600 text-[10px] uppercase tracking-[0.2em] mb-5">{tittel}</p>
      <div className="flex flex-col">
        {ben.map((leg, i) => (
          <div key={`${leg.iata}-${i}`} className="flex gap-3">
            <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background:
                    i === 0 || i === ben.length - 1
                      ? "rgba(148,163,184,0.6)"
                      : "rgba(148,163,184,0.3)",
                }}
              />
              {i < ben.length - 1 && (
                <div
                  className="w-px flex-1 my-1"
                  style={{ background: "rgba(255,255,255,0.06)", minHeight: "40px" }}
                />
              )}
            </div>
            <div className="pb-4 flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-white font-mono font-bold text-sm">{leg.iata}</span>
                <span className="text-slate-400 text-xs">{leg.by}</span>
              </div>
              <div className="flex gap-3 mt-0.5 flex-wrap">
                {leg.ankomst && (
                  <span className="text-slate-500 text-[11px]">↓ {leg.ankomst}</span>
                )}
                {leg.avgang && (
                  <span className="text-slate-400 text-[11px]">↑ {leg.avgang}</span>
                )}
              </div>
              {leg.fly && (
                <div className="mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5">
                  <span className="text-slate-500 text-[10px]">{leg.fly} · {leg.flyselskap}</span>
                  {leg.klasse && (
                    <span className="text-slate-600 text-[10px]">{leg.klasse}</span>
                  )}
                  {leg.seter && (
                    <span className="text-[10px]" style={{ color: "rgba(245,158,11,0.7)" }}>
                      Sete {leg.seter}
                    </span>
                  )}
                  {leg.opphold && (
                    <span className="text-slate-700 text-[10px]">⏱ {leg.opphold} opphold</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function KartSeksjon() {
  const [aktivStopp, setAktivStopp] = useState<string | null>(null)
  const valgtStopp = STOPP.find((s) => s.id === aktivStopp) ?? null

  function toggleStopp(id: string) {
    setAktivStopp((prev) => (prev === id ? null : id))
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p
            className="text-slate-600 text-xs uppercase tracking-[0.2em] mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Reiserute
          </p>
          <h2
            className="text-white text-3xl"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
          >
            Gjennom Thailand
          </h2>
          <p
            className="text-slate-600 text-xs mt-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Trykk på en by for flyinfo og hotell
          </p>
        </motion.div>

        {/* Map glass card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass rounded-2xl overflow-hidden"
        >
          {/* SVG map */}
          <svg
            viewBox="0 0 700 500"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            style={{ display: "block" }}
            aria-label="Interaktivt kart over Thailand-reiserute"
          >
            <defs>
              <pattern id="grid-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="0" cy="0" r="1" fill="rgba(255,255,255,0.04)" />
              </pattern>
              <radialGradient id="depth" cx="55%" cy="45%" r="60%">
                <stop offset="0%" stopColor="rgba(15,20,30,0)" />
                <stop offset="100%" stopColor="rgba(4,6,10,0.5)" />
              </radialGradient>
              <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-soft" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width="700" height="500" fill="rgba(8,11,16,0.5)" />
            <rect width="700" height="500" fill="url(#grid-dots)" />
            <rect width="700" height="500" fill="url(#depth)" />

            <path
              d={THAILAND_PATH}
              fill="rgba(100,116,139,0.05)"
              stroke="rgba(100,116,139,0.12)"
              strokeWidth="1"
            />

            <text x="590" y="320" fill="rgba(56,189,248,0.18)" fontSize="9" fontFamily="DM Sans, sans-serif" textAnchor="middle">
              Gulf of Thailand
            </text>
            <text x="220" y="400" fill="rgba(56,189,248,0.15)" fontSize="9" fontFamily="DM Sans, sans-serif" textAnchor="middle">
              Andaman Sea
            </text>

            {/* CPH departure dot */}
            <g opacity="1">
              <circle cx="42" cy="22" r="3" fill="rgba(148,163,184,0.45)" />
              <text x="52" y="18" fill="rgba(148,163,184,0.65)" fontSize="10" fontFamily="DM Sans, sans-serif" fontWeight="500">
                CPH
              </text>
              <text x="52" y="28" fill="rgba(100,116,139,0.55)" fontSize="8" fontFamily="DM Sans, sans-serif">
                11. aug · KL 0843
              </text>
            </g>

            {/* Flight arc CPH -> Bangkok */}
            <motion.path
              d={FLY_PATH}
              fill="none"
              stroke="rgba(245,158,11,0.5)"
              strokeWidth="1.5"
              strokeDasharray="6 5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2.0, delay: 0.3, ease: "easeInOut" }}
            />
            <motion.text
              x="195"
              y="52"
              fontSize="13"
              textAnchor="middle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              transition={{ duration: 0.4, delay: 2.1 }}
            >
              ✈
            </motion.text>

            {/* Island-hop route */}
            <motion.path
              d={RUTE_PATH}
              fill="none"
              stroke="rgba(200,210,220,0.30)"
              strokeWidth="1.5"
              strokeDasharray="5 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2.0, delay: 0.9, ease: "easeInOut" }}
            />

            {/* Return leg */}
            <motion.path
              d={RETUR_PATH}
              fill="none"
              stroke="rgba(245,158,11,0.22)"
              strokeWidth="1"
              strokeDasharray="4 6"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 2.5, ease: "easeInOut" }}
            />
            <motion.text
              x="358"
              y="262"
              fontSize="8"
              fill="rgba(245,158,11,0.45)"
              fontFamily="DM Sans, sans-serif"
              textAnchor="middle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.8, duration: 0.4 }}
            >
              retur 29. aug
            </motion.text>

            {/* Interactive destination stops */}
            {STOPP.map((stop, i) => {
              const isLeft = stop.labelSide === "left"
              const lx = isLeft ? stop.cx - 16 : stop.cx + 16
              const textAnchor = isLeft ? "end" : "start"
              const isAktiv = aktivStopp === stop.id

              return (
                <motion.g
                  key={stop.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.4 + i * 0.3 }}
                  onClick={() => toggleStopp(stop.id)}
                  style={{ cursor: "pointer" }}
                  role="button"
                  aria-label={`Vis info om ${stop.navn}`}
                  aria-pressed={isAktiv}
                >
                  {isAktiv && (
                    <circle cx={stop.cx} cy={stop.cy} r="32" fill={stop.farge} opacity={0.10} />
                  )}
                  <circle
                    cx={stop.cx}
                    cy={stop.cy}
                    r="20"
                    fill="none"
                    stroke={stop.farge}
                    strokeWidth={isAktiv ? 1.5 : 0.75}
                    opacity={isAktiv ? 0.5 : 0.18}
                  />
                  <circle
                    cx={stop.cx}
                    cy={stop.cy}
                    r="11"
                    fill="none"
                    stroke={stop.farge}
                    strokeWidth="1"
                    opacity={isAktiv ? 0.65 : 0.35}
                  />
                  <circle
                    cx={stop.cx}
                    cy={stop.cy}
                    r="5.5"
                    fill={stop.farge}
                    filter="url(#glow)"
                  />
                  <text
                    x={lx}
                    y={stop.cy - 16}
                    fill={stop.farge}
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight="700"
                    textAnchor={textAnchor}
                    opacity={0.75}
                  >
                    {stop.iata}
                  </text>
                  <text
                    x={lx}
                    y={stop.cy - 4}
                    fill="rgba(255,255,255,0.90)"
                    fontSize="12"
                    fontFamily="DM Sans, sans-serif"
                    fontWeight="600"
                    textAnchor={textAnchor}
                  >
                    {stop.navn}
                  </text>
                  <text
                    x={lx}
                    y={stop.cy + 9}
                    fill="rgba(100,116,139,0.85)"
                    fontSize="9"
                    fontFamily="DM Sans, sans-serif"
                    textAnchor={textAnchor}
                  >
                    {stop.periodeKort}
                  </text>
                </motion.g>
              )
            })}
          </svg>

          {/* Interactive info panel */}
          <AnimatePresence mode="wait">
            {valgtStopp && (
              <motion.div
                key={valgtStopp.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
                className="border-t px-6 py-5"
                style={{
                  borderColor: "rgba(255,255,255,0.05)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: valgtStopp.farge }}
                    />
                    <div>
                      <h3 className="text-white font-semibold text-base leading-tight">
                        {valgtStopp.navn}
                      </h3>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {valgtStopp.iata} · {valgtStopp.flyplass}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAktivStopp(null)}
                    className="text-slate-600 hover:text-slate-400 transition-colors text-xl leading-none mt-0.5 px-1"
                    aria-label="Lukk"
                  >
                    ×
                  </button>
                </div>

                <p className="text-slate-500 text-xs mb-4 ml-[18px]">
                  {valgtStopp.beskrivelse}
                </p>

                <div
                  className={`grid gap-3 ${
                    valgtStopp.besok.length > 1
                      ? "grid-cols-1 sm:grid-cols-2"
                      : "grid-cols-1 max-w-sm"
                  }`}
                >
                  {valgtStopp.besok.map((b, i) => (
                    <div
                      key={i}
                      className="rounded-xl p-3.5"
                      style={{
                        background: "rgba(255,255,255,0.025)",
                        border: `1px solid ${valgtStopp.farge}25`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-white text-xs font-semibold">
                          {b.datoFra} – {b.datoTil}
                        </span>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                          style={{
                            background: `${valgtStopp.farge}18`,
                            color: valgtStopp.farge,
                          }}
                        >
                          {b.netter}n
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs mb-3">🏨 {b.hotell}</p>
                      <div
                        className="space-y-1 pt-2 border-t"
                        style={{ borderColor: "rgba(255,255,255,0.05)" }}
                      >
                        <p className="text-slate-600 text-[10px]">↓ {b.ankomst}</p>
                        <p className="text-slate-600 text-[10px]">↑ {b.avgang}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend / nav */}
          <div
            className="px-6 pb-5 pt-3 flex flex-wrap gap-x-5 gap-y-2 border-t"
            style={{ borderColor: "rgba(255,255,255,0.04)" }}
          >
            {STOPP.map((stop) => (
              <button
                key={stop.id}
                onClick={() => toggleStopp(stop.id)}
                className="flex items-center gap-2 py-0.5 transition-opacity"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: stop.farge }}
                />
                <span
                  className="text-xs transition-colors"
                  style={{
                    color:
                      aktivStopp === stop.id
                        ? "rgba(255,255,255,0.75)"
                        : "rgba(100,116,139,0.85)",
                  }}
                >
                  {stop.navn} · {stop.periodeKort}
                </span>
              </button>
            ))}
            <div className="flex items-center gap-2">
              <div className="w-4 h-px border-t border-dashed border-amber-500/40" />
              <span
                className="text-slate-600 text-xs"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Business Class (KL 0843 / KL 0844)
              </span>
            </div>
          </div>
        </motion.div>

        {/* International flight cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <FlygKort tittel="✈ Utreise · Tirsdag 11. aug" ben={UTREISE} />
          <FlygKort tittel="✈ Hjemreise · 1–2. sep" ben={HJEMREISE} />
        </motion.div>

      </div>
    </section>
  )
}
