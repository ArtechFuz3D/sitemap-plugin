import http from 'node:http';
import handler from 'serve-handler';
import path from 'node:path';
import fs from 'node:fs';
import { chromium } from 'playwright';

const DIST_DIR = path.resolve('dist');
const OUTPUT_DIR = path.resolve('public', 'screenshots');
const PORT = process.env.SCREENSHOT_PORT ? Number(process.env.SCREENSHOT_PORT) : 4173;

// pages to screenshot (relative paths served from dist)
const PAGES = [
  { url: '/', name: 'index' },
  { url: '/about.html', name: 'about' },
  { url: '/services.html', name: 'services' },
  { url: '/blog.html', name: 'blog' },
  { url: '/contact.html', name: 'contact' }
];

(async () => {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('dist/ not found — run `pnpm build` first');
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // start static server serving dist
  const server = http.createServer((request, response) => {
    return handler(request, response, { public: DIST_DIR });
  });

  await new Promise((resolve, reject) => {
    server.listen(PORT, (err) => {
      if (err) return reject(err);
      console.log(`Static server running at http://localhost:${PORT}/`);
      resolve();
    });
  });

  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1200, height: 900 }});
  const page = await context.newPage();

  for (const p of PAGES) {
    try {
      const url = `http://localhost:${PORT}${p.url}`;
      console.log(`-> visiting ${url}`);
      await page.goto(url, { waitUntil: 'networkidle' , timeout: 30000 });

      // Wait for plugin-test element to appear or timeout short
      try {
        await page.waitForSelector('#plugin-test', { timeout: 5000 });
      } catch (e) {
        // continue; we still take screenshot
      }

      // Optionally wait a bit for page tests to finish
      await page.waitForTimeout(500); // small pause

      const screenshotPath = path.join(OUTPUT_DIR, `${p.name}-plugin-test.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Saved screenshot: ${screenshotPath}`);
    } catch (err) {
      console.error(`Failed to capture ${p.url}:`, err.message);
    }
  }

  await browser.close();

  // stop server
  await new Promise(resolve => server.close(resolve));
  console.log('All done — screenshots saved in public/screenshots/');
})();
