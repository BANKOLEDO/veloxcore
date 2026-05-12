import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import ThreeScene from '../components/ThreeScene'
import { AbstractNetwork, ArrowRight, Crosshair } from '../components/Icons'
import SlangMarquee from '../components/SlangMarquee'
import { getStats } from '../lib/api'

const samples = [
  { rating: 4, text: 'Baba God, this Jollof rice sweet well well. The party pack serve like 8 people no lie. Small issue though — the plantain was a bit hard for my liking. But overall, na 4 stars from me. The pepper level correct for real Lagos boy.' },
  { rating: 2, text: 'I ordered the agbada for my brother\'s wedding. The embroidery fine but the fabric na thin thin. For 55k I expect better quality. The tailor wey cut am do better work. Abeg, next time I go use my regular tailor for Abuja.' },
  { rating: 5, text: 'Asake album don finish me. Mr Money with the Vibe na classic. Every track dey hit different. My neighbours must be tired of hearing me play Sungba on repeat since morning. No complaints, 5 stars.' },
  { rating: 3, text: 'The Dell laptop na correct work machine but for 650k I expect dedicated graphics. The battery life average, about 5 hours. E do the job but nothing special. If you get money, go for the XPS instead.' },
]

function StatsRow() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [targets, setTargets] = useState({ reviews: 0, recommendations: 0, catalog: 0 })

  useEffect(() => {
    getStats().then(setTargets)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const [reviews, setReviews] = useState(0)
  const [recs, setRecs] = useState(0)
  const [items, setItems] = useState(0)

  useEffect(() => {
    if (!visible) return
    const duration = 2000
    const start = performance.now()
    let raf: number
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const e = 1 - Math.pow(1 - t, 3)
      setReviews(Math.floor(e * targets.reviews))
      setRecs(Math.floor(e * targets.recommendations))
      setItems(Math.floor(e * targets.catalog))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [visible, targets])

  return (
    <div ref={ref} className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-neutral-800">
        {[
          { value: reviews, suffix: '', label: 'reviews generated' },
          { value: recs, suffix: '', label: 'recommendations made' },
          { value: items, suffix: '', label: 'catalog items' },
        ].map((s) => (
          <div key={s.label} className="bg-neutral-950 p-8 sm:p-12 text-center">
            <div className="font-mono text-3xl sm:text-4xl text-white tracking-tight">
              {s.value.toLocaleString()}<span className="text-neutral-700">{s.suffix}</span>
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-neutral-700">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SampleCarousel() {
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % samples.length)
        setFade(true)
      }, 400)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const s = samples[index]
  const stars = '\u2605'.repeat(s.rating) + '\u2606'.repeat(5 - s.rating)

  return (
    <section className="border-t border-neutral-800">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-neutral-700" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-700">
            sample output
          </span>
        </div>

        <div className={`border border-neutral-800 p-6 sm:p-8 transition-opacity duration-400 ${fade ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-0.5 text-sm tracking-wider text-white">
              {stars.split('').map((ch, i) => (
                <span key={i} className={ch === '\u2606' ? 'text-neutral-800' : ''}>{ch}</span>
              ))}
            </div>
            <span className="font-mono text-[10px] text-neutral-700">{s.rating}/5</span>
          </div>
          <p className="text-sm leading-relaxed text-neutral-400">
            <span className="text-neutral-700">&ldquo;</span>{s.text}<span className="text-neutral-700">&rdquo;</span>
          </p>

          <div className="flex items-center gap-2 mt-6">
            {samples.map((_, i) => (
              <button
                key={i}
                onClick={() => { setFade(false); setTimeout(() => { setIndex(i); setFade(true) }, 400) }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-6 bg-white' : 'w-1.5 bg-neutral-800 hover:bg-neutral-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden border-b border-neutral-800">
        <ThreeScene intensity={1.2} />
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-block h-2 w-2 rounded-full bg-white" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-600">
                behavioural ai
              </span>
            </div>

            <h1 className="mb-6 text-6xl font-light leading-none tracking-tight text-white sm:text-7xl">
              veloxcore
            </h1>
            <p className="mb-4 text-lg leading-relaxed text-neutral-400 max-w-xl">
              Agents that understand how people behave, what they want,
              and what they will choose next.
            </p>
            <p className="mb-10 text-sm leading-relaxed text-neutral-700 max-w-lg font-mono">
              review simulation · personalised recommendations · nigerian context
            </p>

            <div className="flex gap-4">
              <Link
                to="/reviews"
                className="group flex items-center gap-2 border border-white bg-white px-6 py-3 text-sm font-medium text-neutral-950 transition-all hover:bg-neutral-200"
              >
                Review Simulation
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/recommendations"
                className="group flex items-center gap-2 border border-neutral-800 px-6 py-3 text-sm text-neutral-400 transition-all hover:border-neutral-600 hover:text-white"
              >
                Recommendations
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats */}
      <StatsRow />

      {/* Slang Marquee */}
      <section className="relative border-t border-b border-neutral-800 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <SlangMarquee />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-px bg-neutral-800 sm:grid-cols-3">
        {[
          {
            number: '01',
            title: 'Agentic Workflow',
            desc: 'Multi-step reasoning — persona analysis, product evaluation, behavioural simulation, and self-critique before every output.',
          },
          {
            number: '02',
            title: 'Nigerian Context',
            desc: 'Culturally fluent — understands Pidgin, local references, regional preferences, and authentic Nigerian user behaviour.',
          },
          {
            number: '03',
            title: 'Local-First LLM',
            desc: 'Runs on open-source models via Ollama. No API costs, no data leaving your machine. Fully containerised.',
          },
        ].map((f) => (
          <div key={f.number} className="bg-neutral-950 p-8 sm:p-10">
            <span className="font-mono text-xs text-neutral-700">{f.number}</span>
            <h3 className="mt-3 mb-3 text-base font-medium text-white">{f.title}</h3>
            <p className="text-sm leading-relaxed text-neutral-500">{f.desc}</p>
          </div>
        ))}
      </section>

      <SampleCarousel />

      {/* Product Cards */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-px bg-neutral-800 sm:grid-cols-2">
        <div className="bg-neutral-950 p-10 sm:p-12">
          <AbstractNetwork className="mb-6 h-12 w-auto text-neutral-800" />
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-700">simulation</span>
            <span className="h-px flex-1 bg-neutral-800" />
          </div>
          <h2 className="mb-3 text-xl font-medium text-white">Review Simulation</h2>
          <p className="mb-8 text-sm leading-relaxed text-neutral-500">
            Generate realistic reviews that capture tone, rating behaviour, and contextual nuance.
            Given a user persona and product details, the agent simulates exactly what they would write.
          </p>
          <ul className="mb-8 space-y-2 text-sm">
            {['Star rating prediction', 'Authentic review text generation', 'Behavioural fidelity & tone matching'].map((item) => (
              <li key={item} className="flex items-center gap-3 text-neutral-500">
                <span className="font-mono text-xs text-neutral-700">&gt;</span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            to="/reviews"
            className="group inline-flex items-center gap-2 border border-neutral-800 px-5 py-2.5 text-sm text-neutral-300 transition-all hover:border-white hover:text-white"
          >
            Try it
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="bg-neutral-950 p-10 sm:p-12">
          <Crosshair className="mb-6 h-12 w-auto text-neutral-800" />
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-700">discovery</span>
            <span className="h-px flex-1 bg-neutral-800" />
          </div>
          <h2 className="mb-3 text-xl font-medium text-white">Recommendations</h2>
          <p className="mb-8 text-sm leading-relaxed text-neutral-500">
            Personalised recommendations powered by agentic reasoning. Handles cold-start users, cross-domain discovery, and contextual querying.
          </p>
          <ul className="mb-8 space-y-2 text-sm">
            {['Cold-start & cross-domain inference', 'Contextual conversational retrieval', 'Explainable recommendation reasoning'].map((item) => (
              <li key={item} className="flex items-center gap-3 text-neutral-500">
                <span className="font-mono text-xs text-neutral-700">&gt;</span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            to="/recommendations"
            className="group inline-flex items-center gap-2 border border-neutral-800 px-5 py-2.5 text-sm text-neutral-300 transition-all hover:border-white hover:text-white"
          >
            Try it
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
