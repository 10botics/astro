#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Configuration
const CONFIG = {
  jsonPath: path.join(projectRoot, 'xml-guided-migration-data/pages'),
  htmlPath: path.join(projectRoot, 'xml-guided-migration-data/raw'),
  outputPath: path.join(projectRoot, 'src/content/courses'),
  mediaPath: path.join(projectRoot, 'xml-guided-migration-data/media'),
  publicMediaPath: path.join(projectRoot, 'public/media')
};

/**
 * Extract metadata from JSON file
 */
function extractMetadata(jsonFilePath) {
  const jsonContent = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
  
  return {
    title: jsonContent.title || '',
    description: extractDescription(jsonContent.content || ''),
    publishDate: jsonContent.date ? new Date(jsonContent.date) : new Date(),
    author: jsonContent.author || '',
    categories: jsonContent.categories || [],
    tags: jsonContent.tags || [],
    originalUrl: jsonContent.url || '',
    courseType: determineCourseType(jsonContent.categories, jsonContent.tags),
    targetAudience: determineTargetAudience(jsonContent.tags),
    excerpt: extractExcerpt(jsonContent.content || ''),
    metaDescription: extractDescription(jsonContent.content || ''),
    migratedFrom: 'elementor',
    migrationDate: new Date(),
    status: 'published'
  };
}

/**
 * Convert HTML content to clean Markdown
 */
function htmlToMarkdown(htmlContent) {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  
  // Remove script tags, style tags, and other unwanted elements
  const unwantedSelectors = [
    'script', 'style', 'noscript', '.qlwapp',
    '[id*="elementor"]', '[class*="elementor"]',
    '[data-elementor-type]', '[data-elementor-id]',
    '.e-con', '.e-flex', '.e-parent', '.e-child',
    '#breadcrumbs', '.breadcrumb', 'nav',
    '[id*="wpstats"]', '[class*="wpstats"]',
    '.screen-reader-text'
  ];
  
  unwantedSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => el.remove());
  });
  
  // Extract main content - prioritize content within main sections
  let mainContent = '';
  const contentSelectors = [
    'main', '[role="main"]', '.main-content',
    '.course-content', '.post-content', '.entry-content',
    'article', '.content', 'body'
  ];
  
  let contentElement = null;
  for (const selector of contentSelectors) {
    contentElement = document.querySelector(selector);
    if (contentElement) break;
  }
  
  if (!contentElement) {
    contentElement = document.body;
  }
  
  // Convert HTML elements to Markdown
  mainContent = convertElementToMarkdown(contentElement);
  
  // Clean up and format the markdown
  mainContent = cleanMarkdown(mainContent);
  
  return mainContent;
}

/**
 * Convert DOM element to Markdown recursively
 */
