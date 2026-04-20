---
phase: 48-capture-playwright-io
reviewed: 2026-04-20T00:00:00Z
depth: standard
files_reviewed: 3
files_reviewed_list:
  - scripts/editorial/capture.ts
  - scripts/editorial/types.ts
  - scripts/editorial/__tests__/capture.test.ts
findings:
  high: 0
  medium: 2
  low: 3
  info: 6
  total: 11
status: findings
---

# Phase 48: Code Review Report

**Reviewed:** 2026-04-20
**Depth:** standard
**Files Reviewed:** 3
**Status:** findings (non-blocking — 0 HIGH, 2 MEDIUM, 3 LOW, 6 INFO)

## Summary

Phase 48 delivers a well-structured, SCAF-08-compliant Playwright capture subsystem.
Code is readable, helpers are single-responsibility, resource lifecycle (nested
try/finally + per-page close) is correct, and the mocked-browser integration
tests exercise the composition glue end-to-end. No HIGH-severity issues found.

The two MEDIUM findings both cluster around a single design decision: the
Cloudflare interstitial detection is wired against the **scoped `main#main-content`
HTML** rather than the **full response body** specified in CONTEXT.md's
`<specifics>` block. This leaves two of the three CAPT-11 layered signals
(bodyBytes threshold + DOM-marker scan) effectively unreachable in practice,
because:

1. Real CF challenge pages do not render a `<main id="main-content">`, so
   `waitForSelector('#main-content', { timeout: 10_000 })` on line 350 will
   TimeoutError out **before** `detectInterstitial` ever runs. The only signal
   that would fire on a real challenge is the one that never reaches: by the
   time we read `mainHtml`, we're already past the page-ready gate.
2. The `cf-chl-opt` and `challenge-platform` markers typically appear in the
   document head/body wrapper, not inside `<main>`. Scanning `mainHtml` for
   them means they are never found.

The observable effect today is probably zero (site is accessible, CF is
passive), but this is a CAPT-11 spec drift worth fixing before the next
interstitial event. Fix proposed inline below (LOW-01 route wrap of the wait
TimeoutError + MED-02 response-body-based detection).

The remaining findings are minor: test-mock hidden assumptions, a misleading
parameter name, a consistency nit between the page-ready selector and the
HTML-scoping selector, and informational notes on error-message content
disclosure / test-coverage gaps.

## Medium

### MED-01: `detectInterstitial` receives `mainHtml.length` as `bodyBytes`, not the HTTP response body

**File:** `scripts/editorial/capture.ts:369`
**Issue:**

`capturePage` calls `detectInterstitial({ title: pageTitle, bodyBytes: mainHtml.length, html: mainHtml })`. But CONTEXT.md's `<specifics>` block (line 144) explicitly says:

> Interstitial content-length check uses `response.body().then(b => b.length)` — not `text().length`.

`mainHtml.length` is the length of `<main id="main-content">` innerHTML in characters, not the HTTP response body in bytes. Two consequences:

1. **False positives** on legit routes where `<main>` happens to be short
   (e.g. `/contact` could render a minimal main block). The 200-character floor
   on main-content HTML is a very different threshold than a 200-byte floor on
   the wire response.
2. **False negatives** on CF interstitials that stuff enough padding into
   `<main>` or that serve a full-size error page (but CF challenges rarely
   render a `<main>` element at all — see LOW-01).

Combined with the fact that `cf-chl-opt` / `challenge-platform` markers live
outside `<main>` in practice, two of CAPT-11's three layered signals are
effectively unreachable as wired.

**Fix:**

Read the response body once after `page.goto` returns and pass it through. Playwright's `Response.body()` returns `Buffer`; use `.byteLength` for the byte count and `.toString('utf8')` for the HTML scan:

```ts
const response = await page.goto(url, {
  timeout: 30_000,
  waitUntil: 'domcontentloaded',
})
const rawBody = (await response?.body()) ?? Buffer.alloc(0)
const rawBodyHtml = rawBody.toString('utf8')
// ...existing httpStatus + cfCacheStatus reads...

// Do the interstitial check EARLY (before waitForSelector) so CF challenge
// pages that do not render #main-content still abort with a precise message.
const interstitialReason = detectInterstitial({
  title: await page.title().catch(() => ''),
  bodyBytes: rawBody.byteLength,
  html: rawBodyHtml,
})
if (interstitialReason !== null) {
  throw new CaptureError(
    `Cloudflare bot interstitial detected on ${route.path} — ${interstitialReason}`,
    { route },
  )
}

await page.waitForSelector('#main-content', { timeout: 10_000 })
// ...rest of the flow...
```

