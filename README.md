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

Blog content: `src/content/blog/*.{md,mdx}`.

Current repo snapshot includes **32 posts** (count from `find src/content/blog -maxdepth 1 -type f | wc -l`).
Prefer running the command again instead of relying on this number.

## About Page (`/about`) — Anonymous-Style Terminal

The About page uses a dark terminal aesthetic with:

- **Background:** Canvas directory listing, interactive typing at `~ $` (click margins to focus), scanlines, vignette
- **Sliding lines:** Title bar sweep (`term-title-bar`) and load scan (`term-load-scan`) use palette #0B0F14 + #FF0033 + #9CA3AF
- **Header:** Nav active underline is grey (`--chrome-active`)
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

### Home (`body.page-home`) — `src/pages/index.astro`

**Type:** Landing page  
**Style:** Matrix green-on-black terminal aesthetic, monospace accents, glass-panel main content.

**CSS effects:**
- `::before` — CRT-style scanlines (`repeating-linear-gradient`)
- `::after` — Radial highlight at mouse (`var(--matrix-mx)`, `var(--matrix-my)`), vignette ellipse
- Main panel: backdrop blur, green border, soft glow (`box-shadow`), rounded corners
- Typography: matrix-green text-shadow, `::before` “SYSTEM ONLINE” label, list bullets as `>`

**JS effects:**
- Matrix rain canvas: falling character columns (`requestAnimationFrame`), trail opacity fade, column reset when off-screen
- `mousemove` → `--matrix-mx` / `--matrix-my` CSS vars for radial spotlight
- `prefers-reduced-motion` → canvas hidden
- `visibilitychange` → pause animation when tab hidden

### Blog list (`body.br-page`) — `src/pages/blog/[...page].astro`

**Type:** Paginated list (9 posts per page)  
**Style:** Blade Runner / cyberpunk — blue/magenta/amber gradients, dirty-white rain, fog, dust.

**CSS effects:**
- `.br-rain-drop` — 4 variants: normal, thin, fog (blur), skew; vertical fall animation; randomized left/delay/duration
- `.br-scanlines` — double-layer horizontal scanlines; fade on header/footer hover
- `.br-spotlight` — conic gradients (tl/tr) sweeping across viewport
- `.br-flicker`, `.br-haze`, `.br-vignette` — radial gradients, drift/haze animations
- `.br-dust` — 22 floating particles, `br-dust-float` keyframes
- `.br-load-glitch` — load-time horizontal glitch flash
- Card hover: border glow, `br-neon-flicker`, title `br-glitch` (RGB split), image scan sweep (`::before` top→bottom)
- Pagination: purple/cyan border, current-page glow

**JS effects:**
- None — all effects are CSS-only (keyframes, transitions)

### Post detail (`body.mesh-page`) — `src/layouts/BlogPost.astro` + `src/pages/blog/[...slug].astro`

**Type:** Article / detail page  
**Style:** AI terminal mesh — dark blue/pink gradients, SVG node network, GPU/circuit styling.

**CSS effects:**
- `.mesh-bg` — layered: `mesh-glow` (gradient shift), haze, vignette, stripe, noise (SVG filter), hex grid, thought particles
- `.mesh-network` — SVG 58 nodes + edges, `mesh-line-pulse` (dash offset), `mesh-dot-float` / `mesh-dot-breathe`
- `.mesh-read-progress` — fixed top bar, width from `--read-progress`
- `.mesh-load-scan` — gradient line top→bottom on load / regenerate
- `.mesh-mouse-glow` — radial gradient at `--mouse-x` / `--mouse-y`
- `.mesh-back-to-top` — circuit-style button, visible on scroll
- Prose: GPU-style borders, link glow, blockquote/code “runtime” labels, first-letter drop cap
- `.mesh-prose-body` — paragraph reveal via `.mesh-para-visible` (IntersectionObserver)
- `.rq-tv` — Red Queen monitor frame, scanline overlay

**JS effects:**
- Read progress: `scroll` → `--read-progress`, back-to-top visibility; toast at 30/60/90% (“context parsed”, “inference stable”, “output finalized”)
- Hero canvas: load image → Sobel edge detection → fade-in edge view → scanning line → pixelated reveal → full image + scanlines + occasional RGB glitch / static burst
- Red Queen TV: `ImageDecoder` playlist (webp → gif → gif → webp), fallback to static image
- Mouse glow: `mousemove` → `--mouse-x` / `--mouse-y` via `requestAnimationFrame`
- Link preview: `data-preview` on prose links, hover tooltip
- Paragraph reveal: IntersectionObserver adds `.mesh-para-visible` on scroll
- Regenerate button: re-triggers load scan, brief flash

### About (`body.term-page`)

- Black background, CRT scanlines, vignette
- **Palette:** Green for sidebar/link hover (`--chrome-link-hover`); grey for header nav underline (`--chrome-active`); sliding lines use #0B0F14 + #FF0033 + #9CA3AF (dark, red, gray)
- **Sliding line effects:** `term-title-bar` (below title) — 3px bar with sweep animation; `term-load-scan` (top of content) — 2px line from top→bottom on load. Both use red/gray gradient.
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
**About sliding lines:** `.term-title-bar::after` (sweep), `.term-load-scan` (load scan); palette vars in `body.term-page` CSS
