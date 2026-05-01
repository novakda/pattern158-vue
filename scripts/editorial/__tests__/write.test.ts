// scripts/editorial/__tests__/write.test.ts
// Phase 50 — hermetic unit tests for atomic-write + optional mirror writer.
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (use injected/fixed timestamps)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of)
//
// Globals (describe/it/expect/vi/beforeEach/afterEach) are ambient via the
// scripts Vitest project (globals=true in vitest.config.ts).
//
// ESM mocking note: node:fs/promises is mocked via vi.mock() because
// vi.spyOn on live ESM namespace exports fails with "Cannot redefine
// property" under Vitest 4 + NodeNext. The hoisted state holder exposes
// per-test swappable implementations and lets the real-fs describe block
// temporarily swap the mock back to the real fs/promises via
// vi.importActual so tmpdir-based integration tests work against the
// actual filesystem.

import * as nodePath from 'node:path'
import * as os from 'node:os'
import type { EditorialConfig } from '../config.ts'

// Hoisted state: swappable implementations so each test can control behavior.
const state = vi.hoisted(() => {
  return {
    writeFile: vi.fn(async (_p: string, _c: string, _o: unknown) => undefined),
    rename: vi.fn(async (_from: string, _to: string) => undefined),
    unlink: vi.fn(async (_p: string) => undefined),
    mkdir: vi.fn(async (_p: string, _o: unknown) => undefined),
    access: vi.fn(async (_p: string, _mode?: number) => undefined),
  }
})

vi.mock('node:fs/promises', async () => {
  const actual =
    await vi.importActual<typeof import('node:fs/promises')>(
      'node:fs/promises',
    )
  return {
    // Keep actual exports as a fallback for anything we don't spy on
    // (mkdtemp / rm / readFile / readdir used by the real-fs block).
    ...actual,
    writeFile: (p: string, c: string, o: unknown) =>
      state.writeFile(p, c, o),
    rename: (from: string, to: string) => state.rename(from, to),
    unlink: (p: string) => state.unlink(p),
    mkdir: (p: string, o: unknown) => state.mkdir(p, o),
    access: (p: string, mode?: number) => state.access(p, mode),
  }
})

// Module-under-test is imported AFTER vi.mock (hoisted) so it resolves
// to the mocked module.
const { atomicWrite, emitFindingsScaffold, SCAFFOLD_TEMPLATE, writePrimaryAndMirror } =
  await import('../write.ts')
// For real-fs tests we also need unmocked access.
const realFsp =
  await vi.importActual<typeof import('node:fs/promises')>(
    'node:fs/promises',
  )

function makeConfig(overrides: Partial<EditorialConfig> = {}): EditorialConfig {
  return {
    outputPath: '/tmp/editorial-fake/out.md',
    baseUrl: 'https://pattern158.solutions',
    headful: false,
    mirror: false,
    exhibitsJsonPath: '/tmp/editorial-fake/exhibits.json',
    ...overrides,
  }
}

/**
 * Reset all hoisted mock state back to the default no-op resolve
 * implementations. Called between tests so each test begins with a clean
 * baseline and only overrides the behaviors it cares about.
 */
function resetAllMocks(): void {
  state.writeFile.mockReset().mockImplementation(async () => undefined)
  state.rename.mockReset().mockImplementation(async () => undefined)
  state.unlink.mockReset().mockImplementation(async () => undefined)
  state.mkdir.mockReset().mockImplementation(async () => undefined)
  state.access.mockReset().mockImplementation(async () => undefined)
}

