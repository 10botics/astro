#!/usr/bin/env python3
"""
Sitemap Comparison Tool
Compares local sitemap-0.xml with live sitemap from 10botics.com
Outputs results as HTML report
"""

import xml.etree.ElementTree as ET
import requests
from urllib.parse import urljoin, urlparse
import os
from datetime import datetime
import sys

def fetch_sitemap_urls(sitemap_url):
    """Fetch and parse URLs from a sitemap"""
    try:
        response = requests.get(sitemap_url, timeout=30)
        response.raise_for_status()
        
        root = ET.fromstring(response.content)
        
        # Handle namespaces
        namespaces = {
            'sitemap': 'http://www.sitemaps.org/schemas/sitemap/0.9'
        }
        
        urls = set()
        
        # Check if it's a sitemap index
        sitemaps = root.findall('.//sitemap:sitemap', namespaces)
        if sitemaps:
            print(f"Found sitemap index with {len(sitemaps)} sitemaps")
            for sitemap in sitemaps:
                loc_elem = sitemap.find('sitemap:loc', namespaces)
                if loc_elem is not None:
                    sub_sitemap_url = loc_elem.text.strip()
                    print(f"Processing sub-sitemap: {sub_sitemap_url}")
                    sub_urls = fetch_sitemap_urls(sub_sitemap_url)
                    urls.update(sub_urls)
        else:
            # It's a regular sitemap
            url_elements = root.findall('.//sitemap:url', namespaces)
            print(f"Found {len(url_elements)} URLs in sitemap")
            for url_elem in url_elements:
                loc_elem = url_elem.find('sitemap:loc', namespaces)
                if loc_elem is not None:
                    urls.add(loc_elem.text.strip())
        
        return urls
    
    except requests.RequestException as e:
        print(f"Error fetching {sitemap_url}: {e}")
        return set()
    except ET.ParseError as e:
        print(f"Error parsing XML from {sitemap_url}: {e}")
        return set()

def parse_local_sitemap(file_path):
    """Parse local sitemap file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        root = ET.fromstring(content)
        
        # Handle namespaces
        namespaces = {
            'sitemap': 'http://www.sitemaps.org/schemas/sitemap/0.9'
        }
        
        urls = set()
        url_elements = root.findall('.//sitemap:url', namespaces)
        print(f"Found {len(url_elements)} URLs in local sitemap")
        
        for url_elem in url_elements:
            loc_elem = url_elem.find('sitemap:loc', namespaces)
            if loc_elem is not None:
                urls.add(loc_elem.text.strip())
        
        return urls
    
    except FileNotFoundError:
        print(f"Error: Local sitemap file '{file_path}' not found")
        return set()
    except ET.ParseError as e:
        print(f"Error parsing local sitemap: {e}")
        return set()

def generate_html_report(local_urls, live_urls, output_file):
    """Generate HTML comparison report"""
    
    # Calculate differences
    only_in_local = local_urls - live_urls
    only_in_live = live_urls - local_urls
    common_urls = local_urls & live_urls
    
    # Generate HTML
    html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sitemap Comparison Report</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        h1 {{
            color: #333;
            text-align: center;
            border-bottom: 3px solid #007bff;
            padding-bottom: 10px;
        }}
        .summary {{
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 5px solid #007bff;
        }}
        .summary h2 {{
            margin-top: 0;
            color: #495057;
        }}
        .stats {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }}
        .stat-card {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }}
        .stat-number {{
            font-size: 2em;
            font-weight: bold;
            display: block;
        }}
        .stat-label {{
            font-size: 0.9em;
            opacity: 0.9;
        }}
        .section {{
            margin: 30px 0;
            padding: 20px;
            border-radius: 5px;
        }}
        .only-local {{
            background-color: #fff3cd;
            border-left: 5px solid #ffc107;
        }}
        .only-live {{
            background-color: #d1ecf1;
            border-left: 5px solid #17a2b8;
        }}
        .common {{
            background-color: #d4edda;
            border-left: 5px solid #28a745;
        }}
        .section h3 {{
            margin-top: 0;
            color: #495057;
        }}
        .url-list {{
            max-height: 400px;
            overflow-y: auto;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            background-color: white;
        }}
        .url-item {{
            padding: 8px 12px;
            border-bottom: 1px solid #f1f3f4;
            font-family: monospace;
            font-size: 0.9em;
            word-break: break-all;
        }}
        .url-item:hover {{
            background-color: #f8f9fa;
        }}
        .url-item:last-child {{
            border-bottom: none;
        }}
        .timestamp {{
            text-align: center;
            color: #6c757d;
            font-size: 0.9em;
            margin-top: 20px;
        }}
        .toggle-btn {{
            background-color: #007bff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-bottom: 10px;
        }}
        .toggle-btn:hover {{
            background-color: #0056b3;
        }}
        .hidden {{
            display: none;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Sitemap Comparison Report</h1>
        
        <div class="summary">
            <h2>📊 Summary</h2>
            <p><strong>Local Sitemap:</strong> dist/sitemap-0.xml</p>
            <p><strong>Live Sitemap:</strong> https://10botics.com/sitemap_index.xml</p>
            <p><strong>Generated:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <span class="stat-number">{len(local_urls)}</span>
                <span class="stat-label">Local URLs</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">{len(live_urls)}</span>
                <span class="stat-label">Live URLs</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">{len(common_urls)}</span>
                <span class="stat-label">Common URLs</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">{len(only_in_local) + len(only_in_live)}</span>
                <span class="stat-label">Differences</span>
            </div>
        </div>
        
        <div class="section only-local">
            <h3>⚠️ URLs Only in Local Sitemap ({len(only_in_local)})</h3>
            <p>These URLs exist in your local sitemap but not in the live sitemap:</p>
            <button class="toggle-btn" onclick="toggleSection('local-urls')">Show/Hide URLs</button>
            <div id="local-urls" class="url-list">
                {generate_url_list(only_in_local)}
            </div>
        </div>
        
        <div class="section only-live">
            <h3>🌐 URLs Only in Live Sitemap ({len(only_in_live)})</h3>
            <p>These URLs exist in the live sitemap but not in your local sitemap:</p>
            <button class="toggle-btn" onclick="toggleSection('live-urls')">Show/Hide URLs</button>
            <div id="live-urls" class="url-list">
                {generate_url_list(only_in_live)}
            </div>
        </div>
        
        <div class="section common">
            <h3>✅ Common URLs ({len(common_urls)})</h3>
            <p>These URLs exist in both sitemaps:</p>
            <button class="toggle-btn" onclick="toggleSection('common-urls')">Show/Hide URLs</button>
            <div id="common-urls" class="url-list hidden">
                {generate_url_list(common_urls)}
            </div>
        </div>
        
        <div class="timestamp">
            Report generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}
        </div>
    </div>
    
    <script>
        function toggleSection(sectionId) {{
            const section = document.getElementById(sectionId);
            section.classList.toggle('hidden');
        }}
    </script>
</body>
</html>
"""
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"HTML report generated: {output_file}")

