import { motion } from "framer-motion"
import { Plane, MapPin, Scissors, Dumbbell, Anchor, UtensilsCrossed } from "lucide-react"
import { useReisefase } from "../context/reisefase-context"

interface Aktivitet {
  type: "skredder" | "muaythai" | "dagstur" | "restaurant"
  navn: string
  detaljer: string[]
  bookingUrl?: string
  farge: string
}

interface ReiseEvent {
  dato: string
  isoDato: string
  dagNr: number
  tittel: string
  undertittel?: string
  hotellUrl?: string
  type: "fly" | "hotell" | "avreise" | "hjemkomst"
  farge: "gold" | "ocean" | "jungle" | "violet"
  aktiviteter?: Aktivitet[]
}

const TIDSLINJE: ReiseEvent[] = [
  {
    dato: "Tir 11. aug",
    isoDato: "2026-08-11",
    dagNr: 0,
    tittel: "Avreise fra Bergen",
    undertittel: "BGO → CPH → AMS → BKK · kl. 05:50 · Business Class",
    type: "avreise",
    farge: "violet",
  },
  {
    dato: "Ons 12. aug",
    isoDato: "2026-08-12",
    dagNr: 2,
    tittel: "Ankomst Bangkok",
    undertittel: "Innsjekk · Hope Land Hotel Sukhumvit 8",
    hotellUrl: "https://www.agoda.com/hope-land-hotel-sukhumvit-8/hotel/bangkok-th.html",
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
    isoDato: "2026-08-15",
    dagNr: 5,
    tittel: "Fly til Koh Samui",
    undertittel: "Lamai Coconut Beach Resort · 7 netter",
    hotellUrl: "https://www.agoda.com/lamai-coconut-beach-resort/hotel/koh-samui-th.html",
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
      {
        type: "dagstur",
        navn: "Koh Tao dagstur",
        farge: "#818cf8",
        detaljer: [
          "Lomprayah katamaran · Pralarn Pier → Mae Haad",
          "~1t 30 min å reise (ca. 1 000 THB t/r)",
          "John-Suwan Viewpoint, Ao Tanot Bay, Chalok Bay",
          "Avganger 08:00 og 10:30 — retur 12:00 eller 15:00",
        ],
        bookingUrl: "https://www.lomprayah.com/booking?type=oneway&from=11&to=9",
      },
    ],
  },
  {
    dato: "Lør 22. aug",
    isoDato: "2026-08-22",
    dagNr: 12,
    tittel: "Fly til Phuket",
    undertittel: "Chanalai Flora Resort, Kata Beach · 7 netter",
    hotellUrl: "https://www.agoda.com/chanalai-flora-resort/hotel/phuket-th.html",
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
    ],
  },
  {
    dato: "Lør 29. aug",
    isoDato: "2026-08-29",
    dagNr: 19,
    tittel: "HKT -> BKK",
    undertittel: "kl. 12:55 → 14:30 · Mandarin Hotel Centre Point",
    hotellUrl: "https://www.agoda.com/mandarin-hotel-managed-by-centre-point/hotel/bangkok-th.html",
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
    dato: "Man 31. aug",
    isoDato: "2026-08-31",
    dagNr: 21,
    tittel: "Benihana · Anantara Riverside",
    undertittel: "Avskjedskveld i Bangkok",
    hotellUrl: "https://www.agoda.com/mandarin-hotel-managed-by-centre-point/hotel/bangkok-th.html",
    type: "hotell",
    farge: "gold",
    aktiviteter: [
      {
        type: "restaurant",
        navn: "Benihana",
        farge: "#f59e0b",
        detaljer: [
          "Anantara Riverside Bangkok Resort",
          "257/1-3 Charoennakorn Rd, Thon Buri · Chao Phraya-bredden",
          "Japansk teppanyaki — grillet foran gjestene",
          "Bestill bord på forhånd — populaert blant turister",
        ],
        bookingUrl: "https://www.anantara.com/en/riverside-bangkok/restaurants/benihana",
      },
    ],
  },
  {
    dato: "Tir 1. sep",
    isoDato: "2026-09-01",
    dagNr: 22,
    tittel: "Hjemreise til Bergen",
    undertittel: "BKK → AMS → CPH → BGO · kl. 12:05 → 2. sep kl. 09:40",
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
  const Icon = a.type === "skredder" ? Scissors : a.type === "dagstur" ? Anchor : a.type === "restaurant" ? UtensilsCrossed : Dumbbell
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
  const { nå, fase } = useReisefase()

  // Gjeldende etappe = siste hendelse som har inntruffet (kun mens reisen pågår / er over)
  let aktivIndex = -1
  if (fase !== "før") {
    const iDag = new Date(nå.getFullYear(), nå.getMonth(), nå.getDate()).getTime()
    TIDSLINJE.forEach((e, i) => {
      if (new Date(e.isoDato).getTime() <= iDag) aktivIndex = i
    })
  }

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
            const erNå = i === aktivIndex
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
                  {erNå ? (
                    <span className="relative flex h-3 w-3 flex-shrink-0 mt-0.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60 animate-ping" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-400 ring-4 ring-amber-400/40" />
                    </span>
                  ) : (
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-0.5 ring-4 ${f.dot} ${f.ring}`} />
                  )}
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
                    {erNå && (
                      <span
                        className="inline-flex items-center text-[9px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded-full"
                        style={{
                          background: "rgba(245,223,168,0.18)",
                          color: "#f5dfa8",
                          border: "1px solid rgba(245,223,168,0.4)",
                        }}
                      >
                        Nå
                      </span>
                    )}
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
                  {event.hotellUrl && (
                    <a
                      href={event.hotellUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-0.5 text-[11px] hover:opacity-70 transition-opacity"
                      style={{ color: 'rgba(148,163,184,0.55)', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <MapPin size={10} strokeWidth={1.5} />
                      Hotell
                    </a>
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
