import { Link } from 'react-router-dom'
import ThreeScene from '../components/ThreeScene'
import { AbstractNetwork, ArrowRight, Crosshair } from '../components/Icons'

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