def generate_url_list(urls):
    """Generate HTML for URL list"""
    if not urls:
        return '<div class="url-item">No URLs found</div>'
    
    sorted_urls = sorted(urls)
    url_items = []
    for url in sorted_urls:
        url_items.append(f'<div class="url-item">{url}</div>')
    
    return '\n'.join(url_items)

def main():
    print("🔍 Sitemap Comparison Tool")
    print("=" * 50)
    
    # Configuration
    local_sitemap_path = "dist/sitemap-0.xml"
    live_sitemap_url = "https://10botics.com/sitemap_index.xml"
    output_file = "sitemap_comparison_report.html"
    
    # Check if local sitemap exists
    if not os.path.exists(local_sitemap_path):
        print(f"❌ Error: Local sitemap file '{local_sitemap_path}' not found")
        print("Please make sure the file exists in the dist directory")
        sys.exit(1)
    
    print(f"📁 Reading local sitemap: {local_sitemap_path}")
    local_urls = parse_local_sitemap(local_sitemap_path)
    
    print(f"🌐 Fetching live sitemap: {live_sitemap_url}")
    live_urls = fetch_sitemap_urls(live_sitemap_url)
    
    if not local_urls and not live_urls:
        print("❌ Error: No URLs found in either sitemap")
        sys.exit(1)
    
    print(f"\n📊 Results:")
    print(f"   Local URLs: {len(local_urls)}")
    print(f"   Live URLs: {len(live_urls)}")
    print(f"   Common URLs: {len(local_urls & live_urls)}")
    print(f"   Only in local: {len(local_urls - live_urls)}")
    print(f"   Only in live: {len(live_urls - local_urls)}")
    
    print(f"\n📝 Generating HTML report...")
    generate_html_report(local_urls, live_urls, output_file)
    
    print(f"\n✅ Comparison complete!")
    print(f"📄 Report saved as: {output_file}")
    print(f"🔗 Open the file in your browser to view the detailed comparison")

if __name__ == "__main__":
    main()
