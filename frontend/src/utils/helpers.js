/**
 * HireSense-AI — Score Utility Helpers
 */

export function getScoreColor(score) {
  if (score >= 80) return '#00f5d4'      // cyan — excellent
  if (score >= 60) return '#3371ff'      // brand blue — good
  if (score >= 40) return '#f59e0b'      // amber — fair
  return '#ef4444'                        // red — poor
}

export function getScoreLabel(score) {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Needs Work'
}

export function getScoreBg(score) {
  if (score >= 80) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  if (score >= 60) return 'bg-brand-500/20 text-brand-300 border-brand-500/30'
  if (score >= 40) return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  return 'bg-red-500/20 text-red-300 border-red-500/30'
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}
