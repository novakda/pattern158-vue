import { useHead } from '@unhead/vue'

interface SeoOptions {
  title: string
  description: string
  path: string
  canonical?: string
}

const SITE_NAME = 'Pattern 158 Solutions'
const BASE_URL = 'https://pattern158.solutions'
const OG_IMAGE = `${BASE_URL}/assets/images/logos/pattern158_logo_3pipes_detailed.png`

export function useSeo({ title, description, path }: SeoOptions) {
  const fullUrl = `${BASE_URL}${path}`

  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'author', content: 'Dan Novak' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: fullUrl },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '627' },
      { property: 'og:site_name', content: SITE_NAME },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    link: [
      { rel: 'canonical', href: fullUrl },
    ],
  })
}
