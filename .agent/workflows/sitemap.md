---
description: How to generate and manage sitemaps
---

# Sitemap Generation Workflow

## Available Commands

### 1. Normal Build (Fast - No Sitemap Regeneration)

```bash
npm run build
```

This creates a production build WITHOUT regenerating the sitemap. It uses the existing sitemap files if they were previously generated.

### 2. Build WITH Sitemap Generation

```bash
npm run build:sitemap
```

This creates a production build AND regenerates all sitemap files. Use this when:

- New lawyers have been added
- New specialties have been added
- You want to refresh the sitemap

### 3. Static Generation with Sitemap

```bash
npm run generate:sitemap
```

Same as above but for static site generation.

## How It Works

The sitemap is controlled by the `GENERATE_SITEMAP` environment variable:

- When `GENERATE_SITEMAP=true` → Sitemap is generated
- When not set → Sitemap generation is skipped (faster builds)
- In development mode → Sitemap is always available

## Sitemap Files Location

After generation, sitemaps are served at:

- `/sitemap_index.xml` - Main index file
- `/sitemap-0.xml`, `/sitemap-1.xml`, etc. - Individual sitemap chunks

## Downloading Sitemaps

You can download sitemaps directly from your production server:

```
https://vakilvakil.com/sitemap_index.xml
https://vakilvakil.com/sitemap-0.xml
```

## Data Sources

The sitemap pulls data from:

1. **Provinces** - `public/provinces.json`
2. **Specialties** - API endpoint
3. **Lawyers** - `public/lawyers/lawyers_part_*.json` (pre-downloaded)