describe('atomicWrite (mocked fsp)', () => {
  beforeEach(() => {
    resetAllMocks()
  })

  it('writes to a PID-suffixed temp file then renames over the destination', async () => {
    await atomicWrite('/out/file.md', 'hello')

    const expectedTemp = `/out/file.md.tmp-${process.pid}`

    expect(state.writeFile).toHaveBeenCalledTimes(1)
    expect(state.writeFile).toHaveBeenCalledWith(expectedTemp, 'hello', {
      encoding: 'utf8',
    })

    expect(state.rename).toHaveBeenCalledTimes(1)
    expect(state.rename).toHaveBeenCalledWith(expectedTemp, '/out/file.md')

    // Call-order assertion: writeFile invoked before rename.
    const writeFileOrder = state.writeFile.mock.invocationCallOrder[0]
    const renameOrder = state.rename.mock.invocationCallOrder[0]
    expect(writeFileOrder).toBeLessThan(renameOrder)
  })

  it('best-effort unlinks the temp file when rename rejects', async () => {
    const renameErr = new Error('EBUSY')
    state.rename.mockRejectedValue(renameErr)

    await expect(atomicWrite('/out/file.md', 'x')).rejects.toBe(renameErr)

    const expectedTemp = `/out/file.md.tmp-${process.pid}`
    expect(state.unlink).toHaveBeenCalledTimes(1)
    expect(state.unlink).toHaveBeenCalledWith(expectedTemp)
  })

  it('best-effort unlinks the temp file when writeFile rejects', async () => {
    const writeErr = new Error('ENOSPC')
    state.writeFile.mockRejectedValue(writeErr)

    await expect(atomicWrite('/out/file.md', 'x')).rejects.toBe(writeErr)

    // rename must never have been called because writeFile failed first.
    expect(state.rename).not.toHaveBeenCalled()

    const expectedTemp = `/out/file.md.tmp-${process.pid}`
    expect(state.unlink).toHaveBeenCalledTimes(1)
    expect(state.unlink).toHaveBeenCalledWith(expectedTemp)
  })

  it('re-throws the ORIGINAL error even if unlink rejects', async () => {
    const originalErr = new Error('ORIGINAL-writeFile-failure')
    const unlinkErr = new Error('DIFFERENT-unlink-failure')
    state.writeFile.mockRejectedValue(originalErr)
    state.unlink.mockRejectedValue(unlinkErr)

    await expect(atomicWrite('/out/file.md', 'x')).rejects.toBe(originalErr)
  })
})