This also resolves LOW-01.

### MED-02: Listeners are attached after `context.newPage()` but there is no try/catch around `page.on()` — early page closure races are silent

**File:** `scripts/editorial/capture.ts:326-338`
**Issue:**

If `context.newPage()` resolves but the page is torn down immediately (crash, context closed externally), `page.on('console', ...)` can throw a "Target closed" error. Because `const page = await context.newPage()` is above the `try { ... } finally { await page.close() }` block, a throw from `page.on` (or from any line 327-338 statement) propagates **without** the page.close() cleanup, leaking the page handle.

In practice `page.on` almost never throws, but the defensive pattern would be to put the listener attachment **inside** the try block.

**Fix:**

Move the `consoleErrors` buffer allocation and both `page.on(...)` calls inside the `try` block so the `finally { await page.close() }` always runs if anything between newPage and return throws:

```ts
const page = await context.newPage()
try {
  const consoleErrors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', (err) => {
    consoleErrors.push(err.message)
  })
  // ...existing body...
} finally {
  await page.close()
}
```

Low real-world hit rate, but trivial to fix and matches the "one-try-per-resource" convention already used for browser + context in `captureRoutes`.

## Low

### LOW-01: CF interstitial signals 2 and 3 are unreachable — `waitForSelector('#main-content')` fails first on real challenge pages

**File:** `scripts/editorial/capture.ts:350`
**Issue:**

On an actual Cloudflare "Just a moment..." challenge, there is no
`<main id="main-content">` in the document. `page.waitForSelector('#main-content', { timeout: 10_000 })` will TimeoutError out **before** `detectInterstitial` runs (line 367). The TimeoutError then propagates raw up to `captureRoutes`, which wraps it in a generic `CaptureError('Capture failed for /path: ...selector timeout...')` — not the actionable `'Cloudflare bot interstitial detected on /path — ...'` message CAPT-11 promises.

Only the title-regex signal (signal 1) has a chance of firing, and only if the CF page somehow ends up with a `#main-content` element (it does not today).

**Fix:**

Run `detectInterstitial` **before** `waitForSelector`, using the raw response body (see MED-01 fix). The combined patch resolves both findings in one change. After the fix, all three CAPT-11 signals become reachable.

### LOW-02: Page-ready selector (`#main-content`) and HTML-scoping selector (`main#main-content`) are inconsistent

**File:** `scripts/editorial/capture.ts:350` vs `scripts/editorial/capture.ts:363`
**Issue:**

Line 350: `page.waitForSelector('#main-content', { timeout: 10_000 })` — matches any element with that id.
Line 363: `page.locator('main#main-content').innerHTML()` — requires the element to be a `<main>`.

If a future Vue template regression ever renamed the outer `<main>` to `<section>` or added a second `#main-content` node (a `<div id="main-content">` under an iframe, for example), the wait would pass but the innerHTML call would throw a non-descript locator error. Cheap to make consistent.

**Fix:**

Use the same selector in both places:

```ts
await page.waitForSelector('main#main-content', { timeout: 10_000 })
```

### LOW-03: Integration tests assert on `rejects.toThrow(/regex/)` without verifying `err instanceof CaptureError`

**File:** `scripts/editorial/__tests__/capture.test.ts:430-433, 464-467, 492-495`
**Issue:**

All three error-path integration tests use `await expect(...).rejects.toThrow(/regex/)`. This asserts the error's `.message` matches but **not** that the error class is `CaptureError`. A regression that changed the throw to a bare `Error` with the same message text would pass these tests, yet break the `err instanceof CaptureError` exit-code dispatch at Phase 50's outer boundary (exit 1 vs exit 2).

**Fix:**

Add instanceof assertions alongside the message match:

```ts
await expect(captureRoutes(config, routes)).rejects.toBeInstanceOf(CaptureError)
await expect(captureRoutes(config, routes)).rejects.toThrow(
  /Cloudflare bot interstitial detected/,
)
```

Or capture the error once and assert both:

```ts
let caught: unknown
try { await captureRoutes(config, routes) } catch (e) { caught = e }
expect(caught).toBeInstanceOf(CaptureError)
expect((caught as CaptureError).message).toMatch(/Cloudflare bot interstitial detected/)
expect((caught as CaptureError).route?.path).toBe('/')
```

Same fix applies to the "silent 404" and "non-CaptureError wrap" tests.

## Info

### INF-01: `bodyBytes` parameter name is misleading given the current wiring

**File:** `scripts/editorial/capture.ts:90, 96-98, 369`
**Issue:**

