# Guia de Desenvolvimento - GarimDreaming

> Este guia contem instrucoes **OBRIGATORIAS** que o daemon DEVE seguir em CADA build.
> Ler este documento ANTES de iniciar qualquer app.

---

## FASE 1: PRE-BUILD

### 1.1 Ler Templates Obrigatorios

```bash
# OBRIGATORIO: Ler antes de escrever qualquer codigo
cat ~/clawd/templates/seo-i18n-template.md
cat ~/clawd/templates/feedback-widget-template.md
cat ~/clawd/templates/donation-widget-template.md
cat ~/.claude/standards/design-system.md  # NOVO: Padroes visuais
```

### 1.2 Estrutura de Diretorios

```
app-name/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx      # generateMetadata com i18n
│   │   └── page.tsx        # DonationWidget + FeedbackWidget
│   ├── api/
│   │   ├── track/route.ts
│   │   ├── stats/route.ts
│   │   └── feedback/route.ts
│   ├── sitemap.ts
│   ├── robots.ts
│   └── globals.css         # INCLUI padroes de contraste
├── components/
│   ├── DonationWidget.tsx
│   └── FeedbackWidget.tsx
├── messages/
│   ├── pt-BR.json
│   ├── en-US.json
│   └── es.json
└── tailwind.config.ts
```

---

## FASE 2: PADROES VISUAIS (CRITICO)

### 2.1 globals.css OBRIGATORIO

**SEMPRE** incluir estas classes base:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* TEXTO LEGIVEL - OBRIGATORIO */
  body {
    @apply text-slate-900 bg-white;
    @apply dark:text-slate-50 dark:bg-slate-900;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply text-slate-900 dark:text-slate-50;
  }

  p, li, span {
    @apply text-slate-700 dark:text-slate-300;
  }

  a {
    @apply text-blue-600 dark:text-blue-400 hover:underline;
  }

  /* INPUTS VISIVEIS */
  input, textarea, select {
    @apply text-slate-900 dark:text-slate-50;
    @apply bg-white dark:bg-slate-800;
    @apply border-slate-300 dark:border-slate-600;
    @apply placeholder:text-slate-400;
  }
}
```

### 2.2 Cores OBRIGATORIAS por Componente

| Componente | Light Mode | Dark Mode |
|------------|------------|-----------|
| **Titulo Principal** | `text-slate-900` | `dark:text-slate-50` |
| **Subtitulo** | `text-slate-700` | `dark:text-slate-300` |
| **Texto Corpo** | `text-slate-600` | `dark:text-slate-400` |
| **Background** | `bg-white` | `dark:bg-slate-900` |
| **Card** | `bg-white border-slate-200` | `dark:bg-slate-800 dark:border-slate-700` |
| **Botao Primario** | `bg-blue-600 text-white` | Igual |
| **Input** | `bg-white text-slate-900` | `dark:bg-slate-800 dark:text-slate-50` |

### 2.3 PROIBIDO (Causa texto invisivel)

```tsx
// ERRADO - NUNCA USAR
<p className="text-slate-400">...</p>        // Muito claro em bg-white
<p className="text-gray-300">...</p>         // Invisivel
<span className="text-zinc-400">...</span>   // Baixo contraste

// CORRETO
<p className="text-slate-700">...</p>        // Bom contraste
<p className="text-slate-600">...</p>        // Aceitavel
<span className="text-slate-500">...</span>  // Minimo para muted text
```

---

## FASE 3: COMPONENTES OBRIGATORIOS

### 3.1 DonationWidget (Template)

```tsx
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Copy, Check, Heart } from 'lucide-react'

const WALLETS = {
  solana: 'HET7XZpgcsBCvmkWEmors7zysvc2eKSCnDbL8YVmFXiQ',
  ethereum: '0x76d56857Df003331462b0369caA40DB04d4ECaa1',
  bitcoin_taproot: 'bc1pgfcn9zp4e994e4575vehn5ppl5ywd63cvm0lsaejyakrgdc2h4pshct2u5',
  bitcoin_segwit: 'bc1qtjqk6cr4qmwqgnrzc8udf8lfu9llw444v0ypav',
}

