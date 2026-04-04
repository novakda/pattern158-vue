import { getCssSelector } from 'css-selector-generator'
import type { ElementCapture } from './feedback.types'

const MAX_ANCESTOR_WALK = 10

function getVueComponentName(el: HTMLElement): string | null {
  let node: HTMLElement | null = el
  let depth = 0

  while (node && depth < MAX_ANCESTOR_WALK) {
    const vueComponent = (node as any).__vueParentComponent
    if (vueComponent?.type?.name) {
      return vueComponent.type.name
    }
    node = node.parentElement
    depth++
  }

  return null
}

export function captureElement(el: HTMLElement): ElementCapture {
  const tag = el.tagName.toLowerCase()
  const selectorPath = getCssSelector(el, {
    blacklist: [/^data-v-/, /^data-test-/],
    maxCombinations: 100,
    maxCandidates: 100,
  })
  const boundingRect = el.getBoundingClientRect()
  const componentName = getVueComponentName(el)

  return { tag, selectorPath, boundingRect, screenshotDataUri: null, componentName }
}
