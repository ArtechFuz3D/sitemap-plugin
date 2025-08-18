import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

test.beforeAll(async () => {
  const { execSync } = await import("child_process");
  execSync('pnpm run build', { stdio: 'inherit' });
});

// discover HTML files actually produced in dist/
const distDir = path.join(process.cwd(), "dist");
const pages = fs.existsSync(distDir)
  ? fs.readdirSync(distDir).filter((f) => f.endsWith(".html"))
  : [];

for (const pageFile of pages) {
  test(`page has title and description meta: ${pageFile}`, async ({ page }) => {
    const fileUrl = `file://${path.join(distDir, pageFile)}`;
    await page.goto(fileUrl);

    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);

    // use .first() to avoid strict-mode failure if multiple meta elements exist
    const description = page.locator('meta[name="description"]').first();
    await expect(description).toHaveAttribute("content", /.+/);
  });
}

test('dist contains sitemap.xml and robots.txt with expected content', async () => {
  const sitemapPath = path.join(distDir, 'sitemap.xml');
  const robotsPath = path.join(distDir, 'robots.txt');

  expect(fs.existsSync(sitemapPath)).toBe(true);
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  expect(sitemap.includes('<urlset')).toBe(true);

  expect(fs.existsSync(robotsPath)).toBe(true);
  const robots = fs.readFileSync(robotsPath, 'utf8');
  expect(robots.toLowerCase().includes('sitemap')).toBe(true);
});