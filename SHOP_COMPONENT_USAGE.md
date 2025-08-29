# ShopSection Component Usage Guide

## Overview
The `ShopSection` component is designed to display shop links for school courses, allowing students and teachers to easily access related hardware and tools needed for the course.

## Location
`src/components/course/ShopSection.astro`

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | string | No | "購買課程相關產品" | Main heading for the shop section |
| `description` | string | No | "探索與本課程相關的硬件和工具，讓學習更加完整" | Description text below the title |
| `shopLink` | string | **Yes** | - | The URL to the shop page (opens in new tab) |
| `buttonText` | string | No | "立即購買" | Text for the call-to-action button |
| `imageSrc` | string | No | - | Product image URL (optional) |
| `imageAlt` | string | No | "課程相關產品" | Alt text for the product image |
| `backgroundColor` | string | No | "bg-gradient-to-r from-blue-50 to-cyan-50" | Background color class |
| `textColor` | string | No | "text-gray-900" | Text color class |

## Basic Usage

```astro
---
import ShopSection from '../../components/course/ShopSection.astro';
---

<ShopSection 
  shopLink="https://shop.10botics.com/your-product-link"
/>
```

## Advanced Usage Example

```astro
---
import ShopSection from '../../components/course/ShopSection.astro';
---

<ShopSection 
  title="購買 Donkey Car 無人車"
  description="獲取 Donkey Car 無人車套件及相關配件，開始你的 AI 自駕學習之旅"
  shopLink="https://shop.10botics.com/Donkey-Car-c185813831"
  buttonText="購買 Donkey Car"
  imageSrc="https://shop.10botics.com/cdn/shop/products/Donkey-Car-TT02-1_1024x1024.jpg"
  imageAlt="Donkey Car TT02 無人車套件"
  backgroundColor="bg-gradient-to-r from-green-50 to-emerald-50"
  textColor="text-gray-800"
/>
```

## Integration in Course Pages

The component is designed to be placed before the FAQ section in course pages:

```astro
<!-- Shop Section -->
<ShopSection 
  title="購買課程相關產品"
  description="獲取課程所需的硬件設備和工具，讓你的學習之旅更加順利"
  shopLink="https://shop.10botics.com/your-product"
  buttonText="立即購買"
/>

<!-- FAQ Section -->
<QnASection faqs={faqData} />
```

## Features

- **Responsive Design**: Adapts to different screen sizes
- **External Link**: Opens shop links in new tab with proper security attributes
- **Customizable Styling**: Supports custom background and text colors
- **Product Image**: Optional product image display
- **Accessibility**: Proper ARIA labels and semantic HTML
- **Hover Effects**: Interactive button with scale and shadow effects

## Available Shop Links

Based on the 10Botics shop, here are some example product categories:

- **Donkey Car**: https://shop.10botics.com/Donkey-Car-c185813831
- **Robotics Kits**: Various robotics and programming kits
- **Educational Tools**: STEM learning materials and hardware

## Image Handling

**Important**: External CDN images from the 10Botics shop (e.g., `https://shop.10botics.com/cdn/shop/products/...`) are not publicly accessible and will not work. Use one of these alternatives:

1. **Local Images** (Recommended): Use images from your `src/assets/images/` directory
2. **Public URLs**: Only use images from publicly accessible sources
3. **No Image**: Leave `imageSrc` undefined to show the default shopping cart icon

## Styling Customization

The component uses Tailwind CSS classes and supports custom styling:

- **Background**: Use any Tailwind background classes
- **Text Colors**: Customize text colors for better contrast
- **Button Styles**: The button uses a blue-to-cyan gradient by default
- **Layout**: Two-column grid layout that stacks on mobile

## Best Practices

1. **Placement**: Position before FAQ or contact sections
2. **Content**: Use clear, action-oriented button text
3. **Images**: Use high-quality product images when available
4. **Links**: Always use the full shop URL from 10Botics
5. **Accessibility**: Ensure alt text describes the product clearly

## Example Implementations

### Donkey Car Course
```astro
<ShopSection 
  title="購買 Donkey Car 無人車"
  description="獲取 Donkey Car 無人車套件及相關配件，開始你的 AI 自駕學習之旅"
  shopLink="https://shop.10botics.com/Donkey-Car-c185813831"
  buttonText="購買 Donkey Car"
  imageSrc="https://shop.10botics.com/cdn/shop/products/Donkey-Car-TT02-1_1024x1024.jpg"
  imageAlt="Donkey Car TT02 無人車套件"
/>
```

### Robotics Course
```astro
<ShopSection 
  title="購買機器人套件"
  description="獲取課程所需的機器人硬件和編程工具"
  shopLink="https://shop.10botics.com/robotics-kits"
  buttonText="購買機器人套件"
/>
```

## Troubleshooting

- **Build Errors**: Ensure the component is properly imported
- **Styling Issues**: Check Tailwind CSS classes are available
- **Image Loading**: Verify image URLs are accessible
- **Link Issues**: Test shop links in browser before deployment
