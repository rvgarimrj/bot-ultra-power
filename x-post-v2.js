#!/usr/bin/env node
/**
 * X/Twitter Poster v2 - Connects to existing Chrome
 * Posts with research insights and proper hashtags
 */

const { chromium } = require('playwright');
const fs = require('fs');

const TYPING_DELAY_MIN = 80;
const TYPING_DELAY_MAX = 180;
const WAIT_BETWEEN_POSTS_MS = 80000; // 80 seconds

const PROJECTS = [
  {
    name: 'ClipGenius',
    url: 'https://clipgenius-production.up.railway.app',
    tweet: {
      en: `Just shipped ClipGenius 🚀

The problem: Content creators spend 4-8 hours editing long videos to find the "viral moment"

The solution: AI scans your video and finds the most engaging clips in seconds

Stats: 73% of creators say editing is their biggest bottleneck (Adobe survey 2025)

Try free: https://clipgenius-production.up.railway.app

#BuildInPublic #AITools #ContentCreator #VideoEditing #IndieHackers`,
      pt: `Acabei de lancar ClipGenius 🚀

O problema: Criadores gastam 4-8h editando videos longos pra achar o "momento viral"

A solucao: IA escaneia o video e encontra os melhores clipes em segundos

Dados: 73% dos criadores dizem que edicao e o maior gargalo (Adobe 2025)

Experimente: https://clipgenius-production.up.railway.app

#BuildInPublic #VibeCoding #IABrasil #ContentCreator #IndieHackers`,
      es: `Acabo de lanzar ClipGenius 🚀

El problema: Creadores pasan 4-8h editando videos largos para encontrar el "momento viral"

La solucion: IA escanea tu video y encuentra los mejores clips en segundos

Datos: 73% de creadores dicen que edicion es su mayor cuello de botella

Prueba gratis: https://clipgenius-production.up.railway.app

#BuildInPublic #AITools #ContentCreator #Emprendedores`
    }
  },
  {
    name: 'BrandPulse AI',
    url: 'https://brandpulse-ai-production.up.railway.app',
    tweet: {
      en: `Shipped BrandPulse AI 🔍

Research insight: 89% of purchase decisions start with online search. If AI mentions your competitor but not you - you're invisible.

What it does: Monitors what AI chatbots (ChatGPT, Claude, Gemini) say about your brand

60 seconds to know if AI is helping or hurting you

Try: https://brandpulse-ai-production.up.railway.app

#BuildInPublic #AIMarketing #BrandMonitoring #StartupTools #SEO`,
      pt: `Lancei BrandPulse AI 🔍

Insight: 89% das decisoes de compra comecam com busca online. Se a IA menciona seu concorrente mas nao voce - voce e invisivel.

O que faz: Monitora o que ChatGPT, Claude e Gemini falam da sua marca

60 segundos pra saber se a IA ta te ajudando ou prejudicando

Teste: https://brandpulse-ai-production.up.railway.app

#BuildInPublic #VibeCoding #Marketing #IndieHackers`,
      es: `Lance BrandPulse AI 🔍

Dato: 89% de decisiones de compra empiezan con busqueda online. Si la IA menciona tu competidor pero no a ti - eres invisible.

Que hace: Monitorea lo que ChatGPT, Claude y Gemini dicen de tu marca

60 segundos para saber si la IA te ayuda o perjudica

Prueba: https://brandpulse-ai-production.up.railway.app

#BuildInPublic #MarketingDigital #Startups #Emprendedores`
    }
  },
  {
    name: 'ContentAtomizer',
    url: 'https://contentatomizer-production.up.railway.app',
    tweet: {
      en: `Shipped ContentAtomizer ✨

The pain: You wrote 1 great blog post. Now you need:
- 5 tweets
- 1 LinkedIn post
- 1 newsletter
- 3 IG captions

Takes hours. Brain melts.

The fix: Paste your content, get all formats instantly

Built for creators who hate repeating themselves

https://contentatomizer-production.up.railway.app

#BuildInPublic #ContentMarketing #AITools #CreatorEconomy`,
      pt: `Lancei ContentAtomizer ✨

A dor: Voce escreveu 1 post incrivel. Agora precisa:
- 5 tweets
- 1 post LinkedIn
- 1 newsletter
- 3 legendas IG

Leva horas. Cerebro derrete.

A solucao: Cola seu conteudo, recebe todos os formatos na hora

Feito pra criadores que odeiam se repetir

https://contentatomizer-production.up.railway.app

#BuildInPublic #VibeCoding #Marketing #IndieHackers`,
      es: `Lance ContentAtomizer ✨

El dolor: Escribiste 1 post genial. Ahora necesitas:
- 5 tweets
- 1 post LinkedIn
- 1 newsletter
- 3 captions IG

Toma horas. Cerebro explota.

La solucion: Pega tu contenido, recibe todos los formatos al instante

https://contentatomizer-production.up.railway.app

#BuildInPublic #ContentMarketing #Emprendedores #AITools`
    }
  },
  {
    name: 'FocusFlow',
    url: 'https://focusflow-production-2e04.up.railway.app',
    tweet: {
      en: `Shipped FocusFlow ⏱️

Research: The average dev is interrupted every 11 minutes. Takes 23 min to refocus. (UC Irvine study)

That's 40% of your day gone.

FocusFlow: Smart pomodoro that blocks distractions + tracks deep work streaks

Built this while procrastinating on Twitter ironically

https://focusflow-production-2e04.up.railway.app

#BuildInPublic #Productivity #DevTools #FocusTime #IndieHackers`,
      pt: `Lancei FocusFlow ⏱️

Pesquisa: Dev medio e interrompido a cada 11 min. Leva 23 min pra voltar ao foco (UC Irvine)

40% do seu dia vai embora.

FocusFlow: Pomodoro inteligente que bloqueia distracoes + rastreia streaks de deep work

Fiz isso enquanto procrastinava no Twitter ironicamente

https://focusflow-production-2e04.up.railway.app

#BuildInPublic #VibeCoding #Produtividade #DevBR #IndieHackers`,
      es: `Lance FocusFlow ⏱️

Dato: Dev promedio es interrumpido cada 11 min. Toma 23 min para recuperar foco (UC Irvine)

40% de tu dia se va.

FocusFlow: Pomodoro inteligente que bloquea distracciones + rastrea rachas de trabajo profundo

Lo hice mientras procrastinaba en Twitter ironicamente

https://focusflow-production-2e04.up.railway.app

#BuildInPublic #Productividad #DevTools #Emprendedores`
    }
  }
];

