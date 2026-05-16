/**
 * HireSense-AI Pro — Root App Component
 * Sets up routing, context providers, and global notifications.
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import Upload from './pages/Upload'
import Report from './pages/Report'
import History from './pages/History'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import AdvancedFeatures from './pages/AdvancedFeatures'

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col font-body">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/"          element={<Home />} />
                <Route path="/about"     element={<About />} />
                <Route path="/contact"   element={<Contact />} />
                <Route path="/login"     element={<Login />} />
                <Route path="/register"  element={<Register />} />
                <Route path="/upload"    element={<Protected><Upload /></Protected>} />
                <Route path="/report/:id" element={<Protected><Report /></Protected>} />
                <Route path="/history"   element={<Protected><History /></Protected>} />
                <Route path="/advanced"  element={<Protected><AdvancedFeatures /></Protected>} />
              </Routes>
            </main>
            <Footer />
          </div>

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0f172a',
                color: '#e2e8f0',
                border: '1px solid rgba(51,113,255,0.2)',
                borderRadius: '12px',
                fontFamily: '"DM Sans", sans-serif',
              },
              success: { iconTheme: { primary: '#00f5d4', secondary: '#0f172a' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#0f172a' } },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
