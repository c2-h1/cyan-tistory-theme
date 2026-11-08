'use strict';

const CATEGORY_HTML = `<ul class="tt_category">
  <li><a class="link_tit" href="#">분류 전체보기 <span class="c_cnt">(25)</span></a>
    <ul>
      <li><a href="#">CS <span class="c_cnt">(12)</span></a>
        <ul>
          <li><a href="#">Algorithm <span class="c_cnt">(5)</span></a></li>
          <li><a href="#">OS <span class="c_cnt">(4)</span></a></li>
          <li><a href="#">Network <span class="c_cnt">(3)</span></a></li>
        </ul>
      </li>
      <li class="selected"><a href="#">Design <span class="c_cnt">(8)</span></a>
        <ul>
          <li><a href="#">Typography <span class="c_cnt">(3)</span></a></li>
          <li><a href="#">Color <span class="c_cnt">(5)</span></a></li>
        </ul>
      </li>
      <li><a href="#">Life <span class="c_cnt">(5)</span></a></li>
    </ul>
  </li>
</ul>`;

const FULL_POST_DESC = `
<h2>Getting Started with SF Symbols</h2>
<p>SF Symbols is Apple's comprehensive icon library, tightly integrated with the San Francisco typeface. When you use SF Symbols in a web context, you get icons that feel native to macOS and iOS without any additional font loading — just a thoughtful CSS mask approach.</p>
<h3>Setting up the icon pipeline</h3>
<p>First, export the symbols you need as SVG from the <strong>SF Symbols app</strong>. Each symbol comes as a layered SVG with variable weights matching San Francisco's six weight variants.</p>
<pre><code>.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  mask-image: url('symbols/folder.svg');
  mask-repeat: no-repeat;
  mask-size: contain;
  background-color: currentColor;
}</code></pre>
<p>This technique lets the icon inherit <code>color</code> from its parent, so active states and hover effects work without any extra CSS.</p>
<blockquote>
  <p>SF Symbols are Apple intellectual property. Use them only in contexts that match Apple's guidelines — typically software that runs on Apple platforms.</p>
</blockquote>
<h3>Checklist before shipping</h3>
<ul>
<li>Export every symbol at the regular and semibold weights — mixing weights inside one toolbar reads as a rendering bug, especially on non-Retina displays where the stems land on different subpixels.</li>
<li>Check the mask fallback in Safari 15 and older, since <code>mask-image</code> without the <code>-webkit-</code> prefix silently fails there and the icon collapses to a solid square.</li>
<li>Nested rules to watch:
<ul>
<li>Inline icons inherit <code>line-height</code>, so a 1.8 body leading pushes them off the baseline.</li>
<li>Buttons need an explicit <code>vertical-align: -0.125em</code>.</li>
</ul>
</li>
<li>한글 본문에서도 줄바꿈이 마커 기준으로 들여쓰기 되는지 확인한다. 두 번째 줄이 마커 아래로 내려가면 안 되고, 첫 줄 텍스트 시작점에 맞춰 정렬되어야 한다.</li>
</ul>
<h3>Ordered build steps</h3>
<ol>
<li>Install the SF Symbols app and pick the symbol set you need.</li>
<li>Run the export script:
<ol>
<li>Normalize the viewBox to 24×24.</li>
<li>Strip the layer metadata Apple ships in each file.</li>
</ol>
</li>
<li>Drop the SVGs into <code>images/symbols/</code> and reference them from the mask rule above.</li>
</ol>
<h3>Weight reference</h3>
<table>
<thead><tr><th>Weight</th><th>CSS value</th><th>Use</th></tr></thead>
<tbody>
<tr><td>Regular</td><td>400</td><td>Body icons</td></tr>
<tr><td>Semibold</td><td>600</td><td>Toolbar icons</td></tr>
<tr><td>Bold</td><td>700</td><td>Empty states</td></tr>
</tbody>
</table>
<h3>Variable weight in CSS</h3>
<p>Because each weight is a separate SVG, you can swap the mask source in response to <code>font-weight</code> — though this requires a small JavaScript shim to bridge CSS custom properties and the mask attribute.</p>
<p>In practice, using the regular weight (400) for body icons and the semibold weight (600) for toolbar icons gives the right visual rhythm on Retina displays.</p>
`;

