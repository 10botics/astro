#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to count Traditional Chinese characters
function countTraditionalChineseChars(text) {
  // Remove HTML tags and count only Traditional Chinese characters
  const cleanText = text.replace(/<[^>]*>/g, '');
  // Count characters that are not ASCII (mainly Traditional Chinese)
  const chineseChars = cleanText.match(/[^\x00-\x7F]/g);
  return chineseChars ? chineseChars.length : 0;
}

// Function to extract description from Astro file
function extractDescription(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Look for description in courseData object
    const descriptionMatch = content.match(/description:\s*["']([^"']+)["']/);
    if (descriptionMatch) {
      return descriptionMatch[1];
    }
    
    // Look for description in Layout component
    const layoutMatch = content.match(/description=["']([^"']+)["']/);
    if (layoutMatch) {
      return layoutMatch[1];
    }
    
    return null;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

// Function to scan school courses directory
function scanSchoolCourses() {
  const coursesDir = path.join(__dirname, '../src/pages/school-courses');
  const files = fs.readdirSync(coursesDir);
  
  const results = [];
  
  files.forEach(file => {
    if (file.endsWith('.astro') && file !== 'index.astro' && file !== '[slug].astro') {
      const filePath = path.join(coursesDir, file);
      const description = extractDescription(filePath);
      
      if (description) {
        const charCount = countTraditionalChineseChars(description);
        const isValid = charCount >= 50 && charCount <= 80;
        
        results.push({
          file: file,
          description: description,
          charCount: charCount,
          isValid: isValid,
          status: isValid ? '✅' : '❌'
        });
      } else {
        results.push({
          file: file,
          description: 'No description found',
          charCount: 0,
          isValid: false,
          status: '⚠️'
        });
      }
    }
  });
  
  return results;
}

// Main execution
console.log('🔍 Validating SEO Meta Descriptions for School Courses\n');
console.log('Requirements: 50-80 Traditional Chinese characters\n');

const results = scanSchoolCourses();

// Display results
results.forEach(result => {
  console.log(`${result.status} ${result.file}`);
  console.log(`   Characters: ${result.charCount}`);
  console.log(`   Description: ${result.description}`);
  console.log('');
});

// Summary
const validCount = results.filter(r => r.isValid).length;
const totalCount = results.length;
const invalidCount = totalCount - validCount;

console.log('📊 Summary:');
console.log(`   Total courses: ${totalCount}`);
console.log(`   Valid descriptions: ${validCount}`);
console.log(`   Invalid descriptions: ${invalidCount}`);
console.log(`   Success rate: ${Math.round((validCount / totalCount) * 100)}%`);

if (invalidCount > 0) {
  console.log('\n❌ Courses needing attention:');
  results.filter(r => !r.isValid).forEach(result => {
    console.log(`   - ${result.file} (${result.charCount} chars)`);
  });
}
