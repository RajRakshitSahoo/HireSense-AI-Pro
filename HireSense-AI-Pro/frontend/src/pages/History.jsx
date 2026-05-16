/**
 * HireSense-AI — Analysis History Page
 * Lists all past resume analyses for the authenticated user.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { History, Trash2, FileText, ArrowRight, Plus } from 'lucide-react'
import api from '../utils/api'
import { getScoreColor, getScoreLabel, getScoreBg, formatDate } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    api.get('/api/resume/history')
      .then(res => setAnalyses(res.data))
      .catch(() => toast.error('Failed to load history.'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this analysis? This cannot be undone.')) return
    setDeleting(id)
    try {
      await api.delete(`/api/resume/history/${id}`)
      setAnalyses(prev => prev.filter(a => a.id !== id))
      toast.success('Analysis deleted.')
    } catch {
      toast.error('Failed to delete.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h1 className="font-display font-bold text-3xl gradient-text">Analysis History</h1>
            <p className="text-slate-400 text-sm mt-1">
              {analyses.length} {analyses.length === 1 ? 'analysis' : 'analyses'} saved
            </p>
          </div>
          <Link to="/upload" className="btn-primary flex items-center gap-2 text-sm py-2.5 px-4">
            <Plus size={15} /> New Analysis
          </Link>
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass rounded-2xl p-6 border border-white/10 shimmer h-24" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && analyses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
              <History size={36} className="text-slate-500" />
            </div>
            <h3 className="font-display font-semibold text-xl text-slate-300 mb-2">No Analyses Yet</h3>
            <p className="text-slate-500 mb-6">Upload your first resume to get started.</p>
            <Link to="/upload" className="btn-primary inline-flex items-center gap-2">
              <Plus size={16} /> Analyze My Resume
            </Link>
          </motion.div>
        )}

        {/* Analysis list */}
        <div className="space-y-4">
          <AnimatePresence>
            {analyses.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-5 border border-white/10 hover:border-brand-500/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  {/* File icon */}
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
                    <FileText size={20} className="text-brand-400" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-200 truncate">{item.filename}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400">{item.job_role}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400">{formatDate(item.created_at)}</span>
                    </div>
                  </div>

                  {/* Score badge */}
                  <div className="shrink-0 text-center">
                    <div
                      className="text-2xl font-display font-bold"
                      style={{ color: getScoreColor(item.ats_score) }}
                    >
                      {Math.round(item.ats_score)}
                    </div>
                    <div className={`text-xs px-2 py-0.5 rounded-full border mt-1 ${getScoreBg(item.ats_score)}`}>
                      {getScoreLabel(item.ats_score)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/report/${item.id}`}
                      className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 px-3 py-2 rounded-lg transition-colors"
                    >
                      View <ArrowRight size={12} />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                    >
                      {deleting === item.id
                        ? <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                        : <Trash2 size={14} />
                      }
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
