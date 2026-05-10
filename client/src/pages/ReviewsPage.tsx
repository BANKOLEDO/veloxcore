import { useState } from 'react'
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

export default function ReviewsPage() {
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState('')
  const [productTitle, setProductTitle] = useState('')
  const [productCategory, setProductCategory] = useState('')

  const handleSubmit = async (data: PersonaData) => {
    setLoading(true)
    setResult(null)

    try {
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
      const res = await generateReview(user as Record<string, unknown>, productPayload as Record<string, unknown>)
      setResult(res as ReviewResult)
    } catch (err) {
      setResult({
        rating: 0,
        text: `Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
        explanation: 'Generation failed',
      })
    } finally {
      setLoading(false)
    }
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
    <div className="flex flex-col md:flex-row md:h-[calc(100vh-57px)] md:overflow-hidden">
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
        <UserPersonaForm onSubmit={handleSubmit} loading={loading} productSection={productSection} />
      </div>

      {/* Right: Output Panel */}
      <div className="relative flex flex-1 flex-col md:overflow-hidden bg-neutral-950">
        <ThreeScene intensity={0.8} />
        <div className="relative z-10 flex-1 md:overflow-y-auto px-6 sm:px-12 py-8">
          <div className="mx-auto w-full max-w-2xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-white" />
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-700">
                veloxcore / agent
              </span>
            </div>

            {!result && !loading && (
              <div className="text-sm text-neutral-700">
                <p>Configure a persona and product on the left panel, then generate a review.</p>
                <p className="mt-2 text-neutral-800">The agent will reason step by step before responding.</p>
              </div>
            )}

            <ReviewDisplay data={result} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}
