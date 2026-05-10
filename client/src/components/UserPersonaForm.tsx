import { useState } from 'react'
import type { ReactNode } from 'react'

export interface PersonaData {
  name: string
  age: string
  location: string
  interests: string
  personalityTraits: string
  preferredCategories: string
  reviewStyle: string
  pastReviews: string
}

interface Props {
  onSubmit: (data: PersonaData) => void
  loading?: boolean
  showReviewStyle?: boolean
  productSection?: ReactNode
}

const DEFAULT_PERSONAS: { label: string; data: Partial<PersonaData> }[] = [
  {
    label: 'Lagos Tech Bro',
    data: {
      name: 'Chidi Okonkwo', age: '27', location: 'Lagos',
      interests: 'technology, music, startups, fashion',
      personalityTraits: 'ambitious, opinionated, trend-conscious, impatient',
      preferredCategories: 'Electronics, Music, Fashion',
      reviewStyle: 'blunt and energetic, uses Pidgin slang',
    },
  },
  {
    label: 'Abuja Foodie',
    data: {
      name: 'Zainab Usman', age: '31', location: 'Abuja',
      interests: 'food, travel, books, photography',
      personalityTraits: 'detail-oriented, warm, expressive, discerning',
      preferredCategories: 'Nigerian Food, Books, Drinks',
      reviewStyle: 'descriptive and thoughtful',
    },
  },
  {
    label: 'PH Student',
    data: {
      name: 'Tamuno Briggs', age: '21', location: 'Port Harcourt',
      interests: 'movies, music, fashion, social media',
      personalityTraits: 'energetic, social, honest, budget-conscious',
      preferredCategories: 'Nollywood Movies, Music, Fashion',
      reviewStyle: 'casual and relatable',
    },
  },
  {
    label: 'Ibadan Academic',
    data: {
      name: 'Folake Adeyemi', age: '45', location: 'Ibadan',
      interests: 'literature, history, politics, classical music',
      personalityTraits: 'analytical, reserved, well-read, critical',
      preferredCategories: 'Books, Music',
      reviewStyle: 'formal and analytical',
    },
  },
]

export default function UserPersonaForm({
  onSubmit, loading, showReviewStyle = true, productSection,
}: Props) {
  const [form, setForm] = useState<PersonaData>({
    name: '', age: '', location: '', interests: '',
    personalityTraits: '', preferredCategories: '',
    reviewStyle: '', pastReviews: '',
  })

  const set = (key: keyof PersonaData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const loadPersona = (p: Partial<PersonaData>) => setForm((f) => ({ ...f, ...p }))

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(form) }

  const input = 'w-full border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm text-white placeholder-neutral-700 outline-none transition-colors hover:border-neutral-600 focus:border-white'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap gap-1">
        {DEFAULT_PERSONAS.map((p) => (
          <button key={p.label} type="button" onClick={() => loadPersona(p.data)}
            className="border border-neutral-800 px-2.5 py-1 text-[11px] text-neutral-500 transition-colors hover:border-neutral-500 hover:text-neutral-300"
          >{p.label}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="persona-name" className="mb-1 block text-[10px] uppercase tracking-[0.15em] text-neutral-600">Name</label>
          <input id="persona-name" className={input} value={form.name} onChange={set('name')} placeholder="e.g. Chidi Okonkwo" required />
        </div>
        <div>
          <label htmlFor="persona-age" className="mb-1 block text-[10px] uppercase tracking-[0.15em] text-neutral-600">Age</label>
          <input id="persona-age" className={input} type="number" value={form.age} onChange={set('age')} placeholder="e.g. 27" />
        </div>
      </div>

      {[
        ['Location', 'location', 'e.g. Lagos, Abuja, PH'],
        ['Interests', 'interests', 'e.g. tech, food, music'],
        ['Personality', 'personalityTraits', 'e.g. analytical, social, critical'],
        ['Categories', 'preferredCategories', 'e.g. Books, Music, Food'],
      ].map(([label, key, placeholder]) => (
        <div key={key}>
          <label htmlFor={`persona-${key}`} className="mb-1 block text-[10px] uppercase tracking-[0.15em] text-neutral-600">{label}</label>
          <input id={`persona-${key}`} className={input} value={form[key as keyof PersonaData]} onChange={set(key as keyof PersonaData)} placeholder={placeholder} />
        </div>
      ))}

      {showReviewStyle && (
        <div>
          <label htmlFor="persona-reviewStyle" className="mb-1 block text-[10px] uppercase tracking-[0.15em] text-neutral-600">Review Style</label>
          <input id="persona-reviewStyle" className={input} value={form.reviewStyle} onChange={set('reviewStyle')} placeholder="e.g. descriptive, blunt, formal" />
        </div>
      )}

      <div>
        <label htmlFor="persona-pastReviews" className="mb-1 block text-[10px] uppercase tracking-[0.15em] text-neutral-600">
          Past Reviews <span className="text-neutral-800">(one per line: text | rating)</span>
        </label>
        <textarea id="persona-pastReviews" className={input + ' resize-none'} rows={2} value={form.pastReviews} onChange={set('pastReviews')} placeholder='"This product is amazing" | 5' />
      </div>

      {productSection}

      <button type="submit" disabled={loading}
        className="w-full border border-white bg-white px-4 py-2.5 text-sm font-medium text-neutral-950 transition-all hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {loading ? 'Generating...' : showReviewStyle ? 'Generate Review' : 'Get Recommendations'}
      </button>
    </form>
  )
}
