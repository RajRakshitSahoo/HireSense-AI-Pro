/**
 * HireSense-AI — Contact Page
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Send, MapPin, Github, Twitter } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate form submission (integrate with your email service)
    await new Promise(r => setTimeout(r, 1500))
    toast.success('Message sent! We\'ll get back to you soon. 🎉')
    setForm({ name: '', email: '', subject: '', message: '' })
    setLoading(false)
  }

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <h1 className="font-display font-extrabold text-5xl gradient-text mb-4">Get In Touch</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Have questions, feedback, or want to collaborate? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-5"
          >
            {[
              { icon: Mail, label: 'Email', value: 'hello@hiresense.ai', href: 'mailto:hello@hiresense.ai' },
              { icon: Github, label: 'GitHub', value: 'github.com/hiresense-ai', href: '#' },
              { icon: Twitter, label: 'Twitter', value: '@HireSenseAI', href: '#' },
              { icon: MapPin, label: 'Location', value: 'Remote · Worldwide', href: null },
            ].map(({ icon: Icon, label, value, href }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="glass rounded-xl p-4 border border-white/10 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-brand-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm text-slate-200 hover:text-brand-400 transition-colors">{value}</a>
                  ) : (
                    <p className="text-sm text-slate-200">{value}</p>
                  )}
                </div>
              </motion.div>
            ))}

            <div className="glass rounded-xl p-5 border border-brand-500/20 bg-brand-500/5">
              <MessageSquare size={18} className="text-brand-400 mb-2" />
              <p className="text-sm text-slate-300 leading-relaxed">
                We typically respond within <strong className="text-brand-300">24 hours</strong>. For urgent issues, please include "URGENT" in your subject line.
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="glass rounded-2xl p-8 border border-white/10">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="How can we help?"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us more about your question or feedback..."
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-all text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Send size={16} /> Send Message</>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
