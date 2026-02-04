# GarimDreaming Design System

> **REGRA DE OURO:** Se voce nao consegue ler, o usuario tambem nao.

Este documento define os padroes visuais **OBRIGATORIOS** para todos os apps.
O daemon DEVE seguir estas regras em CADA build e deploy.

---

## 1. PALETA DE CORES PADRAO

### 1.1 Cores de Texto (OBRIGATORIAS)

| Uso | Light Mode | Dark Mode | Tailwind |
|-----|------------|-----------|----------|
| **Texto Principal** | `#0F172A` | `#F8FAFC` | `text-slate-900` / `dark:text-slate-50` |
| **Texto Secundario** | `#334155` | `#CBD5E1` | `text-slate-700` / `dark:text-slate-300` |
| **Texto Muted** | `#64748B` | `#94A3B8` | `text-slate-500` / `dark:text-slate-400` |
| **Links** | `#2563EB` | `#60A5FA` | `text-blue-600` / `dark:text-blue-400` |

### 1.2 Cores de Fundo (OBRIGATORIAS)

| Uso | Light Mode | Dark Mode | Tailwind |
|-----|------------|-----------|----------|
| **Background** | `#FFFFFF` | `#0F172A` | `bg-white` / `dark:bg-slate-900` |
| **Surface** | `#F8FAFC` | `#1E293B` | `bg-slate-50` / `dark:bg-slate-800` |
| **Card** | `#FFFFFF` | `#1E293B` | `bg-white` / `dark:bg-slate-800` |
| **Border** | `#E2E8F0` | `#334155` | `border-slate-200` / `dark:border-slate-700` |

### 1.3 Cores de Status

| Status | Cor | Tailwind |
|--------|-----|----------|
| **Sucesso** | `#16A34A` | `text-green-600` |
| **Erro** | `#DC2626` | `text-red-600` |
| **Aviso** | `#CA8A04` | `text-yellow-600` |
| **Info** | `#2563EB` | `text-blue-600` |

---

## 2. CONTRASTE MINIMO (WCAG AA)

### 2.1 Regras de Contraste

```
TEXTO NORMAL (< 18px): Ratio minimo 4.5:1
TEXTO GRANDE (>= 18px bold ou >= 24px): Ratio minimo 3:1
ELEMENTOS UI: Ratio minimo 3:1
```

### 2.2 Combinacoes PROIBIDAS

| Combinacao | Ratio | Problema |
|------------|-------|----------|
| `text-slate-400` em `bg-slate-100` | 2.8:1 | Ilegivel |
| `text-slate-500` em `bg-slate-200` | 3.2:1 | Abaixo do minimo |
| `text-gray-400` em `bg-gray-100` | 2.5:1 | Ilegivel |
| `text-zinc-400` em `bg-zinc-100` | 2.6:1 | Ilegivel |
| Qualquer `text-*-300` ou `text-*-400` em fundos claros | < 4.5:1 | PROIBIDO |

### 2.3 Combinacoes APROVADAS

```css
/* SEMPRE USAR ESTAS */
.light-mode {
  /* Texto principal */
  color: rgb(15 23 42);        /* text-slate-900 */
  background: rgb(255 255 255); /* bg-white */

  /* Texto secundario */
  color: rgb(51 65 85);        /* text-slate-700 */

  /* Texto muted (apenas para hints, nao conteudo principal) */
  color: rgb(100 116 139);     /* text-slate-500 */
}

.dark-mode {
  /* Texto principal */
  color: rgb(248 250 252);     /* text-slate-50 */
  background: rgb(15 23 42);    /* bg-slate-900 */

  /* Texto secundario */
  color: rgb(203 213 225);     /* text-slate-300 */

  /* Texto muted */
  color: rgb(148 163 184);     /* text-slate-400 */
}
```

---

## 3. PADROES CSS OBRIGATORIOS

### 3.1 globals.css BASE

Todo app DEVE incluir no `globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Garantir contraste minimo em TODOS os textos */
  body {
    @apply text-slate-900 dark:text-slate-50;
    @apply bg-white dark:bg-slate-900;
  }

  /* Headings SEMPRE visiveis */
  h1, h2, h3, h4, h5, h6 {
    @apply text-slate-900 dark:text-slate-50;
  }

  /* Paragrafos com bom contraste */
  p {
    @apply text-slate-700 dark:text-slate-300;
  }

  /* Links SEMPRE visiveis */
  a {
    @apply text-blue-600 dark:text-blue-400;
  }

  /* Placeholders com contraste adequado */
  ::placeholder {
    @apply text-slate-400 dark:text-slate-500;
  }

  /* Focus states VISIVEIS */
  :focus-visible {
    @apply outline-2 outline-blue-500 outline-offset-2;
  }
}

@layer components {
  /* Card padrao com bom contraste */
  .card {
    @apply bg-white dark:bg-slate-800;
    @apply border border-slate-200 dark:border-slate-700;
    @apply text-slate-900 dark:text-slate-50;
    @apply rounded-lg shadow-sm;
  }

  /* Input padrao */
  .input {
    @apply bg-white dark:bg-slate-800;
    @apply border border-slate-300 dark:border-slate-600;
    @apply text-slate-900 dark:text-slate-50;
    @apply placeholder:text-slate-400 dark:placeholder:text-slate-500;
    @apply focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20;
  }

  /* Botao primario */
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700;
    @apply text-white font-medium;
    @apply px-4 py-2 rounded-lg;
    @apply transition-colors;
  }

  /* Botao secundario */
  .btn-secondary {
    @apply bg-slate-100 dark:bg-slate-700;
    @apply hover:bg-slate-200 dark:hover:bg-slate-600;
    @apply text-slate-900 dark:text-slate-50;
    @apply px-4 py-2 rounded-lg;
    @apply transition-colors;
  }
}
```

