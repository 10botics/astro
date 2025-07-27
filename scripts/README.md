# WordPress to Astro Conversion Scripts

This directory contains scripts to convert WordPress XML exports to Astro pages and components.

## Overview

We provide two approaches for WordPress to Astro conversion:

1. **Crawling Approach** (Already implemented) - Crawl live WordPress sites and convert to Astro
2. **XML Export Approach** (New) - Process WordPress XML exports and convert to Astro

## XML Export Approach

### Prerequisites

- Python 3.7+
- WordPress XML export file (from WordPress Admin → Tools → Export)

### Scripts Overview

1. **`xml-chunker.py`** - Breaks down large XML files into manageable chunks
2. **`xml-to-astro-converter.py`** - Converts chunked XML data to Astro format
3. **`wordpress-to-astro-workflow.py`** - Complete workflow script

### Quick Start

```bash
# Step 1: Run the complete workflow
python scripts/wordpress-to-astro-workflow.py your-wordpress-export.xml

# Step 2: Review the converted files
ls wordpress-conversion/astro/

# Step 3: Copy files to your Astro project
cp -r wordpress-conversion/astro/pages/* src/pages/
cp -r wordpress-conversion/astro/posts/* src/content/blog/
```

### Detailed Usage

#### Step 1: Chunk the XML File

```bash
python scripts/xml-chunker.py wordpress-export.xml --chunk-size 5 --output-dir chunks
```

This creates:
- `chunks/posts-chunk-001.json`
- `chunks/pages-chunk-001.json`
- `chunks/media-chunk-001.json`
- `chunks/summary.json`

#### Step 2: Convert to Astro

```bash
python scripts/xml-to-astro-converter.py chunks --output-dir converted-astro
```

This creates:
- `converted-astro/pages/` - Static pages
- `converted-astro/posts/` - Blog posts
- `converted-astro/index.astro` - Index page

#### Step 3: Integrate with Astro Project

```bash
# Copy pages to your Astro project
cp -r converted-astro/pages/* src/pages/

# Copy posts to content collection
cp -r converted-astro/posts/* src/content/blog/

# Update your Astro config to handle the new content
```

### Configuration Options

#### Chunking Options

- `--chunk-size`: Number of items per chunk (default: 5)
- `--output-dir`: Output directory for chunks

#### Conversion Options

- `--output-dir`: Output directory for Astro files
- HTML cleaning and shortcode removal
- Frontmatter generation
- Media handling

### Workflow Script Options

```bash
# Basic usage
python scripts/wordpress-to-astro-workflow.py export.xml

# Custom chunk size
python scripts/wordpress-to-astro-workflow.py export.xml --chunk-size 10

# Custom output directory
python scripts/wordpress-to-astro-workflow.py export.xml --output-dir my-conversion

# Skip chunking (use existing chunks)
python scripts/wordpress-to-astro-workflow.py export.xml --skip-chunking

# Skip conversion (only chunk)
python scripts/wordpress-to-astro-workflow.py export.xml --skip-conversion

# Only create configuration
python scripts/wordpress-to-astro-workflow.py export.xml --config-only
```

## Output Structure

```
wordpress-conversion/
├── chunks/
│   ├── posts-chunk-001.json
│   ├── pages-chunk-001.json
│   ├── media-chunk-001.json
│   └── summary.json
├── astro/
│   ├── pages/
│   │   ├── about-us.astro
│   │   ├── contact.astro
│   │   └── services.astro
│   ├── posts/
│   │   ├── first-blog-post.astro
│   │   └── second-blog-post.astro
│   └── index.astro
└── conversion-summary.json
```

## Content Processing

### HTML Cleaning

The converter automatically:
- Removes WordPress shortcodes
- Converts HTML tags to Markdown
- Cleans up formatting
- Preserves links and images

### Frontmatter Generation

Each Astro file includes:
- Title
- Publication date
- Categories and tags
- Layout reference

### Media Handling

- Extracts image URLs from content
- Preserves image references
- Can be extended to download media files

## Customization

### Modify HTML Cleaning

Edit `xml-to-astro-converter.py` to customize:
- Shortcode handling
- HTML tag conversion
- Content formatting

### Custom Frontmatter

Modify `create_astro_frontmatter()` to add:
- Custom metadata
- SEO fields
- Layout options

### Styling Integration

The converted files use:
- Tailwind CSS classes
- Prose styling for content
- Responsive design

## Troubleshooting

### Common Issues

1. **Large XML files**: Use smaller chunk sizes
2. **Encoding issues**: Ensure XML is UTF-8 encoded
3. **Missing dependencies**: Install required Python modules

### Debug Mode

Add `--verbose` to see detailed processing information:

```bash
python scripts/xml-chunker.py export.xml --verbose
```

### Error Handling

- Check `conversion-summary.json` for processing status
- Review individual chunk files for content issues
- Validate XML file format before processing

## Integration with Existing Astro Project

1. **Copy converted files** to appropriate directories
2. **Update routing** in `astro.config.mjs`
3. **Customize layouts** as needed
4. **Test pages** in development server
5. **Optimize images** and assets

## Comparison: Crawling vs XML Export

| Aspect | Crawling Approach | XML Export Approach |
|--------|------------------|-------------------|
| **Data Source** | Live website | WordPress export |
| **Content** | Current state | Historical data |
| **Media** | Downloaded | URLs only |
| **Processing** | Real-time | Batch |
| **Dependencies** | Website access | XML file |
| **Customization** | Limited | Full control |

## Next Steps

After conversion:

1. **Review converted content** for accuracy
2. **Customize styling** to match your design
3. **Add missing pages** or content
4. **Optimize performance** (images, code splitting)
5. **Test thoroughly** before deployment

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review conversion logs
3. Validate input XML format
4. Test with smaller datasets first 