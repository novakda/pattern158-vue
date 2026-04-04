import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ElementCapture } from './feedback.types'

vi.mock('css-selector-generator', () => ({
  getCssSelector: vi.fn(() => 'div > span.foo'),
}))

import { getCssSelector } from 'css-selector-generator'
import { captureElement } from './captureElement'

function createMockElement(overrides: Record<string, unknown> = {}): HTMLElement {
  const el = {
    tagName: 'DIV',
    getBoundingClientRect: () => ({
      x: 10,
      y: 20,
      width: 200,
      height: 100,
      top: 20,
      right: 210,
      bottom: 120,
      left: 10,
      toJSON: () => ({}),
    }),
    parentElement: null,
    ...overrides,
  } as unknown as HTMLElement
  return el
}

describe('captureElement', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns correct tag name (lowercase) for a div element', () => {
    const el = createMockElement()
    const result = captureElement(el)
    expect(result.tag).toBe('div')
  })

  it('returns selectorPath string from css-selector-generator', () => {
    const el = createMockElement()
    const result = captureElement(el)
    expect(result.selectorPath).toBe('div > span.foo')
    expect(getCssSelector).toHaveBeenCalledWith(el, expect.any(Object))
  })

  it('returns boundingRect with x, y, width, height from getBoundingClientRect', () => {
    const el = createMockElement()
    const result = captureElement(el)
    expect(result.boundingRect.x).toBe(10)
    expect(result.boundingRect.y).toBe(20)
    expect(result.boundingRect.width).toBe(200)
    expect(result.boundingRect.height).toBe(100)
  })

  it('returns componentName from __vueParentComponent.type.name when present', () => {
    const el = createMockElement({
      __vueParentComponent: { type: { name: 'MyButton' } },
    })
    const result = captureElement(el)
    expect(result.componentName).toBe('MyButton')
  })

  it('returns null componentName when __vueParentComponent is absent', () => {
    const el = createMockElement()
    const result = captureElement(el)
    expect(result.componentName).toBeNull()
  })

  it('returns null screenshotDataUri (screenshot is Phase 27)', () => {
    const el = createMockElement()
    const result = captureElement(el)
    expect(result.screenshotDataUri).toBeNull()
  })

  it('calls css-selector-generator with options excluding data-v-* and data-test-* attributes', () => {
    const el = createMockElement()
    captureElement(el)
    expect(getCssSelector).toHaveBeenCalledWith(
      el,
      expect.objectContaining({
        blacklist: expect.arrayContaining([
          expect.any(RegExp),
          expect.any(RegExp),
        ]),
      }),
    )
    const callArgs = (getCssSelector as ReturnType<typeof vi.fn>).mock.calls[0][1]
    const blacklist = callArgs.blacklist as RegExp[]
    const hasDataV = blacklist.some((r: RegExp) => r.test('data-v-abc123'))
    const hasDataTest = blacklist.some((r: RegExp) => r.test('data-test-id'))
    expect(hasDataV).toBe(true)
    expect(hasDataTest).toBe(true)
  })

  it('walks up ancestors to find Vue component name', () => {
    const parent = createMockElement({
      __vueParentComponent: { type: { name: 'ParentComp' } },
    })
    const el = createMockElement({ parentElement: parent })
    const result = captureElement(el)
    expect(result.componentName).toBe('ParentComp')
  })
})
