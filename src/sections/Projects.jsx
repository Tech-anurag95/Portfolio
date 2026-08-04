import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { FiGithub, FiExternalLink } from 'react-icons/fi'

const projects = [
  {
    id: 1,
    title: 'Blood Donation',
    desc: 'A blood donation platform connecting donors with those in need. Features donor registration, blood request management, and database integration for efficient tracking.',
    tech: ['React', 'Python', 'SQLite', 'Pandas', 'HTML'],
    icon: '🩸',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    featured: true,
    category: 'fullstack',
    github: 'https://github.com/Tech-anurag95/Blooddonation',
  },
  {
    id: 2,
    title: 'Daily Commute',
    desc: 'Student commute management app helping students find rides from college to home. Includes ride sharing, route optimization, and user matching features.',
    tech: ['React', 'Python', 'SQLite', 'Pandas', 'HTML'],
    icon: '🚗',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    featured: false,
    category: 'fullstack',
  },
  {
    id: 3,
    title: 'Mess Manager',
    desc: 'Mess management system helping mess owners maintain member records, track attendance, manage billing, and generate monthly reports efficiently.',
    tech: ['React', 'Python', 'SQLite', 'Pandas', 'HTML'],
    icon: '🍽️',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    featured: false,
    category: 'fullstack',
  },
]

const filters = ['All', 'Fullstack', 'Frontend', 'Data']

function ProjectCard({ project, delay }) {
  const [ref, inView] = useInView()
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      layout
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 20, overflow: 'hidden',
        background: hovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
        backdropFilter: 'blur(20px)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: hovered ? '0 24px 60px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.2)',
        transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
        position: 'relative',
      }}
    >
      <div style={{ height: 3, background: project.gradient }} />

      {project.featured && (
        <div style={{
          position: 'absolute', top: 16, right: 16, zIndex: 1,
          background: project.gradient, color: '#fff',
          fontSize: '0.68rem', fontWeight: 700,
          padding: '0.25rem 0.7rem', borderRadius: 50,
          textTransform: 'uppercase', letterSpacing: 1,
        }}>★ Featured</div>
      )}

      <div style={{ padding: '1.6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, fontSize: '1.5rem',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {project.icon}
          </div>
          <div style={{ display: 'flex', gap: '0.7rem' }}>
            {project.github && (
              <motion.a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                whileHover={{ y: -2, color: '#a78bfa' }}
                style={{ color: 'var(--muted)', fontSize: '1rem', transition: 'color 0.2s' }}
              ><FiGithub /></motion.a>
            )}
            {project.live && (
              <motion.a href={project.live} target="_blank" rel="noopener noreferrer" aria-label="Live"
                whileHover={{ y: -2, color: '#a78bfa' }}
                style={{ color: 'var(--muted)', fontSize: '1rem', transition: 'color 0.2s' }}
              ><FiExternalLink /></motion.a>
            )}
          </div>
        </div>

        <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.6rem' }}>{project.title}</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.75, marginBottom: '1.2rem' }}>{project.desc}</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {project.tech.map(t => (
            <span key={t} style={{
              padding: '0.25rem 0.7rem', borderRadius: 50,
              background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)',
              color: '#67e8f9', fontSize: '0.75rem', fontWeight: 500,
            }}>{t}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const [ref, inView] = useInView()
  const [filter, setFilter] = useState('All')

  const filtered = projects.filter(p =>
    filter === 'All' ? true : p.category === filter.toLowerCase()
  )

  return (
    <section id="projects" className="section" style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(124,58,237,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container">
        <motion.div ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <span className="section-label">Things I've built</span>
          <h2 className="section-title">My <span className="gradient-text">Projects</span></h2>
        </motion.div>

        <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <AnimatePresence>
            {filtered.map((p, i) => (
              <ProjectCard key={p.id} project={p} delay={i * 0.08} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
