import { motion } from 'framer-motion'
import { DESTINASJONER } from '../data'
import { DestinasjonKort } from './DestinasjonKort'

export function Destinasjoner() {
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
          Destinasjoner
        </h2>
        <p className="text-slate-400 text-sm">4 steder · 20 netter totalt</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DESTINASJONER.map((dest, i) => (
          <DestinasjonKort key={dest.id} destinasjon={dest} indeks={i} />
        ))}
      </div>
    </section>
  )
}
