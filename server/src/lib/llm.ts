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

const RETRY_MAX = 3
const RETRY_BASE_MS = 1000

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

interface GenerateOptions {
  temperature?: number
  maxTokens?: number
}

export async function generate(
  prompt: string,
  system?: string,
  opts?: GenerateOptions,
): Promise<string> {
  const res = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: system ?? 'You are a helpful assistant.' },
      { role: 'user', content: prompt },
    ],
    temperature: opts?.temperature ?? 0.7,
    max_tokens: opts?.maxTokens ?? 2048,
  })
  return res.choices[0]?.message?.content ?? ''
}

/**
 * Walk through the JSON character-by-character and escape literal
 * newlines/carriage returns that appear inside string values.
 * JSON forbids unescaped control chars (U+0000–U+001F) inside strings,
 * but local LLMs frequently output them.
 */
function escapeNewlinesInStrings(raw: string): string {
  let out = ''
  let inString = false
  let escape = false

  for (const ch of raw) {
    if (escape) {
      escape = false
      out += ch
      continue
    }
    if (ch === '\\') {
      escape = true
      out += ch
      continue
    }
    if (ch === '"') {
      inString = !inString
      out += ch
      continue
    }
    if (inString && (ch === '\n' || ch === '\r')) {
      out += '\\n'
      continue
    }
    out += ch
  }

  return out
}

function extractJSON(raw: string): string {
  let cleaned = raw
    .replace(/```json\s*/gi, '')
    .replace(/```\s*$/gm, '')
    .replace(/```/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
    .trim()

  cleaned = escapeNewlinesInStrings(cleaned)

  const braceMatch = cleaned.match(/\{[\s\S]*\}/)
  if (braceMatch) {
    cleaned = braceMatch[0]
  }

  return cleaned
}

export async function generateJSON<T>(
  prompt: string,
  system?: string,
  opts?: GenerateOptions,
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < RETRY_MAX; attempt++) {
    if (attempt > 0) {
      const delay = RETRY_BASE_MS * Math.pow(2, attempt - 1)
      console.warn(`LLM retry ${attempt + 1}/${RETRY_MAX} after ${delay}ms (${lastError?.message})`)
      await sleep(delay)
    }

    try {
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
        temperature: opts?.temperature ?? 0.7,
        max_tokens: opts?.maxTokens ?? 4096,
      })

      const content = res.choices[0]?.message?.content ?? '{}'
      const cleaned = extractJSON(content)

      const parsed = JSON.parse(cleaned) as T
      return parsed
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
    }
  }

  throw lastError ?? new Error('LLM generation failed after retries')
}

export async function generateStreaming(
  prompt: string,
  system?: string,
  onToken?: (token: string) => void,
  opts?: GenerateOptions,
): Promise<string> {
  const stream = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: system ?? 'You are a helpful assistant.' },
      { role: 'user', content: prompt },
    ],
    temperature: opts?.temperature ?? 0.7,
    max_tokens: opts?.maxTokens ?? 4096,
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
