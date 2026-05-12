import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useStreamingText } from '../lib/useStreamingText'
import type { RecResult, RecItem } from '../types'

function copy(text: string, label = 'copied') {
  navigator.clipboard.writeText(text).then(() => toast.success(label))
}

export default function RecommendationDisplay({
  data,
  loading,
  skipRequested = 0,
  onDone,
}: {
  data: RecResult | null
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
          <div className="h-4 w-3/4 rounded bg-neutral-900" />
          <div className="h-4 w-full rounded bg-neutral-900" />
          <div className="h-4 w-2/3 rounded bg-neutral-900" />
          <div className="h-4 w-5/6 rounded bg-neutral-900" />
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
          Configure inputs on the left and submit to get recommendations.
        </p>
      </div>
    )
  }

  return <RecContent data={data} skipRequested={skipRequested} onDone={onDone} />
}

function RecContent({ data, skipRequested, onDone }: { data: RecResult; skipRequested: number; onDone?: () => void }) {
  const [expSkipped, setExpSkipped] = useState(false)
  const { displayed: expStream, done: expDone, skip: skipExp } = useStreamingText(data.explanation, 10)
  const cardsDoneRef = useRef(0)
  const doneFiredRef = useRef(false)

  useEffect(() => {
    if (skipRequested > 0 && !expDone && !expSkipped) {
      setExpSkipped(true)
      skipExp()
    }
  }, [skipRequested])

  const handleSkipExp = () => {
    setExpSkipped(true)
    skipExp()
  }

  const recsRevealed = expDone || expSkipped

  const handleCardDone = () => {
    cardsDoneRef.current++
    if (recsRevealed && cardsDoneRef.current >= data.recommendations.length && !doneFiredRef.current) {
      doneFiredRef.current = true
      onDone?.()
    }
  }

  useEffect(() => {
    if (recsRevealed && data.recommendations.length === 0 && !doneFiredRef.current) {
      doneFiredRef.current = true
      onDone?.()
    }
  }, [recsRevealed])

  return (
    <div className="space-y-6">
      {/* Streaming explanation */}
      <div className="text-sm leading-relaxed text-neutral-400">
        {expStream}
        {!expDone && (
          <>
            <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-neutral-400" />
            {!expSkipped && (
              <button
                onClick={handleSkipExp}
                className="ml-3 font-mono text-[10px] text-neutral-700 hover:text-neutral-500 transition-colors"
              >
                skip
              </button>
            )}
          </>
        )}
      </div>

      {/* Recommendations */}
      <div className="space-y-2">
        {data.recommendations.map((item, i) => (
          <RecCard key={item.id} item={item} index={i} reveal={recsRevealed} skipRequested={skipRequested} onDone={handleCardDone} />
        ))}
      </div>

      {/* Actions */}
      {recsRevealed && (
        <div className="flex gap-3 border-t border-neutral-800 pt-5">
          <button
            onClick={() => copy(data.explanation)}
            className="font-mono text-[11px] text-neutral-700 hover:text-neutral-400 transition-colors"
          >
            copy explanation
          </button>
          <button
            onClick={() => copy(data.recommendations.map((r) => `${r.title} — ${r.reason}`).join('\n'))}
            className="font-mono text-[11px] text-neutral-700 hover:text-neutral-400 transition-colors"
          >
            copy all
          </button>
        </div>
      )}

      {/* Reasoning */}
      {recsRevealed && data.reasoningSteps && data.reasoningSteps.length > 0 && (
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

function RecCard({
  item, index, reveal, skipRequested, onDone,
}: {
  item: RecItem
  index: number
  reveal: boolean
  skipRequested: number
  onDone?: () => void
}) {
  const [skipped, setSkipped] = useState(false)
  const { displayed: reasonStream, done, skip } = useStreamingText(reveal ? item.reason : '', reveal ? 10 : 999999)
  const confidencePct = Math.round(item.confidence * 100)

  useEffect(() => {
    if (skipRequested > 0 && reveal && !done && !skipped) {
      setSkipped(true)
      skip()
    }
  }, [skipRequested, reveal])

  useEffect(() => {
    if (done) onDone?.()
  }, [done])

  const handleSkip = () => {
    setSkipped(true)
    skip()
  }

  return (
    <div
      className={`border border-neutral-800 p-4 transition-all duration-700 ${
        reveal ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-neutral-700">{String(index + 1).padStart(2, '0')}</span>
          <span className="text-sm font-medium text-white">{item.title}</span>
          <span className="hidden sm:block text-[10px] uppercase tracking-wider text-neutral-700">
            {item.category}
          </span>
        </div>
        <span className="font-mono text-[10px] text-neutral-600">
          {confidencePct}%
        </span>
      </div>

      <p className="text-sm leading-relaxed text-neutral-400">
        {reasonStream}
        {!done && reveal && (
          <>
            <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-neutral-500" />
            {!skipped && (
              <button
                onClick={handleSkip}
                className="ml-3 font-mono text-[10px] text-neutral-700 hover:text-neutral-500 transition-colors"
              >
                skip
              </button>
            )}
          </>
        )}
      </p>

      <div className="mt-2 h-[1px] w-full bg-neutral-800">
        <div
          className="h-full bg-white transition-all duration-[1500ms] ease-out"
          style={{ width: done ? `${confidencePct}%` : '0%' }}
        />
      </div>
    </div>
  )
}
