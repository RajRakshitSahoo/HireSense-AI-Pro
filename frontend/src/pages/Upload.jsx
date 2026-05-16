/**
 * HireSense-AI — Resume Upload Dashboard
 * File upload, role selection, and analysis trigger.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ChevronDown, Info } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import DropZone from '../components/DropZone'
import AnalysisLoader from '../components/AnalysisLoader'

const ROLES = [
  'Software Developer', 'Frontend Developer', 'Backend Developer',
  'Data Analyst', 'Data Scientist', 'UI/UX Designer',
  'Product Manager', 'DevOps Engineer', 'Marketing Specialist', 'Business Analyst',
]

const TIPS = [
  'Use a clean, single-column layout for best ATS compatibility.',
  'Include relevant keywords from the job description.',
  'Quantify your achievements (e.g., "Increased efficiency by 30%").',
  'Keep your resume to 1-2 pages max.',
  'Use standard section headings like Experience, Education, Skills.',
]

export default function Upload() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [file, setFile] = useState(null)
  const [role, setRole] = useState(ROLES[0])
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Please upload your resume first.')
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('job_role', role)

    try {
      const { data } = await api.post('/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('Analysis complete! 🎉')
      navigate(`/report/${data.id}`, { state: { report: data } })
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.detail || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <AnalysisLoader />

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display font-bold text-4xl mb-3">
            Analyze Your <span className="gradient-text">Resume</span>
          </h1>
          <p className="text-slate-400">
            Upload your resume and select your target role. Our AI will analyze it in seconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Drop zone */}
            <div className="glass rounded-2xl p-6 border border-white/10">
              <h2 className="font-display font-semibold text-lg text-slate-100 mb-4">
                Upload Resume
              </h2>
              <DropZone onFileSelect={setFile} />
            </div>

            {/* Role selection */}
            <div className="glass rounded-2xl p-6 border border-white/10">
              <h2 className="font-display font-semibold text-lg text-slate-100 mb-4">
                Target Job Role
              </h2>
              <div className="relative">
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-slate-200 focus:outline-none focus:border-brand-500 focus:bg-brand-500/5 transition-all text-sm cursor-pointer"
                >
                  {ROLES.map(r => (
                    <option key={r} value={r} className="bg-slate-900">{r}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                The AI will tailor keyword analysis and suggestions based on this role.
              </p>
            </div>

            {/* Analyze button */}
            <motion.button
              onClick={handleAnalyze}
              disabled={!file}
              whileHover={{ scale: file ? 1.02 : 1 }}
              whileTap={{ scale: file ? 0.98 : 1 }}
              className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Sparkles size={20} />
              Analyze with AI
            </motion.button>
          </motion.div>

          {/* Tips sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Pro tips */}
            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Info size={16} className="text-brand-400" />
                <h3 className="font-display font-semibold text-slate-200">Pro Tips</h3>
              </div>
              <ul className="space-y-3">
                {TIPS.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-400 font-mono text-xs mt-0.5 shrink-0">{String(i+1).padStart(2,'0')}</span>
                    <span className="text-xs text-slate-400 leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What we analyze */}
            <div className="glass rounded-2xl p-6 border border-white/10">
              <h3 className="font-display font-semibold text-slate-200 mb-4">What We Analyze</h3>
              <div className="space-y-2">
                {[
                  'ATS Compatibility Score',
                  'Keyword Match Rate',
                  'Section Structure',
                  'Action Verb Strength',
                  'Grammar & Readability',
                  'Skills Gap Analysis',
                  'Professional Summary',
                  'Formatting Quality',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* User info */}
            <div className="glass rounded-2xl p-4 border border-brand-500/20 bg-brand-500/5">
              <p className="text-xs text-brand-300">
                Signed in as <span className="font-semibold">{user?.name}</span>.
                Your analysis will be saved to your history.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
