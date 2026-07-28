import { motion } from "framer-motion"
import { Armchair, Plane, KeyRound, CreditCard, Ticket, ChevronRight, Info } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type Tilgang = "business" | "loungekey" | "mastercard"

interface Lounge {
  navn: string
  lokasjon: string
  tilgang: Tilgang[]
  url: string
}

interface Flyplass {
  iata: string
  navn: string
  fase: string
  farge: string
  lounger: Lounge[]
  notat?: string
  ingenLounge?: boolean
}

// ─── Data (verifisert mot Priority Pass / Collinson-nettverket, 2026) ─────────

const FLYPLASSER: Flyplass[] = [
  {
    iata: "BGO",
    navn: "Bergen Flesland",
    fase: "Utreise · 11. aug · avgang 05:50",
    farge: "#94a3b8",
    ingenLounge: true,
    notat:
      "Ingen LoungeKey- eller Mastercard-lounge ved BGO for tiden. BGO→CPH er SAS Economy (SK 2861), så ingen business-lounge på denne etappen. Tidlig avgang 05:50 uansett.",
    lounger: [],
  },
  {
    iata: "CPH",
    navn: "Copenhagen Kastrup",
    fase: "Utreise · 11. aug · opphold 4t 15m",
    farge: "#f59e0b",
    notat:
      "KLM Europe Business (CPH→AMS) gir kontraktslounge — vanligvis Eventyr eller Aspire. God tid med 4t 15m opphold.",
    lounger: [
      {
        navn: "Eventyr Lounge",
        lokasjon: "Etter security · non-Schengen",
        tilgang: ["business", "loungekey", "mastercard"],
        url: "https://www.prioritypass.com/en-GB/lounges/denmark/copenhagen-kastrup/cph1-eventyr-lounge",
      },
      {
        navn: "Aspire Lounge",
        lokasjon: "Terminal 3",
        tilgang: ["loungekey", "mastercard"],
        url: "https://www.prioritypass.com/en-GB/lounges/denmark/copenhagen-kastrup/cop2-aspire-lounge",
      },
      {
        navn: "Carlsberg Aviator Lounge",
        lokasjon: "Terminal 2",
        tilgang: ["loungekey", "mastercard"],
        url: "https://www.prioritypass.com/en-GB/lounges/denmark/copenhagen-kastrup/cop1-carlsberg-aviator-lounge",
      },
    ],
  },
  {
    iata: "AMS",
    navn: "Amsterdam Schiphol",
    fase: "Utreise opphold 4t 20m · Retur 1t 55m",
    farge: "#34d399",
    notat:
      "World Business Class → KLM Crown Lounge 52 (non-Schengen) for BKK-flighten. På retur er 1t 55m knapt — Crown Lounge 40 (Schengen) for CPH-flighten.",
    lounger: [
      {
        navn: "KLM Crown Lounge 52",
        lokasjon: "Non-Schengen · via seteklasse",
        tilgang: ["business"],
        url: "https://www.prioritypass.com/en-GB/airport-guides/amsterdam-schiphol",
      },
      {
        navn: "Aspire Lounge 26",
        lokasjon: "Non-Schengen",
        tilgang: ["loungekey", "mastercard"],
        url: "https://www.prioritypass.com/en-GB/lounges/netherlands/amsterdam-schiphol/ams2-aspire-lounge-no-26",
      },
      {
        navn: "Aspire Lounge 41",
        lokasjon: "Schengen",
        tilgang: ["loungekey", "mastercard"],
        url: "https://www.prioritypass.com/en-GB/lounges/netherlands/amsterdam-schiphol/ams-aspire-lounge-no-41",
      },
    ],
  },
  {
    iata: "BKK",
    navn: "Suvarnabhumi",
    fase: "Retur · 1. sep · avgang 12:05",
    farge: "#38bdf8",
    notat:
      "KLM World Business Class (BKK→AMS) bruker kontraktslounge — sjekk ved gaten. LoungeKey/Mastercard gir tilgang til Miracle- og Coral-loungene.",
    lounger: [
      {
        navn: "Miracle Business Class Lounge",
        lokasjon: "Flere konkurser · airside",
        tilgang: ["loungekey", "mastercard"],
        url: "https://www.prioritypass.com/en-GB/lounges/thailand/suvarnabhumi/bkk26-miracle-business-class-lounge",
      },
      {
        navn: "The Coral Finest Business Lounge (Cocoon)",
        lokasjon: "Concourse · airside",
        tilgang: ["loungekey", "mastercard"],
        url: "https://www.prioritypass.com/en-GB/lounges/thailand/suvarnabhumi/bkk25-the-coral-finest-business-class-lounge-cocoon",
      },
    ],
  },
]

