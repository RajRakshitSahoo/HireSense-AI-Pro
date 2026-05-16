/**
 * HireSense-AI — Score Progress Bar Component
 */
import { motion } from 'framer-motion'
import { getScoreColor } from '../utils/helpers'

export default function ScoreBar({ label, score, delay = 0 }) {
  const color = getScoreColor(score)

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-400">{label}</span>
        <span className="text-sm font-semibold font-mono" style={{ color }}>
          {score}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay }}
        />
      </div>
    </div>
  )
}
