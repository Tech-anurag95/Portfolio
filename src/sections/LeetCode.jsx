import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const USERNAME = 'CodewithDubey'

// Fallback data (your real stats as of Aug 2026)
const FALLBACK = {
  totalSolved: 327,
  easySolved: 267,
  mediumSolved: 57,
  hardSolved: 3,
  submissions: 564,
  acceptanceRate: 64.5,
  streak: 29,
  activeDays: 38,
  ranking: 431921,
}

async function fetchStats() {
  try {
    // Call our own Vercel serverless proxy (no CORS issues)
    const res = await fetch('/api/leetcode')
    if (!res.ok) throw new Error('Proxy failed')
    const data = await res.json()
    if (data.error || !data.totalSolved) throw new Error('Bad data')

    return {
      totalSolved:    data.totalSolved,
      easySolved:     data.easySolved,
      mediumSolved:   data.mediumSolved,
      hardSolved:     data.hardSolved,
      submissions:    data.totalSubmissions,
      acceptanceRate: data.totalSolved && data.totalSubmissions
        ? Math.round((data.totalSolved / data.totalSubmissions) * 100 * 10) / 10
        : FALLBACK.acceptanceRate,
      streak:      FALLBACK.streak,
      activeDays:  FALLBACK.activeDays,
      ranking:     data.ranking || FALLBACK.ranking,
    }
  } catch {
    return FALLBACK
  }
}

function AnimatedNumber({ value, inView, decimals = 0 }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!inView) return
    let current = 0
    const steps = 60
    const t = setInterval(() => {
      current = Math.min(current + value / steps, value)
      setDisplay(decimals ? Math.round(current * 10) / 10 : Math.floor(current))
      if (current >= value) clearInterval(t)
    }, 1400 / steps)
    return () => clearInterval(t)
  }, [inView, value])
  return <>{display}</>
}

function CircleProgress({ solved, total, color, label, delay, inView }) {
  const size = 130
  const radius = (size - 18) / 2
  const circumference = 2 * Math.PI * radius
  const offset = inView ? circumference - (solved / total) * circumference : circumference

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={radius}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={9} />
          <motion.circle cx={size/2} cy={size/2} r={radius}
            fill="none" stroke={color} strokeWidth={9}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay }}
            style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color, lineHeight: 1 }}>
            {inView ? <AnimatedNumber value={solved} inView={inView} /> : 0}
          </span>
          <span style={{ fontSize: '0.62rem', color: 'var(--muted)', marginTop: 2 }}>/{total}</span>
        </div>
      </div>
      <span style={{ fontSize: '0.85rem', fontWeight: 700, color }}>{label}</span>
    </div>
  )
}

function StatCard({ icon, value, suffix, label, color, delay }) {
  const [ref, inView] = useInView()
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, borderColor: `${color}40` }}
      style={{
        padding: '1.5rem 1.2rem', borderRadius: 18, textAlign: 'center',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
        flex: 1, minWidth: 120,
        transition: 'all 0.3s',
      }}
    >
      <div style={{ fontSize: '1.6rem', marginBottom: '0.6rem' }}>{icon}</div>
      <div style={{ fontSize: '1.7rem', fontWeight: 900, color, lineHeight: 1, marginBottom: '0.3rem' }}>
        {typeof value === 'number'
          ? <>{inView ? <AnimatedNumber value={value} inView={inView} /> : 0}{suffix}</>
          : value}
      </div>
      <div style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.5 }}>{label}</div>
    </motion.div>
  )
}

export default function LeetCode() {
  const [ref, inView] = useInView()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats().then(data => { setStats(data); setLoading(false) })
  }, [])

  const s = stats ?? FALLBACK

  return (
    <section id="leetcode" className="section" style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(250,173,20,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container">
        {/* Header */}
        <motion.div ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <span className="section-label">Competitive Coding</span>
          <h2 className="section-title">
            <span className="gradient-text">LeetCode</span> Stats
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginTop: '0.75rem' }}>
            <motion.span animate={{ scale: [1,1.3,1] }} transition={{ repeat: Infinity, duration: 2 }}
              style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            <span style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
              Live data ·{' '}
              <a href="https://leetcode.com/u/CodewithDubey" target="_blank" rel="noopener noreferrer"
                style={{ color: '#faad14', fontFamily: "'Fira Code', monospace", textDecoration: 'none' }}>
                @CodewithDubey
              </a>
            </span>
          </div>
        </motion.div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ width: 36, height: 36, border: '3px solid rgba(250,173,20,0.2)', borderTopColor: '#faad14', borderRadius: '50%', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Fetching live stats...</p>
          </div>
        ) : (
          <>
            {/* Difficulty rings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                gap: '3rem', flexWrap: 'wrap',
                padding: '2.5rem 2rem', borderRadius: 24,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(20px)',
                marginBottom: '1.5rem',
              }}
            >
              <CircleProgress solved={s.easySolved}   total={958}  color="#22c55e" label="Easy"   delay={0.2} inView={inView} />
              <CircleProgress solved={s.mediumSolved} total={2095} color="#f59e0b" label="Medium" delay={0.3} inView={inView} />
              <CircleProgress solved={s.hardSolved}   total={960}  color="#ef4444" label="Hard"   delay={0.4} inView={inView} />

              {/* Total */}
              <div style={{ textAlign: 'center', padding: '0 1rem' }}>
                <div style={{
                  fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1,
                  background: 'linear-gradient(135deg, #a78bfa, #38bdf8)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {inView ? <AnimatedNumber value={s.totalSolved} inView={inView} /> : 0}
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>Problems Solved</div>
                <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', fontFamily: "'Fira Code', monospace" }}>out of 4,013</div>
              </div>
            </motion.div>

            {/* Stat cards row */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <StatCard icon="📨" value={s.submissions}    suffix=""   label="Total Submissions"  color="#a78bfa" delay={0.1} />
              <StatCard icon="✅" value={s.acceptanceRate} suffix="%"  label="Acceptance Rate"    color="#22c55e" delay={0.2} />
              <StatCard icon="🔥" value={s.streak}         suffix=""   label="Max Streak"         color="#f97316" delay={0.3} />
              <StatCard icon="📅" value={s.activeDays}     suffix=""   label="Active Days"        color="#06b6d4" delay={0.4} />
              <StatCard icon="🌍" value={`#${s.ranking.toLocaleString()}`} suffix="" label="Global Rank" color="#f0abfc" delay={0.5} />
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              style={{ textAlign: 'center' }}
            >
              <motion.a
                href="https://leetcode.com/u/CodewithDubey"
                target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.04, boxShadow: '0 8px 28px rgba(250,173,20,0.3)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.75rem 2rem', borderRadius: 50,
                  background: 'linear-gradient(135deg, rgba(250,173,20,0.12), rgba(250,173,20,0.04))',
                  border: '1px solid rgba(250,173,20,0.4)',
                  color: '#faad14', fontSize: '0.9rem', fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                🟡 View Full LeetCode Profile
              </motion.a>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}
