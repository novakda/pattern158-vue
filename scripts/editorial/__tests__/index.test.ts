// scripts/editorial/__tests__/index.test.ts
// Phase 50 — hermetic integration tests for the main() orchestrator.
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (tests use frozen string constants)
//   - platform-specific line endings (literal newline only)
//   - parallel-iteration helpers over the ordered route list
//
// Globals (describe/it/expect/vi/beforeEach/afterEach) are ambient via the
// scripts Vitest project (globals=true in vitest.config.ts).
//
// ESM mocking note: vi.hoisted + vi.mock factory is the established pattern
// for mocking package namespaces under Vitest 4 NodeNext (Plan 50-02 lock).
// We reuse it here for node:child_process + the four editorial sibling
// modules whose surfaces the orchestrator dispatches into.

import type { Route } from '../routes.ts'
import type { EditorialConfig } from '../config.ts'
import type { CapturedPage } from '../capture.ts'
import type { RouteFailure } from '../document.ts'
import type { ConvertedPage } from '../convert.ts'

// ---------------------------------------------------------------------------
// Hoisted state holders — each mocked module reads swappable implementations
// from here so per-test behavior can be configured without re-importing.
// Explicit vi.fn<Signature> generics lock the parameter types so the factory
// wrappers below can invoke them with confidence under strict TS.
// ---------------------------------------------------------------------------

interface MockBrowser {
  readonly newContext: ReturnType<typeof vi.fn>
  readonly close: ReturnType<typeof vi.fn>
}

const DEFAULT_CFG: EditorialConfig = {
  outputPath: '/tmp/editorial-mock/out.md',
  baseUrl: 'https://pattern158.solutions',
  headful: false,
  mirror: false,
  exhibitsJsonPath: '/tmp/editorial-mock/exhibits.json',
}

function freshBrowser(): MockBrowser {
  return {
    newContext: vi.fn(async () => ({
      newPage: vi.fn(async () => ({
        waitForTimeout: vi.fn(async () => undefined),
        close: vi.fn(async () => undefined),
      })),
      close: vi.fn(async () => undefined),
    })),
    close: vi.fn(async () => undefined),
  }
}

const state = vi.hoisted(() => {
  return {
    execSync: vi.fn<(cmd: string, opts?: unknown) => string>(() => ''),
    loadEditorialConfig: vi.fn<() => EditorialConfig>(() => ({
      outputPath: '/tmp/editorial-mock/out.md',
      baseUrl: 'https://pattern158.solutions',
      headful: false,
      mirror: false,
      exhibitsJsonPath: '/tmp/editorial-mock/exhibits.json',
    })),
    buildRoutes: vi.fn<
      (exhibitsJsonPath: string) => Promise<readonly Route[]>
    >(async () => []),
    ensureScreenshotDir: vi.fn<
      (cfg: EditorialConfig) => Promise<string>
    >(async () => '/tmp/editorial-mock/screenshots'),
    loadFaqItemCount: vi.fn<(path: string) => Promise<number>>(
      async () => 1,
    ),
    launchBrowser: vi.fn<
      (cfg: EditorialConfig) => Promise<unknown>
    >(async () => ({
      newContext: vi.fn(async () => ({
        newPage: vi.fn(async () => ({
          waitForTimeout: vi.fn(async () => undefined),
          close: vi.fn(async () => undefined),
        })),
        close: vi.fn(async () => undefined),
      })),
      close: vi.fn(async () => undefined),
    })),
    buildContextOptions: vi.fn<() => Record<string, unknown>>(() => ({})),
    capturePage: vi.fn<
      (
        ctx: unknown,
        cfg: EditorialConfig,
        route: Route,
        i: number,
        faq: number,
      ) => Promise<CapturedPage>
    >(async () => {
      throw new Error('capturePage not configured by test')
    }),
    convertCapturedPages: vi.fn<
      (pages: readonly CapturedPage[]) => readonly ConvertedPage[]
    >((pages) =>
      pages.map((p) => ({
        route: p.route,
        markdown: `### ${p.title}\n\nbody`,
        httpStatus: p.httpStatus,
        title: p.title,
        description: p.description,
        consoleErrors: p.consoleErrors,
        screenshotPath: p.screenshotPath,
        cfCacheStatus: p.cfCacheStatus,
      })),
    ),
    assembleDocument: vi.fn<(input: unknown) => string>(() => 'DOC'),
    writePrimaryAndMirror: vi.fn<
      (
        cfg: EditorialConfig,
        content: string,
      ) => Promise<{ primaryPath: string; mirrorPath?: string }>
    >(async () => ({
      primaryPath: '/tmp/editorial-mock/out.md',
      mirrorPath: undefined,
    })),
  }
})

