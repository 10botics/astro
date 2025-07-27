#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { JSDOM } = require('jsdom');

class LLMConverter {
    constructor(options = {}) {
        this.inputDir = options.inputDir || 'xml-guided-migration-data/pages';
        this.outputDir = options.outputDir || 'src/content/pages';
        this.mediaDir = options.mediaDir || 'xml-guided-migration-data/media';
        this.publicMediaDir = options.publicMediaDir || 'public/media';
        this.reportFile = options.reportFile || 'llm-conversion-report.json';
        this.maxConcurrent = options.maxConcurrent || 5;
        this.llmProvider = options.llmProvider || 'openai'; // or 'anthropic', 'local'
        this.apiKey = options.apiKey || process.env.OPENAI_API_KEY;
        
        this.report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalPages: 0,
                successfulConversions: 0,
                failedConversions: 0,
                mediaProcessed: 0,
                errors: []
            },
            pages: []
        };
    }

    async convertAllPages() {
        console.log('🚀 Starting LLM-based WordPress to Astro conversion...');
        
        try {
            // Ensure output directory exists
            await fs.mkdir(this.outputDir, { recursive: true });
            await fs.mkdir(this.publicMediaDir, { recursive: true });
            
            // Get all JSON files
            const files = await fs.readdir(this.inputDir);
            const jsonFiles = files.filter(file => file.endsWith('.json'));
            
            console.log(`📁 Found ${jsonFiles.length} pages to convert`);
            this.report.summary.totalPages = jsonFiles.length;
            
            // Process files in batches
            for (let i = 0; i < jsonFiles.length; i += this.maxConcurrent) {
                const batch = jsonFiles.slice(i, i + this.maxConcurrent);
                const promises = batch.map(file => this.convertPage(file));
                
                const results = await Promise.allSettled(promises);
                
                results.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        this.report.summary.successfulConversions++;
                        this.report.pages.push(result.value);
                    } else {
                        this.report.summary.failedConversions++;
                        this.report.summary.errors.push({
                            file: batch[index],
                            error: result.reason.message
                        });
                    }
                });
                
                console.log(`📊 Progress: ${Math.min(i + this.maxConcurrent, jsonFiles.length)}/${jsonFiles.length} pages processed`);
            }
            
            // Generate report
            await this.generateReport();
            
            console.log('✅ LLM conversion completed!');
            console.log(`📊 Summary:`);
            console.log(`   Successful conversions: ${this.report.summary.successfulConversions}`);
            console.log(`   Failed conversions: ${this.report.summary.failedConversions}`);
            console.log(`   Media processed: ${this.report.summary.mediaProcessed}`);
            
        } catch (error) {
            console.error('❌ Conversion failed:', error);
            throw error;
        }
    }

    async convertPage(filename) {
        const filePath = path.join(this.inputDir, filename);
        const pageData = JSON.parse(await fs.readFile(filePath, 'utf8'));
        
        console.log(`🔄 Converting: ${pageData.title}`);
        
        try {
            // Extract clean content (remove header/footer noise)
            const cleanContent = this.extractCleanContent(pageData);
            
            // Process with LLM
            const astroContent = await this.processWithLLM(cleanContent, pageData);
            
            // Process media
            const mediaInfo = await this.processMedia(pageData);
            
            // Generate filename
            const slug = this.generateSlug(pageData.title, pageData.url);
            const outputPath = path.join(this.outputDir, `${slug}.md`);
            
            // Write Astro content
            await fs.writeFile(outputPath, astroContent, 'utf8');
            
            return {
                originalFile: filename,
                title: pageData.title,
                slug: slug,
                url: pageData.url,
                type: pageData.type,
                mediaCount: mediaInfo.count,
                outputPath: outputPath,
                success: true
            };
            
        } catch (error) {
            console.error(`❌ Failed to convert ${filename}:`, error.message);
            throw error;
        }
    }

    extractCleanContent(pageData) {
        // Extract the main content, removing header/footer noise
        let content = pageData.content || '';
        
        // If content is empty, try to extract from crawledData
        if (!content && pageData.crawledData?.content) {
            content = pageData.crawledData.content;
        }
        
        // Clean up the content
        const dom = new JSDOM(`<html><body>${content}</body></html>`);
        const body = dom.window.document.body;
        
        // Remove common noise elements
        const noiseSelectors = [
            '[data-elementor-type="header"]',
            '[data-elementor-type="footer"]',
            '.elementor-nav-menu',
            '.elementor-menu-toggle',
            '[data-elementor-id]',
            'script',
            'style',
            'nav',
            'header',
            'footer'
        ];
        
        noiseSelectors.forEach(selector => {
            const elements = body.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });
        
        // Extract clean HTML
        return body.innerHTML.trim();
    }

    async processWithLLM(htmlContent, pageData) {
        // Create LLM prompt for conversion
        const prompt = this.createConversionPrompt(htmlContent, pageData);
        
        // Call LLM API (placeholder - implement actual LLM call)
        const llmResponse = await this.callLLM(prompt);
        
        // Parse LLM response and create Astro content
        return this.createAstroContent(llmResponse, pageData);
    }

    createConversionPrompt(htmlContent, pageData) {
        return `You are an expert web developer converting WordPress HTML content to Astro-compatible Markdown.

TASK: Convert the following WordPress HTML content to clean, semantic Markdown that will work well in an Astro site.

PAGE CONTEXT:
- Title: ${pageData.title}
- URL: ${pageData.url}
- Type: ${pageData.type}
- Date: ${pageData.date || 'N/A'}
- Categories: ${pageData.categories?.join(', ') || 'N/A'}

REQUIREMENTS:
1. Convert HTML to clean Markdown
2. Preserve semantic structure (headings, lists, paragraphs)
3. Handle images properly - keep alt text and make paths relative to /media/
4. Convert links to relative paths where possible
5. Preserve Chinese text and formatting
6. Remove any remaining HTML artifacts
7. Create clean, readable content
8. Maintain the original content's meaning and structure

HTML CONTENT:
${htmlContent}

Please return ONLY the converted Markdown content, no explanations or additional text.`;
    }

    async callLLM(prompt) {
        // TODO: Implement actual LLM API call
        // For now, return a placeholder response
        // This should be replaced with actual OpenAI, Anthropic, or local LLM call
        
        console.log('🤖 LLM processing (placeholder - implement actual API call)');
        
        // Placeholder response - in real implementation, this would be the LLM response
        return `# ${pageData.title}

${this.fallbackHtmlToMarkdown(htmlContent)}`;
    }

    fallbackHtmlToMarkdown(htmlContent) {
        // Fallback conversion if LLM is not available
        const dom = new JSDOM(`<html><body>${htmlContent}</body></html>`);
        const body = dom.window.document.body;
        
        return this.convertElementToMarkdown(body);
    }

    convertElementToMarkdown(element) {
        let markdown = '';
        
        for (const child of element.children) {
            switch (child.tagName.toLowerCase()) {
                case 'h1':
                    markdown += `\n# ${child.textContent.trim()}\n\n`;
                    break;
                case 'h2':
                    markdown += `\n## ${child.textContent.trim()}\n\n`;
                    break;
                case 'h3':
                    markdown += `\n### ${child.textContent.trim()}\n\n`;
                    break;
                case 'h4':
                    markdown += `\n#### ${child.textContent.trim()}\n\n`;
                    break;
                case 'h5':
                    markdown += `\n##### ${child.textContent.trim()}\n\n`;
                    break;
                case 'h6':
                    markdown += `\n###### ${child.textContent.trim()}\n\n`;
                    break;
                case 'p':
                    markdown += `${child.textContent.trim()}\n\n`;
                    break;
                case 'img':
                    const src = child.getAttribute('src') || '';
                    const alt = child.getAttribute('alt') || '';
                    const localSrc = this.convertImagePath(src);
                    markdown += `![${alt}](${localSrc})\n\n`;
                    break;
                case 'a':
                    const href = child.getAttribute('href') || '';
                    const linkText = child.textContent.trim();
                    const localHref = this.convertLinkPath(href);
                    markdown += `[${linkText}](${localHref})`;
                    break;
                case 'ul':
                case 'ol':
                    markdown += this.convertListToMarkdown(child);
                    break;
                case 'blockquote':
                    markdown += `> ${child.textContent.trim()}\n\n`;
                    break;
                case 'code':
                    markdown += `\`${child.textContent.trim()}\``;
                    break;
                case 'pre':
                    markdown += `\n\`\`\`\n${child.textContent.trim()}\n\`\`\`\n\n`;
                    break;
                default:
                    if (child.children.length > 0) {
                        markdown += this.convertElementToMarkdown(child);
                    } else {
                        markdown += child.textContent;
                    }
            }
        }
        
        return markdown;
    }

    convertListToMarkdown(listElement) {
        let markdown = '\n';
        const isOrdered = listElement.tagName.toLowerCase() === 'ol';
        
        listElement.querySelectorAll('li').forEach((li, index) => {
            const prefix = isOrdered ? `${index + 1}.` : '-';
            markdown += `${prefix} ${li.textContent.trim()}\n`;
        });
        
        markdown += '\n';
        return markdown;
    }

    convertImagePath(src) {
        // Convert WordPress image URLs to local paths
        if (src.includes('wp-content/uploads/')) {
            const filename = path.basename(src);
            return `/media/${filename}`;
        }
        return src;
    }

    convertLinkPath(href) {
        // Convert WordPress URLs to relative paths where possible
        if (href.includes('10botics.com/')) {
            const url = new URL(href);
            return url.pathname;
        }
        return href;
    }

    createAstroContent(markdownContent, pageData) {
        // Create YAML frontmatter
        const frontmatter = {
            title: pageData.title,
            description: pageData.excerpt || '',
            date: pageData.date ? new Date(pageData.date).toISOString() : null,
            author: pageData.author || 'admin',
            featuredImage: pageData.featuredImage || '',
            categories: pageData.categories || [],
            tags: pageData.tags || [],
            type: pageData.type || 'page',
            status: pageData.status || 'publish',
            url: pageData.url || '',
            media: pageData.media || []
        };
        
        // Convert frontmatter to YAML
        const yamlFrontmatter = this.objectToYaml(frontmatter);
        
        // Combine frontmatter and content
        return `---\n${yamlFrontmatter}---\n\n${markdownContent}`;
    }

    objectToYaml(obj) {
        let yaml = '';
        
        for (const [key, value] of Object.entries(obj)) {
            if (value === null || value === undefined || value === '') {
                continue;
            }
            
            if (Array.isArray(value)) {
                if (value.length === 0) continue;
                yaml += `${key}:\n`;
                value.forEach(item => {
                    yaml += `  - ${item}\n`;
                });
            } else if (typeof value === 'object') {
                yaml += `${key}:\n`;
                for (const [subKey, subValue] of Object.entries(value)) {
                    yaml += `  ${subKey}: ${subValue}\n`;
                }
            } else {
                yaml += `${key}: ${value}\n`;
            }
        }
        
        return yaml;
    }

    async processMedia(pageData) {
        let mediaCount = 0;
        
        if (pageData.media && Array.isArray(pageData.media)) {
            for (const mediaItem of pageData.media) {
                if (mediaItem.filename) {
                    const sourcePath = path.join(this.mediaDir, mediaItem.filename);
                    const destPath = path.join(this.publicMediaDir, mediaItem.filename);
                    
                    try {
                        await fs.copyFile(sourcePath, destPath);
                        mediaCount++;
                    } catch (error) {
                        console.warn(`⚠️ Could not copy media file: ${mediaItem.filename}`);
                    }
                }
            }
        }
        
        this.report.summary.mediaProcessed += mediaCount;
        return { count: mediaCount };
    }

    generateSlug(title, url) {
        // Generate a clean slug from title or URL
        if (url) {
            const urlPath = new URL(url).pathname;
            const slug = urlPath.replace(/^\//, '').replace(/\/$/, '').replace(/\//g, '-');
            if (slug) return slug;
        }
        
        // Fallback to title-based slug
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\u4e00-\u9fff\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }

    async generateReport() {
        await fs.writeFile(this.reportFile, JSON.stringify(this.report, null, 2));
        console.log(`📝 Report saved to: ${this.reportFile}`);
    }
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);
    const options = {};
    
    // Parse command line arguments
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--input-dir':
                options.inputDir = args[++i];
                break;
            case '--output-dir':
                options.outputDir = args[++i];
                break;
            case '--media-dir':
                options.mediaDir = args[++i];
                break;
            case '--public-media-dir':
                options.publicMediaDir = args[++i];
                break;
            case '--llm-provider':
                options.llmProvider = args[++i];
                break;
            case '--api-key':
                options.apiKey = args[++i];
                break;
            case '--max-concurrent':
                options.maxConcurrent = parseInt(args[++i]);
                break;
            case '--help':
                console.log(`
LLM WordPress to Astro Converter

Usage: node llm-converter.cjs [options]

Options:
  --input-dir <path>        Input directory with JSON files (default: xml-guided-migration-data/pages)
  --output-dir <path>       Output directory for Astro content (default: src/content/pages)
  --media-dir <path>        Source media directory (default: xml-guided-migration-data/media)
  --public-media-dir <path> Public media directory (default: public/media)
  --llm-provider <name>     LLM provider: openai, anthropic, local (default: openai)
  --api-key <key>           API key for LLM provider
  --max-concurrent <num>    Maximum concurrent conversions (default: 5)
  --help                    Show this help message

Environment Variables:
  OPENAI_API_KEY           OpenAI API key
  ANTHROPIC_API_KEY        Anthropic API key

Example:
  node llm-converter.cjs --llm-provider openai --max-concurrent 3
`);
                return;
        }
    }
    
    const converter = new LLMConverter(options);
    await converter.convertAllPages();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = LLMConverter; 