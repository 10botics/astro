#!/usr/bin/env python3
"""
Copy selected news files from temp_converted_news to src/content/news
"""

import os
import shutil
import glob
from pathlib import Path

def list_converted_files():
    """List all converted files with their categories"""
    temp_dir = "temp_converted_news"
    if not os.path.exists(temp_dir):
        print("❌ temp_converted_news directory not found!")
        return
    
    files = glob.glob(os.path.join(temp_dir, "*.md"))
    files.sort()
    
    print(f"📁 Found {len(files)} converted files:")
    print("-" * 80)
    
    for i, file_path in enumerate(files, 1):
        filename = os.path.basename(file_path)
        # Extract category from filename or content
        category = "未知"
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                if 'category: "過往活動"' in content:
                    category = "過往活動"
                elif 'category: "文章"' in content:
                    category = "文章"
                elif 'category: "最新消息"' in content:
                    category = "最新消息"
                elif 'category: "資助申請"' in content:
                    category = "資助申請"
        except:
            pass
        
        print(f"{i:3d}. {filename}")
        print(f"     Category: {category}")
        print()

def copy_file_to_news(filename):
    """Copy a specific file to the news directory"""
    source = os.path.join("temp_converted_news", filename)
    destination = os.path.join("src/content/news", filename)
    
    if not os.path.exists(source):
        print(f"❌ File not found: {source}")
        return False
    
    if os.path.exists(destination):
        print(f"⚠️  File already exists: {destination}")
        response = input("Overwrite? (y/N): ")
        if response.lower() != 'y':
            return False
    
    try:
        shutil.copy2(source, destination)
        print(f"✅ Copied: {filename}")
        return True
    except Exception as e:
        print(f"❌ Error copying {filename}: {e}")
        return False

def copy_all_files():
    """Copy all files from temp directory to news directory"""
    temp_dir = "temp_converted_news"
    news_dir = "src/content/news"
    
    if not os.path.exists(temp_dir):
        print("❌ temp_converted_news directory not found!")
        return
    
    files = glob.glob(os.path.join(temp_dir, "*.md"))
    
    print(f"📋 Copying {len(files)} files to {news_dir}...")
    
    copied = 0
    skipped = 0
    
    for file_path in files:
        filename = os.path.basename(file_path)
        destination = os.path.join(news_dir, filename)
        
        if os.path.exists(destination):
            print(f"⚠️  Skipped (exists): {filename}")
            skipped += 1
            continue
        
        try:
            shutil.copy2(file_path, destination)
            print(f"✅ Copied: {filename}")
            copied += 1
        except Exception as e:
            print(f"❌ Error copying {filename}: {e}")
            skipped += 1
    
    print(f"\n📊 Summary:")
    print(f"   Copied: {copied} files")
    print(f"   Skipped: {skipped} files")

def main():
    """Main function"""
    print("📰 News File Copy Tool")
    print("=" * 50)
    print("1. List all converted files")
    print("2. Copy specific file")
    print("3. Copy all files")
    print("4. Exit")
    print()
    
    while True:
        choice = input("Select option (1-4): ").strip()
        
        if choice == "1":
            list_converted_files()
        elif choice == "2":
            filename = input("Enter filename to copy: ").strip()
            if filename:
                copy_file_to_news(filename)
        elif choice == "3":
            confirm = input("Copy ALL files? This may overwrite existing files. (y/N): ")
            if confirm.lower() == 'y':
                copy_all_files()
        elif choice == "4":
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid option. Please select 1-4.")
        
        print()

if __name__ == "__main__":
    main() 