describe('writePrimaryAndMirror (mocked fsp)', () => {
  beforeEach(() => {
    resetAllMocks()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('with mirror: false — writes primary only (single writeFile call)', async () => {
    const config = makeConfig({ mirror: false, outputPath: '/abs/out.md' })
    const result = await writePrimaryAndMirror(config, 'payload')

    expect(state.writeFile).toHaveBeenCalledTimes(1)
    expect(state.writeFile.mock.calls[0][0]).toBe(
      `/abs/out.md.tmp-${process.pid}`,
    )
    expect(state.mkdir).not.toHaveBeenCalled()
    expect(result).toEqual({ primaryPath: '/abs/out.md' })
    expect(result.mirrorPath).toBeUndefined()
  })

  it('with mirror: true — writes primary + mirror (two writeFile calls; mirror parent mkdir recursive)', async () => {
    const config = makeConfig({ mirror: true, outputPath: '/abs/out.md' })
    const result = await writePrimaryAndMirror(config, 'payload')

    expect(state.writeFile).toHaveBeenCalledTimes(2)
    // First call targets primary temp path.
    expect(state.writeFile.mock.calls[0][0]).toBe(
      `/abs/out.md.tmp-${process.pid}`,
    )
    // Second call targets mirror temp path (ends in the canonical mirror
    // location + pid suffix).
    const mirrorTempArg = state.writeFile.mock.calls[1][0] as string
    expect(mirrorTempArg).toContain(
      '.planning/research/site-editorial-capture.md',
    )
    expect(mirrorTempArg.endsWith(`.tmp-${process.pid}`)).toBe(true)

    // rename called twice (once per atomicWrite invocation).
    expect(state.rename).toHaveBeenCalledTimes(2)
    const mirrorRenameDest = state.rename.mock.calls[1][1] as string
    expect(
      mirrorRenameDest.endsWith(
        '.planning/research/site-editorial-capture.md',
      ),
    ).toBe(true)

    // mkdir recursive true on the mirror parent dir.
    expect(state.mkdir).toHaveBeenCalledTimes(1)
    expect(state.mkdir.mock.calls[0][1]).toEqual({ recursive: true })
    expect(state.mkdir.mock.calls[0][0] as string).toContain(
      '.planning/research',
    )

    expect(result.primaryPath).toBe('/abs/out.md')
    expect(result.mirrorPath).toBeDefined()
    expect(
      result.mirrorPath!.endsWith(
        '.planning/research/site-editorial-capture.md',
      ),
    ).toBe(true)
  })

  it('with mirror: true — mkdir rejects → resolves with { primaryPath } only; stderr logged', async () => {
    state.mkdir.mockRejectedValue(new Error('EACCES: mirror dir'))
    const stderrSpy = vi
      .spyOn(process.stderr, 'write')
      .mockImplementation(() => true)

    const config = makeConfig({ mirror: true, outputPath: '/abs/out.md' })
    const result = await writePrimaryAndMirror(config, 'payload')

    // Primary writeFile happened (1 call). Mirror writeFile never reached
    // because mkdir rejected before the mirror atomicWrite kicked off.
    expect(state.writeFile).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ primaryPath: '/abs/out.md' })
    expect(result.mirrorPath).toBeUndefined()

    // Stderr logged with the mirror-failure prefix.
    expect(stderrSpy).toHaveBeenCalled()
    const stderrPayload = stderrSpy.mock.calls
      .map((c) => String(c[0]))
      .join('')
    expect(stderrPayload).toContain('mirror write failed')
    expect(stderrPayload).toContain('EACCES: mirror dir')
  })

  it('with mirror: true — mirror atomicWrite rejects after primary succeeded → resolves { primaryPath }; stderr logged', async () => {
    // First writeFile (primary) resolves; second (mirror) rejects.
    state.writeFile
      .mockImplementationOnce(async () => undefined)
      .mockImplementationOnce(async () => {
        throw new Error('ENOSPC: mirror')
      })
    const stderrSpy = vi
      .spyOn(process.stderr, 'write')
      .mockImplementation(() => true)

    const config = makeConfig({ mirror: true, outputPath: '/abs/out.md' })
    const result = await writePrimaryAndMirror(config, 'payload')

    expect(state.writeFile).toHaveBeenCalledTimes(2)
    expect(result).toEqual({ primaryPath: '/abs/out.md' })
    expect(result.mirrorPath).toBeUndefined()
    const stderrPayload = stderrSpy.mock.calls
      .map((c) => String(c[0]))
      .join('')
    expect(stderrPayload).toContain('mirror write failed')
  })

  it('with mirror: true — PRIMARY atomicWrite rejects → REJECTS; mirror not attempted', async () => {
    const primaryErr = new Error('EACCES: primary')
    state.writeFile.mockRejectedValue(primaryErr)

    const config = makeConfig({ mirror: true, outputPath: '/abs/out.md' })
    await expect(writePrimaryAndMirror(config, 'payload')).rejects.toBe(
      primaryErr,
    )

    // rename must not have been reached for primary (writeFile failed),
    // and mirror block (mkdir + second writeFile) must never have been
    // reached.
    expect(state.rename).not.toHaveBeenCalled()
    expect(state.mkdir).not.toHaveBeenCalled()
  })
})

