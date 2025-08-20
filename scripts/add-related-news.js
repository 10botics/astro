const fs = require('fs');
const path = require('path');

// List of course files to update (excluding special files)
const courseFiles = [
  'AI數碼動畫展.astro',
  'Blockchain 區塊鏈課程.astro',
  'CoDrone無人機課程.astro',
  'Delightex 遊戲設計課程.astro',
  'Dobot 智能機械手臂.astro',
  'Donkey Car 無人車課程.astro',
  'ksp太空計劃課程.astro',
  'Lego Spike Prime 機器人技術大師班.astro',
  'Microbit 降落傘課程.astro',
  'Microbit 逃出迷宮.astro',
  'Minecraft校園創建課程.astro',
  'Procreate數位藝術課程.astro',
  'Python 初階遊戲編程.astro',
  'raspberry-pi編程課程.astro',
  'Scratch遊戲設計課程.astro',
  'SwiftPlaygrounds編程課程.astro',
  'Tello 無人機課程.astro',
  'Unity 課程.astro',
  '人工智能遊戲編程課程.astro'
];

const courseDir = path.join(__dirname, '../src/pages/school-courses');

courseFiles.forEach(filename => {
  const filePath = path.join(courseDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${filename} - file does not exist`);
    return;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if RelatedNews is already imported
    if (content.includes('RelatedNews')) {
      console.log(`Skipping ${filename} - RelatedNews already present`);
      return;
    }
    
    // Add import for RelatedNews
    const importRegex = /(import ContactSection from '\.\.\/\.\.\/components\/ContactSection\.astro';)/;
    if (importRegex.test(content)) {
      content = content.replace(importRegex, '$1\nimport RelatedNews from \'../../components/course/RelatedNews.astro\';');
    } else {
      console.log(`Warning: Could not find ContactSection import in ${filename}`);
      return;
    }
    
    // Add RelatedNews component before ContactSection
    // Look for various patterns where ContactSection appears
    const patterns = [
      // Pattern 1: Simple case
      {
        search: /(\s*<!--\s*Contact\s*Section\s*-->\s*<ContactSection\s*\/>)/i,
        replace: '\n  <!-- Related News Section -->\n  <RelatedNews courseTags={courseData.tags} courseTitle={courseData.title} />\n\n$1'
      },
      // Pattern 2: ContactSection with props
      {
        search: /(\s*<!--\s*Contact\s*Section\s*-->\s*<ContactSection\s+[^>]*\/>)/i,
        replace: '\n  <!-- Related News Section -->\n  <RelatedNews courseTags={courseData.tags} courseTitle={courseData.title} />\n\n$1'
      },
      // Pattern 3: ContactSection in a section
      {
        search: /(\s*<!--\s*Contact\s*Section\s*-->\s*<section[^>]*>[\s\S]*?<ContactSection[^>]*\/>[\s\S]*?<\/section>)/i,
        replace: '\n  <!-- Related News Section -->\n  <RelatedNews courseTags={courseData.tags} courseTitle={courseData.title} />\n\n$1'
      },
      // Pattern 4: Just before any ContactSection usage
      {
        search: /(\s*<ContactSection[^>]*\/>)/,
        replace: '\n  <!-- Related News Section -->\n  <RelatedNews courseTags={courseData.tags} courseTitle={courseData.title} />\n\n$1'
      }
    ];
    
    let updated = false;
    for (const pattern of patterns) {
      if (pattern.search.test(content)) {
        content = content.replace(pattern.search, pattern.replace);
        updated = true;
        break;
      }
    }
    
    if (!updated) {
      console.log(`Warning: Could not find insertion point in ${filename}`);
      return;
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filename} successfully`);
    
  } catch (error) {
    console.error(`Error processing ${filename}:`, error.message);
  }
});

console.log('Finished processing all course files');
