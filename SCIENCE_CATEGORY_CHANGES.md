# Science Category Changes Summary

## Overview
Changed "Others 其他" category to "科學手作" (Science Handicraft) with a dedicated page at `/science/`.

## Changes Made

### 1. Updated Course Mappings (`src/utils/courseMappings.ts`)
- **Line 129**: Changed `'其他': 'others'` to `'科學手作': 'science-handicraft'`
- **Lines 375-382**: Updated filtering logic for science-handicraft courses:
  - Filters courses with Science/科學/手作/Arts tags
  - Excludes Programming and AI courses
- **Line 465**: Changed category tag from `{ tag: 'others', originalTag: 'Others 其他' }` to `{ tag: 'science-handicraft', originalTag: '科學手作' }`

### 2. Created Science Category Page (`src/pages/science/index.astro`)
- New dedicated page similar to school-courses index
- Features:
  - Header with course count
  - Course description section
  - Grid display of science handicraft courses
  - "Why Choose Science Courses" section with benefits
- Filters courses using `filterCoursesByTag(astroCourses, 'science-handicraft', '科學手作')`
- SEO optimized with proper metadata

### 3. Updated Navigation (`src/components/Header.astro`)
- **Line 22**: Changed navigation link from:
  ```javascript
  { name: 'Others 其他', href: '/school-courses/tag/others' }
  ```
  to:
  ```javascript
  { name: '科學手作', href: '/science' }
  ```

## URL Structure

### Main Category Page
- **URL**: `www.10botics.com/science/`
- **Purpose**: Lists all science handicraft courses
- **Features**: Full page with descriptions and benefits

### Tag Page (Alternative)
- **URL**: `www.10botics.com/school-courses/tag/science-handicraft/`
- **Purpose**: Tag-based filtering page
- **Note**: Both URLs work and show the same courses

### Individual Course Pages
- **URL Pattern**: `www.10botics.com/school-courses/[course-slug]`
- **Examples**:
  - `www.10botics.com/school-courses/coral-environment-monitoring`
  - `www.10botics.com/school-courses/natural-bio-sciences`

## Courses Included in Science Handicraft Category

Courses with these tags are included:
- 科學 (Science)
- Science 科學
- 手作 (Handicraft)
- Arts 藝術 (when combined with science themes)

Examples:
1. **珊瑚環境監測入門課程** (Coral Environment Monitoring)
   - Tags: Arduino, IoT, Microbit, Programming, 海洋環境
   
2. **自然生物探究手作課程** (Natural Biology Exploration Handicraft)
   - Tags: Arts 藝術, 科學, 手作, 初小, 高小

## Build Status
✅ Build completed successfully
✅ Science page generated at `/dist/science/index.html`
✅ Tag page generated at `/dist/school-courses/tag/science-handicraft/index.html`
✅ No linter errors

## Testing
To test the changes:
1. Navigate to `www.10botics.com/science/`
2. Verify the science handicraft courses are displayed
3. Check navigation menu shows "科學手作" instead of "Others 其他"
4. Click on individual courses to verify they load correctly

## Notes
- The old `/school-courses/tag/others` URL no longer exists
- All existing course pages remain unchanged
- The filtering logic specifically targets science-related courses with hands-on/arts components
- Courses with Programming or AI tags are excluded from this category

