# OtherCourses Component

A reusable Astro component that displays other courses at the bottom of individual course pages, automatically excluding the current course.

## Usage

```astro
---
import OtherCourses from '../../components/OtherCourses.astro';
---

<OtherCourses 
  currentCourseSlug="course-slug"
  title="其他相關課程"
  subtitle="探索更多 STEM 及人工智能課程"
  maxCourses={3}
/>
```

## Props

- `currentCourseSlug` (required): The slug of the current course page (e.g., "raspberry-pi", "scratch-ai-programming")
- `title` (optional): The title for the section. Default: "其他相關課程"
- `subtitle` (optional): The subtitle for the section. Default: "探索更多 STEM 及人工智能課程"
- `maxCourses` (optional): Maximum number of courses to display. Default: 3

## Features

- **Automatic Discovery**: Automatically discovers all `.astro` course files in the `src/pages/school-courses/` directory
- **Current Course Exclusion**: Excludes the current course from the list
- **Course Data Extraction**: Attempts to extract course data from the module if available
- **Responsive Design**: Displays courses in a responsive grid layout
- **Interactive Elements**: Hover effects and smooth transitions
- **View All Button**: Includes a link to view all courses

## Course Data Structure

The component expects course files to have a `courseData` export with the following structure:

```typescript
interface CourseData {
  title: string;
  description?: string;
  tags?: string[];
  targetAudience?: string;
  duration?: string;
}
```

If no `courseData` is found, the component will generate basic data from the filename.

## Styling

The component uses Tailwind CSS classes and includes:
- Responsive grid layout (1 column on mobile, 2 on tablet, 3 on desktop)
- Hover effects with shadow transitions
- Card-based design with consistent spacing
- Text truncation for long titles and descriptions
- Color-coded icons for different course metadata

## Example Implementation

```astro
---
import Layout from '../../layouts/Layout.astro';
import OtherCourses from '../../components/OtherCourses.astro';
---

<Layout title="Course Title">
  <!-- Your course content here -->
  
  <!-- Other Courses Section -->
  <OtherCourses 
    currentCourseSlug="your-course-slug"
    title="其他相關課程"
    subtitle="探索更多 STEM 及人工智能課程"
    maxCourses={3}
  />
</Layout>
```

## Files Modified

The component has been added to the following course pages:
- `src/pages/school-courses/raspberry-pi.astro`
- `src/pages/school-courses/scratch-ai-programming.astro`
- `src/pages/school-courses/ai-digital-animation-exhibition.astro` 