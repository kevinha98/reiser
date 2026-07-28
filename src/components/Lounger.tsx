import { motion } from "framer-motion"
import { Armchair, Plane, KeyRound, CreditCard, Ticket, ChevronRight, Info, Sparkles } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type Tilgang = "business" | "loungekey" | "mastercard"

interface Lounge {
  navn: string
  lokasjon: string
  tilgang: Tilgang[]
  url: string
  anbefalt?: boolean
  rasjonale?: string
}

interface Flyplass {
  iata: string
  navn: string
  fase: string
  farge: string
  lounger: Lounge[]
  notat?: string
}

// ─── Data (verifisert mot Priority Pass / Collinson-nettverket, 2026) ─────────

const FLYPLASSER: Flyplass[] = [
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
        anbefalt: true,
        rasjonale:
          "CPHs beste lounge: størst areal, à la carte-meny og god buffet, barista-kaffe og stille soner. Med 4t 15m opphold får dere mest igjen her — og KLM Business bruker ofte nettopp denne.",
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
      "På retur er 1t 55m knapt — da er Crown Lounge 40 (Schengen) for CPH-flighten enklest.",
    lounger: [
      {
        navn: "KLM Crown Lounge 52",
        lokasjon: "Non-Schengen · via seteklasse",
        tilgang: ["business"],
        url: "https://www.prioritypass.com/en-GB/airport-guides/amsterdam-schiphol",
        anbefalt: true,
        rasjonale:
          "Allerede inkludert i World Business Class — dere betaler ingenting ekstra. KLMs flaggskiplounge: à la carte-restaurant, full bar, uteterrasse og dusjer. Klart best i AMS, og rett ved gaten til BKK-flighten (non-Schengen).",
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
      "KLM World Business Class (BKK→AMS) bruker kontraktslounge — sjekk ved gaten. LoungeKey/Mastercard gir tilgang til begge under uansett.",
    lounger: [
      {
        navn: "The Coral Finest Business Lounge (Cocoon)",
        lokasjon: "Concourse · airside",
        tilgang: ["loungekey", "mastercard"],
        url: "https://www.prioritypass.com/en-GB/lounges/thailand/suvarnabhumi/bkk25-the-coral-finest-business-class-lounge-cocoon",
        anbefalt: true,
        rasjonale:
          "Roligere og mer påkostet enn Miracle-loungene: Cocoon-hvilekapsler, à la carte-mat og bedre design. Best valg for en avslappet start på den lange hjemreisen.",
      },
      {
        navn: "Miracle Business Class Lounge",
        lokasjon: "Flere concourser · airside",
        tilgang: ["loungekey", "mastercard"],
        url: "https://www.prioritypass.com/en-GB/lounges/thailand/suvarnabhumi/bkk26-miracle-business-class-lounge",
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
      <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {f.lounger.map((l) => (
          <a
            key={l.navn}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-2 py-3 first:pt-0 last:pb-0"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className="text-slate-200 text-xs font-medium group-hover:text-white"
                    style={{ transition: "color 120ms ease-out" }}
                  >
                    {l.navn}
                  </span>
                  {l.anbefalt && (
                    <span
                      className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                      style={{
                        background: f.farge + "22",
                        color: f.farge,
                        border: `1px solid ${f.farge}45`,
                      }}
                    >
                      <Sparkles size={9} strokeWidth={2} />
                      Vårt valg
                    </span>
                  )}
                  <ChevronRight
                    size={11}
                    className="text-slate-500 group-hover:translate-x-0.5"
                    strokeWidth={2}
                    style={{ transition: "transform 150ms cubic-bezier(0.23,1,0.32,1)" }}
                  />
                </div>
                <p className="text-slate-500 text-[10px] mt-0.5">{l.lokasjon}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {l.tilgang.map((t) => (
                    <TilgangMerke key={t} t={t} />
                  ))}
                </div>
              </div>
            </div>
            {l.rasjonale && (
              <div
                className="rounded-lg px-3 py-2 flex items-start gap-2"
                style={{ background: f.farge + "0d", border: `1px solid ${f.farge}22` }}
              >
                <Sparkles size={11} style={{ color: f.farge }} className="mt-0.5 flex-shrink-0" strokeWidth={1.75} />
                <p className="text-slate-300 text-[11px] leading-relaxed">{l.rasjonale}</p>
              </div>
            )}
          </a>
        ))}
      </div>
      {f.notat && (
        <div
          className="rounded-xl px-3 py-2 mt-3 flex items-start gap-2"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <Info size={11} className="text-slate-400 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
          <p className="text-slate-400 text-[10px] leading-relaxed">{f.notat}</p>
        </div>
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