const sleep = ms => new Promise(r => setTimeout(r, ms));
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function typeSlowly(locator, text) {
  for (const char of text) {
    await locator.pressSequentially(char, { delay: rand(TYPING_DELAY_MIN, TYPING_DELAY_MAX) });
    if ([' ', '.', '\n', '!', '?', '-'].includes(char)) {
      await sleep(rand(80, 250));
    }
  }
}

async function closeAllDialogs(page) {
  console.log('Closing any open dialogs...');

  // Press Escape multiple times
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('Escape');
    await sleep(300);
  }

  // Try to click discard buttons
  const discardSelectors = [
    'button:has-text("Descartar")',
    'button:has-text("Discard")',
    '[data-testid="confirmationSheetCancel"]',
    '[data-testid="app-bar-close"]'
  ];

  for (const selector of discardSelectors) {
    try {
      const btn = page.locator(selector);
      if (await btn.isVisible({ timeout: 500 }).catch(() => false)) {
        await btn.click();
        await sleep(500);
      }
    } catch (e) {}
  }

  // Click outside any modal (on the mask)
  try {
    const mask = page.locator('[data-testid="mask"]');
    if (await mask.isVisible({ timeout: 300 }).catch(() => false)) {
      // Click on the mask to close modal
      await mask.click({ position: { x: 10, y: 10 } });
      await sleep(500);
    }
  } catch (e) {}

  await sleep(500);
}

