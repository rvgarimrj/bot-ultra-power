#!/usr/bin/env node
/**
 * X Poster Final - Posts about portfolio with new app additions
 */

const { chromium } = require('playwright');
const fs = require('fs');

const TYPING_DELAY_MIN = 70;
const TYPING_DELAY_MAX = 150;
const WAIT_BETWEEN_POSTS_MS = 75000;

const PROJECTS = [
  {
    name: 'ClipGenius',
    url: 'https://garimdreaming-portfolio-production.up.railway.app',
    tweet: {
      en: `We just added another awesome App to our portfolio. Check it out and let me know what you think...

ClipGenius

https://garimdreaming-portfolio-production.up.railway.app/en-US

#BuildInPublic #IndieHacker #Portfolio`,
      pt: `Acabamos de adicionar no portfolio mais um App top. Da uma olhada la e me de sua opiniao...

ClipGenius

https://garimdreaming-portfolio-production.up.railway.app/pt-BR

#BuildInPublic #IndieHacker #Portfolio`,
      es: `Acabamos de agregar otra App increible a nuestro portafolio. Echale un vistazo y dime que opinas...

ClipGenius

https://garimdreaming-portfolio-production.up.railway.app/es

#BuildInPublic #IndieHacker #Portfolio`
    }
  },
  {
    name: 'BrandPulse AI',
    url: 'https://garimdreaming-portfolio-production.up.railway.app',
    tweet: {
      en: `We just added another awesome App to our portfolio. Check it out and let me know what you think...

BrandPulse AI

https://garimdreaming-portfolio-production.up.railway.app/en-US

#BuildInPublic #IndieHacker #Portfolio`,
      pt: `Acabamos de adicionar no portfolio mais um App top. Da uma olhada la e me de sua opiniao...

BrandPulse AI

https://garimdreaming-portfolio-production.up.railway.app/pt-BR

#BuildInPublic #IndieHacker #Portfolio`,
      es: `Acabamos de agregar otra App increible a nuestro portafolio. Echale un vistazo y dime que opinas...

BrandPulse AI

https://garimdreaming-portfolio-production.up.railway.app/es

#BuildInPublic #IndieHacker #Portfolio`
    }
  },
  {
    name: 'ContentAtomizer',
    url: 'https://garimdreaming-portfolio-production.up.railway.app',
    tweet: {
      en: `We just added another awesome App to our portfolio. Check it out and let me know what you think...

ContentAtomizer

https://garimdreaming-portfolio-production.up.railway.app/en-US

#BuildInPublic #IndieHacker #Portfolio`,
      pt: `Acabamos de adicionar no portfolio mais um App top. Da uma olhada la e me de sua opiniao...

ContentAtomizer

https://garimdreaming-portfolio-production.up.railway.app/pt-BR

#BuildInPublic #IndieHacker #Portfolio`,
      es: `Acabamos de agregar otra App increible a nuestro portafolio. Echale un vistazo y dime que opinas...

ContentAtomizer

https://garimdreaming-portfolio-production.up.railway.app/es

#BuildInPublic #IndieHacker #Portfolio`
    }
  },
  {
    name: 'FocusFlow',
    url: 'https://garimdreaming-portfolio-production.up.railway.app',
    tweet: {
      en: `We just added another awesome App to our portfolio. Check it out and let me know what you think...

FocusFlow

https://garimdreaming-portfolio-production.up.railway.app/en-US

#BuildInPublic #IndieHacker #Portfolio`,
      pt: `Acabamos de adicionar no portfolio mais um App top. Da uma olhada la e me de sua opiniao...

FocusFlow

https://garimdreaming-portfolio-production.up.railway.app/pt-BR

#BuildInPublic #IndieHacker #Portfolio`,
      es: `Acabamos de agregar otra App increible a nuestro portafolio. Echale un vistazo y dime que opinas...

FocusFlow

https://garimdreaming-portfolio-production.up.railway.app/es

#BuildInPublic #IndieHacker #Portfolio`
    }
  }
];

const sleep = ms => new Promise(r => setTimeout(r, ms));
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function typeSlowly(locator, text) {
  for (const char of text) {
    await locator.pressSequentially(char, { delay: rand(TYPING_DELAY_MIN, TYPING_DELAY_MAX) });
    if ([' ', '.', '\n', '!', '?', '-', ':'].includes(char)) {
      await sleep(rand(80, 200));
    }
  }
}

