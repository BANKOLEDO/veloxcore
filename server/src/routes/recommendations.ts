import { Router } from 'express'
import { z } from 'zod'
import { generateJSON } from '../lib/llm'
import {
  getCatalog,
  getCategories,
  searchCatalog,
  getCatalogByCategory,
  type CatalogItem,
} from '../lib/catalog'
import { enrichUserWithNigerianContext } from '../lib/nigerian'
import { authMiddleware } from '../middleware/auth'
import { getPool } from '../db/index.js'
import type { RecommendationResponse } from '../types'

const router: Router = Router()

const recommendSchema = z.object({
  user: z.object({
    name: z.string(),
    age: z.number().optional(),
    location: z.string().optional(),
    interests: z.array(z.string()),
    personalityTraits: z.array(z.string()),
    preferredCategories: z.array(z.string()),
    reviewStyle: z.string().optional(),
    pastReviews: z
      .array(
        z.object({
          itemId: z.string(),
          rating: z.number(),
          text: z.string(),
        }),
      )
      .optional(),
  }),
  context: z
    .object({
      query: z.string().optional(),
      history: z.array(z.string()).optional(),
      category: z.string().optional(),
    })
    .optional(),
})

const AVAILABLE_CATEGORIES = getCategories()
const CATALOG_PREVIEW = getCatalog().map((item) => ({
  id: item.id,
  title: item.title,
  category: item.category,
  tags: item.tags,
  price: item.price,
}))

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user!
    const { user, context } = recommendSchema.parse(req.body)

    const nigerianContext = enrichUserWithNigerianContext({
      name: user.name,
      location: user.location,
      interests: user.interests,
    })

    const categoryFilter = context?.category
      ? getCatalogByCategory(context.category)
      : null
    const queryFilter = context?.query ? searchCatalog(context.query) : null

    const filteredItems = mergeFilters(categoryFilter, queryFilter) ?? CATALOG_PREVIEW

    const catalogSnapshot = filteredItems.slice(0, 30)

    const prompt = `
[AGENTIC WORKFLOW — STEP 1: USER MODELLING]
Build a deep psychological and contextual profile:

User Profile:
- Name: ${user.name}${user.age ? `  |  Age: ${user.age}` : ''}${user.location ? `  |  Location: ${user.location}` : ''}
- Interests: ${user.interests.join(', ')}
- Personality: ${user.personalityTraits.join(', ')}
- Preferred Categories: ${user.preferredCategories.join(', ')}

${nigerianContext}

${user.pastReviews && user.pastReviews.length > 0 ? `Historical Preferences:\n${user.pastReviews.map((r) => `  • "${r.text}" — ${r.rating}/5`).join('\n')}` : '⚠️ COLD-START USER — No history available. Infer everything from personality traits, stated interests, and cultural context.'}

${context?.query ? `User Query: "${context.query}"` : ''}
${context?.category ? `Requested Category: ${context.category}` : ''}
${context?.history ? `Conversation History:\n${context.history.map((h, i) => `  [${i + 1}] ${h}`).join('\n')}` : ''}

[AGENTIC WORKFLOW — STEP 2: PRODUCT SPACE ANALYSIS]
Available catalog (${filteredItems.length} items matching criteria):

${JSON.stringify(catalogSnapshot, null, 2)}

Available categories: ${AVAILABLE_CATEGORIES.map((c) => `${c.name} (${c.count} items)`).join(', ')}

Analyse:
1. Which items genuinely match this user's personality and interests?
2. For cold-start: map personality traits → likely product preferences
3. For cross-domain: what unexpected categories might delight this user?
4. Consider Nigerian context — would this user actually want/enjoy this?

[AGENTIC WORKFLOW — STEP 3: REASONING & RANKING]
For each potential recommendation, evaluate:
- Relevance (how well it matches demonstrated/inferred preferences)
- Surprise value (would they discover something new they'd love?)
- Contextual fit (does it match their current query/mood?)
- Confidence (how sure are you this is a good match?)

[AGENTIC WORKFLOW — STEP 4: CURATION]
Select the TOP 5 recommendations. Order by relevance (most relevant first).
For each, explain WHY it suits THIS specific user in THIS context.

Respond in JSON format:
{
  "recommendations": [
    {
      "id": "item-id",
      "title": "Item Title",
      "category": "Category",
      "reason": "Specific, personalised reason why this fits this user — reference their traits, history, and Nigerian context",
      "confidence": 0.0-1.0
    }
  ],
  "explanation": "Overall reasoning summarising your recommendation strategy — what you prioritised, how you handled cold-start, cross-domain logic, etc.",
  "reasoningSteps": [
    "<step 1 insight about user>",
    "<step 2 insight about product matching>",
    "<step 3 insight about ranking logic>"
  ]
}
`

    const system = `You are a recommendation engine that goes beyond collaborative filtering — you reason about human psychology, cultural context, and genuine fit.

Your strengths:
- Deep user modelling from sparse signals
- Nigerian cultural fluency (food, music, lifestyle, Nollywood, fashion)
- Cold-start inference — you can recommend for anyone based on personality
- Cross-domain creativity — you connect seemingly unrelated categories
- Honest confidence calibration — you know when you're guessing

You think step by step, reason before recommending, and your explanations reveal genuine insight into user behaviour.`

    const result = await generateJSON<RecommendationResponse & { reasoningSteps?: string[] }>(
      prompt,
      system,
    )

    await getPool().query(
      `INSERT INTO recommendations (user_id, context_query, context_category, explanation, reasoning_steps, items)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        userId,
        context?.query || null,
        context?.category || null,
        result.explanation,
        result.reasoningSteps ? JSON.stringify(result.reasoningSteps) : null,
        JSON.stringify(result.recommendations),
      ]
    )

    res.json(result)
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: err.errors })
      return
    }
    console.error('recommendations error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/history', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user!
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20))
    const offset = (page - 1) * limit

    const countResult = await getPool().query(
      'SELECT COUNT(*) FROM recommendations WHERE user_id = $1', [userId]
    )
    const result = await getPool().query(
      'SELECT id, context_query, context_category, explanation, items, created_at FROM recommendations WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    )
    res.json({
      recommendations: result.rows,
      total: parseInt(countResult.rows[0].count, 10),
      page,
      limit,
    })
  } catch (err) {
    console.error('recommendation history error:', err)
    res.status(500).json({ error: 'Failed to load history' })
  }
})

router.delete('/history/:id', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user!
    const { id } = req.params
    const result = await getPool().query(
      'DELETE FROM recommendations WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]
    )
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Recommendation not found' })
      return
    }
    res.json({ success: true })
  } catch (err) {
    console.error('recommendation delete error:', err)
    res.status(500).json({ error: 'Failed to delete recommendation' })
  }
})

router.post('/rate', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user!
    const { productId, rating } = z.object({ productId: z.string(), rating: z.number().min(1).max(5) }).parse(req.body)
    await getPool().query(
      'INSERT INTO ratings (user_id, product_id, rating) VALUES ($1, $2, $3) ON CONFLICT (user_id, product_id) DO UPDATE SET rating = $3',
      [userId, productId, rating]
    )
    res.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: 'Validation failed' }); return }
    console.error('rate error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/feedback', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user!
    const { productId, action, recommendationId } = z.object({
      productId: z.string(),
      action: z.enum(['click', 'purchase', 'dismiss']),
      recommendationId: z.number().optional(),
    }).parse(req.body)
    await getPool().query(
      'INSERT INTO feedback (user_id, recommendation_id, product_id, action) VALUES ($1, $2, $3, $4)',
      [userId, recommendationId || null, productId, action]
    )
    res.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: 'Validation failed' }); return }
    console.error('feedback error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/catalog', (_req, res) => {
  res.json({ categories: AVAILABLE_CATEGORIES, items: CATALOG_PREVIEW })
})

router.get('/catalog/:query', (req, res) => {
  const results = searchCatalog(req.params.query)
  res.json({ results })
})

function mergeFilters(
  a: CatalogItem[] | null,
  b: CatalogItem[] | null,
): CatalogItem[] | null {
  if (!a && !b) return null
  if (!a) return b
  if (!b) return a
  const bIds = new Set(b.map((i) => i.id))
  return a.filter((item) => bIds.has(item.id))
}

export default router
