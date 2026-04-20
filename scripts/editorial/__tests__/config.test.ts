// scripts/editorial/__tests__/config.test.ts
// Phase 47 — Vitest suite for config.ts (parseArgs, mergeConfig, runPreflight).
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (use injected/fixed timestamps)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of)
//
// Globals (describe/it/expect) are ambient via tsconfig.editorial.json types.

import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import * as path from 'node:path'

import {
  parseArgs,
  mergeConfig,
  runPreflight,
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

describe('runPreflight', () => {
  let tmpRoot: string

  beforeEach(async () => {
    tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'p47-config-test-'))
  })

  afterEach(async () => {
    await fs.rm(tmpRoot, { recursive: true, force: true })
  })

  function buildValidConfig(overrides: Partial<{
    outputPath: string
    baseUrl: string
    headful: boolean
    mirror: boolean
    exhibitsJsonPath: string
  }>) {
    return {
      outputPath: overrides.outputPath ?? path.join(tmpRoot, 'out.md'),
      baseUrl: overrides.baseUrl ?? 'https://pattern158.solutions',
      headful: overrides.headful ?? false,
      mirror: overrides.mirror ?? false,
      exhibitsJsonPath: overrides.exhibitsJsonPath ?? path.join(tmpRoot, 'exhibits.json'),
    }
  }

  it('returns void for a valid config (parent dir writable, https URL)', () => {
    const c = buildValidConfig({})
    expect(runPreflight(c)).toBeUndefined()
  })

  it('throws ConfigError when outputPath is not absolute', () => {
    const c = buildValidConfig({ outputPath: 'relative/out.md' })
    expect(() => runPreflight(c)).toThrow(ConfigError)
    expect(() => runPreflight(c)).toThrow(/outputPath must be absolute/)
    expect(() => runPreflight(c)).toThrow(/relative\/out\.md/)
  })

  it('throws ConfigError with cause.code=ENOENT when parent dir does not exist', () => {
    const c = buildValidConfig({
      outputPath: path.join(tmpRoot, 'missing-parent', 'out.md'),
    })
    expect(() => runPreflight(c)).toThrow(/does not exist/)
    try {
      runPreflight(c)
      expect.unreachable('should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigError)
      const ce = err as ConfigError
      expect(ce.message).toContain(c.outputPath)
      expect((ce.cause as NodeJS.ErrnoException | undefined)?.code).toBe('ENOENT')
    }
  })

  it('throws ConfigError with cause.code=EACCES when parent dir is not writable', async () => {
    // Skip when running as root — root bypasses POSIX write-permission denial.
    if (typeof process.getuid === 'function' && process.getuid() === 0) {
      return
    }
    const readonlyDir = path.join(tmpRoot, 'readonly')
    await fs.mkdir(readonlyDir)
    await fs.chmod(readonlyDir, 0o500) // r-x for owner, no write
    const c = buildValidConfig({ outputPath: path.join(readonlyDir, 'out.md') })
    try {
      runPreflight(c)
      expect.unreachable('should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigError)
      const ce = err as ConfigError
      expect(ce.message).toMatch(/is not writable/)
      expect(ce.message).toContain(readonlyDir)
      expect((ce.cause as NodeJS.ErrnoException | undefined)?.code).toBe('EACCES')
    }
    // Restore write so afterEach can clean up.
    await fs.chmod(readonlyDir, 0o700)
  })

  it('throws ConfigError when baseUrl is not a parseable URL', () => {
    const c = buildValidConfig({ baseUrl: 'not-a-url' })
    expect(() => runPreflight(c)).toThrow(ConfigError)
    expect(() => runPreflight(c)).toThrow(/base URL must be valid/)
    expect(() => runPreflight(c)).toThrow(/not-a-url/)
  })

  it('throws ConfigError when baseUrl uses http: scheme instead of https:', () => {
    const c = buildValidConfig({ baseUrl: 'http://example.com' })
    expect(() => runPreflight(c)).toThrow(ConfigError)
    expect(() => runPreflight(c)).toThrow(/base URL must use https: scheme/)
    expect(() => runPreflight(c)).toThrow(/http:/)
  })

  it('throws ConfigError when baseUrl uses ftp: scheme', () => {
    const c = buildValidConfig({ baseUrl: 'ftp://example.com' })
    expect(() => runPreflight(c)).toThrow(/base URL must use https: scheme/)
  })

  it('accepts a baseUrl with https: scheme and a path component', () => {
    const c = buildValidConfig({ baseUrl: 'https://example.com/some/path' })
    expect(runPreflight(c)).toBeUndefined()
  })
})
