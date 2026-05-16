/**
 * HireSense-AI — Navbar Component
 * Sticky top navigation with auth state awareness and theme toggle.
 */
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Sun, Moon, Menu, X, LogOut, History, Upload } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/advanced', label: 'AI Tools' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center shadow-lg shadow-brand-900/50 group-hover:shadow-brand-500/40 transition-shadow">
            <Brain size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg gradient-text">HireSense-AI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(link.to)
                  ? 'text-brand-400 bg-brand-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-brand-400 transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            <>
              <Link to="/upload" className="flex items-center gap-2 btn-secondary text-sm py-2 px-4">
                <Upload size={15} />
                Analyze
              </Link>
              <Link to="/history" className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-brand-400 transition-colors">
                <History size={16} />
              </Link>
              <button
                onClick={handleLogout}
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-300"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/5 px-4 pb-4 space-y-1"
          >
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <Link to="/upload" onClick={() => setOpen(false)} className="btn-primary text-sm text-center py-2.5">Analyze Resume</Link>
                  <Link to="/history" onClick={() => setOpen(false)} className="btn-secondary text-sm text-center py-2.5">History</Link>
                  <button onClick={handleLogout} className="text-sm text-red-400 py-2">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary text-sm text-center py-2.5">Login</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="btn-primary text-sm text-center py-2.5">Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
