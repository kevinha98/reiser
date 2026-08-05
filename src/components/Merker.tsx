import type { ReactNode } from 'react'
import { LAND_NAVN, type LandKode } from '../lib/land'

// ─── Flagg (offline SVG — nasjonalflagg er ikke opphavsrettsbeskyttet) ─────────

interface FlaggDef {
  vb: [number, number]
  innhold: ReactNode
}

const FLAGG: Record<LandKode, FlaggDef> = {
  no: {
    vb: [22, 16],
    innhold: (
      <>
        <rect width="22" height="16" fill="#BA0C2F" />
        <rect x="6" width="4" height="16" fill="#fff" />
        <rect y="6" width="22" height="4" fill="#fff" />
        <rect x="7" width="2" height="16" fill="#00205B" />
        <rect y="7" width="22" height="2" fill="#00205B" />
      </>
    ),
  },
  dk: {
    vb: [37, 28],
    innhold: (
      <>
        <rect width="37" height="28" fill="#C8102E" />
        <rect x="12" width="4" height="28" fill="#fff" />
        <rect y="12" width="37" height="4" fill="#fff" />
      </>
    ),
  },
  nl: {
    vb: [9, 6],
    innhold: (
      <>
        <rect width="9" height="2" fill="#AE1C28" />
        <rect y="2" width="9" height="2" fill="#fff" />
        <rect y="4" width="9" height="2" fill="#21468B" />
      </>
    ),
  },
  th: {
    vb: [9, 6],
    innhold: (
      <>
        <rect width="9" height="6" fill="#A51931" />
        <rect y="1" width="9" height="4" fill="#F4F5F8" />
        <rect y="2" width="9" height="2" fill="#2D2A4A" />
      </>
    ),
  },
}

export function Flagg({ land, hoyde = 13 }: { land: LandKode; hoyde?: number }) {
  const def = FLAGG[land]
  const bredde = Math.round(hoyde * (def.vb[0] / def.vb[1]))
  return (
    <svg
      width={bredde}
      height={hoyde}
      viewBox={`0 0 ${def.vb[0]} ${def.vb[1]}`}
      role="img"
      aria-label={`Flagg: ${LAND_NAVN[land]}`}
      style={{ borderRadius: 2, display: 'block', boxShadow: '0 0 0 1px rgba(255,255,255,0.14)', flexShrink: 0 }}
    >
      <title>{LAND_NAVN[land]}</title>
      {def.innhold}
    </svg>
  )
}

// ─── Flyselskap-merke (merkevarefarget ordmerke) ──────────────────────────────

const SELSKAP: Record<string, { bg: string }> = {
  SAS: { bg: '#002F6C' }, // SAS marineblå
  KLM: { bg: '#007AC2' }, // KLM-blå
  Norwegian: { bg: '#D81939' }, // Norwegian rød
}

export function Flyselskap({ selskap }: { selskap: string }) {
  const stil = SELSKAP[selskap]
  if (!stil) return <span className="text-slate-500 text-[10px]">{selskap}</span>
  return (
    <span
      className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide"
      style={{ background: stil.bg, color: '#fff', fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}
      aria-label={`Flyselskap: ${selskap}`}
    >
      {selskap}
    </span>
  )
}
