# CSV Table Import System

This system automatically converts CSV competition data into TypeScript interfaces with automatic score-to-star conversion for the Astro website.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install csv-parse
```

### 2. Prepare Your CSV File
Create a CSV file with these columns:
- `date` - Competition date
- `name` - Competition name  
- `keywords` - Key topics/areas
- `score` - Numerical score (1-5)
- `link` - Display text for link
- `url` - Actual URL

### 3. Run the Import
```bash
# Using Node.js directly
npx tsx src/content/table/csv-importer.ts sample-competitions.csv output.ts primaryCompetitions

# Or add to package.json scripts
npm run csv-import sample-competitions.csv output.ts primaryCompetitions
```

## 📋 CSV Format Example

```csv
date,name,keywords,score,link,url
2025年1月,FIRST® LEGO® League,海洋研究、工程設計,5,點擊進入,https://10botics.co/stem-competition-1
2025年1月6日,WRO香港機械人「冬季」挑戰賽 2025,機械人AI人工智能、資訊科技、可持續發展,4,點擊進入,https://10botics.co/stem-competition-2
```

## ⭐ Score to Star Conversion

| Score | Stars | Display |
|-------|-------|---------|
| 5 | ★★★★★ | 5 full stars |
| 4 | ★★★★☆ | 4 full, 1 empty |
| 3 | ★★★☆☆ | 3 full, 2 empty |
| 2 | ★★☆☆☆ | 2 full, 3 empty |
| 1 | ★☆☆☆☆ | 1 full, 4 empty |

## 🔧 Usage Options

### Command Line Interface
```bash
# Basic usage
npx tsx csv-importer.ts input.csv output.ts

# With custom variable name
npx tsx csv-importer.ts input.csv output.ts myCompetitions

# Help
npx tsx csv-importer.ts
```

### Programmatic Usage
```typescript
import { importCSV, csvToCompetitions, generateTypeScript } from './csv-importer';

// Import and generate file
importCSV('input.csv', 'output.ts', 'competitions');

// Or process step by step
const csvContent = readFileSync('input.csv', 'utf-8');
const competitions = csvToCompetitions(csvContent);
const tsCode = generateTypeScript(competitions, 'myCompetitions');
```

## 📁 File Structure

```
src/content/table/
├── csv-importer.ts          # Main import script
├── _csv-import-prompt.md    # Import requirements
├── sample-competitions.csv  # Example CSV file
├── README.md               # This file
└── 2025比賽/               # Existing competition files
    ├── 2025中學比賽.ts
    └── 2025小學比賽.ts
```

## ✅ Validation Features

The system automatically validates:
- Required fields presence
- Score range (1-5)
- Data format consistency
- CSV structure integrity

## 🚨 Error Handling

- **Missing fields**: Clear error messages with row numbers
- **Invalid scores**: Automatic detection and reporting
- **CSV format issues**: Detailed parsing error messages
- **Graceful degradation**: Continues processing valid rows

## 🔄 Integration Workflow

1. **Prepare CSV** with competition data
2. **Run import** to generate TypeScript
3. **Review output** for any validation warnings
4. **Copy generated code** to your table file
5. **Import and use** in your Astro pages

## 📊 Example Output

```typescript
export interface Competition {
  date: string;
  name: string;
  keywords: string;
  popularity: string;
  link: string;
  url: string;
}

const primaryCompetitions: Competition[] = [
  {
    date: "2025年1月",
    name: "FIRST® LEGO® League",
    keywords: "海洋研究、工程設計",
    popularity: "★★★★★",
    link: "點擊進入",
    url: "https://10botics.co/stem-competition-1"
  },
  // ... more competitions
];

export default primaryCompetitions;
```

## 🛠️ Customization

### Modify Score Conversion
Edit the `scoreToStars` function in `csv-importer.ts`:
```typescript
export function scoreToStars(score: string | number): string {
  // Custom star logic here
  const numScore = parseInt(score.toString(), 10);
  return '★'.repeat(numScore) + '☆'.repeat(5 - numScore);
}
```

### Add New Fields
Extend the interfaces and validation:
```typescript
export interface Competition {
  // ... existing fields
  newField: string;
}
```

## 🐛 Troubleshooting

### Common Issues

**CSV parsing errors**: Ensure proper CSV format with commas and quotes
**Score validation failures**: Check that scores are numbers 1-5
**Missing dependencies**: Install `csv-parse` package
**File permissions**: Ensure read/write access to input/output files

### Debug Mode
Add logging to see detailed processing:
```typescript
console.log('Processing row:', row);
console.log('Converted score:', scoreToStars(row.score));
```

## 📚 API Reference

### Functions

- `scoreToStars(score)` - Convert numerical score to star rating
- `validateRow(row, rowNumber)` - Validate CSV row data
- `csvToCompetitions(csvContent)` - Parse CSV to Competition array
- `generateTypeScript(competitions, variableName)` - Generate TS code
- `importCSV(csvFile, outputFile, variableName)` - Complete import process

### Interfaces

- `Competition` - Final competition data structure
- `CSVRow` - Raw CSV row data structure

## 🤝 Contributing

To improve the import system:
1. Add new validation rules
2. Enhance error messages
3. Support additional data formats
4. Improve performance for large datasets

## 📄 License

This system is part of the Astro website project and follows the same licensing terms.
