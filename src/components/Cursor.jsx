import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  // Raw mouse position — no spring, instant
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Ring follower — subtle lag only on the ring
  const ringX = useSpring(mouseX, { stiffness: 180, damping: 22, mass: 0.4 })
  const ringY = useSpring(mouseY, { stiffness: 180, damping: 22, mass: 0.4 })

  useEffect(() => {
    const move = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    const down = () => setClicked(true)
    const up   = () => setClicked(false)

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)

    const attachHover = () => {
      document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', () => setHovered(true))
        el.addEventListener('mouseleave', () => setHovered(false))
      })
    }
    attachHover()
    const obs = new MutationObserver(attachHover)
    obs.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      obs.disconnect()
    }
  }, [])

  return (
    <>
      {/* Ring — slight spring lag for elegance */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          x: ringX, y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 9998,
          borderRadius: '50%',
          border: '1.5px solid rgba(167,139,250,0.6)',
        }}
        animate={{
          width:  hovered ? 54 : 34,
          height: hovered ? 54 : 34,
          opacity: hovered ? 0.7 : 0.4,
          borderColor: hovered ? 'rgba(167,139,250,1)' : 'rgba(167,139,250,0.6)',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      />

      {/* Dot — instant, no spring at all */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          x: mouseX, y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 9999,
          borderRadius: '50%',
          background: 'var(--primary-light)',
          mixBlendMode: 'screen',
        }}
        animate={{
          width:  clicked ? 6 : hovered ? 6 : 8,
          height: clicked ? 6 : hovered ? 6 : 8,
          opacity: hovered ? 0.6 : 1,
          scale: clicked ? 0.6 : 1,
        }}
        transition={{ type: 'spring', stiffness: 800, damping: 35 }}
      />
    </>
  )
}
