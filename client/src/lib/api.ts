const API = import.meta.env.VITE_API_URL || '/api'

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handleResponse(res: Response, friendlyLabel: string) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const serverMsg = body.error
    if (serverMsg) throw new Error(serverMsg)
    if (res.status === 401) throw new Error('Session expired. Sign in again.')
    if (res.status === 429) throw new Error('Too many requests. Wait a moment and try again.')
    if (res.status >= 500) throw new Error(`Something went wrong on our end. Please try again.`)
    throw new Error(`Could not ${friendlyLabel}. Please try again.`)
  }
  return res.json()
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
  return handleResponse(res, 'generate review')
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
  return handleResponse(res, 'get recommendations')
}

export async function getStats() {
  const res = await fetch(`${API}/stats`, { cache: 'no-store' })
  if (!res.ok) return { reviews: 0, recommendations: 0, catalog: 0 }
  return res.json()
}

export async function getCatalog(query?: string) {
  const url = query
    ? `${API}/recommendations/catalog/${encodeURIComponent(query)}`
    : `${API}/recommendations/catalog`
  const res = await fetch(url)
  return handleResponse(res, 'load catalog')
}

export async function getReviewHistory(page = 1, limit = 50) {
  const res = await fetch(
    `${API}/reviews/history?page=${page}&limit=${limit}&_t=${Date.now()}`,
    { headers: authHeaders() },
  )
  return handleResponse(res, 'load history')
}

export async function getRecommendationHistory(page = 1, limit = 20) {
  const res = await fetch(
    `${API}/recommendations/history?page=${page}&limit=${limit}&_t=${Date.now()}`,
    { headers: authHeaders() },
  )
  return handleResponse(res, 'load history')
}

export async function deleteReview(id: number) {
  const res = await fetch(`${API}/reviews/history/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  return handleResponse(res, 'delete review')
}

export async function deleteRecommendation(id: number) {
  const res = await fetch(`${API}/recommendations/history/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  return handleResponse(res, 'delete recommendation')
}

export async function rateProduct(productId: string, rating: number) {
  const res = await fetch(`${API}/recommendations/rate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ productId, rating }),
  })
  return handleResponse(res, 'rate product')
}

export async function sendFeedback(
  productId: string,
  action: 'click' | 'purchase' | 'dismiss',
  recommendationId?: number,
) {
  const res = await fetch(`${API}/recommendations/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ productId, action, recommendationId }),
  })
  return handleResponse(res, 'send feedback')
}
