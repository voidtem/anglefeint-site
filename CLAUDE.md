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

- **Home (`/`)** — Matrix falling characters (canvas), body class `page-home`
- **Blog list (`/blog/`)** — Blade Runner cyberpunk (rain, scanlines, dust), body class `br-page`
- **Article (`/blog/[slug]`)** — AI terminal mesh (58 nodes), read progress, Red Queen monitor, body class `mesh-page`
- **About (`/about`)** — Anonymous-style terminal (black/green), body class `term-page`. Right sidebar with folder buttons opening modals: DL Data, AI, Decryptor, Help (virtual keyboard), All Scripts (folder grid of blog posts).

### Key Files

- `src/pages/about.astro` — About page (~1400 lines): terminal canvas, sidebar, modals (progress, decryptor, virtual keyboard, folder grid), `getCollection('blog')` for All Scripts.
- `src/layouts/BlogPost.astro` — Post detail layout (~940 lines): mesh, progress bar, related posts, Red Queen monitor.
- `src/pages/blog/[...page].astro` — Paginated blog list (9 per page).
- `src/pages/index.astro` — Home with Matrix canvas.
- `src/consts.ts`, `src/components/BaseHead.astro` — Site constants, meta, fonts.

### Patterns

- Animations respect `prefers-reduced-motion` media query.
- Images are optimized via `sharp` and Astro's `Image` component (stored in `src/assets/`).
- Global styles in `src/styles/global.css`; page-specific styles are inline within each `.astro` file.
- Site is purely static (no API endpoints, no SSR).