// ---------------------------------------------------------------------------
// vi.mock: intercept the modules index.ts pulls in. Factories return live
// bindings to the hoisted state holders so tests can rewire each call.
// ---------------------------------------------------------------------------

vi.mock('node:child_process', async () => {
  const actual = await vi.importActual<typeof import('node:child_process')>(
    'node:child_process',
  )
  return {
    ...actual,
    execSync: (cmd: string, opts?: unknown) => state.execSync(cmd, opts),
  }
})

vi.mock('../config.ts', async () => {
  const actual = await vi.importActual<typeof import('../config.ts')>(
    '../config.ts',
  )
  return {
    ...actual,
    loadEditorialConfig: () => state.loadEditorialConfig(),
  }
})

vi.mock('../routes.ts', async () => {
  const actual = await vi.importActual<typeof import('../routes.ts')>(
    '../routes.ts',
  )
  return {
    ...actual,
    buildRoutes: (path: string) => state.buildRoutes(path),
  }
})

vi.mock('../capture.ts', async () => {
  const actual = await vi.importActual<typeof import('../capture.ts')>(
    '../capture.ts',
  )
  return {
    ...actual,
    ensureScreenshotDir: (cfg: EditorialConfig) =>
      state.ensureScreenshotDir(cfg),
    loadFaqItemCount: (p: string) => state.loadFaqItemCount(p),
    launchBrowser: (cfg: EditorialConfig) => state.launchBrowser(cfg),
    buildContextOptions: () => state.buildContextOptions(),
    capturePage: (
      ctx: unknown,
      cfg: EditorialConfig,
      route: Route,
      i: number,
      faq: number,
    ) => state.capturePage(ctx, cfg, route, i, faq),
  }
})

vi.mock('../convert.ts', async () => {
  const actual = await vi.importActual<typeof import('../convert.ts')>(
    '../convert.ts',
  )
  return {
    ...actual,
    convertCapturedPages: (pages: readonly CapturedPage[]) =>
      state.convertCapturedPages(pages),
  }
})

vi.mock('../document.ts', async () => {
  const actual = await vi.importActual<typeof import('../document.ts')>(
    '../document.ts',
  )
  return {
    ...actual,
    assembleDocument: (input: unknown) => state.assembleDocument(input),
  }
})

vi.mock('../write.ts', async () => {
  const actual = await vi.importActual<typeof import('../write.ts')>(
    '../write.ts',
  )
  return {
    ...actual,
    writePrimaryAndMirror: (cfg: EditorialConfig, content: string) =>
      state.writePrimaryAndMirror(cfg, content),
  }
})

// ---------------------------------------------------------------------------
// Imports AFTER vi.mock (hoisted). CaptureError + ConfigError must come from
// the ACTUAL modules so `instanceof` checks in index.ts line up — the vi.mock
// factories preserve the original class exports via `...actual` spread.
// ---------------------------------------------------------------------------

const {
  buildToolVersion,
  extractSiteVersionSha,
  handleTopLevelError,
  isInterstitialFailure,
  main,
} = await import('../index.ts')
const { CaptureError } = await import('../capture.ts')
const { ConfigError } = await import('../config.ts')

type CaptureErrorInstance = InstanceType<typeof CaptureError>

// ---------------------------------------------------------------------------
// Test fixtures + helpers.
// ---------------------------------------------------------------------------

