import { useEffect, useRef } from 'react'

export default function ThreeScene({ intensity = 1 }: { intensity?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cleanup: (() => void) | undefined

    async function init() {
      const THREE = await import('three')

      const container = containerRef.current
      if (!container) return

      const width = container.clientWidth
      const height = container.clientHeight

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
      camera.position.set(0, 0, 12)

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      container.appendChild(renderer.domElement)

      const geometry = new THREE.IcosahedronGeometry(2.5, 1)
      const edges = new THREE.EdgesGeometry(geometry)
      const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.12 * intensity,
      })
      const wireframe = new THREE.LineSegments(edges, material)
      scene.add(wireframe)

      const innerGeo = new THREE.IcosahedronGeometry(1.8, 0)
      const innerMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.06 * intensity,
      })
      const inner = new THREE.Mesh(innerGeo, innerMat)
      scene.add(inner)

      const particlesGeo = new THREE.BufferGeometry()
      const particleCount = Math.floor(300 * intensity)
      const positions = new Float32Array(particleCount * 3)
      for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 30
      }
      particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const particlesMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.025,
        transparent: true,
        opacity: 0.25 * intensity,
      })
      const particles = new THREE.Points(particlesGeo, particlesMat)
      scene.add(particles)

      let time = 0
      let rafId: number

      function animate() {
        rafId = requestAnimationFrame(animate)
        time += 0.003
        wireframe.rotation.x = time * 0.4
        wireframe.rotation.y = time * 0.6
        inner.rotation.x = time * 0.5
        inner.rotation.y = -time * 0.7
        particles.rotation.y = time * 0.05
        renderer.render(scene, camera)
      }

      rafId = requestAnimationFrame(animate)

      function handleResize() {
        if (!container) return
        const w = container.clientWidth
        const h = container.clientHeight
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }

      const observer = new ResizeObserver(handleResize)
      observer.observe(container)

      cleanup = () => {
        cancelAnimationFrame(rafId)
        observer.disconnect()
        renderer.dispose()
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement)
        }
      }
    }

    init()

    return () => cleanup?.()
  }, [intensity])

  return <div ref={containerRef} className="absolute inset-0 z-0" />
}
