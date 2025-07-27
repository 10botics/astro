# 📰 News Migration Strategy - 10botics.com to Astro

https://10botics.com/news/


## 🎯 **Migration Overview**
**Source:** 10botics.com WordPress news section  
**Target:** Astro static site with Content Collections  
**Approach:** Option B - Hybrid (Content Collections + Custom Pages)

---

## 📁 **File Structure Plan**

```
src/
├── content/
│   └── news/
│       ├── 2025-07-23-stem-teacher-workshop-st-simon.md
│       ├── 2025-07-22-donkey-car-raspberry-pi-training.md
│       ├── 2025-05-30-ai-parent-workshop-plk.md
│       ├── 2025-04-16-national-security-talk-shun-tak.md
│       └── 2025-03-31-national-security-talk-wu-siu-kui.md
├── pages/
│   └── news/
│       ├── index.astro (listing page with filtering)
│       └── [...slug].astro (dynamic article pages)
└── public/
    └── images/
        └── news/
            ├── 2025/
            │   ├── 07/
            │   │   ├── stem-workshop-teachers.jpg
            │   │   └── donkey-car-training.jpg
            │   ├── 05/
            │   │   └── ai-parent-workshop.jpg
            │   ├── 04/
            │   │   └── national-security-talk.jpg
            │   └── 03/
            │       └── jenny-li-lecture.jpg
            └── 2024/
                └── ...
```

---

## 🔗 **URL Structure**

### **Keep Exact WordPress Format:**
- `/news/2025/07/23/stem-teacher-workshop-st-simon/`
- `/news/2025/07/22/donkey-car-raspberry-pi-training/`
- `/news/2025/05/30/ai-parent-workshop-plk/`
- `/news/2025/04/16/national-security-talk-shun-tak/`
- `/news/2025/03/31/national-security-talk-wu-siu-kui/`

### **URL Mapping:**
- WordPress: `/science-handcraft-workshop-tko-primary/`
- Astro: `/news/2025/07/23/stem-teacher-workshop-st-simon/`

---

## 📄 **Content Schema**

```typescript
interface NewsArticle {
  title: string;           // Exact Chinese title from WordPress
  excerpt: string;         // Meta description
  publishDate: Date;       // YYYY-MM-DD format
  featuredImage: string;   // Path to main image
  category: "過往活動";     // Keep current category
  tags: string[];          // For filtering and SEO
  author: string;          // Jenny Li, etc.
  content: string;         // Full article content (markdown)
  images: string[];        // All inline images
  wpSlug: string;          // Original WordPress slug
  wpDate: string;          // Original date path (2025/07/23)
  readingTime: number;     // Estimated reading time
  isFeatured: boolean;     // For homepage display
}
```

---

## 🖼️ **Image Migration Strategy**

### **1. Image Organization**
- **Download all images** from WordPress URLs
- **Rename to descriptive names** (e.g., `stem-workshop-teachers.jpg`)
- **Organize by date**: `/public/images/news/2025/07/`
- **Update image paths** in markdown content

### **2. Image Processing**
- **Compress images** for web optimization
- **Convert to WebP** where possible
- **Generate multiple sizes** (thumbnail, medium, large)
- **Preserve alt text** and captions

### **3. Image Sources to Download**
- Featured images from article headers
- Inline images within article content
- Gallery images from workshops/events
- Author profile images

---

## 📝 **Migration Process**

### **Phase 1: Content Extraction**
1. **Extract article list** from `/news/` page
2. **Identify all article URLs** and metadata
3. **Download full content** via curl for each article
4. **Extract structured data** (title, excerpt, date, author)
5. **Download all images** from articles
6. **Optimize images** (WebP conversion, compression, responsive sizes)

### **Phase 2: Content Conversion**
1. **Convert HTML content** to markdown format
2. **Download and organize images**
3. **Create markdown files** with proper frontmatter
4. **Update image references** in content

