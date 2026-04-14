import { motion } from 'framer-motion'
import { Plane, Hotel, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { UTGIFTER } from '../data'

function formatNOK(verdi: number | null): string {
  if (verdi === null) return '—'
  return new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: 'NOK',
    maximumFractionDigits: 0,
  }).format(verdi)
}

export function Budsjett() {
  const transport = UTGIFTER.filter((u) => u.kategori === 'transport')
  const overnatting = UTGIFTER.filter((u) => u.kategori === 'overnatting')

  const totalTransport = transport.reduce((s, u) => s + (u.totalt ?? 0), 0)
  const totalOvernatting = overnatting.reduce((s, u) => s + (u.totalt ?? 0), 0)
  const totalAlt = totalTransport + totalOvernatting
  const totalPerPerson = UTGIFTER.reduce((s, u) => s + (u.perPerson ?? 0), 0)

  const uoppgjort = UTGIFTER.filter((u) => !u.oppgjort).length

  return (
    <section className="px-4 mb-16 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h2 className="font-display font-600 text-2xl text-white mb-1"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
          Budsjett
        </h2>
        <p className="text-slate-400 text-sm">Registrerte utgifter pr. 14. april 2026 (for 2026-turen)</p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { etikett: 'Totalt', verdi: formatNOK(totalAlt), ikon: TrendingUp, farge: 'text-amber-400' },
          { etikett: 'Per person', verdi: formatNOK(totalPerPerson), ikon: TrendingUp, farge: 'text-sky-400' },
          { etikett: 'Transport', verdi: formatNOK(totalTransport), ikon: Plane, farge: 'text-violet-400' },
          {
            etikett: 'Uoppgjort',
            verdi: uoppgjort === 0 ? 'Alt ok' : `${uoppgjort} poster`,
            ikon: uoppgjort === 0 ? CheckCircle : AlertCircle,
            farge: uoppgjort === 0 ? 'text-emerald-400' : 'text-rose-400',
          },
        ].map(({ etikett, verdi, ikon: Ikon, farge }, i) => (
          <motion.div
            key={etikett}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="glass rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Ikon size={14} className={farge} />
              <span className="text-slate-500 text-xs uppercase tracking-wider">{etikett}</span>
            </div>
            <p className="text-white font-display font-600 text-lg"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
              {verdi}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Bar chart visualization */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass rounded-2xl p-6 mb-6"
      >
        <h3 className="text-slate-300 text-sm font-medium mb-6">Fordeling overnatting</h3>
        <div className="space-y-4">
          {overnatting.map((u, i) => {
            const andel = totalOvernatting > 0 ? ((u.totalt ?? 0) / totalOvernatting) * 100 : 0
            return (
              <div key={u.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-300 text-sm">{u.destinasjon}</span>
                  <span className="text-slate-400 text-sm tabular-nums">{formatNOK(u.totalt)}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${andel}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1 + 0.3, ease: 'easeOut' }}
                    className="h-full rounded-full bg-amber-500/60"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Full breakdown table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-slate-300 text-sm font-medium">Alle poster</h3>
        </div>
        <div className="divide-y divide-white/5">
          {UTGIFTER.map((u) => (
            <div key={u.id} className="px-6 py-4 flex items-center gap-4">
              <div className={`rounded-lg w-8 h-8 flex items-center justify-center flex-shrink-0 ${u.kategori === 'transport' ? 'bg-violet-500/10' : 'bg-amber-500/10'}`}>
                {u.kategori === 'transport'
                  ? <Plane size={14} className="text-violet-400" />
                  : <Hotel size={14} className="text-amber-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-200 text-sm font-medium truncate">{u.navn}</p>
                <p className="text-slate-500 text-xs">{u.merknad ?? ''}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-slate-200 text-sm tabular-nums font-medium">{formatNOK(u.totalt)}</p>
              </div>
              <div className="flex-shrink-0">
                {u.oppgjort
                  ? <CheckCircle size={16} className="text-emerald-500" />
                  : <Clock size={16} className="text-amber-500" />}
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-slate-400 text-sm">Sum</span>
          <div className="text-right">
            <span className="text-white font-display font-600 text-base tabular-nums"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
              {formatNOK(totalAlt)}
            </span>
            <span className="text-slate-400 text-sm ml-2">({formatNOK(totalPerPerson)} / pers.)</span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
