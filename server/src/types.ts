export interface UserPersona {
  name: string
  age?: number
  location?: string
  interests: string[]
  personalityTraits: string[]
  preferredCategories: string[]
  reviewStyle?: string
  pastReviews?: { itemId: string; rating: number; text: string }[]
}

export interface Product {
  id: string
  title: string
  category: string
  description: string
  tags: string[]
  metadata?: Record<string, string>
}

export interface GeneratedReview {
  rating: number
  text: string
  explanation?: string
}

export interface RecommendationRequest {
  user: UserPersona
  context?: {
    query?: string
    history?: string[]
    category?: string
  }
}

export interface RecommendationItem {
  id: string
  title: string
  category: string
  reason: string
  confidence: number
}

export interface RecommendationResponse {
  recommendations: RecommendationItem[]
  explanation: string
}
