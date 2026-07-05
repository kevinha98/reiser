import { motion } from "framer-motion"
import { Plane, MapPin, Scissors, Dumbbell } from "lucide-react"

interface Aktivitet {
  type: "skredder" | "muaythai"
  navn: string
  detaljer: string[]
  bookingUrl?: string
  farge: string
}

interface ReiseEvent {
  dato: string
  dagNr: number
  tittel: string
  undertittel?: string
  type: "fly" | "hotell" | "avreise" | "hjemkomst"
  farge: "gold" | "ocean" | "jungle" | "violet"
  aktiviteter?: Aktivitet[]
}

const TIDSLINJE: ReiseEvent[] = [
  {
    dato: "Tir 11. aug",
    dagNr: 0,
    tittel: "Avreise fra CPH",
    undertittel: "CPH → BKK · kl. 11:30 · Business Class",
    type: "avreise",
    farge: "violet",
  },
  {
    dato: "Ons 12. aug",
    dagNr: 2,
    tittel: "Ankomst Bangkok",
    undertittel: "Innsjekk · Hope Land Hotel Sukhumvit 8",
    type: "hotell",
    farge: "gold",
    aktiviteter: [
      {
        type: "skredder",
        navn: "Skredder",
        farge: "#f59e0b",
        detaljer: [
          "Gangavstand fra hotellet — Sukhumvit soi 7–11",
          "Dress 4 000–8 000 THB / Skjorte 700–1 500 THB",
          "Leveringstid 24–72 t — hent dag 3",
          "Be om to prøvinger og stoff-attest",
        ],
      },
    ],
  },
  {
    dato: "Lør 15. aug",
    dagNr: 5,
    tittel: "Fly til Koh Samui",
    undertittel: "Lamai Coconut Beach Resort · 7 netter",
    type: "fly",
    farge: "ocean",
    aktiviteter: [
      {
        type: "muaythai",
        navn: "Muay Thai",
        farge: "#38bdf8",
        detaljer: [
          "Punch It Gym · Lamai Beach",
          "1,5–2,5 km — jog dit langs strandveien",
          "700 THB gruppe / 1 800 THB privat",
          "Man–fre + søn kl. 08:30 og 18:00",
        ],
        bookingUrl: "https://www.klook.com/activity/127117-koh-samui-muay-thai-boxing-introduction-class-for-beginners/",
      },
    ],
  },
  {
    dato: "Lør 22. aug",
    dagNr: 12,
    tittel: "Fly til Phuket",
    undertittel: "Chanalai Flora Resort, Kata Beach · 7 netter",
    type: "fly",
    farge: "jungle",
    aktiviteter: [
      {
        type: "muaythai",
        navn: "Muay Thai",
        farge: "#34d399",
        detaljer: [
          "Tiger Muay Thai · Soi Ta-iad, Chalong",
          "5 km fra Kata Beach · 10–12 min (Grab)",
          "Fra 600 THB / klasse",
          "Man–fre 06:00–19:00 · Lør 07:00–18:00",
        ],
        bookingUrl: "https://tigermuaythai.com/",
      },
      {
        type: "skredder",
        navn: "Skredder",
        farge: "#34d399",
        detaljer: [
          "Patong-området · 9 km (Grab)",
          "Dress 7 000–14 000 THB / Skjorte 1 200–2 500 THB",
          "Sammenlign minst tre butikker",
        ],
      },
    ],
  },
  {
    dato: "Lør 29. aug",
    dagNr: 19,
    tittel: "HKT -> BKK",
    undertittel: "kl. 12:55 → 14:30 · Mandarin Hotel Centre Point",
    type: "fly",
    farge: "gold",
    aktiviteter: [
      {
        type: "skredder",
        navn: "Skredder",
        farge: "#f59e0b",
        detaljer: [
          "Hent klær fra soi 7–11",
          "Ev. nytt mål for skjorter (700–1 500 THB)",
          "Bestill 2–3 skjorter samlet for rabatt",
        ],
      },
    ],
  },
  {
    dato: "Tir 1. sep",
    dagNr: 22,
    tittel: "Hjemreise til CPH",
    undertittel: "BKK → CPH · kl. 12:05 → 22:30",
    type: "hjemkomst",
    farge: "violet",
  },
]

