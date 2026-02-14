# Anglefeint Site

Astro 5 static site with four distinct visual systems:

- `/` Home: Matrix-style canvas rain
- `/blog` Blog list: Blade Runner / cyberpunk atmosphere
- `/blog/[slug]` Post detail: AI terminal mesh UI
- `/about` About page: Anonymous-style terminal / hacker theme with interactive sidebar and modals

This README is written for **humans + AI coding assistants** to onboard quickly.

## Stack

- Framework: `astro@5.17.1`
- Integrations: `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/rss`
- Image pipeline: `astro:assets` + `sharp`
- Content: Astro Content Collections (`src/content.config.ts`)
- Styling: vanilla CSS in `src/styles/global.css` + scoped `<style>` in page/layout files
- Output mode: static (`astro build`)

## Routes

- `src/pages/index.astro` — Home page, Matrix canvas rain + radial highlight
- `src/pages/blog/[...page].astro` — Paginated blog list (9 per page), Blade Runner effects
- `src/pages/blog/[...slug].astro` — Post detail, mesh UI, related posts, computed metrics
- `src/pages/about.astro` — Anonymous-style terminal page with sidebar, modals, virtual keyboard
- `src/pages/rss.xml.js` — RSS feed from `blog` collection

## Content Model

Defined in `src/content.config.ts`:

**Required:** `title`, `description`, `pubDate`  
**Optional:** `updatedDate`, `heroImage`, `context`, `readMinutes`, `aiModel`, `aiMode`, `aiState`, `aiLatencyMs`, `aiConfidence`, `wordCount`, `tokenCount`

Blog content: `src/content/blog/*.{md,mdx}` (31 posts as of last update).

## About Page (`/about`) — Anonymous-Style Terminal

The About page uses a dark terminal aesthetic with:

- **Background:** Canvas directory listing, interactive typing at `~ $` (click margins to focus), scanlines, vignette
- **Right sidebar:** Fixed folder bar (hidden on mobile < 900px) with five buttons:
  - **DL Data** — Modal: "Downloading..." with animated progress bar
  - **AI** — Modal: model status (inference, context, latency)
  - **Decryptor** — Modal: live-updating hash/passphrase/keys
  - **Help** — Modal: virtual keyboard (QWERTY + right-side nav keys: Insert/Home/PgUp, Delete/End/PgDn, Purge, arrows). Key highlight on press/click, "You typed: X characters" counter. Escape closes.
  - **All Scripts** — Modal: folder grid of blog posts (`/root/bash/scripts`), each folder links to post detail
- **Modals:** macOS-style window (red/yellow/green dots, white title bar), Escape or overlay click to close

## Key Files (Edit Map)

- `src/pages/about.astro` — About page, sidebar, modals, terminal canvas, folder logic, virtual keyboard (~1400 lines)
- `src/layouts/BlogPost.astro` — Post detail layout, mesh network, hero canvas, Red Queen monitor (`.rq-tv`)
- `src/styles/global.css` — Global theme, `br-page`, `mesh-page` visual systems
- `src/components/Header.astro` — Nav, social links, `system: online` chip
- `src/components/Footer.astro` — Footer text/social links

## Visual Systems

### Home (`body.page-home`)

- Matrix rain canvas, `prefers-reduced-motion` disables animation
- Mouse position → CSS vars for radial highlight

### Blog list (`body.br-page`)

- Rain, scanlines, spotlight sweep, haze, dust, flicker, vignette
- Card hover glow, title glitch, image scanline

### Post detail (`body.mesh-page`)

- Mesh background: gradients, noise, hex grid, SVG point network (58 nodes)
- Hero canvas, read progress, back-to-top, paragraph reveal
- Red Queen mini monitor: `public/images/redqueen-reference.jpg`

### About (`body.term-page`)

- Black background, green accents, CRT scanlines
- Sidebar modals, virtual keyboard, folder grid for blog posts

## Run

```bash
npm install
npm run dev      # localhost:4321
npm run build
npm run preview
```

## Fast Handoff (AI Assistants)

**Visuals:** Route file → `BlogPost.astro` → `global.css` → `content.config.ts`  
**Content:** Frontmatter schema, RSS (`rss.xml.js`), pagination (`[...page].astro`)  
**About modals:** `modalContent` object in `about.astro` script; folder grid from `getCollection('blog')` + template `#term-scripts-folders-tpl`

