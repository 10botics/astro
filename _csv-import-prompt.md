# CSV Integration Instructions for Astro

## Goal
Integrate CSV data directly into an Astro page using the astro-csv package.

## Required Steps (in order)
1. **Verify astro-csv is installed** - Check package.json and astro.config.mjs
2. **Place CSV file in `src/data/` directory** - This is the standard location for astro-csv
3. **Use astro-csv import syntax** - Import CSV directly: `import competitions from '../../data/competitions-2025.csv'`
4. **Access data directly** - Use `competitions.default` to get the parsed data
5. **No manual parsing needed** - astro-csv handles CSV parsing automatically

## Star Rating Conversion
When displaying popularity data, convert fractions to star ratings:
- **4/5** becomes **★★★★☆** (4 full stars + 1 empty star)
- **3/5** becomes **★★★☆☆** (3 full stars + 2 empty stars)
- **5/5** becomes **★★★★★** (5 full stars)
- **2/5** becomes **★★☆☆☆** (2 full stars + 3 empty stars)

## Example Implementation
```astro
---
import Layout from '../layouts/Layout.astro';
import competitions from '../../data/competitions-2025.csv';

const allCompetitions = competitions.default;

// Convert popularity fractions to star ratings
const convertToStars = (popularity: string) => {
  if (!popularity.includes('/')) return popularity;
  const [full, total] = popularity.split('/').map(Number);
  const empty = total - full;
  return '★'.repeat(full) + '☆'.repeat(empty);
};

// Apply star conversion to all competitions
const competitionsWithStars = allCompetitions.map(comp => ({
  ...comp,
  popularityStars: convertToStars(comp.popularity)
}));
---
```

## Key Points
- ✅ Use `src/data/` directory (not `src/content/`)
- ✅ Import CSV directly with astro-csv
- ✅ Convert fractions to star ratings using ★ and ☆
- ✅ No need for `fs`, `readFileSync`, or manual parsing
- ✅ Data is automatically parsed and typed
- ❌ Don't use content collections for simple CSV data
- ❌ Don't manually parse CSV text

## Notes
- For every field that contains fractions like "4/5", "3/5", "5/5"
- Convert these to visual star ratings: ★★★★★, ★★★★☆, ★★★☆☆, etc.
- Empty stars use `☆` character
- Full stars use `★` character
- All Chinese text and URLs will be preserved as-is
- The system handles both single dates and date ranges
- Keywords can contain commas and special characters