// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import image from '@astrojs/image';
import path from 'path';

// https://astro.build/config
export default defineConfig({
  site: 'https://staging.10botics.com',
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
  integrations: [
    tailwind({
      // Apply TailwindCSS to all files
      applyBaseStyles: true,
      // Optimize Tailwind for production
      config: {
        content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
        theme: {
          extend: {},
        },
        plugins: [],
      },
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // Ensure sitemap is accessible
      filter: (page) => !page.includes('404'),
    }),
    image({
      // Image optimization settings
      serviceEntryPoint: '@astrojs/image/sharp',
      logLevel: 'error',
      // Optimize images for web
      defaults: {
        format: 'webp',
        quality: 80,
      },
      // Responsive image sizes
      sizes: [400, 800, 1200],
    }),
  ],
  // Performance optimizations
  experimental: {
    optimizeHoistedScript: true,
  },
  // Build optimizations
  build: {
    inlineStylesheets: 'auto',
  },
});