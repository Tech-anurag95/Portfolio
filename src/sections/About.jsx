import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const cards = [
  {
    icon: '🎓',
    title: 'Who I Am',
    body: "I'm Anurag Dubey, a third-year B.Tech undergraduate from Pune, Maharashtra. I am passionate about learning new technologies, including software engineering and data structures & algorithms.",
  },
  {
    icon: '💡',
    title: 'What I Do',
    body: 'I build responsive frontend interfaces using React and work with data analytics using Python, Pandas, and Excel. I enjoy turning raw data and ideas into clean, useful products.',
  },
  {
    icon: '🚀',
    title: 'What I Love',
    body: "I love exploring new technologies, solving problems with code, and constantly improving my skills. I am actively looking for freelancing opportunities to apply my skills to real-world projects.",
  },
]

const stats = [
  { value: 3,  suffix: '+', label: 'Projects Built' },
  { value: 3,  suffix: 'rd Year', label: 'B.Tech' },
  { value: 2,  suffix: '+', label: 'Tech Stacks' },
]

function AnimatedCount({ target, inView }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    let current = 0
    const steps = 60
    const increment = target / steps
    const t = setInterval(() => {
      current = Math.min(current + increment, target)
      setVal(Math.floor(current))
      if (current >= target) clearInterval(t)
    }, 1400 / steps)
    return () => clearInterval(t)
  }, [inView, target])
  return <>{val}</>
}

function StatItem({ value, suffix, label, delay }) {
  const [ref, inView] = useInView()
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ textAlign: 'center', padding: '0 1.5rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2 }}>
        <span style={{
          fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 900,
          background: 'linear-gradient(135deg, #a78bfa, #38bdf8)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          <AnimatedCount target={value} inView={inView} />
        </span>
        {suffix && <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-light)' }}>{suffix}</span>}
      </div>
      <p style={{ color: 'var(--muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 4 }}>{label}</p>
    </motion.div>
  )
}

function AboutCard({ card, delay }) {
  const [ref, inView] = useInView()
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '2rem', borderRadius: 20,
        background: hovered ? 'rgba(124,58,237,0.07)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hovered ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.06)'}`,
        backdropFilter: 'blur(20px)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.35), 0 0 0 1px rgba(124,58,237,0.1)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <div style={{
        width: 54, height: 54, borderRadius: 14, fontSize: '1.7rem',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.15))',
        border: '1px solid rgba(124,58,237,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '1.2rem',
      }}>
        {card.icon}
      </div>
      <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.75rem' }}>{card.title}</h3>
      <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: '0.92rem' }}>{card.body}</p>
    </motion.div>
  )
}

export default function About() {
  const [ref, inView] = useInView()

  return (
    <section id="about" className="section" style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,58,237,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container">
        <motion.div ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span className="section-label">Get to know me</span>
          <h2 className="section-title">About <span className="gradient-text">Me</span></h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
          {cards.map((card, i) => <AboutCard key={i} card={card} delay={i * 0.13} />)}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{
            display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 20, backdropFilter: 'blur(16px)',
            padding: '2.5rem', gap: '0.5rem',
          }}
        >
          {stats.map((s, i) => (
            <>
              <StatItem key={i} {...s} delay={0.5 + i * 0.1} />
              {i < stats.length - 1 && (
                <div key={`div-${i}`} style={{ width: 1, background: 'rgba(255,255,255,0.08)', alignSelf: 'stretch', margin: '0 0.5rem' }} />
              )}
            </>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
