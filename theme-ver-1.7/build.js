'use strict';
const fs = require('fs');
const path = require('path');
const mocks = require('./mocks/tags.js');

// Extract the first occurrence of <tag>...</tag>
// Returns { before, inner, after } or null if not found
function getBlock(html, tag) {
  const openRx = new RegExp(`<${tag}(?:\\s[^>]*)?>`, 'i');
  const closeStr = `</${tag}>`;
  const m = openRx.exec(html);
  if (!m) return null;
  const innerStart = m.index + m[0].length;
  const closeIdx = html.indexOf(closeStr, innerStart);
  if (closeIdx === -1) return null;
  return {
    before: html.slice(0, m.index),
    inner: html.slice(innerStart, closeIdx),
    after: html.slice(closeIdx + closeStr.length),
  };
}

// Replace ALL <tag>...</tag> occurrences with items.map(fn(inner, item)).join('')
function expandRep(html, tag, items, fn) {
  let out = html;
  while (true) {
    const b = getBlock(out, tag);
    if (!b) break;
    const expanded = items.map(item => fn(b.inner, item)).join('\n');
    out = b.before + expanded + b.after;
  }
  return out;
}

// Remove opening and closing tags but keep inner content
function unwrap(html, tag) {
  const openRx = new RegExp(`<${tag}(?:\\s[^>]*)?>`, 'gi');
  const closeRx = new RegExp(`</${tag}>`, 'gi');
  return html.replace(openRx, '').replace(closeRx, '');
}

// Remove entire <tag>...</tag> block including content
function stripBlock(html, tag) {
  const b = getBlock(html, tag);
  if (!b) return html;
  return b.before + b.after;
}

// Substitute [##_..._##] scalar tags
function substituteScalars(html, scalars) {
  for (const [key, val] of Object.entries(scalars)) {
    html = html.replaceAll(key, String(val));
  }
  return html;
}

// Process one article clone: handle nested conditional/repeating blocks, then substitute scalars
function processArticle(innerHtml, article) {
  let h = innerHtml;

  // Thumbnail: expand or strip
  if (article.thumbnail) {
    h = expandRep(h, 's_article_rep_thumbnail', [article], (t) =>
      t.replaceAll('[##_article_rep_thumbnail_url_##]', article.thumbnail)
    );
  } else {
    h = stripBlock(h, 's_article_rep_thumbnail');
  }

  // Tags: expand s_tag_rep then unwrap s_tag_label, or strip both
  if (article.tags && article.tags.length > 0) {
    h = expandRep(h, 's_tag_rep', article.tags, (t, tag) =>
      t.replaceAll('[##_tag_link_##]', tag.link).replaceAll('[##_tag_name_##]', tag.name)
    );
    h = unwrap(h, 's_tag_label');
  } else {
    h = stripBlock(h, 's_tag_label');
  }

  // Substitute article-specific tags
  h = h
    .replaceAll('[##_article_rep_link_##]', article.link)
    .replaceAll('[##_article_rep_title_##]', article.title)
    .replaceAll('[##_article_rep_date_##]', article.date)
    .replaceAll('[##_article_rep_desc_##]', article.desc || '')
    .replaceAll('[##_rp_container_##]', '');

  return h;
}

function buildPage(skinHtml, bodyId) {
  let html = skinHtml;

  // 1. Strip <s_t3> wrapper (server-only injection tag)
  html = html.replace(/^\s*<s_t3>\s*\n?/i, '').replace(/\n?\s*<\/s_t3>\s*$/i, '');

  // 2. Set the page-type body id
  html = html.replaceAll('[##_body_id_##]', bodyId);

  // 3. Notices: expand reps, then unwrap conditional wrapper
  html = expandRep(html, 's_rct_notice_rep', mocks.notices, (t, notice) =>
    t.replaceAll('[##_rct_notice_rep_link_##]', notice.link)
     .replaceAll('[##_rct_notice_rep_title_##]', notice.title)
  );
  html = unwrap(html, 's_rct_notice');

  // 4. Links: expand reps, then unwrap conditional wrapper
  html = expandRep(html, 's_link_rep', mocks.links, (t, link) =>
    t.replaceAll('[##_link_rep_link_##]', link.url)
     .replaceAll('[##_link_rep_name_##]', link.name)
  );
  html = unwrap(html, 's_link');

  // 5. Articles: on detail page render one full article, on index render all as cards
  const articles = bodyId === 'tt-body-page' ? mocks.articles.slice(0, 1) : mocks.articles;
  html = expandRep(html, 's_article_rep', articles, processArticle);

  // 6. Pagination: expand reps, unwrap wrapper
  html = expandRep(html, 's_paging_rep', mocks.pages, (t, page) =>
    t.replaceAll('[##_paging_rep_link_##]', page.link)
     .replaceAll('[##_paging_rep_page_##]', String(page.num))
  );
  html = unwrap(html, 's_paging');

  // 7. Unwrap remaining conditionals (keep their content)
  html = unwrap(html, 's_search');

  // 8. Substitute all remaining scalar tags
  html = substituteScalars(html, mocks.scalars);

  return html;
}

const skinPath = path.join(__dirname, 'skin.html');
const skinHtml = fs.readFileSync(skinPath, 'utf8');

const indexHtml = buildPage(skinHtml, 'tt-body-index');
fs.writeFileSync(path.join(__dirname, 'preview-index.html'), indexHtml, 'utf8');
console.log('preview-index.html written');

const pageHtml = buildPage(skinHtml, 'tt-body-page');
fs.writeFileSync(path.join(__dirname, 'preview-page.html'), pageHtml, 'utf8');
console.log('preview-page.html written');