describe('atomicWrite + writePrimaryAndMirror (real fs)', () => {
  // For real-fs tests we swap mock implementations to delegate to the
  // actual node:fs/promises so tmpdir-based assertions work against the
  // true filesystem.
  let tmpDir: string

  beforeEach(async () => {
    state.writeFile.mockImplementation((p, c, o) =>
      realFsp
        .writeFile(p as string, c as string, o as never)
        .then(() => undefined),
    )
    state.rename.mockImplementation((from, to) =>
      realFsp
        .rename(from as string, to as string)
        .then(() => undefined),
    )
    state.unlink.mockImplementation((p) =>
      realFsp.unlink(p as string).then(() => undefined),
    )
    state.mkdir.mockImplementation((p, o) =>
      realFsp.mkdir(p as string, o as never).then(() => undefined),
    )
    state.access.mockImplementation((p, mode) =>
      realFsp
        .access(p as string, mode as number | undefined)
        .then(() => undefined),
    )
    tmpDir = await realFsp.mkdtemp(
      nodePath.join(os.tmpdir(), 'editorial-write-test-'),
    )
  })
  afterEach(async () => {
    await realFsp
      .rm(tmpDir, { recursive: true, force: true })
      .catch(() => undefined)
    resetAllMocks()
  })

  it('WRIT-04 idempotent overwrite — second write replaces first; no .tmp-<pid> leaks', async () => {
    const outPath = nodePath.join(tmpDir, 'out.md')

    await atomicWrite(outPath, 'hello world\n')
    expect(await realFsp.readFile(outPath, 'utf8')).toBe('hello world\n')

    await atomicWrite(outPath, 'second content\n')
    expect(await realFsp.readFile(outPath, 'utf8')).toBe('second content\n')

    const entries = await realFsp.readdir(tmpDir)
    expect(entries.sort()).toEqual(['out.md'])
  })

  it('WRIT-03 preserves content bytes verbatim (no line-ending transformation)', async () => {
    const outPath = nodePath.join(tmpDir, 'bytes.md')
    const payload = 'a\nb\n\nc\n\n\nd\n\temoji: \u{1F680}\n'
    await atomicWrite(outPath, payload)
    expect(await realFsp.readFile(outPath, 'utf8')).toBe(payload)
  })

  it('WRIT-05 writePrimaryAndMirror writes both files byte-identical when mirror: true', async () => {
    // Redirect process.cwd so the mirror lands under our tmpDir.
    const cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(tmpDir)
    try {
      const outPath = nodePath.join(tmpDir, 'primary.md')
      const config = makeConfig({ outputPath: outPath, mirror: true })
      const payload = 'mirror payload\nline-2\n'

      const result = await writePrimaryAndMirror(config, payload)

      expect(result.primaryPath).toBe(outPath)
      expect(result.mirrorPath).toBeDefined()
      expect(result.mirrorPath!).toBe(
        nodePath.join(
          tmpDir,
          '.planning/research/site-editorial-capture.md',
        ),
      )

      // Both files exist with identical content.
      expect(await realFsp.readFile(result.primaryPath, 'utf8')).toBe(payload)
      expect(await realFsp.readFile(result.mirrorPath!, 'utf8')).toBe(payload)
    } finally {
      cwdSpy.mockRestore()
    }
  })

  it('WRIT-04 primary file only when mirror: false (no .planning/ directory created)', async () => {
    const cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(tmpDir)
    try {
      const outPath = nodePath.join(tmpDir, 'primary-only.md')
      const config = makeConfig({ outputPath: outPath, mirror: false })

      const result = await writePrimaryAndMirror(config, 'just primary\n')

      expect(result.primaryPath).toBe(outPath)
      expect(result.mirrorPath).toBeUndefined()
      expect(await realFsp.readFile(outPath, 'utf8')).toBe('just primary\n')

      // No .planning directory was created.
      const entries = await realFsp.readdir(tmpDir)
      expect(entries.sort()).toEqual(['primary-only.md'])
    } finally {
      cwdSpy.mockRestore()
    }
  })
})

// ---------------------------------------------------------------------------
// Phase 51 — emitFindingsScaffold (EDIT-05)
// ---------------------------------------------------------------------------

describe('SCAFFOLD_TEMPLATE (Phase 51 EDIT-05)', () => {
  it('contains all 5 section headings (H2) locked per 51-CONTEXT.md', () => {
    expect(SCAFFOLD_TEMPLATE).toContain('## Inconsistencies')
    expect(SCAFFOLD_TEMPLATE).toContain('## Structural')
    expect(SCAFFOLD_TEMPLATE).toContain('## Copy')
    expect(SCAFFOLD_TEMPLATE).toContain('## Alignment Gaps')
    expect(SCAFFOLD_TEMPLATE).toContain('## Open Questions')
  })

  it('contains all 3 priority label strings (blocker / should-fix / nice-to-have)', () => {
    expect(SCAFFOLD_TEMPLATE).toContain('blocker')
    expect(SCAFFOLD_TEMPLATE).toContain('should-fix')
    expect(SCAFFOLD_TEMPLATE).toContain('nice-to-have')
  })

  it('contains all 3 career positioning doc references', () => {
    expect(SCAFFOLD_TEMPLATE).toContain('design-philosophy-essay.md')
    expect(SCAFFOLD_TEMPLATE).toContain('career-values-reference.md')
    expect(SCAFFOLD_TEMPLATE).toContain('case-study-gp-accessibility-signoff.md')
  })
})

