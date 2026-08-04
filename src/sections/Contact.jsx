import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { FiMail, FiMapPin, FiSend, FiGithub, FiLinkedin, FiCode } from 'react-icons/fi'
import emailjs from '@emailjs/browser'

// ─── EmailJS config ───────────────────────────────────────────────
// 1. Sign up free at https://www.emailjs.com
// 2. Create an Email Service (Gmail) → copy Service ID below
// 3. Create an Email Template → copy Template ID below
//    Template variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
// 4. Go to Account → API Keys → copy your Public Key below
const EMAILJS_SERVICE_ID  = 'service_204oypj'
const EMAILJS_TEMPLATE_ID = 'template_yx6f69j'
const EMAILJS_PUBLIC_KEY  = 'KkiI4efpPbeJ6pupD'
// ──────────────────────────────────────────────────────────────────

export default function Contact() {
  const [ref, inView] = useInView()
  const formRef = useRef(null)
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError]   = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // If EmailJS is not configured yet, show a helpful message
    if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID') {
      setError('EmailJS is not configured yet. See the setup guide below.')
      return
    }

    setStatus('sending')
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: EMAILJS_PUBLIC_KEY }
      )
      setStatus('sent')
      setTimeout(() => {
        setStatus('idle')
        setForm({ name: '', email: '', subject: '', message: '' })
      }, 3000)
    } catch (err) {
      setStatus('idle')
      setError('Failed to send. Please try again or email directly.')
    }
  }

  return (
    <section id="contact" className="section" style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(6,182,212,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container">
        <motion.div ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span className="section-label">Get in touch</span>
          <h2 className="section-title">Contact <span className="gradient-text">Me</span></h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '3rem', alignItems: 'start' }}>

          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1rem' }}>Let's work together</h3>
            <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
              I'm actively looking for freelancing opportunities. Whether you have a project in mind or just want to say hi — my inbox is always open!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2.5rem' }}>
              {[
                { Icon: FiMail,   label: 'Email',    value: 'dubeyanurag7991@gmail.com' },
                { Icon: FiMapPin, label: 'Location', value: 'Pune, Maharashtra 🇮🇳' },
                { Icon: FiSend,   label: 'Status',   value: '✅ Available for Freelancing', green: true },
              ].map(({ Icon, label, value, green }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.15))',
                    border: '1px solid rgba(124,58,237,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--primary-light)', fontSize: '1rem',
                  }}>
                    <Icon />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2 }}>{label}</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 500, color: green ? '#4ade80' : 'var(--text)' }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.8rem' }}>
              {[
                { Icon: FiGithub,   href: 'https://github.com/Tech-anurag95',     label: 'GitHub' },
                { Icon: FiLinkedin, href: 'https://linkedin.com/in/anuragdubey1', label: 'LinkedIn' },
                { Icon: FiCode,     href: 'https://leetcode.com/u/CodewithDubey', label: 'LeetCode' },
                { Icon: FiMail,     href: 'mailto:dubeyanurag7991@gmail.com',     label: 'Email' },
              ].map(({ Icon, href, label }) => (
                <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  whileHover={{ y: -3, borderColor: 'rgba(124,58,237,0.5)', color: '#a78bfa' }}
                  style={{
                    width: 44, height: 44, borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.02)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--muted)', fontSize: '1.1rem', transition: 'all 0.3s',
                  }}
                ><Icon /></motion.a>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.form onSubmit={handleSubmit} ref={formRef}
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              padding: '2.5rem', borderRadius: 24,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
              <FormField label="Name"  name="name"    type="text"  value={form.name}    onChange={handleChange} placeholder="John Doe" />
              <FormField label="Email" name="email"   type="email" value={form.email}   onChange={handleChange} placeholder="john@example.com" />
            </div>
            <FormField label="Subject" name="subject" type="text"  value={form.subject} onChange={handleChange} placeholder="Freelance project / Collaboration" style={{ marginBottom: '1.2rem' }} />
            <FormField label="Message" name="message" as="textarea" rows={5} value={form.message} onChange={handleChange} placeholder="Tell me about your project..." style={{ marginBottom: '1.8rem' }} />

            {error && (
              <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.85rem' }}>
                ⚠️ {error}
              </div>
            )}

            <motion.button type="submit" disabled={status !== 'idle'}
              whileHover={status === 'idle' ? { scale: 1.02, boxShadow: '0 8px 30px rgba(124,58,237,0.45)' } : {}}
              whileTap={status === 'idle' ? { scale: 0.98 } : {}}
              style={{
                width: '100%', padding: '0.95rem', borderRadius: 14, border: 'none',
                background: status === 'sent'
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                  : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                color: '#fff', fontSize: '0.95rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                transition: 'background 0.4s', opacity: status === 'sending' ? 0.8 : 1,
              }}
            >
              {status === 'idle'    && <><FiSend /> Send Message</>}
              {status === 'sending' && <><SpinIcon /> Sending...</>}
              {status === 'sent'    && <>✓ Message Sent to Your Gmail!</>}
            </motion.button>

            {/* Setup guide — shown only when not yet configured */}
            {EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' && (
              <div style={{ marginTop: '1.5rem', padding: '1.2rem', borderRadius: 12, background: 'rgba(250,173,20,0.06)', border: '1px solid rgba(250,173,20,0.2)', fontSize: '0.82rem', color: '#fbbf24', lineHeight: 1.8 }}>
                <strong>⚙️ One-time EmailJS Setup (5 mins, free):</strong>
                <ol style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', color: '#94a3b8' }}>
                  <li>Go to <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fbbf24' }}>emailjs.com</a> → Sign up free</li>
                  <li>Add Email Service → choose Gmail → connect <strong>dubeyanurag7991@gmail.com</strong></li>
                  <li>Create Email Template with variables: <code style={{ background: 'rgba(255,255,255,0.07)', padding: '0 4px', borderRadius: 4 }}>{'{{from_name}}, {{from_email}}, {{subject}}, {{message}}'}</code></li>
                  <li>Copy your <strong>Service ID</strong>, <strong>Template ID</strong>, and <strong>Public Key</strong></li>
                  <li>Paste them in <code style={{ background: 'rgba(255,255,255,0.07)', padding: '0 4px', borderRadius: 4 }}>Contact.jsx</code> at the top (lines 12–14)</li>
                </ol>
              </div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  )
}

function FormField({ label, name, type, as, value, onChange, placeholder, rows, style = {} }) {
  const [focused, setFocused] = useState(false)
  const Tag = as || 'input'
  return (
    <div style={{ ...style }}>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: '0.5rem' }}>
        {label}
      </label>
      <Tag name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} rows={rows}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          background: focused ? 'rgba(124,58,237,0.06)' : 'rgba(255,255,255,0.02)',
          border: `1px solid ${focused ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 12, padding: '0.8rem 1rem',
          color: 'var(--text)', fontFamily: "'Inter', sans-serif", fontSize: '0.9rem',
          outline: 'none', resize: 'vertical',
          boxShadow: focused ? '0 0 0 3px rgba(124,58,237,0.1)' : 'none',
          transition: 'all 0.3s',
        }}
      />
    </div>
  )
}

function SpinIcon() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}
    />
  )
}
