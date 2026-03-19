// Captures all 15 exhibit pages at 375px, 768px, 1280px
// Run: node .planning/phases/05-exhibit-audit/screenshot-exhibits.js
// Requires: dev server running on http://localhost:5178

const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')

const BASE_URL = 'http://localhost:5178'

const exhibits = [
  'exhibit-a', 'exhibit-b', 'exhibit-c', 'exhibit-d', 'exhibit-e',
  'exhibit-f', 'exhibit-g', 'exhibit-h', 'exhibit-i', 'exhibit-j',
  'exhibit-k', 'exhibit-l', 'exhibit-m', 'exhibit-n', 'exhibit-o',
]

const breakpoints = [
  { name: '375', width: 375, height: 812 },
  { name: '768', width: 768, height: 1024 },
  { name: '1280', width: 1280, height: 800 },
]

const outputDir = path.join(__dirname, 'screenshots')
fs.mkdirSync(outputDir, { recursive: true })

;(async () => {
  const browser = await chromium.launch()
  for (const exhibit of exhibits) {
    for (const bp of breakpoints) {
      const page = await browser.newPage()
      await page.setViewportSize({ width: bp.width, height: bp.height })
      await page.goto(`${BASE_URL}/exhibits/${exhibit}`)
      await page.waitForLoadState('networkidle')
      const filename = `${exhibit}-${bp.name}.png`
      await page.screenshot({
        path: path.join(outputDir, filename),
        fullPage: true,
      })
      await page.close()
      console.log(`Captured: ${filename}`)
    }
  }
  await browser.close()
  console.log(`\nDone. 45 screenshots in: ${outputDir}`)
})()
