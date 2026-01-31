# Build Workflow (08:00 - 18:00)

*Processo detalhado para construir um app do zero ao QA-ready.*

**IMPORTANTE (2026-01-31):**
- i18n é OBRIGATÓRIO (ver `.claude/templates/i18n-setup.md`)
- Rating/Feedback é OBRIGATÓRIO (ver `.claude/plans/rating-feedback-system.md`)

---

## Visão Geral

| Fase | Horário | Duração | Output |
|------|---------|---------|--------|
| Setup + i18n | 08:00-09:30 | 1.5h | Projeto criado, i18n configurado |
| Database | 09:30-10:30 | 1h | Schema pronto, migrations rodadas |
| Backend | 10:30-12:30 | 2h | APIs + Feedback API funcionando |
| Auth | 12:30-13:30 | 1h | Login/logout funcionando |
| Frontend | 13:30-17:00 | 3.5h | UI completa + Widget Feedback |
| SEO i18n | 17:00-18:00 | 1h | Metadata multilíngue, sitemap |

---

## FASE 1: SETUP (08:00 - 09:00)

### 1.1 Criar Projeto

```bash
# Criar diretório
mkdir -p ~/agent-projects/builds/[DATE]-[app-name]
cd ~/agent-projects/builds/[DATE]-[app-name]

# Inicializar Next.js
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Ou com template existente
cp -r ~/templates/nextjs-base/* .
```

### 1.2 Instalar Dependências Base

```bash
# UI
npm install lucide-react clsx tailwind-merge

# i18n (OBRIGATÓRIO)
npm install next-intl

# Database
npm install @prisma/client @neondatabase/serverless
npm install -D prisma

# Auth (escolher um)
npm install @supabase/supabase-js @supabase/ssr  # Supabase
# ou
npm install @stackframe/stack @stackframe/stack-shared  # Stack Auth

# Formulários
npm install react-hook-form zod @hookform/resolvers

# AI (se necessário)
npm install openai ai
```

### 1.3 Configurar i18n (OBRIGATÓRIO)

Seguir template completo em: `.claude/templates/i18n-setup.md`

```bash
# Criar estrutura i18n
mkdir -p src/i18n
mkdir -p messages

# Criar arquivos de configuração
touch src/i18n/routing.ts
touch src/i18n/request.ts
touch middleware.ts
touch messages/pt-BR.json
touch messages/en-US.json
touch messages/es.json
```

**Verificar:**
- [ ] `next.config.ts` com plugin next-intl
- [ ] `middleware.ts` configurado
- [ ] Rotas dentro de `app/[locale]/`
- [ ] Traduções em `messages/`

### 1.4 Estrutura de Pastas (com i18n)

```
src/
├── app/
│   ├── [locale]/               # ← ROTAS DENTRO DE [locale]
│   │   ├── page.tsx            # Landing page
│   │   ├── layout.tsx          # Layout com generateMetadata
│   │   └── dashboard/page.tsx  # App principal (se houver)
│   ├── api/                    # APIs FORA do [locale]
│   │   ├── track/route.ts      # Tracking
│   │   ├── stats/route.ts      # Statistics
│   │   ├── feedback/route.ts   # RATING (OBRIGATÓRIO)
│   │   └── [recurso]/route.ts  # APIs do app
│   ├── sitemap.ts              # Multilíngue
│   ├── robots.ts
│   └── globals.css
├── i18n/
│   ├── routing.ts              # Config de rotas
│   └── request.ts              # Config de request
├── components/
│   ├── ui/                     # Componentes base
│   ├── FeedbackWidget.tsx      # RATING (OBRIGATÓRIO)
│   └── LanguageSwitcher.tsx    # Seletor de idioma
├── lib/
│   ├── db.ts                   # Database client
│   ├── utils.ts                # Helpers
│   └── validations.ts          # Zod schemas
├── messages/
│   ├── pt-BR.json              # Traduções PT-BR
│   ├── en-US.json              # Traduções EN-US
│   └── es.json                 # Traduções ES
└── types/
    └── index.ts                # TypeScript types

middleware.ts                    # Na raiz do projeto
```

