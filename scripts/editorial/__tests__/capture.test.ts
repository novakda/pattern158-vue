// scripts/editorial/__tests__/capture.test.ts
// Phase 48 — hermetic tests for scripts/editorial/capture.ts.
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (use injected/fixed timestamps)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of)
//
// Globals (describe/it/expect/vi/beforeEach/afterEach) are ambient via the
// scripts Vitest project (globals=true in vitest.config.ts).

import * as fsp from 'node:fs/promises'
import * as nodePath from 'node:path'
import * as os from 'node:os'
import { chromium } from 'playwright'
import {
  CaptureError,
  slugify,
  detectInterstitial,
  buildCaptureUrl,
  buildContextOptions,
  resolveScreenshotDir,
  buildScreenshotPath,
  loadFaqItemCount,
  captureRoutes,
} from '../capture.ts'
import type { EditorialConfig } from '../config.ts'
import type { Route } from '../routes.ts'

describe('slugify', () => {
  it.each([
    ['/', 'home'],
    ['/philosophy', 'philosophy'],
    ['/case-files', 'case-files'],
    ['/exhibits/exhibit-a', 'exhibits-exhibit-a'],
    ['/faq', 'faq'],
    ['Some Label!', 'some-label'],
    ['   trailing   ', 'trailing'],
    ['a--b---c', 'a-b-c'],
    ['', ''],
  ])('slugify(%j) === %j', (input, expected) => {
    expect(slugify(input)).toBe(expected)
  })
})

describe('detectInterstitial', () => {
  it('returns null for a benign page', () => {
    expect(
      detectInterstitial({
        title: 'Pattern 158 — Dan Novak',
        bodyBytes: 25_000,
        html: '<main id="main-content"><h1>Home</h1></main>',
      }),
    ).toBeNull()
  })

  it('trips on "Just a moment" title (exact case)', () => {
    expect(
      detectInterstitial({
        title: 'Just a moment...',
        bodyBytes: 25_000,
        html: '<div></div>',
      }),
    ).toMatch(/Just a moment/)
  })

  it('trips on "JUST A MOMENT" title (case-insensitive)', () => {
    expect(
      detectInterstitial({
        title: 'JUST A MOMENT',
        bodyBytes: 25_000,
        html: '<div></div>',
      }),
    ).toMatch(/Just a moment/)
  })

  it('trips on bodyBytes < 200', () => {
    expect(
      detectInterstitial({
        title: 'Pattern 158',
        bodyBytes: 150,
        html: '<div></div>',
      }),
    ).toMatch(/< 200 bytes/)
  })

  it('trips on cf-chl-opt marker in html', () => {
    expect(
      detectInterstitial({
        title: 'Pattern 158',
        bodyBytes: 25_000,
        html: '<script id="cf-chl-opt">...</script>',
      }),
    ).toMatch(/cf-chl-opt/)
  })

  it('trips on challenge-platform marker in html', () => {
    expect(
      detectInterstitial({
        title: 'Pattern 158',
        bodyBytes: 25_000,
        html: '<div class="challenge-platform">...</div>',
      }),
    ).toMatch(/challenge-platform/)
  })
})

describe('buildCaptureUrl', () => {
  const baseUrl = 'https://pattern158.solutions'

  it.each<[Route, string]>([
    [{ path: '/', label: 'Home', category: 'static' }, `${baseUrl}/?_cb=home`],
    [
      { path: '/philosophy', label: 'Philosophy', category: 'static' },
      `${baseUrl}/philosophy?_cb=philosophy`,
    ],
    [
      { path: '/case-files', label: 'Case Files', category: 'static' },
      `${baseUrl}/case-files?_cb=case-files`,
    ],
    [
      {
        path: '/exhibits/exhibit-a',
        label: 'Exhibit A',
        category: 'exhibit',
        sourceSlug: 'exhibit-a',
      },
      `${baseUrl}/exhibits/exhibit-a?_cb=exhibit-a`,
    ],
  ])('buildCaptureUrl %j', (route, expected) => {
    expect(buildCaptureUrl(baseUrl, route)).toBe(expected)
  })

  it('uses & separator when route.path has an existing query string', () => {
    const route: Route = {
      path: '/faq?already=here',
      label: 'FAQ',
      category: 'static',
    }
    expect(buildCaptureUrl(baseUrl, route)).toBe(
      `${baseUrl}/faq?already=here&_cb=faq-already-here`,
    )
  })
})

