# Template i18n - Setup Multilíngue para Novos Apps

*OBRIGATÓRIO para todos os novos apps a partir de 2026-01-31.*

---

## 1. Instalar Dependências

```bash
npm install next-intl
```

---

## 2. Estrutura de Pastas

```
src/
├── app/
│   ├── [locale]/           # ← NOVO: Todas as páginas dentro de [locale]
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── ...outras páginas
│   ├── api/                # APIs ficam FORA do [locale]
│   │   ├── track/route.ts
│   │   └── stats/route.ts
│   ├── sitemap.ts
│   └── robots.ts
├── i18n/
│   ├── routing.ts          # Configuração de rotas
│   └── request.ts          # Configuração de request
└── messages/
    ├── pt-BR.json          # Traduções PT-BR
    ├── en-US.json          # Traduções EN-US
    └── es.json             # Traduções ES
```

---

## 3. Arquivos de Configuração

### 3.1 `src/i18n/routing.ts`

```typescript
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['pt-BR', 'en-US', 'es'],
  defaultLocale: 'pt-BR',
  localePrefix: 'always'
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

### 3.2 `src/i18n/request.ts`

```typescript
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
```

### 3.3 `next.config.ts`

```typescript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  // suas outras configs
};

export default withNextIntl(nextConfig);
```

### 3.4 `middleware.ts` (na raiz do projeto)

```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(pt-BR|en-US|es)/:path*']
};
```

---

## 4. Arquivos de Tradução

### 4.1 `messages/pt-BR.json`

```json
{
  "Meta": {
    "title": "[App] - [Tagline em português]",
    "description": "[Descrição de 150-160 caracteres em português]"
  },
  "Hero": {
    "badge": "Análise com IA",
    "title": "Título Principal em Português",
    "subtitle": "Subtítulo explicando o valor em português"
  },
  "Features": {
    "title": "Por que usar o [App]",
    "feature1": {
      "title": "Feature 1",
      "description": "Descrição da feature 1"
    },
    "feature2": {
      "title": "Feature 2",
      "description": "Descrição da feature 2"
    },
    "feature3": {
      "title": "Feature 3",
      "description": "Descrição da feature 3"
    }
  },
  "CTA": {
    "primary": "Começar Grátis",
    "secondary": "Ver Demo"
  },
  "Footer": {
    "builtBy": "Construído por",
    "copyright": "© 2026"
  }
}
```

### 4.2 `messages/en-US.json`

```json
{
  "Meta": {
    "title": "[App] - [Tagline in English]",
    "description": "[150-160 character description in English]"
  },
  "Hero": {
    "badge": "AI-Powered",
    "title": "Main Title in English",
    "subtitle": "Subtitle explaining the value in English"
  },
  "Features": {
    "title": "Why use [App]",
    "feature1": {
      "title": "Feature 1",
      "description": "Feature 1 description"
    },
    "feature2": {
      "title": "Feature 2",
      "description": "Feature 2 description"
    },
    "feature3": {
      "title": "Feature 3",
      "description": "Feature 3 description"
    }
  },
  "CTA": {
    "primary": "Get Started Free",
    "secondary": "See Demo"
  },
  "Footer": {
    "builtBy": "Built by",
    "copyright": "© 2026"
  }
}
```

### 4.3 `messages/es.json`

```json
{
  "Meta": {
    "title": "[App] - [Tagline en español]",
    "description": "[Descripción de 150-160 caracteres en español]"
  },
  "Hero": {
    "badge": "Impulsado por IA",
    "title": "Título Principal en Español",
    "subtitle": "Subtítulo explicando el valor en español"
  },
  "Features": {
    "title": "Por qué usar [App]",
    "feature1": {
      "title": "Característica 1",
      "description": "Descripción de la característica 1"
    },
    "feature2": {
      "title": "Característica 2",
      "description": "Descripción de la característica 2"
    },
    "feature3": {
      "title": "Característica 3",
      "description": "Descripción de la característica 3"
    }
  },
  "CTA": {
    "primary": "Empezar Gratis",
    "secondary": "Ver Demo"
  },
  "Footer": {
    "builtBy": "Construido por",
    "copyright": "© 2026"
  }
}
```

---

## 5. Layout com Metadata Dinâmico

### 5.1 `src/app/[locale]/layout.tsx`

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// IMPORTANTE: Gera rotas estáticas para todos os locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// METADATA DINÂMICO - Traduzido por locale
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });

  const baseUrl = 'https://[APP]-production.up.railway.app';

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'pt-BR': `${baseUrl}/pt-BR`,
        'en-US': `${baseUrl}/en-US`,
        'es': `${baseUrl}/es`,
        'x-default': `${baseUrl}/en-US`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${locale}`,
      siteName: '[App Name]',
      locale: locale.replace('-', '_'), // pt_BR, en_US
      alternateLocale: ['pt_BR', 'en_US', 'es'].filter(
        (l) => l !== locale.replace('-', '_')
      ),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      creator: '@gabrielabiramia',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body className={`${inter.className} bg-background text-text`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <TrackingScript />
      </body>
    </html>
  );
}

function TrackingScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            const sessionId = localStorage.getItem('sessionId') ||
              Math.random().toString(36).substring(2, 15);
            localStorage.setItem('sessionId', sessionId);

            fetch('/api/track', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                page: window.location.pathname,
                sessionId: sessionId,
                referrer: document.referrer
              })
            }).catch(() => {});
          })();
        `,
      }}
    />
  );
}
```

---

## 6. Página Principal

### 6.1 `src/app/[locale]/page.tsx`

```typescript
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function HomePage() {
  const t = useTranslations();

  return (
    <main>
      {/* Hero */}
      <section>
        <span>{t('Hero.badge')}</span>
        <h1>{t('Hero.title')}</h1>
        <p>{t('Hero.subtitle')}</p>
        <button>{t('CTA.primary')}</button>
      </section>

      {/* Features */}
      <section>
        <h2>{t('Features.title')}</h2>
        <div>
          <div>
            <h3>{t('Features.feature1.title')}</h3>
            <p>{t('Features.feature1.description')}</p>
          </div>
          {/* ... mais features */}
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>
          {t('Footer.builtBy')}{' '}
          <Link href="https://x.com/gabrielabiramia">@gabrielabiramia</Link>
        </p>
        <p>{t('Footer.copyright')}</p>
      </footer>
    </main>
  );
}
```

---

## 7. Sitemap Multilíngue

### 7.1 `src/app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next';

const locales = ['pt-BR', 'en-US', 'es'];
const baseUrl = 'https://[APP]-production.up.railway.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [''];  // Adicione outras rotas: '/pricing', '/about', etc.

  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1.0 : 0.8,
      alternates: {
        languages: Object.fromEntries([
          ...locales.map((l) => [l, `${baseUrl}/${l}${route}`]),
          ['x-default', `${baseUrl}/en-US${route}`],
        ]),
      },
    }))
  );
}
```

---

## 8. Robots.txt

### 8.1 `src/app/robots.ts`

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: 'https://[APP]-production.up.railway.app/sitemap.xml',
  };
}
```

---

## 9. Seletor de Idioma (Opcional)

### 9.1 `src/components/LanguageSwitcher.tsx`

```typescript
'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

const locales = [
  { code: 'pt-BR', flag: '🇧🇷', name: 'Português' },
  { code: 'en-US', flag: '🇺🇸', name: 'English' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex gap-2">
      {locales.map((l) => (
        <button
          key={l.code}
          onClick={() => handleChange(l.code)}
          className={`px-2 py-1 rounded ${
            locale === l.code ? 'bg-primary text-white' : 'bg-surface'
          }`}
        >
          {l.flag}
        </button>
      ))}
    </div>
  );
}
```

---

## 10. Checklist de Verificação

Antes de deployar, verificar:

### Estrutura
- [ ] `src/app/[locale]/layout.tsx` existe
- [ ] `src/app/[locale]/page.tsx` existe
- [ ] `src/i18n/routing.ts` configurado
- [ ] `src/i18n/request.ts` configurado
- [ ] `middleware.ts` na raiz
- [ ] `next.config.ts` com plugin next-intl

### Traduções
- [ ] `messages/pt-BR.json` completo
- [ ] `messages/en-US.json` completo
- [ ] `messages/es.json` completo
- [ ] Todas as strings usando `t('key')`

### SEO
- [ ] `generateMetadata()` com traduções
- [ ] `alternates.languages` com todas locales
- [ ] `x-default` apontando para en-US
- [ ] `og:locale` dinâmico
- [ ] `sitemap.ts` gerando URLs por locale

### Teste
- [ ] `https://[app]/pt-BR` carrega em português
- [ ] `https://[app]/en-US` carrega em inglês
- [ ] `https://[app]/es` carrega em espanhol
- [ ] Metadata muda conforme locale (inspecionar HTML)
- [ ] `/sitemap.xml` lista todas as URLs com alternates

---

## Resultado Final

Após implementar, cada URL terá:

```
https://app.com/pt-BR
  - <html lang="pt-BR">
  - <title>App - Tagline em Português</title>
  - <meta name="description" content="Descrição em português">
  - <meta property="og:locale" content="pt_BR">
  - <link rel="alternate" hreflang="en-US" href="https://app.com/en-US">
  - <link rel="alternate" hreflang="es" href="https://app.com/es">
  - <link rel="alternate" hreflang="x-default" href="https://app.com/en-US">

https://app.com/en-US
  - <html lang="en-US">
  - <title>App - Tagline in English</title>
  - <meta name="description" content="Description in English">
  - <meta property="og:locale" content="en_US">
  - ... alternates corretos
```

---

*Template version: 1.0*
*Last updated: 2026-01-31*
*OBRIGATÓRIO para todos os novos apps*
