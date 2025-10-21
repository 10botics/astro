// Global URL alias configuration organized by filename
// This file contains mappings where each file can have multiple tags with multiple URLs
// Format: filename -> { tags: { tagName: [urls], anotherTag: [urls] }, main: "primary-url" }

export const urlAliases = {
  // Root level pages (handled by src/pages/[slug].astro)
  "關於我們.astro": {
    "tags": {
      "root": ["about", "client"]
    },
    "main": "about"
  },
  "校際AI藝術創作大賽 2024.astro": {
    "tags": {
      "root": ["ai-art-competition-2024"]
    },
    "main": "ai-art-competition-2024"
  },
  "第三屆 校際AI藝術創作大賽.astro": {
    "tags": {
      "root": ["ai-art-competition-2025"]
    },
    "main": "ai-art-competition-2025"
  },
  "第三屆校際AI藝術創作大賽《智畫神話》result.astro": {
    "tags": {
      "root": ["ai-art-competition2025-result"]
    },
    "main": "ai-art-competition2025-result"
  },
  "2024 校際AI藝術創作大賽 -《數碼詠古》得獎名單.astro": {
    "tags": {
      "root": ["ai-art-competition-result"]
    },
    "main": "ai-art-competition-result"
  },
  "《GEN出你想》香港校際AI生成創作大賽2026.astro": {
    "tags": {
      "root": ["ai-competition-2026", "gen-ai-competition-2026", "gen-ai-competition"]
    },
    "main": "ai-competition-2026"
  },
  "學界無人機救援挑戰賽.astro": {
    "tags": {
      "root": ["competition-drone2024"]
    },
    "main": "competition-drone2024"
  },
  "學界無人機救援挑戰賽-比賽名單.astro": {
    "tags": {
      "root": ["competition-drone-competitionlist"]
    },
    "main": "competition-drone-competitionlist"
  },
  "香港航天電競大賽 2022.astro": {
    "tags": {
      "root": ["competition-ksp2022", "ksp-competition"]
    },
    "main": "competition-ksp2022"
  },
  "Minecraft 校園創建計劃 2021.astro": {
    "tags": {
      "root": ["competition-minecraft2021", "minecraft-buildathon-2021"]
    },
    "main": "competition-minecraft2021"
  },
  "Minecraft 校園創建計劃 2022.astro": {
    "tags": {
      "root": ["competition-minecraft2022", "minecraft-my-campus-competition-2022"]
    },
    "main": "competition-minecraft2022"
  },
  "Minecraft 校園創建計劃 2023.astro": {
    "tags": {
      "root": ["competition-minecraft2023", "minecraft-my-campus-competition-2023"]
    },
    "main": "competition-minecraft2023"
  },
  "Minecraft 校園創建計劃 2024.astro": {
    "tags": {
      "root": ["competition-minecraft2024", "minecraft-校園創建計劃2023-2"],
      "school-courses": ["minecraft-2024"]
    },
    "main": "competition-minecraft2024"
  },
  "Minecraft 校園創建計劃 2024.astro": {
    "tags": {
      "root": ["competition-minecraft2024", "minecraft-校園創建計劃2023-2"]
    },
    "main": "competition-minecraft2024"
  },
  "../Minecraft 校園創建計劃 2024.astro": {
    "tags": {
      "school-courses": ["minecraft-2024"]
    },
    "main": "minecraft-2024"
  },
  "聯絡我們.astro": {
    "tags": {
      "root": ["contact-us", "contact"]
    },
    "main": "contact-us"
  },
  "加入我們.astro": {
    "tags": {
      "root": ["join-us", "career"]
    },
    "main": "join-us"
  },
  "條款及細則.astro": {
    "tags": {
      "root": ["terms-conditions", "terms"]
    },
    "main": "terms-conditions"
  },
  "隱私政策.astro": {
    "tags": {
      "root": ["privacy-policy", "privacy"]
    },
    "main": "privacy-policy"
  },
  "個人資料收集.astro": {
    "tags": {
      "root": ["personal-data-collection"]
    },
    "main": "personal-data-collection"
  },
  "Cookie政策.astro": {
    "tags": {
      "root": ["cookie-policy", "cookies"]
    },
    "main": "cookie-policy"
  },
  "草原國度.astro": {
    "tags": {
      "root": ["natural-bio-sciences-01"]
    },
    "main": "natural-bio-sciences-01"
  },
  "index.astro": {
    "tags": {
      "root": ["home"]
    },
    "main": "home"
  },
  "course-brochure.astro": {
    "tags": {
      "root": ["course-brochure"]
    },
    "main": "course-brochure"
  },
  "2024 中小學 STEM 比賽清單.astro": {
    "tags": {
      "root": ["2024competitions", "2024-中小學-STEM-比賽名單", "2024-stem-competition-list"]
    },
    "main": "2024competitions"
  },
  "2025 中小學 STEM 比賽清單.astro": {
    "tags": {
      "root": ["2025competitions", "2025-中小學-STEM-比賽名單"]
    },
    "main": "2025competitions"
  },
  "stem-showroom.astro": {
    "tags": {
      "root": ["elementor-12069"]
    },
    "main": "elementor-12069"
  },

  // Index pages for different sections
  "school-courses/index.astro": {
    "tags": {
      "root": ["school-courses", "courses", "primary-stem-course", "primary-ai-course", "secondary-ai", "stem-school-courses-enquiry", "stem-courses-landing-page"]
    },
    "main": "school-courses"
  },
  "stemday/index.astro": {
    "tags": {
      "root": ["stemday"],
      "stem-day": ["index"]
    },
    "main": "stemday"
  },
  "staff-development-day/index.astro": {
    "tags": {
      "root": ["teacher-workshop", "stemworkshop"],
      "staff-development-day": ["staff-development-day"]
    },
    "main": "teacher-workshop",
    "filename": "index.astro"
  },
  "funding-application/index.astro": {
    "tags": {
      "root": ["funding-application"]
    },
    "main": "funding-application"
  },
  "news/index.astro": {
    "tags": {
      "root": ["news", "blog", "events"]
    },
    "main": "news"
  },

  // Subdirectory files
  "competition-drone2024/初賽結果.astro": {
    "tags": {
      "root": ["competition-drone2024-preliminary-results"]
    },
    "main": "competition-drone2024-preliminary-results"
  },
  "competition-drone2024/決賽隊伍名單及時間表.astro": {
    "tags": {
      "root": ["competition-drone2024-final-teamlist"]
    },
    "main": "competition-drone2024-final-teamlist"
  },
  "competition-drone2024/決賽結果.astro": {
    "tags": {
      "root": ["competition-drone2024-final-results", "competition-drone2024/final-results"]
    },
    "main": "competition-drone2024-final-results"
  },

  // School courses
  "人工智能遊戲編程課程.astro": {
    "tags": {
      "school-courses": ["ai-game-coding"],
      "course": ["ai-game-coding"]
    },
    "main": "ai-game-coding"
  },
  "AI藝術創作課程.astro": {
    "tags": {
      "school-courses": ["ai-enrichment-course"],
      "course": ["ai-enrichment-course"]
    },
    "main": "ai-enrichment-course"
  },
  "AI啟蒙課程.astro": {
    "tags": {
      "school-courses": ["ai-enlightenment"],
      "course": ["ai-enlightenment"]
    },
    "main": "ai-enlightenment"
  },
  "AI數碼動畫展.astro": {
    "tags": {
      "school-courses": ["ai-digital-animation-exhibition"],
      "course": ["ai-digital-animation-exhibition"]
    },
    "main": "ai-digital-animation-exhibition"
  },
  "Blockchain 區塊鏈課程.astro": {
    "tags": {
      "school-courses": ["blockchain"],
      "course": ["blockchain"]
    },
    "main": "blockchain"
  },
  "CoDrone無人機課程.astro": {
    "tags": {
      "school-courses": ["codrone"],
      "course": ["codrone"]
    },
    "main": "codrone"
  },
  "Delightex 遊戲設計課程.astro": {
    "tags": {
      "school-courses": ["delightex", "delightex-game-design", "cospaces", "cospace"],
      "course": ["delightex", "delightex-game-design", "cospaces", "cospace"]
    },
    "main": "cospaces"
  },
  "Donkey Car 無人車課程.astro": {
    "tags": {
      "school-courses": ["donkey-car", "donkey-car-beginner-course", "donkey-car-advanced-course"],
      "course": ["donkey-car", "donkey-car-beginner-course", "donkey-car-advanced-course"],
      "root": ["secondary-ai-course"]
    },
    "main": "donkey-car"
  },
  "Dobot 智能機械手臂.astro": {
    "tags": {
      "school-courses": ["dobot"],
      "course": ["dobot"]
    },
    "main": "dobot"
  },
  "ksp太空計劃課程.astro": {
    "tags": {
      "school-courses": ["ksp", "kerbal-space-program", "kerbal-space-program-eng"],
      "course": ["ksp", "kerbal-space-program", "kerbal-space-program-eng"]
    },
    "main": "ksp"
  },
  "Lego Spike Prime 機器人技術大師班.astro": {
    "tags": {
      "school-courses": ["lego-spike-prime"],
      "course": ["lego-spike-prime"]
    },
    "main": "lego-spike-prime"
  },
  "Minecraft校園創建課程.astro": {
    "tags": {
      "school-courses": ["minecraft", "10botics-x-btehkmu-minecraft", "minecraftbuildmyschool"],
      "course": ["minecraft", "10botics-x-btehkmu-minecraft", "minecraftbuildmyschool"]
    },
    "main": "minecraft"
  },
  "Microbit 降落傘課程.astro": {
    "tags": {
      "school-courses": ["microbit-parachute"],
      "course": ["microbit-parachute"],
      "stem-day": ["microbit-parachute"],
      "stemday": ["microbit-parachute"]
    },
    "main": "microbit-parachute"
  },
  "Procreate數位藝術課程.astro": {
    "tags": {
      "school-courses": ["procreate"],
      "course": ["procreate"]
    },
    "main": "procreate"
  },
  "Python 初階遊戲編程.astro": {
    "tags": {
      "school-courses": ["python-game-dev-beginner"],
      "course": ["python-game-dev-beginner"]
    },
    "main": "python-game-dev-beginner"
  },
  "raspberry-pi編程課程.astro": {
    "tags": {
      "school-courses": ["raspberry-pi"],
      "course": ["raspberry-pi"]
    },
    "main": "raspberry-pi"
  },
  "Scratch 人工智能編程.astro": {
    "tags": {
      "school-courses": ["scratch-ai-programming", "scratch-ai", "ai-courses"],
      "course": ["scratch-ai-programming", "ai-courses"]
    },
    "main": "scratch-ai-programming",
    "redirects": {
      "course/scratch-ai": "/school-courses/ai-courses"
    }
  },
  "Scratch遊戲設計課程.astro": {
    "tags": {
      "school-courses": ["scratch-game-design"],
      "course": ["scratch-game-design"]
    },
    "main": "scratch-game-design"
  },
  "SwiftPlaygrounds編程課程.astro": {
    "tags": {
      "school-courses": ["swiftplaygrounds"],
      "course": ["swiftplaygrounds"]
    },
    "main": "swiftplaygrounds"
  },
  "Tello 無人機課程.astro": {
    "tags": {
      "school-courses": ["tello"],
      "course": ["tello"]
    },
    "main": "tello",
    "redirects": {
      "course/tello-x-scratch-ai-takeoff-landing": "/blog/one-hour-ai-drone-part-1"
    }
  },
  "珊瑚環境監測入門課程.astro": {
    "tags": {
      "school-courses": ["coral-environment-monitoring","coral"],
      "course": ["coral-environment-monitoring","coral"]
    },
    "main": "coral-environment-monitoring"
  },
  "Unity 課程.astro": {
    "tags": {
      "school-courses": ["unity"],
      "course": ["unity"]
    },
    "main": "unity"
  },
  "自然生物探究手作課程.astro": {
    "tags": {
      "school-courses": ["natural-bio-sciences"],
      "course": ["natural-bio-sciences"]
    },
    "main": "natural-bio-sciences"
  },
  "Apple Vision Pro 遊戲開發課程.astro": {
    "tags": {
      "school-courses": ["apple-vision-pro-game-dev"],
      "course": ["apple-vision-pro-game-dev"]
    },
    "main": "apple-vision-pro-game-dev"
  },
  "3D Micro_bit 機械人創作課程.astro": {
    "tags": {
      "school-courses": ["3d-microbit-robot-creation"],
      "course": ["3d-microbit-robot-creation"]
    },
    "main": "3d-microbit-robot-creation"
  },
  "AI影片製作課程.astro": {
    "tags": {
      "school-courses": ["ai-video-production"],
      "course": ["ai-video-production"]
    },
    "main": "ai-video-production"
  },

  // STEM Day activities
  "飲管橋.astro": {
    "tags": {
      "stemday": ["straw-bridge"],
      "stem-day": ["straw-bridge", "飲管橋"]
    },
    "main": "straw-bridge"
  },
  "DIY 手作.astro": {
    "tags": {
      "stemday": ["diy"],
      "stem-day": ["diy", "DIY-手作"]
    },
    "main": "diy"
  },
  "Matatalab 入門編程課程.astro": {
    "tags": {
      "stemday": ["matatalab-programming","matatalab-入門編程課程", "matatalab"],
      "stem-day": ["matatalab-programming", "matatalab-入門編程課程", "matatalab"]
    },
    "main": "matatalab-programming"
  },

  // Funding applications
  "IT創新實驗室計劃.astro": {
    "tags": {
      "funding-application": ["it-innovation-lab"]
    },
    "main": "it-innovation-lab"
  },
  "奇趣IT識多啲計劃.astro": {
    "tags": {
      "funding-application": ["knowing-more-about-it"]
    },
    "main": "knowing-more-about-it"
  }
};

