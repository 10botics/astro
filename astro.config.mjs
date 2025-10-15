// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import path from 'path';
import { urlAliases } from './src/utils/urlAliases.js';

import vercel from '@astrojs/vercel';

// Helper function to extract all non-canonical alias URLs
function getNonCanonicalUrls() {
  const nonCanonicalUrls = new Set();
  
  for (const [filename, config] of Object.entries(urlAliases)) {
    if (config.tags && config.main) {
      // Also exclude the filename-based URL if it's different from the canonical
      // Extract the base filename without .astro extension
      const baseFilename = filename.replace('.astro', '');
      
      // Check if this filename would generate a non-canonical URL
      // For root-level pages, the filename itself becomes a URL
      for (const [tag, aliases] of Object.entries(config.tags)) {
        if (tag === 'root' && baseFilename !== config.main) {
          // Add filename-based URL to exclusion set
          nonCanonicalUrls.add(`/${baseFilename}`);
          nonCanonicalUrls.add(`/${baseFilename}/`);
        }
      }
      
      // Iterate through all tags and their aliases
      for (const [tag, aliases] of Object.entries(config.tags)) {
        for (const alias of aliases) {
          // If this alias is NOT the main canonical URL, add it to the set
          if (alias !== config.main) {
            // Construct the full path based on the tag
            const fullPath = tag === 'root' ? `/${alias}` : `/${tag}/${alias}`;
            nonCanonicalUrls.add(fullPath);
            // Also add the version with trailing slash
            nonCanonicalUrls.add(`${fullPath}/`);
          }
        }
      }
    }
  }
  
  return nonCanonicalUrls;
}

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

    // Year-based legacy WordPress URLs (2021)
    '/2021/:path*': '/news',

    // Year-based legacy WordPress URLs (2022)
    '/2022/:path*': '/news',

    // Year-based legacy WordPress URLs (2023)
    '/2023/:path*': '/news',

    // Year-based legacy WordPress URLs (2024)
    '/2024/:path*': '/news',

    // Year-based legacy WordPress URLs (2025)
    '/2025/:path*': '/news',
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
      // Filter to only include canonical URLs
      filter: (page) => {
        // Exclude 404 pages
        if (page.includes('404')) return false;
        
        // Extract the path from the full URL
        const url = new URL(page);
        const path = url.pathname;
        // Decode the path to handle URL-encoded characters (spaces, special chars)
        const decodedPath = decodeURIComponent(path);
        
        // Exclude /course/ prefix entirely - /school-courses/ is the canonical prefix
        if (path.startsWith('/course/') || path === '/course') {
          return false;
        }
        
        // Exclude year archive directories
        if (path.startsWith('/2021/') || path.startsWith('/2022/') || 
            path.startsWith('/2023/') || path.startsWith('/2024/') || 
            path.startsWith('/2025/') || path.startsWith('/blog/')) {
          return false;
        }
        
        // Define redirect sources to exclude from sitemap
        const redirectSources = [
          '/timesheet_submission_form',
          '/contact-form',
          '/formula-ai',
          '/ai-art-competition-2023',
          '/course-overview',
          '/minecraft-2024-registration',
          '/minecraft-2023-registration',
          '/ai-courses',
          '/category/blog',
          '/category/news',
          '/category/past-activities',
          '/category/科學知識',
          '/author/admin',
          '/author/alanchan',
          '/author/cyruslam',
          '/author/jacksonchan',
          '/author/jennyli',
          '/author/karenkwan',
          '/author/kingsumcheung',
          '/author/mark',
          '/author/sukileung',
          '/cart',
          '/checkout',
          '/my-account',
        ];
        
        // Exclude redirect sources - these are not canonical URLs
        if (redirectSources.includes(path) || redirectSources.includes(path + '/')) {
          return false;
        }
        
        // Get non-canonical alias URLs
        const nonCanonicalUrls = getNonCanonicalUrls();
        
        // Exclude non-canonical alias URLs (check both encoded and decoded paths)
        if (nonCanonicalUrls.has(path) || nonCanonicalUrls.has(decodedPath)) {
          return false;
        }
        
        return true;
      },
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