#!/usr/bin/env python3
"""
Sitemap Comparison Script
Compares live sitemap from 10botics.com with local sitemap
"""

import xml.etree.ElementTree as ET
from urllib.parse import urlparse
from datetime import datetime
from collections import defaultdict
import json

def parse_sitemap_xml(xml_content):
    """Parse sitemap XML and extract URLs with metadata"""
    root = ET.fromstring(xml_content)
    
    namespaces = {
        'sitemap': 'http://www.sitemaps.org/schemas/sitemap/0.9'
    }
    
    urls_data = {}
    url_elements = root.findall('.//sitemap:url', namespaces)
    
    for url_elem in url_elements:
        loc_elem = url_elem.find('sitemap:loc', namespaces)
        if loc_elem is not None:
            url = loc_elem.text.strip()
            # Normalize URL (remove trailing slash for comparison)
            normalized_url = url.rstrip('/')
            
            lastmod_elem = url_elem.find('sitemap:lastmod', namespaces)
            changefreq_elem = url_elem.find('sitemap:changefreq', namespaces)
            priority_elem = url_elem.find('sitemap:priority', namespaces)
            
            urls_data[normalized_url] = {
                'url': url,  # Keep original URL
                'lastmod': lastmod_elem.text.strip() if lastmod_elem is not None else None,
                'changefreq': changefreq_elem.text.strip() if changefreq_elem is not None else None,
                'priority': priority_elem.text.strip() if priority_elem is not None else None
            }
    
    return urls_data

def read_local_sitemap(file_path):
    """Read and parse local sitemap file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    return parse_sitemap_xml(content)

def compare_sitemaps(live_data, local_data):
    """Compare two sitemap datasets"""
    live_urls = set(live_data.keys())
    local_urls = set(local_data.keys())
    
    only_in_live = live_urls - local_urls
    only_in_local = local_urls - live_urls
    common_urls = live_urls & local_urls
    
    # Compare metadata for common URLs
    metadata_differences = []
    for url in common_urls:
        live_item = live_data[url]
        local_item = local_data[url]
        
        differences = {}
        if live_item['lastmod'] != local_item['lastmod']:
            differences['lastmod'] = {
                'live': live_item['lastmod'],
                'local': local_item['lastmod']
            }
        if live_item['changefreq'] != local_item['changefreq']:
            differences['changefreq'] = {
                'live': live_item['changefreq'],
                'local': local_item['changefreq']
            }
        if live_item['priority'] != local_item['priority']:
            differences['priority'] = {
                'live': live_item['priority'],
                'local': local_item['priority']
            }
        
        if differences:
            metadata_differences.append({
                'url': url,
                'differences': differences
            })
    
    return {
        'only_in_live': sorted(only_in_live),
        'only_in_local': sorted(only_in_local),
        'common_urls': sorted(common_urls),
        'metadata_differences': metadata_differences,
        'stats': {
            'live_total': len(live_urls),
            'local_total': len(local_urls),
            'common_count': len(common_urls),
            'only_in_live_count': len(only_in_live),
            'only_in_local_count': len(only_in_local)
        }
    }

def generate_report(comparison_result, output_file='sitemap_comparison_report.md'):
    """Generate a markdown comparison report"""
    
    stats = comparison_result['stats']
    
    report = f"""# Sitemap Comparison Report

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Summary

| Metric | Count |
|--------|-------|
| **Total URLs in Live Sitemap** | {stats['live_total']} |
| **Total URLs in Local Sitemap** | {stats['local_total']} |
| **Common URLs** | {stats['common_count']} |
| **URLs Only in Live** | {stats['only_in_live_count']} |
| **URLs Only in Local** | {stats['only_in_local_count']} |

## Differences

### URLs Only in Live Sitemap ({stats['only_in_live_count']})

These URLs exist in the live sitemap but are missing from your local sitemap:

