const API = import.meta.env.VITE_API_URL || '/api'

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function generateReview(
  user: Record<string, unknown>,
  product: Record<string, unknown>,
) {
  const res = await fetch(`${API}/reviews/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ user, product }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Request failed (${res.status})`)
  }
  return res.json()
}

export async function getRecommendations(
  user: Record<string, unknown>,
  context?: Record<string, unknown>,
) {
  const res = await fetch(`${API}/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ user, context }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Request failed (${res.status})`)
  }
  return res.json()
}

export async function getCatalog(query?: string) {
  const url = query
    ? `${API}/recommendations/catalog/${encodeURIComponent(query)}`
    : `${API}/recommendations/catalog`
  const res = await fetch(url)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Catalog request failed (${res.status})`)
  }
  return res.json()
}

export async function getReviewHistory(page = 1, limit = 50) {
  const res = await fetch(`${API}/reviews/history?page=${page}&limit=${limit}&_t=${Date.now()}`, { headers: authHeaders() })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Failed to load history (${res.status})`)
  }
  return res.json()
}

export async function getRecommendationHistory(page = 1, limit = 20) {
  const res = await fetch(`${API}/recommendations/history?page=${page}&limit=${limit}&_t=${Date.now()}`, { headers: authHeaders() })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Failed to load history (${res.status})`)
  }
  return res.json()
}

export async function deleteReview(id: number) {
  const res = await fetch(`${API}/reviews/history/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Failed to delete (${res.status})`)
  }
  return res.json()
}

export async function deleteRecommendation(id: number) {
  const res = await fetch(`${API}/recommendations/history/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Failed to delete (${res.status})`)
  }
  return res.json()
}

export async function rateProduct(productId: string, rating: number) {
  const res = await fetch(`${API}/recommendations/rate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ productId, rating }),
  })
  return res.json()
}

export async function sendFeedback(productId: string, action: 'click' | 'purchase' | 'dismiss', recommendationId?: number) {
  const res = await fetch(`${API}/recommendations/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ productId, action, recommendationId }),
  })
  return res.json()
}
