#!/usr/bin/env node

// Render the ExVis poster (poster/poster.html) to a high-resolution PNG.
//
// Usage: node scripts/render-poster.mjs

import {mkdirSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from '@playwright/test';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const POSTER_HTML = join(ROOT, 'poster', 'poster.html');
const OUTPUT = join(ROOT, 'public', 'exvis-poster.png');

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
});
const page = await browser.newPage({
  viewport: {width: 1080, height: 1080},
  deviceScaleFactor: 2,
});
await page.goto(`file://${POSTER_HTML}`);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({path: OUTPUT, fullPage: false});
await browser.close();

mkdirSync(dirname(OUTPUT), {recursive: true});
console.log(`poster -> ${OUTPUT}`);
