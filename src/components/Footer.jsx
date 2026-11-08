import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiCode } from 'react-icons/fi'

const socials = [
  { Icon: FiGithub,   href: 'https://github.com/Tech-anurag95',     label: 'GitHub' },
  { Icon: FiLinkedin, href: 'https://linkedin.com/in/anuragdubey1', label: 'LinkedIn' },
  { Icon: FiCode,     href: 'https://leetcode.com/u/CodewithDubey', label: 'LeetCode' },
  { Icon: FiMail,     href: 'mailto:dubeyanurag7991@gmail.com',     label: 'Email' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '3rem 5%',
      position: 'relative', zIndex: 1,
    }}>
      {/* Main footer content */}
      <div style={{ maxWidth: 1140, margin: '0 auto', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
          
          {/* Brand and tagline */}
          <div>
            <h3 style={{ color: 'var(--primary-light)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              Anurag Dubey
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', maxWidth: 280 }}>
              Crafting production-grade software with React, Python, and precision
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600, marginBottom: '0.8rem' }}>
              Connect
            </p>
            <div style={{ display: 'flex', gap: '1.2rem' }}>
              {socials.map(({ Icon, href, label }) => (
                <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  whileHover={{ y: -2, color: '#a78bfa' }}
                  style={{ color: '#64748b', fontSize: '1rem', transition: 'color 0.2s' }}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: '1.5rem' }} />
      </div>

      {/* Copyright */}
      <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ color: '#475569', fontSize: '0.8rem' }}>
          © {year} Anurag Dubey. All rights reserved.
        </p>
        <p style={{ color: '#475569', fontSize: '0.8rem' }}>
          Built with React + Framer Motion
        </p>
      </div>
    </footer>
  )
}
