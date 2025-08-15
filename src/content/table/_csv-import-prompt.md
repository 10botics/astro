# CSV Table Import Prompt for Competition Tables

## Overview
This prompt is designed to automatically convert CSV competition data into TypeScript interfaces with automatic score-to-star conversion for the Astro website.

## CSV Format Requirements
Your CSV should have the following columns (in any order):
- `date` - Competition date (e.g., "2025年1月", "2025年1月6日")
- `name` - Competition name
- `keywords` - Key topics/areas (comma-separated if multiple)
- `score` - Numerical score (1-5) or rating (will be converted to stars)
- `link` - Display text for link (e.g., "點擊進入")
- `url` - Actual URL link

## Score Conversion Rules
- **Score 5** → `★★★★★` (5 full stars)
- **Score 4** → `★★★★☆` (4 full stars, 1 empty star)
- **Score 3** → `★★★☆☆` (3 full stars, 2 empty stars)
- **Score 2** → `★★☆☆☆` (2 full stars, 3 empty stars)
- **Score 1** → `★☆☆☆☆` (1 full star, 4 empty stars)

## Example CSV Input
```csv
date,name,keywords,score,link,url
2025年1月,FIRST® LEGO® League,海洋研究、工程設計,5,點擊進入,https://10botics.co/stem-competition-1
2025年1月6日,WRO香港機械人「冬季」挑戰賽 2025,機械人AI人工智能、資訊科技、可持續發展,4,點擊進入,https://10botics.co/stem-competition-2
2025年1月19日,香港青少年科技創新大賽,STEAM,4,點擊進入,https://10botics.co/stem-competition-3
```

## Expected Output
The system will automatically generate:
1. **TypeScript Interface** matching the existing `Competition` interface
2. **Star Conversion** from numerical scores to star ratings
3. **Proper Data Structure** ready for import into the Astro website
4. **Validation** to ensure all required fields are present

## Usage Instructions
1. Prepare your CSV file with the required columns
2. Ensure scores are numerical values 1-5
3. Run the import process
4. The system will generate a TypeScript file ready for use
5. Copy the generated code into your table file

## Generated TypeScript Structure
```typescript
export interface Competition {
  date: string;
  name: string;
  keywords: string;
  popularity: string;  // Auto-converted from score to stars
  link: string;
  url: string;
}

const competitions: Competition[] = [
  // Auto-generated entries with star ratings
];

export default competitions;
```

## Notes
- The `popularity` field will automatically contain the star rating
- Empty stars use `☆` character
- Full stars use `★` character
- All Chinese text and URLs will be preserved as-is
- The system handles both single dates and date ranges
- Keywords can contain commas and special characters

## Error Handling
If any required fields are missing or scores are invalid, the system will:
- Flag the problematic rows
- Provide clear error messages
- Suggest corrections
- Continue processing valid rows

## Integration
After import, the generated TypeScript file can be:
- Directly imported into your Astro pages
- Used in the existing competition listing components
- Automatically formatted to match the current website design
