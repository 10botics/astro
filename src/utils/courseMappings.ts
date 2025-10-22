/**
 * Shared mapping utilities for course-related data
 * Consolidates slug mappings, tag mappings, and course discovery logic
 * Used across multiple pages and components to ensure consistency
 */

// Map Chinese filenames to English URL slugs
export const COURSE_SLUG_MAPPING: Record<string, string> = {
  '人工智能遊戲編程課程': 'ai-game-coding',
  'AI藝術創作課程': 'ai-enrichment-course',
  'AI啟蒙課程': 'ai-enlightenment',
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
  'Apple Vision Pro 遊戲開發課程': 'apple-vision-pro-game-dev',
  '3D Micro_bit 機械人創作課程': '3d-microbit-robot-creation',
  'AI影片製作課程': 'ai-video-production'
};

// Map STEM Day Chinese filenames to English URL slugs
export const STEMDAY_SLUG_MAPPING: Record<string, string> = {
  '飲管橋': 'straw-bridge',
  'DIY 手作': 'diy',
  'Matatalab 入門編程課程': 'matatalab-programming'
};

// Map Chinese tags to English URL slugs
export const TAG_MAPPING: Record<string, string> = {
  // Chinese tags to English equivalents
  '初中': 'junior-secondary',
  '高中': 'senior-secondary', 
  '高小': 'senior-primary',
  '初小': 'junior-primary',
  '小學': 'primary-school',
  '遊戲開發': 'game-development',
  '網頁遊戲': 'web-games',
  '無人機': 'drone',
  '軟件開發': 'app-develop',
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
  '工程': 'engineering',
  'Science 科學': 'science',
  '科學': 'science',
  '物理': 'physics',
  '設計': 'design',
  '團隊合作': 'teamwork',
  'Matatalab': 'matatalab',
  'STEM Day': 'stemday',
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
  'C#': 'c',
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
  // Additional technology and platform tags
  'CoSpaces': 'cospaces',
  'Formula AI': 'formula-ai',
  'Game Develop': 'game-develop',
  'IT創新實驗室': 'it-innovation-lab',
  'Microbit 2': 'microbit-2',
  'STEM教師培訓工作坊': 'stem-teacher-training-workshop',
  // 3D and robotics specific tags
  '3D 打印': '3d-printing',
  '3D打印': '3d-printing',
  '3D Printing': '3d-printing',
  '機械人': 'robotics',
  'Robot': 'robotics',
  'Robotics': 'robotics',
  '機械人創作': 'robot-creation',
  // Additional mappings for broader categories
  'AI': 'ai',
  '藝術': 'arts',
  '科學手作': 'science-handicraft',
  'STEM': 'stem',
  '科學技術工程數學': 'stem',
  // New tags from the provided URLs
  '中學': '中學',
  '教師發展日': '教師發展日',
  '航天科技': '航天科技',
  '資優教育': '資優教育',
  '3D建模元宇宙': '3D建模元宇宙',
  'AI人工智能': 'aAI人工智能',
  'AI數碼動畫展': 'AI數碼動畫展',
  'AI藝術創作': 'AI藝術創作',
  'Donkey Car CoDrone': 'donkey-car-codrone'
};

// Target audience tag mapping for specific styling
export const AUDIENCE_TAG_MAPPING: Record<string, string> = {
  '初小': 'junior-primary',
  '高小': 'senior-primary', 
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
  
  // For Chinese characters, preserve them as-is for URL encoding
  // For English tags, convert to lowercase and replace spaces with hyphens
  if (/[\u4e00-\u9fff]/.test(mappedTag)) {
    // Contains Chinese characters - preserve as-is
    return mappedTag;
  } else {
    // English tag - convert to slug format
    return mappedTag
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '') // Remove all non-word characters except hyphens
      .replace(/-+$/, ''); // Remove trailing hyphens
  }
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
 * Auto-discover and convert STEM Day .astro course files to course data
 * @param exclusions - Array of paths to exclude (e.g., ['index.astro', '[slug].astro'])
 */
