# Adding New News Articles - Instructions and Guidelines

## File Structure and Naming Convention

### File Naming Pattern
Files should be named following this pattern:
```
YYYY-MM-DD-[descriptive-title-in-chinese].md
```
The date should be the date of edit
Examples:
- `2025-08-19-可立中學ai藝術創作stem-day精彩回顧.md`
- `2025-04-16-活動回顧10教育成功在順德聯誼總會李金小學舉辦國家安全講座.md`
- `2024-06-20-無人機初體驗寶血會嘉靈學校-無人機stem-day.md`

### File Location
All news articles should be placed in: `src/content/news/`

## Frontmatter Structure (YAML Header)

Every news article must start with the following frontmatter structure:

```yaml
---
title: "[Article Title in Chinese - can include emojis]"
publishDate: YYYY-MM-DD
featuredImage: "../../assets/images/news/[folder-name]/[image-file]"
category: "[Category Name]"
tags: ["Tag1", "Tag2", "Tag3", ...]
author: "[author-username]"
isFeatured: false
externalLink: "https://10botics.com/[url-path]/"
wpSlug: "[wordpress-slug]"
wpDate: "YYYY/MM/DD"
readingTime: [number]
---
```

### Field Descriptions

1. **title**: Article title in Chinese, can include emojis (🎨, 💡, 🚁, etc.)
2. **publishDate**: Date in YYYY-MM-DD format
3. **featuredImage**: Relative path to main image
4. **category**: Usually "過往活動" (Past Activities)
5. **tags**: Array of relevant tags (see tag guidelines below)
6. **author**: Author username (admin, jennyli, sukileung, etc.)
7. **isFeatured**: Boolean, usually false
8. **externalLink**: Full URL to corresponding page on 10botics.com
9. **wpSlug**: WordPress slug (usually matches filename without date)
10. **wpDate**: Date in YYYY/MM/DD format
11. **readingTime**: Estimated reading time in minutes

## Image Management

### Image Folder Structure
For each article, create a corresponding image folder:
```
src/assets/images/news/[article-date-and-title]/
├── image1.jpg (or .png, .jpeg)
├── image2.jpg
└── ...
```

### Featured Image
- Always include a featured image in the frontmatter
- Use relative path: `"../../assets/images/news/[folder]/[image]"`

### Images in Content
- Reference images using: `![](../../assets/images/news/[folder]/[image])`
- Add descriptive alt text when appropriate

## Tag Guidelines

### Common Tags by Category
(The tags should be included in [tag].astro)

**Education Level:**
- "小學" (Primary School)
- "初中" (Junior Secondary)
- "高中" (Senior Secondary) 
- "中學" (Secondary School)

**Activity Type:**
- "STEM Day"
- "AI教育" (AI Education)
- "AI 人工智能" (AI Artificial Intelligence)
- "教師工作坊" (Teacher Workshop)
- "家長講座" (Parent Seminar)
- "國家安全" (National Security)
- "過往活動" (Past Activities)

**Technology Focus:**
- "AI藝術創作" (AI Art Creation)
- "無人機" (Drone)
- "CoDrone"
- "Minecraft"
- "提示工程" (Prompt Engineering)
- "人工智能教育" (AI Education)
- "AI數碼動畫展" (AI Digital Animation)

**School Names:**
- Include specific school names when relevant (e.g., "可立中學", "寶血會嘉靈學校")

### Tag Selection Rules
- Use 3-6 tags per article
- Include education level if applicable
- Include main technology/topic
- Include activity type
- Include school name for school-specific events
- Use existing tags when possible for consistency

## Content Structure

### Opening
- Start with the featured image
- Include an engaging opening quote or statement
- Provide context about 10教育's involvement

### Main Sections
Use markdown headers (##) to organize content:
- `## 活動重點` (Activity Highlights)
- `## 教育意義` (Educational Significance)
- `## 學習成果` (Learning Outcomes)
- etc.

### Writing Style
- Use engaging, educational tone
- Include emojis appropriately (🎨, 💡, 🚁, 🤖, 🌟, etc.)
- Highlight key learning points with bullet points or bold text
- End with forward-looking statement about future collaboration

### Content Elements
- Include specific details about activities
- Mention participant numbers when available
- Highlight learning outcomes
- Include quotes from participants or teachers when possible
- Emphasize 10教育's role and expertise

## Common Author Names
- `admin`
- `jennyli`
- `sukileung`

## External Link Format
Links should follow this pattern:
`https://10botics.com/[category]/YYYY/MM/DD/[slug]/`

Examples:
- `https://10botics.com/past-activities/2025/08/19/ho-lap-college-ai-art-stem-day/`
- `https://10botics.com/2025/04/16/[encoded-chinese-title]/`

## Reading Time Guidelines
- 1 minute: ~150-200 words
- 2 minutes: ~300-400 words
- 3 minutes: ~450-600 words

## Quality Checklist

Before publishing, ensure:
- [ ] Filename follows YYYY-MM-DD-[title] format
- [ ] All frontmatter fields are properly filled
- [ ] Featured image exists and path is correct
- [ ] Tags are relevant and follow guidelines
- [ ] Content includes engaging opening and educational value
- [ ] Images are properly referenced
- [ ] Reading time estimate is reasonable
- [ ] External link is properly formatted
- [ ] Content promotes 10教育's educational mission

## Example Template

```markdown
---
title: "[Event Title] - [School Name] [Activity Type]"
publishDate: YYYY-MM-DD
featuredImage: "../../assets/images/news/YYYY-MM-DD-[slug]/image1.jpg"
category: "過往活動"
tags: ["[Primary Tag]", "[Education Level]", "[Technology]", "[School Name]"]
author: "[author-name]"
isFeatured: false
externalLink: "https://10botics.com/[category]/YYYY/MM/DD/[slug]/"
wpSlug: "[descriptive-slug]"
wpDate: "YYYY/MM/DD"
readingTime: [estimate]
---

![](../../assets/images/news/YYYY-MM-DD-[slug]/image1.jpg)

「[Engaging opening quote]」

[Opening paragraph describing 10教育's involvement and event context]

## 活動重點

[Main activity description with specific details]

## 教育意義

[Educational value and learning outcomes]

[Closing paragraph about future collaboration and 10教育's mission]
```
