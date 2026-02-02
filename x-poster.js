const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const PROGRESS_FILE = '/Users/user/agent-projects/x-post-progress.json';

// Projects to post
const projects = [
  {
    name: 'ClipGenius',
    url: 'https://clipgenius-production.up.railway.app',
    descriptions: {
      en: 'AI-powered video editing that turns raw footage into polished content',
      pt: 'Edicao de video com IA que transforma gravacoes brutas em conteudo profissional',
      es: 'Edicion de video con IA que convierte grabaciones en contenido profesional'
    }
  },
  {
    name: 'BrandPulse AI',
    url: 'https://brandpulse-ai-production.up.railway.app',
    descriptions: {
      en: 'Real-time brand monitoring powered by artificial intelligence',
      pt: 'Monitoramento de marca em tempo real com inteligencia artificial',
      es: 'Monitoreo de marca en tiempo real impulsado por inteligencia artificial'
    }
  },
  {
    name: 'ContentAtomizer',
    url: 'https://contentatomizer-production.up.railway.app',
    descriptions: {
      en: 'Turn one piece of content into dozens across all platforms',
      pt: 'Transforme um conteudo em dezenas para todas as plataformas',
      es: 'Convierte un contenido en docenas para todas las plataformas'
    }
  },
  {
    name: 'FocusFlow',
    url: 'https://focusflow-production-2e04.up.railway.app',
    descriptions: {
      en: 'Boost your productivity with AI-driven focus sessions',
      pt: 'Aumente sua produtividade com sessoes de foco guiadas por IA',
      es: 'Aumenta tu productividad con sesiones de enfoque impulsadas por IA'
    }
  }
];

const languages = ['en', 'pt', 'es'];

function generateTweet(project, lang) {
  if (lang === 'en') {
    return `Just launched: ${project.name}

${project.descriptions.en}

Try it free: ${project.url}

Built with love by @gabrielabiramia

#buildinpublic #indiehackers`;
  } else if (lang === 'pt') {
    return `Acabei de lancar: ${project.name}

${project.descriptions.pt}

Experimente gratis: ${project.url}

Feito com amor por @gabrielabiramia

#buildinpublic #indiehackers`;
  } else if (lang === 'es') {
    return `Acabo de lanzar: ${project.name}

${project.descriptions.es}

Pruebalo gratis: ${project.url}

Hecho con amor por @gabrielabiramia

#buildinpublic #indiehackers`;
  }
}

function loadProgress() {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    }
  } catch (e) {
    console.log('No existing progress file, starting fresh');
  }
  return { completed: [], lastPostTime: null };
}

