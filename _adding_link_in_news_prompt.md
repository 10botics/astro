# SEO Internal Linking Prompt for News Articles

## Instructions
For SEO optimization, add internal links to school courses and competitions when they are **first mentioned in the content** (not in title, metaTitle, or description). This improves internal link structure and helps search engines understand content relationships.

## Link Mapping Rules

### School Courses - Link to specific course pages:
- **Donkey Car** → `/school-courses/Donkey%20Car%20無人車課程/`
- **Raspberry Pi** → `/school-courses/raspberry-pi編程課程/`
- **Python編程** → `/school-courses/Python%20初階遊戲編程/`
- **Scratch** → `/school-courses/Scratch遊戲設計課程/`
- **Scratch AI** → `/school-courses/Scratch%20人工智能編程/`
- **Unity** → `/school-courses/Unity%20課程/`
- **Minecraft** → `/school-courses/Minecraft校園創建課程/`
- **Tello無人機** → `/school-courses/Tello%20無人機課程/`
- **CoDrone** → `/school-courses/CoDrone無人機課程/`
- **Microbit** → `/school-courses/tag/microbit/`
- **Blockchain** → `/school-courses/Blockchain%20區塊鏈課程/`
- **AI數碼動畫** → `/school-courses/AI數碼動畫展/`
- **人工智能遊戲編程** → `/school-courses/人工智能遊戲編程課程/`
- **AI啟蒙** → `/school-courses/AI啟蒙與藝術創作課程/`
- **Dobot機械手臂** → `/school-courses/Dobot%20智能機械手臂/`
- **Lego Spike** → `/school-courses/Lego%20Spike%20Prime%20機器人技術大師班/`
- **Procreate** → `/school-courses/Procreate數位藝術課程/`
- **Swift Playgrounds** → `/school-courses/SwiftPlaygrounds編程課程/`
- **Delightex** → `/school-courses/Delightex%20遊戲設計課程/`
- **Apple Vision Pro** → `/school-courses/Apple%20Vision%20Pro%20遊戲開發課程/`
- **KSP太空計劃** → `/school-courses/ksp太空計劃課程/`
- **珊瑚環境監測** → `/school-courses/珊瑚環境監測入門課程/`
- **自然生物探究** → `/school-courses/自然生物探究手作課程/`

### General Terms - Link to courses index (ONLY when referring to specific courses/programs):
- **STEM課程** → `/school-courses/` (only when referring to STEM course offerings)
- **AI課程** → `/school-courses/tag/ai` (only when referring to AI course offerings)
- **編程課程** → `/school-courses/tag/programming` (only when referring to programming course offerings)
- **機器人課程** → `/school-courses/tag/robotics` (only when referring to robotics course offerings)
- **無人機課程** → `/school-courses/codrone` (only when referring to drone course offerings)
- **遊戲設計課程** → `/school-courses/tag/game-development` (only when referring to game design course offerings)
- **STEM Day** → `/stemday/` (only when referring to stemday)

### Competitions - Link to specific competition pages:
- **校際AI藝術創作大賽** → `/校際AI藝術創作大賽%202024/`
- **第三屆校際AI藝術創作大賽** → `/第三屆%20校際AI藝術創作大賽/`
- **學界無人機救援挑戰賽** → `/學界無人機救援挑戰賽/`
- **香港航天電競大賽** → `/香港航天電競大賽%202022/`
- **Minecraft校園創建計劃** → `/Minecraft%20校園創建計劃%202024/`
- **STEM比賽** → `/2025%20中小學%20STEM%20比賽清單/`
- **香港校際AI方程式** → `https://formula-ai.racing/`

## Implementation Rules

1. **First Mention Only**: Only link the **VERY FIRST occurrence** of each term in the content body. Once a term is linked, do NOT link it again anywhere else in the article
2. **Skip Title/Meta**: Do not link terms in title, metaTitle, or description
3. **Natural Flow**: Ensure links don't disrupt reading experience
4. **Relevant Context**: Only link when the term appears in relevant educational context
5. **URL Encoding**: Use proper URL encoding for Chinese characters (%20 for spaces, etc.)
6. **Context-Aware Linking**: Only link terms when they refer to specific courses, programs, or educational content
7. **Avoid Over-Linking**: Do not link every instance of generic terms like "AI", "Python", "STEM" - only when they specifically refer to courses or educational programs
8. **Meaningful Context**: Only add links when the term is used in a way that would benefit from linking to the specific course page
9. **One Link Per Term**: Each unique term should only be linked ONCE in the entire article, regardless of how many times it appears
10. **Exact Phrase Matching**: Only link when the EXACT phrase appears in the original text (e.g., "AI教育", "編程課程", "STEAM教育") - do NOT link standalone words like "AI" or "Python" unless they are part of a specific course name