const FAT_MAIN_HTML = '<main id="main-content">' + 'x'.repeat(500) + '</main>'

function makeRoute(
  path: string,
  label: string,
  category: 'static' | 'exhibit' = 'static',
): Route {
  return { path, label, category }
}

function makeCapturedPage(
  route: Route,
  overrides: Partial<CapturedPage> = {},
): CapturedPage {
  return {
    route,
    httpStatus: 200,
    mainHtml: FAT_MAIN_HTML,
    title: `${route.label} | Pattern 158`,
    description: `desc for ${route.label}`,
    consoleErrors: [],
    screenshotPath: `/tmp/screenshots/00-${route.label.toLowerCase()}.png`,
    cfCacheStatus: 'HIT',
    ...overrides,
  }
}

class ExitSentinel extends Error {
  public readonly code: number
  constructor(code: number) {
    super(`exit ${code}`)
    this.name = 'ExitSentinel'
    this.code = code
  }
}

function installExitSentinel(): ReturnType<typeof vi.spyOn> {
  return vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
    throw new ExitSentinel(code ?? 0)
  }) as never)
}

/** Join write-mock calls into a single string for substring assertions. */
function joinWriteCalls(
  spy: ReturnType<typeof vi.spyOn>,
): string {
  return (spy.mock.calls as unknown[][])
    .map((c: unknown[]) => String(c[0]))
    .join('')
}

function resetState(): void {
  state.execSync.mockReset().mockImplementation(() => '')
  state.loadEditorialConfig.mockReset().mockImplementation(() => DEFAULT_CFG)
  state.buildRoutes
    .mockReset()
    .mockImplementation(async () => [] as readonly Route[])
  state.ensureScreenshotDir
    .mockReset()
    .mockImplementation(async () => '/tmp/editorial-mock/screenshots')
  state.loadFaqItemCount.mockReset().mockImplementation(async () => 1)
  state.launchBrowser.mockReset().mockImplementation(async () => freshBrowser())
  state.buildContextOptions.mockReset().mockImplementation(() => ({}))
  state.capturePage.mockReset().mockImplementation(async () => {
    throw new Error('capturePage not configured')
  })
  state.convertCapturedPages.mockReset().mockImplementation((pages) =>
    pages.map((p) => ({
      route: p.route,
      markdown: `### ${p.title}\n\nbody`,
      httpStatus: p.httpStatus,
      title: p.title,
      description: p.description,
      consoleErrors: p.consoleErrors,
      screenshotPath: p.screenshotPath,
      cfCacheStatus: p.cfCacheStatus,
    })),
  )
  state.assembleDocument.mockReset().mockImplementation(() => 'DOC')
  state.writePrimaryAndMirror.mockReset().mockImplementation(async () => ({
    primaryPath: '/tmp/editorial-mock/out.md',
    mirrorPath: undefined,
  }))
}

// ---------------------------------------------------------------------------
// Describe block 1: main() happy path
// ---------------------------------------------------------------------------