async function postTweet(page, tweet, postId) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Posting: ${postId}`);
  console.log(`${'='.repeat(50)}`);

  // Close any dialogs first
  await closeAllDialogs(page);

  // Navigate to home if not there
  const url = page.url();
  if (!url.includes('x.com/home') && !url.includes('x.com/compose')) {
    console.log('Navigating to X home...');
    await page.goto('https://x.com/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(3000);
    await closeAllDialogs(page);
  }

  // Click compose button
  console.log('1. Clicking compose button...');
  const composeBtn = page.locator('[data-testid="SideNav_NewTweet_Button"]');

  // Wait for compose button and make sure no mask is blocking
  await composeBtn.waitFor({ state: 'visible', timeout: 10000 });
  await sleep(500);

  // Force click to bypass any intercepting elements
  await composeBtn.click({ force: true });
  await sleep(2500);

  // Wait for compose modal
  console.log('2. Waiting for compose modal...');

  const textArea = page.locator('[data-testid="tweetTextarea_0"]');
  try {
    await textArea.waitFor({ state: 'visible', timeout: 8000 });
  } catch (e) {
    // Try navigating directly to compose
    console.log('   Modal not found, trying direct compose URL...');
    await page.goto('https://x.com/compose/post', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await sleep(2000);
    await textArea.waitFor({ state: 'visible', timeout: 8000 });
  }

  console.log('   Found compose text area');
  await textArea.click();
  await sleep(500);

  // Type the tweet slowly
  console.log('3. Typing tweet slowly...');
  await typeSlowly(textArea, tweet);
  await sleep(2000);

  // Find and click the POST button
  console.log('4. Looking for Post button...');
  const postBtn = page.locator('[data-testid="tweetButton"]').first();
  await postBtn.waitFor({ state: 'visible', timeout: 5000 });

  // Wait for button to be enabled
  let attempts = 0;
  while (attempts < 10) {
    const disabled = await postBtn.getAttribute('aria-disabled');
    if (disabled !== 'true') break;
    console.log('   Button disabled, waiting...');
    await sleep(500);
    attempts++;
  }

  console.log('5. Clicking POST button...');
  await postBtn.click({ force: true });
  await sleep(5000);

  // Check for success (modal should close)
  const modalStillOpen = await textArea.isVisible({ timeout: 2000 }).catch(() => false);

  if (modalStillOpen) {
    // Check for save dialog
    const saveDialog = await page.locator('text="Salvar post?"').isVisible({ timeout: 1000 }).catch(() => false);
    if (saveDialog) {
      console.log('ERROR: Save dialog appeared - discarding');
      await page.locator('button:has-text("Descartar")').click().catch(() => {});
      await sleep(1000);
      throw new Error('Post not made - save dialog appeared');
    }
    throw new Error('Modal did not close');
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
  }

  // Go to home
  await page.goto('https://x.com/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(3000);

  // Check if logged in
  const loggedIn = await page.locator('[data-testid="SideNav_NewTweet_Button"]').isVisible({ timeout: 5000 }).catch(() => false);
  if (!loggedIn) {
    console.log('ERROR: Not logged in to X!');
    return;
  }
  console.log('Logged in to X!');

  // Close any open dialogs first
  await closeAllDialogs(page);

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

        // Wait between posts
        if (posted.length + failed.length < PROJECTS.length * langs.length) {
          const waitTime = WAIT_BETWEEN_POSTS_MS + rand(5000, 20000);
          console.log(`Waiting ${Math.round(waitTime/1000)}s before next post...`);
          await sleep(waitTime);
        }
      } catch (err) {
        console.log(`FAILED: ${postId} - ${err.message}`);
        failed.push({ id: postId, error: err.message });

        // Try to recover
        await closeAllDialogs(page);
        await page.goto('https://x.com/home', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
        await sleep(3000);
        await closeAllDialogs(page);
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
  if (posted.length > 0) {
    console.log('Posted:', posted.join(', '));
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
