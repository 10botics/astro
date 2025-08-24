import { getCollection } from 'astro:content';
import { COURSE_SLUG_MAPPING } from './courseMappings';

export interface SERPPageData {
  title: string;
  url: string;
  description: string;
  position: number;
  category: string;
  tags?: string[];
  publishDate?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

/**
 * Extract SERP data from actual page HTML headers and meta tags
 */
export async function extractSERPData(): Promise<SERPPageData[]> {
  const serpData: SERPPageData[] = [];
  let position = 1;

  try {
    // Extract news/blog content from content collections
    const newsCollection = await getCollection('news');
    
    for (const newsItem of newsCollection) {
      serpData.push({
        title: newsItem.data.title,
        url: `https://10botics.com/news/${newsItem.slug}`,
        description: newsItem.data.excerpt || `${newsItem.data.title} - 10教育最新消息`,
        position: position++,
        category: 'news',
        tags: newsItem.data.tags || [],
        publishDate: newsItem.data.publishDate?.toISOString(),
        metaTitle: newsItem.data.title,
        metaDescription: newsItem.data.excerpt || newsItem.data.title,
        metaKeywords: newsItem.data.tags?.join(', ') || ''
      });
    }
  } catch (error) {
    console.log('News collection not found or error:', error);
  }

  // Extract data from actual .astro files using import.meta.glob
  try {
    // Get all static pages from root directory
    const rootPages = await import.meta.glob('../../pages/*.astro', { eager: true });
    
    for (const [path, module] of Object.entries(rootPages)) {
      const filename = path.replace('../../pages/', '').replace('.astro', '');
      
      // Skip dynamic routes and index
      if (filename.includes('[') || filename === 'index') continue;
      
      const pageData = await extractMetaDataFromAstroFile(path, module, filename);
      if (pageData) {
        serpData.push({
          ...pageData,
          position: position++
        });
      }
    }

    // Get all school course pages
    const coursePages = await import.meta.glob('../../pages/school-courses/*.astro', { eager: true });
    
    for (const [path, module] of Object.entries(coursePages)) {
      const filename = path.replace('../../pages/school-courses/', '').replace('.astro', '');
      
      // Skip dynamic routes and index
      if (filename.includes('[') || filename === 'index') continue;
      
      const pageData = await extractMetaDataFromAstroFile(path, module, filename, 'courses');
      if (pageData) {
        serpData.push({
          ...pageData,
          position: position++
        });
      }
    }

    // Get all STEM day pages
    const stemdayPages = await import.meta.glob('../../pages/stemday/*.astro', { eager: true });
    
    for (const [path, module] of Object.entries(stemdayPages)) {
      const filename = path.replace('../../pages/stemday/', '').replace('.astro', '');
      
      // Skip dynamic routes and index
      if (filename.includes('[') || filename === 'index') continue;
      
      const pageData = await extractMetaDataFromAstroFile(path, module, filename, 'stemday');
      if (pageData) {
        serpData.push({
          ...pageData,
          position: position++
        });
      }
    }

    // Get all funding application pages
    const fundingPages = await import.meta.glob('../../pages/funding-application/*.astro', { eager: true });
    
    for (const [path, module] of Object.entries(fundingPages)) {
      const filename = path.replace('../../pages/funding-application/', '').replace('.astro', '');
      
      // Skip dynamic routes and index
      if (filename.includes('[') || filename === 'index') continue;
      
      const pageData = await extractMetaDataFromAstroFile(path, module, filename, 'funding');
      if (pageData) {
        serpData.push({
          ...pageData,
          position: position++
        });
      }
    }

  } catch (error) {
    console.log('Error extracting data from .astro files:', error);
  }

  // Add main pages with real data
  const mainPages = [
    {
      title: "10教育 - AI教育與STEM課程專家",
      url: "https://10botics.com",
      description: "專業提供中小學AI人工智能、STEM教育課程與師資培訓。包括Minecraft、無人機、機器人等創新教學方案，協助學校建立AI實驗室。",
      category: "main"
    },
    {
      title: "學校課程 - AI人工智能與STEM教育課程",
      url: "https://10botics.com/school-courses",
      description: "提供多元化到校STEM課程，包括AI編程、無人機、機器人、Minecraft等，適合小學至中學不同年級學生，培養21世紀技能。",
      category: "courses"
    },
    {
      title: "STEM Day活動 - 到校科技體驗",
      url: "https://10botics.com/stemday",
      description: "專業到校STEM Day活動，提供AI、無人機、機器人、3D打印等多元化科技體驗工作坊，適合不同年級學生參與。",
      category: "stemday"
    },
    {
      title: "教師發展日 - AI教育培訓",
      url: "https://10botics.com/staff-development-day",
      description: "為學校教師提供專業AI教育培訓，包括ChatGPT應用、AI教學工具使用、課程設計等，協助教師掌握AI教學技巧。",
      category: "training"
    }
  ];

  for (const page of mainPages) {
    serpData.push({
      title: page.title,
      url: page.url,
      description: page.description,
      position: position++,
      category: page.category
    });
  }

  return serpData.sort((a, b) => {
    // Sort by importance: main pages first, then courses, then news, then others
    const categoryOrder = { main: 1, courses: 2, news: 3, competition: 4, stemday: 5, training: 6, about: 7, contact: 8, funding: 9 };
    const aOrder = categoryOrder[a.category as keyof typeof categoryOrder] || 10;
    const bOrder = categoryOrder[b.category as keyof typeof categoryOrder] || 10;
    
    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }
    
    // Within same category, sort by publish date (newest first) or position
    if (a.publishDate && b.publishDate) {
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    }
    
    return a.position - b.position;
  }).map((item, index) => ({ ...item, position: index + 1 }));
}