export function DonationWidget() {
  const t = useTranslations('donation')
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (wallet: string, key: string) => {
    navigator.clipboard.writeText(wallet)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-rose-500" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          {t('title')}
        </h3>
      </div>

      <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm">
        {t('description')}
      </p>

      <div className="space-y-3">
        {Object.entries(WALLETS).map(([key, address]) => (
          <div
            key={key}
            className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex-1 min-w-0">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                {key.replace('_', ' ')}
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-mono truncate">
                {address}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(address, key)}
              className="ml-2 p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              aria-label="Copy address"
            >
              {copied === key ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 3.2 FeedbackWidget (Template)

```tsx
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Star, Send, Check } from 'lucide-react'

export function FeedbackWidget() {
  const t = useTranslations('feedback')
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return
    setLoading(true)

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      })
      setSubmitted(true)
    } catch (error) {
      console.error('Feedback error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
        <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
        <p className="text-green-700 dark:text-green-300 font-medium">
          {t('thankYou')}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
      <h4 className="text-slate-900 dark:text-slate-50 font-semibold mb-3">
        {t('title')}
      </h4>

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="p-1 transition-transform hover:scale-110"
          >
            <Star
              className={`w-6 h-6 ${
                star <= (hoveredRating || rating)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t('placeholder')}
        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={3}
      />

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={rating === 0 || loading}
        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-medium rounded-lg transition-colors"
      >
        {loading ? (
          <span className="animate-pulse">{t('sending')}</span>
        ) : (
          <>
            <Send className="w-4 h-4" />
            {t('submit')}
          </>
        )}
      </button>
    </div>
  )
}
```

---

## FASE 4: QA VISUAL AUTOMATIZADO

### 4.1 Antes do Build

```bash
# Verificar codigo proibido
grep -rn "text-slate-300\|text-gray-300\|text-zinc-300" --include="*.tsx" .
grep -rn "text-slate-400[^/]" --include="*.tsx" . | grep -v placeholder

# Se encontrar = PARAR e corrigir
```

### 4.2 Apos Deploy

```bash
# Testes Playwright OBRIGATORIOS

# 1. Navegar para URL
mcp__playwright__browser_navigate url=[URL]

# 2. Verificar se pagina carrega
mcp__playwright__browser_snapshot

# 3. VERIFICAR VISUALMENTE:
#    - DonationWidget visivel?
#    - FeedbackWidget visivel?
#    - Textos legiveis?

# 4. Screenshot desktop
mcp__playwright__browser_take_screenshot filename=[app]-desktop.png

# 5. Screenshot mobile
mcp__playwright__browser_resize width=375 height=667
mcp__playwright__browser_take_screenshot filename=[app]-mobile.png

# 6. ANALISAR SCREENSHOTS:
#    - Contraste adequado?
#    - Widgets aparecem?
#    - Texto legivel em mobile?
```

### 4.3 Criterios de Falha (Bloqueia Deploy)

```
FALHA CRITICA (bloqueia posts):
- [ ] Texto invisivel ou dificil de ler
- [ ] DonationWidget nao aparece
- [ ] FeedbackWidget nao aparece
- [ ] Contraste < 4.5:1 em texto principal
- [ ] Mobile quebrado (overflow)

AVISO (nao bloqueia, mas deve corrigir):
- [ ] Placeholder muito claro
- [ ] Focus states ausentes
- [ ] Icones muito pequenos
```

---

## FASE 5: CHECKLIST FINAL

### Pre-Build
- [ ] Li design-system.md
- [ ] Li templates de widgets
- [ ] Estrutura de pastas correta

### Durante Build
- [ ] globals.css tem classes base de contraste
- [ ] DonationWidget.tsx criado com padroes corretos
- [ ] FeedbackWidget.tsx criado com padroes corretos
- [ ] Nenhum text-*-300 ou text-*-400 em textos principais

### Pre-Deploy
- [ ] `npm run build` sem erros
- [ ] grep de codigo proibido retorna vazio

### Pos-Deploy
- [ ] Screenshot desktop mostra widgets
- [ ] Screenshot mobile mostra widgets
- [ ] Textos legiveis em ambos
- [ ] API /api/stats funciona

---

## LEMBRETES IMPORTANTES

1. **SEMPRE** teste dark mode e light mode
2. **SEMPRE** teste em mobile (375px)
3. **NUNCA** use text-*-300 para texto visivel
4. **SEMPRE** inclua DonationWidget no hero
5. **SEMPRE** inclua FeedbackWidget no footer
6. **SE** screenshot mostrar texto ilegivel = PARAR e corrigir

---

Ultima atualizacao: 2026-02-04
