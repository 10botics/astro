// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import path from 'path';

// https://astro.build/config
export default defineConfig({
  site: 'https://10botics.com',
  output: 'static', // Static output for static website
  build: {
    assets: '_astro', // Ensure consistent asset naming
  },
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
  redirects: {
    // External redirects
    '/timesheet_submission_form': 'https://otfxid9w.paperform.co',
    '/contact-form': 'https://or0uzdua.paperform.co',
    '/formula-ai': 'https://formula-ai.racing',
    '/ai-art-competition-2023': 'https://art.10botics.com',
    '/course-overview': 'https://or0uzdua.paperform.co',
    '/minecraft-2024-registration': 'https://exgj8uei.paperform.co',
    '/minecraft-2023-registration': 'https://ofpd3jzg.paperform.co',
    
    // Internal redirects
    '/courses/:slug': '/school-courses/:slug',
    '/ai-courses': '/school-courses/scratch-ai-programming',
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
      // Ensure sitemap is accessible
      filter: (page) => !page.includes('404'),
    }),
  ],
});