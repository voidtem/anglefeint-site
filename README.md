# Anglefeint Site

Astro 5 static site, with three distinct visual systems:

- `/` Home: Matrix-style canvas rain
- `/blog` Blog list: Blade Runner / cyberpunk atmosphere
- `/blog/[slug]` Post detail: AI terminal mesh UI
- `/about` About page: mesh-style hacker profile (non-article)

This README is written for **humans + AI coding assistants** to onboard quickly.

## Stack

- Framework: `astro@5.17.1`
- Integrations: `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/rss`
- Image pipeline: `astro:assets` + `sharp`
- Content: Astro Content Collections (`src/content.config.ts`)
- Styling: vanilla CSS in `src/styles/global.css` + scoped `<style>` in page/layout files
- Output mode: static (`astro build`)

## Routes

- `src/pages/index.astro`
  - Home page, custom Matrix canvas background + page-scoped style variables.
- `src/pages/blog/[...page].astro`
  - Paginated list route.
  - `getStaticPaths` uses Astro `paginate(posts, { pageSize: 9 })`.
- `src/pages/blog/[...slug].astro`
  - Post detail route.
  - Loads all posts, computes related posts, renders through `src/layouts/BlogPost.astro`.
  - Also derives fallback metrics from markdown body (read minutes / word count / token count / latency / confidence) when frontmatter fields are missing.
- `src/pages/about.astro`
  - Standalone About page using mesh visual language.
- `src/pages/rss.xml.js`
  - RSS feed from collection `blog`.

## Content Model

Defined in `src/content.config.ts`:

Required fields:

- `title: string`
- `description: string`
- `pubDate: date`

Optional fields:

- `updatedDate: date`
- `heroImage: image`
- `context: string`
- `readMinutes: int`
- `aiModel: string`
- `aiMode: string`
- `aiState: string`
- `aiLatencyMs: int`
- `aiConfidence: number (0..1)`
- `wordCount: int`
- `tokenCount: int`

Blog content lives in `src/content/blog/*.{md,mdx}`.

## Key Files (Edit Map)

- `src/layouts/BlogPost.astro`
  - Main article-detail UI and interactions.
  - Includes hero canvas rendering, mesh background SVG network, stage toast, back-to-top, related posts, and left-side Red Queen mini monitor (`.rq-tv`).
- `src/styles/global.css`
  - Global theme baseline + full `br-page` and `mesh-page` visual systems.
  - Also includes pagination/list card behavior, code block runtime header, AI chips, related cards, and back-to-top styling.
- `src/components/Header.astro`
  - Main nav + social links + `system: online` indicator.
  - Status chip is visible on `.mesh-page`, hidden on `.about-page`.
- `src/components/Footer.astro`
  - Footer text/social links.
- `src/pages/about.astro`
  - About content structure and hero/status copy.

## Visual Systems

### Home (`body.page-home`)

- Matrix rain canvas (`#matrix-bg`) with per-column glyph drops.
- `prefers-reduced-motion` disables animation.
- Mouse position updates CSS vars (`--matrix-mx`, `--matrix-my`) for radial highlight.

### Blog list (`body.br-page`)

- Effects: rain, scanlines, dual spotlight sweep (`.br-spotlight-tl/.br-spotlight-tr`), haze, dust, flicker, vignette.
- Card behavior: border glow on hover, title glitch, image scanline sweep.
- Pagination style is defined in route-level `<style is:global>` plus shared `br-page` palette.

### Post detail (`body.mesh-page`)

- Mesh background: gradients + noise + hex grid + SVG point network.
- Article card: terminal metadata row, model chips, context line, output block, regenerate button.
- Read progress + back-to-top + paragraph reveal + link preview tooltip.
- Hero image: drawn via `<canvas class="hero-canvas">` from `data-hero-src`.
- Left mini monitor (`.rq-tv`): canvas-based hologram effect using `public/images/redqueen-reference.jpg` as source, with lightweight cutout/tint/eye+mouth micro animation.

## Components and Constants

- `src/components/BaseHead.astro`
  - Global CSS import, canonical URL, OG/Twitter metadata, RSS/sitemap links, font preloads.
- `src/consts.ts`
  - `SITE_TITLE`, `SITE_DESCRIPTION`.

## Current Project Notes

- No lint/test scripts are defined in `package.json` currently.
- Some text still uses starter-template copy (especially Home and default post content).
- Footer still contains placeholder owner text: `Your name here`.
- Red Queen monitor source image path is hardcoded in `BlogPost.astro`:
  - `/images/redqueen-reference.jpg`

## Run

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

## Fast Handoff Checklist (for AI assistants)

When touching visuals, check these in order:

- Route file for page-scoped style/scripts.
- `src/layouts/BlogPost.astro` for post detail behavior and inline JS.
- `src/styles/global.css` for cross-page theme classes (`.br-page`, `.mesh-page`).
- `src/content.config.ts` if frontmatter/metadata behavior changes.
- `src/pages/blog/[...slug].astro` if computed metrics behavior changes.

When touching content behavior, verify:

- Frontmatter schema compatibility.
- RSS generation (`src/pages/rss.xml.js`).
- Pagination behavior (`src/pages/blog/[...page].astro`).

