#!/usr/bin/env node
/**
 * X Poster Direct - Connects to specific X tab and posts
 */

const { chromium } = require('playwright');
const fs = require('fs');

const TYPING_DELAY_MIN = 70;
const TYPING_DELAY_MAX = 150;
const WAIT_BETWEEN_POSTS_MS = 75000;

const PROJECTS = [
  {
    name: 'ClipGenius',
    url: 'https://clipgenius-production.up.railway.app',
    tweet: {
      en: `Shipped ClipGenius 🚀

Problem: Creators spend 4-8h editing videos to find "viral moments"

Solution: AI finds the best clips in seconds

Research: 73% say editing is their biggest bottleneck (Adobe 2025)

Lesson: Start with the pain, not the tech.

Free: https://clipgenius-production.up.railway.app

#BuildInPublic #AITools #ContentCreator #VideoEditing`,
      pt: `Lancei ClipGenius 🚀

Problema: Criadores gastam 4-8h editando video pra achar "momento viral"

Solucao: IA encontra os melhores clipes em segundos

Pesquisa: 73% dizem que edicao e o maior gargalo (Adobe 2025)

Licao: Comece pela dor, nao pela tech.

Gratis: https://clipgenius-production.up.railway.app

#BuildInPublic #VibeCoding #IABrasil #ContentCreator`,
      es: `Lance ClipGenius 🚀

Problema: Creadores gastan 4-8h editando video para encontrar "momento viral"

Solucion: IA encuentra los mejores clips en segundos

Leccion: Empieza por el dolor, no por la tech.

Gratis: https://clipgenius-production.up.railway.app

#BuildInPublic #AITools #Emprendedores`
    }
  },
  {
    name: 'BrandPulse AI',
    url: 'https://brandpulse-ai-production.up.railway.app',
    tweet: {
      en: `Shipped BrandPulse AI 🔍

Problem: 89% of purchases start with search. If ChatGPT recommends your competitor but not you - you're invisible.

Solution: See what AI says about your brand in 60 seconds

Lesson: Build for YOUR OWN problem first.

Try: https://brandpulse-ai-production.up.railway.app

#BuildInPublic #AIMarketing #SEO #StartupTools`,
      pt: `Lancei BrandPulse AI 🔍

Problema: 89% das compras comecam com busca. Se ChatGPT recomenda seu concorrente e nao voce - voce e invisivel.

Solucao: Veja o que a IA fala da sua marca em 60 segundos

Licao: Faca pra resolver SEU problema primeiro.

Teste: https://brandpulse-ai-production.up.railway.app

#BuildInPublic #VibeCoding #Marketing`,
      es: `Lance BrandPulse AI 🔍

Problema: 89% de compras empiezan con busqueda. Si ChatGPT recomienda tu competidor - eres invisible.

Solucion: Ve que dice la IA de tu marca en 60 segundos

Prueba: https://brandpulse-ai-production.up.railway.app

#BuildInPublic #MarketingDigital #Startups`
    }
  },
  {
    name: 'ContentAtomizer',
    url: 'https://contentatomizer-production.up.railway.app',
    tweet: {
      en: `Shipped ContentAtomizer ✨

Problem: 1 blog post needs to become 5 tweets + LinkedIn + newsletter. Takes hours.

Solution: Paste content, get all formats instantly

Lesson: Ship fast, iterate later. This MVP took 1 day.

Try: https://contentatomizer-production.up.railway.app

#BuildInPublic #ContentMarketing #AITools #CreatorEconomy`,
      pt: `Lancei ContentAtomizer ✨

Problema: 1 post precisa virar 5 tweets + LinkedIn + newsletter. Leva horas.

Solucao: Cola o conteudo, recebe todos os formatos na hora

Licao: Lanca rapido, itera depois. Esse MVP levou 1 dia.

Teste: https://contentatomizer-production.up.railway.app

#BuildInPublic #VibeCoding #Marketing #IndieHackers`,
      es: `Lance ContentAtomizer ✨

Problema: 1 post necesita convertirse en 5 tweets + LinkedIn + newsletter.

Solucion: Pega contenido, recibe todos los formatos al instante

Leccion: Lanza rapido, itera despues.

Prueba: https://contentatomizer-production.up.railway.app

#BuildInPublic #ContentMarketing #Emprendedores`
    }
  },
  {
    name: 'FocusFlow',
    url: 'https://focusflow-production-2e04.up.railway.app',
    tweet: {
      en: `Shipped FocusFlow ⏱️

Problem: Devs are interrupted every 11 min. Takes 23 min to refocus. 40% of day gone. (UC Irvine)

Solution: Smart pomodoro that blocks distractions

Lesson: Dogfooding = best feedback loop.

Try: https://focusflow-production-2e04.up.railway.app

#BuildInPublic #Productivity #DevTools #FocusTime`,
      pt: `Lancei FocusFlow ⏱️

Problema: Devs sao interrompidos a cada 11 min. Leva 23 min pra voltar ao foco. (UC Irvine)

Solucao: Pomodoro inteligente que bloqueia distracoes

Licao: Usar seu proprio produto = melhor feedback.

Teste: https://focusflow-production-2e04.up.railway.app

#BuildInPublic #VibeCoding #Produtividade #DevBR`,
      es: `Lance FocusFlow ⏱️

Problema: Devs son interrumpidos cada 11 min. Toma 23 min para recuperar foco.

Solucion: Pomodoro inteligente que bloquea distracciones

Leccion: Usar tu propio producto = mejor feedback.

Prueba: https://focusflow-production-2e04.up.railway.app

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
      await sleep(rand(50, 150));
    }
  }
}

async function postTweet(page, tweet, postId) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Posting: ${postId}`);
  console.log(`${'='.repeat(50)}`);

  // Navigate to compose
  console.log('1. Going to compose...');
  await page.goto('https://x.com/compose/post', { waitUntil: 'load', timeout: 30000 });
  await sleep(4000);

  // Click on text area (it should be focused but let's make sure)
  console.log('2. Finding text area...');

  // Wait for the compose modal/page to be ready
  await page.waitForSelector('[data-testid="tweetTextarea_0"], [role="textbox"]', { timeout: 10000 });

  // Click on it
  const textArea = await page.$('[data-testid="tweetTextarea_0"]') || await page.$('[role="textbox"]');
  if (!textArea) {
    throw new Error('Text area not found');
  }

  await textArea.click();
  await sleep(500);

  // Type the tweet
  console.log('3. Typing...');
  await typeSlowly(page, tweet);
  await sleep(2000);

  // Find and click Post button
  console.log('4. Posting...');
  const postBtn = await page.$('[data-testid="tweetButton"]');
  if (!postBtn) {
    throw new Error('Post button not found');
  }

  // Wait for button to be enabled
  for (let i = 0; i < 10; i++) {
    const disabled = await postBtn.getAttribute('aria-disabled');
    if (disabled !== 'true') break;
    await sleep(500);
  }

  await postBtn.click();
  await sleep(5000);

  // Check if we're still on compose page
  const currentUrl = page.url();
  if (currentUrl.includes('compose')) {
    // Check for save dialog
    const saveDialog = await page.$('text="Salvar post?"');
    if (saveDialog) {
      const discardBtn = await page.$('button:has-text("Descartar")');
      if (discardBtn) await discardBtn.click();
      throw new Error('Save dialog appeared');
    }
  }

  console.log(`SUCCESS: ${postId}`);
  return true;
}

async function main() {
  console.log('Connecting to Chrome CDP...');

  const browser = await chromium.connectOverCDP('http://localhost:9222');
  console.log('Connected to browser');

  const contexts = browser.contexts();
  console.log(`Found ${contexts.length} contexts`);

  if (contexts.length === 0) {
    console.log('No contexts!');
    return;
  }

  const context = contexts[0];
  const pages = context.pages();
  console.log(`Found ${pages.length} pages`);

  // Find X page
  let page = null;
  for (const p of pages) {
    const url = p.url();
    console.log(`  - ${url}`);
    if (url.includes('x.com')) {
      page = p;
      break;
    }
  }

  if (!page) {
    console.log('Creating new X page...');
    page = await context.newPage();
    await page.goto('https://x.com/home');
    await sleep(3000);
  }

  console.log('Using page:', page.url());

  // Bring page to front
  await page.bringToFront();
  await sleep(1000);

  // Check if logged in by looking for compose button or profile
  await page.goto('https://x.com/home', { waitUntil: 'load' });
  await sleep(3000);

  const composeBtn = await page.$('[data-testid="SideNav_NewTweet_Button"]');
  if (!composeBtn) {
    console.log('ERROR: Not logged in (no compose button found)');
    await page.screenshot({ path: '/tmp/x-not-logged.png' });
    console.log('Screenshot saved to /tmp/x-not-logged.png');
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

        await page.goto('https://x.com/home').catch(() => {});
        await sleep(3000);
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('RESULT');
  console.log(`Success: ${posted.length}/12`);
  console.log(`Failed: ${failed.length}/12`);
  if (posted.length > 0) console.log('Posted:', posted.join(', '));
  if (failed.length > 0) console.log('Failed:', failed.map(f => f.id).join(', '));
  console.log('='.repeat(50));

  fs.writeFileSync('/tmp/x-post-results.json', JSON.stringify({ posted, failed, timestamp: new Date().toISOString() }, null, 2));
}

main().catch(e => console.error('Fatal:', e.message));
