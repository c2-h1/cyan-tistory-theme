# Tistory Theme Structure

## 1. Root File Layout

A valid Tistory theme (skin) consists of the following required and optional files:

```
SKIN/
├─ index.xml
├─ skin.html
├─ style.css
├─ preview.gif
├─ preview256.jpg
├─ preview560.jpg
├─ preview1600.jpg
└─ images/
   ├─ (assets: js, css, images, fonts, etc.)
```

### Required Files

* `skin.html` — main template file
* `style.css` — primary stylesheet
* `index.xml` — metadata and configurable variables

### Optional Files

* `preview*.jpg`, `preview.gif` — used only for theme preview display
* `images/` — container for all additional assets (JS, CSS, fonts, images)

---

## 2. Core Template Structure (`skin.html`)

The entire template must be wrapped inside the Tistory root tag:

```html
<s_t3>
  ...
</s_t3>
```

### Constraints

* `<s_t3>` is mandatory; omission breaks rendering
* Tistory injects global scripts and runtime behavior through this tag
* Only one `<s_t3>` block should exist

---

## 3. Tistory Replacement Tags

Tistory uses a proprietary template system with **replacement tags**.

### Syntax

```
[##_variable_##]
```

### Block Tags

```
<s_tag>
  ...
</s_tag>
```

### Constraints

* These tags are resolved server-side before delivery
* They cannot be dynamically generated via JavaScript
* Invalid or malformed tags will silently fail
* Nesting rules must be respected (block tags must be properly closed)

---

## 4. Category Replacement Tags

Tistory has two category tags that generate **completely different HTML**. This is the single most common source of local-vs-Tistory divergence.

| Tag | Style | HTML Output |
|---|---|---|
| `[##_category_##]` | Folder (old) | JavaScript-driven `<table id="category_XXXXX">` tree; children hidden in `<div id="category_XXXXX_children" style="display:none">`; GIF images for icons; `onclick` navigation |
| `[##_category_list_##]` | List (modern) | `<ul class="tt_category">` with nested `<ul>` per level; standard `<a href>` links; compatible with CSS |

**Always use `[##_category_list_##]` for CSS-styled themes.** The `.tt_category` class only exists in `[##_category_list_##]` output. The `[##_category_##]` tag has no `.tt_category` element — any CSS targeting it will silently do nothing.

### `[##_category_list_##]` HTML structure

```html
<ul class="tt_category">
  <li>
    <a href="/category" class="link_tit">분류 전체보기 <span class="c_cnt">(22)</span></a>
    <ul>
      <li class="selected">                          <!-- active category gets class="selected" -->
        <a href="/category/cs">cs <span class="c_cnt">(16)</span></a>
        <ul>                                         <!-- subcategories: direct child <ul> of <li> -->
          <li><a href="/category/cs/cs231n">cs231n <span class="c_cnt">(5)</span></a></li>
        </ul>
      </li>
      <li><a href="/category/life">Life <span class="c_cnt">(7)</span></a></li>  <!-- leaf: no child <ul> -->
    </ul>
  </li>
</ul>
```

---

## 5. Asset Referencing Rules

All non-core assets must be placed in `images/`.

### Valid references

```html
<link rel="stylesheet" href="./style.css">
<link rel="stylesheet" href="./images/extra.css">
<script src="./images/script.js"></script>
<img src="./images/logo.png">
```

### Constraints

* Relative paths must begin with `./`
* Direct external filesystem paths are not allowed
* Assets outside `images/` are not accessible

---

## 6. CSS Structure (`style.css`)

* Acts as the primary editable stylesheet within Tistory editor
* Automatically loaded when referenced in `skin.html`

### Constraints

* Must exist even if unused
* Cannot import from arbitrary local paths outside `images/`
* Inline `<style>` blocks are allowed but discouraged structurally

---

## 7. Metadata Configuration (`index.xml`)

Defines theme metadata and user-configurable options.

### Typical contents

* Skin name
* Author
* Description
* Variable definitions (colors, text options, toggles)

### Constraints

* Must be valid XML
* Improper formatting prevents theme upload
* Variables defined here are referenced in `skin.html` via replacement tags

---

## 8. File Naming and Encoding

### Constraints

* File names are case-sensitive
* Encoding should be UTF-8
* Special characters in file names may cause asset resolution issues

---

## 9. JavaScript Usage

* JavaScript must be placed in `images/` and referenced manually

### Constraints

* No build pipeline assumed (no bundlers)
* Inline scripts are allowed but executed after Tistory injection
* Must not depend on unavailable module systems (e.g., ES modules without fallback)

---

## 10. Rendering Model

* `skin.html` is processed server-side by Tistory
* Replacement tags are resolved before HTML is sent to the client
* Client receives standard HTML + injected scripts

### Constraints

* No control over server-side execution order
* Cannot modify Tistory’s injected scripts
* Layout must tolerate dynamic content injection

---

## 11. Structural Limitations

* No backend logic access
* No custom routing
* No filesystem beyond defined structure
* No package management (npm, etc.)
* No server-side scripting beyond provided template tags

---

## 12. CSS Pitfalls in Tistory's Pipeline

Tistory processes uploaded CSS before serving it. Several modern CSS features are unreliable:

| Feature | Issue | Workaround |
|---|---|---|
| CSS `:has()` pseudo-class | May be stripped or broken by Tistory's CSS processor | Add classes via JavaScript in `main.js`; use class-based selectors |
| Emoji in `content` property | May not survive Tistory's CSS encoding pipeline | Use CSS unicode escapes (`'\25BE'` for `▾`) or SVG data URIs |
| `backdrop-filter` | Requires vendor prefix for older Safari | Always pair with `-webkit-backdrop-filter` |

**Pattern for JS-driven CSS hooks** (used for category icons):

```js
// main.js — run on DOMContentLoaded
document.querySelectorAll('.tt_category li').forEach(function(li) {
  li.classList.add(li.querySelector(':scope > ul') ? 'cat-parent' : 'cat-leaf');
});
```

```css
/* style.css — class-based, no :has() */
.tt_category li.cat-parent > a::before { content: '\25BE'; }
.tt_category li.cat-leaf   > a::before { content: ''; background-image: url("data:image/svg+xml,..."); }
```

---

## 13. Minimal Valid Theme

```
SKIN/
├─ skin.html
├─ style.css
└─ index.xml
```

Anything beyond this is optional but must follow the constraints above.
