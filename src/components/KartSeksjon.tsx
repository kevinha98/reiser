import { motion } from 'framer-motion'

interface RuteStop {
  id: string
  navn: string
  periode: string
  cx: number
  cy: number
  farge: string
  labelX: number
  labelY: number
}

const STOPP: RuteStop[] = [
  {
    id: 'bkk',
    navn: 'Bangkok',
    periode: '12–15 aug',
    cx: 462,
    cy: 148,
    farge: '#f59e0b',
    labelX: 480,
    labelY: 143,
  },
  {
    id: 'samui',
    navn: 'Koh Samui',
    periode: '15–22 aug',
    cx: 498,
    cy: 288,
    farge: '#38bdf8',
    labelX: 516,
    labelY: 283,
  },
  {
    id: 'phuket',
    navn: 'Phuket',
    periode: '22–29 aug',
    cx: 378,
    cy: 368,
    farge: '#34d399',
    labelX: 396,
    labelY: 363,
  },
]

// Thailand landmass silhouette (very simplified artistic polygon)
const THAILAND_PATH =
  'M 380,20 C 420,30 460,50 480,80 C 500,110 510,140 500,170 C 490,200 475,220 470,250 C 465,280 470,300 480,320 C 490,340 500,355 498,375 C 496,395 480,410 465,420 C 450,430 435,435 420,445 C 405,455 395,465 380,475 C 365,485 350,488 335,480 C 320,472 310,455 305,435 C 300,415 300,395 295,375 C 290,355 280,340 270,325 C 260,310 255,295 252,278 C 249,261 250,245 248,228 C 246,211 240,195 238,178 C 236,161 240,145 250,132 C 260,119 275,112 285,100 C 295,88 298,72 305,58 C 312,44 322,32 335,24 C 348,16 363,14 380,20 Z'

// Dashed route connecting stops
const RUTE_PATH = 'M 462,148 L 498,288 L 378,368 L 462,148'

// Flight arc from CPH (top-left, off-screen) to Bangkok
const FLY_PATH = 'M 40,18 Q 200,-30 462,148'

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
              {/* Subtle dot-grid background */}
              <defs>
                <pattern id="grid-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="0" cy="0" r="1" fill="rgba(255,255,255,0.04)" />
                </pattern>
                {/* Glow filter */}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background */}
              <rect width="700" height="500" fill="rgba(8,11,16,0.4)" />
              <rect width="700" height="500" fill="url(#grid-dots)" />

              {/* Subtle radial gradient for depth */}
              <radialGradient id="depth" cx="55%" cy="45%" r="60%">
                <stop offset="0%" stopColor="rgba(15,20,30,0)" />
                <stop offset="100%" stopColor="rgba(4,6,10,0.6)" />
              </radialGradient>
              <rect width="700" height="500" fill="url(#depth)" />

              {/* Thailand silhouette — very low opacity */}
              <path d={THAILAND_PATH} fill="rgba(100,116,139,0.06)" stroke="rgba(100,116,139,0.10)" strokeWidth="1" />

              {/* Gulf of Thailand suggestion */}
              <path
                d="M 498,288 Q 560,320 580,400 Q 590,450 570,480"
                fill="none"
                stroke="rgba(56,189,248,0.06)"
                strokeWidth="60"
                strokeLinecap="round"
              />

              {/* Andaman Sea suggestion */}
              <path
                d="M 378,368 Q 310,380 290,430 Q 275,470 280,490"
                fill="none"
                stroke="rgba(56,189,248,0.05)"
                strokeWidth="50"
                strokeLinecap="round"
              />

              {/* CPH label */}
              <motion.g
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <circle cx="40" cy="18" r="3" fill="rgba(148,163,184,0.5)" />
                <text
                  x="50"
                  y="14"
                  fill="rgba(148,163,184,0.6)"
                  fontSize="10"
                  fontFamily="DM Sans, sans-serif"
                  fontWeight="500"
                >
                  CPH
                </text>
                <text
                  x="50"
                  y="24"
                  fill="rgba(100,116,139,0.6)"
                  fontSize="8"
                  fontFamily="DM Sans, sans-serif"
                >
                  11. aug · Business Class
                </text>
              </motion.g>

              {/* Flight arc CPH → Bangkok */}
              <motion.path
                d={FLY_PATH}
                fill="none"
                stroke="rgba(245,158,11,0.35)"
                strokeWidth="1.5"
                strokeDasharray="6 5"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, delay: 0.4, ease: 'easeInOut' }}
              />

              {/* Plane icon along flight path */}
              <motion.text
                x="220"
                y="50"
                fontSize="14"
                textAnchor="middle"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.7 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 2.0 }}
              >
                ✈
              </motion.text>

              {/* Route between stops */}
              <motion.path
                d={RUTE_PATH}
                fill="none"
                stroke="rgba(148,163,184,0.25)"
                strokeWidth="1.5"
                strokeDasharray="5 4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2.2, delay: 0.8, ease: 'easeInOut' }}
              />

              {/* Location stops */}
              {STOPP.map((stop, i) => (
                <motion.g
                  key={stop.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 1.2 + i * 0.25 }}
                  style={{ originX: stop.cx, originY: stop.cy }}
                >
                  {/* Outer glow ring */}
                  <circle
                    cx={stop.cx}
                    cy={stop.cy}
                    r="18"
                    fill="none"
                    stroke={stop.farge}
                    strokeWidth="0.5"
                    opacity={0.2}
                  />
                  {/* Mid ring */}
                  <circle
                    cx={stop.cx}
                    cy={stop.cy}
                    r="10"
                    fill="none"
                    stroke={stop.farge}
                    strokeWidth="1"
                    opacity={0.35}
                  />
                  {/* Core dot */}
                  <circle
                    cx={stop.cx}
                    cy={stop.cy}
                    r="4.5"
                    fill={stop.farge}
                    filter="url(#glow)"
                    opacity={0.9}
                  />
                  {/* City name */}
                  <text
                    x={stop.labelX}
                    y={stop.labelY}
                    fill="rgba(255,255,255,0.85)"
                    fontSize="12"
                    fontFamily="DM Sans, sans-serif"
                    fontWeight="600"
                  >
                    {stop.navn}
                  </text>
                  {/* Periode */}
                  <text
                    x={stop.labelX}
                    y={stop.labelY + 13}
                    fill="rgba(100,116,139,0.8)"
                    fontSize="9"
                    fontFamily="DM Sans, sans-serif"
                  >
                    {stop.periode}
                  </text>
                </motion.g>
              ))}

              {/* Return arrow indicator */}
              <motion.text
                x="430"
                y="255"
                fontSize="9"
                fill="rgba(100,116,139,0.5)"
                fontFamily="DM Sans, sans-serif"
                textAnchor="middle"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 2.4, duration: 0.4 }}
              >
                retur 29. aug
              </motion.text>
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
