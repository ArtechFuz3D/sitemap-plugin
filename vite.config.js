import { defineConfig } from 'vite';
import viteSeoPlugin from './vite-seo-plugin.js';

export default defineConfig({
  // use relative base so serving dist/ locally works and GH Pages works too
  base: './',
  plugins: [
    viteSeoPlugin({
      siteUrl: 'https://artechfuz3d.github.io/sitemax', // set your public URL
      generateRobots: true,
      meta: {
        title: 'Vite SEO Plugin Demo',
        description: 'Demo site: sitemap + robots + meta tags via Vite plugin',
        ogImage: '/og-image.png'
      }
    })
  ]
});
