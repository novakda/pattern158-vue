import { describe, it, expect } from 'vitest'
import { routes } from '@/router'

describe('router routes', () => {
  it('has a /exhibits/:slug dynamic route', () => {
    expect(routes.some(r => r.path === '/exhibits/:slug')).toBe(true)
  })

  it('/exhibits/:slug route appears before the catch-all', () => {
    const exhibitIndex = routes.findIndex(r => r.path === '/exhibits/:slug')
    const catchAllIndex = routes.findIndex(r => r.name === 'not-found')
    expect(exhibitIndex).toBeGreaterThan(-1)
    expect(catchAllIndex).toBeGreaterThan(-1)
    expect(exhibitIndex).toBeLessThan(catchAllIndex)
  })

  it('catch-all route name is not-found', () => {
    expect(routes.find(r => r.name === 'not-found')).toBeDefined()
  })
})
