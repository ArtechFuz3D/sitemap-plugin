import { test, expect } from "@playwright/test";

const pages = [
  "index.html",
  "about.html",
  "services.html",
  "blog.html",
  "contact.html",
];

pages.forEach((pageFile) => {
  test(`SEO meta tags present on ${pageFile}`, async ({ page }) => {
    // Load the built HTML from dist/
    const path = `file://${process.cwd()}/dist/${pageFile}`;
    await page.goto(path);

    // Check title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);

    // Description meta
    const description = await page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /.+/);

    // og:image
    const ogImage = await page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute("content", /og-image\.png/);

    // canonical link
    const canonical = await page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", new RegExp(pageFile.replace("index.html", "")));
  });
});
