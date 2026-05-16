/**
 * HireSense-AI Pro — Advanced AI Features Hub
 * AI Resume Rewriter, LinkedIn Analyzer, Interview Prep, Career Roadmap, etc.
 */
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileEdit, Linkedin, MessageSquare, Map, BarChart2, Globe,
  FileText, Mic, Sparkles, Trophy, ArrowLeft, Loader2,
  CheckCircle, Copy, Download, ChevronDown
} from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const FEATURES = [
  { id: 'rewrite',     icon: FileEdit,      color: 'from-brand-500 to-blue-600',    title: 'AI Resume Rewriter',         desc: 'Rewrite your entire resume with powerful AI' },
  { id: 'linkedin',    icon: Linkedin,      color: 'from-blue-600 to-cyan-500',     title: 'LinkedIn Analyzer',          desc: 'Optimize your LinkedIn profile for recruiters' },
  { id: 'interview',   icon: MessageSquare, color: 'from-violet-600 to-purple-500', title: 'Interview Question Generator', desc: 'Get personalized interview questions based on your resume' },
  { id: 'roadmap',     icon: Map,           color: 'from-emerald-600 to-teal-500',  title: 'Career Roadmap',             desc: 'Get a personalized career growth plan' },
  { id: 'grammar',     icon: FileText,      color: 'from-amber-500 to-orange-500',  title: 'Grammar Correction',         desc: 'Find and fix all grammar issues in your resume' },
  { id: 'template',    icon: Sparkles,      color: 'from-pink-500 to-rose-500',     title: 'Resume Template Generator', desc: 'Generate professional templates for any role' },
  { id: 'industry',    icon: Globe,         color: 'from-cyan-500 to-brand-500',    title: 'Industry Optimization',     desc: 'Tailor your resume for a specific industry' },
]

const ROLES = [
  'Software Developer', 'Frontend Developer', 'Backend Developer',
  'Data Analyst', 'Data Scientist', 'UI/UX Designer',
  'Product Manager', 'DevOps Engineer', 'Marketing Specialist', 'Business Analyst',
]

const LEVELS = ['junior', 'mid', 'senior', 'lead', 'executive']

