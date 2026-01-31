# Project Setup Checklist

**App:** [NOME]
**Data:** [YYYY-MM-DD]
**Criado por:** Claude Agent

---

## 1. Inicialização do Projeto

### 1.1 Criar Diretório
```bash
mkdir -p ~/agent-projects/builds/[DATE]-[app-name]
cd ~/agent-projects/builds/[DATE]-[app-name]
```

| Check | Status |
|-------|--------|
| [ ] Diretório criado em ~/agent-projects/builds/ | ⬜ |
| [ ] Nome segue padrão: YYYY-MM-DD-app-name | ⬜ |

### 1.2 Inicializar Next.js
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

| Check | Status |
|-------|--------|
| [ ] TypeScript habilitado | ⬜ |
| [ ] Tailwind CSS instalado | ⬜ |
| [ ] ESLint configurado | ⬜ |
| [ ] App Router (src/app/) | ⬜ |
| [ ] src/ directory structure | ⬜ |
| [ ] Import alias @/* configurado | ⬜ |

---

## 2. Dependências

### 2.1 Core Dependencies
```bash
npm install lucide-react clsx tailwind-merge
npm install @prisma/client @neondatabase/serverless
npm install react-hook-form zod @hookform/resolvers
npm install -D prisma
```

| Pacote | Propósito | Status |
|--------|-----------|--------|
| lucide-react | Ícones | ⬜ |
| clsx | Class merging | ⬜ |
| tailwind-merge | Tailwind utilities | ⬜ |
| @prisma/client | ORM | ⬜ |
| @neondatabase/serverless | Database | ⬜ |
| react-hook-form | Forms | ⬜ |
| zod | Validação | ⬜ |
| prisma (dev) | Schema management | ⬜ |

### 2.2 Auth (escolher um)
```bash
# Opção A: Supabase
npm install @supabase/supabase-js @supabase/ssr

# Opção B: Stack Auth
npm install @stackframe/stack @stackframe/stack-shared
```

| Auth Provider | Status |
|---------------|--------|
| [ ] Supabase Auth | ⬜ |
| [ ] Stack Auth | ⬜ |
| [ ] Nenhum (sem auth) | ⬜ |

### 2.3 AI (se necessário)
```bash
npm install openai ai
```

| Pacote | Propósito | Status |
|--------|-----------|--------|
| openai | OpenAI/OpenRouter | ⬜ |
| ai | Vercel AI SDK | ⬜ |

---

## 3. Estrutura de Pastas

```
src/
├── app/
│   ├── api/
│   │   ├── track/route.ts      # OBRIGATÓRIO
│   │   ├── stats/route.ts      # OBRIGATÓRIO
│   │   └── [recurso]/route.ts
│   ├── (marketing)/
│   │   └── page.tsx
│   ├── (app)/
│   │   └── dashboard/page.tsx
│   ├── layout.tsx
│   ├── sitemap.ts              # OBRIGATÓRIO
│   └── robots.ts               # OBRIGATÓRIO
├── components/
│   ├── ui/
│   ├── marketing/
│   └── app/
├── lib/
│   ├── db.ts
│   ├── utils.ts
│   └── validations.ts
└── types/
    └── index.ts
```

| Diretório/Arquivo | Status |
|-------------------|--------|
| [ ] src/app/api/track/route.ts | ⬜ |
| [ ] src/app/api/stats/route.ts | ⬜ |
| [ ] src/app/sitemap.ts | ⬜ |
| [ ] src/app/robots.ts | ⬜ |
| [ ] src/components/ui/ | ⬜ |
| [ ] src/lib/db.ts | ⬜ |
| [ ] src/lib/utils.ts | ⬜ |

---

## 4. Configurações

### 4.1 .env.local
```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Auth (se usar)
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."

# AI (se usar)
OPENROUTER_API_KEY="..."
```

| Variável | Status |
|----------|--------|
| [ ] DATABASE_URL configurado | ⬜ |
| [ ] Auth keys configurados (se aplicável) | ⬜ |
| [ ] AI keys configurados (se aplicável) | ⬜ |

### 4.2 tailwind.config.ts
```typescript
// Cores padrão GarimDreaming
colors: {
  primary: "#7C3AED",
  secondary: "#10B981",
  background: "#0F172A",
  surface: "#1E293B",
  text: "#F8FAFC",
  muted: "#94A3B8",
}
```

| Check | Status |
|-------|--------|
| [ ] darkMode: "class" | ⬜ |
| [ ] Cores customizadas | ⬜ |
| [ ] Content paths corretos | ⬜ |

### 4.3 .gitignore
```
node_modules/
.next/
.env.local
.env*.local
*.log
.DS_Store
```

| Check | Status |
|-------|--------|
| [ ] node_modules ignorado | ⬜ |
| [ ] .env.local ignorado | ⬜ |
| [ ] .next ignorado | ⬜ |

---

## 5. Database (Neon)

### 5.1 Prisma Setup
```bash
npx prisma init
```

### 5.2 schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

| Check | Status |
|-------|--------|
| [ ] Prisma inicializado | ⬜ |
| [ ] Provider = postgresql | ⬜ |
| [ ] directUrl configurado | ⬜ |
| [ ] Schema definido | ⬜ |

### 5.3 Sync Database
```bash
npx prisma db push
# ou
npx prisma migrate dev --name init
```

| Check | Status |
|-------|--------|
| [ ] Migration executada | ⬜ |
| [ ] Tabelas criadas | ⬜ |

---

## 6. APIs Obrigatórias

### 6.1 /api/track/route.ts
```typescript
// Recebe: { page, sessionId, referrer }
// Armazena em: global.__pageViews
```

| Check | Status |
|-------|--------|
| [ ] Arquivo criado | ⬜ |
| [ ] POST handler funciona | ⬜ |
| [ ] Limita a 10000 registros | ⬜ |

### 6.2 /api/stats/route.ts
```typescript
// Requer: ?secret=garimdreaming-stats-2026
// Retorna: { totalViews, weekViews, todayViews, uniqueVisitors }
```

| Check | Status |
|-------|--------|
| [ ] Arquivo criado | ⬜ |
| [ ] Secret validation | ⬜ |
| [ ] Retorna JSON válido | ⬜ |
| [ ] Campos obrigatórios presentes | ⬜ |

---

## 7. SEO

### 7.1 app/sitemap.ts
```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://[app]-production.up.railway.app', ... }
  ];
}
```

| Check | Status |
|-------|--------|
| [ ] Arquivo criado | ⬜ |
| [ ] URL de produção correta | ⬜ |
| [ ] lastModified presente | ⬜ |

### 7.2 app/robots.ts
```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/dashboard/'] },
    sitemap: 'https://[app]-production.up.railway.app/sitemap.xml',
  };
}
```

| Check | Status |
|-------|--------|
| [ ] Arquivo criado | ⬜ |
| [ ] /api/ bloqueado | ⬜ |
| [ ] Sitemap referenciado | ⬜ |

### 7.3 Metadata no layout.tsx
```typescript
export const metadata: Metadata = {
  title: '[App Name] - [Tagline]',
  description: '[160 chars]',
  openGraph: { ... },
};
```

| Check | Status |
|-------|--------|
| [ ] Title presente | ⬜ |
| [ ] Description presente | ⬜ |
| [ ] OG tags configurados | ⬜ |

---

## 8. Tracking no Layout

### 8.1 TrackingScript Component
```typescript
function TrackingScript() {
  return (
    <script dangerouslySetInnerHTML={{
      __html: `
        (function() {
          const sessionId = localStorage.getItem('sessionId') || ...;
          fetch('/api/track', { ... });
        })();
      `
    }} />
  );
}
```

| Check | Status |
|-------|--------|
| [ ] Script no layout.tsx | ⬜ |
| [ ] SessionId persistido | ⬜ |
| [ ] Chama /api/track | ⬜ |

---

## 9. Verificação Final

### Build Test
```bash
npm run build
```

| Check | Status |
|-------|--------|
| [ ] Build passa sem erros | ⬜ |
| [ ] Sem warnings críticos | ⬜ |

### Local Test
```bash
npm run dev
# Testar:
# - http://localhost:3000
# - http://localhost:3000/api/stats?secret=garimdreaming-stats-2026&format=json
```

| Check | Status |
|-------|--------|
| [ ] App carrega | ⬜ |
| [ ] /api/stats funciona | ⬜ |

---

## Resumo

| Categoria | Completo |
|-----------|----------|
| Inicialização | ⬜ /2 |
| Dependências | ⬜ /X |
| Estrutura | ⬜ /7 |
| Configurações | ⬜ /5 |
| Database | ⬜ /4 |
| APIs | ⬜ /7 |
| SEO | ⬜ /7 |
| Tracking | ⬜ /3 |
| **TOTAL** | ⬜ /X |

---

**Status:** ⬜ Pronto para Build / ⬜ Pendências

---

*Checklist version: 1.0*
*Last updated: 2026-01-31*
