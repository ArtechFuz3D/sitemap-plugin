import { defineConfig } from 'vite';
import viteSeoPlugin from './vite-seo-plugin.js';

export default defineConfig({
  base: '/vite-seo-plugin-demo/',
  plugins: [
    viteSeoPlugin({
      siteUrl: 'https://yourusername.github.io/vite-seo-plugin-demo',
      generateRobots: true,
      meta: {
        title: 'Vite SEO Plugin Demo',
        description: 'Demo site using the Vite SEO plugin for multi-page SEO',
        ogImage: '/og-image.png'
      }
    })
  ]
});
