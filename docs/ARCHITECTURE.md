# Architecture Notes

## Stack

- Framework: Astro 5
- Content: Astro Content Collections (`md` + `mdx`)
- Styling: global CSS + page CSS + scoped styles
- Output: static build (`astro build`)

## Runtime Model

- Most pages are statically generated at build time.
- Interactivity is implemented with lightweight vanilla scripts in `public/scripts/`.
- No API routes and no SSR runtime required.

## Content Pipeline

- Collection schema: `src/content.config.ts`
- Content location: `src/content/blog/<locale>/`
- Key required fields: `title`, `description`, `pubDate`
- Optional fields include visual/AI metadata (`heroImage`, `aiModel`, `aiConfidence`, etc.)

## Routing

- `/` is canonical English home
- `/en/` redirects to `/` (noindex)
- Other locales are explicit via `/:lang/`
- Blog list: `/:lang/blog` (paginated)
- Blog post: `/:lang/blog/[slug]`
- About page: `/:lang/about` (feature-toggled)
- RSS: `/:lang/rss.xml`

## Configuration Surface

- `src/config/site.ts`: site title, URL, author, description
- `src/config/theme.ts`: pagination, home latest count, About toggle
- `src/config/about.ts`: About copy and modal/effects text
- `src/config/social.ts`: header/footer social links

## SEO and Discovery

- Head metadata and hreflang: `src/components/BaseHead.astro`
- Sitemap integration: `@astrojs/sitemap` in `astro.config.mjs`
- robots.txt route: `src/pages/robots.txt.ts`

## Key Layout and Components

- **Sticky footer:** `body` uses flex column with `min-height: 100vh`; `main` uses `flex: 1` so footer stays at viewport bottom on short pages (2K/4K, blog with no articles).
- Home layout: `src/layouts/HomePage.astro`
- Post layout: `src/layouts/BlogPost.astro`
- Shared chrome: `src/components/Header.astro`, `src/components/Footer.astro`

## Build Commands

```bash
npm run dev
npm run build
npm run preview
```
