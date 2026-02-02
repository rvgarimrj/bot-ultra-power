#!/usr/bin/env node
/**
 * Test Deployed Apps - Functional Testing
 * Tests each app to ensure core functionality works before promotion
 */

const { chromium } = require('playwright');

const APPS = [
  {
    name: 'ClipGenius',
    url: 'https://clipgenius-production.up.railway.app',
    testSteps: [
      { action: 'navigate', desc: 'Open app' },
      { action: 'screenshot', desc: 'Homepage' },
      { action: 'checkElement', selector: 'input', desc: 'URL input exists' },
      { action: 'checkElement', selector: 'button', desc: 'Submit button exists' },
      { action: 'fill', selector: 'input', value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', desc: 'Enter YouTube URL' },
      { action: 'screenshot', desc: 'After URL input' },
      { action: 'clickSubmit', desc: 'Click submit/analyze button' },
      { action: 'wait', ms: 5000, desc: 'Wait for processing' },
      { action: 'screenshot', desc: 'After submit' }
    ]
  },
  {
    name: 'BrandPulse AI',
    url: 'https://brandpulse-ai-production.up.railway.app',
    testSteps: [
      { action: 'navigate', desc: 'Open app' },
      { action: 'screenshot', desc: 'Homepage' },
      { action: 'checkElement', selector: 'input', desc: 'Brand input exists' },
      { action: 'checkElement', selector: 'button', desc: 'Submit button exists' },
      { action: 'fill', selector: 'input', value: 'Nike', desc: 'Enter brand name' },
      { action: 'screenshot', desc: 'After brand input' },
      { action: 'clickSubmit', desc: 'Click analyze button' },
      { action: 'wait', ms: 10000, desc: 'Wait for AI analysis' },
      { action: 'screenshot', desc: 'After analysis' }
    ]
  },
  {
    name: 'ContentAtomizer',
    url: 'https://contentatomizer-production.up.railway.app',
    testSteps: [
      { action: 'navigate', desc: 'Open app' },
      { action: 'screenshot', desc: 'Homepage' },
      { action: 'checkElement', selector: 'textarea', desc: 'Content textarea exists' },
      { action: 'checkElement', selector: 'button', desc: 'Submit button exists' },
      { action: 'fill', selector: 'textarea', value: 'This is a test blog post about AI and productivity. AI tools are revolutionizing how we work. Here are 5 ways to use AI effectively.', desc: 'Enter sample content' },
      { action: 'screenshot', desc: 'After content input' },
      { action: 'clickSubmit', desc: 'Click atomize button' },
      { action: 'wait', ms: 10000, desc: 'Wait for content generation' },
      { action: 'screenshot', desc: 'After atomization' }
    ]
  },
  {
    name: 'FocusFlow',
    url: 'https://focusflow-production-2e04.up.railway.app',
    testSteps: [
      { action: 'navigate', desc: 'Open app' },
      { action: 'screenshot', desc: 'Homepage' },
      { action: 'checkElement', selector: 'button', desc: 'Start/Timer button exists' },
      { action: 'screenshot', desc: 'UI check' },
      { action: 'clickAny', selector: 'button:has-text("Start"), button:has-text("Iniciar"), button:has-text("Begin")', desc: 'Start timer' },
      { action: 'wait', ms: 3000, desc: 'Wait for timer' },
      { action: 'screenshot', desc: 'Timer running' }
    ]
  }
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function testApp(page, app) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`TESTING: ${app.name}`);
  console.log(`URL: ${app.url}`);
  console.log(`${'='.repeat(60)}`);

  const results = {
    name: app.name,
    url: app.url,
    tests: [],
    issues: [],
    screenshots: []
  };

  for (const step of app.testSteps) {
    console.log(`\n  → ${step.desc}...`);

    try {
      switch (step.action) {
        case 'navigate':
          await page.goto(app.url, { waitUntil: 'load', timeout: 30000 });
          await sleep(3000);
          results.tests.push({ step: step.desc, status: 'pass' });
          break;

        case 'screenshot':
          const filename = `/tmp/test-${app.name.replace(/\s/g, '')}-${Date.now()}.png`;
          await page.screenshot({ path: filename, fullPage: true });
          results.screenshots.push(filename);
          console.log(`    📸 ${filename}`);
          results.tests.push({ step: step.desc, status: 'pass' });
          break;

        case 'checkElement':
          const element = await page.$(step.selector);
          if (element) {
            const visible = await element.isVisible();
            if (visible) {
              console.log(`    ✅ Found: ${step.selector}`);
              results.tests.push({ step: step.desc, status: 'pass' });
            } else {
              console.log(`    ⚠️ Found but not visible: ${step.selector}`);
              results.tests.push({ step: step.desc, status: 'warn', note: 'not visible' });
              results.issues.push(`${step.desc}: element not visible`);
            }
          } else {
            console.log(`    ❌ NOT FOUND: ${step.selector}`);
            results.tests.push({ step: step.desc, status: 'fail' });
            results.issues.push(`${step.desc}: element not found`);
          }
          break;

        case 'fill':
          const input = await page.$(step.selector);
          if (input) {
            await input.click();
            await input.fill(step.value);
            console.log(`    ✅ Filled ${step.selector}`);
            results.tests.push({ step: step.desc, status: 'pass' });
          } else {
            console.log(`    ❌ Could not find ${step.selector} to fill`);
            results.tests.push({ step: step.desc, status: 'fail' });
            results.issues.push(`${step.desc}: input not found`);
          }
          break;

        case 'clickSubmit':
          // Try various submit button selectors
          const submitSelectors = [
            'button[type="submit"]',
            'button:has-text("Analyze")',
            'button:has-text("Analisar")',
            'button:has-text("Submit")',
            'button:has-text("Enviar")',
            'button:has-text("Generate")',
            'button:has-text("Gerar")',
            'button:has-text("Atomize")',
            'button:has-text("Start")',
            'button:has-text("Iniciar")',
            'button:has-text("Go")',
            'button:has-text("Processar")',
            'input[type="submit"]',
            'button:not([disabled])'
          ];

          let clicked = false;
          for (const sel of submitSelectors) {
            try {
              const btn = await page.$(sel);
              if (btn && await btn.isVisible()) {
                const text = await btn.textContent();
                console.log(`    Found button: "${text?.trim()}"`);
                await btn.click({ force: true });
                clicked = true;
                console.log(`    ✅ Clicked submit button`);
                results.tests.push({ step: step.desc, status: 'pass' });
                break;
              }
            } catch (e) {}
          }

          if (!clicked) {
            // Try pressing Enter
            console.log(`    ⚠️ No submit button found, trying Enter key`);
            await page.keyboard.press('Enter');
            results.tests.push({ step: step.desc, status: 'warn', note: 'used Enter key' });
            results.issues.push(`${step.desc}: no visible submit button, used Enter`);
          }
          break;

        case 'clickAny':
          try {
            const anyBtn = await page.locator(step.selector).first();
            if (await anyBtn.count() > 0) {
              await anyBtn.click({ force: true });
              console.log(`    ✅ Clicked: ${step.selector}`);
              results.tests.push({ step: step.desc, status: 'pass' });
            } else {
              console.log(`    ❌ No matching element: ${step.selector}`);
              results.tests.push({ step: step.desc, status: 'fail' });
              results.issues.push(`${step.desc}: no matching button`);
            }
          } catch (e) {
            console.log(`    ❌ Error clicking: ${e.message}`);
            results.tests.push({ step: step.desc, status: 'fail' });
            results.issues.push(`${step.desc}: ${e.message}`);
          }
          break;

        case 'wait':
          await sleep(step.ms);
          console.log(`    ⏱️ Waited ${step.ms}ms`);
          results.tests.push({ step: step.desc, status: 'pass' });
          break;
      }
    } catch (err) {
      console.log(`    ❌ Error: ${err.message}`);
      results.tests.push({ step: step.desc, status: 'error', error: err.message });
      results.issues.push(`${step.desc}: ${err.message}`);
    }
  }

  // Check for console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Summary
  const passed = results.tests.filter(t => t.status === 'pass').length;
  const failed = results.tests.filter(t => t.status === 'fail' || t.status === 'error').length;
  const warned = results.tests.filter(t => t.status === 'warn').length;

  console.log(`\n  SUMMARY: ${passed}✅ ${warned}⚠️ ${failed}❌`);

  if (results.issues.length > 0) {
    console.log(`  ISSUES:`);
    results.issues.forEach(i => console.log(`    - ${i}`));
  }

  results.summary = { passed, warned, failed, total: results.tests.length };
  return results;
}

