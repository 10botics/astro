#!/usr/bin/env python3
"""
Unified News Converter: Convert JSON to Markdown with Complete Image Management
- Downloads featured images AND content images
- Organizes images in src/assets/images/news/[article-slug]/ folders
- Renames images to image1.jpg, image2.png, etc.
- Updates all image references in content
"""

import json
import os
import re
import requests
import argparse
from datetime import datetime
from typing import Dict, List, Any, Optional
from bs4 import BeautifulSoup
from urllib.parse import urlparse

# Categories to include
TARGET_CATEGORIES = ["文章", "最新消息", "資助申請", "過往活動"]

def extract_all_images(data: Dict[str, Any]) -> List[Dict[str, str]]:
    """
    Extract ALL images from JSON data (featured + content)
    Returns list of image info: {url, type, context}
    """
    images = []
    
    # 1. Extract featured image from og:image meta tag
    if 'crawledData' in data and 'metaTags' in data['crawledData']:
        meta_tags = data['crawledData']['metaTags']
        if 'og:image' in meta_tags and meta_tags['og:image']:
            images.append({
                'url': meta_tags['og:image'],
                'type': 'featured',
                'context': 'og:image meta tag'
            })
    
    # 2. Extract featured image from featuredImage field
    if data.get('featuredImage'):
        images.append({
            'url': data['featuredImage'],
            'type': 'featured',
            'context': 'featuredImage field'
        })
    
    # 3. Extract images from content
    content = data.get('content', '')
    if content:
        soup = BeautifulSoup(content, 'html.parser')
        img_tags = soup.find_all('img')
        
        for img in img_tags:
            src = img.get('src')
            if src and src.startswith('http'):
                images.append({
                    'url': src,
                    'type': 'content',
                    'context': 'content img tag'
                })
    
    # 4. Extract images from crawledData.media array
    if 'crawledData' in data and 'media' in data['crawledData']:
        media = data['crawledData']['media']
        for item in media:
            if item.get('type') == 'image' and item.get('src'):
                src = item['src']
                if src.startswith('http'):
                    images.append({
                        'url': src,
                        'type': 'media',
                        'context': 'crawledData.media'
                    })
    
    # Remove duplicates while preserving order
    seen_urls = set()
    unique_images = []
    for img in images:
        if img['url'] not in seen_urls:
            seen_urls.add(img['url'])
            unique_images.append(img)
    
    return unique_images

def download_image(image_url: str, article_folder: str, image_number: int, skip_existing: bool = True) -> Optional[str]:
    """
    Download image and save to article folder with numbered filename
    Skip downloading if image already exists when skip_existing=True
    """
    try:
        # Parse URL to get file extension
        parsed_url = urlparse(image_url)
        path = parsed_url.path
        if '.' in path:
            ext = path.split('.')[-1].lower()
            if ext not in ['jpg', 'jpeg', 'png', 'gif', 'webp']:
                ext = 'jpg'  # default to jpg
        else:
            ext = 'jpg'
        
        # Create numbered filename
        filename = f"image{image_number}.{ext}"
        local_path = os.path.join(article_folder, filename)
        
        # Check if image already exists
        if skip_existing and os.path.exists(local_path):
            print(f"      ⏭️  Skipped (already exists): {filename}")
            return filename
        
        # Download image
        response = requests.get(image_url, timeout=10)
        response.raise_for_status()
        
        with open(local_path, 'wb') as f:
            f.write(response.content)
        
        print(f"      ✅ Downloaded: {filename}")
        return filename
        
    except Exception as e:
        print(f"  ⚠️  Failed to download image {image_url}: {e}")
        return None

def clean_html_content(html_content: str, image_mapping: Dict[str, str]) -> str:
    """
    Convert HTML content to clean markdown and replace image URLs
    """
    if not html_content:
        return ""
    
    # Parse HTML with BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Replace image URLs with local paths
    for img in soup.find_all('img'):
        src = img.get('src')
        if src and src in image_mapping:
            img['src'] = image_mapping[src]
    
    # Remove script and style elements
    for script in soup(["script", "style"]):
        script.decompose()
    
    # Convert common HTML elements to markdown
    # Headings
    for tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
        for element in soup.find_all(tag):
            level = int(tag[1])
            markdown_heading = '#' * level + ' ' + element.get_text().strip()
            element.replace_with(markdown_heading)
    
    # Paragraphs
    for p in soup.find_all('p'):
        text = p.get_text().strip()
        if text:
            p.replace_with(text + '\n\n')
    
    # Lists
    for ul in soup.find_all('ul'):
        list_items = []
        for li in ul.find_all('li'):
            list_items.append('- ' + li.get_text().strip())
        ul.replace_with('\n'.join(list_items) + '\n\n')
    
    for ol in soup.find_all('ol'):
        list_items = []
        for i, li in enumerate(ol.find_all('li'), 1):
            list_items.append(f'{i}. ' + li.get_text().strip())
        ol.replace_with('\n'.join(list_items) + '\n\n')
    
    # Links
    for a in soup.find_all('a'):
        href = a.get('href', '')
        text = a.get_text().strip()
        if href and text:
            a.replace_with(f'[{text}]({href})')
    
    # Images - convert to markdown format
    for img in soup.find_all('img'):
        src = img.get('src', '')
        alt = img.get('alt', '')
        if src:
            img.replace_with(f'![{alt}]({src})')
    
    # Bold and italic
    for strong in soup.find_all(['strong', 'b']):
        text = strong.get_text().strip()
        strong.replace_with(f'**{text}**')
    
    for em in soup.find_all(['em', 'i']):
        text = em.get_text().strip()
        em.replace_with(f'*{text}*')
    
    # Convert the soup back to string and clean up
    markdown_text = str(soup)
    
    # Remove HTML tags that weren't converted
    markdown_text = re.sub(r'<[^>]+>', '', markdown_text)
    
    # Clean up extra whitespace and newlines
    markdown_text = re.sub(r'\n\s*\n', '\n\n', markdown_text)
    markdown_text = re.sub(r' +', ' ', markdown_text)
    
    return markdown_text.strip()

