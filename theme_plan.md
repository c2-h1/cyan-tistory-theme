# Mac Finder Theme — Visual Spec

## Goal

Build a Tistory blog skin that looks and feels like a macOS Finder window: translucent sidebar with traffic-light buttons, folder-icon category tree, search bar, and a post grid styled like Finder's icon view.

---

## Sidebar

### Structure (top → bottom)

```
[ ● ● ● ]                    ← traffic lights, 12px dots, 6px gap
Blog Title                   ← h1, left-aligned, 14px, medium weight
[ ⌕ Search…              ]   ← pill input, full width
──────────────────────────
▾ Categories (25)            ← root label, uppercase 11px, muted
  ▾ Design (8)               ← parent with children → ▾ disclosure
    📁 Typography (3)
    📁 Color (5)
  📁 Development (10)        ← leaf item → 📁 folder icon
  📁 Life (7)
──────────────────────────
  Blog Menu items (if any)
  Notice links (if any)
  External links (if any)
──────────────────────────
  42 / 87 / 12,540           ← today / yesterday / total, muted 11px
```

### Dimensions & Colors

| Property | Value |
|---|---|
| Width | 250px (fixed) |
| Background | `rgba(250, 250, 250, 0.85)` |
| Blur | `backdrop-filter: blur(12px)` |
| Right border | `1px solid rgba(0,0,0,0.15)` |
| Font | `-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif` |
| Traffic light red | `rgb(255, 92, 95)` |
| Traffic light yellow | `rgb(250, 200, 0)` |
| Traffic light green | `rgb(52, 199, 89)` |
| Active item text | `#0068ed` |
| Active item bg | `rgba(0, 104, 237, 0.10)` |

### Category item rules

- Leaf (no children): `📁` emoji prefix
- Parent (has children): `▾` triangle prefix (rotates 0° → always shown as collapsed in Finder style)
- Active: full-width blue pill highlight
- Hover: `rgba(0,0,0,0.05)` background, 8px border-radius
- Sub-items: 14px left indent
- Count: right-aligned muted 11px label

### Search input

- Shape: full pill (`border-radius: 999px`)
- Background icon: SVG magnifier at left edge
- Padding-left: 1.8rem (room for icon)
- Focus: blue outline border `#0068ed`

---

## Main Content

### Background

`--bg: #ececec` — macOS desktop grey (slightly cooler than current `#eeeeee`)

### Content card

```
border-radius: 1.8rem
padding: 2rem
background: #ffffff
border: 1px solid rgba(0,0,0,0.12)
```

### Index page — Finder icon view (tt-body-index)

Each post renders as a Finder-style file icon:
- **Thumbnail**: 80×80px, 10px border-radius (Finder app icons use rounded squares)
- **Filename**: post title, 12px, centered below icon, max 2 lines, text-overflow ellipsis
- **Date**: 11px muted, centered

Grid: `repeat(auto-fill, minmax(110px, 1fr))`, gap `2rem`

**Hover state**: `transform: translateY(-2px)` + `box-shadow: 0 4px 12px rgba(0,0,0,0.12)` on the thumbnail (Finder's lift-on-hover)

### Single post page — reading pane (tt-body-page)

- Show `.post-full`, hide `.post-card`
- "← All posts" link at top (`.back-link`)
- Title: 27px, weight 600
- Meta date: 13px muted
- Body: 15.5px, line-height 1.75
- Tags: small pill chips below the article
- Max content width: 720px

---

## Mobile

- Hide sidebar by default
- Show `.mobile-header` (traffic lights + blog title + hamburger)
- Sidebar slides in from left on hamburger tap
- Post grid: `minmax(90px, 1fr)` at ≤768px

---

## Acceptance Checklist

Run after every change (`node build.js && node screenshot.js`, then Read each PNG):

- [ ] Desktop index: traffic lights visible, blog title, pill search, category tree with folder icons
- [ ] Desktop index: 6+ post icons in grid, thumbnails load, filenames legible
- [ ] Desktop index: one category item shows blue active selection highlight
- [ ] Desktop single post: "← All posts" back link, large title, body typography, tag pills
- [ ] Mobile index: hamburger header visible, sidebar hidden
- [ ] Mobile single post: body readable at 390px width
- [ ] No raw `[##_..._##]` or `<s_xxx>` text visible in any screenshot
- [ ] Pixel-check: sidebar exactly 250px, traffic lights 12px circles, search pill shape
