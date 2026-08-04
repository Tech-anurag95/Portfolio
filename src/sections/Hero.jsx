import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import ParticleField from '../components/ParticleField'
import { FiGithub, FiLinkedin, FiMail, FiArrowDown, FiCode } from 'react-icons/fi'

const phrases = [
  'Frontend Developer',
  'Data Analytics',
  'React Enthusiast',
  'Python Developer',
  'Problem Solver',
]

function TypedText() {
  const [text, setText]     = useState('')
  const [phase, setPhase]   = useState(0)
  const [phraseIdx, setIdx] = useState(0)

  useEffect(() => {
    const current = phrases[phraseIdx]
    let timer
    if (phase === 0) {
      if (text.length < current.length) {
        timer = setTimeout(() => setText(current.slice(0, text.length + 1)), 80)
      } else {
        timer = setTimeout(() => setPhase(1), 1800)
      }
    } else if (phase === 1) {
      timer = setTimeout(() => setPhase(2), 200)
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => setText(t => t.slice(0, -1)), 45)
      } else {
        setIdx(i => (i + 1) % phrases.length)
        setPhase(0)
      }
    }
    return () => clearTimeout(timer)
  }, [text, phase, phraseIdx])

  return (
    <span style={{ fontFamily: "'Fira Code', monospace", color: 'var(--accent)', fontSize: 'clamp(1rem, 2.5vw, 1.35rem)' }}>
      {text}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.7, ease: 'steps(1)' }}
        style={{ color: 'var(--primary-light)' }}
      >|</motion.span>
    </span>
  )
}

function FloatingCard({ children, style, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale:   { delay, duration: 0.5 },
        y: { delay: delay + 0.5, duration: 3, repeat: Infinity, ease: 'easeInOut' },
      }}
      style={{
        position: 'absolute',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(16px)',
        borderRadius: 14, padding: '0.55rem 1.1rem',
        fontSize: '0.8rem', fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        whiteSpace: 'nowrap', color: 'var(--text)',
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}

export default function Hero() {
  const ref    = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-200, 200], [8, -8])
  const rotateY = useTransform(mouseX, [-200, 200], [-8, 8])

  const handleMouse = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(e.clientX - rect.left - rect.width  / 2)
    mouseY.set(e.clientY - rect.top  - rect.height / 2)
  }

  const scrollDown = () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="home" style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <ParticleField />

      {/* Gradient blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <motion.div animate={{ x: [0,40,0], y: [0,-30,0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)', top: '-20%', left: '-15%' }} />
        <motion.div animate={{ x: [0,-30,0], y: [0,40,0] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', bottom: '-10%', right: '-10%' }} />
      </div>

      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '4rem', paddingTop: '5rem', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>

        {/* Left content */}
        <div style={{ flex: 1, minWidth: 300 }}>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: 50, padding: '0.4rem 1rem',
              fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 600, marginBottom: '1.5rem',
            }}>
              <motion.span animate={{ scale: [1,1.3,1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              Available for Freelancing
            </span>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ color: 'var(--muted)', fontSize: '1.05rem', marginBottom: '0.5rem', fontWeight: 500 }}>
            Hi there, I'm
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.22,1,0.36,1] }}
            style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: '1rem' }}>
            <span style={{ background: 'linear-gradient(135deg, #f1f5f9 30%, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Anurag
            </span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #a78bfa, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Dubey
            </span>
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            style={{ marginBottom: '1.5rem', height: '2rem' }}>
            <TypedText />
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            style={{ color: 'var(--muted)', lineHeight: 1.85, maxWidth: 480, marginBottom: '2.5rem', fontSize: '1rem' }}>
            A third-year B.Tech undergraduate from Pune, passionate about frontend development and data analytics. Always exploring new technologies, including software engineering and DSA.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 8px 32px rgba(124,58,237,0.45)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', border: 'none',
                color: '#fff', padding: '0.85rem 2rem', borderRadius: 50,
                fontSize: '0.95rem', fontWeight: 700,
              }}
            >View My Work →</motion.button>
            <motion.button
              whileHover={{ scale: 1.05, borderColor: '#a78bfa', color: '#a78bfa' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'transparent', border: '1.5px solid rgba(124,58,237,0.5)',
                color: 'var(--primary-light)', padding: '0.85rem 2rem', borderRadius: 50,
                fontSize: '0.95rem', fontWeight: 700, transition: 'all 0.3s',
              }}
            >Hire Me</motion.button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            style={{ display: 'flex', gap: '1rem' }}>
            {[
              { Icon: FiGithub,   href: 'https://github.com/Tech-anurag95',           label: 'GitHub' },
              { Icon: FiLinkedin, href: 'https://linkedin.com/in/anuragdubey1',        label: 'LinkedIn' },
              { Icon: FiCode,     href: 'https://leetcode.com/u/CodewithDubey',        label: 'LeetCode' },
              { Icon: FiMail,     href: 'mailto:dubeyanurag7991@gmail.com',            label: 'Email' },
            ].map(({ Icon, href, label }) => (
              <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                whileHover={{ y: -3, color: '#a78bfa', borderColor: '#7c3aed' }}
                style={{
                  width: 42, height: 42, borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.03)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--muted)', fontSize: '1.1rem', transition: 'all 0.3s',
                }}
              ><Icon /></motion.a>
            ))}
          </motion.div>
        </div>

        {/* Right — 3D tilt avatar */}
        <motion.div
          ref={ref}
          onMouseMove={handleMouse}
          onMouseLeave={() => { mouseX.set(0); mouseY.set(0) }}
          style={{ rotateX, rotateY, perspective: 800, flex: '0 0 auto' }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ position: 'relative', width: 300, height: 300 }}>
            {/* Spinning glow ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', inset: -6, borderRadius: '50%',
                background: 'conic-gradient(from 0deg, #7c3aed, #06b6d4, #f0abfc, #7c3aed)',
                padding: 3,
              }}
            >
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg)' }} />
            </motion.div>

            {/* Avatar */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: '5rem', fontWeight: 900,
                background: 'linear-gradient(135deg, #a78bfa, #38bdf8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                userSelect: 'none',
              }}>AD</div>
            </div>

            <FloatingCard style={{ top: -10, right: -50 }} delay={0.8}>
              <span>⚡</span> Frontend Dev
            </FloatingCard>
            <FloatingCard style={{ bottom: 20, left: -65 }} delay={1.0}>
              <span>📊</span> Data Analytics
            </FloatingCard>
            <FloatingCard style={{ bottom: -15, right: -40 }} delay={1.2}>
              <span>🎓</span> B.Tech 3rd Year
            </FloatingCard>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollDown}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
          background: 'none', border: 'none', color: 'var(--muted)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
          fontSize: '0.75rem', letterSpacing: 2, textTransform: 'uppercase', zIndex: 1,
        }}
      >
        scroll <FiArrowDown style={{ fontSize: '1rem' }} />
      </motion.button>
    </section>
  )
}
