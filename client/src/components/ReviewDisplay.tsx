import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useStreamingText } from '../lib/useStreamingText'

interface ReviewData {
  rating: number
  text: string
  explanation: string
  reasoningSteps?: string[]
}

function copy(text: string, label = 'copied') {
  navigator.clipboard.writeText(text).then(() => toast.success(label))
}

export default function ReviewDisplay({
  data,
  loading,
  skipRequested = 0,
  onDone,
}: {
  data: ReviewData | null
  loading: boolean
  skipRequested?: number
  onDone?: () => void
}) {
  if (loading) {
    return (
      <div className="py-16 space-y-4">
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <span className="inline-block h-2 w-2 rounded-full bg-white/50 animate-pulse" />
          veloxcore is reasoning<span className="animate-pulse">...</span>
        </div>
        <div className="space-y-3 animate-pulse">
          <div className="h-4 w-2/3 rounded bg-neutral-900" />
          <div className="h-4 w-full rounded bg-neutral-900" />
          <div className="h-4 w-4/5 rounded bg-neutral-900" />
          <div className="h-4 w-3/5 rounded bg-neutral-900" />
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

  return <ReviewContent data={data} skipRequested={skipRequested} onDone={onDone} />
}

function ReviewContent({ data, skipRequested, onDone }: { data: ReviewData; skipRequested: number; onDone?: () => void }) {
  const [skipped, setSkipped] = useState(false)
  const { displayed: textStream, done: textDone, skip } = useStreamingText(data.text, 12)
  const ratingStars = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating)

  useEffect(() => {
    if (skipRequested > 0 && !textDone && !skipped) {
      setSkipped(true)
      skip()
    }
  }, [skipRequested])

  useEffect(() => {
    if (textDone) onDone?.()
  }, [textDone])

  const handleSkip = () => {
    setSkipped(true)
    skip()
  }

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
        {!textDone && (
          <>
            <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-neutral-400" />
            {!skipped && (
              <button
                onClick={handleSkip}
                className="ml-3 font-mono text-[10px] text-neutral-700 hover:text-neutral-500 transition-colors align-baseline"
              >
                skip
              </button>
            )}
          </>
        )}
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

      {/* Actions */}
      {textDone && (
        <div className="flex gap-3 border-t border-neutral-800 pt-5">
          <button
            onClick={() => copy(data.text)}
            className="font-mono text-[11px] text-neutral-700 hover:text-neutral-400 transition-colors"
          >
            copy review
          </button>
          {data.explanation && (
            <button
              onClick={() => copy(data.explanation!)}
              className="font-mono text-[11px] text-neutral-700 hover:text-neutral-400 transition-colors"
            >
              copy explanation
            </button>
          )}
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
