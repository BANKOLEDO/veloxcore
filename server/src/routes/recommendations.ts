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
import { buildRecommendationSystemPrompt, buildPersonaSection, buildPastReviewsSection } from '../lib/prompts'
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

    const personaSection = buildPersonaSection(user)
    const pastReviewsSection = buildPastReviewsSection(
      user.pastReviews?.map((r) => ({ text: r.text, rating: r.rating })),
    )

    const prompt = [
      `[AGENTIC WORKFLOW — STEP 1: USER MODELLING]`,
      'Build a deep psychological and contextual profile:',
      '',
      'User Profile:',
      personaSection,
      '',
      nigerianContext,
      '',
      pastReviewsSection,
      '',
      context?.query ? `User Query: "${context.query}"` : '',
      context?.category ? `Requested Category: ${context.category}` : '',
      context?.history ? `Conversation History:\n${context.history.map((h, i) => `  [${i + 1}] ${h}`).join('\n')}` : '',
      '',
      `[AGENTIC WORKFLOW — STEP 2: PRODUCT SPACE ANALYSIS]`,
      `Available catalog (${filteredItems.length} items matching criteria):`,
      '',
      JSON.stringify(catalogSnapshot, null, 2),
      '',
      `Available categories: ${AVAILABLE_CATEGORIES.map((c) => `${c.name} (${c.count} items)`).join(', ')}`,
      '',
      'Analyse:',
      '1. Which items genuinely match this user\'s personality and interests — not just category?',
      '2. For cold-start: map personality traits to likely product preferences (extrovert? analytical? traditional?)',
      '3. For cross-domain: what unexpected categories might genuinely delight this user?',
      '4. Consider Nigerian context — would this user actually want or use this in their daily life?',
      '',
      `[AGENTIC WORKFLOW — STEP 3: REASONING & RANKING]`,
      'For each potential recommendation, evaluate:',
      '- Relevance: how well it matches demonstrated or inferred preferences (weight: high)',
      '- Surprise value: would they discover something new they would genuinely love? (weight: medium)',
      '- Contextual fit: does it match their current query, mood, or situation? (weight: high)',
      '- Confidence: how sure are you this is a good match? Be honest.',
      '',
      `[AGENTIC WORKFLOW — STEP 4: CURATION]`,
      'Select the TOP 5 recommendations. Order by relevance (most relevant first).',
      'For each, explain WHY it suits THIS specific user in THIS context.',
      '',
      `[AGENTIC WORKFLOW — STEP 5: SELF-CRITIQUE]`,
      'Before finalising, critique your own selections:',
      '1. Are these recommendations genuinely tailored or could they apply to anyone?',
      '2. Is the confidence score honest? Default to 0.5-0.7 for cold-start users.',
      '3. Would this Nigerian user actually want or use this given their location and lifestyle?',
      '4. Are you recommending diverse categories or defaulting to the most obvious picks?',
      '5. Does each recommendation reason reference something specific about THIS user?',
      '',
      'If any answer is "no", revise before outputting.',
      '',
      'Respond in JSON format:',
      JSON.stringify({
        recommendations: [
          {
            id: 'item-id',
            title: 'Item Title',
            category: 'Category',
            reason: 'Specific, personalised reason why this fits this user — reference their traits, history, and Nigerian context',
            confidence: 0.85,
          },
        ],
        explanation: 'Overall reasoning summarising your recommendation strategy — what you prioritised, how you handled cold-start, cross-domain logic, etc.',
        reasoningSteps: ['<step 1 insight about user>', '<step 2 insight about product matching>', '<step 3 insight about ranking logic>'],
      }, null, 2),
    ].filter(Boolean).join('\n')

    const system = buildRecommendationSystemPrompt()

    const result = await generateJSON<RecommendationResponse & { reasoningSteps?: string[] }>(
      prompt,
      system,
      { temperature: 0.6 },
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
      ],
    )

    res.json(result)
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Check the form fields and try again.' })
      return
    }
    console.error('recommendations error:', err)
    res.status(500).json({ error: 'The agent hit a snag. Please try again.' })
  }
})

router.get('/history', authMiddleware, async (req, res) => {
  try {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    const { userId } = req.user!
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20))
    const offset = (page - 1) * limit

    const countResult = await getPool().query(
      'SELECT COUNT(*) FROM recommendations WHERE user_id = $1', [userId],
    )
    const result = await getPool().query(
      'SELECT id, context_query, context_category, explanation, items, created_at FROM recommendations WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset],
    )
    res.json({
      recommendations: result.rows,
      total: parseInt(countResult.rows[0].count, 10),
      page,
      limit,
    })
  } catch (err) {
    console.error('recommendation history error:', err)
    res.status(500).json({ error: 'Could not load your history. Please try again.' })
  }
})

router.delete('/history/:id', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user!
    const { id } = req.params
    const result = await getPool().query(
      'DELETE FROM recommendations WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId],
    )
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'That recommendation no longer exists.' })
      return
    }
    res.json({ success: true })
  } catch (err) {
    console.error('recommendation delete error:', err)
    res.status(500).json({ error: 'Could not delete. Please try again.' })
  }
})

router.post('/rate', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user!
    const { productId, rating } = z
      .object({ productId: z.string(), rating: z.number().min(1).max(5) })
      .parse(req.body)
    await getPool().query(
      'INSERT INTO ratings (user_id, product_id, rating) VALUES ($1, $2, $3) ON CONFLICT (user_id, product_id) DO UPDATE SET rating = $3',
      [userId, productId, rating],
    )
    res.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed' })
      return
    }
    console.error('rate error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/feedback', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user!
    const { productId, action, recommendationId } = z
      .object({
        productId: z.string(),
        action: z.enum(['click', 'purchase', 'dismiss']),
        recommendationId: z.number().optional(),
      })
      .parse(req.body)
    await getPool().query(
      'INSERT INTO feedback (user_id, recommendation_id, product_id, action) VALUES ($1, $2, $3, $4)',
      [userId, recommendationId || null, productId, action],
    )
    res.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed' })
      return
    }
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
