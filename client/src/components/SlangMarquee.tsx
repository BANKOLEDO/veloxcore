import { useRef, useState, useEffect } from 'react'

/* ---------- inline SVG icons ---------- */
function StarIco({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" stroke="none">
      <path d="M8 1l1.5 5H15l-4 3 1.5 5L8 11l-4.5 3L5 9l-4-3h5.5z" />
    </svg>
  )
}
function BubbleIco({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M2 3h12v8H6l-3 2v-2H2z" />
    </svg>
  )
}
function PinIco({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="8" cy="6" r="3" />
      <path d="M3 6c0 3.5 5 9 5 9s5-5.5 5-9" />
    </svg>
  )
}
function WaveIco({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M1 8q2-4 4 0t4 0 4 0 2-4" />
    </svg>
  )
}
function FlameIco({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M8 15c3 0 5-2.5 5-5.5C13 5 8 1 8 1S3 5 3 9.5C3 12.5 5 15 8 15z" />
      <path d="M6 11c0 1.5 1 2 2 2s2-.5 2-2" strokeWidth="0.8" />
    </svg>
  )
}
function CrossIco({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
      <line x1="3" y1="8" x2="13" y2="8" />
      <line x1="8" y1="3" x2="8" y2="13" />
    </svg>
  )
}

const ICONS = [StarIco, BubbleIco, PinIco, WaveIco, FlameIco, CrossIco]

const WORDS_1 = [
  'review', 'Abeg', 'simulation', 'Wahala', 'persona', 'How far?',
  'product', 'Oya', 'rating', 'Sha', 'catalog', 'Abi', 'recommendation',
  'Na wa o', 'agent', 'E choke', 'behaviour', 'Jare', 'user',
  'Baba God', 'model', 'Correct', 'output', 'Shebi', 'insight',
]

const WORDS_2 = [
  'pipeline', 'Wetin dey', 'analysis', 'As e be', 'context',
  'Carry go', 'evaluation', 'E don do', 'feedback', 'For where?',
  'synthetic', 'I no know', 'data', 'K-leg', 'inference',
  'Mek we', 'latent', 'No wahala', 'trait', 'Oshey', 'vector',
  'Sabi', 'predict', 'Tufiakwa', 'embedding',
]

const WORDS_3 = [
  'culture', 'Jaiye', 'native', 'Kpa', 'authentic', 'Sape',
  'pidgin', 'Tok', 'fluent', 'Commot', 'local', 'Lagos',
  'preference', 'Abuja', 'pattern', 'Oga', 'cluster', 'Vex',
  'feature', 'Yawa', 'confidence', 'Gbege', 'heatmap',
  'Shine ya eye', 'weight', 'Waka', 'layer', 'I swear',
]

interface WordItem {
  text: string
  iconIdx: number
}

function buildItems(words: string[]): WordItem[] {
  return words.map((w, i) => ({ text: w, iconIdx: i % ICONS.length }))
}

function MarqueeRow({ words, speed, dir, rowKey }: {
  words: string[]
  speed: number
  dir: 1 | -1
  rowKey: string
}) {
  const [paused, setPaused] = useState(false)
  const offsetRef = useRef(0)
  const pausedRef = useRef(false)
  const rafRef = useRef(0)
  const elRef = useRef<HTMLDivElement>(null)
  const [items] = useState(() => buildItems(words))
  const [tripled] = useState(() => [...items, ...items, ...items])
  const totalRef = useRef(0)

  pausedRef.current = paused

  useEffect(() => {
    const el = elRef.current
    if (!el) return
    totalRef.current = el.scrollWidth / 3
    offsetRef.current = -totalRef.current
    el.style.transform = `translateX(${offsetRef.current}px)`
  }, [items])

  useEffect(() => {
    let last = performance.now()
    const tick = (now: number) => {
      const dt = now - last
      last = now
      const total = totalRef.current
      if (total === 0) { rafRef.current = requestAnimationFrame(tick); return }

      if (!pausedRef.current) {
        offsetRef.current += (speed * dt * dir) / 1000
        if (dir === -1 && offsetRef.current < -total * 2) {
          offsetRef.current = -total
        }
        if (dir === 1 && offsetRef.current > 0) {
          offsetRef.current = -total
        }
      }

      if (elRef.current) {
        elRef.current.style.transform = `translateX(${offsetRef.current}px)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [speed, dir])

  return (
    <div
      ref={elRef}
      className="flex items-center gap-6 whitespace-nowrap py-2.5 will-change-transform"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {tripled.map((item, i) => {
        const Ico = ICONS[item.iconIdx]
        const opacity = i % 3 === 0 ? '0.35' : i % 3 === 1 ? '0.2' : '0.1'
        return (
          <span key={`${rowKey}-${i}`} className="flex items-center gap-2">
            <span
              className="flex items-center gap-1.5 font-mono text-sm tracking-wide"
              style={{ color: `rgba(255,255,255,${opacity})` }}
            >
              <Ico className="h-3 w-3" />
              {item.text}
            </span>
            <span className="h-1 w-1 rounded-full bg-neutral-700" />
          </span>
        )
      })}
    </div>
  )
}

export default function SlangMarquee({ className }: { className?: string }) {
  return (
    <div className={className}>
      {([
        { words: WORDS_1, speed: 55, dir: -1 as const, key: 'm1' },
        { words: WORDS_2, speed: 40, dir: 1 as const, key: 'm2' },
        { words: WORDS_3, speed: 50, dir: -1 as const, key: 'm3' },
      ]).map((r) => (
        <div
          key={r.key}
          className="flex overflow-hidden select-none"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
        >
          <MarqueeRow words={r.words} speed={r.speed} dir={r.dir} rowKey={r.key} />
        </div>
      ))}
    </div>
  )
}
