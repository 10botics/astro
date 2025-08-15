import { readFileSync, writeFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

export interface Competition {
  date: string;
  name: string;
  keywords: string;
  popularity: string;
  link: string;
  url: string;
}

export interface CSVRow {
  date: string;
  name: string;
  keywords: string;
  score: string | number;
  link: string;
  url: string;
}

/**
 * Converts numerical score (1-5) to star rating
 * @param score - Numerical score from 1 to 5
 * @returns Star rating string (e.g., "★★★★☆")
 */
export function scoreToStars(score: string | number): string {
  const numScore = typeof score === 'string' ? parseInt(score, 10) : score;
  
  if (isNaN(numScore) || numScore < 1 || numScore > 5) {
    throw new Error(`Invalid score: ${score}. Score must be between 1 and 5.`);
  }
  
  const fullStars = '★'.repeat(numScore);
  const emptyStars = '☆'.repeat(5 - numScore);
  return fullStars + emptyStars;
}

/**
 * Validates CSV row data
 * @param row - CSV row data
 * @returns Validation result with errors if any
 */
export function validateRow(row: CSVRow, rowNumber: number): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!row.date?.trim()) errors.push('Date is required');
  if (!row.name?.trim()) errors.push('Name is required');
  if (!row.keywords?.trim()) errors.push('Keywords are required');
  if (!row.score) errors.push('Score is required');
  if (!row.link?.trim()) errors.push('Link text is required');
  if (!row.url?.trim()) errors.push('URL is required');
  
  // Validate score
  const score = parseInt(row.score.toString(), 10);
  if (isNaN(score) || score < 1 || score > 5) {
    errors.push(`Score must be a number between 1 and 5, got: ${row.score}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors.map(error => `Row ${rowNumber}: ${error}`)
  };
}

/**
 * Converts CSV data to Competition array
 * @param csvContent - Raw CSV content as string
 * @returns Array of Competition objects
 */
export function csvToCompetitions(csvContent: string): Competition[] {
  try {
    const rows = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    }) as CSVRow[];
    
    const competitions: Competition[] = [];
    const errors: string[] = [];
    
    rows.forEach((row, index) => {
      const validation = validateRow(row, index + 2); // +2 because index is 0-based and we skip header
      
      if (!validation.isValid) {
        errors.push(...validation.errors);
        return;
      }
      
      try {
        const competition: Competition = {
          date: row.date.trim(),
          name: row.name.trim(),
          keywords: row.keywords.trim(),
          popularity: scoreToStars(row.score),
          link: row.link.trim(),
          url: row.url.trim()
        };
        
        competitions.push(competition);
      } catch (error) {
        errors.push(`Row ${index + 2}: ${error}`);
      }
    });
    
    if (errors.length > 0) {
      console.warn('Validation warnings:');
      errors.forEach(error => console.warn(`  ${error}`));
    }
    
    if (competitions.length === 0) {
      throw new Error('No valid competitions found in CSV');
    }
    
    return competitions;
  } catch (error) {
    throw new Error(`Failed to parse CSV: ${error}`);
  }
}

/**
 * Generates TypeScript code from Competition array
 * @param competitions - Array of Competition objects
 * @param variableName - Name for the exported variable (default: 'competitions')
 * @returns TypeScript code as string
 */
export function generateTypeScript(competitions: Competition[], variableName: string = 'competitions'): string {
  const competitionData = competitions.map(comp => `  {
    date: "${comp.date}",
    name: "${comp.name}",
    keywords: "${comp.keywords}",
    popularity: "${comp.popularity}",
    link: "${comp.link}",
    url: "${comp.url}"
  }`).join(',\n');

  return `export interface Competition {
  date: string;
  name: string;
  keywords: string;
  popularity: string;
  link: string;
  url: string;
}

const ${variableName}: Competition[] = [
${competitionData}
];

export default ${variableName};
`;
}

/**
 * Main function to import CSV and generate TypeScript
 * @param csvFilePath - Path to CSV file
 * @param outputFilePath - Path for output TypeScript file
 * @param variableName - Name for the exported variable
 */
export function importCSV(csvFilePath: string, outputFilePath: string, variableName: string = 'competitions'): void {
  try {
    console.log(`Reading CSV file: ${csvFilePath}`);
    const csvContent = readFileSync(csvFilePath, 'utf-8');
    
    console.log('Converting CSV to competitions...');
    const competitions = csvToCompetitions(csvContent);
    
    console.log(`Found ${competitions.length} valid competitions`);
    
    console.log('Generating TypeScript code...');
    const tsCode = generateTypeScript(competitions, variableName);
    
    console.log(`Writing TypeScript file: ${outputFilePath}`);
    writeFileSync(outputFilePath, tsCode, 'utf-8');
    
    console.log('✅ Import completed successfully!');
    console.log(`📊 Processed ${competitions.length} competitions`);
    console.log(`📁 Output saved to: ${outputFilePath}`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

// CLI usage example:
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: npm run csv-import <csv-file> <output-file> [variable-name]');
    console.log('Example: npm run csv-import competitions.csv competitions.ts primaryCompetitions');
    process.exit(1);
  }
  
  const [csvFile, outputFile, variableName] = args;
  importCSV(csvFile, outputFile, variableName);
}
