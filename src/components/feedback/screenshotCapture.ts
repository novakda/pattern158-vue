/**
 * Captures a screenshot of the given DOM element using html2canvas.
 * Returns a PNG data URI string.
 * Lazy-loads html2canvas to keep it out of the initial bundle.
 */
export async function screenshotCapture(el: HTMLElement): Promise<string> {
  const { default: html2canvas } = await import('html2canvas')
  const canvas = await html2canvas(el, {
    scale: 1,
    logging: false,
    useCORS: true,
  })
  return canvas.toDataURL('image/png')
}
