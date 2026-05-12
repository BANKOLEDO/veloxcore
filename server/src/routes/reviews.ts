import { Router } from 'express'
import { z } from 'zod'
import { generateJSON } from '../lib/llm'
import { enrichUserWithNigerianContext } from '../lib/nigerian'
import { buildReviewSystemPrompt, buildPersonaSection, buildPastReviewsSection } from '../lib/prompts'
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

    const personaSection = buildPersonaSection(user)
    const pastReviewsSection = buildPastReviewsSection(
      user.pastReviews?.map((r) => ({ text: r.text, rating: r.rating })),
    )

    const categoryMatch = user.preferredCategories.some((c) =>
      product.category.toLowerCase().includes(c.toLowerCase()),
    )

    const prompt = [
      `[AGENTIC WORKFLOW — STEP 1: PERSONA ANALYSIS]`,
      `Analyse this user's deep preferences, behavioural patterns, and identity:`,
      '',
      'User Profile:',
      personaSection,
      '',
      nigerianContext,
      '',
      pastReviewsSection,
      '',
      `[AGENTIC WORKFLOW — STEP 2: PRODUCT ANALYSIS]`,
      `Analyse the product and identify which features matter most to THIS specific user:`,
      '',
      'Product:',
      `- Title: ${product.title}`,
      `- Category: ${product.category}`,
      `- Description: ${product.description}`,
      `- Tags: ${product.tags.join(', ')}`,
      '',
      'Key product attributes that align (or conflict) with this user\'s known preferences:',
      `1. Category match: ${categoryMatch ? 'STRONG MATCH — within preferred territory' : 'CROSS-DOMAIN — may need more justification'}`,
      `2. Interest alignment: How does this connect to "${user.interests.join(', ')}"?`,
      `3. Quality markers: Based on product description, assess value proposition`,
      '',
      `[AGENTIC WORKFLOW — STEP 3: REASONING]`,
      'Think step by step:',
      '1. Would this user actually buy or consume this product? Why or why not?',
      '2. What specific aspects would they love or hate — reference real details from the description?',
      '3. What rating reflects their genuine, honest opinion (not all 5s, not all 1s — be nuanced)?',
      '4. What unique personal details, experiences, or cultural references would they mention?',
      '',
      `[AGENTIC WORKFLOW — STEP 4: REVIEW GENERATION]`,
      'Now write the review AS THIS USER. Match their:',
      '- Vocabulary and sentence structure (educated? streetwise? formal?)',
      '- Cultural references and local context (Nigerian life, not generic)',
      '- Emotional tone (enthusiastic, critical, measured, humorous, disappointed)',
      '- Rating behaviour (generous, harsh, middle-of-the-road based on their history)',
      '',
      'IMPORTANT — Realism rules:',
      '- Not everything gets 5 stars. Reflect real Nigerian user behaviour.',
      '- Some things disappoint, some delight. Be nuanced.',
      '- Use Nigerian Pidgin and slang naturally, not forced.',
      '- The review should sound like a real person wrote it — typos, sentence fragments, personality.',
      '',
      `[AGENTIC WORKFLOW — STEP 5: SELF-CRITIQUE]`,
      'Before finalising, critique your own draft:',
      '1. Is this review genuinely specific to this persona, or is it generic?',
      '2. Would this person actually use these words and phrases?',
      '3. Is the rating consistent with the review\'s emotional tone?',
      '4. Are the cultural references authentic or clichéd?',
      '5. If you were this user\'s friend, would you believe they wrote this?',
      '',
      'If any answer is "no", revise the review before outputting.',
      '',
      'Respond in JSON format:',
      JSON.stringify({
        rating: '<number 1-5>',
        text: '<review in the user\'s authentic voice, 2-4 paragraphs>',
        explanation: '<brief reasoning of why this user would rate this way>',
        reasoningSteps: ['<step 1 insight>', '<step 2 insight>', '<step 3 insight>'],
      }, null, 2),
    ].join('\n')

    const system = buildReviewSystemPrompt()

    const review = await generateJSON<GeneratedReview & { reasoningSteps?: string[] }>(
      prompt,
      system,
      { temperature: 0.65 },
    )

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
      ],
    )

    res.json({ ...review, saved: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Check the form fields and try again.' })
      return
    }
    console.error('reviews error:', err)
    res.status(500).json({ error: 'The agent hit a snag. Please try again.' })
  }
})

router.get('/history', authMiddleware, async (req, res) => {
  try {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    const { userId } = req.user!
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50))
    const offset = (page - 1) * limit

    const countResult = await getPool().query(
      'SELECT COUNT(*) FROM reviews WHERE user_id = $1', [userId],
    )
    const result = await getPool().query(
      'SELECT * FROM reviews WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset],
    )
    res.json({
      reviews: result.rows,
      total: parseInt(countResult.rows[0].count, 10),
      page,
      limit,
    })
  } catch (err) {
    console.error('review history error:', err)
    res.status(500).json({ error: 'Could not load your history. Please try again.' })
  }
})

router.delete('/history/:id', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user!
    const { id } = req.params
    const result = await getPool().query(
      'DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId],
    )
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'That review no longer exists.' })
      return
    }
    res.json({ success: true })
  } catch (err) {
    console.error('review delete error:', err)
    res.status(500).json({ error: 'Could not delete. Please try again.' })
  }
})

export default router
