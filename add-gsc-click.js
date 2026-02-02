#!/usr/bin/env node
/**
 * Add Sites to Google Search Console - Click approach
 * Clicks directly on the URL Prefix panel
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

  // Click on "Prefixo do URL" text to activate that panel
  console.log('2. Clicking on URL Prefix section...');
  const urlPrefixTitle = await page.locator('text="Prefixo do URL"').or(page.locator('text="URL prefix"'));
  if (await urlPrefixTitle.count() > 0) {
    await urlPrefixTitle.first().click();
    await sleep(1000);
  }

  // Now click on the placeholder text "https://www.example.com" to focus the input
  console.log('3. Clicking placeholder text...');
  const placeholderText = await page.locator('text="https://www.example.com"');
  if (await placeholderText.count() > 0) {
    await placeholderText.first().click();
    await sleep(500);
  }

  // Type the URL using keyboard
  console.log('4. Typing URL...');
  await page.keyboard.type(siteUrl, { delay: 50 });
  await sleep(1000);

  // Screenshot before continue
  await page.screenshot({ path: `/tmp/gsc-typed-${index}.png` });

  // Click the CONTINUAR button in the URL Prefix section
  // The URL Prefix section is on the right, so its button should be the second one
  console.log('5. Clicking CONTINUAR...');

  // Find all CONTINUAR buttons
  const buttons = await page.$$('button');
  let clickedContinue = false;

  for (const btn of buttons) {
    const text = await btn.textContent();
    const box = await btn.boundingBox();

    // We want the button on the right side (x > 700)
    if (text && text.includes('CONTINUAR') && box && box.x > 700) {
      console.log(`   Found right-side CONTINUAR at x=${box.x}`);
      await btn.click();
      clickedContinue = true;
      break;
    }
  }

  if (!clickedContinue) {
    // Fallback: try Tab to navigate and Enter
    console.log('   Trying Tab+Enter...');
    await page.keyboard.press('Tab');
    await sleep(200);
    await page.keyboard.press('Enter');
  }

  await sleep(5000);

  // Screenshot after clicking continue
  await page.screenshot({ path: `/tmp/gsc-continue-${index}.png` });

  const currentUrl = page.url();
  console.log(`   Current URL: ${currentUrl}`);

  // Check if verification page
  if (currentUrl.includes('ownership') || currentUrl.includes('verification')) {
    console.log('6. On verification page!');

    // Find HTML tag option
    const htmlTag = await page.locator('text="Tag HTML"').or(page.locator('text="HTML tag"'));
    if (await htmlTag.count() > 0) {
      console.log('   Selecting HTML tag verification...');
      await htmlTag.first().click();
      await sleep(2000);
    }

    // Click Verify
    const verifyBtn = await page.locator('button:has-text("VERIFICAR")').or(page.locator('button:has-text("Verificar")'));
    if (await verifyBtn.count() > 0) {
      console.log('7. Clicking VERIFICAR...');
      await verifyBtn.first().click();
      await sleep(5000);
    }

    await page.screenshot({ path: `/tmp/gsc-result-${index}.png` });

    const content = await page.content();
    if (content.includes('verificada') || content.includes('Verified')) {
      console.log('✅ SUCCESS: Verified!');
      return 'verified';
    } else if (content.includes('Não foi possível')) {
      console.log('⚠️ PENDING: Needs meta tag verification');
      return 'pending';
    }
  }

  // Check if redirected to dashboard
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
  results.forEach(r => {
    const icon = ['verified', 'added'].includes(r.status) ? '✅' :
                 ['pending', 'manual'].includes(r.status) ? '⚠️' : '❌';
    console.log(`${icon} ${r.status}: ${r.site}`);
  });
}

main().catch(e => console.error('Error:', e.message));
