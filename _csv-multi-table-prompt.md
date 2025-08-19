# CSV Multi-Table Integration Instructions for Astro

## Goal
Integrate CSV data into an Astro page and distribute it into multiple tables based on content categories (e.g., separating data by type, level, or any categorical column).

## Required Steps (in order)

### 1. **Verify csv-parse Installation**
- Check `package.json` for `csv-parse` dependency
- Verify `astro.config.mjs` has proper configuration
- Install if missing: `npm install csv-parse`

### 2. **Place CSV File in `src/data/` Directory**
- Standard location: `src/data/your-file.csv`
- Ensure CSV has a category column for separating data
- CSV structure should include your desired columns

### 3. **Import CSV Using csv-parse**
```astro
---
import Layout from '../layouts/Layout.astro';
import data from '../../data/your-file.csv';

const allData = data.default;
---
```

### 4. **Distribute Data into Multiple Tables**
```astro
---
// Separate data by category column
const category1Data = allData.filter(item => 
  item['categoryColumn'] === 'category1'
);

const category2Data = allData.filter(item => 
  item['categoryColumn'] === 'category2'
);

// Sort data by any column (e.g., date, name, etc.)
const sortByColumn = (a, b, columnName) => {
  const valueA = a[columnName];
  const valueB = b[columnName];
  
  // Handle different data types
  if (valueA && valueB && !isNaN(valueA) && !isNaN(valueB)) {
    return Number(valueA) - Number(valueB);
  }
  
  if (valueA && valueB && valueA.match(/\d/) && valueB.match(/\d/)) {
    // Handle date-like strings
    const dateA = new Date(valueA.replace(/年|月|日/g, '/'));
    const dateB = new Date(valueB.replace(/年|月|日/g, '/'));
    return dateA.getTime() - dateB.getTime();
  }
  
  return String(valueA).localeCompare(String(valueB));
};

category1Data.sort((a, b) => sortByColumn(a, b, 'sortColumn'));
category2Data.sort((a, b) => sortByColumn(a, b, 'sortColumn'));

// Calculate totals for statistics
const totalItems = category1Data.length + category2Data.length;
---
```

### 5. **Implement Rating Conversion (if needed)**
```astro
---
// Convert rating fractions to visual symbols
const convertToRating = (rating: string) => {
  if (!rating.includes('/')) return rating;
  const [full, total] = rating.split('/').map(Number);
  const empty = total - full;
  return '★'.repeat(full) + '☆'.repeat(empty);
};
---
```

### 6. **Create Multiple Table Sections**
```astro
<!-- Category 1 Table -->
<div class="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
  <div class="px-6 py-4 bg-blue-50 border-b border-blue-200">
    <h2 class="text-2xl font-bold text-blue-800">Category 1 Data</h2>
  </div>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <!-- Table headers - customize based on your columns -->
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column 1</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column 2</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column 3</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column 4</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column 5</th>
        </tr>
      </thead>
      <!-- Table body -->
      <tbody class="bg-white divide-y divide-gray-200">
        {category1Data.map((item) => (
          <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item['column1']}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item['column2']}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item['column3']}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item['column4']}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {item['column5'] && item['column5'].includes('/') ? 
                convertToRating(item['column5']) : 
                item['column5']
              }
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

<!-- Category 2 Table -->
<div class="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
  <div class="px-6 py-4 bg-green-50 border-b border-green-200">
    <h2 class="text-2xl font-bold text-green-800">Category 2 Data</h2>
  </div>
  <!-- Similar table structure for category 2 data -->
</div>
```

### 7. **Add Statistics Dashboard**
```astro
<!-- Statistics Information -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  <div class="bg-blue-50 p-6 rounded-lg text-center">
    <h3 class="text-2xl font-bold text-blue-800">{category1Data.length}</h3>
    <p class="text-blue-600">Category 1 Items</p>
  </div>
  <div class="bg-green-50 p-6 rounded-lg text-center">
    <h3 class="text-2xl font-bold text-green-800">{category2Data.length}</h3>
    <p class="text-green-600">Category 2 Items</p>
  </div>
  <div class="bg-purple-50 p-6 rounded-lg text-center">
    <h3 class="text-2xl font-bold text-purple-800">{totalItems}</h3>
    <p class="text-purple-600">Total Items</p>
  </div>
</div>
```

