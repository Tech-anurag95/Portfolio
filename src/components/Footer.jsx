import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiCode } from 'react-icons/fi'

const socials = [
  { Icon: FiGithub,   href: 'https://github.com/Tech-anurag95',     label: 'GitHub' },
  { Icon: FiLinkedin, href: 'https://linkedin.com/in/anuragdubey1', label: 'LinkedIn' },
  { Icon: FiCode,     href: 'https://leetcode.com/u/CodewithDubey', label: 'LeetCode' },
  { Icon: FiMail,     href: 'mailto:dubeyanurag7991@gmail.com',     label: 'Email' },
]

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '2.5rem 5%',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem',
      position: 'relative', zIndex: 1,
    }}>
      <div style={{
        fontFamily: "'Fira Code', monospace", fontWeight: 700, fontSize: '1.2rem',
        background: 'linear-gradient(135deg, #a78bfa, #38bdf8)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        fontVariantLigatures: 'none', letterSpacing: '-1px',
      }}>
        &lt;AD/&gt;
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {socials.map(({ Icon, href, label }) => (
          <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
            whileHover={{ y: -3, color: '#a78bfa' }}
            style={{ color: '#64748b', fontSize: '1.1rem', transition: 'color 0.2s' }}
          >
            <Icon />
          </motion.a>
        ))}
      </div>
      <p style={{ color: '#475569', fontSize: '0.82rem' }}>
        © 2026 Anurag Dubey — Crafted with ❤️ and React
      </p>
    </footer>
  )
}
