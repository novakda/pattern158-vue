# External Integrations

**Analysis Date:** 2026-03-15

## APIs & External Services

**Not Applicable:**
- No third-party API integrations detected in codebase
- No external service SDK imports (stripe, supabase, AWS, etc.)
- Project is a static portfolio/informational website

## Data Storage

**Databases:**
- Not applicable - No database required

**File Storage:**
- Local filesystem only
- Static assets stored in `src/assets/` directory
- Built/deployed as static files to `dist/`

**Caching:**
- Browser caching via standard HTTP cache headers (configured by hosting provider)
- Vite-managed module caching during development

## Authentication & Identity

**Auth Provider:**
- Not applicable - No user authentication required
- Public informational website

## Monitoring & Observability

**Error Tracking:**
- Not detected - No error tracking SDK configured

**Logs:**
- Browser console logs only (via standard JavaScript `console` methods)
- No centralized logging service

## CI/CD & Deployment

**Hosting:**
- Not configured - Project is a static Vite build
- Deployment target: Any static file hosting (recommended: Netlify, Vercel, GitHub Pages)
- Build output directory: `dist/`

**CI Pipeline:**
- Not detected - No CI/CD configuration present
- Manual deployment via `npm run build` and upload of `dist/` directory

## Environment Configuration

**Required env vars:**
- None required - All configuration is hardcoded or built-time

**Production Configuration:**
- Site base URL: `https://pattern158.solutions` (hardcoded in `src/composables/useSeo.ts`)
- OG image: `/assets/images/logos/pattern158_logo_3pipes_detailed.png` (relative path)
- Site name: "Pattern 158 Solutions" (hardcoded in `src/composables/useSeo.ts`)

**Secrets location:**
- Not applicable - No secrets management required

## Webhooks & Callbacks

**Incoming:**
- Not applicable - No webhook endpoints

**Outgoing:**
- None configured

## Social & Marketing Links

**External Links (hardcoded):**
- LinkedIn: `https://linkedin.com/in/dan-novak-5692197` (in `src/components/FooterBar.vue`)
- These are simple `<a>` tags with no tracking or API integration

## SEO & Meta Management

**Tool:**
- @unhead/vue (^2.0.0) - Dynamic head management
- Implementation: `src/composables/useSeo.ts`
- Sets: Title, meta description, Open Graph tags, Twitter Card, canonical URLs

**Pattern:**
```typescript
// src/composables/useSeo.ts
export function useSeo({ title, description, path }: SeoOptions) {
  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: fullUrl },
      // ... additional OG and Twitter tags
    ],
    link: [
      { rel: 'canonical', href: fullUrl },
    ],
  })
}
```

---

*Integration audit: 2026-03-15*