// Helper function to get all static paths for a specific tag
export function getStaticPathsForFolder(tagName) {
  const paths = [];
  
  for (const [filename, config] of Object.entries(urlAliases)) {
    if (config.tags && config.tags[tagName]) {
      config.tags[tagName].forEach(alias => {
        paths.push({ params: { slug: alias } });
      });
    }
  }
  
  return paths;
}

// Helper function to get component import path for a slug in a specific tag
export function getComponentForSlug(tagName, slug) {
  for (const [filename, config] of Object.entries(urlAliases)) {
    if (config.tags && config.tags[tagName] && config.tags[tagName].includes(slug)) {
      // Check for specific redirects first
      if (config.redirects && config.redirects[`${tagName}/${slug}`]) {
        return {
          filename: config.filename || filename,
          redirect: config.redirects[`${tagName}/${slug}`],
          isRedirect: true
        };
      }
      
      return {
        filename: config.filename || filename,
        redirect: null,
        isRedirect: false
      };
    }
  }
  return null;
}

// Helper function to get main alias for a filename
export function getMainAliasForFile(filename) {
  const config = urlAliases[filename];
  return config ? config.main : null;
}

// Helper function to get all aliases for a filename in a specific tag
export function getAllAliasesForFile(tagName, filename) {
  const config = urlAliases[filename];
  if (!config || !config.tags || !config.tags[tagName]) {
    return [];
  }
  return config.tags[tagName];
}

