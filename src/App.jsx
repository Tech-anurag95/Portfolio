import { useEffect } from 'react'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import LeetCode from './sections/LeetCode'
import Contact from './sections/Contact'
import Footer from './components/Footer'
import ParticleField from './components/ParticleField'

export default function App() {
  return (
    <>
      {/* Global particle background — fixed, behind everything */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <ParticleField />
      </div>

      <Cursor />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <LeetCode />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