## CSV Structure Requirements

### **Required Columns:**
- **Category Column**: Must have a column to separate data into different tables
- **Data Columns**: All other relevant data columns for your use case
- **Unique Identifiers**: Each row should be uniquely identifiable

### **Example CSV Structure:**
```csv
category,column1,column2,column3,column4,column5
category1,value1,value2,value3,value4,value5
category2,value1,value2,value3,value4,value5
```

## Rating Conversion System

### **Fractions to Visual Symbols:**
- **5/5** → **★★★★★** (5 full symbols)
- **4/5** → **★★★★☆** (4 full symbols + 1 empty symbol)
- **3/5** → **★★★☆☆** (3 full symbols + 2 empty symbols)
- **2/5** → **★★☆☆☆** (2 full symbols + 3 empty symbols)
- **1/5** → **★☆☆☆☆** (1 full symbol + 4 empty symbols)

### **Implementation:**
```astro
const convertToRating = (rating: string) => {
  if (!rating.includes('/')) return rating;
  const [full, total] = rating.split('/').map(Number);
  const empty = total - full;
  return '★'.repeat(full) + '☆'.repeat(empty);
};
```

## Multi-Table Distribution Process

### **Step 1: Filter Data by Category**
```astro
// Filter data by category column
const category1Data = allData.filter(item => 
  item['categoryColumn'] === 'category1'
);

const category2Data = allData.filter(item => 
  item['categoryColumn'] === 'category2'
);
```

### **Step 2: Sort Each Category**
```astro
// Sort by any column within each category
const sortByColumn = (a, b, columnName) => {
  // Customize sorting logic based on your data type
  const valueA = a[columnName];
  const valueB = b[columnName];
  
  if (valueA && valueB && !isNaN(valueA) && !isNaN(valueB)) {
    return Number(valueA) - Number(valueB);
  }
  
  return String(valueA).localeCompare(String(valueB));
};

category1Data.sort((a, b) => sortByColumn(a, b, 'sortColumn'));
category2Data.sort((a, b) => sortByColumn(a, b, 'sortColumn'));
```

### **Step 3: Calculate Statistics**
```astro
// Calculate totals for each category
const totalCategory1 = category1Data.length;
const totalCategory2 = category2Data.length;
const grandTotal = totalCategory1 + totalCategory2;
```

### **Step 4: Render Separate Tables**
- Create distinct table sections for each category
- Use different color schemes to distinguish categories
- Maintain consistent table structure across all categories
- Add category-specific headers and styling

## Key Implementation Points

### **✅ Do's:**
- Use `src/data/` directory for CSV files
- Import CSV directly with csv-parse: `import data from '../../data/file.csv'`
- Access data with `data.default`
- Filter data by category column values
- Sort data within each category
- Convert fractions to visual ratings when applicable
- Use consistent table structure across categories
- Add visual distinction between different categories

### **❌ Don'ts:**
- Don't use content collections for simple CSV data
- Don't manually parse CSV text
- Don't use `fs` or `readFileSync` in Astro
- Don't hardcode table data
- Don't mix different data structures in the same table
- Don't forget to handle empty categories

## Advanced Features

### **Dynamic Category Detection:**
```astro
// Automatically detect all categories
const categories = [...new Set(allData.map(item => item['categoryColumn']))];

// Create tables for each category dynamically
categories.forEach(category => {
  const categoryData = allData.filter(item => item['categoryColumn'] === category);
  // Render table for this category
});
```

### **Responsive Table Design:**
- Use `overflow-x-auto` for horizontal scrolling on mobile
- Implement responsive grid layouts for statistics
- Use appropriate breakpoints for different screen sizes

### **Error Handling:**
```astro
// Handle missing or invalid data
const safeData = allData.filter(item => 
  item['categoryColumn'] && item['requiredColumn1'] && item['requiredColumn2']
);

// Provide fallback for missing rating data
const getRating = (item) => {
  return item['ratingColumn'] ? convertToRating(item['ratingColumn']) : 'N/A';
};
```

## Notes
- The system automatically handles text and special characters
- URLs are preserved and can be used as external links
- Date sorting works with various date formats
- Text can contain commas and special characters
- The system is scalable for additional categories
- All tables maintain consistent styling and structure
- Statistics are calculated dynamically from the data
- Customize column names, categories, and sorting logic for your specific use case
