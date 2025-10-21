# Tailwind Theme - Quick Reference

## 🎨 Colors

```html
<!-- Brand Colors -->
<div class="bg-brand-cyan-600">Cyan</div>
<div class="bg-brand-blue-600">Blue</div>
<div class="text-brand-cyan-600">Cyan Text</div>

<!-- Gradients -->
<button class="btn-gradient">Gradient Button</button>

<!-- Semantic -->
<div class="text-semantic-success">Success</div>
<div class="text-semantic-warning">Warning</div>
<div class="text-semantic-error">Error</div>
```

---

## 📐 Layout

```html
<!-- Containers -->
<div class="container-standard">Standard Container (1200px)</div>
<div class="container-narrow">Narrow Container (800px)</div>

<!-- Section Spacing -->
<section class="section-padding">Standard (4rem)</section>
<section class="section-padding-sm">Small (3rem)</section>
<section class="section-padding-lg">Large (6rem)</section>
```

---

## 🎯 Components

### Cards
```html
<!-- Basic Card -->
<div class="card-base">
  <img src="image.jpg" class="w-full h-48 object-cover" />
  <div class="p-6">
    <h3 class="text-lg font-semibold">Title</h3>
    <p class="text-gray-600">Description</p>
  </div>
</div>

<!-- Card with Hover -->
<div class="card-base card-hover">
  <!-- Content -->
</div>
```

### Buttons
```html
<!-- Primary Button -->
<button class="btn-primary">Click Me</button>

<!-- Gradient Button -->
<button class="btn-primary btn-gradient">
  <svg class="w-5 h-5 mr-2"><!-- icon --></svg>
  Download
</button>
```

---

## 📱 Grids

```html
<!-- Feature Grid (1-2-4 columns) -->
<div class="feature-grid">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>

<!-- Content Grid (1-2 columns) -->
<div class="content-grid">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

<!-- Responsive Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Auto-fit Grid -->
<div class="grid-auto-fit">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

---

## ✍️ Typography

```html
<!-- Headings -->
<h1 class="text-4xl md:text-5xl font-bold text-gray-900">Page Title</h1>
<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Section Title</h2>
<h3 class="text-2xl font-semibold text-gray-900 mb-4">Subsection</h3>
<h4 class="text-xl font-medium text-gray-800">Component Title</h4>

<!-- Body Text -->
<p class="text-base text-gray-700">Regular text</p>
<p class="text-sm text-gray-600">Small text</p>
<p class="text-lg md:text-xl text-gray-700">Lead text</p>

<!-- Links -->
<a class="text-brand-cyan-600 hover:text-brand-cyan-700">Link</a>
<a class="text-gray-900 hover:text-cyan-600 hover:underline">Hover Link</a>
```

---

## 🎬 Common Patterns

### Full Section
```html
<section class="section-padding bg-gray-50">
  <div class="container-standard">
    <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
      Section Title
    </h2>
    <p class="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
      Description text
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Content -->
    </div>
  </div>
</section>
```

### Hero Section
```html
<section class="relative h-[60vh] min-h-[400px] overflow-hidden">
  <div class="relative w-full h-full">
    <img src="hero.jpg" class="w-full h-full object-cover" />
    <div class="hero-overlay">
      <div class="container-standard text-center text-white">
        <h1 class="text-5xl md:text-6xl font-bold mb-4">Title</h1>
        <p class="text-xl md:text-2xl max-w-3xl mx-auto mb-8">Description</p>
        <button class="btn-primary btn-gradient">CTA Button</button>
      </div>
    </div>
  </div>
</section>
```

### Card Grid
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  <div class="card-base card-hover">
    <img src="image.jpg" alt="Title" class="w-full h-48 object-cover" />
    <div class="p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Card Title</h3>
      <p class="text-gray-600 mb-4">Card description</p>
      <a href="#" class="text-brand-cyan-600 hover:text-brand-cyan-700 font-medium">
        Learn More →
      </a>
    </div>
  </div>
</div>
```

### Feature Cards
```html
<div class="feature-grid">
  <div class="text-center p-8 rounded-xl shadow-card hover:-translate-y-2 transition-transform">
    <div class="text-5xl text-brand-cyan-600 mb-6">
      <i class="fas fa-icon"></i>
    </div>
    <h3 class="text-xl font-semibold text-gray-900 mb-4">Feature Title</h3>
    <p class="text-gray-700 leading-relaxed">Feature description text</p>
  </div>
</div>
```

---

## 🎨 Background Colors

```html
<!-- Alternating sections -->
<section class="section-padding bg-white">...</section>
<section class="section-padding bg-gray-50">...</section>
<section class="section-padding bg-white">...</section>
```

---

## 📊 Spacing Scale

| Class | Value | Use Case |
|-------|-------|----------|
| `mb-4` | 1rem | Small gaps |
| `mb-6` | 1.5rem | Medium gaps |
| `mb-8` | 2rem | Component spacing |
| `mb-12` | 3rem | Section spacing |
| `gap-4` | 1rem | Tight grid |
| `gap-6` | 1.5rem | Medium grid |
| `gap-8` | 2rem | Standard grid |

---

## 🎯 Responsive Breakpoints

| Breakpoint | Size | Example |
|------------|------|---------|
| `sm:` | 640px | `sm:text-lg` |
| `md:` | 768px | `md:grid-cols-2` |
| `lg:` | 1024px | `lg:grid-cols-3` |
| `xl:` | 1280px | `xl:text-4xl` |

---

## ✨ Animations

```html
<!-- Fade In -->
<div class="animate-fade-in">Fades in</div>

<!-- Slide Up -->
<div class="animate-slide-up">Slides up</div>

<!-- Slide Down -->
<div class="animate-slide-down">Slides down</div>

<!-- Hover Effects -->
<div class="transition-transform hover:-translate-y-2">Lifts on hover</div>
<div class="transition-colors hover:text-brand-cyan-600">Color change</div>
```

---

## 🔧 Custom Shadows

```html
<div class="shadow-soft">Soft shadow</div>
<div class="shadow-card">Card shadow</div>
<div class="shadow-card-hover">Hover shadow</div>
<div class="shadow-hero">Hero shadow</div>
```

---

## 📋 Cheat Sheet

### Section Template
```html
<section class="section-padding [bg-white|bg-gray-50]">
  <div class="container-standard">
    <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
      Title
    </h2>
    <p class="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
      Description
    </p>
    <!-- Content -->
  </div>
</section>
```

### Card Template
```html
<div class="card-base card-hover">
  <img src="" alt="" class="w-full h-48 object-cover" />
  <div class="p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-2">Title</h3>
    <p class="text-gray-600 mb-4">Description</p>
    <a href="#" class="text-brand-cyan-600 hover:text-brand-cyan-700">
      Link →
    </a>
  </div>
</div>
```

---

## 📚 Resources

- Full Guide: [TAILWIND_THEME_GUIDE.md](./TAILWIND_THEME_GUIDE.md)
- Migration Summary: [THEME_MIGRATION_SUMMARY.md](./THEME_MIGRATION_SUMMARY.md)
- Styling Guidelines: [STYLING_GUIDELINES.md](./STYLING_GUIDELINES.md)
- Tailwind Docs: https://tailwindcss.com/docs

