# Tailwind Theme Guide

## Overview

This project now uses a comprehensive Tailwind CSS theme system that provides:
- Consistent colors, spacing, and typography
- Reusable utility classes for common patterns
- Responsive design utilities
- Custom component classes

## Table of Contents

1. [Colors](#colors)
2. [Typography](#typography)
3. [Spacing](#spacing)
4. [Component Classes](#component-classes)
5. [Layout Utilities](#layout-utilities)
6. [Best Practices](#best-practices)

---

## Colors

### Brand Colors

Use these for primary branding elements:

```html
<!-- Cyan (Primary) -->
<div class="bg-brand-cyan-500 text-white">Primary Button</div>
<a class="text-brand-cyan-600 hover:text-brand-cyan-700">Link</a>

<!-- Blue (Secondary) -->
<div class="bg-brand-blue-600 text-white">Secondary Button</div>

<!-- Gradients -->
<button class="btn-gradient">Gradient Button</button>
```

### Semantic Colors

Use for status indicators and feedback:

```html
<!-- Success -->
<div class="bg-semantic-success text-white">Success Message</div>

<!-- Warning -->
<div class="bg-semantic-warning text-white">Warning</div>

<!-- Error -->
<div class="bg-semantic-error text-white">Error</div>

<!-- Info -->
<div class="bg-semantic-info text-white">Information</div>
```

---

## Typography

### Font Family

The default font is automatically applied to all elements:
- **Noto Sans TC** for Chinese characters
- System fonts as fallbacks

### Heading Styles

```html
<!-- H1 - Page Title -->
<h1 class="text-4xl md:text-5xl font-bold text-gray-900">
  Page Title
</h1>

<!-- H2 - Section Title -->
<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
  Section Title
</h2>

<!-- H3 - Subsection -->
<h3 class="text-2xl font-semibold text-gray-900 mb-4">
  Subsection
</h3>

<!-- H4 - Component Title -->
<h4 class="text-xl font-medium text-gray-800">
  Component Title
</h4>
```

### Body Text

```html
<!-- Primary text -->
<p class="text-base text-gray-700">Regular paragraph text</p>

<!-- Secondary text -->
<p class="text-sm text-gray-600">Secondary information</p>

<!-- Lead text (larger) -->
<p class="text-lg md:text-xl text-gray-700">Lead paragraph</p>
```

---

## Spacing

### Section Padding

Use these classes for consistent section spacing:

```html
<!-- Standard section padding (4rem = 64px) -->
<section class="section-padding bg-white">
  <!-- Content -->
</section>

<!-- Small section padding (3rem = 48px) -->
<section class="section-padding-sm bg-gray-50">
  <!-- Content -->
</section>

<!-- Large section padding (6rem = 96px) -->
<section class="section-padding-lg bg-white">
  <!-- Content -->
</section>
```

### Margin Utilities

```html
<!-- Bottom margin for sections -->
<div class="mb-12">Section</div>

<!-- Bottom margin for components -->
<div class="mb-8">Component</div>

<!-- Bottom margin for elements -->
<div class="mb-4">Element</div>
```

---

## Component Classes

### Cards

```html
<!-- Basic card -->
<div class="card-base">
  <img src="image.jpg" class="w-full h-48 object-cover" />
  <div class="p-6">
    <h3 class="text-lg font-semibold mb-2">Card Title</h3>
    <p class="text-gray-600">Card content</p>
  </div>
</div>

<!-- Card with hover effect -->
<div class="card-base card-hover">
  <!-- Content -->
</div>
```

### Buttons

```html
<!-- Primary button -->
<button class="btn-primary">
  Click Me
</button>

<!-- Gradient button -->
<button class="btn-primary btn-gradient">
  <svg class="w-5 h-5 mr-2"><!-- icon --></svg>
  Download
</button>

<!-- Custom button (manual classes) -->
<button class="inline-flex items-center px-6 py-3 bg-brand-cyan-600 text-white font-semibold rounded-lg hover:bg-brand-cyan-700 transition-all">
  Custom Button
</button>
```

### Hero Sections

```html
<section class="relative h-[60vh] min-h-[400px] overflow-hidden">
  <div class="relative w-full h-full">
    <img src="hero.jpg" class="w-full h-full object-cover" />
    <div class="hero-overlay">
      <div class="container-standard text-center text-white">
        <h1 class="text-5xl md:text-6xl font-bold mb-4">Hero Title</h1>
        <p class="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
          Hero description text
        </p>
        <button class="btn-primary btn-gradient">
          Call to Action
        </button>
      </div>
    </div>
  </div>
</section>
```

---

## Layout Utilities

### Containers

```html
<!-- Standard container (max-width: 1200px) -->
<div class="container-standard">
  <!-- Content -->
</div>

<!-- Narrow container (max-width: 800px) -->
<div class="container-narrow">
  <!-- Content for reading -->
</div>

<!-- Full-width container with Tailwind defaults -->
<div class="container mx-auto px-4">
  <!-- Content -->
</div>
```

### Grids

```html
<!-- Feature grid (1-2-4 columns) -->
<div class="feature-grid">
  <div>Feature 1</div>
  <div>Feature 2</div>
  <div>Feature 3</div>
  <div>Feature 4</div>
</div>

<!-- Content grid (1-2 columns) -->
<div class="content-grid">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

<!-- Auto-fit grid (fills available space) -->
<div class="grid-auto-fit">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Manual responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

---

## Best Practices

### 1. Use Semantic HTML

```html
<!-- ✅ Good -->
<article class="card-base">
  <header>
    <h2 class="text-2xl font-bold">Article Title</h2>
  </header>
  <p>Content</p>
</article>

<!-- ❌ Avoid -->
<div class="card-base">
  <div class="text-2xl font-bold">Article Title</div>
  <div>Content</div>
</div>
```

### 2. Mobile-First Responsive Design

```html
<!-- ✅ Good: Mobile-first approach -->
<div class="text-base md:text-lg lg:text-xl">
  Responsive text
</div>

<!-- ❌ Avoid: Desktop-first -->
<div class="text-xl lg:text-lg md:text-base">
  Not mobile-first
</div>
```

### 3. Consistent Spacing

```html
<!-- ✅ Good: Using theme spacing -->
<section class="section-padding bg-white">
  <div class="container-standard">
    <h2 class="text-3xl font-bold mb-8">Title</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Content -->
    </div>
  </div>
</section>

<!-- ❌ Avoid: Custom inconsistent spacing -->
<section class="py-7 bg-white">
  <div class="mx-auto px-3 max-w-[1150px]">
    <h2 class="text-3xl font-bold mb-5">Title</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Content -->
    </div>
  </div>
</section>
```

### 4. Color Usage

```html
<!-- ✅ Good: Using theme colors -->
<div class="bg-gray-50 text-gray-900">
  <a href="#" class="text-brand-cyan-600 hover:text-brand-cyan-700">Link</a>
</div>

<!-- ❌ Avoid: Custom colors -->
<div class="bg-[#f5f5f5] text-[#1a1a1a]">
  <a href="#" class="text-[#00bbdd] hover:text-[#0099bb]">Link</a>
</div>
```

### 5. Component Reusability

```html
<!-- ✅ Good: Using component classes -->
<div class="card-base card-hover">
  <img src="image.jpg" class="w-full h-48 object-cover" />
  <div class="p-6">
    <h3 class="text-lg font-semibold">Card Title</h3>
  </div>
</div>

<!-- ❌ Avoid: Repeating styles -->
<div class="bg-white rounded-lg shadow-card overflow-hidden transition-all hover:transform hover:-translate-y-1 hover:shadow-card-hover">
  <img src="image.jpg" class="w-full h-48 object-cover" />
  <div class="p-6">
    <h3 class="text-lg font-semibold">Card Title</h3>
  </div>
</div>
```

---

## Common Patterns

### Section with Title and Grid

```html
<section class="section-padding bg-gray-50">
  <div class="container-standard">
    <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
      Section Title
    </h2>
    <p class="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
      Section description
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Grid items -->
    </div>
  </div>
</section>
```

### Card Grid with Hover Effects

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  <div class="card-base card-hover">
    <img src="image.jpg" alt="Description" class="w-full h-48 object-cover" />
    <div class="p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Card Title</h3>
      <p class="text-gray-600 mb-4">Card description text</p>
      <a href="#" class="text-brand-cyan-600 hover:text-brand-cyan-700 font-medium">
        Learn More →
      </a>
    </div>
  </div>
</div>
```

### Feature Section

```html
<section class="section-padding bg-white">
  <div class="container-standard">
    <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
      Features
    </h2>
    <div class="feature-grid">
      <div class="text-center p-8 rounded-xl shadow-card">
        <div class="text-5xl text-brand-cyan-600 mb-6">
          <i class="fas fa-icon"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Feature Title</h3>
        <p class="text-gray-700 leading-relaxed">Feature description</p>
      </div>
    </div>
  </div>
</section>
```

---

## Migration Guide

### Converting Inline CSS to Tailwind

#### Before (Inline CSS):
```html
<style>
  .my-section {
    padding: 4rem 0;
    background: #f8f9fa;
  }
  
  .my-card {
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>

<section class="my-section">
  <div class="my-card">Content</div>
</section>
```

#### After (Tailwind):
```html
<section class="section-padding bg-gray-50">
  <div class="card-base">Content</div>
</section>
```

---

## Customization

### Adding New Theme Colors

Edit `tailwind.config.cjs`:

```js
colors: {
  brand: {
    custom: {
      500: '#yourcolor',
      600: '#yourdarkercolor',
    }
  }
}
```

### Adding New Component Classes

Edit `tailwind.config.cjs` in the `addComponents` section:

```js
'.my-custom-class': {
  backgroundColor: theme('colors.white'),
  padding: theme('spacing.6'),
  borderRadius: theme('borderRadius.lg'),
}
```

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind Colors Reference](https://tailwindcss.com/docs/customizing-colors)
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Project Styling Guidelines](./STYLING_GUIDELINES.md)

