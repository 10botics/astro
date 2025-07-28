# 🚀 Astro Starter Kit: Minimal

Welcome to the 10Botics Astro project! This is a complete website migration from WordPress to Astro, featuring modern components and clean design.

> **🧪 Test PR Deployment**: This change is to test if Vercel automatically deploys PR previews.

## 📚 Quick Links

- **[Styling Guidelines](./STYLING_GUIDELINES.md)** - Complete design standards and component usage guidelines
- **[Migration Analysis](./MIGRATION_ANALYSIS.md)** - WordPress to Astro migration documentation
- **[Component Demo](http://localhost:4322/courses/component-demo)** - Live showcase of all course components

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 📁 Project Structure

```
/
├── public/
│   ├── images/         # Image assets
│   └── media/          # Media files from WordPress migration
├── src/
│   ├── components/     # Reusable components
│   │   ├── course/     # Course-specific components
│   │   ├── Header.astro
│   │   └── Footer.astro
│   ├── content/        # Content collections
│   ├── layouts/        # Page layouts
│   ├── pages/          # File-based routing
│   └── styles/         # Global styles
├── xml-guided-migration-data/  # WordPress migration data
├── STYLING_GUIDELINES.md       # Design standards ⭐
└── MIGRATION_ANALYSIS.md       # Migration documentation
```

## 🎨 Design System

This project follows a comprehensive design system based on the original WordPress site analysis. Key principles:

- **Clean & Professional**: Minimal design suitable for educational content
- **Consistent Typography**: Using Noto Sans TC for Chinese content
- **Accessible Colors**: Cyan accents (#00bcd4) with proper contrast ratios
- **Mobile-First**: Responsive design that works on all devices
- **No Emojis in Navigation**: Professional, text-only navigation

👉 **[Read the complete styling guidelines](./STYLING_GUIDELINES.md)**

## 🧩 Components

### Course Components

- **`CourseHero`** - Page hero with breadcrumbs, title, and video/image
- **`CourseFeatureGrid`** - 4-column grid for "What is X?" sections  
- **`CourseHighlights`** - Bullet-pointed feature lists
- **`CourseContent`** - Interactive accordion for curriculum
- **`CourseLayout`** - Complete page layout wrapper

### Usage Example
```astro
---
import CourseLayout from '../components/course/CourseLayout.astro';

const courseData = {
  title: "AI Programming Course",
  description: "Learn AI programming...",
  tags: ["AI", "Programming"],
  // ... more options
};
---

<CourseLayout courseData={courseData} />
```

## 🔗 Key Pages

- **Homepage**: `/` - Main landing page
- **Courses**: `/courses/` - Course listing
- **Component Demo**: `/courses/component-demo` - Showcase of all components
- **About**: `/about` - About the organization
- **Contact**: `/contact` - Contact information

## 🛠️ Development Notes

- Built with **Astro** for optimal performance
- Styled with **Tailwind CSS** for rapid development  
- Uses **TypeScript** for type safety
- Components are **fully generalized** and reusable
- **WordPress migration data** preserved in `xml-guided-migration-data/`

## 🎯 Migration Status

✅ **Completed**:
- Server setup and configuration
- Component architecture
- Styling guidelines  
- Course page templates
- Header/footer integration

🔄 **In Progress**:
- Content migration from WordPress
- SEO optimization
- Performance optimization

## 💡 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

---

**📋 Remember**: Always follow the [styling guidelines](./STYLING_GUIDELINES.md) when adding new components or content!
