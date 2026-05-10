import https from 'node:https'
import OpenAI from 'openai'

const baseUrl = process.env.LLM_BASE_URL || 'http://localhost:11434/v1'
const isLocalProvider = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')

const client = new OpenAI({
  apiKey: process.env.LLM_API_KEY || 'ollama',
  baseURL: baseUrl,
  timeout: 60000,
  ...(isLocalProvider ? { httpAgent: new https.Agent({ rejectUnauthorized: false }) } : {}),
})

const MODEL = process.env.LLM_MODEL || 'qwen2.5'

export async function generate(
  prompt: string,
  system?: string,
): Promise<string> {
  const res = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: system ?? 'You are a helpful assistant.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 2048,
  })
  return res.choices[0]?.message?.content ?? ''
}

export async function generateJSON<T>(
  prompt: string,
  system?: string,
): Promise<T> {
  const res = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content:
          system ??
          'You are a helpful assistant that responds in valid JSON only.',
      },
      { role: 'user', content: prompt },
    ],
    response_format: MODEL.includes('gpt') ? { type: 'json_object' } : undefined,
    temperature: 0.7,
    max_tokens: 4096,
  })

  const content = res.choices[0]?.message?.content ?? '{}'

  const cleaned = content
    .replace(/```json\s*/gi, '')
    .replace(/```\s*$/gm, '')
    .replace(/```/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
    .trim()

  try {
    return JSON.parse(cleaned) as T
  } catch {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const sanitized = jsonMatch[0].replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
      return JSON.parse(sanitized) as T
    }
    throw new Error(`Failed to parse LLM response as JSON: ${content.slice(0, 200)}`)
  }
}

export async function generateStreaming(
  prompt: string,
  system?: string,
  onToken?: (token: string) => void,
): Promise<string> {
  const stream = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: system ?? 'You are a helpful assistant.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 4096,
    stream: true,
  })

  let full = ''
  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content ?? ''
    full += token
    onToken?.(token)
  }
  return full
}
