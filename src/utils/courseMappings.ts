/**
 * Shared mapping utilities for course-related data
 * Consolidates slug mappings, tag mappings, and course discovery logic
 * Used across multiple pages and components to ensure consistency
 */

// Map Chinese filenames to English URL slugs
export const COURSE_SLUG_MAPPING: Record<string, string> = {
  '人工智能遊戲編程課程': 'ai-game-coding',
  'AI啟蒙與藝術創作課程': 'ai-enrichment-course',
  'AI數碼動畫展': 'ai-digital-animation-exhibition',
  'Blockchain 區塊鏈課程': 'blockchain',
  'CoDrone無人機課程': 'codrone',
  'Delightex 遊戲設計課程': 'delightex-game-design',
  'Donkey Car 無人車課程': 'donkey-car',
  'Dobot 智能機械手臂': 'dobot',
  'ksp太空計劃課程': 'ksp',
  'Lego Spike Prime 機器人技術大師班': 'lego-spike-prime',
  'Minecraft校園創建課程': 'minecraft',
  'Microbit 降落傘課程': 'microbit-parachute',
  'Microbit 逃出迷宮': 'microbit-maze',
  'Procreate數位藝術課程': 'procreate',
  'raspberry-pi編程課程': 'raspberry-pi',
  'Scratch 人工智能編程': 'scratch-ai-programming',
  'Scratch遊戲設計課程': 'scratch-game-design',
  'SwiftPlaygrounds編程課程': 'swiftplaygrounds',
  'Tello 無人機課程': 'tello',
  '珊瑚環境監測入門課程': 'coral-environment-monitoring',
  'Unity 課程': 'unity',
  '自然生物探究手作課程': 'natural-bio-sciences',
  'Python 初階遊戲編程': 'python-game-dev-beginner',
  'Apple Vision Pro 遊戲開發課程': 'apple-vision-pro-game-dev'
};

// Map Chinese tags to English URL slugs
export const TAG_MAPPING: Record<string, string> = {
  // Chinese tags to English equivalents
  '初中': 'junior-secondary',
  '高中': 'senior-secondary', 
  '高小': 'upper-primary',
  '初小': 'lower-primary',
  '小學': 'primary',
  '遊戲開發': 'game-development',
  '網頁遊戲': 'web-games',
  '無人機': 'drone',
  '軟件開發': 'software-development',
  '數位藝術': 'digital-art',
  '創意': 'creativity',
  '繪畫': 'drawing',
  '虛擬實境': 'virtual-reality',
  'VR 虛擬實境': 'vr-virtual-reality',
  'AR 擴增實境': 'ar-augmented-reality',
  '動畫創作': 'animation-creation',
  '互動體驗': 'interactive-experience',
  'AI 人工智能': 'ai',
  'Programming 編程': 'programming',
  'Block Coding 方塊編程': 'block-coding',
  'Arts 藝術': 'arts',
  'Engineering 工程': 'engineering',
  'Science 科學': 'science',
  '科學': 'science',
  'STEM Day': 'stem-day',
  // Technology and platform specific tags
  'ChatGPT': 'chatgpt',
  'Leonardo AI': 'leonardo-ai',
  'Delightex': 'delightex',
  'Metaverse 元宇宙': 'metaverse',
  '元宇宙': 'metaverse',
  'Microbit': 'microbit',
  'Micro:bit': 'microbit',
  'Blockchain 區塊鏈': 'blockchain',
  'Dobot': 'dobot',
  'KSP': 'ksp',
  'Lego': 'lego',
  'Robotics 機械人': 'robotics',
  'Coral': 'coral',
  'Python': 'python',
  'Raspberry Pi': 'raspberry-pi',
  'Tensorflow': 'tensorflow',
  'Swift Playground': 'swift-playground',
  '3D 建模': '3d-modeling',
  'C#': 'csharp',
  'Unity': 'unity',
  '故事開發': 'story-development',
  '編程': 'programming',
  '手作': 'hands-on',
  'IoT': 'iot',
  '海洋環境': 'marine-environment',
  'Arduino': 'arduino',
  'Tello': 'tello',
  'Scratch': 'scratch',
  'Procreate': 'procreate',
  'Donkey Car': 'donkey-car',
  'CoDrone': 'codrone',
  'Minecraft': 'minecraft',
  // Additional mappings for broader categories
  'AI': 'ai',
  '藝術': 'arts',
  '其他': 'others'
};

// Target audience tag mapping for specific styling
export const AUDIENCE_TAG_MAPPING: Record<string, string> = {
  '初小': 'lower-primary',
  '高小': 'upper-primary', 
  '初中': 'junior-secondary',
  '高中': 'senior-secondary'
};

// Course type mapping for categorization
export const COURSE_TYPE_MAPPING: Record<string, string> = {
  'ai': 'AI', 
  'scratch': 'AI', 
  'arduino': 'Hardware',
  'blockchain': 'AI', 
  'raspberry': 'Hardware', 
  'donkey-car': 'Robotics',
  'coral': 'Hardware', 
  'demo': 'Demo', 
  'example': 'Demo',
  'ksp': 'Creative', 
  'unity': 'Programming', 
  'roblox': 'Programming',
  'microbit': 'Hardware'
};

// Course interface type
export interface Course {
  slug: string;
  filename: string;
  title: string;
  subtitle?: string;
  description: string;
  courseType?: string;
  targetAudience: string;
  duration: string;
  tags: string[];
  heroImage?: string | any;
  publishDate: string;
  source: string;
}

/**
 * Generate a URL-safe tag slug from a Chinese or English tag
 */
export function generateTagSlug(tag: string): string {
  // Check if we have a mapping for this tag
  const mappedTag = TAG_MAPPING[tag] || tag;
  
  // Create a more robust slug that handles Chinese characters
  return mappedTag
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '') // Remove all non-word characters except hyphens
    .replace(/-+$/, ''); // Remove trailing hyphens
}

