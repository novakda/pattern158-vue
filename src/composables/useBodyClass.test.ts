import { describe, it, expect } from 'vitest'

describe('useBodyClass — infrastructure smoke test', () => {
  it('composable module imports without error', async () => {
    const mod = await import('@/composables/useBodyClass')
    expect(mod.useBodyClass).toBeTypeOf('function')
  })
})
