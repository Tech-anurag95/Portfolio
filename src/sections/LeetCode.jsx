import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const USERNAME = 'CodewithDubey'

// LeetCode public GraphQL API (no key needed)
const LEETCODE_API = 'https://leetcode-stats-api.herokuapp.com/' + USERNAME

// Fallback: direct LeetCode GraphQL
async function fetchLeetCodeStats() {
  try {
    const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${USERNAME}`)
    if (!res.ok) throw new Error('API failed')
    const data = await res.json()
    return data
  } catch {
    // fallback to alfa-leetcode-api
    const res = await fetch(`https://alfa-leetcode-api.onrender.com/${USERNAME}`)
    if (!res.ok) throw new Error('Fallback failed')
    return res.json()
  }
}

function CircleProgress({ value, max, color, size = 120, label, sublabel }) {
  const [ref, inView] = useInView()
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const progress = inView ? (value / max) * circumference : 0

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle cx={size/2} cy={size/2} r={radius}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
          {/* Progress */}
          <motion.circle cx={size/2} cy={size/2} r={radius}
            fill="none" stroke={color} strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color, lineHeight: 1 }}>{value}</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: 2 }}>/{max}</span>
        </div>
      </div>
      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{label}</span>
      <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{sublabel}</span>
    </div>
  )
}

function StatBox({ icon, value, label, delay, color = 'var(--primary-light)' }) {
  const [ref, inView] = useInView()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView || typeof value !== 'number') return
    let current = 0
    const steps = 50
    const increment = value / steps
    const t = setInterval(() => {
      current = Math.min(current + increment, value)
      setCount(Math.floor(current))
      if (current >= value) clearInterval(t)
    }, 1200 / steps)
    return () => clearInterval(t)
  }, [inView, value])

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: '1.4rem 1.2rem', borderRadius: 16, textAlign: 'center',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
        flex: 1, minWidth: 110,
      }}
    >
      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ fontSize: '1.6rem', fontWeight: 900, color, lineHeight: 1, marginBottom: '0.3rem' }}>
        {typeof value === 'number' ? count : value}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
    </motion.div>
  )
}

function HeatmapBar({ submissions, inView }) {
  if (!submissions) return null
  return (
    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      {Array.from({ length: 52 }).map((_, i) => {
        const intensity = Math.random() // placeholder until real calendar data
        return (
          <motion.div key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: i * 0.008, duration: 0.3 }}
            style={{
              width: 10, height: 10, borderRadius: 2,
              background: intensity > 0.7 ? '#7c3aed' : intensity > 0.4 ? '#5b21b6' : intensity > 0.1 ? '#2e1065' : 'rgba(255,255,255,0.05)',
            }}
          />
        )
      })}
    </div>
  )
}

export default function LeetCode() {
  const [ref, inView] = useInView()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchLeetCodeStats()
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  const easy   = stats?.easySolved   ?? stats?.easy_questions_solved   ?? 0
  const medium = stats?.mediumSolved ?? stats?.medium_questions_solved ?? 0
  const hard   = stats?.hardSolved   ?? stats?.hard_questions_solved   ?? 0
  const total  = stats?.totalSolved  ?? stats?.total_questions_solved  ?? (easy + medium + hard)
  const rank   = stats?.ranking      ?? stats?.rank                    ?? '431,921'
  const streak = stats?.streak       ?? 29
  const activeDays = stats?.totalActiveDays ?? 38
  const submissions = stats?.submissionCalendar ?? null

  return (
    <section id="leetcode" className="section" style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(124,58,237,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container">
        <motion.div ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span className="section-label">Competitive Coding</span>
          <h2 className="section-title">
            <span className="gradient-text">LeetCode</span> Stats
          </h2>
          <p style={{ color: 'var(--muted)', marginTop: '0.75rem', fontSize: '0.9rem' }}>
            Live data from{' '}
            <a href="https://leetcode.com/u/CodewithDubey" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--primary-light)', textDecoration: 'none', fontFamily: "'Fira Code', monospace" }}>
              @CodewithDubey
            </a>
          </p>
        </motion.div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ width: 40, height: 40, border: '3px solid rgba(124,58,237,0.2)', borderTopColor: '#7c3aed', borderRadius: '50%', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--muted)' }}>Fetching live stats...</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
            <p>⚠️ Could not load live stats. Showing last known data.</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Main stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem', justifyContent: 'center' }}
            >
              <StatBox icon="🏆" value={total}       label="Total Solved"   delay={0.1} color="#a78bfa" />
              <StatBox icon="🔥" value={streak}      label="Max Streak"     delay={0.2} color="#f97316" />
              <StatBox icon="📅" value={activeDays}  label="Active Days"    delay={0.3} color="#06b6d4" />
              <StatBox icon="🌍" value={`#${typeof rank === 'number' ? rank.toLocaleString() : rank}`} label="Global Rank" delay={0.4} color="#f0abfc" />
            </motion.div>

            {/* Difficulty circles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{
                display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap',
                padding: '2.5rem', borderRadius: 24,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(20px)',
                marginBottom: '2rem',
              }}
            >
              <CircleProgress value={easy}   max={958}  color="#22c55e" label="Easy"   sublabel={`${easy}/958`}   />
              <CircleProgress value={medium} max={2095} color="#f59e0b" label="Medium" sublabel={`${medium}/2095`} />
              <CircleProgress value={hard}   max={960}  color="#ef4444" label="Hard"   sublabel={`${hard}/960`}   />

              {/* Center total */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, background: 'linear-gradient(135deg, #a78bfa, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>
                  {total}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Problems Solved</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: "'Fira Code', monospace" }}>out of 4013</div>
              </div>
            </motion.div>

            {/* View profile CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{ textAlign: 'center' }}
            >
              <motion.a
                href="https://leetcode.com/u/CodewithDubey"
                target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.04, boxShadow: '0 6px 24px rgba(250,173,20,0.3)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.75rem 2rem', borderRadius: 50,
                  background: 'linear-gradient(135deg, rgba(250,173,20,0.15), rgba(250,173,20,0.05))',
                  border: '1px solid rgba(250,173,20,0.4)',
                  color: '#faad14', fontSize: '0.9rem', fontWeight: 700,
                  textDecoration: 'none', transition: 'all 0.3s',
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
