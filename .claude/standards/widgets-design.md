# Widgets Obrigatorios - Design System

> **TODOS os apps DEVEM ter estes dois widgets com este design EXATO.**
> Os widgets devem seguir o tema de cores do app, mas manter a estrutura.

---

## 1. DONATION WIDGET

### 1.1 Design Visual

```
┌─────────────────────────────────────────────────────────────┐
│  💜  Apoie este projeto                               [^]   │
│      Ajude a manter este projeto gratuito.                  │
│      Faca sua doacao com qualquer Cripto abaixo:            │
├─────────────────────────────────────────────────────────────┤
│  ≡ Solana                              USDT / USDC / SOL    │
│    HET7XZpgcsBCvmkWEmors7zysvc2eKSCnDbL8YVmFXiQ       [📋] │
├─────────────────────────────────────────────────────────────┤
│  ◆ Ethereum                            USDT / USDC / ETH    │
│    0x76d56857Df003331462b0369caA40DB04d4ECaa1         [📋] │
├─────────────────────────────────────────────────────────────┤
│  ₿ Bitcoin                                  BTC (Taproot)   │
│    bc1pgfcn9zp4e994e4575vehn5ppl5ywd63cvm0lsaejyakrg  [📋] │
├─────────────────────────────────────────────────────────────┤
│  ₿ Bitcoin                                   BTC (SegWit)   │
│    bc1qtjqk6cr4qmwqgnrzc8udf8lfu9llw444v0ypav         [📋] │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Traducoes OBRIGATORIAS

```json
// messages/pt-BR.json
{
  "donation": {
    "title": "Apoie este projeto",
    "subtitle": "Ajude a manter este projeto gratuito. Faca sua doacao com qualquer Cripto abaixo:",
    "copied": "Copiado!",
    "copy": "Copiar"
  }
}

// messages/en-US.json
{
  "donation": {
    "title": "Support this project",
    "subtitle": "Help keep this project free. Make your donation with any Crypto below:",
    "copied": "Copied!",
    "copy": "Copy"
  }
}

// messages/es.json
{
  "donation": {
    "title": "Apoya este proyecto",
    "subtitle": "Ayuda a mantener este proyecto gratuito. Haz tu donacion con cualquier Cripto abajo:",
    "copied": "Copiado!",
    "copy": "Copiar"
  }
}
```

### 1.3 Componente TSX

```tsx
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Heart, Copy, Check, ChevronUp, ChevronDown } from 'lucide-react'

const WALLETS = [
  {
    name: 'Solana',
    network: 'USDT / USDC / SOL',
    address: 'HET7XZpgcsBCvmkWEmors7zysvc2eKSCnDbL8YVmFXiQ',
    icon: '≡',
    color: 'bg-gradient-to-r from-purple-500 to-blue-500',
  },
  {
    name: 'Ethereum',
    network: 'USDT / USDC / ETH',
    address: '0x76d56857Df003331462b0369caA40DB04d4ECaa1',
    icon: '◆',
    color: 'bg-gradient-to-r from-blue-500 to-indigo-500',
  },
  {
    name: 'Bitcoin',
    network: 'BTC (Taproot)',
    address: 'bc1pgfcn9zp4e994e4575vehn5ppl5ywd63cvm0lsaejyakrgdc2h4pshct2u5',
    icon: '₿',
    color: 'bg-gradient-to-r from-orange-500 to-amber-500',
  },
  {
    name: 'Bitcoin',
    network: 'BTC (SegWit)',
    address: 'bc1qtjqk6cr4qmwqgnrzc8udf8lfu9llw444v0ypav',
    icon: '₿',
    color: 'bg-gradient-to-r from-orange-500 to-amber-500',
  },
]

