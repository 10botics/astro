/**
 * Display-tag → URL slug map and `generateTagSlug`.
 * Kept in one file so Vite SSR never reads a half-initialized re-export from courseMappings.
 */

// Map Chinese tags to English URL slugs
export const TAG_MAPPING: Record<string, string> = {
  // Chinese tags to English equivalents
  初中: 'junior-secondary',
  高中: 'senior-secondary',
  高小: 'senior-primary',
  初小: 'junior-primary',
  小學: 'primary-school',
  遊戲開發: 'game-development',
  網頁遊戲: 'web-games',
  無人機: 'drone',
  軟件開發: 'app-develop',
  數位藝術: 'digital-art',
  創意: 'creativity',
  繪畫: 'drawing',
  虛擬實境: 'virtual-reality',
  'VR 虛擬實境': 'vr-virtual-reality',
  'AR 擴增實境': 'ar-augmented-reality',
  動畫創作: 'animation-creation',
  互動體驗: 'interactive-experience',
  'AI 人工智能': 'ai',
  'Programming 編程': 'programming',
  'Block Coding 方塊編程': 'block-coding',
  'Arts 藝術': 'arts',
  'Engineering 工程': 'engineering',
  工程: 'engineering',
  'Science 科學': 'science',
  科學: 'science',
  物理: 'physics',
  設計: 'design',
  團隊合作: 'teamwork',
  Matatalab: 'matatalab',
  'STEM Day': 'stemday',
  // Technology and platform specific tags
  ChatGPT: 'chatgpt',
  'Google Gemini': 'google-gemini',
  NotebookLM: 'notebooklm',
  'Leonardo AI': 'leonardo-ai',
  Delightex: 'delightex',
  'Metaverse 元宇宙': 'metaverse',
  元宇宙: 'metaverse',
  Microbit: 'microbit',
  'Micro:bit': 'microbit',
  'Blockchain 區塊鏈': 'blockchain',
  Dobot: 'dobot',
  KSP: 'ksp',
  Lego: 'lego',
  'Robotics 機械人': 'robotics',
  Coral: 'coral',
  Python: 'python',
  'Raspberry Pi': 'raspberry-pi',
  Tensorflow: 'tensorflow',
  'Swift Playground': 'swift-playground',
  '3D 建模': '3d-modeling',
  'C#': 'c',
  Unity: 'unity',
  故事開發: 'story-development',
  編程: 'programming',
  手作: 'hands-on',
  IoT: 'iot',
  海洋環境: 'marine-environment',
  Arduino: 'arduino',
  Tello: 'tello',
  Scratch: 'scratch',
  Procreate: 'procreate',
  'Donkey Car': 'donkey-car',
  CoDrone: 'codrone',
  Minecraft: 'minecraft',
  // Additional technology and platform tags
  CoSpaces: 'cospaces',
  'Formula AI': 'formula-ai',
  'Game Develop': 'game-develop',
  IT創新實驗室: 'it-innovation-lab',
  'Microbit 2': 'microbit-2',
  STEM教師培訓工作坊: 'stem-teacher-training-workshop',
  // 3D and robotics specific tags
  '3D 打印': '3d-printing',
  '3D打印': '3d-printing',
  '3D Printing': '3d-printing',
  機械人: 'robotics',
  Robot: 'robotics',
  Robotics: 'robotics',
  機械人創作: 'robot-creation',
  // Additional mappings for broader categories
  AI: 'ai',
  藝術: 'arts',
  科學手作: 'science-handicraft',
  STEM: 'stem',
  科學技術工程數學: 'stem',
  // New tags from the provided URLs
  中學: '中學',
  教師發展日: '教師發展日',
  航天科技: '航天科技',
  資優教育: '資優教育',
  '3D建模元宇宙': '3D建模元宇宙',
  AI人工智能: 'aAI人工智能',
  AI數碼動畫展: 'AI數碼動畫展',
  AI藝術創作: 'AI藝術創作',
  'Donkey Car CoDrone': 'donkey-car-codrone',
  家長講座: 'parent-talk',
};

/**
 * URL-safe slug for a tag label (defined here with TAG_MAPPING to avoid Vite SSR
 * circular-init / TDZ when re-exported from courseMappings).
 */
export function generateTagSlug(tag: string): string {
  const mappedTag = TAG_MAPPING[tag] || tag;

  if (/[\u4e00-\u9fff]/.test(mappedTag)) {
    return mappedTag;
  }

  return mappedTag
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+$/, '');
}