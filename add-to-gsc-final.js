#!/usr/bin/env node
/**
 * Add Sites to Google Search Console - Final Version
 * Properly clicks on "Prefixo do URL" panel (right side)
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

  // Go to Search Console Welcome
  console.log('1. Opening Search Console...');
  await page.goto('https://search.google.com/search-console/welcome', {
    waitUntil: 'load',
    timeout: 60000
  });
  await sleep(4000);

  // Click on the URL Prefix panel (right side)
  // The right panel has placeholder "https://www.example.com"
  console.log('2. Finding URL Prefix input (right panel)...');

  // Find the input with placeholder containing "https://"
  const urlPrefixInput = await page.locator('input[placeholder*="https://"]').first();

  if (await urlPrefixInput.count() > 0) {
    console.log('3. Clicking URL Prefix input...');
    await urlPrefixInput.click();
    await sleep(500);

    console.log('4. Clearing and entering URL...');
    await urlPrefixInput.fill('');
    await urlPrefixInput.fill(siteUrl);
    await sleep(1000);

    // Take screenshot before clicking Continue
    await page.screenshot({ path: `/tmp/gsc-before-continue-${index}.png` });

    // Find and click CONTINUAR button in the right panel
    console.log('5. Clicking CONTINUAR...');

    // The CONTINUAR button in URL Prefix section
    // We need to click the one on the right side
    const continueButtons = await page.$$('button:has-text("CONTINUAR")');
    console.log(`   Found ${continueButtons.length} CONTINUAR buttons`);

    if (continueButtons.length >= 2) {
      // Second button is in the URL Prefix panel (right)
      await continueButtons[1].click();
    } else if (continueButtons.length === 1) {
      await continueButtons[0].click();
    } else {
      // Try pressing Enter
      await page.keyboard.press('Enter');
    }

    await sleep(5000);

    // Take screenshot after clicking Continue
    await page.screenshot({ path: `/tmp/gsc-after-continue-${index}.png` });

    const currentUrl = page.url();
    console.log(`   Current URL: ${currentUrl}`);

    // Check if we're on verification page
    if (currentUrl.includes('ownership') || currentUrl.includes('verification')) {
      console.log('6. On verification page!');

      // Look for HTML tag verification option
      const htmlTagOption = await page.locator('text="Tag HTML"').or(page.locator('text="HTML tag"')).first();
      if (await htmlTagOption.count() > 0) {
        console.log('   Clicking HTML tag option...');
        await htmlTagOption.click();
        await sleep(2000);
      }

      // Click Verify button
      const verifyBtn = await page.locator('button:has-text("Verificar")').or(page.locator('button:has-text("Verify")'));
      if (await verifyBtn.count() > 0) {
        console.log('7. Clicking Verify...');
        await verifyBtn.first().click();
        await sleep(5000);
      }

      await page.screenshot({ path: `/tmp/gsc-result-${index}.png` });

      // Check result
      const content = await page.content();
      if (content.includes('Propriedade verificada') || content.includes('verified')) {
        console.log('✅ SUCCESS: Site verified!');
        return { status: 'verified', site: siteUrl };
      } else if (content.includes('Não foi possível') || content.includes('could not')) {
        console.log('⚠️ PENDING: Verification failed - site may need meta tag');
        return { status: 'pending', site: siteUrl };
      }
    }

    // Check if we're redirected to a property dashboard
    if (currentUrl.includes('sc-domain') || currentUrl.includes('u/0/p/')) {
      console.log('✅ SUCCESS: Property added!');
      return { status: 'added', site: siteUrl };
    }

    console.log('⚠️ DONE: Check Search Console manually');
    return { status: 'manual', site: siteUrl };

  } else {
    console.log('❌ URL Prefix input not found');
    await page.screenshot({ path: `/tmp/gsc-error-${index}.png` });
    return { status: 'error', site: siteUrl, error: 'Input not found' };
  }
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
      const result = await addSite(page, SITES[i], i);
      results.push(result);
    } catch (err) {
      console.log(`❌ ERROR: ${SITES[i]} - ${err.message}`);
      results.push({ status: 'error', site: SITES[i], error: err.message });
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
    const icon = r.status === 'verified' || r.status === 'added' ? '✅' :
                 r.status === 'pending' || r.status === 'manual' ? '⚠️' : '❌';
    console.log(`${icon} ${r.status.toUpperCase()}: ${r.site}`);
  });
  console.log('\nScreenshots saved to /tmp/gsc-*.png');
}

main().catch(e => console.error('Error:', e.message));
