// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import path from 'path';

import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
  site: 'https://staging.10botics.com',
  output: 'static', // Static output for static website
  build: {
    assets: '_astro', // Ensure consistent asset naming
    inlineStylesheets: 'auto',
  },
  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src'),
        '@table': path.resolve('./src/table'),
      },
    },
    // Exclude migration data from being watched
    server: {
      watch: {
        ignored: [
          'xml-guided-migration-data/**',
          'migration-data/**',
          'conversion-report.json',
          'comprehensive-crawl-report.json',
          'media-filename-mapping.json'
        ]
      }
    },
    // Build optimizations for better performance
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['astro:assets'],
          },
        },
      },
      // Optimize chunk size
      chunkSizeWarningLimit: 1000,
    },
    // CSS optimization
    css: {
      devSourcemap: false,
    },
  },
  integrations: [tailwind({
    // Apply TailwindCSS to all files
    applyBaseStyles: true,
  }), sitemap({
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: new Date(),
    // Ensure sitemap is accessible
    filter: (page) => !page.includes('404'),
  }), db()],
  // Image optimization using built-in Astro assets
  image: {
    // Enable image optimization
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    // Responsive image sizes
    breakpoints: [400, 800, 1200],
  },
});