export function DonationWidget() {
  const t = useTranslations('donation')
  const [isOpen, setIsOpen] = useState(true) // SEMPRE aberto por padrao
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = async (address: string, name: string) => {
    await navigator.clipboard.writeText(address)
    setCopied(name)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header - Clicavel para expandir/colapsar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-t-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
      >
        {/* Icone do coracao */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
          <Heart className="w-5 h-5 text-white fill-white" />
        </div>

        {/* Texto */}
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-slate-900 dark:text-slate-50">
            {t('title')}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {t('subtitle')}
          </p>
        </div>

        {/* Seta */}
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {/* Wallets - Expandivel */}
      {isOpen && (
        <div className="bg-white dark:bg-slate-800 rounded-b-2xl border border-t-0 border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
          {WALLETS.map((wallet, index) => (
            <div key={`${wallet.name}-${index}`} className="p-4">
              {/* Header da wallet */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full ${wallet.color} flex items-center justify-center text-white text-xs font-bold`}>
                    {wallet.icon}
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-50">
                    {wallet.name}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {wallet.network}
                </span>
              </div>

              {/* Endereco */}
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-lg font-mono truncate">
                  {wallet.address}
                </code>
                <button
                  onClick={() => copyToClipboard(wallet.address, `${wallet.name}-${index}`)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  title={t('copy')}
                >
                  {copied === `${wallet.name}-${index}` ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### 1.4 Regras de Posicionamento

- **ONDE:** Hero section ou area de destaque (NAO no footer)
- **ESTADO INICIAL:** Aberto (isOpen = true)
- **RESPONSIVO:** max-w-md mx-auto em desktop, full-width em mobile

---

## 2. FEEDBACK WIDGET

### 2.1 Design Visual

```
┌─────────────────────────────────────────────────────────────┐
│  ✨ O que voce achou dessa ideia?                           │
│                                                             │
│     ⭐ ☆ ☆ ☆ ☆                                              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Compartilhe sua opiniao ou sugestao...              │   │
│  │                                                     │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  💡 Tem uma ideia para melhorar? Lemos todas as sugestoes! │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                     Enviar                          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Traducoes OBRIGATORIAS

```json
// messages/pt-BR.json
{
  "feedback": {
    "title": "O que voce achou dessa ideia?",
    "placeholder": "Compartilhe sua opiniao ou sugestao...",
    "hint": "Tem uma ideia para melhorar? Lemos todas as sugestoes!",
    "submit": "Enviar",
    "sending": "Enviando...",
    "thankYou": "Obrigado pelo feedback!",
    "error": "Erro ao enviar. Tente novamente."
  }
}

// messages/en-US.json
{
  "feedback": {
    "title": "What did you think of this idea?",
    "placeholder": "Share your opinion or suggestion...",
    "hint": "Have an idea to improve? We read all suggestions!",
    "submit": "Send",
    "sending": "Sending...",
    "thankYou": "Thanks for your feedback!",
    "error": "Error sending. Try again."
  }
}

// messages/es.json
{
  "feedback": {
    "title": "Que te parecio esta idea?",
    "placeholder": "Comparte tu opinion o sugerencia...",
    "hint": "Tienes una idea para mejorar? Leemos todas las sugerencias!",
    "submit": "Enviar",
    "sending": "Enviando...",
    "thankYou": "Gracias por tu feedback!",
    "error": "Error al enviar. Intenta de nuevo."
  }
}
```

### 2.3 Componente TSX

```tsx
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Sparkles, Star, Lightbulb, Check, AlertCircle } from 'lucide-react'

export function FeedbackWidget() {
  const t = useTranslations('feedback')
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async () => {
    if (rating === 0) return
    setStatus('loading')

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      })

      if (response.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl text-center">
        <Check className="w-10 h-10 text-green-500 mx-auto mb-3" />
        <p className="text-green-700 dark:text-green-300 font-medium">
          {t('thankYou')}
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <h3 className="font-semibold text-slate-900 dark:text-slate-50">
          {t('title')}
        </h3>
      </div>

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded"
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= (hoveredRating || rating)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t('placeholder')}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        rows={3}
      />

      {/* Hint */}
      <div className="flex items-center gap-2 mt-3 mb-4">
        <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('hint')}
        </p>
      </div>

      {/* Error message */}
      {status === 'error' && (
        <div className="flex items-center gap-2 mb-3 text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4" />
          <p className="text-sm">{t('error')}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={rating === 0 || status === 'loading'}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {status === 'loading' ? t('sending') : t('submit')}
      </button>
    </div>
  )
}
```

### 2.4 Regras de Posicionamento

- **ONDE:** Footer da pagina, ANTES do copyright
- **ESTADO:** Sempre visivel (nao colapsavel)
- **RESPONSIVO:** max-w-md mx-auto em desktop, full-width em mobile

---

## 3. API DE FEEDBACK

### 3.1 Endpoint /api/feedback/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function POST(request: NextRequest) {
  try {
    const { rating, comment } = await request.json()

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid rating' },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)

    await sql`
      INSERT INTO feedback (app_name, rating, comment, created_at)
      VALUES (${process.env.APP_NAME || 'unknown'}, ${rating}, ${comment || ''}, NOW())
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    )
  }
}
```

### 3.2 Tabela no Neon (se nao existir)

```sql
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  app_name VARCHAR(100) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 4. CHECKLIST DE VERIFICACAO

### QA Visual Obrigatorio

```
DONATION WIDGET:
[ ] Widget presente na pagina
[ ] Widget ABERTO por padrao (nao colapsado)
[ ] Titulo "Apoie este projeto" visivel
[ ] Subtitulo completo visivel
[ ] 4 wallets listadas (Solana, Ethereum, Bitcoin x2)
[ ] Botao de copiar funciona
[ ] Enderecos completos (nao truncados demais)
[ ] Cores seguem tema do app

FEEDBACK WIDGET:
[ ] Widget presente no footer
[ ] Icone de sparkles visivel
[ ] Titulo "O que voce achou dessa ideia?" visivel
[ ] 5 estrelas clicaveis
[ ] Estrelas mudam cor ao hover/click
[ ] Textarea presente e funcional
[ ] Hint com icone de lampada visivel
[ ] Botao "Enviar" funciona
[ ] Mensagem de sucesso aparece apos envio
```

### Grep de Verificacao

```bash
# Verificar se widgets existem
grep -rn "DonationWidget" --include="*.tsx" app/
grep -rn "FeedbackWidget" --include="*.tsx" app/

# Verificar traducoes
grep -rn "donation" --include="*.json" messages/
grep -rn "feedback" --include="*.json" messages/
```

---

## 5. CORES POR TEMA

Os widgets devem adaptar ao tema do app:

| Tema App | Icone Coracao | Botao Submit | Stars |
|----------|---------------|--------------|-------|
| Default | purple-pink | blue-600 | amber-400 |
| Dark Tech | green-500 | green-600 | amber-400 |
| Fintech | amber-500 | indigo-600 | amber-400 |
| Health | teal-500 | teal-600 | amber-400 |

---

**Ultima atualizacao:** 2026-02-04
