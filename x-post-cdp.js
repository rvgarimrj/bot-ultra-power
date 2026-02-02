#!/usr/bin/env node
/**
 * X/Twitter Poster via CDP - Connects to existing Chrome
 * Posts all 4 projects in 3 languages (12 posts total)
 */

const { chromium } = require('playwright');
const fs = require('fs');

const TYPING_DELAY_MIN = 80;
const TYPING_DELAY_MAX = 180;
const WAIT_BETWEEN_POSTS_MS = 75000; // 75 seconds

const PROJECTS = [
  {
    name: 'ClipGenius',
    url: 'https://clipgenius-production.up.railway.app',
    desc: {
      en: 'AI video editor that finds viral moments instantly',
      pt: 'Editor de video com IA que encontra momentos virais',
      es: 'Editor de video con IA que encuentra momentos virales'
    }
  },
  {
    name: 'BrandPulse AI',
    url: 'https://brandpulse-ai-production.up.railway.app',
    desc: {
      en: 'Is AI talking about your brand? Find out in 60 seconds',
      pt: 'A IA esta falando da sua marca? Descubra em 60 segundos',
      es: 'La IA habla de tu marca? Descubrelo en 60 segundos'
    }
  },
  {
    name: 'ContentAtomizer',
    url: 'https://contentatomizer-production.up.railway.app',
    desc: {
      en: 'One content piece becomes posts for every platform',
      pt: 'Um conteudo vira posts para todas as plataformas',
      es: 'Un contenido se convierte en posts para todas las plataformas'
    }
  },
  {
    name: 'FocusFlow',
    url: 'https://focusflow-production-2e04.up.railway.app',
    desc: {
      en: 'Smart pomodoro timer for maximum productivity',
      pt: 'Timer pomodoro inteligente para produtividade maxima',
      es: 'Timer pomodoro inteligente para productividad maxima'
    }
  }
];