// Helper function to get all aliases for a filename across all tags
export function getAllAliasesForFileAllTags(filename) {
  const config = urlAliases[filename];
  if (!config || !config.tags) {
    return [];
  }
  
  const allAliases = [];
  for (const [tagName, aliases] of Object.entries(config.tags)) {
    allAliases.push(...aliases);
  }
  return allAliases;
}

// Helper function to find filename by alias in any tag
export function findFilenameByAlias(alias) {
  for (const [filename, config] of Object.entries(urlAliases)) {
    if (config.tags) {
      for (const [tagName, aliases] of Object.entries(config.tags)) {
        if (aliases.includes(alias)) {
          return {
            filename: filename,
            tag: tagName,
            main: config.main
          };
        }
      }
    }
  }
  return null;
}

// Helper function to get canonical URL for current pathname
export function getCanonicalUrl(pathname, site) {
  // Remove leading slash and trailing slash for matching
  const cleanPath = pathname.replace(/^\/|\/$/g, '');
  
  // Check if this pathname matches any alias
  const aliasInfo = findFilenameByAlias(cleanPath);
  
  if (aliasInfo) {
    // If it's an alias, use the main URL as canonical
    const canonicalPath = aliasInfo.tag === 'root' 
      ? `/${aliasInfo.main}/`
      : `/${aliasInfo.tag}/${aliasInfo.main}/`;
    return new URL(canonicalPath, site);
  }
  
  // If not an alias, use the current pathname as canonical
  return new URL(pathname, site);
}

export default urlAliases;