export default function AdvancedFeatures() {
  const navigate = useNavigate()
  const [activeFeature, setActiveFeature] = useState(null)
  const [analyses, setAnalyses] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  // LinkedIn-specific
  const [linkedinText, setLinkedinText] = useState('')
  const [linkedinRole, setLinkedinRole] = useState(ROLES[0])

  // Template-specific
  const [templateRole, setTemplateRole] = useState(ROLES[0])
  const [templateLevel, setTemplateLevel] = useState('mid')

  // Career roadmap target
  const [targetRole, setTargetRole] = useState('')

  useEffect(() => {
    api.get('/api/resume/history')
      .then(res => {
        setAnalyses(res.data)
        if (res.data.length > 0) setSelectedId(String(res.data[0].id))
      })
      .catch(() => {})
  }, [])

  const handleFeatureClick = (feature) => {
    setActiveFeature(feature)
    setResult(null)
  }

  const handleRun = async () => {
    setLoading(true)
    setResult(null)
    try {
      let res
      switch (activeFeature.id) {
        case 'rewrite':
          res = await api.post('/api/advanced/rewrite', { analysis_id: parseInt(selectedId), target_role: targetRole || null })
          setResult({ type: 'text', content: res.data.rewritten_resume, title: 'AI-Rewritten Resume' })
          break
        case 'linkedin':
          res = await api.post('/api/advanced/linkedin', { linkedin_text: linkedinText, target_role: linkedinRole })
          setResult({ type: 'linkedin', content: res.data, title: 'LinkedIn Profile Analysis' })
          break
        case 'interview':
          res = await api.post('/api/advanced/interview-prep', { analysis_id: parseInt(selectedId), count: 15 })
          setResult({ type: 'list', content: res.data.interview_questions, title: 'Interview Questions' })
          break
        case 'roadmap':
          res = await api.post('/api/advanced/career-roadmap', { analysis_id: parseInt(selectedId), target_role: targetRole || null })
          setResult({ type: 'roadmap', content: res.data, title: 'Career Roadmap' })
          break
        case 'grammar':
          res = await api.get(`/api/advanced/grammar/${selectedId}`)
          setResult({ type: 'grammar', content: res.data, title: 'Grammar Report' })
          break
        case 'template':
          res = await api.post('/api/advanced/template', { job_role: templateRole, level: templateLevel })
          setResult({ type: 'text', content: res.data.template, title: `${templateLevel.charAt(0).toUpperCase()+templateLevel.slice(1)}-Level ${templateRole} Template` })
          break
        case 'industry':
          res = await api.post('/api/advanced/rewrite', { analysis_id: parseInt(selectedId), target_role: targetRole || linkedinRole })
          setResult({ type: 'text', content: res.data.rewritten_resume, title: 'Industry-Optimized Resume' })
          break
      }
      toast.success('Done!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2))
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <Link to="/upload" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-400 transition-colors text-sm mb-6">
            <ArrowLeft size={14} /> Back to Upload
          </Link>
          <h1 className="font-display font-bold text-4xl gradient-text mb-3">Advanced AI Features</h1>
          <p className="text-slate-400">Power tools to supercharge your job search with AI</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feature Grid */}
          <div className="lg:col-span-1 space-y-3">
            {FEATURES.map((feature, i) => (
              <motion.button
                key={feature.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => handleFeatureClick(feature)}
                className={`w-full text-left glass rounded-xl p-4 border transition-all duration-200 hover:-translate-y-0.5 group ${
                  activeFeature?.id === feature.id
                    ? 'border-brand-500/50 bg-brand-500/10'
                    : 'border-white/10 hover:border-brand-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                    <feature.icon size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-200 text-sm">{feature.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{feature.desc}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Feature Panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {!activeFeature ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass rounded-2xl border border-white/10 h-full min-h-80 flex flex-col items-center justify-center text-center p-12"
                >
                  <Sparkles size={48} className="text-brand-400 mb-4 opacity-50" />
                  <h3 className="font-display font-semibold text-xl text-slate-300 mb-2">Select a Feature</h3>
                  <p className="text-slate-500 text-sm">Choose a tool from the left to get started</p>
                </motion.div>
              ) : (
                <motion.div
                  key={activeFeature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass rounded-2xl border border-white/10 p-6 space-y-5"
                >
                  {/* Feature Header */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeFeature.color} flex items-center justify-center`}>
                      <activeFeature.icon size={18} className="text-white" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-xl">{activeFeature.title}</h2>
                      <p className="text-slate-400 text-sm">{activeFeature.desc}</p>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4 space-y-4">
                    {/* LinkedIn: text input */}
                    {activeFeature.id === 'linkedin' ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Paste LinkedIn Profile Text</label>
                          <textarea
                            value={linkedinText}
                            onChange={e => setLinkedinText(e.target.value)}
                            placeholder="Paste your LinkedIn About section, Experience, Skills etc. here..."
                            rows={6}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-all text-sm resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Target Role</label>
                          <select
                            value={linkedinRole}
                            onChange={e => setLinkedinRole(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 focus:outline-none focus:border-brand-500 transition-all text-sm"
                          >
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </div>
                      </>
                    ) : activeFeature.id === 'template' ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Job Role</label>
                          <select
                            value={templateRole}
                            onChange={e => setTemplateRole(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 focus:outline-none focus:border-brand-500 transition-all text-sm"
                          >
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Experience Level</label>
                          <select
                            value={templateLevel}
                            onChange={e => setTemplateLevel(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 focus:outline-none focus:border-brand-500 transition-all text-sm"
                          >
                            {LEVELS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase()+l.slice(1)}</option>)}
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Resume selector for history-based features */}
                        {analyses.length > 0 ? (
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Select Analysis</label>
                            <select
                              value={selectedId}
                              onChange={e => setSelectedId(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 focus:outline-none focus:border-brand-500 transition-all text-sm"
                            >
                              {analyses.map(a => (
                                <option key={a.id} value={String(a.id)}>
                                  {a.filename} — {a.job_role} (Score: {Math.round(a.ats_score)})
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <div className="glass rounded-xl p-4 border border-amber-500/20 bg-amber-500/5">
                            <p className="text-amber-300 text-sm">
                              No analyses found. <Link to="/upload" className="underline">Upload a resume first.</Link>
                            </p>
                          </div>
                        )}

                        {/* Target role for rewrite/roadmap/industry */}
                        {['rewrite', 'roadmap', 'industry'].includes(activeFeature.id) && (
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Target Role {activeFeature.id !== 'roadmap' && <span className="text-slate-500">(optional)</span>}
                            </label>
                            <select
                              value={targetRole}
                              onChange={e => setTargetRole(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 focus:outline-none focus:border-brand-500 transition-all text-sm"
                            >
                              <option value="">Same as analysis role</option>
                              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                          </div>
                        )}
                      </>
                    )}

                    {/* Run Button */}
                    <button
                      onClick={handleRun}
                      disabled={loading || (activeFeature.id === 'linkedin' && !linkedinText.trim()) || (!['linkedin', 'template'].includes(activeFeature.id) && !selectedId)}
                      className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <><Loader2 size={18} className="animate-spin" /> Processing...</>
                      ) : (
                        <><Sparkles size={18} /> Run {activeFeature.title}</>
                      )}
                    </button>
                  </div>

                  {/* Result Display */}
                  <AnimatePresence>
                    {result && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="border-t border-white/5 pt-5"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-display font-semibold text-lg text-emerald-300 flex items-center gap-2">
                            <CheckCircle size={18} /> {result.title}
                          </h3>
                          <button
                            onClick={() => copyToClipboard(result.type === 'text' ? result.content : result.content)}
                            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-400 transition-colors"
                          >
                            <Copy size={13} /> Copy
                          </button>
                        </div>

                        {result.type === 'text' && (
                          <pre className="text-sm text-slate-300 bg-white/5 rounded-xl p-4 overflow-auto max-h-96 whitespace-pre-wrap font-mono border border-white/5">
                            {result.content}
                          </pre>
                        )}

                        {result.type === 'list' && (
                          <div className="space-y-2 max-h-96 overflow-auto pr-1">
                            {result.content.map((q, i) => (
                              <div key={i} className="flex items-start gap-3 glass rounded-xl p-3">
                                <span className="text-xs font-mono text-brand-400 shrink-0 mt-0.5">{String(i+1).padStart(2,'0')}</span>
                                <p className="text-sm text-slate-300">{q}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {result.type === 'linkedin' && (
                          <div className="space-y-3 max-h-96 overflow-auto pr-1">
                            <div className="flex items-center justify-between glass rounded-xl p-4">
                              <span className="text-slate-300 text-sm font-medium">Profile Score</span>
                              <span className="text-2xl font-bold font-display" style={{ color: result.content.profile_score >= 70 ? '#00f5d4' : result.content.profile_score >= 50 ? '#3371ff' : '#ef4444' }}>
                                {result.content.profile_score}/100
                              </span>
                            </div>
                            {result.content.optimization_tips?.map((tip, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm text-slate-300 glass rounded-lg p-3">
                                <span className="text-brand-400 mt-0.5">•</span> {tip}
                              </div>
                            ))}
                            {result.content.improved_headline && (
                              <div className="glass rounded-xl p-4 border border-emerald-500/20">
                                <p className="text-xs text-emerald-400 mb-1 font-medium">Suggested Headline</p>
                                <p className="text-sm text-slate-200 italic">"{result.content.improved_headline}"</p>
                              </div>
                            )}
                          </div>
                        )}

                        {result.type === 'roadmap' && (
                          <div className="space-y-3 max-h-96 overflow-auto pr-1">
                            <div className="glass rounded-xl p-4 grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-slate-500 mb-1">Current Level</p>
                                <p className="text-brand-300 font-medium">{result.content.current_level}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 mb-1">Target</p>
                                <p className="text-emerald-300 font-medium">{result.content.target_level}</p>
                              </div>
                            </div>
                            {result.content.roadmap?.map((phase, i) => (
                              <div key={i} className="glass rounded-xl p-4">
                                <p className="text-brand-400 text-xs font-bold mb-2">{phase.phase}</p>
                                <ul className="space-y-1">
                                  {phase.actions?.map((a, j) => (
                                    <li key={j} className="text-sm text-slate-300 flex items-start gap-2">
                                      <span className="text-brand-400 mt-1">→</span> {a}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}

                        {result.type === 'grammar' && (
                          <div className="space-y-3 max-h-96 overflow-auto pr-1">
                            <p className="text-sm text-slate-400">{result.content.total_issues} issues found</p>
                            {result.content.grammar_issues?.length === 0 && (
                              <div className="glass rounded-xl p-4 border border-emerald-500/20">
                                <p className="text-emerald-300 text-sm flex items-center gap-2">
                                  <CheckCircle size={14} /> Great! No grammar issues detected.
                                </p>
                              </div>
                            )}
                            {result.content.grammar_issues?.map((issue, i) => (
                              <div key={i} className="glass rounded-xl p-4 border border-amber-500/20">
                                <p className="text-xs text-amber-400 mb-1">{issue.issue}</p>
                                <p className="text-sm text-slate-300 line-through opacity-60 mb-1">"{issue.excerpt}"</p>
                                <p className="text-sm text-emerald-300">✓ {issue.fix}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
