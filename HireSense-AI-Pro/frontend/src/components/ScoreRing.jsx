/**
 * HireSense-AI — Score Ring Component
 * Animated circular progress indicator for ATS score.
 */
import { motion } from 'framer-motion'
import { getScoreColor, getScoreLabel } from '../utils/helpers'

export default function ScoreRing({ score = 0, size = 160, strokeWidth = 10, label = 'ATS Score' }) {
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const progress = circumference - (score / 100) * circumference
  const color = getScoreColor(score)
  const scoreLabel = getScoreLabel(score)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background glow */}
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-xl"
          style={{ background: color }}
        />

        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="score-ring -rotate-90"
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: progress }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-display font-bold text-3xl text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-slate-400 font-medium">/100</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-slate-300">{label}</p>
        <p className="text-xs font-semibold" style={{ color }}>{scoreLabel}</p>
      </div>
    </div>
  )
}
