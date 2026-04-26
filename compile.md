# Tistory Theme — Local Preview Pipeline

## Project Overview

Tistory uses server-side substitution tags (`[##_title_##]`, `<s_article_rep>`, etc.) that can't be resolved in a browser from disk. This pipeline mocks those tags locally so you get a real rendered preview — and Claude Code can read the screenshots to verify changes visually.

**Rule: no theme change is "done" until the relevant PNG has been read and checked.**

---

## Directory Structure

```
cyan-tistory-theme/
├── compile.md          ← this file (pipeline docs)
├── theme_plan.md       ← Mac Finder visual spec + acceptance checklist
├── structure.md        ← Tistory skin file structure reference
├── reference/          ← reference skin HTML + CSS for sidebar widget order
│   ├── reference.html
│   └── reference.css
└── theme-ver-1.6/      ← current working version
    ├── skin.html           main template
    ├── style.css           stylesheet
    ├── index.xml           metadata
    ├── build.js            local template processor (run this)
    ├── screenshot.js       Playwright screenshot capture (run this)
    ├── preview-index.html  generated — index page (don't edit)
    ├── preview-page.html   generated — single post page (don't edit)
    ├── preview-index-desktop.png    generated screenshots
    ├── preview-index-mobile.png
    ├── preview-page-desktop.png
    ├── preview-page-mobile.png
    ├── images/
    │   └── main.js         mobile sidebar JS
    └── mocks/
        └── tags.js         mock blog data for local preview
```

---

## Setup (one-time, run from theme-ver-1.6/)

```bash
cd theme-ver-1.6
npm install playwright
npx playwright install chromium
```

---

## Run Preview (after every change)

```bash
cd theme-ver-1.6 && node build.js && node screenshot.js
```

This produces four screenshots:
- `preview-index-desktop.png` (1280×900) — homepage icon grid
- `preview-index-mobile.png` (390×844) — mobile homepage
- `preview-page-desktop.png` (1280×900) — single post reading view
- `preview-page-mobile.png` (390×844) — mobile single post

Verify the output has no raw tags:
```bash
grep -c '\[##_' theme-ver-1.6/preview-index.html
# should return 0
```

---

## How build.js Works

`build.js` reads `skin.html` and produces two output HTML files — one for each Tistory page type — using the mock data in `mocks/tags.js`.

### Processing steps (in order)

1. **Strip `<s_t3>` wrapper** — server-only tag, not needed locally
2. **Set `[##_body_id_##]`** — `tt-body-index` or `tt-body-page` (controls CSS show/hide)
3. **Expand repeating blocks** — `<s_article_rep>`, `<s_paging_rep>`, `<s_rct_notice_rep>`, `<s_link_rep>` are each cloned once per mock item
4. **Handle nested blocks** — inside each article clone: `<s_article_rep_thumbnail>` (conditional on thumbnail), `<s_tag_label>/<s_tag_rep>` (conditional on tags)
5. **Unwrap conditional wrappers** — `<s_search>`, `<s_paging>`, `<s_link>`, `<s_rct_notice>` become invisible (content kept)
6. **Substitute scalar tags** — all remaining `[##_..._##]` keys from `mocks/tags.js`

### Adding or changing mock data

Edit `mocks/tags.js`:
- `scalars` — flat key/value map for all non-repeating tags
- `articles[]` — each has `{ title, link, date, thumbnail, desc, tags[] }`; `desc` is raw HTML
- `pages[]`, `notices[]`, `links[]` — simple arrays for their respective repeat blocks
- `scalars['[##_category_list_##]']` — full HTML string for the category tree (must be valid `.tt_category` markup; do NOT use `[##_category_##]` — that tag generates a table-based tree incompatible with CSS styling, see structure.md §Category Tags)

---

## Iteration Loop (Claude's workflow)

After every CSS or HTML edit:

```
1. node build.js && node screenshot.js
2. Read preview-index-desktop.png
3. Read preview-page-desktop.png
4. Compare against theme_plan.md acceptance checklist
5. If anything is wrong: fix style.css or skin.html, go to step 1
6. Only declare "done" when all checklist items pass
```

---

## Known Limitations

| Limitation | Impact |
|---|---|
| Tistory injects `<script>` and inline styles at runtime | JS-driven widgets (tag cloud, etc.) won't appear in preview |
| `[##_category_##]` and `[##_category_list_##]` generate completely different HTML | Mock must use `[##_category_list_##]` key; using the wrong tag locally produces correct preview but broken Tistory output |
| CSS `:has()` may be stripped by Tistory's CSS processing pipeline | Use JS-added classes in `main.js` instead — `labelCategoryItems()` adds `.cat-parent` / `.cat-leaf` |
| Emoji in CSS `content` property may not survive Tistory's CSS pipeline | Use CSS unicode escapes (`'\25BE'`) or SVG data URIs for icons |
| `[##_article_rep_desc_##]` mock content is hand-written HTML | Typography styles are exercised, but real post content may differ |
| `networkidle` waits for external images (picsum.photos) | Slow internet = slower screenshots; thumbnails may be grey on first run |
| `body#tt-body-page` toggle is CSS-only | Single post mock uses article[0] only; comments area is empty |

---

## Reference: Tistory Template Tag Cheat Sheet

Key block tags used in skin.html:

| Tag | Type | Used for |
|---|---|---|
| `<s_t3>` | Required wrapper | Server injection point — strip for local preview |
| `<s_article_rep>` | Repeating | One clone per post (index: all posts, page: one post) |
| `<s_article_rep_thumbnail>` | Conditional | Only rendered if post has a thumbnail |
| `<s_tag_label>` | Conditional | Wraps tag list; hidden if no tags |
| `<s_tag_rep>` | Repeating | One clone per tag |
| `<s_paging>` | Conditional | Shown if there are multiple pages |
| `<s_paging_rep>` | Repeating | One clone per page number |
| `<s_search>` | Conditional | Shown if search is enabled |
| `<s_rct_notice>` | Conditional | Shown if blog has notices |
| `<s_rct_notice_rep>` | Repeating | One per notice |
| `<s_link>` | Conditional | Shown if blog has links |
| `<s_link_rep>` | Repeating | One per link |