### 3.2 tailwind.config.ts RECOMENDADO

```typescript
import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cores semanticas para garantir consistencia
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
      },
    },
  },
} satisfies Config
```

---

## 4. COMPONENTES OBRIGATORIOS

### 4.1 DonationWidget.tsx (Padrao Visual)

```tsx
export function DonationWidget() {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
        {/* titulo */}
      </h3>
      <p className="text-slate-600 dark:text-slate-300 mb-4">
        {/* descricao */}
      </p>
      {/* wallets */}
    </div>
  )
}
```

### 4.2 FeedbackWidget.tsx (Padrao Visual)

```tsx
export function FeedbackWidget() {
  return (
    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
      <h4 className="text-slate-900 dark:text-slate-50 font-medium mb-3">
        {/* titulo */}
      </h4>
      <div className="text-slate-600 dark:text-slate-300">
        {/* conteudo */}
      </div>
    </div>
  )
}
```

---

## 5. CHECKLIST VISUAL (QA Obrigatorio)

### 5.1 Antes de Cada Deploy

```
[ ] CONTRASTE: Todos os textos tem ratio >= 4.5:1
[ ] HEADINGS: h1-h6 usam text-slate-900/dark:text-slate-50
[ ] PARAGRAFOS: Usam text-slate-700/dark:text-slate-300
[ ] LINKS: Usam text-blue-600/dark:text-blue-400
[ ] INPUTS: Texto visivel (text-slate-900)
[ ] PLACEHOLDERS: Usam text-slate-400 (nao mais claro)
[ ] BOTOES: Contraste minimo 4.5:1
[ ] CARDS: Bordas visiveis + texto com contraste
[ ] ICONES: Tamanho minimo 24x24px
[ ] FOCUS: Estados de foco visiveis
```

### 5.2 Testes Playwright (Automatizados)

```typescript
// Verificar se nao ha textos invisiveis
test('texto principal tem contraste adequado', async ({ page }) => {
  const elements = await page.locator('p, h1, h2, h3, h4, h5, h6, span, a, button');
  // Verificar que nenhum elemento usa classes proibidas
  for (const el of await elements.all()) {
    const classes = await el.getAttribute('class') || '';
    // Classes proibidas em light mode
    expect(classes).not.toMatch(/text-(slate|gray|zinc)-(300|400)\s/);
  }
});
```

---

## 6. ERROS COMUNS E COMO EVITAR

### 6.1 Erro: Texto escuro em fundo escuro

**ERRADO:**
```tsx
<div className="bg-slate-800 text-slate-700">
  Texto invisivel
</div>
```

**CORRETO:**
```tsx
<div className="bg-slate-800 text-slate-200">
  Texto visivel
</div>
```

### 6.2 Erro: Placeholder muito claro

**ERRADO:**
```tsx
<input placeholder="Digite..." className="placeholder:text-slate-300" />
```

**CORRETO:**
```tsx
<input placeholder="Digite..." className="placeholder:text-slate-400" />
```

### 6.3 Erro: Gradiente sem texto adaptado

**ERRADO:**
```tsx
<div className="bg-gradient-to-r from-blue-600 to-purple-600 text-blue-200">
  Texto dificil de ler
</div>
```

**CORRETO:**
```tsx
<div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
  Texto perfeitamente legivel
</div>
```

---

## 7. REGRAS ABSOLUTAS

1. **NUNCA** use `text-*-300` ou `text-*-400` para texto principal
2. **SEMPRE** teste em dark mode E light mode
3. **SEMPRE** teste em mobile (375px)
4. **NUNCA** use placeholder como unica label
5. **SEMPRE** inclua focus states
6. **NUNCA** remova outline sem alternativa

---

## 8. FERRAMENTAS DE VERIFICACAO

### 8.1 Verificar Contraste

```bash
# WebAIM Contrast Checker
open "https://webaim.org/resources/contrastchecker/"

# Chrome DevTools
# Inspect element > Styles > Color picker mostra ratio
```

### 8.2 Verificar Acessibilidade

```bash
# Lighthouse no Chrome
# DevTools > Lighthouse > Accessibility

# axe DevTools extension
# Scan automatico de problemas de contraste
```

---

**LEMBRE-SE:** Um app que o usuario nao consegue ler e um app que nao sera usado.

Ultima atualizacao: 2026-02-04
