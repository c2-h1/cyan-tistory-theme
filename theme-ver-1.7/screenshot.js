'use strict';

const { chromium } = require('playwright');
const path = require('path');

const shots = [
  { file: 'preview-index.html', out: 'preview-index-desktop.png', w: 1280, h: 900 },
  { file: 'preview-index.html', out: 'preview-index-mobile.png',  w: 390,  h: 844 },
  { file: 'preview-page.html',  out: 'preview-page-desktop.png',  w: 1280, h: 900 },
  { file: 'preview-page.html',  out: 'preview-page-mobile.png',   w: 390,  h: 844 },
  { file: 'preview-protected.html', out: 'preview-protected-desktop.png', w: 1280, h: 900 },
  { file: 'preview-protected.html', out: 'preview-protected-mobile.png',  w: 390,  h: 844 },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const s of shots) {
    await page.setViewportSize({ width: s.w, height: s.h });
    await page.goto('file://' + path.resolve(__dirname, s.file), { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.resolve(__dirname, s.out), fullPage: false });
    console.log('wrote', s.out);
  }

  await browser.close();
})();
