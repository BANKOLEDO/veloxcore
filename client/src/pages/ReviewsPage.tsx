import { useState, useRef, useEffect } from 'react'
import UserPersonaForm, { type PersonaData } from '../components/UserPersonaForm'
import ReviewDisplay from '../components/ReviewDisplay'
import ThreeScene from '../components/ThreeScene'
import { generateReview } from '../lib/api'

interface ReviewResult {
  rating: number
  text: string
  explanation: string
  reasoningSteps?: string[]
}

interface PageState {
  result: ReviewResult | null
  product: string
  productTitle: string
  productCategory: string
  persona: PersonaData | null
}

const STORAGE_KEY = 'veloxcore_review_state'

function loadState(): Partial<PageState> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveState(state: Partial<PageState>) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch { /* quota exceeded — ignore */ }
}

export default function ReviewsPage() {
  const initial = loadState()

  const [result, setResult] = useState<ReviewResult | null>(initial.result ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [product, setProduct] = useState(initial.product ?? '')
  const [productTitle, setProductTitle] = useState(initial.productTitle ?? '')
  const [productCategory, setProductCategory] = useState(initial.productCategory ?? '')
  const [skipRequested, setSkipRequested] = useState(0)
  const [streamDone, setStreamDone] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const lastPersona = useRef<PersonaData | null>(initial.persona ?? null)
  const lastPayload = useRef<{ user: Record<string, unknown>; product: Record<string, unknown> } | null>(null)

  useEffect(() => {
    saveState({ result, product, productTitle, productCategory, persona: lastPersona.current })
  }, [result, product, productTitle, productCategory])

  useEffect(() => {
    if (initial.result) setSkipRequested(1)
  }, [])

  const buildPayload = (data: PersonaData) => {
    const user = {
      name: data.name,
      age: data.age ? Number(data.age) : undefined,
      location: data.location || undefined,
      interests: data.interests.split(',').map((s) => s.trim()).filter(Boolean),
      personalityTraits: data.personalityTraits.split(',').map((s) => s.trim()).filter(Boolean),
      preferredCategories: data.preferredCategories.split(',').map((s) => s.trim()).filter(Boolean),
      reviewStyle: data.reviewStyle || undefined,
    }
    const productPayload = {
      id: 'custom-' + Date.now(),
      title: productTitle || 'Unnamed Product',
      category: productCategory || 'General',
      description: product,
      tags: productCategory.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean),
    }
    return { user, product: productPayload }
  }

  const handleSubmit = async (data: PersonaData) => {
    setLoading(true)
    setResult(null)
    setError('')
    setStreamDone(false)
    lastPersona.current = data

    const payload = buildPayload(data)
    lastPayload.current = payload

    try {
      const res = await generateReview(payload.user as Record<string, unknown>, payload.product as Record<string, unknown>)
      setResult(res as ReviewResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate review. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = async () => {
    if (!lastPayload.current) return
    setLoading(true)
    setResult(null)
    setError('')
    setStreamDone(false)

    try {
      const res = await generateReview(lastPayload.current.user, lastPayload.current.product)
      setResult(res as ReviewResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate review. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSkipAll = () => {
    setSkipRequested((n) => n + 1)
  }

  const handleDismiss = () => {
    setResult(null)
    setStreamDone(false)
    setProduct('')
    setProductTitle('')
    setProductCategory('')
    lastPersona.current = null
    setFormKey((k) => k + 1)
  }

  const productSection = (
    <>
      <div>
        <label className="mb-1 block text-[10px] uppercase tracking-[0.15em] text-neutral-600">Product Title</label>
        <input className="w-full border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm text-white placeholder-neutral-700 outline-none transition-colors hover:border-neutral-600 focus:border-white"
          value={productTitle} onChange={(e) => setProductTitle(e.target.value)} placeholder="e.g. Chef's Special Jollof Rice" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-[0.15em] text-neutral-600">Category</label>
          <input className="w-full border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm text-white placeholder-neutral-700 outline-none transition-colors hover:border-neutral-600 focus:border-white"
            value={productCategory} onChange={(e) => setProductCategory(e.target.value)} placeholder="e.g. Nigerian Food" />
        </div>
        <div className="flex items-end pb-2">
          <span className="text-[10px] text-neutral-700 hidden sm:block">35 items · 7 categories</span>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-[10px] uppercase tracking-[0.15em] text-neutral-600">Description</label>
        <textarea className="w-full border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm text-white placeholder-neutral-700 outline-none transition-colors hover:border-neutral-600 focus:border-white"
          rows={3} value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Describe the product in detail..." />
      </div>
    </>
  )

  return (
    <div className="flex flex-col md:flex-row md:h-[calc(100vh-57px)] md:overflow-hidden max-sm:min-h-[calc(100vh-57px)]">
      {/* Left: Input Panel */}
      <div className="w-full md:w-[420px] md:min-w-[420px] md:overflow-y-auto border-b md:border-b-0 md:border-r border-neutral-800 bg-neutral-950 p-6 sm:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-neutral-700">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-neutral-700" />
            REVIEW SIMULATION
          </div>
          <h1 className="mt-2 text-lg font-medium tracking-tight text-white">
            User Modeling
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Simulate a review from any persona
          </p>
        </div>
        <UserPersonaForm key={formKey} onSubmit={handleSubmit} loading={loading} productSection={productSection} initialData={lastPersona.current ?? undefined} />
      </div>

      {/* Right: Output Panel */}
      <div className="relative flex flex-1 flex-col md:overflow-hidden bg-neutral-950">
        <div className="hidden md:block absolute inset-0"><ThreeScene intensity={0.8} /></div>
        <div className="relative z-10 flex-1 overflow-y-auto px-6 sm:px-12 py-8">
          <div className="mx-auto w-full max-w-2xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-white" />
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-700">
                veloxcore / agent
              </span>
            </div>

            {!result && !loading && !error && (
              <div className="text-sm text-neutral-700">
                <p>Configure a persona and product on the left panel, then generate a review.</p>
                <p className="mt-2 text-neutral-800">The agent will reason step by step before responding.</p>
              </div>
            )}

            {error && (
              <div className="py-12">
                <p className="text-sm text-red-500 mb-4">{error}</p>
                <button
                  onClick={handleRegenerate}
                  className="border border-neutral-800 px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  try again
                </button>
              </div>
            )}

            <ReviewDisplay data={result} loading={loading} skipRequested={skipRequested} onDone={() => setStreamDone(true)} />

            {result && !loading && (
              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleRegenerate}
                  className="font-mono text-xs text-neutral-700 hover:text-neutral-400 transition-colors"
                >
                  regenerate
                </button>
                <button
                  onClick={streamDone ? handleDismiss : handleSkipAll}
                  className="font-mono text-xs text-neutral-700 hover:text-neutral-400 transition-colors"
                >
                  {streamDone ? 'dismiss' : 'skip'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
