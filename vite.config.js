import { defineConfig } from 'vite';
import viteSeoPlugin from './vite-seo-plugin.js';

export default defineConfig({
  // use relative base so serving dist/ locally works and GH Pages works too
  base: '/',
  // base: '/sitemax/',
  // build: {
  //   outDir: 'dist',
  //   rollupOptions: {
  //     input: {
  //       main: './index.html',
  //       about: './src/pages/about.html',
  //       services: './src/pages/services.html',
  //       blog: './src/pages/blog.html',
  //       contact: './src/pages/contact.html'
  //     }
  //   }
  // },
    css: {
    modules: false,
  },
  plugins: [
    viteSeoPlugin({
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
