import { useState } from 'react'
import { useStreamingText } from '../lib/useStreamingText'
import type { RecResult, RecItem } from '../types'

export default function RecommendationDisplay({
  data,
  loading,
}: {
  data: RecResult | null
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
          Configure inputs on the left and submit to get recommendations.
        </p>
      </div>
    )
  }

  return <RecContent data={data} />
}

function RecContent({ data }: { data: RecResult }) {
  const [expSkipped, setExpSkipped] = useState(false)
  const { displayed: expStream, done: expDone, skip: skipExp } = useStreamingText(data.explanation, 10)

  const handleSkipExp = () => {
    setExpSkipped(true)
    skipExp()
  }

  return (
    <div className="space-y-6">
      {/* Streaming explanation */}
      <div className="text-sm leading-relaxed text-neutral-400">
        {expStream}
        {!expDone && !expSkipped && (
          <>
            <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-neutral-400" />
            <button
              onClick={handleSkipExp}
              className="ml-3 font-mono text-[10px] text-neutral-700 hover:text-neutral-500 transition-colors"
            >
              skip
            </button>
          </>
        )}
        {!expDone && expSkipped && <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-neutral-400" />}
      </div>

      {/* Recommendations */}
      <div className="space-y-2">
        {data.recommendations.map((item, i) => (
          <RecCard key={item.id} item={item} index={i} reveal={expDone} />
        ))}
      </div>

      {/* Reasoning */}
      {expDone && data.reasoningSteps && data.reasoningSteps.length > 0 && (
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
  item, index, reveal,
}: {
  item: RecItem
  index: number
  reveal: boolean
}) {
  const [skipped, setSkipped] = useState(false)
  const { displayed: reasonStream, done, skip } = useStreamingText(reveal ? item.reason : '', reveal ? 10 : 999999)
  const confidencePct = Math.round(item.confidence * 100)

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
        {!done && reveal && !skipped && (
          <>
            <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-neutral-500" />
            <button
              onClick={handleSkip}
              className="ml-3 font-mono text-[10px] text-neutral-700 hover:text-neutral-500 transition-colors"
            >
              skip
            </button>
          </>
        )}
        {!done && reveal && skipped && <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-neutral-500" />}
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
