import fg from "fast-glob";
import { writeFileSync, existsSync } from "fs";
import path from "path";

export default function sitemaxPlugin(options = {}) {
  const { siteUrl = "", generateRobots = true } = options;

  return {
    name: "sitemax-plugin",
    async closeBundle() {
      const distDir = path.resolve(process.cwd(), "dist");
      if (!existsSync(distDir)) return;

      // find all html files inside dist (nested allowed)
      const files = await fg(["**/*.html"], { cwd: distDir, dot: false });
      if (!files || files.length === 0) return;

      const urls = files
        .map((f) => {
          // normalize index.html -> directory root
          let route = f.replace(/index\.html$/, "");
          route = route.replace(/\\/g, "/");
          // build absolute sitemap URLs if siteUrl provided, otherwise use root-relative paths
          if (siteUrl) {
            const base = siteUrl.replace(/\/$/, "");
            // ensure no double slashes
            return `${base}/${route}`.replace(/\/+/g, "/");
          }
          return `/${route}`.replace(/\/+/g, "/");
        })
        .map((u) => u.replace(/\/$/, "") || "/");

      const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>`;

      writeFileSync(path.join(distDir, "sitemap.xml"), sitemapContent, "utf8");

      if (generateRobots) {
        const robotsContent = `User-agent: *
Allow: /

Sitemap: ${
          siteUrl
            ? siteUrl.replace(/\/$/, "") + "/sitemap.xml"
            : "/sitemap.xml"
        }
`;
        writeFileSync(path.join(distDir, "robots.txt"), robotsContent, "utf8");
      }
    },
  };
}
