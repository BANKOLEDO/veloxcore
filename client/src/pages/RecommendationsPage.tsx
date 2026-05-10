import { useState } from 'react'
import UserPersonaForm, { type PersonaData } from '../components/UserPersonaForm'
import RecommendationDisplay from '../components/RecommendationDisplay'
import ThreeScene from '../components/ThreeScene'
import { getRecommendations } from '../lib/api'

interface RecItem {
  id: string
  title: string
  category: string
  reason: string
  confidence: number
}

interface RecResult {
  recommendations: RecItem[]
  explanation: string
  reasoningSteps?: string[]
}

export default function RecommendationsPage() {
  const [result, setResult] = useState<RecResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')

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
      }
      const context: Record<string, unknown> = {}
      if (query) context.query = query
      if (category) context.category = category

      const res = await getRecommendations(user as Record<string, unknown>, Object.keys(context).length > 0 ? context : undefined)
      setResult(res as RecResult)
    } catch (err) {
      setResult({
        recommendations: [],
        explanation: `Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const contextSection = (
    <>
      <div>
        <label className="mb-1 block text-[10px] uppercase tracking-[0.15em] text-neutral-600">Search Query</label>
        <input className="w-full border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm text-white placeholder-neutral-700 outline-none transition-colors hover:border-neutral-600 focus:border-white"
          value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. something for a date night" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-[0.15em] text-neutral-600">Category Focus</label>
          <input className="w-full border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm text-white placeholder-neutral-700 outline-none transition-colors hover:border-neutral-600 focus:border-white"
            value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Music, Books" />
        </div>
        <div className="flex items-end pb-2">
          <span className="text-[10px] text-neutral-700 hidden sm:block">35 items · 7 categories</span>
        </div>
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
            RECOMMENDATIONS
          </div>
          <h1 className="mt-2 text-lg font-medium tracking-tight text-white">
            Personalised Picks
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Agentic recommendations with cold-start handling
          </p>
        </div>
        <UserPersonaForm
          onSubmit={handleSubmit}
          loading={loading}
          showReviewStyle={false}
          productSection={contextSection}
        />
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
                <p>Configure a persona on the left panel, optionally add context, then get recommendations.</p>
                <p className="mt-2 text-neutral-800">Handles cold-start users and cross-domain suggestions.</p>
              </div>
            )}

            <RecommendationDisplay data={result} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}
