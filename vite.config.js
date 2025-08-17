import { defineConfig } from 'vite';
import viteSeoPlugin from './vite-seo-plugin.js';

export default defineConfig({
  base: '/vite-seo-plugin-docs/',
  plugins: [
    viteSeoPlugin({
      siteUrl: 'https://yourusername.github.io/vite-seo-plugin-docs',
      generateRobots: true,
      meta: {
        title: 'Vite SEO Plugin Docs',
        description: 'Documentation site using the Vite SEO plugin for sitemap and meta tags',
        ogImage: '/og-image.png'
      }
    })
  ]
});