/**
 * Extract course type from filename
 */
export function extractCourseTypeFromFilename(filename: string): string {
  for (const [key, type] of Object.entries(COURSE_TYPE_MAPPING)) {
    if (filename.toLowerCase().includes(key)) return type;
  }
  return 'Other';
}

/**
 * Auto-discover and convert .astro course files to course data
 * @param basePath - Base path replacement for extracting filename (e.g., '../school-courses/', './')
 * @param exclusions - Array of paths to exclude (e.g., ['index.astro', '[slug].astro'])
 */
export async function discoverCourses(
  basePath: string = '../school-courses/', 
  exclusions: string[] = ['index.astro', '[slug].astro']
): Promise<Course[]> {
  // Auto-discover .astro course files - use a pattern that works from the project root
  const courseFiles = await import.meta.glob('/src/pages/school-courses/*.astro', { eager: true });

  // Convert .astro files to course data (excluding specified files)
  return Object.entries(courseFiles)
    .filter(([path]) => {
      const filename = path.split('/').pop() || '';
      // Check exclusions by filename, not full path
      return !exclusions.some(exclusion => {
        const exclusionFilename = exclusion.replace(/^\.\.?\//g, '');
        return filename === exclusionFilename;
      });
    })
    .map(([path, module]: [string, any]) => {
      const filename = path.replace('/src/pages/school-courses/', '').replace('.astro', '');
      
      // Extract courseData from frontmatter
      const courseData = module.courseData || {
        title: filename,
        description: `${filename} 課程頁面`,
        tags: [filename.replace('-', ' ')]
      };
      
      return {
        slug: COURSE_SLUG_MAPPING[filename] || filename,
        filename: `${filename}.astro`,
        title: courseData.title,
        subtitle: courseData.subtitle || '',
        description: courseData.description,
        courseType: extractCourseTypeFromFilename(filename),
        targetAudience: '待定',
        duration: '待定',
        tags: courseData.tags || [],
        heroImage: courseData.heroImage,
        publishDate: new Date().toISOString().split('T')[0],
        source: 'astro'
      } as Course;
    });
}

/**
 * Filter courses by tag with special category handling
 */
export function filterCoursesByTag(courses: Course[], tag: string, originalTag?: string): Course[] {
  return courses.filter(course => {
    // Special handling for the new category tags
    if (tag === 'ai') {
      return course.tags.some(courseTag => 
        courseTag.includes('AI') || courseTag.includes('人工智能') || courseTag.includes('ai')
      );
    } else if (tag === 'programming') {
      return course.tags.some(courseTag => 
        courseTag.includes('Programming') || courseTag.includes('編程') || 
        courseTag.includes('C#') || courseTag.includes('Unity') || courseTag.includes('Swift')
      );
    } else if (tag === 'arts') {
      return course.tags.some(courseTag => 
        courseTag.includes('Arts') || courseTag.includes('藝術') || 
        courseTag.includes('Procreate') || courseTag.includes('繪畫') || courseTag.includes('創意')
      );
    } else if (tag === 'others') {
      // Courses that don't fit into AI, Programming, or Arts categories
      const hasAITag = course.tags.some(courseTag => 
        courseTag.includes('AI') || courseTag.includes('人工智能') || courseTag.includes('ai')
      );
      const hasProgrammingTag = course.tags.some(courseTag => 
        courseTag.includes('Programming') || courseTag.includes('編程') || 
        courseTag.includes('C#') || courseTag.includes('Unity') || courseTag.includes('Swift')
      );
      const hasArtsTag = course.tags.some(courseTag => 
        courseTag.includes('Arts') || courseTag.includes('藝術') || 
        courseTag.includes('Procreate') || courseTag.includes('繪畫') || courseTag.includes('創意')
      );
      return !hasAITag && !hasProgrammingTag && !hasArtsTag;
    } else {
      // Original filtering logic for other tags
      return course.tags.some(courseTag => {
        const courseTagSlug = generateTagSlug(courseTag);
        return courseTagSlug === tag || courseTag === originalTag;
      });
    }
  });
}

/**
 * Get all unique tags from courses for static path generation
 */
export function getAllUniqueTags(courses: Course[]): string[] {
  const allTags = new Set<string>();
  courses.forEach(course => {
    course.tags.forEach(tag => {
      if (tag && tag.trim()) {
        allTags.add(tag);
      }
    });
  });
  return Array.from(allTags);
}

/**
 * Generate static paths for tag pages
 */
export function generateTagPaths(allTags: string[]): Array<{params: {tag: string}, props: {tag: string, originalTag: string}}> {
  // Create paths for each tag
  const tagPaths = allTags
    .filter(tag => tag && tag.trim())
    .map(tag => {
      const tagSlug = generateTagSlug(tag);
      
      // Only create paths for non-empty slugs
      if (tagSlug && tagSlug.trim()) {
        return {
          params: { tag: tagSlug },
          props: { tag: tagSlug, originalTag: tag }
        };
      }
      return null;
    })
    .filter(Boolean) as Array<{params: {tag: string}, props: {tag: string, originalTag: string}}>;

  // Add the new category tags
  const categoryTags = [
    { tag: 'ai', originalTag: 'AI 人工智能' },
    { tag: 'programming', originalTag: 'Programming 編程' },
    { tag: 'arts', originalTag: 'Arts 藝術' },
    { tag: 'others', originalTag: 'Others 其他' }
  ];

  const categoryPaths = categoryTags.map(({ tag, originalTag }) => ({
    params: { tag },
    props: { tag, originalTag }
  }));

  return [...tagPaths, ...categoryPaths];
}
