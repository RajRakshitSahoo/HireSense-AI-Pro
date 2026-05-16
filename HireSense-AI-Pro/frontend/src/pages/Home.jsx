/**
 * HireSense-AI — Home Page
 * Hero section, features, how it works, testimonials, CTA
 */
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain, Zap, Target, TrendingUp, Shield, Download,
  ArrowRight, CheckCircle, Star, BarChart2, FileSearch, Sparkles
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const FEATURES = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    desc: 'Google Gemini AI reads your resume intelligently and provides expert-level feedback.',
    color: 'from-brand-500 to-blue-600',
  },
  {
    icon: Target,
    title: 'ATS Compatibility Score',
    desc: 'Know exactly how likely your resume is to pass Applicant Tracking Systems.',
    color: 'from-accent-violet to-purple-600',
  },
  {
    icon: Zap,
    title: 'Keyword Detection',
    desc: 'Instantly find missing keywords and add them to outrank other candidates.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: TrendingUp,
    title: 'Role-Specific Tips',
    desc: 'Get tailored suggestions for Developer, Designer, Data Analyst, PM and more.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: FileSearch,
    title: 'Section Analysis',
    desc: 'Evaluate every section — Summary, Experience, Skills, Education — individually.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Download,
    title: 'Export Report',
    desc: 'Download your full analysis report and share it with your career coach.',
    color: 'from-cyan-500 to-brand-500',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Upload Your Resume',
    desc: 'Drag and drop your PDF or DOCX resume file. Supported up to 5MB.',
    icon: FileSearch,
  },
  {
    num: '02',
    title: 'Select Target Role',
    desc: 'Choose your target job role so our AI can tailor the analysis.',
    icon: Target,
  },
  {
    num: '03',
    title: 'Get AI Analysis',
    desc: 'Our AI analyzes your resume in seconds and generates a full report.',
    icon: Sparkles,
  },
  {
    num: '04',
    title: 'Improve & Apply',
    desc: 'Apply our suggestions, boost your score, and land more interviews.',
    icon: TrendingUp,
  },
]

const ROLES = [
  'Software Developer', 'Frontend Developer', 'Backend Developer',
  'Data Analyst', 'Data Scientist', 'UI/UX Designer',
  'Product Manager', 'DevOps Engineer', 'Marketing Specialist', 'Business Analyst',
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
}

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-24">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-accent-violet/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-accent-cyan/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          className="relative max-w-5xl mx-auto text-center"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.15 } } }}
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-brand-300 border border-brand-500/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            Powered by Google Gemini AI
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6"
          >
            Make Your Resume{' '}
            <span className="gradient-text">ATS-Ready</span>
            <br />
            in Seconds
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            HireSense-AI analyzes your resume with advanced AI, detects missing keywords,
            and gives you a personalized roadmap to land more interviews.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={user ? '/upload' : '/register'}
              className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-4"
            >
              <Sparkles size={18} />
              Analyze My Resume Free
              <ArrowRight size={16} />
            </Link>
            <Link to="/about" className="btn-secondary flex items-center justify-center gap-2 text-base px-8 py-4">
              <BarChart2 size={18} />
              See How It Works
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-6 mt-12">
            {[
              { icon: Shield, text: 'Privacy First' },
              { icon: Zap, text: 'Results in Seconds' },
              { icon: Star, text: 'AI-Powered' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-slate-400">
                <Icon size={14} className="text-brand-400" />
                {text}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Supported Roles ticker ─────────────────────────────── */}
      <section className="py-8 overflow-hidden border-y border-white/5">
        <div className="flex gap-6 animate-[marquee_20s_linear_infinite]" style={{ width: 'max-content' }}>
          {[...ROLES, ...ROLES].map((role, i) => (
            <span key={i} className="flex items-center gap-2 text-sm text-slate-400 whitespace-nowrap px-4">
              <CheckCircle size={13} className="text-brand-400" />
              {role}
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-bold text-4xl mb-4">
              Everything You Need to{' '}
              <span className="gradient-text">Get Hired</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Our AI-powered platform covers every aspect of resume optimization from ATS scoring to keyword analysis.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 group hover:border-brand-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="font-display font-semibold text-lg text-slate-100 mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-950/20 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-bold text-4xl mb-4">
              How <span className="gradient-text">HireSense-AI</span> Works
            </h2>
            <p className="text-slate-400">Four simple steps to transform your resume</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] right-0 h-px bg-gradient-to-r from-brand-500/30 to-transparent" />
                )}

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-900/50">
                  <step.icon size={26} className="text-white" />
                </div>
                <div className="text-xs font-mono text-brand-400 mb-2">{step.num}</div>
                <h3 className="font-display font-semibold text-slate-100 mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-3xl mx-auto glass rounded-3xl p-10 text-center border border-brand-500/20 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-accent-violet/10 pointer-events-none" />
          <div className="relative">
            <Brain size={40} className="text-brand-400 mx-auto mb-4" />
            <h2 className="font-display font-bold text-3xl mb-4">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Join thousands of job seekers who've improved their resume score and landed more interviews with HireSense-AI.
            </p>
            <Link
              to={user ? '/upload' : '/register'}
              className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4"
            >
              <Sparkles size={18} />
              Start Analyzing for Free
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
