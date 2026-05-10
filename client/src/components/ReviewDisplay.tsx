import { useStreamingText } from '../lib/useStreamingText'

interface ReviewData {
  rating: number
  text: string
  explanation: string
  reasoningSteps?: string[]
}

export default function ReviewDisplay({
  data,
  loading,
}: {
  data: ReviewData | null
  loading: boolean
}) {
  if (loading) {
    return (
      <div className="py-16">
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <span className="inline-block h-2 w-2 rounded-full bg-white/50 animate-pulse" />
          veloxcore is reasoning<span className="animate-pulse">...</span>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="py-16">
        <p className="text-sm leading-relaxed text-neutral-700">
          <span className="text-neutral-600">$</span> Awaiting prompt...
        </p>
        <p className="mt-2 text-sm text-neutral-800">
          Configure inputs on the left and submit to generate a review.
        </p>
      </div>
    )
  }

  return <ReviewContent data={data} />
}

function ReviewContent({ data }: { data: ReviewData }) {
  const { displayed: textStream, done: textDone } = useStreamingText(data.text, 12)
  const ratingStars = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating)

  return (
    <div className="space-y-6">
      {/* Rating bar */}
      <div className="flex items-center gap-4">
        <div className="flex gap-0.5 text-lg tracking-wider text-white">
          {ratingStars.split('').map((s, i) => (
            <span key={i} className={s === '☆' ? 'text-neutral-800' : ''}>{s}</span>
          ))}
        </div>
        <span className="font-mono text-xs text-neutral-600">{data.rating}/5</span>
      </div>

      {/* Streaming review text */}
      <div className="leading-relaxed text-neutral-200 whitespace-pre-wrap text-[15px]">
        {textStream}
        {!textDone && <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-neutral-400" />}
      </div>

      {/* Why this rating */}
      {textDone && data.explanation && (
        <div className="border-t border-neutral-800 pt-5">
          <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-neutral-700">
            Why this rating
          </p>
          <p className="text-sm leading-relaxed text-neutral-500">
            {data.explanation}
          </p>
        </div>
      )}

      {/* Reasoning steps */}
      {textDone && data.reasoningSteps && data.reasoningSteps.length > 0 && (
        <div className="border-t border-neutral-800 pt-5">
          <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-neutral-700">
            Agentic reasoning ({data.reasoningSteps.length} steps)
          </p>
          <div className="space-y-2">
            {data.reasoningSteps.map((step, i) => (
              <div key={i} className="flex gap-3 text-sm text-neutral-600">
                <span className="mt-0.5 shrink-0 font-mono text-xs text-neutral-700">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
