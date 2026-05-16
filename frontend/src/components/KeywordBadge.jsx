/**
 * HireSense-AI — Keyword Badge Component
 */
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

export function KeywordBadge({ keyword, found = true, index = 0 }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
        found
          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20'
          : 'bg-red-500/10 text-red-300 border-red-500/20 hover:bg-red-500/20'
      }`}
    >
      {found ? <Check size={10} /> : <X size={10} />}
      {keyword}
    </motion.span>
  )
}

export function SkillBadge({ skill, index = 0 }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-brand-500/10 text-brand-300 border border-brand-500/20 hover:bg-brand-500/20 transition-colors cursor-default"
    >
      + {skill}
    </motion.span>
  )
}
