export interface ReviewResult {
  rating: number
  text: string
  explanation: string
  reasoningSteps?: string[]
}

export interface RecItem {
  id: string
  title: string
  category: string
  reason: string
  confidence: number
}

export interface RecResult {
  recommendations: RecItem[]
  explanation: string
  reasoningSteps?: string[]
}