function convertElementToMarkdown(element) {
  if (!element) return '';
  
  let markdown = '';
  
  for (const node of element.childNodes) {
    if (node.nodeType === 3) { // Text node
      const text = node.textContent.trim();
      if (text) {
        markdown += text + ' ';
      }
    } else if (node.nodeType === 1) { // Element node
      const tagName = node.tagName.toLowerCase();
      const textContent = node.textContent.trim();
      
      if (!textContent) continue; // Skip empty elements
      
      switch (tagName) {
        case 'h1':
          markdown += `\n# ${textContent}\n\n`;
          break;
        case 'h2':
          markdown += `\n## ${textContent}\n\n`;
          break;
        case 'h3':
          markdown += `\n### ${textContent}\n\n`;
          break;
        case 'h4':
          markdown += `\n#### ${textContent}\n\n`;
          break;
        case 'p':
          markdown += `\n${convertElementToMarkdown(node)}\n\n`;
          break;
        case 'strong':
        case 'b':
          markdown += `**${textContent}**`;
          break;
        case 'em':
        case 'i':
          markdown += `*${textContent}*`;
          break;
        case 'a':
          const href = node.getAttribute('href');
          if (href) {
            markdown += `[${textContent}](${href})`;
          } else {
            markdown += textContent;
          }
          break;
        case 'img':
          const src = node.getAttribute('src');
          const alt = node.getAttribute('alt') || textContent;
          if (src) {
            const localSrc = updateImagePath(src);
            markdown += `\n![${alt}](${localSrc})\n\n`;
          }
          break;
        case 'iframe':
          const iframeSrc = node.getAttribute('src');
          if (iframeSrc && iframeSrc.includes('youtube')) {
            const videoTitle = node.getAttribute('title') || 'Video';
            markdown += `\n📺 [觀看影片：${videoTitle}](${iframeSrc})\n\n`;
          }
          break;
        case 'ul':
          markdown += '\n';
          for (const li of node.querySelectorAll('li')) {
            markdown += `- ${li.textContent.trim()}\n`;
          }
          markdown += '\n';
          break;
        case 'ol':
          markdown += '\n';
          let index = 1;
          for (const li of node.querySelectorAll('li')) {
            markdown += `${index}. ${li.textContent.trim()}\n`;
            index++;
          }
          markdown += '\n';
          break;
        case 'li':
          // Handled by parent ul/ol
          break;
        case 'div':
        case 'section':
        case 'article':
          // Process children recursively
          markdown += convertElementToMarkdown(node);
          break;
        default:
          // For other elements, just extract the text content
          if (textContent.length > 0) {
            markdown += textContent + ' ';
          }
          break;
      }
    }
  }
  
  return markdown;
}

/**
 * Clean and format markdown content
 */