`detectInterstitial`'s parameter is typed `bodyBytes: number`, but `capturePage` passes `mainHtml.length`, which is a character count of scoped main-content HTML. Reading the function signature in isolation, the reader expects "bytes of the HTTP response body" — not "characters of `<main>` innerHTML". Ties into MED-01; once that fix lands, the name and value will agree.

**Fix:** Either rename the param to `mainHtmlLength` if the scoped-HTML wiring is deliberate, or pass `response.body().byteLength` per MED-01.

### INF-02: Integration tests do not assert `page.close()` or `context.close()` fired on failure paths

**File:** `scripts/editorial/__tests__/capture.test.ts:413-496`
**Issue:**

The three error-path integration tests (non-CaptureError wrap, silent 404, interstitial) all assert `mockBrowser.close` was called once, but not `mockContext.close` or the per-route `page.close`. A regression that moved the inner `finally { await context.close() }` into a sibling branch, or that forgot the `page.close()` in `capturePage`'s finally, would not be caught.

**Fix:** Add to each failure-path test:

```ts
expect(mockContext.close).toHaveBeenCalledTimes(1)
// If the mock page is hoisted to a shared variable:
expect(mockPage.close).toHaveBeenCalledTimes(1)
```

### INF-03: `loadFaqItemCount` ENOENT test passes on any rejection

**File:** `scripts/editorial/__tests__/capture.test.ts:248-252`
**Issue:**

The test at line 248 ("propagates ENOENT from fs.readFile when faq.json is missing") asserts only `rejects.toThrow()` — any thrown error passes. If the function were silently changed to return 0 on missing file (an anti-pattern, but possible via `.catch(() => 0)`), a different regression would also slip: a broken parser throwing SyntaxError would satisfy this assertion just as well as the intended ENOENT.

**Fix:**

```ts
await expect(loadFaqItemCount(exhibitsJsonPath)).rejects.toThrow(/ENOENT/)
```

Or assert on `err.code === 'ENOENT'` via the `.rejects.toMatchObject({ code: 'ENOENT' })` shape.

### INF-04: Cache-buster URL includes query-string characters when route.path has a query — legible but unintended

**File:** `scripts/editorial/capture.ts:165-170`, **Test:** `scripts/editorial/__tests__/capture.test.ts:134-143`
**Issue:**

For `route.path === '/faq?already=here'`, `buildCaptureUrl` produces `…/faq?already=here&_cb=faq-already-here`. The slug is derived from the entire path+query string, so the cache-buster ends up encoding the query parameters. This never fires on the current STATIC_ROUTES (none have query strings) and the test locks the current behavior — but if an exhibit route's `sourceSlug` were missing and its path were ever to carry a query, the cache-buster slug would mix path + query content. Semantically odd if it ever matters; cosmetic today.

**Fix:** None required today. If the behavior is undesirable, slugify only `route.path.split('?')[0]` when no `sourceSlug` is available.

### INF-05: Integration-test happy path does not exercise the `/faq` code path

**File:** `scripts/editorial/__tests__/capture.test.ts:353-411`
**Issue:**

The acknowledged comment at line 353-354 says:

> Default locator (for FAQ hooks etc. — integration tests deliberately avoid /faq so this permissive fallback suffices).

This leaves `runFaqPreCaptureHooks` branch coverage in `capturePage` untested at the integration layer. A regression in the `if (route.path === '/faq') { await runFaqPreCaptureHooks(...) }` gate (e.g. the gate accidentally deleted) would not be caught by integration tests. `runFaqPreCaptureHooks` itself has its own unit tests (per 48-04-SUMMARY) but the wiring is not proven end-to-end.

**Fix:** Add an integration test that threads a `/faq` route through `captureRoutes` with a mock whose `.faq-accordion-item` locator returns a matching count and aria-expanded state. Optional — the grep gates in Plan 48-03 already verify the `if (route.path === '/faq')` line is present.

### INF-06: `detectInterstitial` error message echoes the raw page title

**File:** `scripts/editorial/capture.ts:93-95`
**Issue:**

`return \`title contains "Just a moment" — got "${input.title}"\`` echoes the page title verbatim into the CaptureError message. If the site ever serves a page whose title contains control characters, ANSI escapes, or extremely long strings, those end up in stderr / exit logs / the `FINDINGS.md` produced downstream. For a tool capturing one's own site this is a non-issue; worth noting for the future if capture targets diversify.

**Fix:** None required today. If editorial output ever surfaces capture errors publicly, truncate/escape the echoed title: `JSON.stringify(input.title.slice(0, 120))`.

---

_Reviewed: 2026-04-20_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
