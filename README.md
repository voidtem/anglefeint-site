# Anglefeint Site

Personal blog and portfolio built with Astro. Each page has a distinct sci-fi / cyberpunk aesthetic inspired by classic films.

## Tech Stack & Architecture

- **Framework**: [Astro](https://astro.build) v5
- **Content**: Markdown & MDX via [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- **Integrations**: MDX, Sitemap, RSS Feed
- **Styling**: Vanilla CSS (`src/styles/global.css`), no Tailwind
- **Build**: Static site generation (SSG)

### Project Structure

```text
├── public/
├── src/
│   ├── components/     # Header, Footer, BaseHead, etc.
│   ├── content/blog/   # Markdown/MDX posts
│   ├── layouts/        # BlogPost.astro (article + about)
│   ├── pages/
│   │   ├── index.astro           # Home
│   │   ├── about.astro           # About (uses BlogPost layout)
│   │   └── blog/
│   │       ├── [...page].astro   # Blog list (paginated)
│   │       └── [...slug].astro   # Article detail
│   └── styles/global.css
├── astro.config.mjs
└── package.json
```

---

## Page Aesthetics & Effects

### 1. Home (`/`) — Matrix (黑客帝国)

**Body class:** `page-home`

**Style:** Green digital rain, black background — inspired by _The Matrix_ (1999).

**Effects:**

- **Matrix Rain**: Full-screen canvas with falling green characters (`Matrix Code NFI` font)
- Respects `prefers-reduced-motion` (disables animation when set)
- Semi-transparent header/footer overlay

---

### 2. Blog List (`/blog/`) — Blade Runner (1982 & 2049) / Cyberpunk

**Body class:** `br-page`

**Style:** Noir cyberpunk — dark teal/blue, rain, neon haze, film-grain. References _Blade Runner_ (1982) and _Blade Runner 2049_ (2017).

**Effects:**

- **Rain**: Multi-type rain drops (normal, thin, fog, skew) with varied opacity and animation
- **Spotlight**: Conic gradient sweeps from top-left and top-right (warm blue/cyan)
- **Scanlines**: CRT-style horizontal lines (fade on header/footer hover)
- **Vignette**: Darkened edges
- **Haze**: Radial fog overlay
- **Flicker**: Subtle screen flicker
- **Dust particles**: 22 floating particles
- **Load glitch**: Brief RGB chromatic glitch on load
- **Card hover**: Glitch animation on post titles, image sweep overlay, sepia tint

---

### 3. Article Detail (`/blog/[slug]/`) & About (`/about`) — AI / Terminal Style

**Body class:** `mesh-page`

**Style:** AI assistant / terminal aesthetic — dark blue-black, cyan/green accents, point-and-line network. Feels like an AI “response” interface.

**Effects:**

- **Mesh Network**: SVG point cloud (58 nodes) with connecting lines, gentle drift animation
- **Glow layers**: Radial gradient, haze, vignette, stripe, noise, hex grid
- **Thought particles**: 12 floating dots
- **Read progress bar**: Fixed top bar, purple gradient
- **Back to top**: Fixed button (right margin center, 60% vertical)
- **Mouse glow**: Radial glow follows cursor
- **Depth blur**: Soft vignette blur at top/bottom
- **Thinking dots**: Three pulsing dots (fade out after load)
- **Response layout**: Terminal-style metadata (`$ published ... | ~N min read`), “Prompt → Response” framing
- **Block cursor**: Blinking cursor at end of prose
- **Link preview**: Hover tooltip on links (hostname/URL)
- **Glitch on hover**: Light RGB separation on links and code blocks
- **Paragraph reveal**: Intersection Observer scroll-in for paragraphs
- **Related posts**: 3-card grid
- **Fixed header**: Transparent overlay with blur (optional)
- **Regenerate button**: Decorative “Regenerate” with scan animation

---

## Commands

| Command             | Action                               |
| :------------------ | :----------------------------------- |
| `npm install`       | Install dependencies                 |
| `npm run dev`       | Start dev server at `localhost:4321` |
| `npm run build`     | Build production site to `./dist/`   |
| `npm run preview`   | Preview build locally                |
| `npm run astro ...` | Run Astro CLI commands               |

---

## Credit

- Based on [Astro Blog starter](https://github.com/withastro/astro/tree/main/examples/blog)
- Theme inspired by [Bear Blog](https://github.com/HermanMartinus/bearblog/)
