const fs = require('fs');
const path = require('path');
const https = require('https');

// Function to fetch webpage content
function fetchWebpage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to extract image URLs from HTML content
function extractImageUrls(htmlContent) {
  const imageUrls = [];
  
  // Look for various image patterns
  const patterns = [
    /<img[^>]+src=["']([^"']+)["'][^>]*>/gi,
    /background-image:\s*url\(["']?([^"')]+)["']?\)/gi,
    /src:\s*["']([^"']+)["']/gi,
    /url\(["']?([^"')]+)["']?\)/gi
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(htmlContent)) !== null) {
      const url = match[1];
      if (url && !url.startsWith('data:') && !url.startsWith('#')) {
        // Make URL absolute if it's relative
        const absoluteUrl = url.startsWith('http') ? url : `https://10botics.com${url.startsWith('/') ? url : '/' + url}`;
        imageUrls.push(absoluteUrl);
      }
    }
  });
  
  // Remove duplicates and filter for image files
  const uniqueUrls = [...new Set(imageUrls)].filter(url => {
    const extension = path.extname(url).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(extension);
  });
  
  return uniqueUrls;
}

// Function to download an image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const targetDir = path.join(__dirname, '../src/assets/images/competition/Minecraft 校園創建計劃 2021');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    const filepath = path.join(targetDir, filename);
    
    // Check if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`File already exists: ${filename}`);
      resolve();
      return;
    }
    
    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Downloaded: ${filename}`);
          resolve();
        });
        
        fileStream.on('error', (err) => {
          fs.unlink(filepath, () => {});
          reject(err);
        });
      } else {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
      }
    });
    
    request.on('error', (err) => {
      reject(err);
    });
    
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error(`Timeout downloading ${filename}`));
    });
  });
}

// Main function to scrape and download images
async function scrapeAndDownloadImages() {
  try {
    console.log('Fetching Minecraft 2021 competition page...');
    const url = 'https://10botics.com/competition-minecraft2021/';
    const htmlContent = await fetchWebpage(url);
    
    console.log('Extracting image URLs...');
    const imageUrls = extractImageUrls(htmlContent);
    
    console.log(`Found ${imageUrls.length} potential images:`);
    imageUrls.forEach((url, index) => {
      console.log(`  ${index + 1}. ${url}`);
    });
    
    // Save URLs to a file for reference
    const urlsFile = path.join(__dirname, '../src/assets/images/competition/Minecraft 校園創建計劃 2021/image-urls.json');
    fs.writeFileSync(urlsFile, JSON.stringify(imageUrls, null, 2));
    console.log(`\nImage URLs saved to: ${urlsFile}`);
    
    // Download images
    console.log('\nStarting download of images...');
    const results = [];
    
    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      const extension = path.extname(url) || '.jpg';
      const filename = `scraped-image-${i + 1}${extension}`;
      
      try {
        await downloadImage(url, filename);
        results.push({ filename, status: 'success', url });
      } catch (error) {
        console.error(`Error downloading ${filename}:`, error.message);
        results.push({ filename, status: 'error', error: error.message, url });
      }
      
      // Add delay between downloads
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Print summary
    console.log('\nDownload Summary:');
    const successful = results.filter(r => r.status === 'success').length;
    const failed = results.filter(r => r.status === 'error').length;
    
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    
    if (failed > 0) {
      console.log('\nFailed downloads:');
      results.filter(r => r.status === 'error').forEach(r => {
        console.log(`  - ${r.filename}: ${r.error}`);
      });
    }
    
    // Save results to file
    const resultsFile = path.join(__dirname, '../src/assets/images/competition/Minecraft 校園創建計劃 2021/download-results.json');
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
    console.log(`\nDownload results saved to: ${resultsFile}`);
    
    return results;
    
  } catch (error) {
    console.error('Scraping failed:', error);
    throw error;
  }
}

// Alternative approach: try to find images in common WordPress directories
async function tryCommonWordPressPaths() {
  const commonPaths = [
    'https://10botics.com/wp-content/uploads/2021/08/',
    'https://10botics.com/wp-content/uploads/2021/',
    'https://10botics.com/wp-content/uploads/',
    'https://10botics.com/images/',
    'https://10botics.com/assets/images/',
    'https://10botics.com/competition/minecraft2021/',
    'https://10botics.com/competition-minecraft2021/'
  ];
  
  const testImages = [
    'hero.jpg', 'hero.png', 'main.jpg', 'main.png',
    'map.jpg', 'map.png', 'overview.jpg', 'overview.png',
    'buildathon.jpg', 'buildathon.png', 'results.jpg', 'results.png',
    'winners.jpg', 'winners.png', 'champion.jpg', 'champion.png'
  ];
  
  console.log('\nTrying common WordPress image paths...');
  
  for (const basePath of commonPaths) {
    console.log(`\nChecking: ${basePath}`);
    
    for (const testImage of testImages) {
      const testUrl = basePath + testImage;
      try {
        const response = await new Promise((resolve, reject) => {
          https.get(testUrl, (res) => {
            if (res.statusCode === 200) {
              resolve(res);
            } else {
              reject(new Error(`Status: ${res.statusCode}`));
            }
          }).on('error', reject);
        });
        
        console.log(`✅ Found: ${testUrl}`);
        
        // Download this image
        const filename = `found-${testImage}`;
        await downloadImage(testUrl, filename);
        
      } catch (error) {
        // Image not found, continue
      }
    }
  }
}

// Main execution
if (require.main === module) {
  scrapeAndDownloadImages()
    .then(() => {
      console.log('\nScraping and download process completed!');
      return tryCommonWordPressPaths();
    })
    .then(() => {
      console.log('\nAll processes completed!');
    })
    .catch(error => {
      console.error('Process failed:', error);
      process.exit(1);
    });
}

module.exports = { scrapeAndDownloadImages, tryCommonWordPressPaths };

