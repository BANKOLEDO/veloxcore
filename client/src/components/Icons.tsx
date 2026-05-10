type Props = { className?: string }

export function GeometricMark({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="32" cy="32" r="14" />
      <path d="M32 10 L32 54" />
      <path d="M10 32 L54 32" />
      <circle cx="32" cy="10" r="3" />
      <circle cx="32" cy="54" r="3" />
      <circle cx="10" cy="32" r="3" />
      <circle cx="54" cy="32" r="3" />
    </svg>
  )
}

export function AbstractNetwork({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="20" cy="20" r="6" />
      <circle cx="60" cy="15" r="6" />
      <circle cx="100" cy="20" r="6" />
      <circle cx="20" cy="60" r="6" />
      <circle cx="60" cy="65" r="6" />
      <circle cx="100" cy="60" r="6" />
      <circle cx="40" cy="40" r="4" />
      <circle cx="80" cy="40" r="4" />
      <path d="M20 20 L60 15 L100 20" />
      <path d="M20 60 L60 65 L100 60" />
      <path d="M40 40 L80 40" />
      <path d="M20 20 L20 60" />
      <path d="M60 15 L60 65" />
      <path d="M100 20 L100 60" />
      <path d="M40 40 L20 60" />
      <path d="M80 40 L100 60" />
    </svg>
  )
}

export function AbstractShape({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
      <polygon points="50,10 90,35 90,65 50,90 10,65 10,35" />
      <polygon points="50,25 72,40 72,60 50,75 28,60 28,40" />
      <line x1="50" y1="10" x2="50" y2="90" />
      <line x1="10" y1="50" x2="90" y2="50" />
    </svg>
  )
}

export function Waveform({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M0 30 Q10 10 20 30 T40 30 T60 30 T80 30 T100 30 T120 30 T140 30 T160 30 T180 30 T200 30" />
      <path d="M0 40 Q10 25 20 40 T40 40 T60 40 T80 40 T100 40 T120 40 T140 40 T160 40 T180 40 T200 40" opacity="0.5" />
      <path d="M0 20 Q10 35 20 20 T40 20 T60 20 T80 20 T100 20 T120 20 T140 20 T160 20 T180 20 T200 20" opacity="0.3" />
    </svg>
  )
}

export function GridDots({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="currentColor">
      {Array.from({ length: 10 }, (_, i) =>
        Array.from({ length: 10 }, (_, j) => (
          <circle key={`${i}-${j}`} cx={10 + i * 20} cy={10 + j * 20} r="1" opacity="0.3" />
        )),
      )}
    </svg>
  )
}

export function CornerBrackets({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 5 L5 5 L5 115 L20 115" />
      <path d="M100 5 L115 5 L115 115 L100 115" />
      <path d="M5 60 L25 60" />
      <path d="M95 60 L115 60" />
    </svg>
  )
}

export function Crosshair({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="32" cy="32" r="20" />
      <circle cx="32" cy="32" r="8" opacity="0.5" />
      <line x1="32" y1="2" x2="32" y2="16" />
      <line x1="32" y1="48" x2="32" y2="62" />
      <line x1="2" y1="32" x2="16" y2="32" />
      <line x1="48" y1="32" x2="62" y2="32" />
      <circle cx="32" cy="32" r="2" />
    </svg>
  )
}

export function ArrowRight({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="14 6 20 12 14 18" />
    </svg>
  )
}

export function ChevronRight({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export function Spinner({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2a10 10 0 0 1 10 10" />
      <path d="M12 22a10 10 0 0 1-10-10" opacity="0.4" />
    </svg>
  )
}
