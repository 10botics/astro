// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import path from 'path';

import vercel from '@astrojs/vercel';

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
    // Course redirects - redirect old /course and /courses URLs to /school-courses
    '/course/:path*': {
      status: 301,
      destination: '/school-courses/'
    },
    '/courses/:path*': {
      status: 301,
      destination: '/school-courses/'
    },
    
    // External redirects
    '/timesheet_submission_form': 'https://otfxid9w.paperform.co',
    '/contact-form': 'https://or0uzdua.paperform.co',
    '/formula-ai': 'https://formula-ai.racing',
    '/ai-art-competition-2023': 'https://art.www.10botics.com',
    '/course-overview': 'https://or0uzdua.paperform.co',
    '/minecraft-2024-registration': 'https://exgj8uei.paperform.co',
    '/minecraft-2023-registration': 'https://ofpd3jzg.paperform.co',
    
    // URL Alias Redirects - All non-canonical aliases redirect to canonical URLs
    // Root level pages
    '/client': '/about',
    '/gen-ai-competition-2026': '/ai-competition-2026',
    '/gen-ai-competition': '/ai-competition-2026',
    '/ksp-competition': '/competition-ksp2022',
    '/minecraft-buildathon-2021': '/competition-minecraft2021',
    '/minecraft-my-campus-competition-2022': '/competition-minecraft2022',
    '/minecraft-my-campus-competition-2023': '/competition-minecraft2023',
    '/minecraft-校園創建計劃2023-2': '/competition-minecraft2024',
    '/school-courses/minecraft-2024': '/competition-minecraft2024',
    '/contact': '/contact-us',
    '/career': '/join-us',
    '/terms': '/terms-conditions',
    '/privacy': '/privacy-policy',
    '/cookies': '/cookie-policy',
    '/home': '/',
    '/2024-中小學-STEM-比賽名單': '/2024competitions',
    '/2024-stem-competition-list': '/2024competitions',
    '/2025-中小學-STEM-比賽名單': '/2025competitions',
    '/elementor-12069': '/stem-showroom',
    
    // Section index pages
    '/courses': '/school-courses',
    '/primary-stem-course': '/school-courses',
    '/primary-ai-course': '/school-courses',
    '/secondary-ai': '/school-courses',
    '/stem-school-courses-enquiry': '/school-courses',
    '/stem-courses-landing-page': '/school-courses',
    '/stem-day/index': '/stemday',
    '/stemworkshop': '/teacher-workshop',
    '/staff-development-day/staff-development-day': '/teacher-workshop',
    '/blog': '/news',
    '/events': '/news',
    
    // Subdirectory files
    '/competition-drone2024/final-results': '/competition-drone2024-final-results',
    
    // School courses - course tag redirects to school-courses
    '/course/ai-game-coding': '/school-courses/ai-game-coding',
    '/course/ai-enrichment-course': '/school-courses/ai-enrichment-course',
    '/course/ai-enlightenment': '/school-courses/ai-enlightenment',
    '/course/ai-digital-animation-exhibition': '/school-courses/ai-digital-animation-exhibition',
    '/course/blockchain': '/school-courses/blockchain',
    '/course/codrone': '/school-courses/codrone',
    '/course/delightex': '/school-courses/cospaces',
    '/course/delightex-game-design': '/school-courses/cospaces',
    '/course/cospaces': '/school-courses/cospaces',
    '/course/cospace': '/school-courses/cospaces',
    '/school-courses/delightex': '/school-courses/cospaces',
    '/school-courses/delightex-game-design': '/school-courses/cospaces',
    '/school-courses/cospace': '/school-courses/cospaces',
    '/course/donkey-car': '/school-courses/donkey-car',
    '/course/donkey-car-beginner-course': '/school-courses/donkey-car',
    '/course/donkey-car-advanced-course': '/school-courses/donkey-car',
    '/school-courses/donkey-car-beginner-course': '/school-courses/donkey-car',
    '/school-courses/donkey-car-advanced-course': '/school-courses/donkey-car',
    '/secondary-ai-course': '/school-courses/donkey-car',
    '/course/dobot': '/school-courses/dobot',
    '/course/ksp': '/school-courses/ksp',
    '/course/kerbal-space-program': '/school-courses/ksp',
    '/course/kerbal-space-program-eng': '/school-courses/ksp',
    '/school-courses/kerbal-space-program': '/school-courses/ksp',
    '/school-courses/kerbal-space-program-eng': '/school-courses/ksp',
    '/course/lego-spike-prime': '/school-courses/lego-spike-prime',
    '/course/minecraft': '/school-courses/minecraft',
    '/course/10botics-x-btehkmu-minecraft': '/school-courses/minecraft',
    '/course/minecraftbuildmyschool': '/school-courses/minecraft',
    '/school-courses/10botics-x-btehkmu-minecraft': '/school-courses/minecraft',
    '/school-courses/minecraftbuildmyschool': '/school-courses/minecraft',
    '/course/microbit-parachute': '/school-courses/microbit-parachute',
    '/stem-day/microbit-parachute': '/school-courses/microbit-parachute',
    '/stemday/microbit-parachute': '/school-courses/microbit-parachute',
    '/school-courses/microbit-maze': '/school-courses/microbit-parachute',
    '/course/procreate': '/school-courses/procreate',
    '/course/python-game-dev-beginner': '/school-courses/python-game-dev-beginner',
    '/course/raspberry-pi': '/school-courses/raspberry-pi',
    '/course/scratch-ai-programming': '/school-courses/scratch-ai-programming',
    '/course/scratch-ai': '/school-courses/scratch-ai-programming',
    '/course/ai-courses': '/school-courses/scratch-ai-programming',
    '/school-courses/scratch-ai': '/school-courses/scratch-ai-programming',
    '/school-courses/ai-courses': '/school-courses/scratch-ai-programming',
    '/ai-courses': '/school-courses/scratch-ai-programming',
    '/course/scratch-game-design': '/school-courses/scratch-game-design',
    '/course/swiftplaygrounds': '/school-courses/swiftplaygrounds',
    '/course/tello': '/school-courses/tello',
    '/course/tello-x-scratch-ai-takeoff-landing': '/blog/one-hour-ai-drone-part-1',
    '/course/coral-environment-monitoring': '/school-courses/coral-environment-monitoring',
    '/course/coral': '/school-courses/coral-environment-monitoring',
    '/school-courses/coral': '/school-courses/coral-environment-monitoring',
    '/course/unity': '/school-courses/unity',
    '/course/natural-bio-sciences': '/school-courses/natural-bio-sciences',
    '/course/apple-vision-pro-game-dev': '/school-courses/apple-vision-pro-game-dev',
    '/course/3d-microbit-robot-creation': '/school-courses/3d-microbit-robot-creation',
    '/course/ai-video-production': '/school-courses/ai-video-production',
    
    // STEM Day activities
    '/stem-day/straw-bridge': '/stemday/straw-bridge',
    '/stem-day/飲管橋': '/stemday/straw-bridge',
    '/stem-day/diy': '/stemday/diy',
    '/stem-day/DIY-手作': '/stemday/diy',
    '/stem-day/matatalab-programming': '/stemday/matatalab-programming',
    '/stem-day/matatalab-入門編程課程': '/stemday/matatalab-programming',
    '/stem-day/matatalab': '/stemday/matatalab-programming',
    '/stem-day/ai-digital-animation-exhibition': '/school-courses/ai-digital-animation-exhibition',
    '/stemday/matatalab-入門編程課程': '/stemday/matatalab-programming',
    '/stemday/matatalab': '/stemday/matatalab-programming',
    
    // Redirect Chinese filename URLs to canonical English URLs
    // Root level pages
    '/關於我們': '/about',
    '/個人資料收集': '/personal-data-collection',
    '/學界無人機救援挑戰賽': '/competition-drone2024',
    '/學界無人機救援挑戰賽-比賽名單': '/competition-drone-competitionlist',
    '/校際AI藝術創作大賽 2024': '/ai-art-competition-2024',
    '/第三屆 校際AI藝術創作大賽': '/ai-art-competition-2025',
    '/第三屆校際AI藝術創作大賽《智畫神話》result': '/ai-art-competition2025-result',
    '/2024 校際AI藝術創作大賽 -《數碼詠古》得獎名單': '/ai-art-competition-result',
    '/《GEN出你想》香港校際AI生成創作大賽2026': '/ai-competition-2026',
    '/香港航天電競大賽 2022': '/competition-ksp2022',
    '/Minecraft 校園創建計劃 2021': '/competition-minecraft2021',
    '/Minecraft 校園創建計劃 2022': '/competition-minecraft2022',
    '/Minecraft 校園創建計劃 2023': '/competition-minecraft2023',
    '/Minecraft 校園創建計劃 2024': '/competition-minecraft2024',
    '/聯絡我們': '/contact-us',
    '/加入我們': '/join-us',
    '/條款及細則': '/terms-conditions',
    '/隱私政策': '/privacy-policy',
    '/Cookie政策': '/cookie-policy',
    '/草原國度': '/natural-bio-sciences-01',
    '/2024 中小學 STEM 比賽清單': '/2024competitions',
    '/2025 中小學 STEM 比賽清單': '/2025competitions',
    
    // School courses
    '/school-courses/AI藝術創作課程': '/school-courses/ai-enrichment-course',
    '/school-courses/AI啟蒙課程': '/school-courses/ai-enlightenment',
    '/school-courses/AI數碼動畫展': '/school-courses/ai-digital-animation-exhibition',
    '/school-courses/Blockchain 區塊鏈課程': '/school-courses/blockchain',
    '/school-courses/CoDrone無人機課程': '/school-courses/codrone',
    '/school-courses/Delightex 遊戲設計課程': '/school-courses/cospaces',
    '/school-courses/Donkey Car 無人車課程': '/school-courses/donkey-car',
    '/school-courses/Dobot 智能機械手臂': '/school-courses/dobot',
    '/school-courses/ksp太空計劃課程': '/school-courses/ksp',
    '/school-courses/Lego Spike Prime 機器人技術大師班': '/school-courses/lego-spike-prime',
    '/school-courses/Minecraft校園創建課程': '/school-courses/minecraft',
    '/school-courses/Microbit 降落傘課程': '/school-courses/microbit-parachute',
    '/school-courses/Procreate數位藝術課程': '/school-courses/procreate',
    '/school-courses/Python 初階遊戲編程': '/school-courses/python-game-dev-beginner',
    '/school-courses/raspberry-pi編程課程': '/school-courses/raspberry-pi',
    '/school-courses/Scratch 人工智能編程': '/school-courses/scratch-ai-programming',
    '/school-courses/Scratch遊戲設計課程': '/school-courses/scratch-game-design',
    '/school-courses/SwiftPlaygrounds編程課程': '/school-courses/swiftplaygrounds',
    '/school-courses/Tello 無人機課程': '/school-courses/tello',
    '/school-courses/珊瑚環境監測入門課程': '/school-courses/coral-environment-monitoring',
    '/school-courses/Unity 課程': '/school-courses/unity',
    '/school-courses/自然生物探究手作課程': '/school-courses/natural-bio-sciences',
    '/school-courses/Apple Vision Pro 遊戲開發課程': '/school-courses/apple-vision-pro-game-dev',
    '/school-courses/3D Micro_bit 機械人創作課程': '/school-courses/3d-microbit-robot-creation',
    '/school-courses/AI影片製作課程': '/school-courses/ai-video-production',
    '/school-courses/人工智能遊戲編程課程': '/school-courses/ai-game-coding',
    
    // Stemday
    '/stemday/飲管橋': '/stemday/straw-bridge',
    '/stemday/DIY 手作': '/stemday/diy',
    '/stemday/Matatalab 入門編程課程': '/stemday/matatalab-programming',
    
    // Funding application
    '/funding-application/奇趣IT識多啲計劃': '/funding-application/knowing-more-about-it',
    '/funding-application/IT創新實驗室計劃': '/funding-application/it-innovation-lab',
    
    // Competition drone2024
    '/competition-drone2024/初賽結果': '/competition-drone2024-preliminary-results',
    '/competition-drone2024/決賽結果': '/competition-drone2024-final-results',
    '/competition-drone2024/決賽隊伍名單及時間表': '/competition-drone2024-final-teamlist',
    
    // Redirect URL-encoded Chinese filename URLs to canonical English URLs
    // Root level pages (URL-encoded)
    '/%E9%97%9C%E6%96%BC%E6%88%91%E5%80%91': '/about',
    '/%E5%80%8B%E4%BA%BA%E8%B3%87%E6%96%99%E6%94%B6%E9%9B%86': '/personal-data-collection',
    '/%E5%AD%B8%E7%95%8C%E7%84%A1%E4%BA%BA%E6%A9%9F%E6%95%91%E6%8F%B4%E6%8C%91%E6%88%B0%E8%B3%BD': '/competition-drone2024',
    '/%E5%AD%B8%E7%95%8C%E7%84%A1%E4%BA%BA%E6%A9%9F%E6%95%91%E6%8F%B4%E6%8C%91%E6%88%B0%E8%B3%BD-%E6%AF%94%E8%B3%BD%E5%90%8D%E5%96%AE': '/competition-drone-competitionlist',
    '/%E6%A0%A1%E9%9A%9BAI%E8%97%9D%E8%A1%93%E5%89%B5%E4%BD%9C%E5%A4%A7%E8%B3%BD%202024': '/ai-art-competition-2024',
    '/%E7%AC%AC%E4%B8%89%E5%B1%86%20%E6%A0%A1%E9%9A%9BAI%E8%97%9D%E8%A1%93%E5%89%B5%E4%BD%9C%E5%A4%A7%E8%B3%BD': '/ai-art-competition-2025',
    '/%E7%AC%AC%E4%B8%89%E5%B1%86%E6%A0%A1%E9%9A%9BAI%E8%97%9D%E8%A1%93%E5%89%B5%E4%BD%9C%E5%A4%A7%E8%B3%BD%E3%80%8A%E6%99%BA%E7%95%AB%E7%A5%9E%E8%A9%B1%E3%80%8Bresult': '/ai-art-competition2025-result',
    '/2024%20%E6%A0%A1%E9%9A%9BAI%E8%97%9D%E8%A1%93%E5%89%B5%E4%BD%9C%E5%A4%A7%E8%B3%BD%20-%E3%80%8A%E6%95%B8%E7%A2%BC%E8%A9%A0%E5%8F%A4%E3%80%8B%E5%BE%97%E7%8D%8E%E5%90%8D%E5%96%AE': '/ai-art-competition-result',
    '/%E3%80%8AGEN%E5%87%BA%E4%BD%A0%E6%83%B3%E3%80%8B%E9%A6%99%E6%B8%AF%E6%A0%A1%E9%9A%9BAI%E7%94%9F%E6%88%90%E5%89%B5%E4%BD%9C%E5%A4%A7%E8%B3%BD2026': '/ai-competition-2026',
    '/%E9%A6%99%E6%B8%AF%E8%88%AA%E5%A4%A9%E9%9B%BB%E7%AB%B6%E5%A4%A7%E8%B3%BD%202022': '/competition-ksp2022',
    '/Minecraft%20%E6%A0%A1%E5%9C%92%E5%89%B5%E5%BB%BA%E8%A8%88%E5%8A%83%202021': '/competition-minecraft2021',
    '/Minecraft%20%E6%A0%A1%E5%9C%92%E5%89%B5%E5%BB%BA%E8%A8%88%E5%8A%83%202022': '/competition-minecraft2022',
    '/Minecraft%20%E6%A0%A1%E5%9C%92%E5%89%B5%E5%BB%BA%E8%A8%88%E5%8A%83%202023': '/competition-minecraft2023',
    '/Minecraft%20%E6%A0%A1%E5%9C%92%E5%89%B5%E5%BB%BA%E8%A8%88%E5%8A%83%202024': '/competition-minecraft2024',
    '/%E8%81%AF%E7%B5%A1%E6%88%91%E5%80%91': '/contact-us',
    '/%E5%8A%A0%E5%85%A5%E6%88%91%E5%80%91': '/join-us',
    '/%E6%A2%9D%E6%AC%BE%E5%8F%8A%E7%B4%B0%E5%89%87': '/terms-conditions',
    '/%E9%9A%B1%E7%A7%81%E6%94%BF%E7%AD%96': '/privacy-policy',
    '/Cookie%E6%94%BF%E7%AD%96': '/cookie-policy',
    '/%E8%8D%89%E5%8E%9F%E5%9C%8B%E5%BA%A6': '/natural-bio-sciences-01',
    '/2024%20%E4%B8%AD%E5%B0%8F%E5%AD%B8%20STEM%20%E6%AF%94%E8%B3%BD%E6%B8%85%E5%96%AE': '/2024competitions',
    '/2025%20%E4%B8%AD%E5%B0%8F%E5%AD%B8%20STEM%20%E6%AF%94%E8%B3%BD%E6%B8%85%E5%96%AE': '/2025competitions',
    
    // School courses (URL-encoded)
    '/school-courses/AI%E8%97%9D%E8%A1%93%E5%89%B5%E4%BD%9C%E8%AA%B2%E7%A8%8B': '/school-courses/ai-enrichment-course',
    '/school-courses/AI%E5%95%9F%E8%92%99%E8%AA%B2%E7%A8%8B': '/school-courses/ai-enlightenment',
    '/school-courses/AI%E6%95%B8%E7%A2%BC%E5%8B%95%E7%95%AB%E5%B1%95': '/school-courses/ai-digital-animation-exhibition',
    '/school-courses/Blockchain%20%E5%8D%80%E5%A1%8A%E9%8F%88%E8%AA%B2%E7%A8%8B': '/school-courses/blockchain',
    '/school-courses/CoDrone%E7%84%A1%E4%BA%BA%E6%A9%9F%E8%AA%B2%E7%A8%8B': '/school-courses/codrone',
    '/school-courses/Delightex%20%E9%81%8A%E6%88%B2%E8%A8%AD%E8%A8%88%E8%AA%B2%E7%A8%8B': '/school-courses/cospaces',
    '/school-courses/Donkey%20Car%20%E7%84%A1%E4%BA%BA%E8%BB%8A%E8%AA%B2%E7%A8%8B': '/school-courses/donkey-car',
    '/school-courses/Dobot%20%E6%99%BA%E8%83%BD%E6%A9%9F%E6%A2%B0%E6%89%8B%E8%87%82': '/school-courses/dobot',
    '/school-courses/ksp%E5%A4%AA%E7%A9%BA%E8%A8%88%E5%8A%83%E8%AA%B2%E7%A8%8B': '/school-courses/ksp',
    '/school-courses/Lego%20Spike%20Prime%20%E6%A9%9F%E5%99%A8%E4%BA%BA%E6%8A%80%E8%A1%93%E5%A4%A7%E5%B8%AB%E7%8F%AD': '/school-courses/lego-spike-prime',
    '/school-courses/Minecraft%E6%A0%A1%E5%9C%92%E5%89%B5%E5%BB%BA%E8%AA%B2%E7%A8%8B': '/school-courses/minecraft',
    '/school-courses/Microbit%20%E9%99%8D%E8%90%BD%E5%82%98%E8%AA%B2%E7%A8%8B': '/school-courses/microbit-parachute',
    '/school-courses/Procreate%E6%95%B8%E4%BD%8D%E8%97%9D%E8%A1%93%E8%AA%B2%E7%A8%8B': '/school-courses/procreate',
    '/school-courses/Python%20%E5%88%9D%E9%9A%8E%E9%81%8A%E6%88%B2%E7%B7%A8%E7%A8%8B': '/school-courses/python-game-dev-beginner',
    '/school-courses/raspberry-pi%E7%B7%A8%E7%A8%8B%E8%AA%B2%E7%A8%8B': '/school-courses/raspberry-pi',
    '/school-courses/Scratch%20%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E7%B7%A8%E7%A8%8B': '/school-courses/scratch-ai-programming',
    '/school-courses/Scratch%E9%81%8A%E6%88%B2%E8%A8%AD%E8%A8%88%E8%AA%B2%E7%A8%8B': '/school-courses/scratch-game-design',
    '/school-courses/SwiftPlaygrounds%E7%B7%A8%E7%A8%8B%E8%AA%B2%E7%A8%8B': '/school-courses/swiftplaygrounds',
    '/school-courses/Tello%20%E7%84%A1%E4%BA%BA%E6%A9%9F%E8%AA%B2%E7%A8%8B': '/school-courses/tello',
    '/school-courses/%E7%8F%8A%E7%91%9A%E7%92%B0%E5%A2%83%E7%9B%A3%E6%B8%AC%E5%85%A5%E9%96%80%E8%AA%B2%E7%A8%8B': '/school-courses/coral-environment-monitoring',
    '/school-courses/Unity%20%E8%AA%B2%E7%A8%8B': '/school-courses/unity',
    '/school-courses/%E8%87%AA%E7%84%B6%E7%94%9F%E7%89%A9%E6%8E%A2%E7%A9%B6%E6%89%8B%E4%BD%9C%E8%AA%B2%E7%A8%8B': '/school-courses/natural-bio-sciences',
    '/school-courses/Apple%20Vision%20Pro%20%E9%81%8A%E6%88%B2%E9%96%8B%E7%99%BC%E8%AA%B2%E7%A8%8B': '/school-courses/apple-vision-pro-game-dev',
    '/school-courses/3D%20Micro_bit%20%E6%A9%9F%E6%A2%B0%E4%BA%BA%E5%89%B5%E4%BD%9C%E8%AA%B2%E7%A8%8B': '/school-courses/3d-microbit-robot-creation',
    '/school-courses/AI%E5%BD%B1%E7%89%87%E8%A3%BD%E4%BD%9C%E8%AA%B2%E7%A8%8B': '/school-courses/ai-video-production',
    '/school-courses/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E9%81%8A%E6%88%B2%E7%B7%A8%E7%A8%8B%E8%AA%B2%E7%A8%8B': '/school-courses/ai-game-coding',
    
    // Stemday (URL-encoded)
    '/stemday/%E9%A3%B2%E7%AE%A1%E6%A9%8B': '/stemday/straw-bridge',
    '/stemday/DIY%20%E6%89%8B%E4%BD%9C': '/stemday/diy',
    '/stemday/Matatalab%20%E5%85%A5%E9%96%80%E7%B7%A8%E7%A8%8B%E8%AA%B2%E7%A8%8B': '/stemday/matatalab-programming',
    
    // Funding application (URL-encoded)
    '/funding-application/%E5%A5%87%E8%B6%A3IT%E8%AD%98%E5%A4%9A%E5%95%B2%E8%A8%88%E5%8A%83': '/funding-application/knowing-more-about-it',
    '/funding-application/IT%E5%89%B5%E6%96%B0%E5%AF%A6%E9%A9%97%E5%AE%A4%E8%A8%88%E5%8A%83': '/funding-application/it-innovation-lab',
    
    // Competition drone2024 (URL-encoded)
    '/competition-drone2024/%E5%88%9D%E8%B3%BD%E7%B5%90%E6%9E%9C': '/competition-drone2024-preliminary-results',
    '/competition-drone2024/%E6%B1%BA%E8%B3%BD%E7%B5%90%E6%9E%9C': '/competition-drone2024-final-results',
    '/competition-drone2024/%E6%B1%BA%E8%B3%BD%E9%9A%8A%E4%BC%8D%E5%90%8D%E5%96%AE%E5%8F%8A%E6%99%82%E9%96%93%E8%A1%A8': '/competition-drone2024-final-teamlist',
    
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
        
        // Exclude URLs with URL-encoded Chinese characters
        // Chinese characters in UTF-8 are encoded as %E followed by hex digits
        // Pattern: %E[0-9A-F][0-9A-F]%[0-9A-F][0-9A-F]%[0-9A-F][0-9A-F]
        // Most Chinese characters start with %E4, %E5, %E6, %E7, %E8, %E9
        const chineseEncodedPattern = /%E[4-9A-F][0-9A-F]/i;
        if (chineseEncodedPattern.test(path)) {
          return false;
        }
        
        // Exclude URLs with decoded Chinese characters
        // Chinese Unicode range: U+4E00 to U+9FFF (CJK Unified Ideographs)
        // Also includes some extended ranges: U+3400-U+4DBF, U+20000-U+2A6DF
        const chineseUnicodePattern = /[\u4E00-\u9FFF\u3400-\u4DBF]/;
        if (chineseUnicodePattern.test(decodedPath)) {
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
          // Non-canonical URLs that should be excluded
          '/competition-drone2024/final-results',
          '/secondary-ai-course',
          '/staff-development-day/staff-development-day',
          '/stem-day/index',
          '/stem-day/matatalab',
          '/stem-showroom',
          '/stemday/index',
        ];
        
        // Exclude redirect sources - these are not canonical URLs
        // All non-canonical aliases are now redirects defined in the redirects object above
        if (redirectSources.includes(path) || redirectSources.includes(path + '/') || 
            redirectSources.includes(decodedPath) || redirectSources.includes(decodedPath + '/')) {
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