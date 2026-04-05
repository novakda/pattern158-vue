import type { ElementCapture, EnvironmentMeta } from '@/components/feedback/feedback.types'

export interface SubmitResult {
  issueUrl: string
}

export interface SubmitParams {
  token: string
  repo: string
  labels: string[]
  capture: ElementCapture
  comment: string
  environment: EnvironmentMeta
}

const GITHUB_API = 'https://api.github.com'
const MAX_BODY_CHARS = 60_000

function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  }
}

async function uploadGist(
  token: string,
  screenshotDataUri: string,
): Promise<string> {
  const filename = `feedback-screenshot-${Date.now()}.png`

  const response = await fetch(`${GITHUB_API}/gists`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({
      public: false,
      files: {
        [filename]: { content: screenshotDataUri },
      },
    }),
  })

  if (response.status === 404) {
    console.warn("[githubSubmit] Gist creation returned 404. Token may lack 'gist' scope.")
    throw new Error('Gist 404')
  }

  if (!response.ok) {
    throw new Error(`Gist upload failed: ${response.status}`)
  }

  const data = await response.json()
  const rawUrl: string = data.files[filename].raw_url
  return rawUrl
}

function buildScreenshotEmbed(rawUrl: string): string {
  return `![Screenshot](${rawUrl})`
}

async function buildFallbackEmbed(screenshotDataUri: string | null, bodyLengthWithoutScreenshot: number): Promise<string> {
  if (!screenshotDataUri) {
    return '> Screenshot not available'
  }

  // Try PNG data URI first
  const pngEmbed = `![Screenshot](${screenshotDataUri})`
  if (bodyLengthWithoutScreenshot + pngEmbed.length <= MAX_BODY_CHARS) {
    return pngEmbed
  }

  // Compress to JPEG
  try {
    const jpegDataUri = await compressToJpeg(screenshotDataUri)
    const jpegEmbed = `![Screenshot](${jpegDataUri})`
    if (bodyLengthWithoutScreenshot + jpegEmbed.length <= MAX_BODY_CHARS) {
      console.warn('[githubSubmit] Using JPEG-compressed screenshot fallback')
      return jpegEmbed
    }
  } catch {
    // Canvas compression failed, fall through to omission
  }

  console.warn('[githubSubmit] Screenshot too large to embed, omitting')
  return '> Screenshot omitted: too large to embed'
}

async function compressToJpeg(dataUri: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas context unavailable'))
        return
      }
      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/jpeg', 0.5))
    }
    img.onerror = () => reject(new Error('Image load failed'))
    img.src = dataUri
  })
}

function buildIssueTitle(comment: string): string {
  const trimmed = comment.trim()
  if (trimmed.length < 5) return 'Visual feedback'
  return trimmed.length > 80 ? trimmed.slice(0, 80) : trimmed
}

function buildIssueBody(
  comment: string,
  screenshotEmbed: string,
  capture: ElementCapture,
  environment: EnvironmentMeta,
): string {
  const rect = capture.boundingRect
  return `## Feedback

${comment || '_No comment provided_'}

## Screenshot

${screenshotEmbed}

## Element

| Field | Value |
|-------|-------|
| Tag | \`${capture.tag}\` |
| Selector | \`${capture.selectorPath}\` |
| Bounding Rect | ${rect.top}, ${rect.left}, ${rect.width}x${rect.height} |
| Component | ${capture.componentName ?? 'N/A'} |

## Environment

| Field | Value |
|-------|-------|
| URL | ${environment.pageUrl} |
| Viewport | ${environment.viewport.width}x${environment.viewport.height} |
| User Agent | ${environment.userAgent} |`
}

function parseRateLimitReset(response: Response): string {
  const remaining = response.headers.get('X-RateLimit-Remaining')
  const resetEpoch = response.headers.get('X-RateLimit-Reset')
  if (remaining === '0' && resetEpoch) {
    const resetDate = new Date(parseInt(resetEpoch, 10) * 1000)
    const minutes = Math.ceil((resetDate.getTime() - Date.now()) / 60_000)
    return `GitHub API rate limit exceeded. Try again in ${minutes} minutes`
  }
  return ''
}

function handleApiError(response: Response, context: string): string {
  const rateLimitMsg = parseRateLimitReset(response)
  if (rateLimitMsg) return rateLimitMsg

  switch (response.status) {
    case 401:
    case 403:
      return 'Authentication failed -- check that your GitHub token is valid and not expired'
    case 404:
      return `Repository not found -- check VITE_GITHUB_REPO format (owner/repo)`
    case 422:
      return 'Issue creation rejected by GitHub -- body may be too large'
    default:
      return `${context} failed with status ${response.status}`
  }
}

export async function submitFeedback(params: SubmitParams): Promise<SubmitResult> {
  const { token, repo, labels, capture, comment, environment } = params

  let screenshotEmbed: string

  // Step 1: Try Gist upload
  if (capture.screenshotDataUri) {
    try {
      const rawUrl = await uploadGist(token, capture.screenshotDataUri)
      screenshotEmbed = buildScreenshotEmbed(rawUrl)
    } catch (gistError) {
      console.warn('[githubSubmit] Gist upload failed, falling back to data URI:', gistError)
      // Build body without screenshot to measure length
      const bodyWithoutScreenshot = buildIssueBody(comment, '', capture, environment)
      screenshotEmbed = await buildFallbackEmbed(capture.screenshotDataUri, bodyWithoutScreenshot.length)
    }
  } else {
    screenshotEmbed = '> Screenshot not available'
  }

  // Step 2: Create Issue
  const title = buildIssueTitle(comment)
  const body = buildIssueBody(comment, screenshotEmbed, capture, environment)

  let response: Response
  try {
    response = await fetch(`${GITHUB_API}/repos/${repo}/issues`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ title, body, labels }),
    })
  } catch {
    throw new Error('Network error -- check your internet connection')
  }

  if (!response.ok) {
    throw new Error(handleApiError(response, 'Issue creation'))
  }

  const issueData = await response.json()
  return { issueUrl: issueData.html_url }
}