### **Phase 3: Implementation**
1. **Create Content Collection schema**
2. **Build listing page** with category filtering
3. **Create dynamic routing** for individual articles
4. **Implement SEO features** (meta tags, structured data)

### **Phase 4: Testing & Optimization**
1. **Test all URLs** and redirects
2. **Validate SEO elements**
3. **Performance optimization**
4. **Content validation**

---

## 🎨 **Features to Implement**

### **Core Features**
- ✅ **Category filtering** (過往活動)
- ✅ **Search functionality** 
- ✅ **Pagination** (if needed)
- ✅ **Related articles** suggestions
- ✅ **Social sharing** buttons
- ✅ **Breadcrumb navigation**

### **SEO Features**
- ✅ **Meta tags** (title, description, keywords)
- ✅ **Open Graph tags** for social sharing
- ✅ **Structured data** (Article schema)
- ✅ **Canonical URLs**
- ✅ **News sitemap**

### **Performance Features**
- ✅ **Image optimization** and lazy loading
- ✅ **Content caching**
- ✅ **Fast page loads**
- ✅ **Mobile responsiveness**

---

## 🔍 **SEO Considerations**

### **Preserve Existing SEO**
- **Keep exact titles** and meta descriptions
- **Maintain keyword targeting**
- **Preserve internal linking structure**
- **Keep URL structure** for minimal disruption

### **Enhance SEO**
- **Generate canonical URLs** 
- **Add structured data** (Article schema)
- **Create news sitemap**
- **Optimize for Core Web Vitals**

### **Redirect Strategy**
- **301 redirects** from old WordPress URLs
- **Handle URL changes** gracefully
- **Preserve search rankings**

---

## 📊 **Content Inventory**

### **Articles to Migrate (2025)**
1. **2025-07-23**: STEM Teacher Workshop (聖公會將軍澳基德小學)
2. **2025-07-22**: Donkey Car AI Training (中學教師培訓)
3. **2025-05-30**: AI Parent Workshop (保良局方王錦全小學)
4. **2025-04-16**: National Security Talk (順德聯誼總會李金小學)
5. **2025-03-31**: National Security Talk (胡少渠紀念小學)
6. **2025-03-21**: Jenny Li Lecture (慈航學校)

### **Content Types**
- Workshop recaps and educational events
- School visit reports  
- Parent/teacher training sessions
- National security education talks
- AI and STEM education updates

---

## 🚀 **Implementation Timeline**

### **Week 1: Foundation**
- [ ] Set up Content Collection schema
- [ ] Create directory structure
- [ ] Extract first 3 articles

### **Week 2: Content Migration**
- [ ] Migrate remaining articles
- [ ] Download and organize images
- [ ] Create listing page

### **Week 3: Features & SEO**
- [ ] Implement search and filtering
- [ ] Add SEO optimization
- [ ] Test and validate

### **Week 4: Launch Preparation**
- [ ] Set up redirects
- [ ] Performance optimization
- [ ] Final testing and launch

---

## 📋 **Quality Checklist**

### **Content Quality**
- [ ] All text content preserved exactly
- [ ] Images downloaded and optimized
- [ ] Links updated and working
- [ ] Meta descriptions preserved

### **Technical Quality**
- [ ] All URLs working correctly
- [ ] SEO elements implemented
- [ ] Performance optimized
- [ ] Mobile responsive

### **User Experience**
- [ ] Navigation intuitive
- [ ] Search functionality working
- [ ] Related articles relevant
- [ ] Social sharing functional

---

## 🔧 **Tools & Resources**

### **Content Extraction**
- `curl` for downloading articles
- HTML to Markdown conversion
- Image downloading and optimization

### **Development**
- Astro Content Collections
- TypeScript for type safety
- Tailwind CSS for styling

### **SEO Tools**
- Google Search Console
- Yoast SEO (for reference)
- Structured data testing

---

**Last Updated:** January 2025  
**Status:** Planning Phase  
**Next Step:** Begin Phase 1 - Content Extraction 