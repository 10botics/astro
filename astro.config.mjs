// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import path from 'path';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.10botics.com',

  // Static output for static website
  output: 'static',

  build: {
    assets: '_astro', // Ensure consistent asset naming
  },

  image: {
    domains: ["www.10botics.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.www.10botics.com",
      }
    ]
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
    '/ai-art-competition-2023': 'https://art.www.10botics.com',
    '/course-overview': 'https://or0uzdua.paperform.co',
    '/minecraft-2024-registration': 'https://exgj8uei.paperform.co',
    '/minecraft-2023-registration': 'https://ofpd3jzg.paperform.co',
    '/ai-courses': '/school-courses/scratch-ai-programming',
    // Category redirects (legacy URLs)
    '/category/blog': '/news',
    '/category/news': '/news',
    '/category/past-activities': '/news',
    '/category/科學知識': '/news',
    '/author/admin': '/news',
    '/author/alanchan': '/news',
    '/author/cyruslam': '/news',
    '/author/jacksonchan': '/news',
    '/author/jennyli': '/news',
    '/author/karenkwan': '/news',
    '/author/kingsumcheung': '/news',
    '/author/mark': '/news',
    '/author/sukileung': '/news',
    '/cart': '/contact-us',
    '/checkout': '/contact-us',
    '/my-account': '/contact-us',
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
      // Custom serializer to properly encode URLs
      serialize: (item) => {
        // Properly encode the URL to handle spaces and special characters
        const encodedUrl = item.url.replace(/ /g, '%20');
        return {
          ...item,
          url: encodedUrl
        };
      },
    }),
  ],

  adapter: vercel(),
});