### 1.4 Configurar Tailwind

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7C3AED",
        secondary: "#10B981",
        background: "#0F172A",
        surface: "#1E293B",
        text: "#F8FAFC",
        muted: "#94A3B8",
      },
    },
  },
  plugins: [],
};

export default config;
```

### 1.5 Checklist Setup
- [ ] Projeto criado
- [ ] Deps instaladas
- [ ] Estrutura de pastas criada
- [ ] Tailwind configurado
- [ ] .env.local criado
- [ ] .gitignore atualizado

---

## FASE 2: DATABASE (09:00 - 10:00)

### 2.1 Configurar Prisma

```bash
npx prisma init
```

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// Modelos conforme PRD
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2.2 Client Neon

```typescript
// src/lib/db.ts
import { neon } from '@neondatabase/serverless';
import { PrismaClient } from '@prisma/client';

// Para queries raw (performance)
export const sql = neon(process.env.DATABASE_URL!);

// Para Prisma ORM
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### 2.3 Rodar Migrations

```bash
npx prisma db push  # Dev (sync schema)
# ou
npx prisma migrate dev --name init  # Com migrations
```

### 2.4 Checklist Database
- [ ] Prisma inicializado
- [ ] Schema definido conforme PRD
- [ ] DATABASE_URL configurado
- [ ] Migration executada
- [ ] Client funcionando

---

## FASE 3: BACKEND (10:00 - 12:00)

### 3.1 API Route Base

```typescript
// src/app/api/[recurso]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createSchema = z.object({
  // campos
});

// GET - Listar
export async function GET(request: NextRequest) {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch' },
      { status: 500 }
    );
  }
}

// POST - Criar
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createSchema.parse(body);

    const item = await prisma.item.create({
      data: validated,
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create' },
      { status: 500 }
    );
  }
}
```

### 3.2 Tracking API (OBRIGATÓRIO)

```typescript
// src/app/api/track/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

declare global {
  var __pageViews: Array<{
    page: string;
    timestamp: Date;
    sessionId: string;
    referrer?: string;
    userAgent?: string;
    country?: string;
  }>;
}

if (!global.__pageViews) {
  global.__pageViews = [];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, sessionId, referrer } = body;

    const geo = request.geo;
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    global.__pageViews.push({
      page: page || '/',
      timestamp: new Date(),
      sessionId: sessionId || 'anonymous',
      referrer: referrer || '',
      userAgent,
      country: geo?.country || 'Unknown',
    });

    // Limitar a 10000 registros em memória
    if (global.__pageViews.length > 10000) {
      global.__pageViews = global.__pageViews.slice(-5000);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track error:', error);
    return NextResponse.json({ success: true }); // Não falhar tracking
  }
}
```

### 3.3 Stats API (OBRIGATÓRIO)

```typescript
// src/app/api/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const STATS_SECRET = 'garimdreaming-stats-2026';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const format = searchParams.get('format');

  if (secret !== STATS_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const views = global.__pageViews || [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const totalViews = views.length;
  const todayViews = views.filter(v => new Date(v.timestamp) >= today).length;
  const weekViews = views.filter(v => new Date(v.timestamp) >= weekAgo).length;

  const uniqueSessions = new Set(views.map(v => v.sessionId)).size;
  const todayUnique = new Set(
    views.filter(v => new Date(v.timestamp) >= today).map(v => v.sessionId)
  ).size;

  const stats = {
    totalViews,
    todayViews,
    weekViews,
    uniqueVisitors: uniqueSessions,
    uniqueSessions,
    todayUnique,
  };

  if (format === 'json') {
    return NextResponse.json(stats);
  }

  // HTML format
  return new NextResponse(`
    <html>
      <head><title>Stats</title></head>
      <body style="font-family: monospace; padding: 20px;">
        <h1>Stats</h1>
        <pre>${JSON.stringify(stats, null, 2)}</pre>
      </body>
    </html>
  `, { headers: { 'Content-Type': 'text/html' } });
}
```

### 3.4 Feedback API (OBRIGATÓRIO)

```typescript
// src/app/api/feedback/route.ts
// Ver código completo em: .claude/plans/rating-feedback-system.md

// POST: Recebe { appSlug, rating, comment, sessionId }
// GET: Retorna { count, average } (público) ou detalhes (com secret)
```

