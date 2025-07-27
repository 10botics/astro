#!/usr/bin/env node

/**
 * XML-Guided WordPress Crawler
 * Uses WordPress XML export as a site map to discover and crawl all pages
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');
const xml2js = require('xml2js');

class XMLGuidedCrawler {
    constructor(options = {}) {
        this.xmlFile = options.xmlFile || 'migration-data/10.WordPress.2025-07-21.xml';
        this.baseUrl = options.baseUrl || 'https://10botics.com';
        this.outputDir = options.outputDir || 'xml-guided-migration-data';
        this.downloadMedia = options.downloadMedia !== false;
        this.cleanOutput = options.cleanOutput !== false; // Default to true
        this.maxPages = options.maxPages || null; // Limit number of pages to crawl
        this.maxConcurrentDownloads = options.maxConcurrentDownloads || 3;
        this.maxConcurrentCrawls = options.maxConcurrentCrawls || 2;
        this.downloadQueue = [];
        this.crawlQueue = [];
        this.discoveredUrls = new Set();
        this.crawledUrls = new Set();
        this.failedUrls = new Set();
    }

    async init() {
        console.log('🚀 Starting XML-Guided WordPress Crawler...');
        
        // Clean output directory if enabled
        if (this.cleanOutput) {
            await this.cleanOutputDirectory();
        } else {
            console.log('⚠️  Skipping output directory cleanup (cleanOutput: false)');
        }
        
        // Create output directories
        await this.createDirectories();
        
        // Launch browser
        this.browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        // Note: viewport and user agent will be set per page
    }

    async cleanOutputDirectory() {
        try {
            if (await fsPromises.access(this.outputDir).then(() => true).catch(() => false)) {
                console.log(`🧹 Cleaning output directory: ${this.outputDir}`);
                await fsPromises.rm(this.outputDir, { recursive: true, force: true });
                console.log('✅ Output directory cleaned');
            }
        } catch (error) {
            console.warn('⚠️  Warning: Could not clean output directory:', error.message);
        }
    }

    async createDirectories() {
        const dirs = [
            this.outputDir,
            `${this.outputDir}/pages`,
            `${this.outputDir}/media`,
            `${this.outputDir}/analysis`,
            `${this.outputDir}/raw`,
            `${this.outputDir}/xml-data`
        ];
        
        for (const dir of dirs) {
            await fsPromises.mkdir(dir, { recursive: true });
        }
    }

    async parseWordPressXML() {
        console.log('📄 Parsing WordPress XML file...');
        
        try {
            const xmlContent = await fsPromises.readFile(this.xmlFile, 'utf8');
            const parser = new xml2js.Parser({ explicitArray: false });
            const result = await parser.parseStringPromise(xmlContent);
            
            const siteData = {
                title: result.rss?.channel?.title || '',
                description: result.rss?.channel?.description || '',
                language: result.rss?.channel?.language || '',
                items: []
            };

            let totalItems = 0;
            let filteredItems = 0;

            // Extract all items (posts, pages, etc.)
            if (result.rss?.channel?.item) {
                const items = Array.isArray(result.rss.channel.item) 
                    ? result.rss.channel.item 
                    : [result.rss.channel.item];
                
                totalItems = items.length;
                
                for (const item of items) {
                    const processedItem = this.processXMLItem(item);
                    if (processedItem) {
                        siteData.items.push(processedItem);
                        this.discoveredUrls.add(processedItem.url);
                    } else {
                        filteredItems++;
                    }
                }
            }

            // Save parsed XML data
            await fsPromises.writeFile(
                `${this.outputDir}/xml-data/parsed-site-data.json`,
                JSON.stringify(siteData, null, 2)
            );

            console.log(`✅ Parsed ${siteData.items.length} items from XML (filtered out ${filteredItems} items)`);
            console.log(`📊 Filtering summary:`);
            console.log(`   Total items in XML: ${totalItems}`);
            console.log(`   Items after filtering: ${siteData.items.length}`);
            console.log(`   Items filtered out: ${filteredItems}`);
            
            return siteData;
            
        } catch (error) {
            console.error('❌ Error parsing XML:', error);
            throw error;
        }
    }

    processXMLItem(item) {
        try {
            const processed = {
                title: item.title || '',
                url: item.link || '',
                type: item['wp:post_type'] || 'post',
                status: item['wp:status'] || 'publish',
                date: item.pubDate || '',
                categories: [],
                tags: [],
                content: item['content:encoded'] || '',
                excerpt: item['excerpt:encoded'] || '',
                featuredImage: '',
                author: item['dc:creator'] || '',
                comments: item['wp:comment'] || []
            };

            // Extract categories
            if (item.category) {
                const categories = Array.isArray(item.category) ? item.category : [item.category];
                processed.categories = categories
                    .filter(cat => cat.$.domain === 'category')
                    .map(cat => cat._);
            }

            // Extract tags
            if (item.category) {
                const categories = Array.isArray(item.category) ? item.category : [item.category];
                processed.tags = categories
                    .filter(cat => cat.$.domain === 'post_tag')
                    .map(cat => cat._);
            }

            // Filter out unwanted URLs
            if (!this.shouldCrawlUrl(processed.url, processed.type)) {
                return null;
            }

            // Only include published items with valid URLs
            if (processed.status === 'publish' && processed.url && processed.url.startsWith('http')) {
                return processed;
            }

            return null;
        } catch (error) {
            console.error('Error processing XML item:', error);
            return null;
        }
    }

    shouldCrawlUrl(url, type) {
        if (!url || !url.startsWith('http')) {
            return false;
        }

        // Skip Elementor library items
        if (url.includes('elementor_library') || url.includes('elementor-')) {
            return false;
        }

        // Skip internal WordPress pages
        if (url.includes('/wp-admin/') || url.includes('/wp-includes/') || url.includes('/wp-content/')) {
            return false;
        }

        // Skip WooCommerce pages (if not needed)
        if (url.includes('/cart/') || url.includes('/checkout/') || url.includes('/my-account/')) {
            return false;
        }

        // Skip query parameters that indicate internal pages
        if (url.includes('?') && (url.includes('p=') || url.includes('page_id=') || url.includes('elementor_library='))) {
            return false;
        }

        // Skip specific post types that are usually internal
        if (type === 'elementor_library' || type === 'wp_block' || type === 'wp_navigation' || type === 'nav_menu_item') {
            return false;
        }

        // Only crawl main domain pages
        if (!url.includes(this.baseUrl)) {
            return false;
        }

        return true;
    }

    async crawlAllPages(siteData) {
        // Use all items that passed XML filtering (no additional filtering needed)
        const pages = siteData.items;

        // Apply page limit if specified
        const limitedPages = this.maxPages ? pages.slice(0, this.maxPages) : pages;
        
        console.log(`🌐 Starting to crawl ${limitedPages.length} pages${this.maxPages ? ` (limited to first ${this.maxPages})` : ''}...`);
        console.log(`📄 Total pages available: ${pages.length}`);

        // Process pages in batches
        const batchSize = this.maxConcurrentCrawls;
        const results = [];
        let successfulPages = 0;
        let failedPages = 0;

        for (let i = 0; i < limitedPages.length; i += batchSize) {
            const batch = limitedPages.slice(i, i + batchSize);
            console.log(`🔄 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(limitedPages.length/batchSize)} (${batch.length} pages)`);
            
            const batchResults = await Promise.allSettled(
                batch.map(page => this.crawlPage(page))
            );
            
            // Count successful vs failed pages
            for (const result of batchResults) {
                if (result.status === 'fulfilled' && result.value.success) {
                    successfulPages++;
                } else {
                    failedPages++;
                }
            }
            
            results.push(...batchResults);
            
            // Show progress
            console.log(`📊 Progress: ${successfulPages} successful, ${failedPages} failed`);
            
            // Small delay between batches
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log(`\n🎯 Crawling completed: ${successfulPages} successful pages, ${failedPages} failed pages`);
        return results;
    }

    async crawlPage(pageData) {
        const url = pageData.url;
        const filename = this.sanitizeFilename(url);
        
        try {
            console.log(`📄 Crawling: ${pageData.title} (${url})`);
            
            const page = await this.browser.newPage();
            await page.setViewport({ width: 1920, height: 1080 });
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            
            const response = await page.goto(url, { 
                waitUntil: 'networkidle2', 
                timeout: 30000 
            });
            
            // Check if page returned 404 or other error
            if (response.status() >= 400) {
                console.log(`⚠️  Skipping ${url} - HTTP ${response.status()}`);
                await page.close();
                this.failedUrls.add(url);
                return {
                    success: false,
                    url: url,
                    title: pageData.title,
                    error: `HTTP ${response.status()}`
                };
            }
            
            // Wait for content to load
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Extract page data
            const crawledData = await this.extractPageData(page);
            
            // Merge with XML data
            const mergedData = {
                ...pageData,
                crawledAt: new Date().toISOString(),
                crawledData: crawledData
            };
            
            // Save page data
            await fsPromises.writeFile(
                `${this.outputDir}/pages/${filename}.json`,
                JSON.stringify(mergedData, null, 2)
            );
            
            // Save raw HTML
            const html = await page.content();
            await fsPromises.writeFile(
                `${this.outputDir}/raw/${filename}.html`,
                html
            );
            
            // Download media from this page
            if (this.downloadMedia && crawledData.media) {
                await this.downloadMediaFromPage(crawledData.media, filename);
            }
            
            await page.close();
            
            this.crawledUrls.add(url);
            console.log(`✅ Successfully crawled: ${pageData.title}`);
            
            return {
                success: true,
                url: url,
                title: pageData.title,
                mediaCount: crawledData.media?.length || 0
            };
            
        } catch (error) {
            console.error(`❌ Failed to crawl ${url}:`, error.message);
            this.failedUrls.add(url);
            
            return {
                success: false,
                url: url,
                title: pageData.title,
                error: error.message
            };
        }
    }

    async extractPageData(page) {
        return await page.evaluate(() => {
            // Helper functions within browser context
            function extractFilenameFromUrl(url) {
                try {
                    const urlObj = new URL(url);
                    const pathname = urlObj.pathname;
                    const parts = pathname.split('/');
                    return parts[parts.length - 1] || 'unknown';
                } catch {
                    return 'unknown';
                }
            }

            function getElementAttributes(element) {
                const attributes = {};
                for (const attr of element.attributes) {
                    attributes[attr.name] = attr.value;
                }
                return attributes;
            }

            const data = {
                title: document.title,
                description: document.querySelector('meta[name="description"]')?.content || '',
                keywords: document.querySelector('meta[name="keywords"]')?.content || '',
                url: window.location.href,
                timestamp: new Date().toISOString(),
                structure: {},
                content: {},
                media: [],
                links: [],
                metaTags: {}
            };

            // Extract meta tags
            document.querySelectorAll('meta').forEach(meta => {
                const name = meta.getAttribute('name') || meta.getAttribute('property');
                if (name) {
                    data.metaTags[name] = meta.getAttribute('content');
                }
            });

            // Extract images
            document.querySelectorAll('img').forEach(img => {
                const src = img.src || img.dataset.src;
                if (src && !src.startsWith('data:')) {
                    data.media.push({
                        type: 'image',
                        src: src,
                        alt: img.alt || '',
                        title: img.title || '',
                        width: img.width || img.naturalWidth,
                        height: img.height || img.naturalHeight,
                        class: img.className,
                        id: img.id,
                        filename: extractFilenameFromUrl(src),
                        element: {
                            tag: img.tagName.toLowerCase(),
                            attributes: getElementAttributes(img)
                        }
                    });
                }
            });

            // Extract videos
            document.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"]').forEach(video => {
                const src = video.src || video.dataset.src;
                if (src) {
                    data.media.push({
                        type: 'video',
                        src: src,
                        title: video.title || '',
                        width: video.width,
                        height: video.height,
                        class: video.className,
                        id: video.id,
                        element: {
                            tag: video.tagName.toLowerCase(),
                            attributes: getElementAttributes(video)
                        }
                    });
                }
            });

            // Extract links
            document.querySelectorAll('a[href]').forEach(link => {
                const href = link.href;
                if (href && !href.startsWith('javascript:') && !href.startsWith('mailto:')) {
                    data.links.push({
                        href: href,
                        text: link.textContent?.trim() || '',
                        title: link.title || '',
                        class: link.className,
                        target: link.target,
                        isInternal: href.includes(window.location.hostname)
                    });
                }
            });

            // Extract structure
            data.structure = {
                header: document.querySelector('header')?.outerHTML || '',
                footer: document.querySelector('footer')?.outerHTML || '',
                navigation: document.querySelector('nav')?.outerHTML || '',
                mainContent: document.querySelector('main')?.outerHTML || ''
            };

            return data;
        });
    }

    async downloadMediaFromPage(mediaItems, pageFilename) {
        if (!mediaItems || mediaItems.length === 0) return;
        
        console.log(`📸 Downloading ${mediaItems.length} media items from ${pageFilename}`);
        
        const imageItems = mediaItems.filter(item => item.type === 'image');
        
        // Process in batches
        const batchSize = this.maxConcurrentDownloads;
        for (let i = 0; i < imageItems.length; i += batchSize) {
            const batch = imageItems.slice(i, i + batchSize);
            await Promise.all(batch.map(item => this.downloadMediaItem(item)));
        }
    }

    async downloadMediaItem(mediaItem) {
        try {
            const url = mediaItem.src;
            const originalFilename = mediaItem.filename || this.extractFilenameFromUrl(url);
            const sanitizedFilename = this.sanitizeFilename(url);
            const filepath = path.join(this.outputDir, 'media', sanitizedFilename);
            
            // Skip if already exists
            try {
                await fsPromises.access(filepath);
                console.log(`⏭️  Skipping ${sanitizedFilename} (already exists)`);
                return;
            } catch {}
            
            // Download file
            await this.downloadFile(url, filepath);
            
            // Update media item with local path and filename info
            mediaItem.localPath = filepath;
            mediaItem.sanitizedFilename = sanitizedFilename;
            mediaItem.originalFilename = originalFilename;
            mediaItem.downloaded = true;
            
            console.log(`✅ Downloaded: ${originalFilename} → ${sanitizedFilename}`);
            
        } catch (error) {
            console.error(`❌ Failed to download ${mediaItem.filename}:`, error.message);
            mediaItem.downloaded = false;
            mediaItem.error = error.message;
        }
    }

    async downloadFile(url, filepath) {
        return new Promise((resolve, reject) => {
            const protocol = url.startsWith('https:') ? https : http;
            
            const request = protocol.get(url, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`HTTP ${response.statusCode}`));
                    return;
                }
                
                const fileStream = fs.createWriteStream(filepath);
                response.pipe(fileStream);
                
                fileStream.on('finish', () => {
                    fileStream.close();
                    resolve();
                });
                
                fileStream.on('error', (err) => {
                    fsPromises.unlink(filepath).catch(() => {});
                    reject(err);
                });
            });
            
            request.on('error', reject);
            request.setTimeout(30000, () => {
                request.destroy();
                reject(new Error('Timeout'));
            });
        });
    }

    extractFilenameFromUrl(url) {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            let filename = path.basename(pathname) || 'unknown';
            
            // Decode URL-encoded characters (like Chinese characters)
            try {
                filename = decodeURIComponent(filename);
            } catch (e) {
                // If decodeURIComponent fails, keep the original filename
                console.warn(`⚠️  Could not decode filename: ${filename}`);
            }
            
            return filename;
        } catch {
            return 'unknown';
        }
    }

    sanitizeFilename(url) {
        // First decode URL-encoded characters
        let decodedUrl = url;
        try {
            decodedUrl = decodeURIComponent(url);
        } catch (e) {
            // If decoding fails, use original URL
        }
        
        // Extract filename from URL
        let filename = this.extractFilenameFromUrl(decodedUrl);
        
        // If filename is still URL-encoded, try to decode it
        if (filename.includes('%')) {
            try {
                filename = decodeURIComponent(filename);
            } catch (e) {
                // Keep original if decoding fails
            }
        }
        
        // Sanitize filename for filesystem
        // Keep Chinese characters and other Unicode, but replace problematic characters
        filename = filename
            .replace(/[<>:"/\\|?*]/g, '_') // Replace filesystem-invalid characters
            .replace(/\s+/g, '_') // Replace spaces with underscores
            .replace(/_{2,}/g, '_') // Replace multiple underscores with single
            .trim();
        
        // Ensure filename is not empty
        if (!filename || filename === 'unknown') {
            filename = 'media_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        
        return filename;
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    async generateMediaFilenameMapping() {
        console.log('📝 Generating media filename mapping...');
        
        const mapping = {
            timestamp: new Date().toISOString(),
            totalFiles: 0,
            mappings: []
        };
        
        try {
            // Read all page files to collect media information
            const pageFiles = await fsPromises.readdir(`${this.outputDir}/pages`);
            
            for (const file of pageFiles) {
                if (file.endsWith('.json')) {
                    const content = await fsPromises.readFile(`${this.outputDir}/pages/${file}`, 'utf8');
                    const pageData = JSON.parse(content);
                    
                    if (pageData.crawledData?.media) {
                        for (const media of pageData.crawledData.media) {
                            if (media.downloaded && media.localPath) {
                                mapping.mappings.push({
                                    originalUrl: media.src,
                                    originalFilename: media.originalFilename || 'unknown',
                                    sanitizedFilename: media.sanitizedFilename || path.basename(media.localPath),
                                    localPath: media.localPath,
                                    pageTitle: pageData.title,
                                    pageUrl: pageData.url,
                                    mediaType: media.type,
                                    altText: media.alt || '',
                                    title: media.title || ''
                                });
                                mapping.totalFiles++;
                            }
                        }
                    }
                }
            }
            
            // Save mapping file
            await fsPromises.writeFile(
                `${this.outputDir}/media-filename-mapping.json`,
                JSON.stringify(mapping, null, 2)
            );
            
            console.log(`✅ Generated media filename mapping with ${mapping.totalFiles} files`);
            
        } catch (error) {
            console.error('❌ Error generating media filename mapping:', error);
        }
    }

    async generateReport() {
        console.log('📊 Generating comprehensive crawl report...');
        
        // Generate filename mapping for media files
        await this.generateMediaFilenameMapping();
        
        const report = {
            timestamp: new Date().toISOString(),
            baseUrl: this.baseUrl,
            xmlFile: this.xmlFile,
            summary: {
                totalUrlsDiscovered: this.discoveredUrls.size,
                pagesCrawled: this.crawledUrls.size,
                pagesFailed: this.failedUrls.size,
                mediaItemsDownloaded: 0,
                totalSize: 0
            },
            pages: [],
            media: [],
            failedUrls: Array.from(this.failedUrls)
        };
        
        // Read all page files
        try {
            const pageFiles = await fsPromises.readdir(`${this.outputDir}/pages`);
            for (const file of pageFiles) {
                if (file.endsWith('.json')) {
                    const content = await fsPromises.readFile(`${this.outputDir}/pages/${file}`, 'utf8');
                    const pageData = JSON.parse(content);
                    report.pages.push({
                        title: pageData.title,
                        url: pageData.url,
                        type: pageData.type,
                        mediaCount: pageData.crawledData?.media?.length || 0
                    });
                }
            }
        } catch (error) {
            console.log('No pages directory found');
        }
        
        // Read all media files
        try {
            const mediaFiles = await fsPromises.readdir(`${this.outputDir}/media`);
            report.summary.mediaItemsDownloaded = mediaFiles.length;
            
            for (const file of mediaFiles) {
                const filepath = path.join(this.outputDir, 'media', file);
                const stats = await fsPromises.stat(filepath);
                report.summary.totalSize += stats.size;
            }
        } catch (error) {
            console.log('No media directory found');
        }
        
        // Save report
        await fsPromises.writeFile(
            `${this.outputDir}/comprehensive-crawl-report.json`,
            JSON.stringify(report, null, 2)
        );
        
        console.log('✅ Comprehensive crawl report generated');
        return report;
    }
}

// CLI usage
async function main() {
    const args = process.argv.slice(2);
    
    // Show help if requested
    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
XML-Guided WordPress Crawler

Usage: node scripts/xml-guided-crawler.cjs [xmlFile] [baseUrl] [outputDir] [options]

Arguments:
  xmlFile     Path to WordPress XML export file (default: migration-data/10.WordPress.2025-07-21.xml)
  baseUrl     Base URL of the WordPress site (default: https://10botics.com)
  outputDir   Output directory for crawled data (default: xml-guided-migration-data)

Options:
  --download-media    Download media files (images, videos, etc.)
  --no-clean         Don't clean output directory before crawling (preserves existing data)
  --max-pages N      Limit crawling to first N pages (for testing)
  --help, -h         Show this help message

Examples:
  node scripts/xml-guided-crawler.cjs migration-data/site.xml https://example.com output-data
  node scripts/xml-guided-crawler.cjs --download-media --no-clean
  node scripts/xml-guided-crawler.cjs migration-data/site.xml https://example.com output-data --download-media
  node scripts/xml-guided-crawler.cjs --max-pages 10 --download-media
`);
        process.exit(0);
    }
    
    const options = {
        xmlFile: args[0] || 'migration-data/10.WordPress.2025-07-21.xml',
        baseUrl: args[1] || 'https://10botics.com',
        outputDir: args[2] || 'xml-guided-migration-data',
        downloadMedia: args.includes('--download-media'),
        cleanOutput: !args.includes('--no-clean'),
        maxPages: args.includes('--max-pages') ? parseInt(args[args.indexOf('--max-pages') + 1]) : null,
        maxConcurrentCrawls: 2,
        maxConcurrentDownloads: 3
    };
    
    const crawler = new XMLGuidedCrawler(options);
    
    try {
        await crawler.init();
        
        // Parse WordPress XML
        const siteData = await crawler.parseWordPressXML();
        
        // Crawl all discovered pages
        const results = await crawler.crawlAllPages(siteData);
        
        // Generate report
        const report = await crawler.generateReport();
        
        console.log('\n🎉 XML-guided crawling completed!');
        console.log(`📊 Summary:`);
        console.log(`   URLs discovered from XML: ${report.summary.totalUrlsDiscovered}`);
        console.log(`   Pages successfully crawled: ${report.summary.pagesCrawled}`);
        console.log(`   Pages failed (404s, errors): ${report.summary.pagesFailed}`);
        console.log(`   Success rate: ${((report.summary.pagesCrawled / (report.summary.pagesCrawled + report.summary.pagesFailed)) * 100).toFixed(1)}%`);
        console.log(`   Media downloaded: ${report.summary.mediaItemsDownloaded}`);
        console.log(`   Total size: ${(report.summary.totalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`📁 Output directory: ${options.outputDir}`);
        
        if (report.failedUrls.length > 0) {
            console.log(`\n❌ Failed URLs:`);
            report.failedUrls.forEach(url => console.log(`   - ${url}`));
        }
        
    } catch (error) {
        console.error('❌ XML-guided crawling failed:', error);
        process.exit(1);
    } finally {
        await crawler.close();
    }
}

if (require.main === module) {
    main();
}

module.exports = XMLGuidedCrawler; 