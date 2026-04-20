// scripts/editorial/__tests__/config.test.ts
// Phase 47 — Vitest suite for config.ts (parseArgs, mergeConfig, runPreflight).
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (use injected/fixed timestamps)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of)
//
// Globals (describe/it/expect) are ambient via tsconfig.editorial.json types.

import * as path from 'node:path'

import {
  parseArgs,
  mergeConfig,
  ConfigError,
  HELP_TEXT,
} from '../config.ts'

describe('parseArgs', () => {
  it('parses --output with a path value', () => {
    expect(parseArgs(['--output', '/tmp/out.md'])).toEqual({ output: '/tmp/out.md' })
  })

  it('parses --base-url, --headful, --mirror together', () => {
    expect(
      parseArgs(['--base-url', 'https://x.test', '--headful', '--mirror']),
    ).toEqual({ baseUrl: 'https://x.test', headful: true, mirror: true })
  })

  it('parses --help', () => {
    expect(parseArgs(['--help'])).toEqual({ help: true })
  })

  it('parses -h as a --help alias', () => {
    expect(parseArgs(['-h'])).toEqual({ help: true })
  })

  it('returns empty object for empty argv', () => {
    expect(parseArgs([])).toEqual({})
  })

  it('throws ConfigError on unknown flag', () => {
    expect(() => parseArgs(['--unknown'])).toThrow(ConfigError)
    expect(() => parseArgs(['--unknown'])).toThrow(/unknown flag: --unknown/)
  })

  it('throws ConfigError when --output is missing its value (end of argv)', () => {
    expect(() => parseArgs(['--output'])).toThrow(/--output requires a value/)
  })

  it('throws ConfigError when --base-url is missing its value (end of argv)', () => {
    expect(() => parseArgs(['--base-url'])).toThrow(/--base-url requires a value/)
  })

  it('throws ConfigError when --output is followed by another flag', () => {
    expect(() => parseArgs(['--output', '--mirror'])).toThrow(/--output requires a value/)
  })

  it('every thrown error satisfies instanceof ConfigError with name ConfigError', () => {
    try {
      parseArgs(['--unknown'])
      expect.unreachable('should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigError)
      expect((err as Error).name).toBe('ConfigError')
    }
  })
})

describe('mergeConfig', () => {
  it('uses CLI --output when env is absent', () => {
    const c = mergeConfig({ output: '/abs/out.md' }, {})
    expect(c.outputPath).toBe('/abs/out.md')
  })

  it('falls back to EDITORIAL_OUT_PATH env when CLI --output absent', () => {
    const c = mergeConfig({}, { EDITORIAL_OUT_PATH: '/abs/env.md' })
    expect(c.outputPath).toBe('/abs/env.md')
  })

  it('CLI --output wins over EDITORIAL_OUT_PATH env (CLI > env precedence)', () => {
    const c = mergeConfig(
      { output: '/abs/cli.md' },
      { EDITORIAL_OUT_PATH: '/abs/env.md' },
    )
    expect(c.outputPath).toBe('/abs/cli.md')
  })

  it('throws ConfigError when neither --output nor EDITORIAL_OUT_PATH is set', () => {
    expect(() => mergeConfig({}, {})).toThrow(ConfigError)
    expect(() => mergeConfig({}, {})).toThrow(
      /missing: --output \/ EDITORIAL_OUT_PATH/,
    )
  })

  it('resolves relative --output against process.cwd()', () => {
    const c = mergeConfig({ output: 'rel/out.md' }, {})
    expect(c.outputPath).toBe(path.resolve(process.cwd(), 'rel/out.md'))
    expect(path.isAbsolute(c.outputPath)).toBe(true)
  })

  it('defaults baseUrl to https://pattern158.solutions when neither flag nor env set', () => {
    const c = mergeConfig({ output: '/abs/out.md' }, {})
    expect(c.baseUrl).toBe('https://pattern158.solutions')
  })

  it('strips a single trailing slash from baseUrl', () => {
    const c = mergeConfig(
      { output: '/abs/out.md', baseUrl: 'https://x.test/' },
      {},
    )
    expect(c.baseUrl).toBe('https://x.test')
  })

  it('strips multiple trailing slashes from baseUrl', () => {
    const c = mergeConfig(
      { output: '/abs/out.md', baseUrl: 'https://x.test///' },
      {},
    )
    expect(c.baseUrl).toBe('https://x.test')
  })

  it('uses EDITORIAL_BASE_URL env when CLI --base-url absent', () => {
    const c = mergeConfig(
      { output: '/abs/out.md' },
      { EDITORIAL_BASE_URL: 'https://env.test' },
    )
    expect(c.baseUrl).toBe('https://env.test')
  })

  it('CLI --base-url wins over EDITORIAL_BASE_URL env', () => {
    const c = mergeConfig(
      { output: '/abs/out.md', baseUrl: 'https://flag.test' },
      { EDITORIAL_BASE_URL: 'https://env.test' },
    )
    expect(c.baseUrl).toBe('https://flag.test')
  })

  it('defaults headful to false', () => {
    const c = mergeConfig({ output: '/abs/out.md' }, {})
    expect(c.headful).toBe(false)
  })

  it('passes through headful=true from CLI', () => {
    const c = mergeConfig({ output: '/abs/out.md', headful: true }, {})
    expect(c.headful).toBe(true)
  })

  it('defaults mirror to false', () => {
    const c = mergeConfig({ output: '/abs/out.md' }, {})
    expect(c.mirror).toBe(false)
  })

  it('passes through mirror=true from CLI', () => {
    const c = mergeConfig({ output: '/abs/out.md', mirror: true }, {})
    expect(c.mirror).toBe(true)
  })

  it('resolves exhibitsJsonPath to src/data/json/exhibits.json under cwd', () => {
    const c = mergeConfig({ output: '/abs/out.md' }, {})
    expect(c.exhibitsJsonPath).toBe(
      path.resolve(process.cwd(), 'src/data/json/exhibits.json'),
    )
    expect(path.isAbsolute(c.exhibitsJsonPath)).toBe(true)
  })
})

describe('HELP_TEXT', () => {
  it('contains every flag name', () => {
    expect(HELP_TEXT).toContain('--output')
    expect(HELP_TEXT).toContain('--base-url')
    expect(HELP_TEXT).toContain('--headful')
    expect(HELP_TEXT).toContain('--mirror')
  })

  it('documents both env var fallbacks by name', () => {
    expect(HELP_TEXT).toContain('EDITORIAL_OUT_PATH')
    expect(HELP_TEXT).toContain('EDITORIAL_BASE_URL')
  })

  it('documents the help flag and its short form', () => {
    expect(HELP_TEXT).toContain('--help')
    expect(HELP_TEXT).toContain('-h')
  })
})