// ─── Access badge ─────────────────────────────────────────────────────────────

const TILGANG_META: Record<Tilgang, { label: string; farge: string; Icon: typeof Ticket }> = {
  business: { label: "Business Class", farge: "#f59e0b", Icon: Ticket },
  loungekey: { label: "LoungeKey", farge: "#38bdf8", Icon: KeyRound },
  mastercard: { label: "Mastercard", farge: "#eb6b2e", Icon: CreditCard },
}

function TilgangMerke({ t }: { t: Tilgang }) {
  const { label, farge, Icon } = TILGANG_META[t]
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full"
      style={{
        background: farge + "15",
        color: farge,
        border: `1px solid ${farge}30`,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <Icon size={9} strokeWidth={1.5} />
      {label}
    </span>
  )
}

// ─── Airport card ─────────────────────────────────────────────────────────────

function FlyplassKort({ f, delay }: { f: Flyplass; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", duration: 0.5, bounce: 0.1, delay }}
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${f.farge}22`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: f.farge + "18", border: `1px solid ${f.farge}30` }}
        >
          <Plane size={14} style={{ color: f.farge }} strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-white font-mono font-bold text-sm">{f.iata}</span>
            <span className="text-slate-400 text-xs truncate">{f.navn}</span>
          </div>
          <p className="text-slate-600 text-[10px] mt-0.5">{f.fase}</p>
        </div>
      </div>

      {/* Lounge list */}
      {f.ingenLounge ? (
        <div
          className="rounded-xl px-3 py-2.5 flex items-start gap-2"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <Info size={12} className="text-slate-600 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
          <p className="text-slate-500 text-[11px] leading-relaxed">{f.notat}</p>
        </div>
      ) : (
        <>
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {f.lounger.map((l) => (
              <a
                key={l.navn}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-200 text-xs font-medium group-hover:text-white" style={{ transition: "color 120ms ease-out" }}>
                      {l.navn}
                    </span>
                    <ChevronRight
                      size={11}
                      className="text-slate-600 group-hover:translate-x-0.5"
                      strokeWidth={2}
                      style={{ transition: "transform 150ms cubic-bezier(0.23,1,0.32,1)" }}
                    />
                  </div>
                  <p className="text-slate-600 text-[10px] mt-0.5">{l.lokasjon}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {l.tilgang.map((t) => (
                      <TilgangMerke key={t} t={t} />
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
          {f.notat && (
            <div
              className="rounded-xl px-3 py-2 mt-3 flex items-start gap-2"
              style={{ background: f.farge + "08", border: `1px solid ${f.farge}18` }}
            >
              <Info size={11} style={{ color: f.farge }} className="mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <p className="text-slate-500 text-[10px] leading-relaxed">{f.notat}</p>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Lounger() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Heading — left-aligned */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
              }}
            >
              <Armchair size={15} className="text-slate-400" strokeWidth={1.5} />
            </div>
            <p className="text-slate-600 text-xs uppercase tracking-[0.2em]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Loungeadgang
            </p>
          </div>
          <h2 className="text-white text-3xl mb-2" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
            Lounger på flyplassene
          </h2>
          <p className="text-slate-500 text-sm max-w-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Tilgang via seteklasse, LoungeKey eller Mastercard Airport Experiences. Verifisert mot Priority Pass / Collinson-nettverket, 2026.
          </p>
        </motion.div>

        {/* Access legend */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", duration: 0.4, bounce: 0 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          <TilgangMerke t="business" />
          <TilgangMerke t="loungekey" />
          <TilgangMerke t="mastercard" />
        </motion.div>

        {/* Airport grid — asymmetric 2-col */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FLYPLASSER.map((f, i) => (
            <FlyplassKort key={f.iata} f={f} delay={i * 0.08} />
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-slate-700 text-[10px] mt-4"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Loungeadgang og åpningstider kan endres — bekreft alltid i LoungeKey-/Mastercard-appen før avreise. Business-lounge avhenger av gjeldende kontrakt ved gaten.
        </motion.p>
      </div>
    </section>
  )
}
