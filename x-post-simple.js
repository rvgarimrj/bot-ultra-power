#!/usr/bin/env node
/**
 * X Poster Simple - Just connect and post ONE tweet to verify it works
 */

const { chromium } = require('playwright');

const TYPING_DELAY = 100;

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('Connecting to Chrome via CDP...');

  let browser;
  try {
    browser = await chromium.connectOverCDP('http://localhost:9222', {
      timeout: 10000
    });
  } catch (e) {
    console.error('Failed to connect to Chrome:', e.message);
    console.log('Make sure Chrome is running with: /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222');
    return;
  }

  console.log('Connected!');

  const contexts = browser.contexts();
  if (contexts.length === 0) {
    console.log('No contexts found');
    return;
  }

  const context = contexts[0];
  let page = context.pages().find(p => p.url().includes('x.com'));

  if (!page) {
    console.log('No X page found, creating one...');
    page = await context.newPage();
    await page.goto('https://x.com/home');
    await sleep(3000);
  }

  console.log('Current URL:', page.url());

  // Check login
  try {
    await page.locator('[data-testid="SideNav_NewTweet_Button"]').waitFor({ state: 'visible', timeout: 5000 });
    console.log('Logged in!');
  } catch (e) {
    console.log('Not logged in or compose button not found');
    return;
  }

  // Navigate to compose directly
  console.log('Navigating to compose...');
  await page.goto('https://x.com/compose/post', { waitUntil: 'domcontentloaded' });
  await sleep(3000);

  // Find text area
  const textArea = page.locator('[data-testid="tweetTextarea_0"]');
  try {
    await textArea.waitFor({ state: 'visible', timeout: 10000 });
    console.log('Found text area!');
  } catch (e) {
    console.log('Text area not found');
    console.log('Taking screenshot for debug...');
    await page.screenshot({ path: '/tmp/x-debug.png' });
    console.log('Screenshot saved to /tmp/x-debug.png');
    return;
  }

  // Type test tweet
  const tweet = `Just shipped ClipGenius 🚀

The problem: Content creators spend 4-8 hours editing long videos to find the "viral moment"

The solution: AI scans your video and finds the most engaging clips in seconds

Stats: 73% of creators say editing is their biggest bottleneck (Adobe survey 2025)

Try free: https://clipgenius-production.up.railway.app

#BuildInPublic #AITools #ContentCreator #VideoEditing #IndieHackers`;

  console.log('Typing tweet...');
  await textArea.click();
  await sleep(500);

  // Type character by character
  for (const char of tweet) {
    await textArea.pressSequentially(char, { delay: TYPING_DELAY });
  }

  await sleep(2000);

  // Click post button
  console.log('Looking for post button...');
  const postBtn = page.locator('[data-testid="tweetButton"]').first();
  await postBtn.waitFor({ state: 'visible', timeout: 5000 });

  // Check if enabled
  const disabled = await postBtn.getAttribute('aria-disabled');
  console.log('Button disabled:', disabled);

  if (disabled !== 'true') {
    console.log('Clicking POST...');
    await postBtn.click();
    await sleep(5000);

    // Check result
    const stillVisible = await textArea.isVisible().catch(() => false);
    if (!stillVisible) {
      console.log('SUCCESS! Tweet posted!');
    } else {
      console.log('Modal still open - may have failed');
      await page.screenshot({ path: '/tmp/x-after-post.png' });
    }
  } else {
    console.log('Button is disabled, cannot post');
  }
}

main().catch(e => {
  console.error('Error:', e.message);
});
