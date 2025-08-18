// ...existing code...
import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const pages = [
  "index.html",
  "about.html",
  "services.html",
  "blog.html",
  "contact.html",
];

test.beforeAll(async () => {
  const { execSync } = await import("child_process");
  execSync('pnpm run build', { stdio: 'inherit' });
});

for (const pageFile of pages) {
  test(`page has title and description meta: ${pageFile}`, async ({ page }) => {
    const fileUrl = `file://${process.cwd()}/dist/${pageFile}`;
    await page.goto(fileUrl);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /.+/);
  });
}

test('dist contains sitemap.xml and robots.txt with expected content', async () => {
  const dist = path.join(process.cwd(), 'dist');
  const sitemapPath = path.join(dist, 'sitemap.xml');
  const robotsPath = path.join(dist, 'robots.txt');

  expect(fs.existsSync(sitemapPath)).toBe(true);
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  expect(sitemap.includes('<urlset')).toBe(true);

  expect(fs.existsSync(robotsPath)).toBe(true);
  const robots = fs.readFileSync(robotsPath, 'utf8');
  expect(robots.toLowerCase().includes('sitemap')).toBe(true);
});
// ...existing code...