/**
 * Extract meta data from an .astro file's HTML header
 */
async function extractMetaDataFromAstroFile(path: string, module: any, filename: string, category?: string): Promise<Omit<SERPPageData, 'position'> | null> {
  try {
    // Try to get frontmatter data if available
    const frontmatter = module.frontmatter || {};
    
    // Extract title from frontmatter or generate from filename
    const title = frontmatter.title || generateTitleFromFilename(filename);
    
    // Extract description from frontmatter or generate from filename
    const description = frontmatter.description || 
                       frontmatter.excerpt || 
                       generateDescriptionFromFilename(filename, category);
    
    // Extract tags from frontmatter or generate from filename
    const tags = frontmatter.tags || extractTagsFromFilename(filename);
    
    // Extract publish date from frontmatter or use current date
    const publishDate = frontmatter.publishDate || 
                       frontmatter.date || 
                       new Date().toISOString();
    
    // Generate URL based on category and filename
    const url = generateUrlFromFilename(filename, category);
    
    // Determine category if not provided
    const finalCategory = category || determineCategoryFromFilename(filename);
    
    // Extract meta tags from frontmatter
    const metaTitle = frontmatter.title || title;
    const metaDescription = frontmatter.description || frontmatter.excerpt || description;
    const metaKeywords = frontmatter.keywords || frontmatter.tags?.join(', ') || '';

    return {
      title,
      url,
      description,
      category: finalCategory,
      tags,
      publishDate: typeof publishDate === 'string' ? publishDate : publishDate.toISOString(),
      metaTitle,
      metaDescription,
      metaKeywords
    };
    
  } catch (error) {
    console.log(`Error extracting data from ${filename}:`, error);
    return null;
  }
}

/**
 * Search through extracted SERP data
 */
export function searchSERPData(data: SERPPageData[], query: string): SERPPageData[] {
  const cleanQuery = query.toLowerCase().trim();
  
  if (!cleanQuery) {
    return data.slice(0, 8);
  }

  // If searching for domain, return main pages
  if (cleanQuery.includes('10botics') || cleanQuery.includes('10education') || cleanQuery === '10botics.com') {
    return data.slice(0, 8);
  }

  // Search by keywords in title, description, meta tags, and tags
  const results = data.filter(page => {
    const titleMatch = page.title.toLowerCase().includes(cleanQuery);
    const descMatch = page.description.toLowerCase().includes(cleanQuery);
    const categoryMatch = page.category.toLowerCase().includes(cleanQuery);
    const tagMatch = page.tags?.some(tag => tag.toLowerCase().includes(cleanQuery));
    const metaTitleMatch = page.metaTitle?.toLowerCase().includes(cleanQuery);
    const metaDescMatch = page.metaDescription?.toLowerCase().includes(cleanQuery);
    const metaKeywordsMatch = page.metaKeywords?.toLowerCase().includes(cleanQuery);
    
    return titleMatch || descMatch || categoryMatch || tagMatch || 
           metaTitleMatch || metaDescMatch || metaKeywordsMatch;
  });

  // If no direct matches, try partial matches for common terms
  if (results.length === 0) {
    const partialResults = data.filter(page => {
      if (cleanQuery.includes('ai') || cleanQuery.includes('人工智能')) {
        return page.title.includes('AI') || page.title.includes('人工智能') || 
               page.description.includes('AI') || page.description.includes('人工智能') ||
               page.metaTitle?.includes('AI') || page.metaTitle?.includes('人工智能') ||
               page.metaDescription?.includes('AI') || page.metaDescription?.includes('人工智能');
      }
      if (cleanQuery.includes('minecraft')) {
        return page.title.includes('Minecraft') || 
               page.description.includes('Minecraft') ||
               page.metaTitle?.includes('Minecraft') ||
               page.metaDescription?.includes('Minecraft');
      }
      if (cleanQuery.includes('drone') || cleanQuery.includes('無人機')) {
        return page.title.includes('無人機') || page.title.includes('CoDrone') ||
               page.description.includes('無人機') || page.description.includes('drone') ||
               page.metaTitle?.includes('無人機') || page.metaTitle?.includes('drone') ||
               page.metaDescription?.includes('無人機') || page.metaDescription?.includes('drone');
      }
      if (cleanQuery.includes('course') || cleanQuery.includes('課程')) {
        return page.category === 'courses';
      }
      if (cleanQuery.includes('competition') || cleanQuery.includes('比賽')) {
        return page.category === 'competition';
      }
      return false;
    });
    return partialResults.slice(0, 6);
  }

  return results.slice(0, 8);
}

