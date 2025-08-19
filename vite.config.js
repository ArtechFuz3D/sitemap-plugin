import { defineConfig } from 'vite';
import sitemaxPlugin from './sitemax-plugin.js';
import { resolve } from 'path';

export default defineConfig({
  // use relative base so serving dist/ locally works and GH Pages works too
  // base: './',
  base: '/sitemax/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'src/pages/about.html'),
        services: resolve(__dirname, 'src/pages/services.html'),
        blog: resolve(__dirname, 'src/pages/blog.html'),
        contact: resolve(__dirname, 'src/pages/contact.html'),
      }
    }
  },
    css: {
    modules: false,
  },
  plugins: [
    sitemaxPlugin({
      siteUrl: 'https://artechfuz3d.github.io/sitemax', // set your public URL
      generateRobots: true,
      meta: {
        title: 'Sitemax - Sitemap Generator Plugin',
        description: 'Welcome to the Sitemap Generator Plugin site - showcasing automatic Sitemap Generation and SEO optimization',
        ogImage: '/og-image.png'
      }
    })
  ]
});
