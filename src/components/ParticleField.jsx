import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 2000 }) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const theta  = Math.random() * Math.PI * 2
      const phi    = Math.acos(2 * Math.random() - 1)
      const r      = 3 + Math.random() * 8
      temp.push({
        pos: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ],
        speed: 0.003 + Math.random() * 0.008,
        offset: Math.random() * Math.PI * 2,
        size: 0.4 + Math.random() * 0.6,
      })
    }
    return temp
  }, [count])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    particles.forEach((p, i) => {
      const x = p.pos[0] + Math.sin(t * p.speed + p.offset) * 0.4
      const y = p.pos[1] + Math.cos(t * p.speed + p.offset) * 0.3
      const z = p.pos[2]
      dummy.position.set(x, y, z)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
    mesh.current.rotation.y = t * 0.04
    mesh.current.rotation.x = t * 0.015
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[0.018, 6, 6]} />
      <meshBasicMaterial color="#a78bfa" transparent opacity={0.55} />
    </instancedMesh>
  )
}

function Lines() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.03
      ref.current.rotation.z = clock.getElapsedTime() * 0.01
    }
  })

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const positions = []
    for (let i = 0; i < 60; i++) {
      const theta1 = Math.random() * Math.PI * 2
      const phi1   = Math.acos(2 * Math.random() - 1)
      const r1     = 4 + Math.random() * 3
      const theta2 = theta1 + (Math.random() - 0.5) * 0.8
      const phi2   = phi1   + (Math.random() - 0.5) * 0.8
      const r2     = 4 + Math.random() * 3
      positions.push(
        r1 * Math.sin(phi1) * Math.cos(theta1),
        r1 * Math.sin(phi1) * Math.sin(theta1),
        r1 * Math.cos(phi1),
        r2 * Math.sin(phi2) * Math.cos(theta2),
        r2 * Math.sin(phi2) * Math.sin(theta2),
        r2 * Math.cos(phi2),
      )
    }
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return g
  }, [])

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#7c3aed" transparent opacity={0.18} />
    </lineSegments>
  )
}

export default function ParticleField() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 70 }} style={{ background: 'transparent' }}>
        <ambientLight intensity={0.5} />
        <Particles />
        <Lines />
      </Canvas>
    </div>
  )
}