## Example Usage

**Before:**
```
專為香港中學教師量身打造的「STEAM教育知識增益系列：在中學 STEAM教育中使用單板電腦作為教學工具應用人工智能技術設計與製作自動駕駛模型車」實戰工作坊圓滿落幕！讓本地中學老師深度探索 Raspberry Pi，結合 Python編程 與 Donkey Car開源平台的教學應用。
```

**After:**
```
專為香港中學教師量身打造的「[STEAM教育](/school-courses/)知識增益系列：在中學 STEAM教育中使用單板電腦作為教學工具應用[人工智能技術](/school-courses/人工智能遊戲編程課程/)設計與製作自動駕駛模型車」實戰工作坊圓滿落幕！讓本地中學老師深度探索 [Raspberry Pi](/school-courses/raspberry-pi編程課程/)，結合 [Python編程](/school-courses/Python%20初階遊戲編程/) 與 [Donkey Car](/school-courses/Donkey%20Car%20無人車課程/)開源平台的教學應用。
```

**❌ WRONG - Over-linking example:**
```
AI 是現代科技的重要組成部分，Python 編程語言在 AI 開發中扮演重要角色。STEM 教育需要整合 AI 和 Python 的學習。
```

**❌ WRONG - Linking standalone words:**
```
AI 是現代科技的重要組成部分，[Python](/school-courses/Python%20初階遊戲編程/) 編程語言在 [AI](/school-courses/) 開發中扮演重要角色。[STEM](/school-courses/) 教育需要整合 AI 和 Python 的學習。
```

**❌ WRONG - Multiple links to same term:**
```
[Raspberry Pi](/school-courses/raspberry-pi編程課程/) 是很好的教學工具。老師們學習如何使用 [Raspberry Pi](/school-courses/raspberry-pi編程課程/) 來教授編程。學生們都很喜歡 [Raspberry Pi](/school-courses/raspberry-pi編程課程/) 課程。
```

**✅ CORRECT - Context-aware linking with first occurrence only:**
```
[Raspberry Pi](/school-courses/raspberry-pi編程課程/) 是很好的教學工具。老師們學習如何使用 Raspberry Pi 來教授編程。學生們都很喜歡 Raspberry Pi 課程。
```

## Quality Checklist

- [ ] Only the **VERY FIRST occurrence** of each term is linked
- [ ] Each term is linked only ONCE in the entire article
- [ ] No links in title, metaTitle, or description
- [ ] Links point to correct course/competition pages
- [ ] URL encoding is correct for Chinese characters
- [ ] Reading flow remains natural
- [ ] Links are contextually appropriate (referring to specific courses/programs)
- [ ] No over-linking of generic terms like "AI", "Python", "STEM"
- [ ] Only link exact phrases that appear in the original text (e.g., "AI教育", "AI課程", "STEAM教育")
- [ ] Do NOT link standalone words like "AI" or "Python" unless they are part of a specific course name
- [ ] Links add value to the reader's understanding
- [ ] No keyword stuffing or unnatural linking patterns
- [ ] No multiple links to the same term throughout the article

## Notes

- Use this prompt when editing news articles to add SEO-optimized internal links
- Focus on educational relevance and user experience
- Maintain natural language flow while improving SEO structure
- Test links after implementation to ensure they work correctly
- **CRITICAL**: Only link terms when they specifically refer to courses, programs, or educational offerings
- **AVOID**: Linking every instance of generic terms like "AI", "Python", "STEM" - this creates poor user experience
- **EXACT MATCHING**: Only link when the EXACT phrase appears in the original text (e.g., "AI教育", "AI課程", "STEAM教育")
- **NO STANDALONE LINKS**: Do NOT link standalone words like "AI" or "Python" unless they are part of a specific course name
- **PRIORITIZE**: Context and meaning over keyword density
- **MOST IMPORTANT**: Each term should only be linked ONCE in the entire article - link only the very first occurrence
- **REMEMBER**: Once you link a term, do NOT link it again anywhere else in the same article