"""
    
    if comparison_result['only_in_live']:
        for url in comparison_result['only_in_live']:
            report += f"- {url}\n"
    else:
        report += "*No URLs found only in live sitemap*\n"
    
    report += f"\n### URLs Only in Local Sitemap ({stats['only_in_local_count']})\n\n"
    report += "These URLs exist in your local sitemap but are missing from the live sitemap:\n\n"
    
    if comparison_result['only_in_local']:
        for url in comparison_result['only_in_local']:
            report += f"- {url}\n"
    else:
        report += "*No URLs found only in local sitemap*\n"
    
    report += f"\n### Metadata Differences ({len(comparison_result['metadata_differences'])})\n\n"
    report += "URLs that exist in both sitemaps but have different metadata:\n\n"
    
    if comparison_result['metadata_differences']:
        for item in comparison_result['metadata_differences']:
            report += f"#### {item['url']}\n\n"
            for key, values in item['differences'].items():
                report += f"- **{key}**:\n"
                report += f"  - Live: `{values['live']}`\n"
                report += f"  - Local: `{values['local']}`\n"
            report += "\n"
    else:
        report += "*No metadata differences found*\n"
    
    report += "\n## Recommendations\n\n"
    
    if stats['only_in_live_count'] > 0:
        report += f"⚠️ **Action Required**: {stats['only_in_live_count']} URLs are missing from your local sitemap. "
        report += "These may be pages that were removed or should be excluded.\n\n"
    
    if stats['only_in_local_count'] > 0:
        report += f"ℹ️ **Note**: {stats['only_in_local_count']} URLs exist in your local sitemap but not in the live one. "
        report += "These may be new pages that haven't been deployed yet.\n\n"
    
    if len(comparison_result['metadata_differences']) > 0:
        report += f"📝 **Metadata**: {len(comparison_result['metadata_differences'])} URLs have different metadata. "
        report += "Review these differences to ensure consistency.\n\n"
    
    if stats['only_in_live_count'] == 0 and stats['only_in_local_count'] == 0 and len(comparison_result['metadata_differences']) == 0:
        report += "✅ **All Good**: The sitemaps are in sync! No differences found.\n\n"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"Report generated: {output_file}")
    return output_file

def fetch_live_sitemap(url):
    """Fetch live sitemap from URL"""
    try:
        import requests
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        return response.text
    except ImportError:
        print("Warning: requests library not available. Using websearch results data.")
        return None
    except Exception as e:
        print(f"Error fetching live sitemap: {e}")
        return None

def main():
    # Try to fetch the full live sitemap
    live_sitemap_url = "https://www.10botics.com/sitemap-0.xml"
    print("Fetching live sitemap...")
    live_sitemap_xml = fetch_live_sitemap(live_sitemap_url)
    
    if live_sitemap_xml is None:
        # Fallback: Use the data from websearch results (truncated)
        print("Using websearch results data (may be incomplete)...")
        # We'll read from a file if we saved it, or use the provided data
        # For now, let's try to use requests or urllib
        try:
            import urllib.request
            with urllib.request.urlopen(live_sitemap_url, timeout=30) as response:
                live_sitemap_xml = response.read().decode('utf-8')
        except Exception as e:
            print(f"Error: Could not fetch live sitemap. {e}")
            print("Please ensure you have internet access or provide the sitemap manually.")
            return
    
    print("Parsing live sitemap...")
    live_data = parse_sitemap_xml(live_sitemap_xml)
    print(f"Found {len(live_data)} URLs in live sitemap")
    
    print("\nParsing local sitemap...")
    local_data = read_local_sitemap('dist/sitemap-0.xml')
    print(f"Found {len(local_data)} URLs in local sitemap")
    
    print("\nComparing sitemaps...")
    comparison_result = compare_sitemaps(live_data, local_data)
    
    print("\nGenerating report...")
    report_file = generate_report(comparison_result)
    
    print("\n" + "="*50)
    print("COMPARISON SUMMARY")
    print("="*50)
    print(f"Live URLs: {comparison_result['stats']['live_total']}")
    print(f"Local URLs: {comparison_result['stats']['local_total']}")
    print(f"Common: {comparison_result['stats']['common_count']}")
    print(f"Only in Live: {comparison_result['stats']['only_in_live_count']}")
    print(f"Only in Local: {comparison_result['stats']['only_in_local_count']}")
    print(f"Metadata Differences: {len(comparison_result['metadata_differences'])}")
    print("="*50)
    
    return comparison_result

if __name__ == "__main__":
    main()