describe('buildContextOptions', () => {
  it('returns deterministic 1280x800 light-theme no-cache context', () => {
    expect(buildContextOptions()).toEqual({
      viewport: { width: 1280, height: 800 },
      colorScheme: 'light',
      extraHTTPHeaders: { 'Cache-Control': 'no-cache' },
    })
  })

  it('produces identical output across repeated calls (determinism)', () => {
    expect(buildContextOptions()).toEqual(buildContextOptions())
  })
})

describe('resolveScreenshotDir + buildScreenshotPath', () => {
  const config: EditorialConfig = {
    outputPath: '/abs/out/dir/site-editorial-capture.md',
    baseUrl: 'https://pattern158.solutions',
    headful: false,
    mirror: false,
    exhibitsJsonPath: '/abs/out/src/data/json/exhibits.json',
  }

  it('resolveScreenshotDir returns <dirname(outputPath)>/site-editorial-capture/screenshots', () => {
    expect(resolveScreenshotDir(config)).toBe(
      nodePath.join('/abs/out/dir', 'site-editorial-capture', 'screenshots'),
    )
  })

  it.each<[number, Route, string]>([
    [0, { path: '/', label: 'Home', category: 'static' }, '00-home.png'],
    [
      1,
      { path: '/philosophy', label: 'Philosophy', category: 'static' },
      '01-philosophy.png',
    ],
    [
      7,
      {
        path: '/exhibits/exhibit-a',
        label: 'Exhibit A',
        category: 'exhibit',
        sourceSlug: 'exhibit-a',
      },
      '07-exhibit-a.png',
    ],
    [
      100,
      {
        path: '/fake-route-past-99',
        label: 'Fake',
        category: 'static',
      },
      '100-fake-route-past-99.png',
    ],
  ])('buildScreenshotPath(%i, %j) ends with %j', (index, route, expectedFilename) => {
    const result = buildScreenshotPath(config, index, route)
    expect(result.endsWith(expectedFilename)).toBe(true)
    const expectedPrefix = nodePath.join(
      '/abs/out/dir',
      'site-editorial-capture',
      'screenshots',
    )
    expect(result.startsWith(expectedPrefix)).toBe(true)
  })
})

describe('loadFaqItemCount', () => {
  let tmpDir: string
  beforeEach(async () => {
    tmpDir = await fsp.mkdtemp(nodePath.join(os.tmpdir(), 'cap-loadfaq-'))
  })
  afterEach(async () => {
    await fsp.rm(tmpDir, { recursive: true, force: true })
  })

  it('returns the array length from a valid faq.json', async () => {
    const items = [
      { id: 'a', question: 'qa', answer: 'aa', categories: [] },
      { id: 'b', question: 'qb', answer: 'ab', categories: [] },
    ]
    await fsp.writeFile(
      nodePath.join(tmpDir, 'faq.json'),
      JSON.stringify(items),
      'utf8',
    )
    const exhibitsJsonPath = nodePath.join(tmpDir, 'exhibits.json')
    expect(await loadFaqItemCount(exhibitsJsonPath)).toBe(2)
  })

  it('throws when faq.json is not an array', async () => {
    await fsp.writeFile(
      nodePath.join(tmpDir, 'faq.json'),
      '{"not": "an array"}',
      'utf8',
    )
    const exhibitsJsonPath = nodePath.join(tmpDir, 'exhibits.json')
    await expect(loadFaqItemCount(exhibitsJsonPath)).rejects.toThrow(
      /faq\.json must be a JSON array/,
    )
  })

  it('propagates ENOENT from fs.readFile when faq.json is missing', async () => {
    const exhibitsJsonPath = nodePath.join(tmpDir, 'exhibits.json')
    // faq.json never written — readFile throws ENOENT
    await expect(loadFaqItemCount(exhibitsJsonPath)).rejects.toThrow()
  })
})

describe('CaptureError', () => {
  it('name is "CaptureError" and stores route + cause', () => {
    const route: Route = { path: '/x', label: 'X', category: 'static' }
    const cause = new Error('underlying')
    const err = new CaptureError('boom', { route, cause })
    expect(err.name).toBe('CaptureError')
    expect(err.message).toBe('boom')
    expect(err.route).toBe(route)
    expect(err.cause).toBe(cause)
    expect(err instanceof Error).toBe(true)
    expect(err instanceof CaptureError).toBe(true)
  })

  it('supports omitted opts', () => {
    const err = new CaptureError('no opts')
    expect(err.name).toBe('CaptureError')
    expect(err.route).toBeUndefined()
    expect(err.cause).toBeUndefined()
  })
})

