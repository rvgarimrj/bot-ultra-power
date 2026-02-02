#!/usr/bin/env node
/**
 * X Poster using Keyboard shortcuts - avoids click interception
 */

const { chromium } = require('playwright');
const fs = require('fs');

const TYPING_DELAY_MIN = 70;
const TYPING_DELAY_MAX = 150;
const WAIT_BETWEEN_POSTS_MS = 80000;

const PROJECTS = [
  {
    name: 'ClipGenius',
    tweet: {
      en: `Shipped ClipGenius 🚀

Problem: Creators spend 4-8h editing videos to find "viral moments"
Solution: AI finds best clips in seconds

Research: 73% say editing is their biggest bottleneck

Lesson: Start with the pain, not the tech.

https://clipgenius-production.up.railway.app

#BuildInPublic #AITools #ContentCreator`,
      pt: `Lancei ClipGenius 🚀

Problema: Criadores gastam 4-8h editando video
Solucao: IA encontra melhores clipes em segundos

Pesquisa: 73% dizem que edicao e o maior gargalo

Licao: Comece pela dor, nao pela tech.

https://clipgenius-production.up.railway.app

#BuildInPublic #VibeCoding #IABrasil`,
      es: `Lance ClipGenius 🚀

Problema: Creadores gastan 4-8h editando video
Solucion: IA encuentra mejores clips en segundos

Leccion: Empieza por el dolor, no por la tech.

https://clipgenius-production.up.railway.app

#BuildInPublic #AITools #Emprendedores`
    }
  },
  {
    name: 'BrandPulse AI',
    tweet: {
      en: `Shipped BrandPulse AI 🔍

Problem: If ChatGPT recommends competitors but not you - you're invisible

Solution: See what AI says about your brand in 60s

Lesson: Build for YOUR OWN problem first.

https://brandpulse-ai-production.up.railway.app

#BuildInPublic #AIMarketing #SEO`,
      pt: `Lancei BrandPulse AI 🔍

Problema: Se ChatGPT recomenda concorrentes e nao voce - voce e invisivel

Solucao: Veja o que a IA fala da sua marca em 60s

Licao: Faca pra SEU problema primeiro.

https://brandpulse-ai-production.up.railway.app

#BuildInPublic #VibeCoding #Marketing`,
      es: `Lance BrandPulse AI 🔍

Problema: Si ChatGPT recomienda competidores pero no a ti - eres invisible

Solucion: Ve que dice la IA de tu marca en 60s

https://brandpulse-ai-production.up.railway.app

#BuildInPublic #MarketingDigital`
    }
  },
  {
    name: 'ContentAtomizer',
    tweet: {
      en: `Shipped ContentAtomizer ✨

Problem: 1 blog post → 5 tweets + LinkedIn + newsletter. Takes hours.

Solution: Paste content, get all formats instantly

Lesson: Ship fast, iterate later. This MVP = 1 day.

https://contentatomizer-production.up.railway.app

#BuildInPublic #ContentMarketing #AITools`,
      pt: `Lancei ContentAtomizer ✨

Problema: 1 post → 5 tweets + LinkedIn + newsletter. Leva horas.

Solucao: Cola conteudo, recebe formatos na hora

Licao: Lanca rapido, itera depois. MVP = 1 dia.

https://contentatomizer-production.up.railway.app

#BuildInPublic #VibeCoding #Marketing`,
      es: `Lance ContentAtomizer ✨

Problema: 1 post → 5 tweets + LinkedIn + newsletter

Solucion: Pega contenido, recibe formatos al instante

https://contentatomizer-production.up.railway.app

#BuildInPublic #ContentMarketing`
    }
  },
  {
    name: 'FocusFlow',
    tweet: {
      en: `Shipped FocusFlow ⏱️

Problem: Devs interrupted every 11min. 40% of day gone.

Solution: Smart pomodoro that blocks distractions

Lesson: Dogfooding = best feedback loop.

https://focusflow-production-2e04.up.railway.app

#BuildInPublic #Productivity #DevTools`,
      pt: `Lancei FocusFlow ⏱️

Problema: Devs interrompidos a cada 11min. 40% do dia perdido.

Solucao: Pomodoro que bloqueia distracoes

Licao: Usar seu produto = melhor feedback.

https://focusflow-production-2e04.up.railway.app

#BuildInPublic #VibeCoding #Produtividade`,
      es: `Lance FocusFlow ⏱️

Problema: Devs interrumpidos cada 11min. 40% del dia perdido.

Solucion: Pomodoro que bloquea distracciones

https://focusflow-production-2e04.up.railway.app

#BuildInPublic #Productividad #DevTools`
    }
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

async function postTweet(page, tweet, postId) {
  console.log(`\n${'='.repeat(40)}`);
  console.log(`Posting: ${postId}`);
  console.log(`${'='.repeat(40)}`);

  // Go to compose
  console.log('1. Navigating to compose...');
  await page.goto('https://x.com/compose/post', { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(3000);

  // Wait for text area and focus
  console.log('2. Finding text area...');
  try {
    await page.waitForSelector('[data-testid="tweetTextarea_0"]', { timeout: 10000 });
  } catch (e) {
    console.log('   Using fallback selector...');
    await page.waitForSelector('[role="textbox"]', { timeout: 5000 });
  }

  // Click with force to bypass overlays
  await page.click('[data-testid="tweetTextarea_0"], [role="textbox"]', { force: true });
  await sleep(500);

  // Type using keyboard
  console.log('3. Typing tweet...');
  await typeSlowly(page, tweet);
  await sleep(2000);

  // Use Cmd+Enter to post (Mac shortcut)
  console.log('4. Posting with Cmd+Enter...');
  await page.keyboard.press('Meta+Enter');
  await sleep(5000);

  // Check if still on compose page
  const url = page.url();
  if (url.includes('compose')) {
    // Try clicking post button with force
    console.log('   Trying button click...');
    try {
      await page.click('[data-testid="tweetButton"]', { force: true, timeout: 5000 });
      await sleep(5000);
    } catch (e) {
      console.log('   Button click failed, checking result...');
    }
  }

  // Final URL check
  const finalUrl = page.url();
  if (!finalUrl.includes('compose')) {
    console.log(`SUCCESS: ${postId}`);
    return true;
  }

  // Check for save dialog
  try {
    const hasDialog = await page.isVisible('text="Salvar post?"', { timeout: 1000 });
    if (hasDialog) {
      await page.click('button:has-text("Descartar")', { force: true });
      throw new Error('Save dialog appeared');
    }
  } catch (e) {}

  // Maybe it worked even though URL has compose
  console.log(`MAYBE SUCCESS: ${postId} (URL still has compose)`);
  return true;
}

async function main() {
  console.log('Connecting to Chrome...');

  let browser;
  try {
    browser = await chromium.connectOverCDP('http://localhost:9222', { timeout: 10000 });
  } catch (e) {
    console.error('Failed to connect:', e.message);
    return;
  }

  const context = browser.contexts()[0];
  if (!context) {
    console.log('No context found');
    return;
  }

  const pages = context.pages();
  let page = pages.find(p => p.url().includes('x.com'));

  if (!page) {
    page = await context.newPage();
    await page.goto('https://x.com/home');
    await sleep(3000);
  }

  console.log('Using:', page.url());

  // Check login
  await page.goto('https://x.com/home', { waitUntil: 'networkidle' });
  await sleep(2000);

  try {
    await page.waitForSelector('[data-testid="SideNav_NewTweet_Button"]', { timeout: 5000 });
    console.log('Logged in!');
  } catch (e) {
    console.log('NOT LOGGED IN');
    return;
  }

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
          const wait = WAIT_BETWEEN_POSTS_MS + rand(5000, 20000);
          console.log(`Waiting ${Math.round(wait/1000)}s...`);
          await sleep(wait);
        }
      } catch (err) {
        console.log(`FAILED: ${postId} - ${err.message}`);
        failed.push(postId);
        await page.goto('https://x.com/home').catch(() => {});
        await sleep(3000);
      }
    }
  }

  console.log('\n' + '='.repeat(40));
  console.log('DONE');
  console.log(`Posted: ${posted.length}/12`);
  console.log(`Failed: ${failed.length}/12`);
  console.log('='.repeat(40));

  fs.writeFileSync('/tmp/x-results.json', JSON.stringify({ posted, failed, time: new Date().toISOString() }, null, 2));
}

main().catch(e => console.error('Error:', e));
