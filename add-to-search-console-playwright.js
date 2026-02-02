#!/usr/bin/env node
/**
 * Add Sites to Google Search Console using Playwright
 * Connects to existing Chrome via CDP
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

  // Go to Search Console Welcome page
  console.log('1. Opening Search Console...');
  await page.goto('https://search.google.com/search-console/welcome', {
    waitUntil: 'load',
    timeout: 30000
  });
  await sleep(3000);

  // Look for URL prefix input - usually in the right panel
  console.log('2. Looking for URL input...');

  // Try different selectors for the URL input
  let urlInput = await page.$('input[type="url"]');
  if (!urlInput) {
    urlInput = await page.$('input[placeholder*="URL"]');
  }
  if (!urlInput) {
    urlInput = await page.$('input[aria-label*="URL"]');
  }
  if (!urlInput) {
    // Look for any text input in the URL prefix section
    const inputs = await page.$$('input[type="text"]');
    for (const input of inputs) {
      const placeholder = await input.getAttribute('placeholder');
      if (placeholder && placeholder.toLowerCase().includes('url')) {
        urlInput = input;
        break;
      }
    }
  }

  if (!urlInput) {
    console.log('URL input not found. Page might require different approach.');
    console.log('Current URL:', page.url());
    return false;
  }

  console.log('3. Entering URL...');
  await urlInput.click({ clickCount: 3 });
  await urlInput.fill(siteUrl);
  await sleep(1000);

  // Click Continue/Add button
  console.log('4. Clicking Continue...');
  const continueBtn = await page.$('button:has-text("Continuar"), button:has-text("Continue"), button:has-text("Add"), button:has-text("Adicionar")');
  if (continueBtn) {
    await continueBtn.click();
    await sleep(3000);
  } else {
    // Try pressing Enter
    await page.keyboard.press('Enter');
    await sleep(3000);
  }

  // Look for verification method - HTML tag is preferred
  console.log('5. Looking for HTML tag verification...');
  const htmlTagOption = await page.$('text="HTML tag" >> visible=true');
  if (htmlTagOption) {
    await htmlTagOption.click();
    await sleep(2000);
  }

  // Try to verify
  console.log('6. Clicking Verify...');
  const verifyBtn = await page.$('button:has-text("Verificar"), button:has-text("Verify")');
  if (verifyBtn) {
    await verifyBtn.click();
    await sleep(5000);
  }

  // Check for success
  const pageContent = await page.content();
  if (pageContent.includes('verificada') || pageContent.includes('verified') || pageContent.includes('Propriedade')) {
    console.log('SUCCESS: Site added/verified!');
    return true;
  }

  console.log('DONE: Check Search Console for status.');
  return true;
}

async function main() {
  console.log('Connecting to Chrome...');

  const browser = await chromium.connectOverCDP('http://localhost:9222', { timeout: 10000 });
  const context = browser.contexts()[0];

  // Create a new page for Search Console
  const page = await context.newPage();

  console.log('Connected! Starting to add sites...');

  const results = [];

  for (const site of SITES) {
    try {
      await addSite(page, site);
      results.push({ site, status: 'attempted' });

      // Wait between sites
      if (SITES.indexOf(site) < SITES.length - 1) {
        console.log('\nWaiting 5s before next site...');
        await sleep(5000);
      }
    } catch (err) {
      console.log(`FAILED: ${site} - ${err.message}`);
      results.push({ site, status: 'failed', error: err.message });
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('DONE');
  console.log('='.repeat(50));
  results.forEach(r => console.log(`${r.status}: ${r.site}`));

  // Keep page open for manual verification
  console.log('\nPage kept open for manual review.');
}

main().catch(e => console.error('Error:', e.message));
