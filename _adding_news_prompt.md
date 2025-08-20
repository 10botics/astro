# Adding New News Articles - Instructions and Guidelines

## File Structure and Naming Convention

### File Naming Pattern
Files should be named following this pattern:
```
YYYY-MM-DD-[descriptive-title-in-chinese].md
```
The date should be the date of edit
Examples:
- `2025-07-19-可立中學ai藝術創作stem-day精彩回顧.md`
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

### 🚨 CRITICAL: Image File Existence Rule
**NEVER reference images that don't physically exist in the assets folder!**
This will cause build failures and must be avoided at all costs.

### Image Folder Structure
For each article, create a corresponding image folder:
```
src/assets/images/news/[article-date-and-title]/
├── featured.jpg (or .png, .jpeg) - REQUIRED
├── image1.jpg (optional)
├── image2.jpg (optional)
└── ...
```

### Featured Image Requirements
- **MANDATORY**: Always include a featured image in the frontmatter
- **VERIFICATION**: Ensure the featured image file actually exists before referencing
- Use relative path: `"../../assets/images/news/[folder]/[image-file]"`
- Recommended naming: `featured.jpg`, `featured.png`, or `featured.jpeg`

### Images in Content
- **EXISTENCE CHECK**: Verify every image file exists before adding markdown references
- Reference images using: `![](../../assets/images/news/[folder]/[image])`
- Add descriptive alt text when appropriate
- **RULE**: Only reference images that are physically present in the assets folder

### Image Management Best Practices
1. **Create the image folder first** before writing the markdown file
2. **Upload all images** to the assets folder before adding references
3. **Use consistent naming**: `featured.jpg` for main image, `image1.jpg`, `image2.jpg` for additional images
4. **Verify paths**: Double-check that the path in frontmatter matches the actual file location
5. **Test locally**: Run `npm run build` locally to catch image reference errors before deployment

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

## 🔧 Build Troubleshooting

### Common Build Errors and Solutions

#### Image Not Found Errors
**Error**: `ImageNotFound: Could not find requested image ../../assets/images/news/[...]/image1.jpg`

**Solutions**:
1. **Check file existence**: Verify the image file actually exists in the specified path
2. **Check file naming**: Ensure the filename in markdown matches the actual file (case-sensitive)
3. **Clear cache**: Delete `.astro` folder and run `npm run build` again
4. **Check path**: Verify the relative path is correct (`../../assets/images/news/[folder]/[file]`)

#### Prevention Steps
1. Always create the assets folder structure first
2. Upload images before writing markdown
3. Use consistent naming conventions
4. Test build locally before committing

## 📋 Recommended Workflow

### Step-by-Step Process to Avoid Image Issues

1. **Plan the Article**
   - Decide on the article title and date
   - Determine what images you'll need

2. **Create Directory Structure FIRST**
   ```bash
   mkdir "src/assets/images/news/YYYY-MM-DD-[article-title]"
   ```

3. **Upload Images to Assets Folder**
   - Place all images in the created directory
   - Use consistent naming: `featured.jpg`, `image1.jpg`, `image2.jpg`, etc.
   - Verify files are actually saved (not just planned)

4. **Create Markdown File**
   - Create the `.md` file in `src/content/news/`
   - Add frontmatter with correct image paths
   - Only reference images that exist in step 3

5. **Verify Image References**
   - Double-check that featuredImage path matches actual file
   - Ensure all `![](...)` references point to existing files
   - Check spelling and case sensitivity

6. **Local Build Test**
   ```bash
   npm run build
   ```
   - If build fails with image errors, fix before proceeding
   - Never commit if local build fails

7. **Final Check**
   - Review the generated output
   - Ensure all images display correctly
   - Commit only after successful build

## Quality Checklist

Before publishing, ensure:
- [ ] Filename follows YYYY-MM-DD-[title] format
- [ ] All frontmatter fields are properly filled
- [ ] **🚨 CRITICAL**: All referenced images physically exist in assets folder
- [ ] **🚨 CRITICAL**: Image paths in frontmatter and content are correct
- [ ] Featured image exists and path is correct
- [ ] Tags are relevant and follow guidelines
- [ ] Content includes engaging opening and educational value
- [ ] All images are properly referenced (not just featured image)
- [ ] Reading time estimate is reasonable
- [ ] External link is properly formatted
- [ ] Content promotes 10教育's educational mission
- [ ] **🚨 CRITICAL**: Local build test passes (`npm run build`)
- [ ] No console errors related to missing assets

## Example Template

```markdown
---
title: "[Event Title] - [School Name] [Activity Type]"
publishDate: YYYY-MM-DD
featuredImage: "../../assets/images/news/YYYY-MM-DD-[slug]/featured.jpg"
category: "過往活動"
tags: ["[Primary Tag]", "[Education Level]", "[Technology]", "[School Name]"]
author: "[author-name]"
isFeatured: false
externalLink: "https://10botics.com/[category]/YYYY/MM/DD/[slug]/"
wpSlug: "[descriptive-slug]"
wpDate: "YYYY/MM/DD"
readingTime: [estimate]
---

![](../../assets/images/news/YYYY-MM-DD-[slug]/featured.jpg)

「[Engaging opening quote]」

[Opening paragraph describing 10教育's involvement and event context]

## 活動重點

[Main activity description with specific details]

## 教育意義

[Educational value and learning outcomes]

[Closing paragraph about future collaboration and 10教育's mission]
```

## 🚨 FINAL REMINDER

**Before creating any news article:**

1. ✅ Create the image folder: `src/assets/images/news/YYYY-MM-DD-[title]/`
2. ✅ Upload the `featured.jpg` (and any other images) to this folder
3. ✅ Verify files exist using file explorer
4. ✅ Create the markdown file with correct image paths
5. ✅ Run `npm run build` locally to test
6. ✅ Only commit if build succeeds

**The #1 cause of build failures is referencing non-existent images. Always verify image files exist before referencing them!**
