// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';
import path from 'path';

// https://astro.build/config
export default defineConfig({
  site: 'https://staging.10botics.com',
  output: 'server', // Change from 'static' to 'server'
  adapter: vercel(), // Add Vercel adapter
  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src'),
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
    }
  },
  integrations: [
    tailwind({
      // Apply TailwindCSS to all files
      applyBaseStyles: true,
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
});