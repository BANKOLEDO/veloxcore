import { rm, cp, stat } from 'node:fs/promises'
import path from 'node:path'

function computePaths() {
  const cwd = process.cwd()
  const base = path.basename(cwd)

  // Supports two common Vercel setups:
  // - Root Directory = repo root: build outputs to client/dist
  // - Root Directory = client: build outputs to dist
  if (base === 'client') {
    return {
      src: path.join(cwd, 'dist'),
      dest: path.join(cwd, '..', 'dist'),
      expectedHint: '"dist" (when Root Directory is client)',
    }
  }

  return {
    src: path.join(cwd, 'client', 'dist'),
    dest: path.join(cwd, 'dist'),
    expectedHint: '"client/dist" (when Root Directory is repo root)',
  }
}

async function main() {
  const { src, dest, expectedHint } = computePaths()

  try {
    const srcStat = await stat(src)
    if (!srcStat.isDirectory()) {
      throw new Error(`${src} is not a directory`)
    }
  } catch (err) {
    throw new Error(
      `Expected build output at ${src} but it was not found.\n` +
        `Make sure the client build outputs to ${expectedHint}.\n` +
        `Original error: ${err instanceof Error ? err.message : String(err)}`
    )
  }

  await rm(dest, { recursive: true, force: true })
  await cp(src, dest, { recursive: true })
}

await main()
