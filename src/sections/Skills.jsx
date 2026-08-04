import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const categories = [
  {
    icon: '🖥️', label: 'Frontend',
    skills: ['React', 'HTML5', 'CSS3', 'JavaScript'],
    color: '#7c3aed',
  },
  {
    icon: '📊', label: 'Data Analytics',
    skills: ['Python', 'Pandas', 'Excel', 'SQLite / SQL'],
    color: '#06b6d4',
  },
  {
    icon: '🛠️', label: 'Tools & Others',
    skills: ['Git', 'GitHub', 'DSA (Python)', 'VS Code'],
    color: '#f0abfc',
  },
]

const techStack = [
  'React', 'HTML5', 'CSS3', 'JavaScript',
  'Python', 'Pandas', 'SQLite', 'Excel',
  'Git', 'GitHub', 'VS Code', 'DSA',
]

function SkillPill({ name, color }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.04, x: 4 }}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.7rem',
        padding: '0.65rem 1rem', borderRadius: 12,
        background: hovered ? `${color}12` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? `${color}40` : 'rgba(255,255,255,0.07)'}`,
        transition: 'background 0.25s, border-color 0.25s',
        cursor: 'default',
      }}
    >
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: color,
        boxShadow: `0 0 8px ${color}`,
        flexShrink: 0,
      }} />
      <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text)' }}>{name}</span>
    </motion.div>
  )
}

function SkillCard({ cat, cardDelay }) {
  const [ref, inView] = useInView()
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: cardDelay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '2rem', borderRadius: 20,
        background: hovered ? `${cat.color}07` : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hovered ? `${cat.color}40` : 'rgba(255,255,255,0.06)'}`,
        backdropFilter: 'blur(20px)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? `0 20px 50px rgba(0,0,0,0.3), 0 0 30px ${cat.color}15` : 'none',
        transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', color: cat.color }}>{cat.label}</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {cat.skills.map(skill => (
          <SkillPill key={skill} name={skill} color={cat.color} />
        ))}
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const [ref, inView] = useInView()

  return (
    <section id="skills" className="section" style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(6,182,212,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container">
        <motion.div ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span className="section-label">What I work with</span>
          <h2 className="section-title">My <span className="gradient-text">Skills</span></h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
          {categories.map((cat, i) => (
            <SkillCard key={i} cat={cat} cardDelay={i * 0.12} />
          ))}
        </div>

        {/* Tech pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: 2, fontFamily: "'Fira Code', monospace" }}>
            — Tech Stack —
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem', justifyContent: 'center' }}>
            {techStack.map((tech, i) => (
              <motion.span key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.6 + i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.1, borderColor: 'rgba(124,58,237,0.6)', color: '#a78bfa', y: -2 }}
                style={{
                  padding: '0.4rem 1rem', borderRadius: 50,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: '0.82rem', fontWeight: 500, color: 'var(--muted)',
                  transition: 'all 0.25s', cursor: 'default',
                }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