def extract_date_from_string(date_str: str) -> Optional[str]:
    """
    Extract date from various date string formats
    """
    if not date_str:
        return None
    
    # Try to parse common date formats
    date_formats = [
        "%a, %d %b %Y %H:%M:%S %z",  # Fri, 30 May 2025 04:45:05 +0000
        "%Y-%m-%d",
        "%d/%m/%Y",
        "%m/%d/%Y"
    ]
    
    for fmt in date_formats:
        try:
            dt = datetime.strptime(date_str, fmt)
            return dt.strftime("%Y-%m-%d")
        except ValueError:
            continue
    
    return None

def generate_slug(title: str) -> str:
    """
    Generate a URL-friendly slug from title
    """
    # Remove special characters and convert to lowercase
    slug = re.sub(r'[^\w\s-]', '', title.lower())
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')

def extract_excerpt(content: str, max_length: int = 200) -> str:
    """
    Extract excerpt from content, skipping all images
    """
    if not content:
        return ""
    
    # Parse HTML and remove all img tags before processing
    soup = BeautifulSoup(content, 'html.parser')
    
    # Remove all image elements
    for img in soup.find_all('img'):
        img.decompose()
    
    # Convert the cleaned HTML to string
    clean_html = str(soup)
    
    # Clean HTML and get plain text (without images)
    clean_text = clean_html_content(clean_html, {})
    
    # Truncate to max_length
    if len(clean_text) > max_length:
        return clean_text[:max_length].rsplit(' ', 1)[0] + "..."
    
    return clean_text

def convert_json_to_markdown(json_file_path: str, output_dir: str, skip_existing_images: bool = False) -> Optional[str]:
    """
    Convert a single JSON file to markdown with complete image management
    """
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading {json_file_path}: {e}")
        return None
    
    # Check if this post has the target categories
    categories = data.get('categories', [])
    if not any(cat in TARGET_CATEGORIES for cat in categories):
        return None
    
    # Extract basic information
    title = data.get('title', 'Untitled')
    content = data.get('content', '')
    date_str = data.get('date', '')
    tags = data.get('tags', [])
    author = data.get('author', 'admin')
    url = data.get('url', '')
    
    # Parse date
    publish_date = extract_date_from_string(date_str)
    if not publish_date:
        # Try to extract from URL
        url_match = re.search(r'/(\d{4})/(\d{2})/(\d{2})/', url)
        if url_match:
            publish_date = f"{url_match.group(1)}-{url_match.group(2)}-{url_match.group(3)}"
        else:
            publish_date = datetime.now().strftime("%Y-%m-%d")
    
    # Generate filename and slug
    filename = f"{publish_date}-{generate_slug(title)}.md"
    slug = generate_slug(title)
    
    # Extract excerpt (disabled - Astro will auto-generate)
    # excerpt = extract_excerpt(content)  # Commented out - Astro handles this automatically
    
    # Create image folder using the full filename (without .md extension)
    folder_name = filename.replace('.md', '')
    article_image_folder = os.path.join("src", "assets", "images", "news", folder_name)
    os.makedirs(article_image_folder, exist_ok=True)
    
    # Extract ALL images
    all_images = extract_all_images(data)
    print(f"  📸 Found {len(all_images)} images")
    
    # Download images and create mapping
    image_mapping = {}  # original_url -> local_filename
    featured_image_filename = ""
    
    for i, img_info in enumerate(all_images, 1):
        original_url = img_info['url']
        print(f"    Processing {img_info['type']} image {i}: {os.path.basename(original_url)}")
        
        local_filename = download_image(original_url, article_image_folder, i, skip_existing_images)
        if local_filename:
            image_mapping[original_url] = local_filename
            print(f"      ✅ Saved as: {local_filename}")
            
            # Set featured image (first one or explicitly featured)
            if not featured_image_filename and img_info['type'] == 'featured':
                featured_image_filename = local_filename
        else:
            print(f"      ❌ Failed to download")
    
    # If no featured image was found, use the first image
    if not featured_image_filename and image_mapping:
        featured_image_filename = list(image_mapping.values())[0]
    
    # Create image mapping for content (original_url -> relative_path)
    content_image_mapping = {}
    for original_url, local_filename in image_mapping.items():
        content_image_mapping[original_url] = f"../../assets/images/news/{folder_name}/{local_filename}"
    
    # Clean content and replace image URLs
    clean_content = clean_html_content(content, content_image_mapping)
    
    # Generate frontmatter with correct featuredImage path
    featured_image_path = f"../../assets/images/news/{folder_name}/{featured_image_filename}" if featured_image_filename else ""
    
    frontmatter = f"""---
title: "{title}"
publishDate: {publish_date}
featuredImage: "{featured_image_path}"
category: "{categories[0] if categories else '過往活動'}"
tags: {json.dumps(tags, ensure_ascii=False)}
author: "{author}"
isFeatured: false
externalLink: "{url}"
wpSlug: "{slug}"
wpDate: "{publish_date.replace('-', '/')}"
readingTime: 1
---

"""
    
    # Create markdown content
    markdown_content = frontmatter + clean_content
    
    # Write to file
    output_path = os.path.join(output_dir, filename)
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(markdown_content)
        return output_path
    except Exception as e:
        print(f"Error writing {output_path}: {e}")
        return None

