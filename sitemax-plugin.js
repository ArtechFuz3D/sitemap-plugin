import fg from "fast-glob";
import { writeFileSync, existsSync } from "fs";
import path from "path";

export default function sitemaxPlugin(options = {}) {
  const { siteUrl = "", generateRobots = true } = options;

  const isAbsoluteUrl = (u) => /^https?:\/\//i.test(u);

  return {
    name: "sitemax-plugin",
    async closeBundle() {
      const distDir = path.resolve(process.cwd(), "dist");
      if (!existsSync(distDir)) {
        console.warn("sitemax-plugin: no dist/ directory found, skipping.");
        return;
      }

      const files = await fg(["**/*.html"], { cwd: distDir, dot: false });
      if (!files || files.length === 0) {
        console.warn("sitemax-plugin: no HTML files found in dist/, skipping.");
        return;
      }

      const urls = files
        .map((f) => {
          // normalize index.html -> directory root
          let route = f.replace(/index\.html$/, "");
          route = route.replace(/\\/g, "/");
          // build absolute URL if siteUrl provided and looks valid
          if (siteUrl && isAbsoluteUrl(siteUrl)) {
            const base = siteUrl.replace(/\/$/, "");
            return `${base}/${route}`.replace(/\/+/g, "/").replace(/\/$/, "");
          }
          // fallback to root-relative path
          const rel = `/${route}`.replace(/\/+/g, "/").replace(/\/$/, "");
          return rel === "" ? "/" : rel;
        })
        // dedupe
        .filter(Boolean)
        .reduce((acc, cur) => (acc.includes(cur) ? acc : acc.concat(cur)), []);

      const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>`;

      writeFileSync(path.join(distDir, "sitemap.xml"), sitemapContent, "utf8");
      console.log(`sitemax-plugin: wrote sitemap.xml (${urls.length} urls)`);

      if (generateRobots) {
        const sitemapLine = siteUrl && isAbsoluteUrl(siteUrl)
          ? `${siteUrl.replace(/\/$/, "")}/sitemap.xml`
          : "/sitemap.xml";
        const robotsContent = `User-agent: *
Allow: /

Sitemap: ${sitemapLine}
`;
        writeFileSync(path.join(distDir, "robots.txt"), robotsContent, "utf8");
        console.log("sitemax-plugin: wrote robots.txt");
      }
    },
  };
}