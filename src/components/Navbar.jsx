import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = ['Home', 'About', 'Skills', 'Projects', 'LeetCode', 'Contact']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive]     = useState('Home')
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const sections = links.map(l => document.getElementById(l.toLowerCase()))
      sections.forEach(sec => {
        if (sec && window.scrollY >= sec.offsetTop - 140) {
          setActive(sec.id.charAt(0).toUpperCase() + sec.id.slice(1))
        }
      })
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 900,
        padding: scrolled ? '0.9rem 5%' : '1.4rem 5%',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        background: scrolled ? 'rgba(5,5,8,0.92)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'padding 0.4s ease, background 0.4s ease, border-color 0.4s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        style={{ cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-light)' }}
        onClick={() => navTo('home')}
      >
        Anurag Dubey
      </motion.div>
      </motion.div>

      {/* Desktop links */}
      <ul style={{ display: 'flex', gap: '2.5rem', listStyle: 'none', margin: 0 }}
        className="nav-desktop">
        {links.map(link => (
          <li key={link} style={{ position: 'relative' }}>
            <motion.button
              onClick={() => navTo(link)}
              whileHover={{ color: '#f1f5f9' }}
              style={{
                background: 'none', border: 'none',
                color: active === link ? '#a78bfa' : '#64748b',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.88rem', fontWeight: 500,
                letterSpacing: '0.5px',
                transition: 'color 0.3s',
                padding: '4px 0',
              }}
            >
              {link}
            </motion.button>
            {active === link && (
              <motion.div
                layoutId="nav-indicator"
                style={{
                  position: 'absolute', bottom: -4, left: 0, right: 0,
                  height: 2, borderRadius: 2,
                  background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: '0 0 24px rgba(124,58,237,0.5)' }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navTo('contact')}
        className="nav-desktop"
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          border: 'none', color: '#fff',
          padding: '0.55rem 1.4rem', borderRadius: 50,
          fontSize: '0.85rem', fontWeight: 600,
        }}
      >
        Hire Me
      </motion.button>

      {/* Hamburger */}
      <button
        onClick={() => setOpen(o => !o)}
        className="hamburger-btn"
        style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', gap: 5, padding: 4 }}
        aria-label="Menu"
      >
        {[0,1,2].map(i => (
          <motion.span
            key={i}
            animate={{
              rotate: open ? (i === 0 ? 45 : i === 2 ? -45 : 0) : 0,
              y:      open ? (i === 0 ? 7  : i === 2 ? -7  : 0) : 0,
              opacity: open && i === 1 ? 0 : 1,
            }}
            style={{ display: 'block', width: 24, height: 2, background: '#e2e8f0', borderRadius: 2, transformOrigin: 'center' }}
          />
        ))}
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{   opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              background: 'rgba(5,5,8,0.97)', backdropFilter: 'blur(24px)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              padding: '1.5rem 5%', display: 'flex', flexDirection: 'column', gap: '1.2rem',
            }}
          >
            {links.map((link, i) => (
              <motion.button
                key={link}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => navTo(link)}
                style={{
                  background: 'none', border: 'none', textAlign: 'left',
                  color: active === link ? '#a78bfa' : '#94a3b8',
                  fontSize: '1.05rem', fontWeight: 600,
                }}
              >
                {link}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 769px) { .hamburger-btn { display: none !important; } }
        @media (max-width: 768px) { .nav-desktop { display: none !important; } .hamburger-btn { display: flex !important; } }
      `}</style>
    </motion.nav>
  )
}