def cleanup_markdown_files(output_dir: str):
    """
    Clean up markdown files from output directory
    """
    if os.path.exists(output_dir):
        for file in os.listdir(output_dir):
            if file.endswith('.md'):
                os.remove(os.path.join(output_dir, file))
        print(f"🧹 Cleaned up markdown files from {output_dir}")

def main():
    """
    Main conversion function
    """
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Convert JSON to Markdown with image management')
    parser.add_argument('--download-images', action='store_true', 
                       help='Download images (default: skip if images exist)')
    parser.add_argument('--force-download', action='store_true',
                       help='Force download images even if they exist')
    args = parser.parse_args()
    
    # Create output directory directly in src/content/news
    output_dir = "src/content/news"
    os.makedirs(output_dir, exist_ok=True)
    
    # Create src/assets/images/news directory
    src_images_dir = os.path.join("src", "assets", "images", "news")
    os.makedirs(src_images_dir, exist_ok=True)
    
    # Source directory
    source_dir = "xml-guided-migration-data/pages"
    
    if not os.path.exists(source_dir):
        print(f"Source directory {source_dir} not found!")
        return
    
    # Determine image download behavior
    if args.force_download:
        skip_existing_images = False
        print("🔄 Force downloading all images")
    elif args.download_images:
        skip_existing_images = False
        print("🔄 Downloading images (skip if already exist)")
    else:
        skip_existing_images = True
        print("🔄 Skipping image downloads (images already exist)")
    
    # Clean up existing markdown files
    cleanup_markdown_files(output_dir)
    
    # Get all JSON files
    json_files = [f for f in os.listdir(source_dir) if f.endswith('.json')]
    
    print(f"Found {len(json_files)} JSON files")
    print(f"Target categories: {TARGET_CATEGORIES}")
    print(f"Output directory: {output_dir}")
    print(f"Images directory: {src_images_dir}")
    print("-" * 50)
    
    converted_count = 0
    skipped_count = 0
    
    for json_file in json_files:
        json_path = os.path.join(source_dir, json_file)
        print(f"Processing: {json_file}")
        
        result = convert_json_to_markdown(json_path, output_dir, skip_existing_images)
        
        if result:
            print(f"  ✅ Converted: {os.path.basename(result)}")
            converted_count += 1
        else:
            print(f"  ❌ Skipped (no target categories)")
            skipped_count += 1
    
    print("-" * 50)
    print(f"Conversion complete!")
    print(f"Converted: {converted_count} files")
    print(f"Skipped: {skipped_count} files")
    print(f"Output directory: {output_dir}")
    print(f"Images organized in: {src_images_dir}")
    
    # List converted files
    if converted_count > 0:
        print("\nConverted files:")
        for file in sorted(os.listdir(output_dir)):
            if file.endswith('.md'):
                print(f"  - {file}")
    
    # Show image organization
    print(f"\nImage organization:")
    print(f"  📁 {src_images_dir}/")
    print(f"    └── [article-slug]/")
    print(f"        ├── image1.jpg")
    print(f"        ├── image2.png")
    print(f"        └── ...")
    
    print(f"\n📋 Next steps:")
    print(f"1. ✅ Markdown files are already in {output_dir}/")
    print(f"2. ✅ Images are organized in {src_images_dir}/")
    print(f"3. Test build to ensure everything works correctly")
    print(f"4. Run 'npm run build' to build the site")

if __name__ == "__main__":
    main() 