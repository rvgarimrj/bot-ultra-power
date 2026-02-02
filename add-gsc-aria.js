#!/usr/bin/env node
/**
 * Add Sites to Google Search Console - Using aria-label selector
 */

const { chromium } = require('playwright');

const SITES = [
  'https://clipgenius-production.up.railway.app',
  'https://brandpulse-ai-production.up.railway.app',
  'https://contentatomizer-production.up.railway.app',
  'https://focusflow-production-2e04.up.railway.app'
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function addSite(page, siteUrl, index) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`[${index + 1}/${SITES.length}] Adding: ${siteUrl}`);
  console.log(`${'='.repeat(50)}`);

  console.log('1. Opening Search Console...');
  await page.goto('https://search.google.com/search-console/welcome', {
    waitUntil: 'load',
    timeout: 60000
  });
  await sleep(4000);

  // Find the URL Prefix input using aria-label
  console.log('2. Finding URL Prefix input...');
  const urlInput = await page.$('input[aria-label="https://www.example.com"]');

  if (!urlInput) {
    console.log('❌ URL Prefix input not found');
    return 'error';
  }

  console.log('3. Clicking and filling input...');
  await urlInput.click({ force: true });
  await sleep(500);

  // Clear and type
  await urlInput.fill('');
  await urlInput.fill(siteUrl);
  await sleep(1000);

  // Screenshot
  await page.screenshot({ path: `/tmp/gsc-filled-${index}.png` });

  // Click CONTINUAR - find the one on the right (x > 700)
  console.log('4. Clicking CONTINUAR...');
  const buttons = await page.$$('button');
  let clickedContinue = false;

  for (const btn of buttons) {
    const text = await btn.textContent();
    const box = await btn.boundingBox();

    if (text && text.includes('CONTINUAR') && box && box.x > 700) {
      console.log(`   Found CONTINUAR at x=${Math.round(box.x)}`);
      await btn.click({ force: true });
      clickedContinue = true;
      break;
    }
  }

  if (!clickedContinue) {
    console.log('   Using Tab+Enter...');
    await page.keyboard.press('Tab');
    await sleep(200);
    await page.keyboard.press('Enter');
  }

  await sleep(5000);

  // Screenshot after continue
  await page.screenshot({ path: `/tmp/gsc-after-${index}.png` });

  const currentUrl = page.url();
  console.log(`   Current URL: ${currentUrl}`);

  // Check if on verification page
  if (currentUrl.includes('ownership') || currentUrl.includes('verification')) {
    console.log('5. On verification page!');

    // Expand HTML tag section if needed
    const htmlTagExpand = await page.locator('text="Tag HTML"').or(page.locator('text="HTML tag"'));
    if (await htmlTagExpand.count() > 0) {
      console.log('   Expanding HTML tag section...');
      await htmlTagExpand.first().click();
      await sleep(2000);
    }

    // Click Verify
    const verifyBtn = await page.locator('button:has-text("VERIFICAR")').or(page.locator('button:has-text("Verificar")').or(page.locator('button:has-text("Verify")')));
    if (await verifyBtn.count() > 0) {
      console.log('6. Clicking VERIFICAR...');
      await verifyBtn.first().click({ force: true });
      await sleep(5000);
    }

    await page.screenshot({ path: `/tmp/gsc-result-${index}.png` });

    const content = await page.content();
    if (content.includes('verificada') || content.includes('Verified') || content.includes('Success')) {
      console.log('✅ SUCCESS: Verified!');
      return 'verified';
    } else if (content.includes('Não foi possível') || content.includes('could not')) {
      console.log('⚠️ PENDING: Needs meta tag verification');
      return 'pending';
    }
  }

  // Check if property was added
  if (currentUrl.includes('sc-domain') || currentUrl.includes('/p/')) {
    console.log('✅ SUCCESS: Property added!');
    return 'added';
  }

  console.log('⚠️ DONE: Check manually');
  return 'manual';
}

async function main() {
  console.log('Connecting to Chrome...');

  const browser = await chromium.connectOverCDP('http://localhost:9222', { timeout: 10000 });
  const context = browser.contexts()[0];

  const page = await context.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });

  console.log('Connected!\n');

  const results = [];

  for (let i = 0; i < SITES.length; i++) {
    try {
      const status = await addSite(page, SITES[i], i);
      results.push({ site: SITES[i], status });
    } catch (err) {
      console.log(`❌ ERROR: ${err.message}`);
      results.push({ site: SITES[i], status: 'error', error: err.message });
      await page.screenshot({ path: `/tmp/gsc-error-${i}.png` });
    }

    if (i < SITES.length - 1) {
      console.log('\nWaiting 3s...');
      await sleep(3000);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('SUMMARY');
  console.log('='.repeat(50));

  const icons = { verified: '✅', added: '✅', pending: '⚠️', manual: '⚠️', error: '❌' };
  results.forEach(r => {
    console.log(`${icons[r.status] || '❓'} ${r.status.toUpperCase()}: ${r.site}`);
  });
}

main().catch(e => console.error('Error:', e.message));
