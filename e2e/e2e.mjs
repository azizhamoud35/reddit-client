/**
 * End-to-end tests — drive the REAL app in a real Chrome.
 * Uses puppeteer-core attached to the local Chrome debugging instance
 * (port 9222). Run with the dev server already up:  npm run dev
 *
 *   node e2e/e2e.mjs
 *
 * Exits 0 only if every scenario passes. Works with live Reddit data OR
 * the bundled sample dataset (both are valid app states).
 */
import puppeteer from 'puppeteer-core';

const APP_URL = process.env.APP_URL || 'http://localhost:5173';
const results = [];

async function scenario(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`✅ ${name}`);
  } catch (err) {
    results.push({ name, ok: false, err: String(err).slice(0, 300) });
    console.log(`❌ ${name}\n   ${err}`);
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const $$count = (page, sel) => page.$$eval(sel, (els) => els.length);

/** Click the first element matching CSS selector AND containing text. */
async function clickByText(page, selector, text) {
  const clicked = await page.evaluate(
    (sel, txt) => {
      const el = Array.from(document.querySelectorAll(sel)).find((e) =>
        e.textContent.toLowerCase().includes(txt.toLowerCase())
      );
      if (el) {
        el.scrollIntoView({ block: 'center' });
        el.click();
        return true;
      }
      return false;
    },
    selector,
    text
  );
  if (!clicked) throw new Error(`no ${selector} containing "${text}"`);
}

const browser = await puppeteer.connect({
  browserURL: 'http://localhost:9222',
  defaultViewport: { width: 1280, height: 900 },
});
const page = await browser.newPage();
const consoleErrors = [];
page.on('pageerror', (e) => consoleErrors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });

try {
  await scenario('Feed loads posts (live API or bundled dataset)', async () => {
    await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 45000 });
    await page.waitForSelector('[data-testid="post-card"]', { timeout: 30000 });
    const count = await $$count(page, '[data-testid="post-card"]');
    if (count < 5) throw new Error(`only ${count} posts rendered`);
  });

  await scenario('Search filters the feed by title', async () => {
    const before = await $$count(page, '[data-testid="post-card"]');
    await page.click('.header__search-input');
    await page.type('.header__search-input', 'the', { delay: 20 });
    await sleep(1000);
    const after = await $$count(page, '[data-testid="post-card"]');
    const emptyState = await page.$('.post-list--empty');
    if (after === 0 && !emptyState) throw new Error('no results and no empty state');
    if (after > before) throw new Error(`filter made list bigger (${before} -> ${after})`);
  });

  await scenario('Search clear button restores the feed', async () => {
    await page.click('.header__search-clear');
    await sleep(800);
    const restored = await $$count(page, '[data-testid="post-card"]');
    if (restored < 5) throw new Error(`feed not restored (${restored})`);
  });

  await scenario('Predefined category filter switches community', async () => {
    await clickByText(page, '.subreddits__item', 'reactjs');
    await sleep(1500);
    await page.waitForSelector('[data-testid="post-card"]', { timeout: 20000 });
    const active = await page.$eval('.subreddits__item--active', (el) => el.textContent);
    if (!/reactjs/i.test(active)) throw new Error(`active filter is "${active}"`);
    const subs = await page.$$eval('.post__subreddit', (els) =>
      Array.from(new Set(els.map((e) => e.textContent)))
    );
    if (!subs.some((s) => /reactjs/i.test(s))) {
      throw new Error(`no r/reactjs posts visible: ${subs.join(', ')}`);
    }
  });

  await scenario('Post detail view shows comments', async () => {
    // r/reactjs' top post ("React 19.x is out…") ships a bundled comment tree.
    await clickByText(page, '.post__title-link', 'React 19');
    await page.waitForSelector('[data-testid="post-detail"]', { timeout: 20000 });
    await page.waitForSelector('[data-testid="comments-list"]', { timeout: 30000 });
    const commentCount = await $$count(page, '.comment');
    if (commentCount < 3) throw new Error(`only ${commentCount} comments rendered`);
    const nested = await page.$$eval('.comment__replies', (els) => els.length);
    if (nested < 1) throw new Error('no nested replies rendered');
    const back = await page.$('.post-detail__back');
    if (!back) throw new Error('no back link');
    await back.click();
    await sleep(800);
  });

  await scenario('Responsive: mobile viewport collapses sidebar to chips', async () => {
    await page.setViewport({ width: 480, height: 800 });
    await sleep(500);
    const row = await page.$eval('.subreddits__list', (el) => getComputedStyle(el).flexDirection);
    if (row !== 'row') throw new Error(`sidebar list still ${row} at 480px`);
    await page.setViewport({ width: 1280, height: 900 });
  });

  await scenario('No uncaught app errors during the whole run', async () => {
    const fatal = consoleErrors.filter(
      (e) =>
        !/net::|Failed to load resource|403|429|ERR_|ChromeMethodBFE|Unable to create writable file|ldb/i.test(e) &&
        // Expected: the live-API attempt fails over CORS before the demo
        // fallback kicks in — that is the designed behavior, not a bug.
        !/reddit\.com.*blocked by CORS/i.test(e)
    );
    if (fatal.length) throw new Error(`${fatal.length} console/page errors, first: ${fatal[0]}`);
  });
} finally {
  await page.close().catch(() => {});
  browser.disconnect();
}

const failed = results.filter((r) => !r.ok);
console.log(`\nE2E: ${results.length - failed.length}/${results.length} scenarios passed`);
process.exit(failed.length ? 1 : 0);
