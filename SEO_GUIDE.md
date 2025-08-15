# 📈 SEO Guide for 10教育 Astro Project

## 🎯 Overview

This guide explains how to optimize your 10教育 website for search engines. We've implemented a comprehensive SEO foundation that will help improve your Google rankings and social media sharing.

## ✅ What's Already Implemented

### 1. **Core SEO Foundation**
- ✅ **Site URL Configuration** (`astro.config.mjs`)
- ✅ **Canonical URLs** - prevents duplicate content issues
- ✅ **Robots Meta Tags** - controls how search engines crawl your pages
- ✅ **Enhanced Layout.astro** with comprehensive meta tags

### 2. **Social Media Optimization**
- ✅ **Open Graph Tags** - optimized Facebook/LinkedIn sharing
- ✅ **Default OG Images** - automatic social media previews
- ✅ **Locale Settings** - properly configured for Hong Kong

### 3. **Structured Data**
- ✅ **Organization Schema** - helps Google understand your business
- ✅ **JSON-LD Format** - modern structured data implementation

### 4. **Performance SEO**
- ✅ **DNS Prefetch** - faster loading of external resources
- ✅ **Sitemap Generation** - automatic XML sitemap
- ✅ **Preconnect Hints** - optimized font loading

---

## 🛠️ How to Use Enhanced Layout.astro

### Basic Usage (Most Pages)
```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="頁面標題 - 10教育">
  <!-- Your page content -->
</Layout>
```

### Advanced Usage (Custom SEO)
```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout 
  title="Scratch 人工智能編程 - 10教育"
  description="學習使用 Scratch 和 AI 技術創建智能應用程式，適合初中及高小學生的專業課程。"
  keywords="Scratch, AI編程, 人工智能課程, 兒童編程"
  ogImage="/images/scratch-ai-course.jpg"
>
  <!-- Your page content -->
</Layout>
```

### Available Props
| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `title` | string | **Required** | Page title (appears in browser tab & search results) |
| `description` | string | Default site description | Meta description for search results |
| `ogImage` | string | `/images/og-default.jpg` | Social media preview image |
| `keywords` | string | Default site keywords | Keywords for search engines |
| `robots` | string | `index, follow, max-image-preview:large` | Search engine crawling instructions |

---

## 📊 SEO Best Practices by Page Type

### 🏠 **Homepage**
```astro
<Layout 
  title="10教育 - 專業STEM及人工智能課程"
  description="香港領先的STEM教育機構，提供AI人工智能、機器人技術、編程課程到校服務。專業導師團隊，創新教學方法。"
  keywords="STEM教育, AI課程, 人工智能, 機器人課程, 編程教育, 到校服務, 香港"
  ogImage="/images/homepage-hero.jpg"
>
```

### 📚 **Course Pages**
```astro
<Layout 
  title="Scratch 人工智能編程 - 10教育課程"
  description="透過 Teachable Machine 和 Scratch 學習AI編程，適合初中高小學生。10小時完整課程，專業導師指導。"
  keywords="Scratch AI, 人工智能編程, Teachable Machine, 兒童編程課程"
  ogImage="/images/courses/scratch-ai-hero.jpg"
>
```

### 📄 **Course Index/Listing Pages**
```astro
<Layout 
  title="課程總覽 - 10教育STEM課程"
  description="瀏覽我們完整的STEM及AI課程，包括Scratch編程、機器人技術、Arduino等專業到校課程。"
  keywords="STEM課程總覽, AI課程列表, 編程課程, 機器人課程"
>
```

### ℹ️ **About/Contact Pages**
```astro
<Layout 
  title="關於我們 - 10教育專業STEM團隊"
  description="了解10教育的專業STEM導師團隊、教學理念及服務範圍。致力於為香港學生提供優質科技教育。"
  keywords="10教育團隊, STEM導師, 教學理念, 科技教育"
>
```

---

## 🎨 Image SEO Guidelines

### **OG Image Specifications**
- **Size**: 1200×630 pixels (Facebook recommended)
- **Format**: JPG or PNG
- **File size**: Under 1MB
- **Location**: Store in `/public/images/og/`

### **Naming Convention**
```
/public/images/og/
├── homepage.jpg              # Homepage OG image
├── courses/
│   ├── scratch-ai.jpg       # Course-specific images
│   ├── arduino.jpg
│   └── robotics.jpg
├── about.jpg                # About page
└── default.jpg              # Fallback image
```

