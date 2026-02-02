#!/usr/bin/env node
/**
 * Add Sites to Google Search Console v2
 * Uses direct navigation and keyboard input
 */

const { chromium } = require('playwright');

const SITES = [
  'https://clipgenius-production.up.railway.app',
  'https://brandpulse-ai-production.up.railway.app',
  'https://contentatomizer-production.up.railway.app',
  'https://focusflow-production-2e04.up.railway.app'
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function addSite(page, siteUrl) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Adding: ${siteUrl}`);
  console.log(`${'='.repeat(50)}`);

  // Go directly to add property page
  console.log('1. Opening Search Console Add Property...');
  await page.goto('https://search.google.com/search-console/welcome', {
    waitUntil: 'load',
    timeout: 60000
  });
  await sleep(5000);

  // Take screenshot to debug
  console.log('2. Taking screenshot...');
  await page.screenshot({ path: `/tmp/gsc-${Date.now()}.png` });

  // The page has two sections: Domain (left) and URL prefix (right)
  // We need to click on the URL prefix section's input field
  console.log('3. Looking for URL prefix section...');

  // First, look for "URL prefix" text and click near it
  const urlPrefixLabel = await page.locator('text="Prefixo de URL"').or(page.locator('text="URL prefix"')).first();
  if (await urlPrefixLabel.count() > 0) {
    console.log('   Found URL prefix label, clicking nearby input...');
    await urlPrefixLabel.click();
    await sleep(1000);
  }

  // Now try to find and focus the input
  console.log('4. Finding input field...');

  // Try to find input by various means
  const inputs = await page.$$('input');
  console.log(`   Found ${inputs.length} inputs`);

  for (const input of inputs) {
    try {
      const type = await input.getAttribute('type');
      const visible = await input.isVisible();
      console.log(`   Input type="${type}", visible=${visible}`);

      if (visible && (type === 'text' || type === 'url' || !type)) {
        console.log('5. Entering URL...');
        await input.scrollIntoViewIfNeeded();
        await input.focus();
        await input.fill(siteUrl);
        await sleep(2000);

        // Press Enter or click Continue
        console.log('6. Submitting...');
        await page.keyboard.press('Enter');
        await sleep(5000);

        // Check if we moved forward
        const url = page.url();
        console.log(`   Current URL: ${url}`);

        // Look for verify button
        const verifyBtn = await page.$('button:has-text("Verificar"), button:has-text("Verify")');
        if (verifyBtn) {
          console.log('7. Found Verify button, clicking...');
          await verifyBtn.click();
          await sleep(5000);
        }

        // Check result
        const content = await page.content();
        if (content.includes('verificada') || content.includes('verified')) {
          console.log('SUCCESS: Verified!');
        } else if (content.includes('Verificar') || content.includes('Verify')) {
          console.log('PENDING: Verification page reached');
        } else {
          console.log('DONE: Check manually');
        }

        return true;
      }
    } catch (e) {
      console.log(`   Error with input: ${e.message}`);
    }
  }

  // Alternative: Use keyboard to navigate
  console.log('Trying keyboard navigation...');
  await page.keyboard.press('Tab');
  await sleep(500);
  await page.keyboard.press('Tab');
  await sleep(500);
  await page.keyboard.press('Tab');
  await sleep(500);
  await page.keyboard.type(siteUrl);
  await sleep(1000);
  await page.keyboard.press('Enter');
  await sleep(5000);

  console.log('DONE: Check manually');
  return true;
}

async function main() {
  console.log('Connecting to Chrome...');

  const browser = await chromium.connectOverCDP('http://localhost:9222', { timeout: 10000 });
  const context = browser.contexts()[0];

  const page = await context.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });

  console.log('Connected!');

  for (let i = 0; i < SITES.length; i++) {
    const site = SITES[i];
    try {
      await addSite(page, site);
    } catch (err) {
      console.log(`ERROR: ${site} - ${err.message}`);
    }

    if (i < SITES.length - 1) {
      console.log('\nWaiting 3s...');
      await sleep(3000);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('Completed. Check screenshots in /tmp/gsc-*.png');
  console.log('='.repeat(50));
}

main().catch(e => console.error('Error:', e.message));