**Endpoint público (sem secret):**
```bash
curl "https://[app]/api/feedback?app=[slug]"
# Retorna: { count: 42, average: 4.3 }
```

**Endpoint admin (com secret):**
```bash
curl "https://[app]/api/feedback?secret=garimdreaming-stats-2026"
# Retorna: { feedbacks: { [slug]: { count, average, comments: [...] } } }
```

### 3.5 Checklist Backend
- [ ] APIs principais implementadas
- [ ] /api/track funcionando
- [ ] /api/stats funcionando
- [ ] /api/feedback funcionando (NOVO)
- [ ] Validação com Zod
- [ ] Error handling

---

## FASE 4: AUTH (12:00 - 13:00)

### 4.1 Supabase Auth (Recomendado)

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
```

### 4.2 Checklist Auth
- [ ] Provider configurado (Supabase/Stack)
- [ ] Login Google funciona
- [ ] Login Email funciona
- [ ] Middleware de proteção
- [ ] Logout funciona

---

## FASE 5: FRONTEND (13:00 - 17:00)

### 5.1 Layout Base

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '[App Name] - [Tagline]',
  description: '[Description 160 chars]',
  openGraph: {
    title: '[App Name]',
    description: '[Description]',
    url: 'https://[app]-production.up.railway.app',
    siteName: '[App Name]',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-background text-text`}>
        {children}
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

### 5.2 Componentes UI Base

Ver skill `ui-ux-pro-max` para:
- Navbar
- Hero Section
- Feature Cards
- CTA Button
- Footer

### 5.3 Widget de Feedback (OBRIGATÓRIO)

```typescript
// src/components/FeedbackWidget.tsx
// Ver código completo em: .claude/plans/rating-feedback-system.md

// Posicionar no footer, acima do copyright
// Mostrar: estrelas (1-5) + textarea opcional + stats
```

**No page.tsx, incluir:**
```tsx
import { FeedbackWidget } from '@/components/FeedbackWidget';

export default function Page() {
  return (
    <main>
      {/* ... conteúdo ... */}

      {/* FEEDBACK - OBRIGATÓRIO */}
      <section className="py-12 px-4">
        <div className="max-w-xl mx-auto">
          <FeedbackWidget appSlug="[app-slug]" appName="[App Name]" />
        </div>
      </section>

      {/* Footer */}
    </main>
  );
}
```

### 5.4 Checklist Frontend
- [ ] Landing page completa
- [ ] App principal funciona
- [ ] Responsivo (mobile, tablet, desktop)
- [ ] Dark mode funciona
- [ ] Loading states
- [ ] Error states
- [ ] FeedbackWidget incluído no footer (NOVO)
- [ ] Feedback funciona (submeter e ver stats)

---

## FASE 6: SEO MULTILÍNGUE (17:00 - 18:00)

**IMPORTANTE:** SEO agora é multilíngue. Ver `.claude/templates/i18n-setup.md`

### 6.1 Sitemap Multilíngue

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from 'next';

const locales = ['pt-BR', 'en-US', 'es'];
const baseUrl = 'https://[app]-production.up.railway.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [''];  // Adicionar: '/pricing', '/about', etc.

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

### 6.2 Robots

```typescript
// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: 'https://[app]-production.up.railway.app/sitemap.xml',
  };
}
```

### 6.3 Metadata Dinâmico (no layout.tsx do [locale])

```typescript
// src/app/[locale]/layout.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  const baseUrl = 'https://[app]-production.up.railway.app';

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
      locale: locale.replace('-', '_'),
      // ...
    },
  };
}
```

### 6.4 Checklist SEO Multilíngue
- [ ] sitemap.ts gera URLs por locale
- [ ] robots.ts criado
- [ ] generateMetadata() com traduções
- [ ] alternates.languages com 3 locales + x-default
- [ ] og:locale dinâmico
- [ ] /sitemap.xml lista todas URLs (3x páginas)
- [ ] /robots.txt funciona
- [ ] Testar metadata em cada locale (inspecionar HTML)

---

## Validação Final (17:45 - 18:00)

Antes de passar para QA:

```bash
# Build local
npm run build

# Se passar, está pronto para QA
```

---

*Workflow version: 1.0*
*Last updated: 2026-01-31*