describe('captureRoutes integration (mocked Playwright)', () => {
  let tmpDir: string
  let config: EditorialConfig

  beforeEach(async () => {
    tmpDir = await fsp.mkdtemp(nodePath.join(os.tmpdir(), 'cap-integration-'))
    // Write a minimal faq.json so loadFaqItemCount resolves.
    await fsp.writeFile(
      nodePath.join(tmpDir, 'faq.json'),
      JSON.stringify([
        { id: 'a', question: 'qa', answer: 'aa', categories: [] },
      ]),
      'utf8',
    )
    // outputPath parent == tmpDir so ensureScreenshotDir can mkdir under it.
    config = {
      outputPath: nodePath.join(tmpDir, 'site-editorial-capture.md'),
      baseUrl: 'https://pattern158.solutions',
      headful: false,
      mirror: false,
      exhibitsJsonPath: nodePath.join(tmpDir, 'exhibits.json'),
    }
  })
  afterEach(async () => {
    await fsp.rm(tmpDir, { recursive: true, force: true })
    vi.restoreAllMocks()
  })

  interface MockPageOpts {
    readonly title: string
    readonly mainHtml: string
    readonly description: string
    readonly httpStatus: number
    readonly cfCacheStatus?: string
    readonly exhibitTitleCount?: number
  }

  function makeMockPage(opts: MockPageOpts): Record<string, unknown> {
    // CONTEXT.md <specifics>: the interstitial content-length signal reads
    // `response.body().then(b => b.length)` — the raw HTTP body buffer. The
    // mock uses opts.mainHtml as a stand-in body string; for integration
    // purposes the byteLength and DOM-marker semantics are identical.
    const bodyBuffer = Buffer.from(opts.mainHtml, 'utf8')
    const page: Record<string, unknown> = {
      on: vi.fn(() => undefined),
      goto: vi.fn(async () => ({
        status: () => opts.httpStatus,
        headers: () =>
          opts.cfCacheStatus !== undefined
            ? { 'cf-cache-status': opts.cfCacheStatus }
            : {},
        body: async () => bodyBuffer,
      })),
      waitForSelector: vi.fn(async () => undefined),
      waitForFunction: vi.fn(async () => undefined),
      waitForTimeout: vi.fn(async () => undefined),
      title: vi.fn(async () => opts.title),
      screenshot: vi.fn(async () => undefined),
      close: vi.fn(async () => undefined),
      $$eval: vi.fn(async () => 0),
      locator: vi.fn((selector: string) => {
        if (selector === 'meta[name="description"]') {
          return {
            getAttribute: vi.fn(async () => opts.description),
            count: vi.fn(async () => 1),
            all: vi.fn(async () => []),
          }
        }
        if (selector === 'main#main-content') {
          return {
            innerHTML: vi.fn(async () => opts.mainHtml),
            count: vi.fn(async () => 1),
            all: vi.fn(async () => []),
          }
        }
        if (selector === '.exhibit-detail-title') {
          return {
            count: vi.fn(async () => opts.exhibitTitleCount ?? 1),
            all: vi.fn(async () => []),
            innerHTML: vi.fn(async () => ''),
            getAttribute: vi.fn(async () => null),
          }
        }
        // Default locator (for FAQ hooks etc. — integration tests deliberately
        // avoid /faq so this permissive fallback suffices).
        return {
          innerHTML: vi.fn(async () => ''),
          getAttribute: vi.fn(async () => null),
          count: vi.fn(async () => 0),
          all: vi.fn(async () => []),
          click: vi.fn(async () => undefined),
        }
      }),
    }
    return page
  }

  it('returns N CapturedPage entries for N static routes', async () => {
    const routes: readonly Route[] = [
      { path: '/', label: 'Home', category: 'static' },
      { path: '/philosophy', label: 'Philosophy', category: 'static' },
    ]

    const mockContext = {
      newPage: vi.fn(async () =>
        makeMockPage({
          title: 'Pattern 158',
          mainHtml: '<h1>Hi</h1>'.padEnd(500, 'x'),
          description: 'desc',
          httpStatus: 200,
          cfCacheStatus: 'MISS',
        }),
      ),
      close: vi.fn(async () => undefined),
    }
    const mockBrowser = {
      newContext: vi.fn(async () => mockContext),
      close: vi.fn(async () => undefined),
    }

    vi.spyOn(chromium, 'launch').mockResolvedValue(mockBrowser as never)

    const result = await captureRoutes(config, routes)

    expect(result).toHaveLength(2)
    expect(result[0].route.path).toBe('/')
    expect(result[1].route.path).toBe('/philosophy')
    expect(result[0].httpStatus).toBe(200)
    expect(result[0].cfCacheStatus).toBe('MISS')
    expect(result[0].title).toBe('Pattern 158')
    expect(result[0].description).toBe('desc')
    expect(result[0].screenshotPath.endsWith('00-home.png')).toBe(true)
    expect(result[1].screenshotPath.endsWith('01-philosophy.png')).toBe(true)

    expect(mockBrowser.newContext).toHaveBeenCalledTimes(1)
    expect(mockBrowser.newContext).toHaveBeenCalledWith(buildContextOptions())
    expect(mockBrowser.close).toHaveBeenCalledTimes(1)
    expect(mockContext.close).toHaveBeenCalledTimes(1)
    // newPage called N times for route captures + (N-1) times for inter-request
    // delay pages. For N=2 routes -> 2 capture pages + 1 delay page = 3 total.
    expect(mockContext.newPage).toHaveBeenCalledTimes(2 + (routes.length - 1))
  })

  it('wraps non-CaptureError errors with route context', async () => {
    const routes: readonly Route[] = [
      { path: '/boom', label: 'Boom', category: 'static' },
    ]

    const mockContext = {
      newPage: vi.fn(async () => {
        throw new Error('playwright explode')
      }),
      close: vi.fn(async () => undefined),
    }
    const mockBrowser = {
      newContext: vi.fn(async () => mockContext),
      close: vi.fn(async () => undefined),
    }
    vi.spyOn(chromium, 'launch').mockResolvedValue(mockBrowser as never)

    // Capture the rejection once and assert both class identity AND message.
    // A regression that threw a bare `Error` with the same message would pass
    // `.rejects.toThrow(/regex/)` alone but break Plan 50's index.ts instanceof
    // dispatch (CaptureError → exit 1 vs ConfigError → exit 2).
    let caught: unknown
    try {
      await captureRoutes(config, routes)
    } catch (err) {
      caught = err
    }
    expect(caught).toBeInstanceOf(CaptureError)
    expect((caught as CaptureError).message).toMatch(
      /Capture failed for \/boom/,
    )
    expect(mockBrowser.close).toHaveBeenCalledTimes(1)
  })

  it('detects silent 404 on exhibit routes (count !== 1)', async () => {
    const routes: readonly Route[] = [
      {
        path: '/exhibits/exhibit-fake',
        label: 'Fake',
        category: 'exhibit',
        sourceSlug: 'exhibit-fake',
      },
    ]

    const mockContext = {
      newPage: vi.fn(async () =>
        makeMockPage({
          title: 'Pattern 158',
          mainHtml: '<h1>Not Found</h1>'.padEnd(500, 'x'),
          description: '',
          httpStatus: 200,
          exhibitTitleCount: 0, // silent 404 — no .exhibit-detail-title rendered
        }),
      ),
      close: vi.fn(async () => undefined),
    }
    const mockBrowser = {
      newContext: vi.fn(async () => mockContext),
      close: vi.fn(async () => undefined),
    }
    vi.spyOn(chromium, 'launch').mockResolvedValue(mockBrowser as never)

    let caught: unknown
    try {
      await captureRoutes(config, routes)
    } catch (err) {
      caught = err
    }
    expect(caught).toBeInstanceOf(CaptureError)
    expect((caught as CaptureError).message).toMatch(
      /did not render \.exhibit-detail-title/,
    )
    expect(mockBrowser.close).toHaveBeenCalledTimes(1)
  })

  it('aborts on interstitial signal (title = "Just a moment")', async () => {
    const routes: readonly Route[] = [
      { path: '/', label: 'Home', category: 'static' },
    ]

    const mockContext = {
      newPage: vi.fn(async () =>
        makeMockPage({
          title: 'Just a moment...',
          mainHtml: '<div>cf stub</div>'.padEnd(500, 'x'),
          description: '',
          httpStatus: 503,
        }),
      ),
      close: vi.fn(async () => undefined),
    }
    const mockBrowser = {
      newContext: vi.fn(async () => mockContext),
      close: vi.fn(async () => undefined),
    }
    vi.spyOn(chromium, 'launch').mockResolvedValue(mockBrowser as never)

    let caught: unknown
    try {
      await captureRoutes(config, routes)
    } catch (err) {
      caught = err
    }
    expect(caught).toBeInstanceOf(CaptureError)
    expect((caught as CaptureError).message).toMatch(
      /Cloudflare bot interstitial detected/,
    )
    expect(mockBrowser.close).toHaveBeenCalledTimes(1)
  })
})
