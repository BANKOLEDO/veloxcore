export interface NigerianPersonaProfile {
  locationInNigeria: string
  occupation: string
  slang: string[]
  culturalReferences: string[]
  commonPhrases: string[]
}

export const NIGERIAN_LOCATIONS = [
  'Lagos Mainland',
  'Lagos Island',
  'Abuja',
  'Port Harcourt',
  'Ibadan',
  'Kano',
  'Enugu',
  'Aba',
  'Benin City',
  'Kaduna',
  'Warri',
  'Abeokuta',
  'Jos',
  'Calabar',
  'Owerri',
]

export const NIGERIAN_SLANG: Record<string, string[]> = {
  lagos: ['Abeg', 'Wahala', 'Sha', 'Jare', 'Omo', 'Guy', 'Babe', 'Sharp sharp', 'Comot', 'No wahala'],
  general: ['Abeg', 'Omo', 'Sha', 'Bros', 'Sis', 'Wahala', 'Jare', 'Na wa o', 'ehn', 'sebi'],
  pidgin: ['How far?', 'Wetin dey?', 'I no sabi', 'You get me?', 'Oya na', 'Tufiakwa', 'Chei', 'Abi?', 'E don do'],
}

export const CULTURAL_REFERENCES = [
  'NEPA (power supply)',
  'Okada (motorcycle taxi)',
  'Danfo (Lagos bus)',
  'Mama Put (local restaurant)',
  'Pure Water (sachet water)',
  'Felabration',
  'Detty December',
  'Owambe (party)',
  'Sapa (being broke)',
  'Gbese (debt/trouble)',
  "Ajebutter (privileged person)",
  "Area Boy (local thug)",
  'Oyinbo (foreigner/white person)',
  'Alaye (guy/fellow)',
]

export const NIGERIAN_FOOD_REFERENCES = [
  'Jollof rice with plantain',
  'Suya from the roadside',
  "Mama Put's lunch special",
  'Fresh palm wine',
  'Zobo drink',
  'Chapman cocktail',
  'Pounded yam and egusi',
  'Ofada rice and ayamase',
]

export function enrichUserWithNigerianContext(persona: {
  name?: string
  location?: string
  interests?: string[]
}): string {
  const location = persona.location || 'Lagos'
  const locationNorm = location.toLowerCase()

  const regionPhrases: string[] = []
  if (locationNorm.includes('lagos')) {
    regionPhrases.push('Lagos hustle', 'mainland vibe', 'island lifestyle', 'traffic wahala')
  } else if (locationNorm.includes('abuja')) {
    regionPhrases.push('FCC calm', 'government area', 'embassy row')
  } else if (locationNorm.includes('portharcourt') || locationNorm.includes('port')) {
    regionPhrases.push('garden city', 'oil city lifestyle')
  } else if (locationNorm.includes('ibadan')) {
    regionPhrases.push('ancient city', 'UI vibe', 'bodija market')
  } else if (locationNorm.includes('kano')) {
    regionPhrases.push('Kano city life', 'Kurmi market', 'northern hospitality')
  } else if (locationNorm.includes('enugu')) {
    regionPhrases.push('coal city', 'eastern heartland')
  }

  return [
    location ? `Based in ${location} — Nigeria's ${getLocationDescription(location)}` : '',
    `Cultural context: ${persona.interests?.some(i => i.toLowerCase().includes('food') || i.toLowerCase().includes('party')) ? 'Loves Owambe parties and good food.' : ''} Familiar with Nigerian lifestyle including ${CULTURAL_REFERENCES.slice(0, 3).join(', ')}.`,
    regionPhrases.length > 0 ? `Local flavour: ${regionPhrases.join(', ')}.` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

function getLocationDescription(location: string): string {
  const map: Record<string, string> = {
    lagos: 'commercial nerve centre and entertainment capital',
    abuja: 'capital city in the Federal Capital Territory',
    'port harcourt': 'oil-rich Garden City in the Niger Delta',
    ibadan: 'ancient city and largest city in West Africa',
    kano: 'ancient commercial hub of Northern Nigeria',
    enugu: 'Coal City, heart of Igboland',
    warri: 'crude oil capital, famous for its unique Pidgin',
    benin: 'historic city of the Benin Kingdom',
    abeokuta: 'rock city, gateway to the West',
  }
  for (const [key, desc] of Object.entries(map)) {
    if (location.toLowerCase().includes(key)) return desc
  }
  return 'vibrant Nigerian city'
}