export async function discoverStemdayCourses(
  exclusions: string[] = ['index.astro', '[slug].astro']
): Promise<Course[]> {
  // Since stemday files don't export their data, we'll manually define the course data
  // This is more reliable than trying to import from .astro files
  const stemdayCourses = [
    {
      filename: '飲管橋',
      title: '飲管橋STEM活動',
      subtitle: '想要激發您的學生對工程師職業的興趣嗎？想要向您的學生展示橋梁是如何建造的，以及它們的優缺點是什麼嗎？',
      description: '飲管橋STEM Day活動，學生建造橋梁學習結構設計物理力學概念，培養創造解決問題能力，教導建構穩固結構原則實際應用工程學知識解決挑戰激發創造思維',
      tags: ['工程', 'STEM', '物理', '設計', '團隊合作', '初中', '高小'],
      heroImage: undefined // Will be handled by the page itself
    },
    {
      filename: 'DIY 手作',
      title: 'DIY手作STEM活動',
      subtitle: '',
      description: 'DIY手作STEM Day活動，學生探索科學原理概念學習科學融入日常生活，激發科學興趣提高問題解決實踐動手能力，培養創造力邏輯思維實驗設計',
      tags: ['Science 科學', '初小', '高小'],
      heroImage: undefined
    },
    {
      filename: 'Matatalab 入門編程課程',
      title: 'Matatalab編程STEM活動',
      subtitle: '學習使用實體編程模塊來編寫機器人簡單的指令，探索不同的編程概念。',
      description: 'Matatalab入門編程STEM Day活動，容易上手物理編程模塊設計，學生簡單易操作互動性高環境學習初步編程知識概念，操作機器人體驗編程樂趣協作分享解決問題',
      tags: ['Block Coding 方塊編程', 'Matatalab', 'Programming 編程', '初小'],
      heroImage: undefined
    }
  ];

  return stemdayCourses
    .filter(course => {
      // Check exclusions by filename
      return !exclusions.some(exclusion => {
        const exclusionFilename = exclusion.replace(/^\.\.?\//g, '');
        return `${course.filename}.astro` === exclusionFilename;
      });
    })
    .map(course => {
      return {
        slug: STEMDAY_SLUG_MAPPING[course.filename] || course.filename,
        filename: `${course.filename}.astro`,
        title: course.title,
        subtitle: course.subtitle,
        description: course.description,
        courseType: 'STEM Day',
        targetAudience: '待定',
        duration: '待定',
        tags: course.tags,
        heroImage: course.heroImage,
        publishDate: new Date().toISOString().split('T')[0],
        source: 'stemday'
      } as Course;
    });
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
 * Discover all courses from both school-courses and stemday directories
 * @param exclusions - Array of paths to exclude 
 */
export async function discoverAllCourses(
  exclusions: string[] = ['index.astro', '[slug].astro']
): Promise<Course[]> {
  const [schoolCourses, stemdayCourses] = await Promise.all([
    discoverCourses('../school-courses/', exclusions),
    discoverStemdayCourses(exclusions)
  ]);
  
  return [...schoolCourses, ...stemdayCourses];
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
    } else if (tag === 'stem') {
      // STEM encompasses Science, Technology, Engineering, Mathematics
      return course.tags.some(courseTag => 
        courseTag.includes('Science') || courseTag.includes('科學') ||
        courseTag.includes('Engineering') || courseTag.includes('工程') ||
        courseTag.includes('Programming') || courseTag.includes('編程') ||
        courseTag.includes('Robotics') || courseTag.includes('機械人') ||
        courseTag.includes('Block Coding') || courseTag.includes('方塊編程') ||
        courseTag.includes('Arduino') || courseTag.includes('Microbit') ||
        courseTag.includes('STEM') || courseTag.includes('物理') ||
        courseTag.includes('KSP') || courseTag.includes('Lego')
      );
    } else if (tag === 'science-handicraft') {
      // Science handicraft courses - courses with Science + Arts/Hands-on tags
      return course.tags.some(courseTag => 
        (courseTag.includes('Science') || courseTag.includes('科學') || 
         courseTag.includes('手作') || courseTag.includes('Arts')) &&
        !courseTag.includes('Programming') && !courseTag.includes('編程') &&
        !courseTag.includes('AI') && !courseTag.includes('人工智能')
      );
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
  
  // Add Chinese tags from additionalTags that might not be in courses
  const additionalTags = [
    '中學', '小學', '手作', '教師發展日', '海洋環境', '科學', '航天科技', 
    '故事開發', '無人機', '編程', '資優教育', '3D建模元宇宙', 'AI人工智能',
    'AI數碼動畫展', 'AI藝術創作', 'CoDrone', 'donkey-carcodrone', 'Minecraft', 'STEM Day',
    'stem教師培訓工作坊', 'i@t創新實驗室', 'ai藝術創作', 'ai數碼動畫展', '3d-建模-元宇宙','ai人工智能', 'Formula AI', 'Game Develop', 'c', 'cospaces', 'formula-ai', 'game-develop', 'it-innovation-lab', 'microbit-2', 'stem-teacher-training-workshop'
  ];
  
  additionalTags.forEach(tag => {
    if (tag && tag.trim()) {
      allTags.add(tag);
    }
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

  // Add the new category tags and ensure all mapped tags get pages
  const categoryTags = [
    { tag: 'ai', originalTag: 'AI 人工智能' },
    { tag: 'programming', originalTag: 'Programming 編程' },
    { tag: 'arts', originalTag: 'Arts 藝術' },
    { tag: 'stem', originalTag: 'STEM 科學技術工程數學' },
    { tag: 'science-handicraft', originalTag: '科學手作' }
  ];

  // Add missing tags that may not be discovered from courses but exist in TAG_MAPPING
  const additionalTags = [
    { tag: 'physics', originalTag: '物理' },
    { tag: 'design', originalTag: '設計' },
    { tag: 'teamwork', originalTag: '團隊合作' },
    { tag: 'matatalab', originalTag: 'Matatalab' },
    { tag: 'c', originalTag: 'C#' },
    { tag: 'cospaces', originalTag: 'CoSpaces' },
    { tag: 'formula-ai', originalTag: 'Formula AI' },
    { tag: 'game-develop', originalTag: 'Game Develop' },
    { tag: 'it-innovation-lab', originalTag: 'IT創新實驗室' },
    { tag: 'microbit-2', originalTag: 'Microbit 2' },
    { tag: 'stem-teacher-training-workshop', originalTag: 'STEM教師培訓工作坊' },
    // New tags from the provided URLs
    { tag: 'secondary-school', originalTag: '中學' },
    { tag: 'primary-school', originalTag: '小學' },
    { tag: 'hands-on', originalTag: '手作' },
    { tag: 'teacher-development-day', originalTag: '教師發展日' },
    { tag: 'marine-environment', originalTag: '海洋環境' },
    { tag: 'science', originalTag: '科學' },
    { tag: 'aerospace-technology', originalTag: '航天科技' },
    { tag: 'story-development', originalTag: '故事開發' },
    { tag: 'drone', originalTag: '無人機' },
    { tag: 'programming', originalTag: '編程' },
    { tag: 'gifted-education', originalTag: '資優教育' },
    { tag: '3d-modeling-metaverse', originalTag: '3D建模元宇宙' },
    { tag: 'ai-artificial-intelligence', originalTag: 'AI人工智能' },
    { tag: 'ai-digital-animation-exhibition', originalTag: 'AI數碼動畫展' },
    { tag: 'ai-art-creation', originalTag: 'AI藝術創作' },
    { tag: 'codrone', originalTag: 'CoDrone' },
    { tag: 'donkey-car-codrone', originalTag: 'Donkey Car CoDrone' },
    { tag: 'minecraft', originalTag: 'Minecraft' },
    { tag: 'stemday', originalTag: 'STEM Day' }
  ];

  const categoryPaths = categoryTags.map(({ tag, originalTag }) => ({
    params: { tag },
    props: { tag, originalTag }
  }));

  const additionalPaths = additionalTags.map(({ tag, originalTag }) => ({
    params: { tag },
    props: { tag, originalTag }
  }));

  // Add Chinese character paths for tags that have Chinese original names
  const chinesePaths = additionalTags
    .filter(({ originalTag }) => /[\u4e00-\u9fff]/.test(originalTag)) // Contains Chinese characters
    .map(({ originalTag }) => ({
      params: { tag: originalTag },
      props: { tag: originalTag, originalTag }
    }));

  return [...tagPaths, ...categoryPaths, ...additionalPaths, ...chinesePaths];
}
