/**
 * HireSense-AI — Footer Component
 */
import { Link } from 'react-router-dom'
import { Brain, Github, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center">
                <Brain size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-lg gradient-text">HireSense-AI</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              AI-powered resume analyzer that helps job seekers optimize their resumes for ATS systems and land more interviews.
            </p>
            <div className="flex gap-3 mt-4">
              {[
                { Icon: Github, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Linkedin, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-brand-400 transition-colors">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-display font-semibold text-sm text-slate-300 mb-3">Product</h4>
            <ul className="space-y-2">
              {[
                { to: '/upload', label: 'Analyze Resume' },
                { to: '/history', label: 'History' },
                { to: '/about', label: 'About' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-400 hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-sm text-slate-300 mb-3">Support</h4>
            <ul className="space-y-2">
              {[
                { to: '/contact', label: 'Contact Us' },
                { to: '/#faq', label: 'FAQ' },
                { to: '#', label: 'Privacy Policy' },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="text-sm text-slate-400 hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} HireSense-AI. Built for job seekers everywhere.
          </p>
          <p className="text-xs text-slate-500">
            Powered by <span className="text-brand-400">Claude · Gemini · GPT-4</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