function saveProgress(progress) {
  const dir = path.dirname(PROGRESS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('Connecting to Chrome...');

  let browser;
  try {
    browser = await chromium.connectOverCDP('http://localhost:9222');
  } catch (e) {
    console.log('ERROR: Could not connect to Chrome on port 9222');
    console.log('Make sure Chrome is running with: --remote-debugging-port=9222');
    return;
  }

  const context = browser.contexts()[0];
  if (!context) {
    console.log('ERROR: No browser context found');
    return;
  }

  let page = context.pages().find(p => p.url().includes('x.com') || p.url().includes('twitter.com'));

  if (!page) {
    page = await context.newPage();
  }

  // Handle any dialogs that might appear
  page.on('dialog', async dialog => {
    console.log(`Dialog appeared: ${dialog.message()}`);
    await dialog.accept().catch(() => {});
  });

  console.log('Navigating to X...');
  await page.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
  await sleep(4000);

  // Check if logged in by looking for the compose button
  const isLoggedIn = await page.locator('[data-testid="SideNav_NewTweet_Button"]').isVisible({ timeout: 10000 }).catch(() => false);

  if (!isLoggedIn) {
    console.log('');
    console.log('========================================');
    console.log('NOT LOGGED IN TO X');
    console.log('Please login to X/Twitter first and run again');
    console.log('========================================');
    return;
  }

  console.log('Logged in to X!');

  const progress = loadProgress();
  console.log(`Previous progress: ${progress.completed.length} posts completed`);

  let postsCompleted = 0;
  let postsFailed = 0;

  for (const project of projects) {
    for (const lang of languages) {
      const postKey = `${project.name}-${lang}`;

      if (progress.completed.includes(postKey)) {
        console.log(`Skipping ${postKey} - already posted`);
        continue;
      }

      // Check if we need to wait since last post
      if (progress.lastPostTime) {
        const elapsed = Date.now() - new Date(progress.lastPostTime).getTime();
        const waitTime = 70000 - elapsed; // 70 seconds minimum
        if (waitTime > 0) {
          console.log(`Waiting ${Math.ceil(waitTime/1000)} seconds before next post...`);
          await sleep(waitTime + randomDelay(5000, 15000)); // Add extra random delay
        }
      }

      const tweet = generateTweet(project, lang);
      console.log('');
      console.log(`========================================`);
      console.log(`Posting: ${project.name} (${lang.toUpperCase()})`);
      console.log(`========================================`);
      console.log(tweet);
      console.log('');

      try {
        // Make sure we're on the home page
        await page.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
        await sleep(3000);

        // Press Escape to close any modals
        await page.keyboard.press('Escape').catch(() => {});
        await sleep(500);

        // Click compose button on sidebar using force click to bypass overlays
        console.log('Clicking compose button...');
        const composeBtn = page.locator('[data-testid="SideNav_NewTweet_Button"]');
        await composeBtn.waitFor({ state: 'visible', timeout: 5000 });
        await composeBtn.click({ force: true });
        await sleep(randomDelay(1500, 2500));

        // Wait for the modal to appear and find the contenteditable div
        console.log('Waiting for compose modal...');

        // The compose modal has a contenteditable div - try multiple selectors
        const textAreaSelectors = [
          '[role="textbox"][data-testid="tweetTextarea_0"]',
          '[data-testid="tweetTextarea_0"] [contenteditable="true"]',
          '[data-testid="tweetTextarea_0"]',
          'div[contenteditable="true"][role="textbox"]',
          '[aria-modal="true"] [contenteditable="true"]'
        ];

        let composeBox = null;
        for (const selector of textAreaSelectors) {
          try {
            const el = page.locator(selector).first();
            const isVisible = await el.isVisible({ timeout: 2000 }).catch(() => false);
            if (isVisible) {
              composeBox = el;
              console.log(`Found compose box with selector: ${selector}`);
              break;
            }
          } catch (e) {
            // Try next selector
          }
        }

        if (!composeBox) {
          throw new Error('Could not find compose box');
        }

        // Click to focus the compose box (use force click)
        await composeBox.click({ force: true });
        await sleep(800);

        // Type the tweet character by character
        console.log('Typing tweet slowly...');
        for (let i = 0; i < tweet.length; i++) {
          const char = tweet[i];
          await page.keyboard.type(char, { delay: randomDelay(50, 150) });

          // Extra pause after spaces and punctuation
          if (char === ' ' || char === '.' || char === '!' || char === '?' || char === ':') {
            await sleep(randomDelay(150, 300));
          }

          // Newline handling
          if (char === '\n') {
            await sleep(randomDelay(200, 400));
          }

          // Occasional longer pause (like thinking)
          if (Math.random() < 0.03) {
            await sleep(randomDelay(400, 800));
          }
        }

        console.log('Finished typing, waiting before posting...');
        await sleep(randomDelay(2000, 4000));

        // Click the post button using force click
        console.log('Clicking post button...');
        const postButton = page.locator('[data-testid="tweetButton"]').first();
        await postButton.waitFor({ state: 'visible', timeout: 5000 });
        await postButton.click({ force: true });

        // Wait for post to complete
        console.log('Waiting for post to complete...');
        await sleep(randomDelay(4000, 6000));

        // Verify the modal closed (which means post was successful)
        const modalStillOpen = await page.locator('[data-testid="tweetTextarea_0"]').isVisible({ timeout: 2000 }).catch(() => false);
        if (modalStillOpen) {
          // Try clicking again
          console.log('Modal still open, trying to click post button again...');
          await postButton.click({ force: true });
          await sleep(3000);
        }

        // Mark as completed
        progress.completed.push(postKey);
        progress.lastPostTime = new Date().toISOString();
        saveProgress(progress);

        postsCompleted++;
        console.log(`SUCCESS: Posted ${postKey}`);
        console.log(`Progress: ${progress.completed.length}/12 posts`);

        // Close any modal that might still be open
        await page.keyboard.press('Escape').catch(() => {});
        await sleep(1000);

        // Wait before next post (70+ seconds)
        const totalRemaining = 12 - progress.completed.length;
        if (totalRemaining > 0) {
          const waitSeconds = 70 + randomDelay(10, 30);
          console.log(`Waiting ${waitSeconds} seconds before next post...`);
          await sleep(waitSeconds * 1000);
        }

      } catch (e) {
        console.log(`FAILED to post ${postKey}: ${e.message}`);
        postsFailed++;

        // Take screenshot on error
        try {
          await page.screenshot({ path: `/Users/user/AppsCalude/Bot-Ultra-Power/error-${postKey}.png` });
          console.log(`Screenshot saved: error-${postKey}.png`);
        } catch (se) {}

        // Try to close any modals and reset
        await page.keyboard.press('Escape').catch(() => {});
        await sleep(2000);
        await page.keyboard.press('Escape').catch(() => {});
        await sleep(1000);
      }
    }
  }

  console.log('');
  console.log('========================================');
  console.log('POSTING COMPLETE');
  console.log(`Success: ${postsCompleted}`);
  console.log(`Failed: ${postsFailed}`);
  console.log(`Total completed: ${progress.completed.length}/12`);
  console.log('========================================');
}

main().catch(console.error);
