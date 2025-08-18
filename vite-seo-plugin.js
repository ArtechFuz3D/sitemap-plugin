import fg from 'fast-glob';
import { writeFileSync } from 'fs';
import path from 'path';

export default function viteSeoPlugin(options = {}) {
  const { siteUrl = '', generateRobots = true, meta = {} } = options;

  return {
    name: 'vite-seo-plugin',

    transformIndexHtml(html) {
      let headTags = '';
      if (meta.title) headTags += `<title>${meta.title}</title>`;
      if (meta.description) headTags += `<meta name="description" content="${meta.description}"/>`;
      if (meta.ogImage) headTags += `<meta property="og:image" content="${meta.ogImage}"/>`;
      if (meta.title) headTags += `<meta property="og:title" content="${meta.title}"/>`;
      if (meta.description) headTags += `<meta property="og:description" content="${meta.description}"/>`;
      headTags += `<meta property="og:type" content="website"/>`;
      return html.replace(/<head>(.*?)<\/head>/s, `<head>$1${headTags}</head>`);
    },

    async closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist');
      const files = await fg(['**/*.html'], { cwd: distDir });
      const urls = files.map(f => {
        let route = f.replace(/index\.html$/, '');
        route = route.replace(/\\/g, '/');
        return `${siteUrl}/${route}`;
      });

      const sitemapContent = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`;
      writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent);

      if (generateRobots) {
        const robotsContent = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
        writeFileSync(path.join(distDir, 'robots.txt'), robotsContent);
      }
    }
  };
}
