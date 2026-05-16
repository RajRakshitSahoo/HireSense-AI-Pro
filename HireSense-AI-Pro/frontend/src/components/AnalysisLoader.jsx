/**
 * HireSense-AI — Analysis Loading Animation Component
 */
import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'

const STEPS = [
  'Parsing resume content...',
  'Extracting keywords & skills...',
  'Running ATS compatibility check...',
  'Analyzing with AI provider...',
  'Generating improvement tips...',
  'Finalizing your report...',
]

export default function AnalysisLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-8 p-8">
      {/* Animated brain icon */}
      <div className="relative">
        <motion.div
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-600 to-accent-violet flex items-center justify-center shadow-2xl shadow-brand-900/50"
          animate={{
            boxShadow: [
              '0 0 30px rgba(51,113,255,0.3)',
              '0 0 60px rgba(51,113,255,0.6)',
              '0 0 30px rgba(51,113,255,0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Brain size={40} className="text-white" />
          </motion.div>
        </motion.div>

        {/* Orbiting dots */}
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-brand-400"
            style={{ top: '50%', left: '50%' }}
            animate={{
              x: Math.cos((i * 2 * Math.PI) / 3) * 48,
              y: Math.sin((i * 2 * Math.PI) / 3) * 48,
              rotate: 360,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.33,
            }}
          />
        ))}
      </div>

      <div className="text-center space-y-2">
        <h3 className="font-display font-bold text-xl gradient-text">Analyzing Your Resume</h3>
        <p className="text-slate-400 text-sm">Our AI is working hard to optimize your resume</p>
      </div>

      {/* Step list */}
      <div className="space-y-2 w-full max-w-xs">
        {STEPS.map((step, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.5 }}
            className="flex items-center gap-3"
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
            />
            <span className="text-xs text-slate-400">{step}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
