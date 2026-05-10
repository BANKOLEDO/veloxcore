import { Router } from 'express'
import { z } from 'zod'
import { generateJSON } from '../lib/llm'
import { enrichUserWithNigerianContext } from '../lib/nigerian'
import { authMiddleware } from '../middleware/auth'
import { getPool } from '../db/index.js'
import type { GeneratedReview } from '../types'

const router: Router = Router()

const reviewSchema = z.object({
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
  product: z.object({
    id: z.string(),
    title: z.string(),
    category: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    metadata: z.record(z.string()).optional(),
  }),
})

router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user!
    const { user, product } = reviewSchema.parse(req.body)

    const nigerianContext = enrichUserWithNigerianContext({
      name: user.name,
      location: user.location,
      interests: user.interests,
    })

    const prompt = `
[AGENTIC WORKFLOW — STEP 1: PERSONA ANALYSIS]
Analyse this user's deep preferences, behavioural patterns, and identity:

User Profile:
- Name: ${user.name}${user.age ? `  |  Age: ${user.age}` : ''}${user.location ? `  |  Location: ${user.location}` : ''}
- Interests: ${user.interests.join(', ')}
- Personality Traits: ${user.personalityTraits.join(', ')}
- Preferred Categories: ${user.preferredCategories.join(', ')}
${user.reviewStyle ? `- Review Style: ${user.reviewStyle}` : ''}

${nigerianContext}

${user.pastReviews && user.pastReviews.length > 0 ? `Past Review Behaviour:\n${user.pastReviews.map((r) => `  • "${r.text}" — rated ${r.rating}/5`).join('\n')}\n\nAnalysed patterns: Average rating = ${(user.pastReviews.reduce((s, r) => s + r.rating, 0) / user.pastReviews.length).toFixed(1)}/5. ${getRatingTrend(user.pastReviews)}` : 'No past reviews (cold-start). Infer preferences from persona traits and interests.'}

[AGENTIC WORKFLOW — STEP 2: PRODUCT ANALYSIS]
Analyse the product and identify which features matter most to THIS specific user:

Product:
- Title: ${product.title}
- Category: ${product.category}
- Description: ${product.description}
- Tags: ${product.tags.join(', ')}

Key product attributes that align (or conflict) with this user's known preferences:
1. Category match: ${user.preferredCategories.some((c) => product.category.toLowerCase().includes(c.toLowerCase())) ? 'STRONG MATCH' : 'CROSS-DOMAIN'}
2. Interest alignment: Evaluate how this connects to "${user.interests.join(', ')}"
3. Quality markers: Based on product description

[AGENTIC WORKFLOW — STEP 3: REASONING]
Think step by step:
1. Would this user actually buy/consume this product? Why?
2. What specific aspects would they love or hate?
3. What rating reflects their genuine opinion (not all 5s)?
4. What unique personal details would they mention?

[AGENTIC WORKFLOW — STEP 4: REVIEW GENERATION]
Now write the review AS THIS USER. Match their:
- Vocabulary and sentence structure
- Cultural references and local context
- Emotional tone (enthusiastic, critical, measured, humorous)
- Rating behaviour (generous, harsh, middle-of-the-road)

IMPORTANT: Be realistic. Not everything gets 5 stars. Reflect real Nigerian user behaviour — some things will disappoint, some will delight. Use Nigerian Pidgin and slang naturally where appropriate.

Respond in JSON format:
{
  "rating": <number 1-5>,
  "text": "<review in the user's authentic voice, 2-4 paragraphs>",
  "explanation": "<brief reasoning of why this user would rate this way>",
  "reasoningSteps": [
    "<step 1 insight>",
    "<step 2 insight>",
    "<step 3 insight>"
  ]
}
`

    const system = `You are a behavioural simulation engine. Your purpose is to simulate realistic user reviews by deeply understanding human psychology, cultural context, and individual preferences.

You excel at:
- Building rich psychological profiles from limited data
- Understanding Nigerian cultural context (food, music, lifestyle, Pidgin English)
- Generating reviews that are indistinguishable from real human writing
- Being honest — not all products get 5 stars, not all users are happy
- Capturing authentic Nigerian voice, slang, and perspective

You analyse step by step before generating, and your outputs reflect genuine behavioural fidelity.`

    const review = await generateJSON<GeneratedReview & { reasoningSteps?: string[] }>(prompt, system)

    await getPool().query(
      `INSERT INTO reviews (user_id, product_id, product_title, product_category, product_description, rating, text, explanation, reasoning_steps)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        userId,
        product.id,
        product.title,
        product.category,
        product.description,
        review.rating,
        review.text,
        review.explanation,
        review.reasoningSteps ? JSON.stringify(review.reasoningSteps) : null,
      ]
    )

    res.json({ ...review, saved: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: err.errors })
      return
    }
    console.error('reviews error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/history', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user!
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50))
    const offset = (page - 1) * limit

    const countResult = await getPool().query(
      'SELECT COUNT(*) FROM reviews WHERE user_id = $1', [userId]
    )
    const result = await getPool().query(
      'SELECT * FROM reviews WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    )
    res.json({
      reviews: result.rows,
      total: parseInt(countResult.rows[0].count, 10),
      page,
      limit,
    })
  } catch (err) {
    console.error('review history error:', err)
    res.status(500).json({ error: 'Failed to load history' })
  }
})

router.delete('/history/:id', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user!
    const { id } = req.params
    const result = await getPool().query(
      'DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]
    )
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Review not found' })
      return
    }
    res.json({ success: true })
  } catch (err) {
    console.error('review delete error:', err)
    res.status(500).json({ error: 'Failed to delete review' })
  }
})

function getRatingTrend(reviews: { rating: number }[]): string {
  if (reviews.length < 3) return 'Insufficient data for trend analysis'
  const recent = reviews.slice(-3)
  const avg = recent.reduce((s, r) => s + r.rating, 0) / recent.length
  if (avg >= 4) return 'Tends to be generous'
  if (avg >= 3) return 'Moderate — rates fairly'
  return 'Tends to be critical'
}

export default router
