export function computePanelPosition(
  elementRect: DOMRect,
  panelWidth = 360,
  panelHeight = 400,
): { top: number; left: number } {
  let top: number
  let left: number

  // Preferred: right of element
  left = elementRect.right + 12
  top = elementRect.top

  // If right overflows viewport, try left of element
  if (left + panelWidth > window.innerWidth - 12) {
    left = elementRect.left - panelWidth - 12
  }

  // If left also overflows, center horizontally and position below
  if (left < 12) {
    left = Math.max(12, (window.innerWidth - panelWidth) / 2)
    top = elementRect.bottom + 12

    // If below overflows, position above element
    if (top + panelHeight > window.innerHeight - 12) {
      top = elementRect.top - panelHeight - 12
    }
  }

  // Final clamp
  top = Math.max(12, Math.min(top, window.innerHeight - panelHeight - 12))
  left = Math.max(12, Math.min(left, window.innerWidth - panelWidth - 12))

  return { top, left }
}
