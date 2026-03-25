# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Landing page / product catalog for **TuftForest GT** — a Guatemalan handmade tufting-technique rug company. Built with Next.js 14 (App Router), Tailwind CSS, TypeScript, exported as static HTML for GitHub Pages.

## Commands

```bash
npm run dev      # Development server (localhost:3000)
npm run build    # Static export → out/
npm run lint     # ESLint
```

## Deployment

- Static export via `next.config.mjs` (`output: 'export'`)
- GitHub Actions workflow at `.github/workflows/deploy.yml` builds and deploys to GitHub Pages automatically on push to `main`
- Images must be in `public/` since `next/image` is set to `unoptimized: true`

## Architecture

```
app/
  layout.tsx          # Root layout — sets Spanish metadata, imports globals.css
  page.tsx            # Assembles all sections in order
  globals.css         # Tailwind + custom component classes (btn-primary, section-title…)
  components/
    Navbar.tsx        # Fixed, transparent → opaque on scroll. Client component.
    Hero.tsx          # Full-screen image collage background + overlay + CTAs
    Catalog.tsx       # Image grid with load-more pagination + lightbox. Client component.
    About.tsx         # Misión/Visión + 4-step process cards
    Contact.tsx       # Instagram DM CTA + social channel cards
    Footer.tsx        # Logo + copyright + social icons

public/
  images/
    logo/logo.jpg         # Brand logo
    products/*.jpg        # 152 product images (converted from HEIC originals)

images/                   # Source images (not served — originals only)
  logo/
  converted/              # HEIC → JPG intermediates (source for public/images/products/)
  Proyectos 1.0/          # Original HEIC files from iPhone
```

## Color palette (tailwind.config.ts)

Custom colors: `forest-50` through `forest-950` (greens), `moss`, `bark`, `cream` (`#f5f0e8`), `mist` (`#e8ede5`). Background is `cream`.

## Social links

- Instagram: `https://www.instagram.com/tuftforest_gt`
- TikTok: `https://www.tiktok.com/@tuftforest_gt`

## Adding new product images

1. Convert HEIC → JPG: `sips -s format jpeg INPUT.HEIC --out OUTPUT.jpg -Z 1200`
2. Place `.jpg` in `public/images/products/`
3. Add filename to the `ALL_IMAGES` array in `app/components/Catalog.tsx`
