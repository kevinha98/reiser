import { motion } from 'framer-motion'

interface RuteStop {
  id: string
  navn: string
  periode: string
  cx: number
  cy: number
  farge: string
  // label offset direction: 'right' | 'left'
  labelSide: 'right' | 'left'
}

const STOPP: RuteStop[] = [
  {
    id: 'bkk',
    navn: 'Bangkok',
    periode: '12–15 aug',
    cx: 430,
    cy: 155,
    farge: '#f59e0b',
    labelSide: 'right',
  },
  {
    id: 'samui',
    navn: 'Koh Samui',
    periode: '15–22 aug',
    cx: 510,
    cy: 295,
    farge: '#38bdf8',
    labelSide: 'right',
  },
  {
    id: 'phuket',
    navn: 'Phuket',
    periode: '22–29 aug',
    cx: 340,
    cy: 375,
    farge: '#34d399',
    labelSide: 'left',
  },
]

// Thailand landmass — slimmer, more accurate silhouette
const THAILAND_PATH =
  'M 400,22 C 430,28 455,48 468,78 C 480,108 478,138 472,165 C 466,192 455,210 452,235 C 449,260 455,282 460,305 C 465,328 468,348 462,368 C 456,388 442,402 428,412 C 414,422 400,428 386,436 C 372,444 358,448 344,440 C 330,432 320,416 314,398 C 308,380 308,360 302,342 C 296,324 284,310 275,296 C 266,282 260,268 258,252 C 256,236 258,220 256,204 C 254,188 248,174 246,158 C 244,142 248,128 256,116 C 264,104 276,98 286,88 C 296,78 300,64 308,52 C 316,40 326,30 338,25 C 350,20 370,18 400,22 Z'

// Island-hop route: BKK → Samui → Phuket (open path, no closing triangle)
const RUTE_PATH = 'M 430,155 C 450,200 500,240 510,295 C 510,295 460,330 340,375'

// Return leg Phuket → Bangkok
const RETUR_PATH = 'M 340,375 Q 320,260 430,155'

// Flight arc from CPH (top-left, off-screen) to Bangkok
const FLY_PATH = 'M 42,22 Q 180,-20 430,155'

export function KartSeksjon() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
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
        </motion.div>

        {/* Map panel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <div className="relative">
            <svg
              viewBox="0 0 700 500"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full"
              style={{ display: 'block' }}
              aria-label="Kart over Thailand-reiserute"
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

              {/* Background layers */}
              <rect width="700" height="500" fill="rgba(8,11,16,0.5)" />
              <rect width="700" height="500" fill="url(#grid-dots)" />
              <rect width="700" height="500" fill="url(#depth)" />

              {/* Thailand landmass silhouette — very subtle */}
              <path
                d={THAILAND_PATH}
                fill="rgba(100,116,139,0.05)"
                stroke="rgba(100,116,139,0.12)"
                strokeWidth="1"
              />

              {/* Sea labels — text only, no heavy strokes */}
              <text x="590" y="320" fill="rgba(56,189,248,0.18)" fontSize="9" fontFamily="DM Sans, sans-serif" textAnchor="middle">
                Gulf of Thailand
              </text>
              <text x="220" y="400" fill="rgba(56,189,248,0.15)" fontSize="9" fontFamily="DM Sans, sans-serif" textAnchor="middle">
                Andaman Sea
              </text>

              {/* CPH dot + label — static, no whileInView inside SVG */}
              <g opacity="1">
                <circle cx="42" cy="22" r="3" fill="rgba(148,163,184,0.45)" />
                <text x="52" y="18" fill="rgba(148,163,184,0.65)" fontSize="10" fontFamily="DM Sans, sans-serif" fontWeight="500">
                  CPH
                </text>
                <text x="52" y="28" fill="rgba(100,116,139,0.55)" fontSize="8" fontFamily="DM Sans, sans-serif">
                  11. aug · Business Class
                </text>
              </g>

              {/* Flight arc CPH → Bangkok — Framer Motion path animation works on SVG paths */}
              <motion.path
                d={FLY_PATH}
                fill="none"
                stroke="rgba(245,158,11,0.5)"
                strokeWidth="1.5"
                strokeDasharray="6 5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2.0, delay: 0.3, ease: 'easeInOut' }}
              />

              {/* Plane icon midpoint */}
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

              {/* Island-hop route: BKK → Samui → Phuket */}
              <motion.path
                d={RUTE_PATH}
                fill="none"
                stroke="rgba(200,210,220,0.30)"
                strokeWidth="1.5"
                strokeDasharray="5 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2.0, delay: 0.9, ease: 'easeInOut' }}
              />

              {/* Return leg: Phuket → Bangkok */}
              <motion.path
                d={RETUR_PATH}
                fill="none"
                stroke="rgba(245,158,11,0.22)"
                strokeWidth="1"
                strokeDasharray="4 6"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 2.5, ease: 'easeInOut' }}
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

              {/* Location stops — plain g elements, opacity animated via inline style trick.
                  whileInView is unreliable inside SVG — use animate with delay instead. */}
              {STOPP.map((stop, i) => {
                const isLeft = stop.labelSide === 'left'
                const lx = isLeft ? stop.cx - 16 : stop.cx + 16
                const textAnchor = isLeft ? 'end' : 'start'
                return (
                  <motion.g
                    key={stop.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.4 + i * 0.3 }}
                  >
                    {/* Outer pulse ring */}
                    <circle
                      cx={stop.cx}
                      cy={stop.cy}
                      r="20"
                      fill="none"
                      stroke={stop.farge}
                      strokeWidth="0.75"
                      opacity={0.18}
                    />
                    {/* Mid ring */}
                    <circle
                      cx={stop.cx}
                      cy={stop.cy}
                      r="11"
                      fill="none"
                      stroke={stop.farge}
                      strokeWidth="1"
                      opacity={0.35}
                    />
                    {/* Core dot */}
                    <circle
                      cx={stop.cx}
                      cy={stop.cy}
                      r="5.5"
                      fill={stop.farge}
                      filter="url(#glow)"
                    />
                    {/* City name */}
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
                    {/* Period */}
                    <text
                      x={lx}
                      y={stop.cy + 9}
                      fill="rgba(100,116,139,0.85)"
                      fontSize="9"
                      fontFamily="DM Sans, sans-serif"
                      textAnchor={textAnchor}
                    >
                      {stop.periode}
                    </text>
                  </motion.g>
                )
              })}
            </svg>

            {/* Legend */}
            <div className="px-6 pb-5 flex flex-wrap gap-x-6 gap-y-2">
              {STOPP.map((stop) => (
                <div key={stop.id} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: stop.farge }}
                  />
                  <span className="text-slate-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {stop.navn} · {stop.periode}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <div className="w-4 h-px border-t border-dashed border-amber-500/40" />
                <span className="text-slate-600 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Business Class avreise/retur
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
