# CSV Integration Instructions for Astro

## Goal
Integrate CSV data directly into an Astro page using the astro-csv package.

## Required Steps (in order)
1. **Verify astro-csv is installed** - Check package.json and astro.config.mjs
2. **Place CSV file in `src/data/` directory** - This is the standard location for astro-csv
3. **Use astro-csv import syntax** - Import CSV directly: `import data from '../../data/your-file.csv'`
4. **Access data directly** - Use `data.default` to get the parsed data
5. **No manual parsing needed** - astro-csv handles CSV parsing automatically

## Fraction to Rating Conversion
When displaying rating data that contains fractions, convert them to visual representations:
- **4/5** becomes **★★★★☆** (4 full symbols + 1 empty symbol)
- **3/5** becomes **★★★☆☆** (3 full symbols + 2 empty symbols)
- **5/5** becomes **★★★★★** (5 full symbols)
- **2/5** becomes **★★☆☆☆** (2 full symbols + 3 empty symbols)

## Example Implementation
```astro
---
import Layout from '../layouts/Layout.astro';
import data from '../../data/your-file.csv';

const allData = data.default;

// Convert rating fractions to visual symbols
const convertToRating = (rating: string) => {
  if (!rating.includes('/')) return rating;
  const [full, total] = rating.split('/').map(Number);
  const empty = total - full;
  return '★'.repeat(full) + '☆'.repeat(empty);
};

// Apply rating conversion to all data
const dataWithRatings = allData.map(item => ({
  ...item,
  ratingDisplay: convertToRating(item.ratingColumn)
}));
---
```

## Key Points
- ✅ Use `src/data/` directory (not `src/content/`)
- ✅ Import CSV directly with astro-csv
- ✅ Convert fractions to visual ratings using appropriate symbols
- ✅ No need for `fs`, `readFileSync`, or manual parsing
- ✅ Data is automatically parsed and typed
- ❌ Don't use content collections for simple CSV data
- ❌ Don't manually parse CSV text

## Notes
- For any field that contains fractions like "4/5", "3/5", "5/5"
- Convert these to visual ratings using your chosen symbols
- Empty ratings can use any symbol like `☆`, `○`, `-`, etc.
- Full ratings can use any symbol like `★`, `●`, `✓`, etc.
- All text and URLs will be preserved as-is
- The system handles various data formats
- Keywords and text can contain commas and special characters