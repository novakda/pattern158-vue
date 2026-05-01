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

  it('has a /case-files route with a component', () => {
    const route = routes.find(r => r.path === '/case-files')
    expect(route).toBeDefined()
    expect(route).toHaveProperty('component')
  })

  it('/case-files route appears before the catch-all', () => {
    const caseFilesIndex = routes.findIndex(r => r.path === '/case-files')
    const catchAllIndex = routes.findIndex(r => r.name === 'not-found')
    expect(caseFilesIndex).toBeGreaterThan(-1)
    expect(caseFilesIndex).toBeLessThan(catchAllIndex)
  })

  it('/portfolio redirects to /case-files', () => {
    const route = routes.find(r => r.path === '/portfolio')
    expect(route).toBeDefined()
    expect(route).toHaveProperty('redirect', '/case-files')
    expect(route).not.toHaveProperty('component')
  })

  it('/testimonials redirects to /case-files', () => {
    const route = routes.find(r => r.path === '/testimonials')
    expect(route).toBeDefined()
    expect(route).toHaveProperty('redirect', '/case-files')
    expect(route).not.toHaveProperty('component')
  })
})
