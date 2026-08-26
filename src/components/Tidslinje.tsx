import { motion } from "framer-motion"
import { Plane, MapPin, Scissors, Dumbbell, Anchor, UtensilsCrossed, ShoppingBag, Moon, Sun, Footprints } from "lucide-react"
import { useReisefase } from "../context/reisefase-context"

interface Aktivitet {
  type: "skredder" | "muaythai" | "dagstur" | "restaurant" | "shopping" | "hvile" | "fly" | "tur"
  navn: string
  detaljer: string[]
  bookingUrl?: string
  lenkeTekst?: string     // standard er «Book →»
  farge: string
}

interface ReiseEvent {
  dato: string
  isoDato: string
  dagNr?: number          // utelates for hendelser som spenner over flere dager
  tittel: string
  undertittel?: string
  hotellUrl?: string
  type: "fly" | "hotell" | "avreise" | "hjemkomst" | "dag"
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
        type: "hvile",
        navn: "Jetlag & innsjekk",
        farge: "#a78bfa",
        detaljer: [
          "Innsjekk på Hope Land Hotel Sukhumvit 8",
          "Rolig dag — 5 timer tidsforskjell fra Norge",
        ],
      },
    ],
  },
  {
    dato: "Tor 13. aug",
    isoDato: "2026-08-13",
    dagNr: 3,
    tittel: "Terminal 21 & Chinatown",
    undertittel: "Dagtid på Asok · kveldstid i Yaowarat",
    type: "dag",
    farge: "gold",
    aktiviteter: [
      {
        type: "shopping",
        navn: "Dagtid · Terminal 21",
        farge: "#f59e0b",
        detaljer: [
          "Kjøpesenter på Asok bygget som en flyplass — hver etasje er en egen by",
          "To BTS-stopp fra hotellet · Pier 21 food court i 5. etasje",
        ],
      },
      {
        type: "restaurant",
        navn: "Kveldstid · Chinatown",
        farge: "#fb7185",
        detaljer: [
          "Yaowarat Road — Bangkoks Chinatown, 20 min unna med MRT",
          "Gatekjøkken og neonskilt fra 18:00 og utover",
        ],
      },
    ],
  },
  {
    dato: "Fre 14. aug",
    isoDato: "2026-08-14",
    dagNr: 4,
    tittel: "Shoppingsentre i Siam",
    undertittel: "MBK, Siam og CentralWorld · skreddermål",
    type: "dag",
    farge: "gold",
    aktiviteter: [
      {
        type: "shopping",
        navn: "MBK · Siam · CentralWorld",
        farge: "#f59e0b",
        detaljer: [
          "BTS Nana → Siam — alle tre ligger i gangavstand via skywalk",
          "MBK for billig elektronikk, Siam og CentralWorld for merkevarer",
        ],
      },
      {
        type: "skredder",
        navn: "Alex Modern Tailor",
        farge: "#f59e0b",
        detaljer: [
          "5 skjorter bestilt",
          "Leveres til hotellet 29. aug kl. 18:00",
        ],
        bookingUrl: "https://sites.google.com/view/alexmoderntailor/home",
        lenkeTekst: "Nettside →",
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
        type: "tur",
        navn: "Morgenjogg · Benjakitti",
        farge: "#34d399",
        detaljer: [
          "Benjakitti Park kl. 06:00–08:00, før utsjekk og flyet",
          "Ca. 2 km fra hotellet · løperunde rundt innsjøen med skyskrapere rundt",
        ],
      },
      {
        type: "fly",
        navn: "PG 145 · BKK → USM",
        farge: "#38bdf8",
        detaljer: [
          "kl. 13:40 → 14:45 · 1t 05m direkte",
          "Bangkok Airways · Airbus A319 · Economy (Y)",
        ],
      },
      {
        type: "hvile",
        navn: "Hverdagen i Lamai",
        farge: "#a78bfa",
        detaljer: [
          "Stranden, massasje og lunsj på stranden",
          "Middag på Eating Time",
        ],
        bookingUrl: "https://www.tripadvisor.com/Restaurant_Review-g1188000-d8836184-Reviews-Eating_Time-Lamai_Beach_Maret_Ko_Samui_Surat_Thani_Province.html",
        lenkeTekst: "Anmeldelser →",
      },
    ],
  },
  {
    dato: "Søn 16. aug",
    isoDato: "2026-08-16",
    dagNr: 6,
    tittel: "Første kveld i Lamai",
    undertittel: "Gatelangs, middag på hotellet og fire show",
    type: "dag",
    farge: "ocean",
    aktiviteter: [
      {
        type: "tur",
        navn: "Gatelangs i Lamai",
        farge: "#38bdf8",
        detaljer: [
          "Kveldstur langs hovedgata — barer, massasjesjapper og gatekjøkken",
        ],
      },
      {
        type: "restaurant",
        navn: "Middag & fire show",
        farge: "#fb7185",
        detaljer: [
          "Middag på Lamai Coconut Beach Resort",
          "Ildshow utover kvelden",
        ],
      },
    ],
  },
  {
    dato: "Man 17. aug",
    isoDato: "2026-08-17",
    dagNr: 7,
    tittel: "Ang Thong",
    undertittel: "Go Samui Tours · henting 07:15, tilbake ca. 17:00",
    type: "dag",
    farge: "ocean",
    aktiviteter: [
      {
        type: "dagstur",
        navn: "Mu Ko Ang Thong",
        farge: "#818cf8",
        detaljer: [
          "Booket hos Go Samui Tours · ref. GST10792 · 2 voksne, uten kajakk",
          "Henting på Lamai Coconut Beach Resort, rom 404",
          "Frokost og buffetlunsj om bord · parkavgift 300 THB kommer trolig i tillegg",
        ],
        bookingUrl: "https://gosamuitours.com/angthong_island_tour.html",
        lenkeTekst: "Turside →",
      },
      {
        type: "tur",
        navn: "Dagsprogram",
        farge: "#38bdf8",
        detaljer: [
          "07:15 · Henting på hotellet → Nathon Pier",
          "08:30 · Avgang Nathon Pier, frokost om bord",
          "09:50 · Wua Talap — utsiktssti og strand",
          "12:30 · Buffetlunsj om bord",
          "13:30 · Mae Ko — Emerald Lake",
          "15:30 · Retur, tilbake på Samui ca. 17:00",
        ],
      },
    ],
  },
  {
    dato: "Tir 18. – fre 21. aug",
    isoDato: "2026-08-18",
    tittel: "Muay Thai hver morgen",
    undertittel: "Evolution Samui Retreat · fire økter på rad",
    type: "dag",
    farge: "ocean",
    aktiviteter: [
      {
        type: "muaythai",
        navn: "Evolution Samui Retreat",
        farge: "#38bdf8",
        detaljer: [
          "Morgentrening kl. 07:00, tirsdag til og med fredag",
        ],
        bookingUrl: "https://www.evolutionsamuiretreat.com",
        lenkeTekst: "Nettside →",
      },
    ],
  },
  {
    dato: "Ons 19. aug",
    isoDato: "2026-08-19",
    dagNr: 9,
    tittel: "Overlap Stone",
    undertittel: "Utsiktspunkt i åsene over Lamai",
    type: "dag",
    farge: "ocean",
    aktiviteter: [
      {
        type: "tur",
        navn: "Overlap Stone",
        farge: "#38bdf8",
        detaljer: [
          "Enorm balanserende stein i åsen bak Lamai",
          "Panorama over østkysten fra toppen",
        ],
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
        type: "fly",
        navn: "PG 405 · USM → HKT",
        farge: "#34d399",
        detaljer: [
          "Forsinket: 12:50 → 13:40 (opprinnelig 12:25 → 13:25)",
          "Bangkok Airways · ATR 42/72 · Economy (Y) · ankomst terminal D",
        ],
      },
      {
        type: "muaythai",
        navn: "Chang Muay Thai",
        farge: "#34d399",
        detaljer: [
          "116/9 Khok Tanod Road — samme gate som hotellet",
          "Morgenøkt fra 08:00 · privattime 1t = 600 THB, utstyr inkludert",
        ],
        bookingUrl: "https://changmuaythai.com/",
        lenkeTekst: "Nettside →",
      },
    ],
  },
  {
    dato: "Søn 23. aug",
    isoDato: "2026-08-23",
    dagNr: 13,
    tittel: "Big Buddha",
    undertittel: "Opp gjennom jungelen om formiddagen · basseng resten av dagen",
    type: "dag",
    farge: "jungle",
    aktiviteter: [
      {
        type: "tur",
        navn: "Morgentur · Big Buddha",
        farge: "#34d399",
        detaljer: [
          "Start 07:30 — smal sti opp gjennom jungelen, mye røtter og stein",
          "9,96 km og 344 høydemeter på 2t 16m · 5 km i bilveien ned igjen",
        ],
      },
      {
        type: "hvile",
        navn: "Bassenget",
        farge: "#a78bfa",
        detaljer: [
          "Resten av dagen på hotellet",
        ],
      },
    ],
  },
  {
    dato: "Lør 29. aug",
    isoDato: "2026-08-29",
    dagNr: 19,
    tittel: "HKT → BKK",
    undertittel: "kl. 12:55 → 14:30 · Mandarin Hotel Centre Point",
    hotellUrl: "https://www.agoda.com/mandarin-hotel-managed-by-centre-point/hotel/bangkok-th.html",
    type: "fly",
    farge: "gold",
    aktiviteter: [
      {
        type: "fly",
        navn: "PG 276 · HKT → BKK",
        farge: "#f59e0b",
        detaljer: [
          "kl. 12:55 → 14:30 · 1t 35m direkte",
          "Bangkok Airways · Airbus A319 · Economy (P) · avgang terminal D",
        ],
      },
      {
        type: "skredder",
        navn: "Alex Modern Tailor",
        farge: "#f59e0b",
        detaljer: [
          "5 skjorter leveres til hotellet kl. 18:00",
          "Prøv alle før budet drar",
        ],
        bookingUrl: "https://sites.google.com/view/alexmoderntailor/home",
        lenkeTekst: "Nettside →",
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
        type: "dagstur",
        navn: "Siste dagene i Bangkok",
        farge: "#f59e0b",
        detaljer: [
          "Shopping og ICONSIAM på vestbredden av Chao Phraya",
          "Elvetur på Chao Phraya og Wat Arun",
          "Rooftop-middag over byen",
        ],
      },
      {
        type: "restaurant",
        navn: "Benihana",
        farge: "#f59e0b",
        detaljer: [
          "Anantara Riverside Bangkok Resort",
          "257/1-3 Charoennakorn Rd, Thon Buri · Chao Phraya-bredden",
          "Japansk teppanyaki — grillet foran gjestene",
          "Bestill bord på forhånd — populært blant turister",
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

const IKON_MAP: Record<Aktivitet["type"], typeof Scissors> = {
  skredder: Scissors,
  dagstur: Anchor,
  restaurant: UtensilsCrossed,
  shopping: ShoppingBag,
  hvile: Moon,
  muaythai: Dumbbell,
  fly: Plane,
  tur: Footprints,
}

const FARGE_MAP = {
  gold: { dot: "bg-amber-400", ring: "ring-amber-400/30", tekst: "text-amber-300", linje: "bg-amber-400/30" },
  ocean: { dot: "bg-sky-400", ring: "ring-sky-400/30", tekst: "text-sky-300", linje: "bg-sky-400/30" },
  jungle: { dot: "bg-emerald-400", ring: "ring-emerald-400/30", tekst: "text-emerald-300", linje: "bg-emerald-400/30" },
  violet: { dot: "bg-violet-400", ring: "ring-violet-400/30", tekst: "text-violet-300", linje: "bg-violet-400/30" },
}

function AktivitetKort({ a }: { a: Aktivitet }) {
  const Icon = IKON_MAP[a.type]
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
            {a.lenkeTekst ?? "Book →"}
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
                    {event.type === "dag" && (
                      <Sun size={11} className={f.tekst} strokeWidth={1.5} />
                    )}
                    <span
                      className={`text-xs font-medium uppercase tracking-wider ${f.tekst}`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {event.dato}
                      {event.dagNr !== undefined && <> · Dag {event.dagNr}</>}
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
