import { useState, useEffect, useCallback } from 'react'
import { getReviewHistory, getRecommendationHistory, deleteReview, deleteRecommendation } from '../lib/api'
import type { RecItem } from '../types'

interface ReviewEntry {
  id: number
  product_title: string
  product_category: string
  product_description: string | null
  rating: number
  text: string
  explanation: string | null
  created_at: string
}

interface RecEntry {
  id: number
  context_query: string | null
  context_category: string | null
  explanation: string | null
  items: string
  created_at: string
}

type Tab = 'reviews' | 'recommendations'

export default function HistoryPage() {
  const [tab, setTab] = useState<Tab>('reviews')
  const [reviews, setReviews] = useState<ReviewEntry[]>([])
  const [recommendations, setRecommendations] = useState<RecEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(50)
  const [deleting, setDeleting] = useState<number | null>(null)

  const loadData = useCallback(() => {
    setLoading(true)
    setError('')

    const fetcher = tab === 'reviews' ? getReviewHistory : getRecommendationHistory
    const key = tab === 'reviews' ? 'reviews' : 'recommendations'

    fetcher(page, limit)
      .then((data) => {
        if (tab === 'reviews') setReviews(data[key] ?? [])
        else setRecommendations(data[key] ?? [])
        setTotal(data.total ?? 0)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [tab, page, limit])

  useEffect(() => { loadData() }, [loadData])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this entry?')) return
    setDeleting(id)
    try {
      if (tab === 'reviews') {
        await deleteReview(id)
        setReviews((prev) => prev.filter((r) => r.id !== id))
      } else {
        await deleteRecommendation(id)
        setRecommendations((prev) => prev.filter((r) => r.id !== id))
      }
      setTotal((prev) => prev - 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  const totalPages = Math.ceil(total / limit)

  const filteredReviews = reviews.filter(
    (r) =>
      r.product_title.toLowerCase().includes(search.toLowerCase()) ||
      r.text.toLowerCase().includes(search.toLowerCase()),
  )

  const filteredRecs = recommendations.filter(
    (r) =>
      (r.explanation ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (r.context_query ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-lg font-medium tracking-tight text-white">History</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Previously generated reviews and recommendations
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="font-mono text-[11px] text-neutral-700 hover:text-neutral-400 transition-colors disabled:opacity-30"
        >
          refresh
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          className="w-full border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm text-white placeholder-neutral-700 outline-none transition-colors hover:border-neutral-600 focus:border-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search history..."
        />
      </div>

      <div className="flex gap-1 border-b border-neutral-800 mb-8">
        <button
          onClick={() => { setTab('reviews'); setPage(1); setSearch('') }}
          className={`font-mono text-xs px-3 py-2 transition-colors border-b-2 -mb-[1px] ${
            tab === 'reviews'
              ? 'text-white border-white'
              : 'text-neutral-600 border-transparent hover:text-neutral-400'
          }`}
        >
          Reviews {total > 0 && tab === 'reviews' && <span className="ml-1 text-neutral-700">({total})</span>}
        </button>
        <button
          onClick={() => { setTab('recommendations'); setPage(1); setSearch('') }}
          className={`font-mono text-xs px-3 py-2 transition-colors border-b-2 -mb-[1px] ${
            tab === 'recommendations'
              ? 'text-white border-white'
              : 'text-neutral-600 border-transparent hover:text-neutral-400'
          }`}
        >
          Recommendations {total > 0 && tab === 'recommendations' && <span className="ml-1 text-neutral-700">({total})</span>}
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-3 py-16 text-sm text-neutral-500">
          <span className="inline-block h-2 w-2 rounded-full bg-white/50 animate-pulse" />
          Loading...
        </div>
      )}

      {error && !loading && (
        <div className="py-16">
          <p className="text-sm text-red-500 mb-4">{error}</p>
          <button onClick={loadData}
            className="border border-neutral-800 px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && tab === 'reviews' && (
        <ReviewsList
          reviews={filteredReviews}
          onDelete={handleDelete}
          deleting={deleting}
        />
      )}

      {!loading && !error && tab === 'recommendations' && (
        <RecommendationsList
          recommendations={filteredRecs}
          onDelete={handleDelete}
          deleting={deleting}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && !error && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="font-mono text-xs text-neutral-700 hover:text-neutral-400 disabled:opacity-30 transition-colors"
          >
            prev
          </button>
          <span className="font-mono text-xs text-neutral-700">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="font-mono text-xs text-neutral-700 hover:text-neutral-400 disabled:opacity-30 transition-colors"
          >
            next
          </button>
        </div>
      )}
    </div>
  )
}

function ReviewsList({
  reviews, onDelete, deleting,
}: {
  reviews: ReviewEntry[]
  onDelete: (id: number) => void
  deleting: number | null
}) {
  if (reviews.length === 0) {
    return (
      <div className="py-16 text-sm text-neutral-700">
        <p>No saved reviews yet.</p>
        <p className="mt-1 text-neutral-800">Generate a review from the Reviews page and it will appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} onDelete={onDelete} deleting={deleting === review.id} />
      ))}
    </div>
  )
}

function ReviewCard({
  review, onDelete, deleting,
}: {
  review: ReviewEntry
  onDelete: (id: number) => void
  deleting: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const date = new Date(review.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)

  return (
    <div className="border border-neutral-800 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <span className="text-sm font-medium text-white">{review.product_title}</span>
          <span className="ml-2 text-[10px] uppercase tracking-wider text-neutral-700">
            {review.product_category}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[10px] text-neutral-700">{date}</span>
          <button
            onClick={() => onDelete(review.id)}
            disabled={deleting}
            className="font-mono text-[10px] text-red-900 hover:text-red-500 transition-colors disabled:opacity-30"
            aria-label="Delete review"
          >
            {deleting ? '...' : 'del'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3" aria-label={`Rated ${review.rating} out of 5`}>
        <div className="flex gap-0.5 text-sm tracking-wider text-white" aria-hidden="true">
          {stars.split('').map((s, i) => (
            <span key={i} className={s === '☆' ? 'text-neutral-800' : ''}>{s}</span>
          ))}
        </div>
        <span className="font-mono text-[10px] text-neutral-600">{review.rating}/5</span>
      </div>

      <p className="text-sm leading-relaxed text-neutral-400">
        {expanded ? review.text : review.text.slice(0, 280)}
        {review.text.length > 280 && (
          <>
            {!expanded && <span className="text-neutral-700">...</span>}
            <button
              onClick={() => setExpanded((p) => !p)}
              className="ml-1.5 font-mono text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors"
            >
              {expanded ? 'less' : 'more'}
            </button>
          </>
        )}
      </p>

      {review.explanation && (
        <p className="mt-2 text-xs text-neutral-600 italic">{review.explanation}</p>
      )}
    </div>
  )
}

function RecommendationsList({
  recommendations, onDelete, deleting,
}: {
  recommendations: RecEntry[]
  onDelete: (id: number) => void
  deleting: number | null
}) {
  if (recommendations.length === 0) {
    return (
      <div className="py-16 text-sm text-neutral-700">
        <p>No saved recommendations yet.</p>
        <p className="mt-1 text-neutral-800">Get recommendations from the Recommendations page and they will appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recommendations.map((rec) => (
        <RecommendationCard key={rec.id} rec={rec} onDelete={onDelete} deleting={deleting === rec.id} />
      ))}
    </div>
  )
}

function RecommendationCard({
  rec, onDelete, deleting,
}: {
  rec: RecEntry
  onDelete: (id: number) => void
  deleting: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const date = new Date(rec.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
  const items: RecItem[] = JSON.parse(rec.items || '[]')

  return (
    <div className="border border-neutral-800 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <span className="text-xs text-neutral-600">
            {rec.context_query || rec.context_category
              ? `${rec.context_query ?? ''}${rec.context_query && rec.context_category ? ' · ' : ''}${rec.context_category ?? ''}`
              : 'General'}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[10px] text-neutral-700">{date}</span>
          <button
            onClick={() => onDelete(rec.id)}
            disabled={deleting}
            className="font-mono text-[10px] text-red-900 hover:text-red-500 transition-colors disabled:opacity-30"
            aria-label="Delete recommendation"
          >
            {deleting ? '...' : 'del'}
          </button>
        </div>
      </div>

      {rec.explanation && (
        <p className="text-sm leading-relaxed text-neutral-400 mb-3">{rec.explanation}</p>
      )}

      <div className="space-y-1.5">
        {items.slice(0, expanded ? items.length : 3).map((item, i) => (
          <div key={item.id} className="flex items-start gap-3">
            <span className="font-mono text-[10px] text-neutral-700 mt-1 shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white truncate">{item.title}</span>
                <span className="text-[10px] uppercase tracking-wider text-neutral-700 shrink-0">
                  {item.category}
                </span>
              </div>
              <p className="text-xs text-neutral-600 mt-0.5">{item.reason}</p>
            </div>
            <span className="font-mono text-[10px] text-neutral-700 shrink-0">
              {Math.round(item.confidence * 100)}%
            </span>
          </div>
        ))}
      </div>

      {items.length > 3 && (
        <button
          onClick={() => setExpanded((p) => !p)}
          className="mt-2 font-mono text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors"
        >
          {expanded ? 'less' : `${items.length - 3} more`}
        </button>
      )}
    </div>
  )
}