async function postTweet(page, tweet, postId) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Posting: ${postId}`);
  console.log(`${'='.repeat(50)}`);

  // Go to compose page directly
  console.log('1. Navigating to compose...');
  await page.goto('https://x.com/compose/post', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(3000);

  // Find text area - try multiple approaches
  console.log('2. Looking for text area...');

  let textArea = null;
  const selectors = [
    '[data-testid="tweetTextarea_0"]',
    '[role="textbox"][data-testid="tweetTextarea_0"]',
    'div[contenteditable="true"][role="textbox"]',
    '.public-DraftEditor-content',
    '[data-contents="true"]'
  ];

  for (const sel of selectors) {
    try {
      const loc = page.locator(sel).first();
      if (await loc.isVisible({ timeout: 2000 })) {
        textArea = loc;
        console.log(`   Found: ${sel}`);
        break;
      }
    } catch (e) {}
  }

  if (!textArea) {
    // Try clicking on the placeholder text
    try {
      const placeholder = page.locator('text="O que está acontecendo?"').first();
      if (await placeholder.isVisible({ timeout: 2000 })) {
        await placeholder.click();
        await sleep(500);
        textArea = page.locator('[data-testid="tweetTextarea_0"]').first();
      }
    } catch (e) {}
  }

  if (!textArea) {
    throw new Error('Could not find text area');
  }

  await textArea.click();
  await sleep(500);

  // Type tweet
  console.log('3. Typing tweet...');
  await typeSlowly(textArea, tweet);
  await sleep(2000);

  // Find post button
  console.log('4. Finding Post button...');
  const postBtn = page.locator('[data-testid="tweetButton"]').first();
  await postBtn.waitFor({ state: 'visible', timeout: 5000 });

  // Wait for enabled
  for (let i = 0; i < 10; i++) {
    const disabled = await postBtn.getAttribute('aria-disabled');
    if (disabled !== 'true') break;
    await sleep(500);
  }

  console.log('5. Clicking POST...');
  await postBtn.click();
  await sleep(5000);

  // Verify success
  const url = page.url();
  if (url.includes('/compose/post')) {
    // Still on compose - check for errors
    const saveDialog = await page.locator('text="Salvar post?"').isVisible({ timeout: 1000 }).catch(() => false);
    if (saveDialog) {
      await page.locator('button:has-text("Descartar")').click().catch(() => {});
      throw new Error('Save dialog appeared');
    }

    // Maybe it worked but URL didn't change
    const textAreaStillHasContent = await textArea.textContent().catch(() => '');
    if (textAreaStillHasContent.length > 10) {
      throw new Error('Content still in text area');
    }
  }

  console.log(`SUCCESS: ${postId}`);
  return true;
}

async function main() {
  console.log('Connecting to Chrome via CDP...');

  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];

  let page = context.pages().find(p => p.url().includes('x.com'));
  if (!page) {
    page = await context.newPage();
  }

  // Verify logged in
  await page.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
  await sleep(2000);

  const loggedIn = await page.locator('[data-testid="SideNav_NewTweet_Button"]').isVisible({ timeout: 5000 }).catch(() => false);
  if (!loggedIn) {
    console.log('ERROR: Not logged in!');
    return;
  }
  console.log('Logged in to X!');

  const posted = [];
  const failed = [];
  const langs = ['en', 'pt', 'es'];

  for (const project of PROJECTS) {
    for (const lang of langs) {
      const postId = `${project.name}-${lang}`;
      const tweet = project.tweet[lang];

      try {
        await postTweet(page, tweet, postId);
        posted.push(postId);

        if (posted.length + failed.length < PROJECTS.length * langs.length) {
          const wait = WAIT_BETWEEN_POSTS_MS + rand(5000, 15000);
          console.log(`Waiting ${Math.round(wait/1000)}s...`);
          await sleep(wait);
        }
      } catch (err) {
        console.log(`FAILED: ${postId} - ${err.message}`);
        failed.push({ id: postId, error: err.message });

        // Recovery
        await page.goto('https://x.com/home', { waitUntil: 'domcontentloaded' }).catch(() => {});
        await sleep(3000);
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('COMPLETED');
  console.log(`Success: ${posted.length}/12`);
  console.log(`Failed: ${failed.length}/12`);
  if (posted.length > 0) console.log('Posted:', posted.join(', '));
  if (failed.length > 0) console.log('Failed:', failed.map(f => f.id).join(', '));
  console.log('='.repeat(50));

  fs.writeFileSync('/tmp/x-post-results.json', JSON.stringify({ posted, failed, timestamp: new Date().toISOString() }, null, 2));
}

main().catch(e => console.error('Error:', e.message));
