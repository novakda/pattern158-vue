// scripts/editorial/config.ts
// Phase 47 contract — real implementation in Plan 47-02 (loadEditorialConfig body).
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (use injected/fixed timestamps)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of)

import * as fs from 'node:fs'
import * as path from 'node:path'

export interface EditorialConfig {
  readonly outputPath: string
  readonly baseUrl: string
  readonly headful: boolean
  readonly mirror: boolean
  readonly exhibitsJsonPath: string
}

export class ConfigError extends Error {
  public readonly cause?: unknown
  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'ConfigError'
    this.cause = cause
  }
}

export interface RawArgs {
  readonly output?: string
  readonly baseUrl?: string
  readonly headful?: boolean
  readonly mirror?: boolean
  readonly help?: boolean
}

export const HELP_TEXT: string = [
  'editorial:capture — snapshot pattern158.solutions as a single Markdown document',
  '',
  'Usage:',
  '  pnpm editorial:capture --output <path> [--base-url <url>] [--headful] [--mirror]',
  '',
  'Flags:',
  '  --output <path>    Absolute or relative path to the output Markdown file.',
  '                     Required unless EDITORIAL_OUT_PATH env var is set.',
  '  --base-url <url>   Site root to capture. Must be https://. Env fallback: EDITORIAL_BASE_URL.',
  '                     Default: https://pattern158.solutions',
  '  --headful          Launch Chromium with a visible window (for Cloudflare interstitial fallback).',
  '                     Default: headless.',
  '  --mirror           Also write the capture to .planning/research/site-editorial-capture.md',
  '                     Default: no mirror.',
  '  --help, -h         Print this help and exit 0.',
  '',
  'Environment variables:',
  '  EDITORIAL_OUT_PATH  Fallback for --output.',
  '  EDITORIAL_BASE_URL  Fallback for --base-url.',
  '',
  'Exit codes:',
  '  0  success (or --help)',
  '  1  runtime error (capture/convert/write failure)',
  '  2  configuration error (missing required flag, invalid path, invalid URL)',
].join('\n')

export function parseArgs(argv: readonly string[]): RawArgs {
  const result: {
    output?: string
    baseUrl?: string
    headful?: boolean
    mirror?: boolean
    help?: boolean
  } = {}
  let i = 0
  while (i < argv.length) {
    const token = argv[i]
    switch (token) {
      case '--output': {
        const value = argv[i + 1]
        if (value === undefined || value.startsWith('--')) {
          throw new ConfigError('--output requires a value (path to output Markdown file)')
        }
        result.output = value
        i += 2
        break
      }
      case '--base-url': {
        const value = argv[i + 1]
        if (value === undefined || value.startsWith('--')) {
          throw new ConfigError('--base-url requires a value (site root URL)')
        }
        result.baseUrl = value
        i += 2
        break
      }
      case '--headful': {
        result.headful = true
        i += 1
        break
      }
      case '--mirror': {
        result.mirror = true
        i += 1
        break
      }
      case '--help':
      case '-h': {
        result.help = true
        i += 1
        break
      }
      default: {
        throw new ConfigError(`unknown flag: ${token}`)
      }
    }
  }
  return result
}

const DEFAULT_BASE_URL = 'https://pattern158.solutions'

export function mergeConfig(
  rawArgs: RawArgs,
  env: NodeJS.ProcessEnv,
): EditorialConfig {
  const outputRaw = rawArgs.output ?? env.EDITORIAL_OUT_PATH
  if (outputRaw === undefined || outputRaw === '') {
    throw new ConfigError(
      'missing: --output / EDITORIAL_OUT_PATH (required — path to output Markdown file)',
    )
  }
  const baseUrlRaw = rawArgs.baseUrl ?? env.EDITORIAL_BASE_URL ?? DEFAULT_BASE_URL
  const baseUrl = baseUrlRaw.replace(/\/+$/, '') // strip trailing slashes
  const outputPath = path.isAbsolute(outputRaw)
    ? outputRaw
    : path.resolve(process.cwd(), outputRaw)
  const exhibitsJsonPath = path.resolve(
    process.cwd(),
    'src/data/json/exhibits.json',
  )
  return {
    outputPath,
    baseUrl,
    headful: rawArgs.headful ?? false,
    mirror: rawArgs.mirror ?? false,
    exhibitsJsonPath,
  }
}

export function runPreflight(config: EditorialConfig): void {
  // (a) outputPath must be absolute.
  if (!path.isAbsolute(config.outputPath)) {
    throw new ConfigError(
      `outputPath must be absolute: got "${config.outputPath}"`,
    )
  }
  // (b + c) parent directory exists AND is writable.
  const parentDir = path.dirname(config.outputPath)
  try {
    fs.accessSync(parentDir, fs.constants.W_OK)
  } catch (err) {
    const cause = err as NodeJS.ErrnoException
    if (cause.code === 'ENOENT') {
      throw new ConfigError(
        `--output resolved to ${config.outputPath} (parent ${parentDir} does not exist)`,
        cause,
      )
    }
    if (cause.code === 'EACCES') {
      throw new ConfigError(
        `--output resolved to ${config.outputPath} (parent ${parentDir} is not writable)`,
        cause,
      )
    }
    throw new ConfigError(
      `--output resolved to ${config.outputPath} (preflight on ${parentDir} failed: ${cause.code ?? 'unknown error'})`,
      cause,
    )
  }
  // (d) baseUrl parses and is https:.
  let parsed: URL
  try {
    parsed = new URL(config.baseUrl)
  } catch (err) {
    throw new ConfigError(
      `base URL must be valid: got "${config.baseUrl}"`,
      err,
    )
  }
  if (parsed.protocol !== 'https:') {
    throw new ConfigError(
      `base URL must use https: scheme: got "${config.baseUrl}" (scheme: ${parsed.protocol})`,
    )
  }
}

export function loadEditorialConfig(
  argv: readonly string[] = process.argv.slice(2),
  env: NodeJS.ProcessEnv = process.env,
): EditorialConfig {
  const raw = parseArgs(argv)
  if (raw.help === true) {
    process.stdout.write(HELP_TEXT + '\n')
    process.exit(0)
  }
  const merged = mergeConfig(raw, env)
  runPreflight(merged)
  return merged
}
