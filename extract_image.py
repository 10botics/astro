import base64
import re
import os
import requests
from urllib.parse import urlparse
import glob
import sys
import argparse

def extract_base64_images(content, output_dir):
    """Extract all base64 images from content"""
    # Pattern to match base64 images with different formats
    patterns = [
        r'data:image/([^;]+);base64,([A-Za-z0-9+/=]+)',  # Standard base64
        r'!\[.*?\]\(data:image/([^;]+);base64,([A-Za-z0-9+/=]+)\)',  # Markdown base64
        r'<img[^>]*src="data:image/([^;]+);base64,([A-Za-z0-9+/=]+)"[^>]*>',  # HTML img base64
    ]
    
    extracted_images = []
    
    for pattern in patterns:
        matches = re.finditer(pattern, content)
        for i, match in enumerate(matches):
            try:
                image_format = match.group(1)
                base64_data = match.group(2)
                
                # Decode base64 data
                image_data = base64.b64decode(base64_data)
                
                # Generate filename
                filename = f"base64_image_{i+1}.{image_format}"
                filepath = os.path.join(output_dir, filename)
                
                # Save image
                with open(filepath, 'wb') as f:
                    f.write(image_data)
                
                extracted_images.append(filepath)
                print(f"Extracted base64 image: {filename}")
                
            except Exception as e:
                print(f"Error extracting base64 image: {e}")
    
    return extracted_images

def extract_external_images(content, output_dir):
    """Extract all external image URLs from content"""
    # Patterns to match external image URLs
    patterns = [
        r'!\[.*?\]\((https?://[^)]+\.(?:jpg|jpeg|png|gif|webp|svg))\)',  # Markdown images
        r'<img[^>]*src="(https?://[^"]+\.(?:jpg|jpeg|png|gif|webp|svg))"[^>]*>',  # HTML img tags
        r'https?://[^\s<>"\)]+\.(?:jpg|jpeg|png|gif|webp|svg)',  # General image URLs
    ]
    
    extracted_images = []
    seen_urls = set()
    
    for pattern in patterns:
        matches = re.finditer(pattern, content)
        for i, match in enumerate(matches):
            url = match.group(1) if len(match.groups()) > 0 else match.group(0)
            
            if url in seen_urls:
                continue
            seen_urls.add(url)
            
            try:
                # Download image
                response = requests.get(url, timeout=10)
                response.raise_for_status()
                
                # Determine file extension from URL or content-type
                parsed_url = urlparse(url)
                filename = os.path.basename(parsed_url.path)
                
                if not filename or '.' not in filename:
                    # Try to get extension from content-type
                    content_type = response.headers.get('content-type', '')
                    if 'jpeg' in content_type or 'jpg' in content_type:
                        ext = 'jpg'
                    elif 'png' in content_type:
                        ext = 'png'
                    elif 'gif' in content_type:
                        ext = 'gif'
                    elif 'webp' in content_type:
                        ext = 'webp'
                    elif 'svg' in content_type:
                        ext = 'svg'
                    else:
                        ext = 'jpg'  # default
                    filename = f"external_image_{i+1}.{ext}"
                else:
                    # Clean filename
                    filename = re.sub(r'[^\w\-_.]', '_', filename)
                    if not filename:
                        filename = f"external_image_{i+1}.jpg"
                
                filepath = os.path.join(output_dir, filename)
                
                # Save image
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                
                extracted_images.append(filepath)
                print(f"Downloaded external image: {filename} from {url}")
                
            except Exception as e:
                print(f"Error downloading image from {url}: {e}")
    
    return extracted_images

def process_markdown_file(file_path, output_dir):
    """Process a single markdown file"""
    print(f"\nProcessing: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        try:
            with open(file_path, 'r', encoding='latin-1') as f:
                content = f.read()
        except Exception as e:
            print(f"Error reading file {file_path}: {e}")
            return []
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Extract base64 images
    base64_images = extract_base64_images(content, output_dir)
    
    # Extract external images
    external_images = extract_external_images(content, output_dir)
    
    total_images = base64_images + external_images
    print(f"Total images extracted from {file_path}: {len(total_images)}")
    
    return total_images

def main():
    """Main function to process specific markdown files"""
    parser = argparse.ArgumentParser(description='Extract images from markdown files')
    parser.add_argument('files', nargs='+', help='Markdown files to process')
    parser.add_argument('--output-dir', default='src/assets/images/school-courses', 
                       help='Base output directory for extracted images')
    
    args = parser.parse_args()
    
    all_extracted_images = []
    
    for file_path in args.files:
        # Check if file exists
        if not os.path.exists(file_path):
            print(f"Warning: File {file_path} does not exist, skipping...")
            continue
        
        # Check if file is a markdown file
        if not file_path.lower().endswith('.md'):
            print(f"Warning: File {file_path} is not a markdown file, skipping...")
            continue
        
        # Create output directory based on filename
        filename = os.path.splitext(os.path.basename(file_path))[0]
        output_dir = os.path.join(args.output_dir, filename)
        
        extracted_images = process_markdown_file(file_path, output_dir)
        all_extracted_images.extend(extracted_images)
    
    print(f"\nSummary: Extracted {len(all_extracted_images)} images total")
    for img_path in all_extracted_images:
        print(f"  - {img_path}")

if __name__ == "__main__":
    main() 