async function main() {
  console.log('🧪 DEPLOYED APPS FUNCTIONAL TEST');
  console.log('================================\n');

  const browser = await chromium.connectOverCDP('http://localhost:9222', { timeout: 10000 });
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });

  const allResults = [];

  for (const app of APPS) {
    try {
      const result = await testApp(page, app);
      allResults.push(result);
    } catch (err) {
      console.log(`\n❌ CRITICAL ERROR testing ${app.name}: ${err.message}`);
      allResults.push({
        name: app.name,
        url: app.url,
        summary: { passed: 0, warned: 0, failed: 1, total: 1 },
        issues: [`Critical error: ${err.message}`]
      });
    }

    await sleep(2000);
  }

  // Final report
  console.log('\n' + '='.repeat(60));
  console.log('FINAL REPORT');
  console.log('='.repeat(60));

  let totalIssues = 0;
  allResults.forEach(r => {
    const icon = r.summary.failed > 0 ? '❌' : r.summary.warned > 0 ? '⚠️' : '✅';
    console.log(`\n${icon} ${r.name}`);
    console.log(`   URL: ${r.url}`);
    console.log(`   Tests: ${r.summary.passed}✅ ${r.summary.warned}⚠️ ${r.summary.failed}❌`);
    if (r.issues && r.issues.length > 0) {
      console.log(`   Issues:`);
      r.issues.forEach(i => console.log(`     - ${i}`));
      totalIssues += r.issues.length;
    }
    if (r.screenshots && r.screenshots.length > 0) {
      console.log(`   Screenshots: ${r.screenshots.length} saved`);
    }
  });

  console.log('\n' + '='.repeat(60));
  if (totalIssues > 0) {
    console.log(`⚠️ TOTAL ISSUES FOUND: ${totalIssues}`);
    console.log('❌ APPS NOT READY FOR PROMOTION');
  } else {
    console.log('✅ ALL APPS PASSED BASIC TESTS');
    console.log('✅ READY FOR PROMOTION');
  }
  console.log('='.repeat(60));

  // Save results to file
  const fs = require('fs');
  fs.writeFileSync('/tmp/app-test-results.json', JSON.stringify(allResults, null, 2));
  console.log('\nResults saved to /tmp/app-test-results.json');
}

main().catch(e => console.error('Fatal error:', e.message));
