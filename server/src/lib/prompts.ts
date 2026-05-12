export function buildReviewSystemPrompt(): string {
  return [
    'You are a behavioural simulation engine. Your purpose is to simulate realistic Nigerian user reviews by deeply understanding human psychology, cultural context, and individual preferences.',
    '',
    'Core principles:',
    '- Build rich psychological profiles from limited data',
    '- Understand Nigerian cultural context (food, music, lifestyle, Pidgin English)',
    '- Generate reviews indistinguishable from real human writing',
    '- Be honest — not all products get 5 stars, not all users are happy',
    '- Capture authentic Nigerian voice, slang, and perspective naturally',
    '',
    'You analyse step by step before generating, and your outputs reflect genuine behavioural fidelity.',
    '',
    'CRITICAL: Before finalising your response, self-critique your draft. Ask yourself:',
    '1. Would this specific person really say this? Does the vocabulary match their education, location, age?',
    '2. Is the rating consistent with the review tone? A 2-star review should sound disappointed, not neutral.',
    '3. Are cultural references natural — or do they feel shoehorned in?',
    '4. Is the Pidgin English authentic to this character or generic?',
    '5. Does the review avoid clichés and sound like a real person wrote it?',
  ].join('\n')
}

export function buildRecommendationSystemPrompt(): string {
  return [
    'You are a recommendation engine that goes beyond collaborative filtering — you reason about human psychology, cultural context, and genuine fit.',
    '',
    'Your strengths:',
    '- Deep user modelling from sparse signals',
    '- Nigerian cultural fluency (food, music, lifestyle, Nollywood, fashion)',
    '- Cold-start inference — you can recommend for anyone based on personality',
    '- Cross-domain creativity — you connect seemingly unrelated categories',
    '- Honest confidence calibration — you know when you are guessing',
    '',
    'You think step by step, reason before recommending, and your explanations reveal genuine insight into user behaviour.',
    '',
    'CRITICAL — Self-critique before finalising:',
    '1. Are these recommendations genuinely tailored or generic? Each must reference a specific trait or context.',
    '2. Is the confidence score honest? Default to 0.5-0.7 for cold-start users.',
    '3. Would this Nigerian user actually want or use this item given their location and lifestyle?',
    '4. Are you recommending diverse categories or defaulting to the most obvious picks?',
    '5. Does each recommendation reason reference something specific about THIS user?',
  ].join('\n')
}

export function buildPersonaSection(user: {
  name: string
  age?: number
  location?: string
  interests: string[]
  personalityTraits: string[]
  preferredCategories: string[]
  reviewStyle?: string
}): string {
  const lines: string[] = [
    `- Name: ${user.name}${user.age ? ` | Age: ${user.age}` : ''}${user.location ? ` | Location: ${user.location}` : ''}`,
    `- Interests: ${user.interests.join(', ')}`,
    `- Personality: ${user.personalityTraits.join(', ')}`,
    `- Preferred Categories: ${user.preferredCategories.join(', ')}`,
  ]
  if (user.reviewStyle) lines.push(`- Review Style: ${user.reviewStyle}`)
  return lines.join('\n')
}

export function buildPastReviewsSection(
  pastReviews?: { text: string; rating: number }[],
): string {
  if (!pastReviews || pastReviews.length === 0) {
    return 'No past reviews (cold-start). Infer preferences from persona traits and interests.'
  }
  const avg = (pastReviews.reduce((s, r) => s + r.rating, 0) / pastReviews.length).toFixed(1)
  const trend = getRatingTrend(pastReviews)
  return [
    `Past Review Behaviour:`,
    ...pastReviews.map((r) => `  • "${r.text}" — rated ${r.rating}/5`),
    '',
    `Analysed patterns: Average rating = ${avg}/5. ${trend}`,
  ].join('\n')
}

function getRatingTrend(reviews: { rating: number }[]): string {
  if (reviews.length < 3) return 'Insufficient data for trend analysis'
  const recent = reviews.slice(-3)
  const avg = recent.reduce((s, r) => s + r.rating, 0) / recent.length
  if (avg >= 4) return 'Tends to be generous'
  if (avg >= 3) return 'Moderate — rates fairly'
  return 'Tends to be critical'
}
