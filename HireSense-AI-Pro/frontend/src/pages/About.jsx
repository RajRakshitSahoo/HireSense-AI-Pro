/**
 * HireSense-AI — About Page
 */
import { motion } from 'framer-motion'
import { Brain, Zap, Target, Shield, Code2, Layers, Database, Globe } from 'lucide-react'

const TECH_STACK = [
  { name: 'React 18', icon: Code2, color: 'text-cyan-400', desc: 'Frontend UI library' },
  { name: 'Tailwind CSS', icon: Layers, color: 'text-sky-400', desc: 'Utility-first styling' },
  { name: 'Framer Motion', icon: Zap, color: 'text-purple-400', desc: 'Smooth animations' },
  { name: 'FastAPI', icon: Globe, color: 'text-emerald-400', desc: 'Python web framework' },
  { name: 'Google Gemini', icon: Brain, color: 'text-brand-400', desc: 'AI analysis engine' },
  { name: 'SQLAlchemy', icon: Database, color: 'text-amber-400', desc: 'Async ORM' },
]

const VALUES = [
  { icon: Brain, title: 'AI-First', desc: 'We leverage cutting-edge generative AI to deliver insights no human editor could provide at scale.' },
  { icon: Target, title: 'Result-Focused', desc: 'Every feature is designed around one goal: helping you land more interviews and get hired faster.' },
  { icon: Shield, title: 'Privacy Committed', desc: 'Your resume data is processed securely. We never share your personal information with third parties.' },
]

export default function About() {
  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-900/50">
            <Brain size={36} className="text-white" />
          </div>
          <h1 className="font-display font-extrabold text-5xl gradient-text mb-4">About HireSense-AI</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            We built HireSense-AI because we know how frustrating it is to send dozens of applications and hear nothing back. 
            Our AI-powered platform levels the playing field for every job seeker.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8 border border-white/10 mb-12 text-center"
        >
          <h2 className="font-display font-bold text-2xl mb-4 gradient-text">Our Mission</h2>
          <p className="text-slate-300 leading-relaxed max-w-2xl mx-auto">
            To democratize career success by giving every job seeker access to intelligent, actionable resume feedback — 
            the kind of insight that used to require expensive career coaches or industry connections.
          </p>
        </motion.div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 border border-white/10 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center mx-auto mb-4">
                <v.icon size={22} className="text-brand-400" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 text-slate-100">{v.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="font-display font-bold text-3xl text-center mb-8">
            Built With <span className="gradient-text">Modern Tech</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {TECH_STACK.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-4 border border-white/10 hover:border-brand-500/30 transition-all group"
              >
                <tech.icon size={24} className={`${tech.color} mb-3 group-hover:scale-110 transition-transform`} />
                <p className="font-display font-semibold text-slate-100 text-sm">{tech.name}</p>
                <p className="text-slate-500 text-xs mt-0.5">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8 border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center"
        >
          {[
            { value: '10+', label: 'Job Roles Supported' },
            { value: 'AI', label: 'Powered by Gemini' },
            { value: '100%', label: 'Free to Start' },
            { value: '∞', label: 'Analyses Available' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="font-display font-extrabold text-3xl gradient-text mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
