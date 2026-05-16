/**
 * HireSense-AI — Section Analysis Card Component
 */
import { motion } from 'framer-motion'
import { CheckCircle, XCircle } from 'lucide-react'
import { getScoreColor } from '../utils/helpers'

export default function SectionCard({ name, data, index = 0 }) {
  if (!data) return null
  const color = getScoreColor(data.score)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass rounded-xl p-4 space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {data.present
            ? <CheckCircle size={16} className="text-emerald-400 shrink-0" />
            : <XCircle size={16} className="text-red-400 shrink-0" />
          }
          <span className="font-medium text-slate-200 capitalize text-sm">{name}</span>
        </div>
        <span className="text-xs font-mono font-bold" style={{ color }}>
          {data.score}/100
        </span>
      </div>

      {/* Mini progress bar */}
      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${data.score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.1 + 0.3 }}
        />
      </div>

      {data.feedback && (
        <p className="text-xs text-slate-400 leading-relaxed">{data.feedback}</p>
      )}
    </motion.div>
  )
}
