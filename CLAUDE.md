# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at localhost:4321
npm run build      # Production build to ./dist/
npm run preview    # Preview production build locally
```

No test or lint commands are configured.

## Architecture

This is a static site built with **Astro 5** using content collections, MDX, and vanilla CSS. No Tailwind — all styling uses CSS custom properties and component-scoped `<style>` blocks.

### Content Pipeline

Blog posts live in `src/content/blog/` as `.md`/`.mdx` files. Schema is defined in `src/content.config.ts` with standard fields (title, description, pubDate, heroImage) plus AI-themed metadata fields (aiModel, aiConfidence, etc.). The `[...slug].astro` page auto-derives reading time, token count, and AI latency from word count.

### Page Themes

Each section has a distinct cinematic visual aesthetic with heavy inline CSS and JavaScript animations:

- **Home (`/`)** — Matrix falling characters (canvas-based), body class `page-home`
- **Blog list (`/blog/`)** — Blade Runner cyberpunk with rain, scanlines, dust particles, body class `br-page`
- **Article & About pages** — AI terminal style with SVG mesh network (58 nodes), read progress bar, scroll-triggered paragraph reveal, body class `mesh-page`

### Key Files

- `src/layouts/BlogPost.astro` — Primary layout (~940 lines), used by both blog posts and the about page. Contains mesh animation, progress bar, related posts grid, and extensive inline styles/scripts.
- `src/pages/blog/[...page].astro` — Paginated blog list (9 per page) with rain/cyberpunk effects.
- `src/pages/index.astro` — Home page with Matrix canvas animation.
- `src/consts.ts` — Site title and description constants.
- `src/components/BaseHead.astro` — Meta tags, font preloads, global CSS import.

### Patterns

- Animations respect `prefers-reduced-motion` media query.
- Images are optimized via `sharp` and Astro's `Image` component (stored in `src/assets/`).
- Global styles in `src/styles/global.css`; page-specific styles are inline within each `.astro` file.
- Site is purely static (no API endpoints, no SSR).