describe('emitFindingsScaffold (mocked fsp)', () => {
  beforeEach(() => {
    resetAllMocks()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('file absent → writes SCAFFOLD_TEMPLATE to sibling path; returns absolute scaffold path', async () => {
    // access rejects → file does not exist → scaffold branch fires.
    state.access.mockRejectedValue(
      Object.assign(new Error('ENOENT'), { code: 'ENOENT' }),
    )

    const capturePath = '/vault/career/website/site-editorial-capture.md'
    const result = await emitFindingsScaffold(capturePath)

    const expectedScaffoldPath =
      '/vault/career/website/site-editorial-findings.md'
    expect(result).toBe(expectedScaffoldPath)

    // access probed the sibling scaffold path exactly once.
    expect(state.access).toHaveBeenCalledTimes(1)
    expect(state.access.mock.calls[0][0]).toBe(expectedScaffoldPath)

    // writeFile fired once with SCAFFOLD_TEMPLATE + utf8 encoding.
    expect(state.writeFile).toHaveBeenCalledTimes(1)
    const [writePath, writeContent, writeOpts] = state.writeFile.mock.calls[0]
    expect(writePath).toBe(expectedScaffoldPath)
    expect(writeContent).toBe(SCAFFOLD_TEMPLATE)
    expect(writeOpts).toEqual({ encoding: 'utf8' })
  })

  it('file already exists → returns null WITHOUT writing (idempotency contract)', async () => {
    // access resolves → file exists → scaffold write is skipped.
    state.access.mockResolvedValue(undefined)

    const capturePath = '/vault/career/website/site-editorial-capture.md'
    const result = await emitFindingsScaffold(capturePath)

    expect(result).toBeNull()

    // access probed once, writeFile NEVER called (preserves Dan's findings).
    expect(state.access).toHaveBeenCalledTimes(1)
    expect(state.writeFile).not.toHaveBeenCalled()
  })

  it('derives sibling scaffold path from capture output dirname', async () => {
    state.access.mockRejectedValue(new Error('ENOENT'))

    // Verify path derivation for a different vault layout — the scaffold
    // always lands next to the capture artifact, regardless of nesting.
    const capturePath = '/mnt/c/main/Obsidian Vault/career/website/site-editorial-capture.md'
    const result = await emitFindingsScaffold(capturePath)

    expect(result).toBe(
      '/mnt/c/main/Obsidian Vault/career/website/site-editorial-findings.md',
    )
  })
})

describe('emitFindingsScaffold (real fs)', () => {
  let tmpDir: string

  beforeEach(async () => {
    state.writeFile.mockImplementation((p, c, o) =>
      realFsp
        .writeFile(p as string, c as string, o as never)
        .then(() => undefined),
    )
    state.access.mockImplementation((p, mode) =>
      realFsp
        .access(p as string, mode as number | undefined)
        .then(() => undefined),
    )
    tmpDir = await realFsp.mkdtemp(
      nodePath.join(os.tmpdir(), 'editorial-scaffold-test-'),
    )
  })
  afterEach(async () => {
    await realFsp
      .rm(tmpDir, { recursive: true, force: true })
      .catch(() => undefined)
    resetAllMocks()
  })

  it('first run — scaffold written with exact SCAFFOLD_TEMPLATE bytes', async () => {
    const capturePath = nodePath.join(tmpDir, 'site-editorial-capture.md')
    // No capture file needed for the scaffold logic — only its path matters.

    const result = await emitFindingsScaffold(capturePath)

    const expectedScaffoldPath = nodePath.join(
      tmpDir,
      'site-editorial-findings.md',
    )
    expect(result).toBe(expectedScaffoldPath)

    const bytes = await realFsp.readFile(expectedScaffoldPath, 'utf8')
    expect(bytes).toBe(SCAFFOLD_TEMPLATE)
  })

  it('second run with findings already present — null returned; existing bytes preserved verbatim', async () => {
    const capturePath = nodePath.join(tmpDir, 'site-editorial-capture.md')
    const scaffoldPath = nodePath.join(tmpDir, 'site-editorial-findings.md')

    // Seed the findings file with Dan's in-progress content.
    const dansFindings =
      '# Site Editorial Findings\n\n## Inconsistencies\n- IMPORTANT: navbar brand color drift\n'
    await realFsp.writeFile(scaffoldPath, dansFindings, 'utf8')

    const result = await emitFindingsScaffold(capturePath)

    // Idempotency: null return + original bytes untouched.
    expect(result).toBeNull()
    expect(await realFsp.readFile(scaffoldPath, 'utf8')).toBe(dansFindings)
  })
})