### **Creating OG Images**
Each OG image should include:
- 📝 Course/page title in Chinese
- 🏢 10教育 logo
- 🎨 Relevant course imagery
- 📱 Mobile-friendly text size

---

## 🔍 Title & Description Writing Guide

### **Title Tag Best Practices**
- ✅ **50-60 characters max** (desktop display limit)
- ✅ **Include target keyword** at the beginning
- ✅ **End with brand name**: "頁面標題 - 10教育"
- ✅ **Be descriptive and unique** for each page
- ❌ **Avoid keyword stuffing**
- ❌ **Don't use ALL CAPS**

### **Meta Description Best Practices**
- ✅ **140-160 characters max**
- ✅ **Include target keywords naturally**
- ✅ **Write compelling copy** that encourages clicks
- ✅ **Include call-to-action** when appropriate
- ✅ **Accurately describe page content**
- ❌ **Don't duplicate across pages**

### **Examples**

#### ✅ Good Title & Description
```
Title: "Scratch AI 人工智能編程課程 - 10教育"
Description: "學習使用 Teachable Machine 訓練AI模型，結合Scratch創建智能應用。適合初中高小學生，10小時專業課程。立即報名！"
```

#### ❌ Poor Title & Description
```
Title: "Course - 10教育課程頁面"
Description: "這是一個課程頁面，包含課程資訊。"
```

---

## 🧪 Testing Your SEO

### **1. View Page Source**
Right-click any page → "View Page Source" and check for:
- `<link rel="canonical" href="...">` 
- `<meta property="og:title" content="...">` 
- `<script type="application/ld+json">` with structured data

### **2. Google Rich Results Test**
- Visit: https://search.google.com/test/rich-results
- Enter your page URL
- Check for structured data validation

### **3. Facebook Sharing Debugger**
- Visit: https://developers.facebook.com/tools/debug/
- Enter your page URL
- Preview how your page appears when shared

### **4. Local Testing Commands**
```bash
# Check meta tags in terminal
curl -s http://localhost:4321/ | grep -E "(title|description|canonical|og:)"

# View all meta tags
curl -s http://localhost:4321/ | grep -E "<meta|<title|<link.*canonical"
```

---

## 🚀 Future SEO Improvements

### **Phase 1: Content Optimization** 
- [ ] Add FAQ schema to course pages
- [ ] Implement breadcrumb navigation
- [ ] Create course completion certificates schema
- [ ] Add instructor/author schema

### **Phase 2: Technical SEO**
- [ ] Implement proper heading hierarchy (H1-H6)
- [ ] Add internal linking strategy
- [ ] Optimize Core Web Vitals
- [ ] Add XML sitemap with last modified dates

### **Phase 3: Content Marketing**
- [ ] Create educational blog content
- [ ] Implement blog post schema
- [ ] Add course reviews/testimonials schema
- [ ] Create video course previews with VideoObject schema

---

## ⚠️ Common SEO Mistakes to Avoid

### **❌ Don't Do This:**
1. **Duplicate titles** across multiple pages
2. **Keyword stuffing** in meta tags
3. **Missing meta descriptions** on important pages
4. **Using generic titles** like "首頁" or "關於我們"
5. **Forgetting to update OG images** for new content
6. **Inconsistent brand naming** across pages

### **✅ Do This Instead:**
1. **Unique, descriptive titles** for each page
2. **Natural keyword usage** in content and meta tags
3. **Compelling meta descriptions** that encourage clicks
4. **Specific, benefit-focused titles**
5. **Custom OG images** for important pages
6. **Consistent "10教育" branding**

---

## 📞 When You Need Help

### **Quick Wins You Can Do:**
- Update page titles and descriptions
- Add custom OG images
- Write compelling meta descriptions
- Test social sharing previews

### **When to Get Technical Help:**
- Adding new schema types
- Implementing advanced structured data
- Core Web Vitals optimization
- Complex internal linking strategies

---

## 📚 Useful Resources

- **Google Search Console**: https://search.google.com/search-console
- **Meta Tags Analyzer**: https://metatags.io/
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Schema.org Documentation**: https://schema.org/
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/

---

*Last updated: July 2025*  
*For questions about this guide, consult your development team.* 