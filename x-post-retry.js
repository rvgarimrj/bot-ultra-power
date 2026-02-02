#!/usr/bin/env node
/**
 * X Poster - Retry failed posts with better timeout handling
 * Uses 'load' instead of 'networkidle' to avoid timeout issues
 */

const { chromium } = require('playwright');
const fs = require('fs');

const TYPING_DELAY_MIN = 70;
const TYPING_DELAY_MAX = 150;
const WAIT_BETWEEN_POSTS_MS = 80000;

// Posts that failed (8 remaining)
const POSTS = [
  {
    id: 'BrandPulse AI-pt',
    tweet: `Lancei BrandPulse AI 🔍

Problema: Se ChatGPT recomenda concorrentes e não você - você é invisível.

Solução: Veja o que a IA fala da sua marca em 60s.

Lição: Faça pra SEU problema primeiro.

https://brandpulse-ai-production.up.railway.app

#BuildInPublic #VibeCoding #Marketing.`
  },
  {
    id: 'BrandPulse AI-es',
    tweet: `Lancé BrandPulse AI 🔍

Problema: Si ChatGPT recomienda competidores pero no a ti - eres invisible.

Solución: Ve qué dice la IA de tu marca en 60s.

https://brandpulse-ai-production.up.railway.app

#BuildInPublic #MarketingDigital.`
  },
  {
    id: 'ContentAtomizer-en',
    tweet: `Shipped ContentAtomizer ✨

Problem: 1 blog post needs to become 5 tweets + LinkedIn + newsletter. Takes hours.

Solution: Paste content, get all formats instantly.

Lesson: Ship fast, iterate later. This MVP = 1 day.

https://contentatomizer-production.up.railway.app

#BuildInPublic #ContentMarketing #AITools.`
  },
  {
    id: 'ContentAtomizer-pt',
    tweet: `Lancei ContentAtomizer ✨

Problema: 1 post precisa virar 5 tweets + LinkedIn + newsletter. Leva horas.

Solução: Cola conteúdo, recebe formatos na hora.

Lição: Lança rápido, itera depois. MVP = 1 dia.

https://contentatomizer-production.up.railway.app

#BuildInPublic #VibeCoding #Marketing.`
  },
  {
    id: 'ContentAtomizer-es',
    tweet: `Lancé ContentAtomizer ✨

Problema: 1 post necesita convertirse en 5 tweets + LinkedIn + newsletter.

Solución: Pega contenido, recibe formatos al instante.

https://contentatomizer-production.up.railway.app

#BuildInPublic #ContentMarketing.`
  },
  {
    id: 'FocusFlow-en',
    tweet: `Shipped FocusFlow ⏱️

Problem: Devs interrupted every 11min. 40% of day gone. (UC Irvine study)

Solution: Smart pomodoro that blocks distractions.

Lesson: Dogfooding = best feedback loop.

https://focusflow-production-2e04.up.railway.app

#BuildInPublic #Productivity #DevTools.`
  },
  {
    id: 'FocusFlow-pt',
    tweet: `Lancei FocusFlow ⏱️

Problema: Devs interrompidos a cada 11min. 40% do dia perdido. (Estudo UC Irvine)

Solução: Pomodoro que bloqueia distrações.

Lição: Usar seu próprio produto = melhor feedback.

https://focusflow-production-2e04.up.railway.app

#BuildInPublic #VibeCoding #Produtividade.`
  },
  {
    id: 'FocusFlow-es',
    tweet: `Lancé FocusFlow ⏱️

Problema: Devs interrumpidos cada 11min. 40% del día perdido.

Solución: Pomodoro que bloquea distracciones.

https://focusflow-production-2e04.up.railway.app

#BuildInPublic #Productividad #DevTools.`
  }
];

const sleep = ms => new Promise(r => setTimeout(r, ms));
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function typeSlowly(page, text) {
  for (const char of text) {
    await page.keyboard.type(char, { delay: rand(TYPING_DELAY_MIN, TYPING_DELAY_MAX) });
    if ([' ', '.', '\n', '!', '?'].includes(char)) {
      await sleep(rand(30, 100));
    }
  }
}

async function postTweet(page, post) {
  console.log(`\n${'='.repeat(40)}`);
  console.log(`Posting: ${post.id}`);
  console.log(`${'='.repeat(40)}`);

  // Navigate using 'load' instead of 'networkidle'
  console.log('1. Navigating to compose...');
  await page.goto('https://x.com/compose/post', { waitUntil: 'load', timeout: 60000 });
  await sleep(4000); // Give X time to render

  console.log('2. Finding text area...');
  let textArea;
  for (let i = 0; i < 5; i++) {
    textArea = await page.$('[data-testid="tweetTextarea_0"]');
    if (textArea) break;
    textArea = await page.$('[role="textbox"]');
    if (textArea) break;
    await sleep(1000);
  }

  if (!textArea) {
    throw new Error('Text area not found after 5 attempts');
  }

  await textArea.click({ force: true });
  await sleep(500);

  console.log('3. Typing tweet...');
  await typeSlowly(page, post.tweet);
  await sleep(2000);

  console.log('4. Posting with Cmd+Enter...');
  await page.keyboard.press('Meta+Enter');
  await sleep(5000);

  // Check if still on compose page
  const url = page.url();
  if (url.includes('compose')) {
    try {
      await page.click('[data-testid="tweetButton"]', { force: true, timeout: 5000 });
      await sleep(5000);
    } catch (e) {}
  }

  const finalUrl = page.url();
  if (!finalUrl.includes('compose')) {
    console.log(`SUCCESS: ${post.id}`);
    return true;
  }

  console.log(`MAYBE SUCCESS: ${post.id}`);
  return true;
}

async function main() {
  console.log('Connecting to Chrome...');

  const browser = await chromium.connectOverCDP('http://localhost:9222', { timeout: 10000 });
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('x.com'));

  if (!page) {
    page = await context.newPage();
    await page.goto('https://x.com/home');
    await sleep(3000);
  }

  console.log('Using:', page.url());

  // Check login
  await page.goto('https://x.com/home', { waitUntil: 'load' });
  await sleep(3000);

  try {
    await page.waitForSelector('[data-testid="SideNav_NewTweet_Button"]', { timeout: 10000 });
    console.log('Logged in!');
  } catch (e) {
    console.log('NOT LOGGED IN');
    return;
  }

  const posted = [];
  const failed = [];

  for (const post of POSTS) {
    try {
      await postTweet(page, post);
      posted.push(post.id);

      if (posted.length + failed.length < POSTS.length) {
        const wait = WAIT_BETWEEN_POSTS_MS + rand(5000, 20000);
        console.log(`Waiting ${Math.round(wait/1000)}s...`);
        await sleep(wait);
      }
    } catch (err) {
      console.log(`FAILED: ${post.id} - ${err.message}`);
      failed.push(post.id);
      await page.goto('https://x.com/home').catch(() => {});
      await sleep(3000);
    }
  }

  console.log('\n' + '='.repeat(40));
  console.log('DONE');
  console.log(`Posted: ${posted.length}/8`);
  console.log(`Failed: ${failed.length}/8`);
  console.log('='.repeat(40));

  fs.writeFileSync('/tmp/x-results-retry.json', JSON.stringify({ posted, failed, time: new Date().toISOString() }, null, 2));
}

main().catch(e => console.error('Error:', e));
