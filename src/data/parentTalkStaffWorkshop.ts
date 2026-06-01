import heroImage from '../assets/images/staff-development-day/mainpage/hero-image.jpeg';

/** Hub page: src/pages/parent-talk/index.astro → /parent-talk */
export const parentTalkPublicPath = '/parent-talk';

export const parentTalkDetailedDescription =
  '10教育與學校合作舉辦家長講座，協助家長掌握人工智能趨勢與實用工具，支援子女學習與安全地運用科技。本頁列出相關活動回顧與報導。';

export const parentTalkImageCaption =
  '為家長而設的講座與工作坊，連結家庭與學校的 STEAM／AI 教育';

/** Card + index metadata for 教師發展日 listing */
export const parentTalkStaffWorkshop = {
  slug: 'parent-talk',
  filename: 'parent-talk/index.astro',
  title: '家長講座',
  subtitle: '面向家長的 AI 與 STEAM 講座及親子活動回顧',
  description:
    '匯集我們於各校為家長舉辦的講座與活動報導，涵蓋 AI 應用、提示工程、子女學習效能與安全使用等主題。',
  courseType: '教師發展日',
  targetAudience: '教師',
  duration: '待定',
  tags: ['教師發展日', '家長講座', 'AI 人工智能', 'STEM', '教師培訓'],
  heroImage,
  publishDate: '2025-05-30',
  source: 'staff-dev' as const,
  publicPath: parentTalkPublicPath,
};