module.exports = {
  scalars: {
    '[##_title_##]': "Chae's Blog",
    '[##_blog_link_##]': '#',
    '[##_owner_url_##]': '#',
    '[##_count_today_##]': '42',
    '[##_count_yesterday_##]': '87',
    '[##_count_total_##]': '12,540',
    '[##_search_name_##]': 'search',
    '[##_search_text_##]': '',
    '[##_search_onclick_submit_##]': 'return false;',
    '[##_rss_url_##]': '#',
    '[##_category_list_##]': CATEGORY_HTML,
    '[##_blog_menu_##]': '',
  },

  articles: [
    {
      title: 'Getting Started with SF Symbols',
      link: '#',
      date: '2026.04.26',
      thumbnail: 'https://picsum.photos/seed/sf1/200/200',
      desc: FULL_POST_DESC,
      tags: [{ name: 'design', link: '#' }, { name: 'apple', link: '#' }],
    },
    {
      title: 'Mac Finder UI Breakdown',
      link: '#',
      date: '2026.04.22',
      thumbnail: 'https://picsum.photos/seed/finder2/200/200',
      desc: '<p>A deep dive into every component of the macOS Finder sidebar — padding, blur values, and selection states.</p>',
      tags: [{ name: 'macOS', link: '#' }, { name: 'UI', link: '#' }, { name: 'design', link: '#' }],
    },
    {
      title: 'Building a Tistory Theme from Scratch',
      link: '#',
      date: '2026.04.18',
      thumbnail: 'https://picsum.photos/seed/tist3/200/200',
      desc: '<p>Tistory uses server-side template tags that can\'t be previewed locally — until you build a mock pipeline.</p>',
      tags: [{ name: 'dev', link: '#' }, { name: 'tistory', link: '#' }],
    },
    {
      title: 'Typography in Digital Interfaces',
      link: '#',
      date: '2026.04.14',
      thumbnail: 'https://picsum.photos/seed/type4/200/200',
      desc: '<p>San Francisco, Inter, and Noto Sans — a comparison of the three fonts I use across all my projects.</p>',
      tags: [{ name: 'typography', link: '#' }, { name: 'design', link: '#' }],
    },
    {
      title: 'Color Theory for Developers',
      link: '#',
      date: '2026.04.10',
      thumbnail: '',
      desc: '<p>The OKLCH color space makes it trivial to create perceptually uniform palette steps.</p>',
      tags: [{ name: 'color', link: '#' }],
    },
    {
      title: 'Morning Coffee & Code',
      link: '#',
      date: '2026.04.06',
      thumbnail: 'https://picsum.photos/seed/life6/200/200',
      desc: '<p>Some thoughts on slow mornings, pourover technique, and why context switching is the enemy of flow.</p>',
      tags: [{ name: 'life', link: '#' }],
    },
    {
      title: 'The Art of Minimal UI',
      link: '#',
      date: '2026.04.02',
      thumbnail: 'https://picsum.photos/seed/min7/200/200',
      desc: '<p>Minimal doesn\'t mean empty. It means every element earns its place.</p>',
      tags: [{ name: 'design', link: '#' }, { name: 'UI', link: '#' }, { name: 'minimal', link: '#' }],
    },
  ],

  protectedArticles: [
    { id: 101, title: '비밀번호로 보호된 글', link: '#', date: '2026.04.28' },
  ],

  pages: [
    { num: '1', link: 'href="#"' },
    { num: '2', link: 'href="#"' },
    { num: '3', link: 'href="#"' },
  ],

  notices: [
    { title: 'Site update: new theme deployed', link: '#' },
  ],

  links: [
    { name: 'GitHub', url: '#' },
    { name: 'Twitter / X', url: '#' },
  ],
};