// Helper functions
function generateTitleFromFilename(filename: string): string {
  const cleanName = filename.replace(/[-_]/g, ' ').trim();
  
  // Use URL aliases to generate better titles
  const titleMap: Record<string, string> = {
    '關於我們': '關於我們 - 10教育',
    '聯絡我們': '聯絡我們 - 10教育',
    '校際AI藝術創作大賽 2024': '校際AI藝術創作大賽2024 - 10教育',
    '學界無人機救援挑戰賽': '學界無人機救援挑戰賽2024 - 10教育',
    'Minecraft 校園創建計劃 2024': 'Minecraft校園創建計劃2024 - 共融大世界'
  };
  
  return titleMap[cleanName] || `${cleanName} - 10教育`;
}

function generateDescriptionFromFilename(filename: string, category?: string): string {
  const cleanName = filename.replace(/[-_]/g, ' ').trim();
  
  const descMap: Record<string, string> = {
    '關於我們': '10教育致力推動香港中小學STEM教育發展，提供AI課程設計、師資培訓及教學支援服務，讓學生在科技時代掌握未來技能。',
    '聯絡我們': '歡迎聯絡10教育了解AI教育課程詳情。提供WhatsApp、電話及電郵諮詢服務，專業團隊為您量身定制STEM教學方案。',
    '校際AI藝術創作大賽 2024': '香港首個結合AI技術與視覺藝術的校際比賽，鼓勵學生運用人工智能創作藝術作品，培養創意思維和科技應用能力。',
    '學界無人機救援挑戰賽': '首屆學界無人機救援挑戰賽，學生需運用編程技巧控制無人機完成搜救任務，結合STEM教育與實際應用，培養解難能力。'
  };
  
  if (descMap[cleanName]) {
    return descMap[cleanName];
  }
  
  // Generate based on category
  switch (category) {
    case 'competition':
      return `${cleanName}比賽活動，結合STEM教育與實際應用，培養學生創意思維和解難能力。`;
    case 'funding':
      return `${cleanName}資助計劃，協助學校申請政府資助，建立AI實驗室和STEM教育設施。`;
    case 'courses':
      return `${cleanName}專業STEM課程，適合中小學生參與，培養21世紀數碼技能。`;
    case 'stemday':
      return `${cleanName}STEM Day活動，提供多元化科技體驗工作坊，讓學生在實踐中學習科技知識。`;
    default:
      return `${cleanName} - 10教育專業STEM教育服務，提供創新教學方案和師資培訓。`;
  }
}

function generateUrlFromFilename(filename: string, category?: string): string {
  // Map Chinese filenames to English URLs - combine static pages with course mappings
  const urlMapping: Record<string, string> = {
    '關於我們': 'about',
    '聯絡我們': 'contact',
    '加入我們': 'join-us',
    '條款及細則': 'terms-conditions',
    '隱私政策': 'privacy-policy',
    'Cookie政策': 'cookie-policy',
    '草原國度': 'grass-nation',
    ...COURSE_SLUG_MAPPING
  };

  const mappedSlug = urlMapping[filename] || filename.toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  if (category === 'courses') {
    return `https://10botics.com/school-courses/${mappedSlug}`;
  } else if (category === 'stemday') {
    return `https://10botics.com/stemday/${mappedSlug}`;
  } else if (category === 'funding') {
    return `https://10botics.com/funding-application/${mappedSlug}`;
  } else {
    return `https://10botics.com/${mappedSlug}`;
  }
}

function determineCategoryFromFilename(filename: string): string {
  const name = filename.toLowerCase();
  if (name.includes('關於') || name.includes('about')) return 'about';
  if (name.includes('聯絡') || name.includes('contact')) return 'contact';
  if (name.includes('competition') || name.includes('比賽') || (name.includes('minecraft') && name.includes('計劃'))) return 'competition';
  if (name.includes('funding') || name.includes('資助') || name.includes('實驗室')) return 'funding';
  if (name.includes('課程') || name.includes('course')) return 'courses';
  if (name.includes('stemday') || name.includes('stem')) return 'stemday';
  if (name.includes('staff-development')) return 'training';
  return 'main';
}

function extractTagsFromFilename(filename: string): string[] {
  const name = filename.toLowerCase();
  const tags: string[] = [];
  
  if (name.includes('ai') || name.includes('人工智能')) tags.push('AI人工智能');
  if (name.includes('minecraft')) tags.push('Minecraft');
  if (name.includes('drone') || name.includes('無人機')) tags.push('無人機');
  if (name.includes('competition') || name.includes('比賽')) tags.push('比賽');
  if (name.includes('課程') || name.includes('course')) tags.push('課程');
  if (name.includes('stem')) tags.push('STEM');
  
  return tags;
}
