#!/usr/bin/env python3
"""
Extract distinct categories from parsed-site-data.json
"""

import json
from collections import Counter
from typing import List, Dict, Any

def extract_categories(json_file_path: str) -> Dict[str, Any]:
    """
    Extract all distinct categories from the JSON file
    
    Args:
        json_file_path: Path to the JSON file
        
    Returns:
        Dictionary containing category analysis
    """
    try:
        with open(json_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
    except FileNotFoundError:
        print(f"Error: File '{json_file_path}' not found.")
        return {}
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON format - {e}")
        return {}
    
    # Extract items array from the JSON structure
    if isinstance(data, dict) and 'items' in data:
        items = data['items']
    else:
        items = data if isinstance(data, list) else []
    
    # Extract all categories
    all_categories = []
    category_counts = Counter()
    posts_with_categories = 0
    posts_without_categories = 0
    
    for item in items:
        if isinstance(item, dict) and 'categories' in item:
            categories = item.get('categories', [])
            
            if categories:
                posts_with_categories += 1
                for category in categories:
                    if isinstance(category, str) and category.strip():
                        all_categories.append(category.strip())
                        category_counts[category.strip()] += 1
            else:
                posts_without_categories += 1
    
    # Get distinct categories
    distinct_categories = list(set(all_categories))
    distinct_categories.sort()  # Sort alphabetically
    
    return {
        'total_posts': len(items),
        'posts_with_categories': posts_with_categories,
        'posts_without_categories': posts_without_categories,
        'distinct_categories': distinct_categories,
        'category_counts': dict(category_counts.most_common()),
        'all_categories': all_categories
    }

def print_category_analysis(analysis: Dict[str, Any]) -> None:
    """
    Print formatted category analysis
    
    Args:
        analysis: Category analysis dictionary
    """
    if not analysis:
        return
    
    print("=" * 60)
    print("📊 CATEGORY ANALYSIS FROM PARSED-SITE-DATA.JSON")
    print("=" * 60)
    
    print(f"\n📈 OVERVIEW:")
    print(f"   Total posts in JSON: {analysis['total_posts']}")
    print(f"   Posts with categories: {analysis['posts_with_categories']}")
    print(f"   Posts without categories: {analysis['posts_without_categories']}")
    
    print(f"\n🏷️  DISTINCT CATEGORIES ({len(analysis['distinct_categories'])}):")
    for i, category in enumerate(analysis['distinct_categories'], 1):
        count = analysis['category_counts'].get(category, 0)
        print(f"   {i:2d}. {category} ({count} posts)")
    
    print(f"\n📊 CATEGORY FREQUENCY (sorted by count):")
    for category, count in analysis['category_counts'].items():
        percentage = (count / analysis['posts_with_categories']) * 100 if analysis['posts_with_categories'] > 0 else 0
        print(f"   {category}: {count} posts ({percentage:.1f}%)")
    
    print(f"\n📝 ALL CATEGORIES (in order of appearance):")
    for i, category in enumerate(analysis['all_categories'], 1):
        print(f"   {i:3d}. {category}")

def main():
    """Main function"""
    json_file_path = "xml-guided-migration-data/xml-data/parsed-site-data.json"
    
    print("🔍 Extracting categories from JSON file...")
    analysis = extract_categories(json_file_path)
    
    if analysis:
        print_category_analysis(analysis)
        
        # Save results to a file
        output_file = "category_analysis_results.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(analysis, f, ensure_ascii=False, indent=2)
        print(f"\n💾 Results saved to: {output_file}")
    else:
        print("❌ Failed to extract categories.")

if __name__ == "__main__":
    main() 