const FARGE_MAP = {
  gold: { dot: "bg-amber-400", ring: "ring-amber-400/30", tekst: "text-amber-300", linje: "bg-amber-400/30" },
  ocean: { dot: "bg-sky-400", ring: "ring-sky-400/30", tekst: "text-sky-300", linje: "bg-sky-400/30" },
  jungle: { dot: "bg-emerald-400", ring: "ring-emerald-400/30", tekst: "text-emerald-300", linje: "bg-emerald-400/30" },
  violet: { dot: "bg-violet-400", ring: "ring-violet-400/30", tekst: "text-violet-300", linje: "bg-violet-400/30" },
}

function AktivitetKort({ a }: { a: Aktivitet }) {
  const Icon = a.type === "skredder" ? Scissors : Dumbbell
  return (
    <div
      className="rounded-xl px-3 py-2.5"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${a.farge}20`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon size={11} style={{ color: a.farge, flexShrink: 0 }} strokeWidth={1.5} />
        <span
          className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: a.farge, fontFamily: "'DM Sans', sans-serif" }}
        >
          {a.navn}
        </span>
        {a.bookingUrl && (
          <a
            href={a.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-[10px] transition-opacity hover:opacity-60"
            style={{ color: a.farge, fontFamily: "'DM Sans', sans-serif" }}
          >
            Book →
          </a>
        )}
      </div>
      <ul className="space-y-0.5">
        {a.detaljer.map((d, i) => (
          <li key={i} className="flex items-baseline gap-1.5">
            <span
              className="flex-shrink-0 opacity-30"
              style={{
                display: "inline-block",
                width: "3px",
                height: "3px",
                borderRadius: "9999px",
                background: a.farge,
                marginTop: "5px",
              }}
            />
            <span
              className="text-slate-500 text-[11px] leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {d}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
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
        <h2
          className="text-2xl text-white mb-1"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
        >
          Reiseplan
        </h2>
        <p className="text-slate-400 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          11. august – 1. september 2026
        </p>
      </motion.div>

      <div className="glass rounded-2xl p-6 relative overflow-hidden">
        <div
          className="absolute right-0 top-0 w-64 h-64 opacity-5 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #d99b26, transparent 70%)" }}
        />
        <div className="relative">
          {TIDSLINJE.map((event, i) => {
            const f = FARGE_MAP[event.farge]
            const erSiste = i === TIDSLINJE.length - 1
            const harAktiviteter = event.aktiviteter && event.aktiviteter.length > 0

            return (
              <motion.div
                key={event.dato}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ type: "spring", stiffness: 90, damping: 18, delay: i * 0.07 }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-0.5 ring-4 ${f.dot} ${f.ring}`} />
                  {!erSiste && (
                    <div className={`w-px flex-1 my-1 ${f.linje} min-h-[32px]`} />
                  )}
                </div>

                <div className={`${erSiste ? "pb-0" : "pb-6"} flex-1 min-w-0`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    {(event.type === "fly" || event.type === "avreise" || event.type === "hjemkomst") && (
                      <Plane
                        size={11}
                        className={`${f.tekst} ${event.type === "hjemkomst" ? "rotate-180" : ""}`}
                        strokeWidth={1.5}
                      />
                    )}
                    {event.type === "hotell" && (
                      <MapPin size={11} className={f.tekst} strokeWidth={1.5} />
                    )}
                    <span
                      className={`text-xs font-medium uppercase tracking-wider ${f.tekst}`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {event.dato} · Dag {event.dagNr}
                    </span>
                  </div>
                  <h3
                    className="text-white text-base font-medium mb-0.5"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {event.tittel}
                  </h3>
                  {event.undertittel && (
                    <p
                      className="text-slate-400 text-sm"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {event.undertittel}
                    </p>
                  )}
                  {harAktiviteter && (
                    <div
                      className={`mt-3 grid gap-2 ${
                        event.aktiviteter!.length > 1
                          ? "grid-cols-1 sm:grid-cols-2"
                          : "grid-cols-1 max-w-sm"
                      }`}
                    >
                      {event.aktiviteter!.map((a, ai) => (
                        <AktivitetKort key={`${a.type}-${ai}`} a={a} />
                      ))}
                    </div>
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
