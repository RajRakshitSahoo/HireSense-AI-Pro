/**
 * HireSense-AI — Register Page
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/register', form)
      login(data.access_token, data.user)
      toast.success(`Welcome to HireSense-AI, ${data.user.name}! 🎉`)
      navigate('/upload')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', Icon: User },
    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', Icon: Mail },
    { key: 'password', label: 'Password', type: showPass ? 'text' : 'password', placeholder: 'Min. 6 characters', Icon: Lock, toggle: true },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center mx-auto mb-4 shadow-xl shadow-brand-900/50">
            <Brain size={30} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-3xl gradient-text">Create Account</h1>
          <p className="text-slate-400 mt-2">Start optimizing your resume for free</p>
        </div>

        <div className="glass rounded-2xl p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map(({ key, label, type, placeholder, Icon, toggle }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
                <div className="relative">
                  <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    required
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:bg-brand-500/5 transition-all text-sm"
                  />
                  {toggle && (
                    <button
                      type="button"
                      onClick={() => setShowPass(s => !s)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-400 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
