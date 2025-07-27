# 🎨 10Botics Astro Project - Styling Guidelines

**Version**: 1.0  
**Last Updated**: 2025-01-25  
**Based on**: Original WordPress design analysis via Playwright

---

## 📋 Table of Contents

1. [Design Principles](#design-principles)
2. [Typography](#typography)
3. [Color Palette](#color-palette)
4. [Navigation & Header](#navigation--header)
5. [Component Guidelines](#component-guidelines)
6. [Layout Standards](#layout-standards)
7. [Responsive Design](#responsive-design)
8. [Content Guidelines](#content-guidelines)
9. [Do's and Don'ts](#dos-and-donts)

---

## 🎯 Design Principles

### **Core Philosophy**
- **Clean & Professional**: Maintain a professional educational appearance
- **Accessibility First**: Ensure content is accessible to all users
- **Consistent**: Use established patterns across all pages
- **Mobile-Friendly**: Design mobile-first, enhance for desktop

### **Visual Style**
- **Minimalist**: Clean white backgrounds with strategic use of color
- **Modern**: Contemporary design without being trendy
- **Educational**: Professional appearance suitable for schools and parents

---

## 📝 Typography

### **Font Stack**
```css
font-family: 'Noto Sans TC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### **Heading Hierarchy**
- **H1**: `text-4xl font-bold` (36px) - Page titles only
- **H2**: `text-3xl font-bold` (30px) - Section titles
- **H3**: `text-2xl font-semibold` (24px) - Subsection titles
- **H4**: `text-xl font-medium` (20px) - Component titles

### **Body Text**
- **Primary**: `text-base` (16px) - Main content
- **Secondary**: `text-sm` (14px) - Captions, metadata
- **Small**: `text-xs` (12px) - Fine print, labels

### **Font Weights**
- **Bold**: `font-bold` (700) - Main headings
- **Semibold**: `font-semibold` (600) - Sub-headings
- **Medium**: `font-medium` (500) - Important text
- **Normal**: `font-normal` (400) - Body text

---

## 🎨 Color Palette

### **Primary Colors**
```css
/* Based on original WordPress site analysis */
--primary-cyan: #00bcd4      /* Links, accents, CTAs */
--primary-dark: #1e293b      /* Main headings, text */
--primary-gray: #64748b      /* Secondary text */
--primary-light: #f8fafc     /* Background variations */
```

### **Semantic Colors**
```css
--success: #10b981          /* Success states */
--warning: #f59e0b          /* Warning states */
--error: #ef4444            /* Error states */
--info: #3b82f6             /* Information */
```

### **Grayscale**
```css
--gray-50: #f8fafc
--gray-100: #f1f5f9
--gray-200: #e2e8f0
--gray-300: #cbd5e1
--gray-600: #475569
--gray-700: #334155
--gray-800: #1e293b
--gray-900: #0f172a
```

### **Usage Guidelines**
- **Backgrounds**: Always use white (`bg-white`) as primary background
- **Links**: Use cyan (`text-cyan-400`) for all interactive links
- **Headings**: Use dark gray (`#1e293b`) for maximum readability
- **Body Text**: Use medium gray (`text-gray-700`) for optimal contrast

---

## 🧭 Navigation & Header

### **Header Rules**
- ❌ **NO EMOJIS** in header navigation items
- ❌ **NO EMOJIS** in breadcrumbs
- ✅ Use clean text-only navigation
- ✅ Maintain consistent link styling (`text-cyan-400`)

### **Breadcrumb Standards**
```html
<!-- ✅ Correct -->
<nav class="text-sm mb-6 text-gray-600">
  <a href="/" class="text-cyan-400">首頁</a>
  <span class="mx-2">»</span>
  <a href="/courses/" class="text-cyan-400">到校課程</a>
  <span class="mx-2">»</span>
  <span class="text-gray-800">課程名稱</span>
</nav>

<!-- ❌ Incorrect -->
<nav>🏠 首頁 » 📚 課程</nav>
```

### **Menu Structure**
- Keep menu items descriptive and professional
- Use proper Chinese typography
- Maintain consistent hierarchy
- Ensure mobile responsiveness

---

## 🧩 Component Guidelines

### **Course Components**

#### **CourseHero**
- Always include breadcrumbs
- Support both video and image options
- Tags should be visually distinct but not overwhelming
- Maintain consistent spacing (`py-8`)

#### **CourseFeatureGrid**
- Use 4-column grid on desktop (`lg:grid-cols-4`)
- Responsive: 2-column on tablet, 1-column on mobile
- Keep feature descriptions concise
- Use consistent image aspect ratios

#### **CourseHighlights**
- Support multiple icon types: `star`, `check`, `arrow`, `dot`
- Use 2-column layout on desktop for readability
- Maintain consistent spacing between items
- Keep highlight text scannable

#### **CourseContent (Accordion)**
- Use clean, minimal accordion design
- Ensure proper keyboard navigation
- Maintain consistent padding and spacing
- Support unlimited content items

### **Component Spacing**
```css
/* Standard section spacing */
.section-padding { @apply py-16; }

/* Container standards */
.container-standard { @apply container mx-auto px-4 max-w-6xl; }

/* Card spacing */
.card-padding { @apply p-6; }
```

---

## 📐 Layout Standards

### **Container Widths**
- **Full Width**: `container mx-auto px-4`
- **Content Width**: `max-w-6xl mx-auto`
- **Text Content**: `max-w-4xl mx-auto`
- **Narrow Content**: `max-w-2xl mx-auto`

### **Grid Systems**
```css
/* Feature grids */
grid-cols-1 md:grid-cols-2 lg:grid-cols-4

/* Content grids */
grid-cols-1 lg:grid-cols-2

/* Gallery grids */
grid-cols-2 md:grid-cols-3 lg:grid-cols-4
```

### **Spacing Scale**
- **Section spacing**: `py-16` (4rem top/bottom)
- **Component spacing**: `mb-12` (3rem bottom)
- **Element spacing**: `mb-8` (2rem bottom)
- **Small spacing**: `mb-4` (1rem bottom)

---

## 📱 Responsive Design

### **Breakpoints (Tailwind Default)**
```css
sm: 640px    /* Small tablets */
md: 768px    /* Tablets */
lg: 1024px   /* Laptops */
xl: 1280px   /* Desktops */
2xl: 1536px  /* Large desktops */
```

### **Mobile-First Approach**
```css
/* ✅ Correct: Mobile-first */
class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"

/* ❌ Incorrect: Desktop-first */
class="grid grid-cols-4 lg:grid-cols-2 md:grid-cols-1"
```

### **Content Stacking**
- Stack horizontally-laid content vertically on mobile
- Ensure touch targets are minimum 44px
- Test all interactions on mobile devices
- Prioritize content hierarchy on smaller screens

---

## 📄 Content Guidelines

### **Text Content**
- **Headings**: Keep concise and descriptive
- **Descriptions**: Aim for 1-2 sentences maximum
- **Lists**: Use bullet points for scanability
- **Links**: Make link text descriptive (avoid "click here")

### **Images**
- **Alt Text**: Always provide descriptive alt text
- **Aspect Ratios**: Maintain consistency within component types
- **File Formats**: Use WebP when possible, fallback to JPG/PNG
- **Sizes**: Optimize for web (max 1920px wide for hero images)

### **Video Content**
- Use YouTube embed IDs only
- Provide fallback poster images
- Ensure responsive iframe sizing
- Include proper ARIA labels

---

## ✅ Do's and Don'ts

### **✅ DO**
- Use clean, professional typography
- Maintain consistent spacing
- Follow the established color palette
- Write descriptive alt text for images
- Test on multiple devices
- Use semantic HTML elements
- Follow accessibility guidelines
- Keep component props consistent

### **❌ DON'T**
- Use emojis in navigation or breadcrumbs
- Mix different font weights unnecessarily
- Use custom colors outside the palette
- Create overly complex component hierarchies
- Forget mobile responsiveness
- Use non-semantic HTML elements
- Skip accessibility considerations
- Hardcode content that should be dynamic

---

## 🔧 Implementation Examples

### **Correct Component Usage**
```astro
<!-- ✅ Good: Clean, semantic, accessible -->
<CourseHero 
  title="人工智能編程課程"
  subtitle="探索AI技術的無限可能"
  description="專為中小學生設計的AI課程..."
  tags={["AI", "編程", "初中"]}
  videoId="dQw4w9WgXcQ"
/>
```

### **Correct Styling**
```astro
<!-- ✅ Good: Following guidelines -->
<h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">
  課程內容
</h2>
```

### **Incorrect Examples**
```astro
<!-- ❌ Bad: Emoji in heading -->
<h2>🚀 課程內容</h2>

<!-- ❌ Bad: Custom colors -->
<div class="bg-purple-500 text-pink-300">

<!-- ❌ Bad: Inconsistent spacing -->
<section class="py-3 mb-7">
```

---

## 📚 Resources

### **Tools**
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Astro Component Guide](https://docs.astro.build/en/core-concepts/astro-components/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### **Testing**
- Test components on multiple screen sizes
- Validate HTML semantics
- Check color contrast ratios
- Verify keyboard navigation
- Test with screen readers

---

**Note**: These guidelines are based on analysis of the original WordPress site using Playwright and should be followed consistently across all new components and pages. 