function cleanMarkdown(markdown) {
  return markdown
    // Remove excessive whitespace
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    // Fix spacing around headers
    .replace(/\n#/g, '\n\n#')
    // Remove leading/trailing whitespace
    .trim();
}

/**
 * Update image paths to local media directory
 */
function updateImagePath(imageSrc) {
  if (imageSrc.startsWith('/media/')) {
    return imageSrc; // Already local
  }
  
  if (imageSrc.includes('10botics.com')) {
    // Extract filename from WordPress URL
    const urlParts = imageSrc.split('/');
    const filename = urlParts[urlParts.length - 1];
    return `/media/${filename}`;
  }
  
  if (imageSrc.startsWith('https://lwfiles.mycourse.app/')) {
    // Handle external course images
    const filename = imageSrc.split('/').pop();
    return `/media/${filename}`;
  }
  
  return imageSrc; // Return as-is for other URLs
}

/**
 * Extract clean description from content
 */
function extractDescription(content) {
  if (!content) return '';
  
  const dom = new JSDOM(content);
  const text = dom.window.document.body.textContent || '';
  
  // Get first meaningful paragraph
  const sentences = text.split(/[.。！!？?]/).filter(s => s.trim().length > 20);
  if (sentences.length > 0) {
    return sentences[0].trim() + '。';
  }
  
  return text.substring(0, 200).trim() + '...';
}

/**
 * Extract excerpt from content
 */
function extractExcerpt(content) {
  if (!content) return '';
  
  const dom = new JSDOM(content);
  const text = dom.window.document.body.textContent || '';
  
  // Look for tagline or first meaningful sentence
  const lines = text.split('\n').filter(line => line.trim().length > 10);
  if (lines.length > 0) {
    return lines[0].trim();
  }
  
  return '';
}

/**
 * Determine course type from categories and tags
 */
function determineCourseType(categories = [], tags = []) {
  const allTerms = [...categories, ...tags].join(' ').toLowerCase();
  
  if (allTerms.includes('ai') || allTerms.includes('人工智能')) return 'AI';
  if (allTerms.includes('robot') || allTerms.includes('機器人')) return 'Robotics';
  if (allTerms.includes('創意') || allTerms.includes('藝術')) return 'Creative';
  if (allTerms.includes('hardware') || allTerms.includes('硬件')) return 'Hardware';
  if (allTerms.includes('programming') || allTerms.includes('編程')) return 'Programming';
  
  return 'Programming'; // Default
}

/**
 * Determine target audience from tags
 */
function determineTargetAudience(tags = []) {
  const audienceTerms = [];
  
  tags.forEach(tag => {
    if (tag.includes('高小')) audienceTerms.push('高小');
    if (tag.includes('初中')) audienceTerms.push('初中');
    if (tag.includes('高中')) audienceTerms.push('高中');
    if (tag.includes('primary')) audienceTerms.push('小學');
    if (tag.includes('secondary')) audienceTerms.push('中學');
  });
  
  return audienceTerms.join(', ') || '小學至中學';
}

/**
 * Extract content from raw HTML file and convert to markdown
 */
function extractHtmlContent(htmlFilePath) {
  if (!fs.existsSync(htmlFilePath)) {
    console.warn(`HTML file not found: ${htmlFilePath}`);
    return '';
  }
  
  const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
  return htmlToMarkdown(htmlContent);
}

/**
 * Generate frontmatter YAML
 */
function generateFrontmatter(metadata) {
  const frontmatter = {
    title: `"${metadata.title}"`,
    description: `"${metadata.description}"`,
    publishDate: metadata.publishDate.toISOString(),
    author: `"${metadata.author}"`,
    categories: JSON.stringify(metadata.categories),
    tags: JSON.stringify(metadata.tags),
    originalUrl: `"${metadata.originalUrl}"`,
    courseType: `"${metadata.courseType}"`,
    targetAudience: `"${metadata.targetAudience}"`,
    excerpt: `"${metadata.excerpt}"`,
    metaDescription: `"${metadata.metaDescription}"`,
    migratedFrom: `"${metadata.migratedFrom}"`,
    migrationDate: metadata.migrationDate.toISOString(),
    status: `"${metadata.status}"`
  };
  
  let yaml = '---\n';
  for (const [key, value] of Object.entries(frontmatter)) {
    yaml += `${key}: ${value}\n`;
  }
  yaml += '---\n\n';
  
  return yaml;
}

/**
 * Process a single course file
 */
function processCourse(courseName) {
  console.log(`\n🔄 Processing course: ${courseName}`);
  
  const jsonFile = path.join(CONFIG.jsonPath, `${courseName}.json`);
  const htmlFile = path.join(CONFIG.htmlPath, `${courseName}.html`);
  const outputFile = path.join(CONFIG.outputPath, `${courseName}.md`);
  
  // Check if files exist
  if (!fs.existsSync(jsonFile)) {
    console.error(`❌ JSON file not found: ${jsonFile}`);
    return false;
  }
  
  try {
    // Extract metadata from JSON
    console.log('📊 Extracting metadata...');
    const metadata = extractMetadata(jsonFile);
    
    // Extract and convert content from HTML
    console.log('🔄 Converting HTML to Markdown...');
    const markdownContent = extractHtmlContent(htmlFile);
    
    // Generate final markdown file
    console.log('📝 Generating markdown file...');
    const frontmatter = generateFrontmatter(metadata);
    const finalContent = frontmatter + markdownContent;
    
    // Write to output file
    fs.writeFileSync(outputFile, finalContent, 'utf8');
    
    console.log(`✅ Successfully migrated: ${courseName}`);
    console.log(`📁 Output: ${outputFile}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${courseName}:`, error.message);
    return false;
  }
}

/**
 * Main function
 */
function main() {
  const courseName = process.argv[2];
  
  if (!courseName) {
    console.error('❌ Please provide a course name');
    console.log('Usage: node course-migrator.js <course-name>');
    console.log('Example: node course-migrator.js scratch-ai-programming');
    process.exit(1);
  }
  
  // Ensure output directory exists
  if (!fs.existsSync(CONFIG.outputPath)) {
    fs.mkdirSync(CONFIG.outputPath, { recursive: true });
  }
  
  console.log('🚀 Course Migration Tool - HTML→Markdown Converter');
  console.log('=' .repeat(60));
  
  const success = processCourse(courseName);
  
  if (success) {
    console.log('\n🎉 Migration completed successfully!');
    console.log('📖 You can now view the course at: /courses/' + courseName);
  } else {
    console.log('\n❌ Migration failed!');
    process.exit(1);
  }
}

// Run the script
main(); 