function getTweet(project, lang) {
  const templates = {
    en: `Just launched: ${project.name}

${project.desc.en}

Try it free: ${project.url}

Built with love by @gabrielabiramia

#buildinpublic #indiehackers`,
    pt: `Acabei de lancar: ${project.name}

${project.desc.pt}

Experimente gratis: ${project.url}

Feito com amor por @gabrielabiramia

#buildinpublic #indiehackers`,
    es: `Acabo de lanzar: ${project.name}

${project.desc.es}

Pruebalo gratis: ${project.url}

Hecho con amor por @gabrielabiramia

#buildinpublic #indiehackers`
  };
  return templates[lang];
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function typeSlowly(locator, text) {
  for (const char of text) {
    await locator.pressSequentially(char, { delay: rand(TYPING_DELAY_MIN, TYPING_DELAY_MAX) });
    if ([' ', '.', '\n', '!', '?'].includes(char)) {
      await sleep(rand(100, 300));
    }
  }
}

async function postTweet(page, tweet, postId) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Posting: ${postId}`);
  console.log(`${'='.repeat(50)}`);

  // Make sure we're on X home
  const url = page.url();
  if (!url.includes('x.com/home')) {
    console.log('Navigating to X home...');
    await page.goto('https://x.com/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(3000);
  }

  // Close any open dialogs first
  try {
    await page.keyboard.press('Escape');
    await sleep(500);
    const discardBtn = page.locator('button:has-text("Descartar"), button:has-text("Discard")');
    if (await discardBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await discardBtn.click();
      await sleep(1000);
    }
  } catch (e) {}

  // Click the compose button
  console.log('1. Clicking compose button...');
  const composeBtn = page.locator('[data-testid="SideNav_NewTweet_Button"]');
  await composeBtn.waitFor({ state: 'visible', timeout: 10000 });
  await composeBtn.click();
  await sleep(2500);

  // Wait for compose modal
  console.log('2. Waiting for compose modal...');

  // Try multiple selectors for the text area
  const textAreaSelectors = [
    '[data-testid="tweetTextarea_0"]',
    '[role="textbox"][data-testid="tweetTextarea_0"]',
    'div[contenteditable="true"][data-testid="tweetTextarea_0"]',
    '.public-DraftEditor-content'
  ];

  let textArea = null;
  for (const selector of textAreaSelectors) {
    try {
      const loc = page.locator(selector);
      if (await loc.isVisible({ timeout: 3000 }).catch(() => false)) {
        textArea = loc;
        console.log(`   Found: ${selector}`);
        break;
      }
    } catch (e) {}
  }

  if (!textArea) {
    throw new Error('Could not find compose text area');
  }

  await textArea.click();
  await sleep(500);

  // Type the tweet slowly
  console.log('3. Typing tweet slowly...');
  await typeSlowly(textArea, tweet);
  await sleep(2000);

  // Find and click the POST button
  console.log('4. Looking for Post button...');

  // The post button is data-testid="tweetButton" - wait for it to be enabled
  const postBtn = page.locator('[data-testid="tweetButton"]').first();
  await postBtn.waitFor({ state: 'visible', timeout: 5000 });

  // Check if enabled
  let attempts = 0;
  while (attempts < 5) {
    const disabled = await postBtn.getAttribute('aria-disabled');
    if (disabled !== 'true') {
      break;
    }
    console.log('   Button disabled, waiting...');
    await sleep(1000);
    attempts++;
  }

  console.log('5. Clicking POST button...');
  await postBtn.click({ force: true });
  await sleep(4000);

  // Check for save dialog (means post failed)
  const saveDialog = await page.locator('text="Salvar post?"').isVisible({ timeout: 1000 }).catch(() => false);
  if (saveDialog) {
    console.log('ERROR: Save dialog appeared - clicking Descartar');
    await page.locator('button:has-text("Descartar")').click().catch(() => {});
    await sleep(1000);
    throw new Error('Post was not made - save dialog appeared');
  }

  // Check if modal closed (success)
  const modalStillOpen = await textArea.isVisible({ timeout: 1500 }).catch(() => false);
  if (modalStillOpen) {
    // Try escape and discard
    await page.keyboard.press('Escape');
    await sleep(500);
    const discardBtn = page.locator('button:has-text("Descartar")');
    if (await discardBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await discardBtn.click();
    }
    throw new Error('Modal did not close after clicking post');
  }

  console.log(`SUCCESS: Posted ${postId}`);
  return true;
}

async function main() {
  console.log('Connecting to Chrome via CDP on port 9222...');

  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();

  if (contexts.length === 0) {
    console.log('No browser contexts found');
    return;
  }

  const context = contexts[0];
  const pages = context.pages();

  // Find X page or create one
  let page = pages.find(p => p.url().includes('x.com'));
  if (!page) {
    page = await context.newPage();
    await page.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
    await sleep(3000);
  }

  // Check if logged in
  const loggedIn = await page.locator('[data-testid="SideNav_NewTweet_Button"]').isVisible({ timeout: 5000 }).catch(() => false);
  if (!loggedIn) {
    console.log('ERROR: Not logged in to X!');
    return;
  }
  console.log('Logged in to X!');

  const posted = [];
  const failed = [];
  const langs = ['en', 'pt', 'es'];

  for (const project of PROJECTS) {
    for (const lang of langs) {
      const postId = `${project.name}-${lang}`;
      const tweet = getTweet(project, lang);

      try {
        await postTweet(page, tweet, postId);
        posted.push(postId);

        // Wait between posts
        if (posted.length + failed.length < PROJECTS.length * langs.length) {
          const waitTime = WAIT_BETWEEN_POSTS_MS + rand(5000, 15000);
          console.log(`Waiting ${Math.round(waitTime/1000)}s before next post...`);
          await sleep(waitTime);
        }
      } catch (err) {
        console.log(`FAILED: ${postId} - ${err.message}`);
        failed.push({ id: postId, error: err.message });

        // Try to recover
        await page.goto('https://x.com/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
        await sleep(3000);
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('COMPLETED');
  console.log(`Success: ${posted.length}/12`);
  console.log(`Failed: ${failed.length}/12`);
  if (failed.length > 0) {
    console.log('Failed posts:', failed.map(f => f.id).join(', '));
  }
  console.log('='.repeat(50));

  // Save results
  fs.writeFileSync('/tmp/x-post-results.json', JSON.stringify({
    posted,
    failed,
    timestamp: new Date().toISOString()
  }, null, 2));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
