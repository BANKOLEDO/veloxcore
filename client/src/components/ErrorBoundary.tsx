import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div className="flex h-screen items-center justify-center bg-neutral-950 px-6">
            <div className="text-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-900">
                something went wrong
              </span>
              <p className="mt-3 text-sm text-neutral-500 max-w-md">
                An unexpected error occurred. Please try again.
              </p>
              <button
                onClick={() => this.setState({ error: null })}
                className="mt-6 border border-neutral-800 px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                try again
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
