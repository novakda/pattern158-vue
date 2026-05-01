import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const exhibits = ['exhibit-a', 'exhibit-k', 'exhibit-m'];
const viewports = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1280, height: 900 },
];

const screenshotsDir = path.resolve(__dirname, 'screenshots');

async function main() {
  const browser = await chromium.launch();

  for (const exhibit of exhibits) {
    for (const vp of viewports) {
      const context = await browser.newContext({ viewport: vp });
      const page = await context.newPage();
      const url = `http://localhost:5173/exhibits/${exhibit}`;
      console.log(`Capturing ${exhibit} at ${vp.width}x${vp.height}...`);
      await page.goto(url, { waitUntil: 'networkidle' });
      // Small delay for any CSS transitions
      await page.waitForTimeout(500);
      const filename = `${exhibit}-${vp.width}.png`;
      await page.screenshot({
        path: path.join(screenshotsDir, filename),
        fullPage: true,
      });
      await context.close();
    }
  }

  await browser.close();
  console.log('All screenshots captured.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