describe('main (orchestration) — happy path', () => {
  let stdoutSpy: ReturnType<typeof vi.spyOn>
  let stderrSpy: ReturnType<typeof vi.spyOn>
  let exitSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    resetState()
    stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true)
    exitSpy = installExitSentinel()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('2 successful routes → writePrimaryAndMirror called; exit 0; summaries emitted', async () => {
    const homeRoute = makeRoute('/', 'Home')
    const faqRoute = makeRoute('/faq', 'FAQ')
    state.buildRoutes.mockImplementation(async () => [homeRoute, faqRoute])
    state.capturePage.mockImplementation(
      async (_ctx, _cfg, route: Route) => makeCapturedPage(route),
    )

    await expect(main()).rejects.toThrow(ExitSentinel)

    // Capture called twice, once per route, in order, with correct index.
    expect(state.capturePage).toHaveBeenCalledTimes(2)
    expect(state.capturePage.mock.calls[0][2]).toBe(homeRoute)
    expect(state.capturePage.mock.calls[0][3]).toBe(0)
    expect(state.capturePage.mock.calls[1][2]).toBe(faqRoute)
    expect(state.capturePage.mock.calls[1][3]).toBe(1)

    // Document assembled + written.
    expect(state.assembleDocument).toHaveBeenCalledTimes(1)
    const asmInput = state.assembleDocument.mock.calls[0][0] as {
      captured: readonly unknown[]
      failures: readonly unknown[]
      capturedAt: string
      toolVersion: string
    }
    expect(asmInput.captured).toHaveLength(2)
    expect(asmInput.failures).toHaveLength(0)
    expect(typeof asmInput.capturedAt).toBe('string')
    expect(asmInput.capturedAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    )
    expect(typeof asmInput.toolVersion).toBe('string')
    expect(asmInput.toolVersion.startsWith('editorial-capture/')).toBe(true)

    expect(state.writePrimaryAndMirror).toHaveBeenCalledTimes(1)
    expect(state.writePrimaryAndMirror.mock.calls[0][1]).toBe('DOC')

    // Exit code 0 for a fully healthy run.
    expect(exitSpy).toHaveBeenCalledWith(0)

    // Stdout human summary + stderr JSON.
    const stdout = joinWriteCalls(stdoutSpy)
    expect(stdout).toContain('Captured 2 routes')
    expect(stdout).toContain('Failed: 0')

    const stderr = joinWriteCalls(stderrSpy)
    const lastJsonLine = stderr.trim().split('\n').pop() as string
    const parsed = JSON.parse(lastJsonLine) as {
      captured: number
      failed: number
      failures: unknown[]
    }
    expect(parsed.captured).toBe(2)
    expect(parsed.failed).toBe(0)
    expect(parsed.failures).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// Describe block 2: per-route failure continuation (WRIT-07)
// ---------------------------------------------------------------------------

describe('main (orchestration) — per-route failure continues', () => {
  let stdoutSpy: ReturnType<typeof vi.spyOn>
  let stderrSpy: ReturnType<typeof vi.spyOn>
  let exitSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    resetState()
    stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true)
    exitSpy = installExitSentinel()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('non-interstitial CaptureError on route 2 → route 1 captured; exit 1; failures.length === 1', async () => {
    const route1 = makeRoute('/', 'Home')
    const route2 = makeRoute('/exhibits/exhibit-b', 'Exhibit B', 'exhibit')
    state.buildRoutes.mockImplementation(async () => [route1, route2])
    state.capturePage.mockImplementation(async (_ctx, _cfg, route: Route) => {
      if (route.path === '/exhibits/exhibit-b') {
        throw new CaptureError(
          `Exhibit route ${route.path} did not render .exhibit-detail-title (count=0) — likely silent 404`,
          { route },
        )
      }
      return makeCapturedPage(route)
    })

    await expect(main()).rejects.toThrow(ExitSentinel)

    // Both routes attempted.
    expect(state.capturePage).toHaveBeenCalledTimes(2)

    // Document assembled with 1 captured + 1 failure.
    const asmInput = state.assembleDocument.mock.calls[0][0] as {
      captured: readonly unknown[]
      failures: readonly RouteFailure[]
    }
    expect(asmInput.captured).toHaveLength(1)
    expect(asmInput.failures).toHaveLength(1)
    expect(asmInput.failures[0].route.path).toBe('/exhibits/exhibit-b')

    // Writer still fires (per-route failure is NOT fatal).
    expect(state.writePrimaryAndMirror).toHaveBeenCalledTimes(1)

    // Exit 1 because failures.length > 0.
    expect(exitSpy).toHaveBeenCalledWith(1)

    const stdout = joinWriteCalls(stdoutSpy)
    expect(stdout).toContain('Failed: 1')
    expect(stdout).toContain('/exhibits/exhibit-b')

    const stderr = joinWriteCalls(stderrSpy)
    const parsed = JSON.parse(stderr.trim().split('\n').pop() as string) as {
      failed: number
      failures: readonly { route: string; error: string }[]
    }
    expect(parsed.failed).toBe(1)
    expect(parsed.failures[0].route).toBe('/exhibits/exhibit-b')
    expect(parsed.failures[0].error).toMatch(/did not render/)
  })

  it('non-CaptureError thrown during capturePage → wrapped with route context; pipeline continues', async () => {
    const route1 = makeRoute('/', 'Home')
    const route2 = makeRoute('/philosophy', 'Philosophy')
    state.buildRoutes.mockImplementation(async () => [route1, route2])
    state.capturePage.mockImplementation(async (_ctx, _cfg, route: Route) => {
      if (route.path === '/philosophy') {
        throw new Error('playwright lost context')
      }
      return makeCapturedPage(route)
    })

    await expect(main()).rejects.toThrow(ExitSentinel)

    const asmInput = state.assembleDocument.mock.calls[0][0] as {
      failures: readonly RouteFailure[]
    }
    expect(asmInput.failures).toHaveLength(1)
    expect(asmInput.failures[0].error).toBeInstanceOf(CaptureError)
    const wrappedErr = asmInput.failures[0].error as CaptureErrorInstance
    expect(wrappedErr.message).toMatch(/Capture failed for \/philosophy/)
    expect(exitSpy).toHaveBeenCalledWith(1)
  })
})

// ---------------------------------------------------------------------------
// Describe block 3: interstitial abort
// ---------------------------------------------------------------------------

describe('main (orchestration) — interstitial abort', () => {
  let stdoutSpy: ReturnType<typeof vi.spyOn>
  let stderrSpy: ReturnType<typeof vi.spyOn>
  let exitSpy: ReturnType<typeof vi.spyOn>
  let browserCloseSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    resetState()
    stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true)
    exitSpy = installExitSentinel()
    browserCloseSpy = vi.fn(async () => undefined)
    state.launchBrowser.mockImplementation(async () => ({
      newContext: vi.fn(async () => ({
        newPage: vi.fn(async () => ({
          waitForTimeout: vi.fn(async () => undefined),
          close: vi.fn(async () => undefined),
        })),
        close: vi.fn(async () => undefined),
      })),
      close: browserCloseSpy,
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('interstitial CaptureError → re-thrown; main rejects; no writer call; browser.close invoked; handleTopLevelError exits 1', async () => {
    const route1 = makeRoute('/', 'Home')
    const route2 = makeRoute('/faq', 'FAQ')
    state.buildRoutes.mockImplementation(async () => [route1, route2])
    state.capturePage.mockImplementationOnce(
      async (_ctx, _cfg, route: Route) => {
        throw new CaptureError(
          `Cloudflare bot interstitial detected on ${route.path} — title contains "Just a moment"`,
          { route },
        )
      },
    )

    // Production wiring is `main().catch(handleTopLevelError)`; handleTopLevelError
    // then invokes process.exit(1) which the ExitSentinel spy translates into a
    // throw. So the whole chain propagates an ExitSentinel.
    let caught: unknown
    try {
      await main().catch(handleTopLevelError)
    } catch (err) {
      caught = err
    }
    expect(caught).toBeInstanceOf(ExitSentinel)
    expect((caught as ExitSentinel).code).toBe(1)

    // Only route 1 was attempted — loop aborted.
    expect(state.capturePage).toHaveBeenCalledTimes(1)

    // Writer NEVER fired.
    expect(state.writePrimaryAndMirror).not.toHaveBeenCalled()
    expect(state.assembleDocument).not.toHaveBeenCalled()

    // Browser cleanup still ran (outer finally on main()).
    expect(browserCloseSpy).toHaveBeenCalledTimes(1)

    // Exit code 1 + retry hint in stderr.
    expect(exitSpy).toHaveBeenCalledWith(1)
    const stderr = joinWriteCalls(stderrSpy)
    expect(stderr).toContain('Cloudflare bot interstitial')
    expect(stderr).toContain('retry with --headful')

    // Stdout must NOT carry a "Captured N routes" summary (we bailed before it).
    const stdout = joinWriteCalls(stdoutSpy)
    expect(stdout).not.toContain('Captured ')
  })
})

// ---------------------------------------------------------------------------
// Describe block 4: exit-code health branches (WRIT-06 preconditions)
// ---------------------------------------------------------------------------

describe('main (orchestration) — exit-code preconditions (WRIT-06)', () => {
  let exitSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    resetState()
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    vi.spyOn(process.stderr, 'write').mockImplementation(() => true)
    exitSpy = installExitSentinel()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('4a: httpStatus 404 on one route → exit 1 (zero failures, but non-200)', async () => {
    const route = makeRoute('/', 'Home')
    state.buildRoutes.mockImplementation(async () => [route])
    state.capturePage.mockImplementation(async (_ctx, _cfg, r) =>
      makeCapturedPage(r, { httpStatus: 404 }),
    )

    await expect(main()).rejects.toThrow(ExitSentinel)
    expect(exitSpy).toHaveBeenCalledWith(1)
  })

  it('4b: mainHtml.length < 200 → exit 1 (zero failures, but short body)', async () => {
    const route = makeRoute('/', 'Home')
    state.buildRoutes.mockImplementation(async () => [route])
    state.capturePage.mockImplementation(async (_ctx, _cfg, r) =>
      makeCapturedPage(r, { mainHtml: 'x'.repeat(150) }),
    )

    await expect(main()).rejects.toThrow(ExitSentinel)
    expect(exitSpy).toHaveBeenCalledWith(1)
  })

  it('4c: all 200 + all bodies >= 200 + zero failures → exit 0', async () => {
    const route = makeRoute('/', 'Home')
    state.buildRoutes.mockImplementation(async () => [route])
    state.capturePage.mockImplementation(async (_ctx, _cfg, r) =>
      makeCapturedPage(r),
    )

    await expect(main()).rejects.toThrow(ExitSentinel)
    expect(exitSpy).toHaveBeenCalledWith(0)
  })
})

// ---------------------------------------------------------------------------
// Describe block 5: buildToolVersion unit tests
// ---------------------------------------------------------------------------

describe('buildToolVersion', () => {
  beforeEach(() => {
    state.execSync.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('clean repo → editorial-capture/<sha>', () => {
    state.execSync
      .mockReturnValueOnce('abc1234\n')
      .mockReturnValueOnce('')
    expect(buildToolVersion()).toBe('editorial-capture/abc1234')
  })

  it('dirty repo → editorial-capture/<sha>+dirty', () => {
    state.execSync
      .mockReturnValueOnce('abc1234\n')
      .mockReturnValueOnce(' M scripts/editorial/index.ts\n')
    expect(buildToolVersion()).toBe('editorial-capture/abc1234+dirty')
  })

  it('rev-parse throws → editorial-capture/unknown', () => {
    state.execSync.mockImplementation(() => {
      throw new Error('not a git repo')
    })
    expect(buildToolVersion()).toBe('editorial-capture/unknown')
  })

  it('porcelain throws after rev-parse succeeds → editorial-capture/unknown', () => {
    state.execSync
      .mockReturnValueOnce('abc1234\n')
      .mockImplementationOnce(() => {
        throw new Error('git status exploded')
      })
    expect(buildToolVersion()).toBe('editorial-capture/unknown')
  })
})

// ---------------------------------------------------------------------------
// Describe block 6: extractSiteVersionSha unit tests
// ---------------------------------------------------------------------------

describe('extractSiteVersionSha', () => {
  it('finds <meta name="git-sha" content="..."> in home route mainHtml', () => {
    const home = makeCapturedPage(makeRoute('/', 'Home'), {
      mainHtml:
        '<header><meta name="git-sha" content="xyz5678"></header>' +
        FAT_MAIN_HTML,
    })
    expect(extractSiteVersionSha([home])).toBe('xyz5678')
  })

  it('case-insensitive on the META tag attributes', () => {
    const home = makeCapturedPage(makeRoute('/', 'Home'), {
      mainHtml: '<META NAME="git-sha" CONTENT="CAPS123">',
    })
    expect(extractSiteVersionSha([home])).toBe('CAPS123')
  })

  it('returns empty string when home route is absent from captured list', () => {
    const faq = makeCapturedPage(makeRoute('/faq', 'FAQ'))
    expect(extractSiteVersionSha([faq])).toBe('')
  })

  it('returns empty string when home captured but meta tag absent', () => {
    const home = makeCapturedPage(makeRoute('/', 'Home'))
    expect(extractSiteVersionSha([home])).toBe('')
  })

  it('returns empty string on empty input', () => {
    expect(extractSiteVersionSha([])).toBe('')
  })
})

// ---------------------------------------------------------------------------
// Describe block 7: isInterstitialFailure unit tests
// ---------------------------------------------------------------------------

describe('isInterstitialFailure', () => {
  it('CaptureError with "bot interstitial" message → true', () => {
    expect(
      isInterstitialFailure(
        new CaptureError('Cloudflare bot interstitial detected on /'),
      ),
    ).toBe(true)
  })

  it('CaptureError with UPPERCASE bot interstitial → true (case-insensitive regex)', () => {
    expect(
      isInterstitialFailure(new CaptureError('BOT INTERSTITIAL MARKER')),
    ).toBe(true)
  })

  it('CaptureError without interstitial substring → false', () => {
    expect(
      isInterstitialFailure(
        new CaptureError('Exhibit route /x did not render .exhibit-detail-title'),
      ),
    ).toBe(false)
  })

  it('bare Error instance → false', () => {
    expect(isInterstitialFailure(new Error('boom'))).toBe(false)
  })

  it('non-Error value (string) → false', () => {
    expect(isInterstitialFailure('string interstitial')).toBe(false)
  })

  it('non-Error value (null) → false', () => {
    expect(isInterstitialFailure(null)).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Describe block 8: handleTopLevelError branches
// ---------------------------------------------------------------------------

describe('handleTopLevelError', () => {
  let exitSpy: ReturnType<typeof vi.spyOn>
  let stderrSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    exitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation(((_code?: number) => undefined) as never)
    stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('ConfigError → exit 2 with config-error prefix', () => {
    handleTopLevelError(new ConfigError('missing: --output'))
    expect(exitSpy).toHaveBeenCalledWith(2)
    const payload = joinWriteCalls(stderrSpy)
    expect(payload).toContain('config error')
    expect(payload).toContain('missing: --output')
  })

  it('interstitial CaptureError → exit 1 with retry hint', () => {
    handleTopLevelError(
      new CaptureError(
        'Cloudflare bot interstitial detected on / — body < 200 bytes',
      ),
    )
    expect(exitSpy).toHaveBeenCalledWith(1)
    const payload = joinWriteCalls(stderrSpy)
    expect(payload).toContain('Cloudflare bot interstitial')
    expect(payload).toContain('retry with --headful')
  })

  it('non-interstitial CaptureError → exit 1 with runtime-error prefix', () => {
    handleTopLevelError(
      new CaptureError('Exhibit route /x did not render .exhibit-detail-title'),
    )
    expect(exitSpy).toHaveBeenCalledWith(1)
    const payload = joinWriteCalls(stderrSpy)
    expect(payload).toContain('runtime error')
    expect(payload).toContain('Exhibit route')
  })

  it('generic Error → exit 1 with runtime-error prefix', () => {
    handleTopLevelError(new Error('boom'))
    expect(exitSpy).toHaveBeenCalledWith(1)
    const payload = joinWriteCalls(stderrSpy)
    expect(payload).toContain('runtime error')
    expect(payload).toContain('boom')
  })

  it('non-Error primitive string → exit 1; String(err) surfaced', () => {
    handleTopLevelError('raw string throw')
    expect(exitSpy).toHaveBeenCalledWith(1)
    const payload = joinWriteCalls(stderrSpy)
    expect(payload).toContain('raw string throw')
  })

  it('null thrown value → exit 1 with String(null) surfaced', () => {
    handleTopLevelError(null)
    expect(exitSpy).toHaveBeenCalledWith(1)
    const payload = joinWriteCalls(stderrSpy)
    expect(payload).toContain('null')
  })
})
