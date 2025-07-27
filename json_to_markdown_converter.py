#!/usr/bin/env python3
"""
Convert JSON files from pages directory to markdown format
Only processes files with specified categories
"""

import json
import os
import re
import requests
from datetime import datetime
from typing import Dict, Any, Optional
from bs4 import BeautifulSoup
from urllib.parse import urlparse

# Categories to include
TARGET_CATEGORIES = ["文章", "最新消息", "資助申請", "過往活動"]

def extract_featured_image(data: Dict[str, Any]) -> Optional[str]:
    """
    Extract featured image from multiple sources in the JSON data
    """
    # 1. Try to get from og:image meta tag
    if 'crawledData' in data and 'metaTags' in data['crawledData']:
        meta_tags = data['crawledData']['metaTags']
        if 'og:image' in meta_tags and meta_tags['og:image']:
            return meta_tags['og:image']
    
    # 2. Try to get from featuredImage field
    if data.get('featuredImage'):
        return data['featuredImage']
    
    # 3. Try to get first image from content
    content = data.get('content', '')
    if content:
        # Look for img tags in content
        soup = BeautifulSoup(content, 'html.parser')
        img_tags = soup.find_all('img')
        if img_tags:
            for img in img_tags:
                src = img.get('src')
                if src and src.startswith('http'):
                    return src
    
    # 4. Try to get from crawledData.media array
    if 'crawledData' in data and 'media' in data['crawledData']:
        media = data['crawledData']['media']
        for item in media:
            if item.get('type') == 'image' and item.get('src'):
                src = item['src']
                if src.startswith('http'):
                    return src
    
    return None

def download_image(image_url: str, output_dir: str, filename: str) -> Optional[str]:
    """
    Download image from URL and save to local directory
    """
    try:
        # Create images directory if it doesn't exist
        images_dir = os.path.join(output_dir, "images")
        os.makedirs(images_dir, exist_ok=True)
        
        # Parse URL to get file extension
        parsed_url = urlparse(image_url)
        path = parsed_url.path
        if '.' in path:
            ext = path.split('.')[-1].lower()
            if ext not in ['jpg', 'jpeg', 'png', 'gif', 'webp']:
                ext = 'jpg'  # default to jpg
        else:
            ext = 'jpg'
        
        # Create local filename
        local_filename = f"{filename}.{ext}"
        local_path = os.path.join(images_dir, local_filename)
        
        # Download image
        response = requests.get(image_url, timeout=10)
        response.raise_for_status()
        
        with open(local_path, 'wb') as f:
            f.write(response.content)
        
        # Return relative path for frontmatter
        return f"/images/{local_filename}"
        
    except Exception as e:
        print(f"  ⚠️  Failed to download image {image_url}: {e}")
        return None

def clean_html_content(html_content: str) -> str:
    """
    Convert HTML content to clean markdown
    """
    if not html_content:
        return ""
    
    # Parse HTML with BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')
    
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
    
    # Images
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
    
    # Get the cleaned text
    text = soup.get_text()
    
    # Clean up extra whitespace
    text = re.sub(r'\n\s*\n', '\n\n', text)
    text = re.sub(r' +', ' ', text)
    
    return text.strip()

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
    Extract excerpt from content
    """
    if not content:
        return ""
    
    # Clean HTML and get plain text
    clean_text = clean_html_content(content)
    
    # Truncate to max_length
    if len(clean_text) > max_length:
        return clean_text[:max_length].rsplit(' ', 1)[0] + "..."
    
    return clean_text

def convert_json_to_markdown(json_file_path: str, output_dir: str) -> Optional[str]:
    """
    Convert a single JSON file to markdown
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
    
    # Generate filename
    filename = f"{publish_date}-{generate_slug(title)}.md"
    
    # Extract excerpt
    excerpt = extract_excerpt(content)
    
    # Extract featured image
    featured_image_url = extract_featured_image(data)
    featured_image_path = ""
    
    if featured_image_url:
        print(f"  📸 Found featured image: {featured_image_url}")
        # Download image
        slug = generate_slug(title)
        downloaded_path = download_image(featured_image_url, output_dir, slug)
        if downloaded_path:
            featured_image_path = downloaded_path
            print(f"  ✅ Downloaded image: {downloaded_path}")
        else:
            # Use original URL if download fails
            featured_image_path = featured_image_url
    else:
        print(f"  ⚠️  No featured image found")
    
    # Clean content
    clean_content = clean_html_content(content)
    
    # Generate frontmatter
    frontmatter = f"""---
title: "{title}"
excerpt: "{excerpt}"
publishDate: {publish_date}
featuredImage: "{featured_image_path}"
category: "{categories[0] if categories else '過往活動'}"
tags: {json.dumps(tags, ensure_ascii=False)}
author: "{author}"
isFeatured: false
externalLink: "{url}"
wpSlug: "{generate_slug(title)}"
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

def main():
    """
    Main conversion function
    """
    # Create temporary output directory
    output_dir = "temp_converted_news"
    os.makedirs(output_dir, exist_ok=True)
    
    # Source directory
    source_dir = "xml-guided-migration-data/pages"
    
    if not os.path.exists(source_dir):
        print(f"Source directory {source_dir} not found!")
        return
    
    # Get all JSON files
    json_files = [f for f in os.listdir(source_dir) if f.endswith('.json')]
    
    print(f"Found {len(json_files)} JSON files")
    print(f"Target categories: {TARGET_CATEGORIES}")
    print(f"Output directory: {output_dir}")
    print("-" * 50)
    
    converted_count = 0
    skipped_count = 0
    
    for json_file in json_files:
        json_path = os.path.join(source_dir, json_file)
        print(f"Processing: {json_file}")
        
        result = convert_json_to_markdown(json_path, output_dir)
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
    
    # List converted files
    if converted_count > 0:
        print("\nConverted files:")
        for file in sorted(os.listdir(output_dir)):
            if file.endswith('.md'):
                print(f"  - {file}")

if __name__ == "__main__":
    main() 