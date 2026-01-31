# Sistema de Rating & Feedback - Plano de Implementação

*Sistema para coletar sentimento do usuário sobre cada app.*

**Aplica-se a:** Novos apps a partir de 2026-01-31
**Apps existentes:** Não serão modificados

---

## 1. Visão Geral

### Objetivo
Coletar feedback do usuário sobre a **ideia** do app (não apenas usabilidade) para:
1. Saber se a ideia ressoa com o público
2. Priorizar investimento em apps bem avaliados
3. Diferenciar "muitas views" de "app valorizado"

### Métricas
| Métrica | O que mede |
|---------|------------|
| Views | Interesse/Curiosidade |
| Rating (1-5 estrelas) | Qualidade percebida da ideia |
| Comentários | Feedback qualitativo |
| Score Composto | (Views × 0.3) + (Rating × 0.7) |

---

## 2. Componente de Feedback

### 2.1 Posicionamento
- **Localização:** Footer, acima do copyright
- **Visibilidade:** Sempre visível, não modal/popup
- **Timing:** Disponível imediatamente (não esperar X segundos)

### 2.2 Design (Dark Mode, Glassmorphism)

```
┌─────────────────────────────────────────────────────────────┐
│  ✨ O que você achou dessa ideia?                          │
│                                                             │
│  ☆  ☆  ☆  ☆  ☆                                            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Deixe sua opinião (opcional)...                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│                              [Enviar Feedback]              │
│                                                             │
│  💬 12 opiniões · ⭐ 4.2 média                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Código do Componente

```typescript
// src/components/FeedbackWidget.tsx
'use client';

import { useState } from 'react';
import { Star, MessageCircle, Send } from 'lucide-react';

interface FeedbackWidgetProps {
  appSlug: string;
  appName: string;
}

export function FeedbackWidget({ appSlug, appName }: FeedbackWidgetProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [stats, setStats] = useState({ count: 0, average: 0 });

  const handleSubmit = async () => {
    if (rating === 0) return;

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appSlug,
          rating,
          comment: comment.trim() || null,
          sessionId: localStorage.getItem('sessionId'),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        // Atualizar stats localmente
        const newCount = stats.count + 1;
        const newAverage = ((stats.average * stats.count) + rating) / newCount;
        setStats({ count: newCount, average: newAverage });
      }
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  if (submitted) {
    return (
      <div className="bg-surface/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
        <p className="text-primary text-lg">✨ Obrigado pelo feedback!</p>
        <p className="text-muted text-sm mt-2">
          Sua opinião nos ajuda a criar apps melhores.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-medium text-text mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-primary" />
        O que você achou dessa ideia?
      </h3>

      {/* Stars */}
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="transition-transform hover:scale-110 cursor-pointer"
          >
            <Star
              className={`w-8 h-8 ${
                star <= (hoveredRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Deixe sua opinião (opcional)..."
        className="w-full bg-background/50 border border-white/10 rounded-xl p-3 text-text placeholder-muted resize-none h-20 focus:outline-none focus:border-primary/50"
        maxLength={500}
      />

      {/* Submit */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-4 text-sm text-muted">
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            {stats.count} opiniões
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {stats.average.toFixed(1)} média
          </span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            rating > 0
              ? 'bg-primary text-white hover:bg-primary/80 cursor-pointer'
              : 'bg-surface text-muted cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
          Enviar Feedback
        </button>
      </div>
    </div>
  );
}
```

---

## 3. API de Feedback

### 3.1 `/api/feedback/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Storage em memória (ou integrar com banco depois)
declare global {
  var __feedbacks: Array<{
    appSlug: string;
    rating: number;
    comment: string | null;
    sessionId: string;
    timestamp: Date;
    userAgent: string;
  }>;
}

if (!global.__feedbacks) {
  global.__feedbacks = [];
}

// POST - Enviar feedback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { appSlug, rating, comment, sessionId } = body;

    // Validação
    if (!appSlug || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Invalid data' },
        { status: 400 }
      );
    }

    // Verificar se já votou (por sessionId)
    const existingFeedback = global.__feedbacks.find(
      (f) => f.appSlug === appSlug && f.sessionId === sessionId
    );

    if (existingFeedback) {
      // Atualizar voto existente
      existingFeedback.rating = rating;
      existingFeedback.comment = comment;
      existingFeedback.timestamp = new Date();
    } else {
      // Novo feedback
      global.__feedbacks.push({
        appSlug,
        rating,
        comment,
        sessionId: sessionId || 'anonymous',
        timestamp: new Date(),
        userAgent: request.headers.get('user-agent') || 'Unknown',
      });
    }

    // Limitar a 10000 feedbacks
    if (global.__feedbacks.length > 10000) {
      global.__feedbacks = global.__feedbacks.slice(-5000);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save feedback' },
      { status: 500 }
    );
  }
}

// GET - Obter stats de feedback
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const appSlug = searchParams.get('app');

  // Stats públicos (sem secret) - apenas contagem e média
  if (!secret) {
    if (!appSlug) {
      return NextResponse.json({ error: 'App slug required' }, { status: 400 });
    }

    const appFeedbacks = global.__feedbacks.filter((f) => f.appSlug === appSlug);
    const count = appFeedbacks.length;
    const average = count > 0
      ? appFeedbacks.reduce((sum, f) => sum + f.rating, 0) / count
      : 0;

    return NextResponse.json({
      count,
      average: Math.round(average * 10) / 10,
    });
  }

  // Stats completos (com secret) - incluindo comentários
  if (secret !== 'garimdreaming-stats-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Agrupar por app
  const byApp: Record<string, {
    count: number;
    average: number;
    comments: Array<{ rating: number; comment: string; timestamp: Date }>;
  }> = {};

  global.__feedbacks.forEach((f) => {
    if (!byApp[f.appSlug]) {
      byApp[f.appSlug] = { count: 0, average: 0, comments: [] };
    }
    byApp[f.appSlug].count++;
    if (f.comment) {
      byApp[f.appSlug].comments.push({
        rating: f.rating,
        comment: f.comment,
        timestamp: f.timestamp,
      });
    }
  });

  // Calcular médias
  Object.keys(byApp).forEach((slug) => {
    const feedbacks = global.__feedbacks.filter((f) => f.appSlug === slug);
    byApp[slug].average =
      feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;
  });

  return NextResponse.json({ feedbacks: byApp });
}
```

---

## 4. Atualização do Dashboard

### 4.1 Novos Campos no Banco

```sql
-- Adicionar campos de rating na tabela
ALTER TABLE garimdreaming_apps ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;
ALTER TABLE garimdreaming_apps ADD COLUMN IF NOT EXISTS rating_average DECIMAL(2,1) DEFAULT 0;
ALTER TABLE garimdreaming_apps ADD COLUMN IF NOT EXISTS composite_score DECIMAL(5,2) DEFAULT 0;
```

### 4.2 Cálculo do Score Composto

```typescript
// Score = (Views Normalizadas × 0.3) + (Rating × 0.7)
function calculateCompositeScore(weekViews: number, maxViews: number, rating: number): number {
  const normalizedViews = maxViews > 0 ? (weekViews / maxViews) * 5 : 0;
  const score = (normalizedViews * 0.3) + (rating * 0.7);
  return Math.round(score * 100) / 100;
}
```

### 4.3 Nova Recomendação Baseada em Score

| Score | Recomendação | Ação |
|-------|--------------|------|
| 4.0+ | 🚀 SCALE | Investir pesado, marketing, features |
| 3.0 - 3.9 | 📈 GROW | Continuar melhorando |
| 2.0 - 2.9 | 👀 MONITOR | Observar, pequenas melhorias |
| 1.0 - 1.9 | 🔄 PIVOT | Repensar a ideia |
| < 1.0 | 🌙 SUNSET | Descontinuar |

### 4.4 Atualização do Sync

```typescript
// No /api/sync/route.ts - adicionar busca de feedbacks
async function syncAppFeedback(appSlug: string, appUrl: string) {
  try {
    const response = await fetch(
      `${appUrl}/api/feedback?app=${appSlug}`
    );
    if (response.ok) {
      const data = await response.json();
      return {
        ratingCount: data.count || 0,
        ratingAverage: data.average || 0,
      };
    }
  } catch {
    return { ratingCount: 0, ratingAverage: 0 };
  }
  return { ratingCount: 0, ratingAverage: 0 };
}
```

---

## 5. Visualização no Dashboard

### 5.1 Card do App Atualizado

```
┌─────────────────────────────────────────────────────────────┐
│  📱 ClipGenius                                    🚀 SCALE  │
│                                                             │
│  Views: 156 (↑23%)    ⭐ 4.3 (42 reviews)                  │
│                                                             │
│  ████████████████████░░░░░░░░░░  Score: 4.1                │
│                                                             │
│  Comentários recentes:                                      │
│  "Muito útil para criadores!" - ⭐⭐⭐⭐⭐                    │
│  "Precisa melhorar a velocidade" - ⭐⭐⭐                    │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Ranking Atualizado

| # | App | Views | Rating | Score | Recomendação |
|---|-----|-------|--------|-------|--------------|
| 1 | WikiScroll | 156 | 4.5 | 4.3 | 🚀 SCALE |
| 2 | PropostaAI | 89 | 4.8 | 4.2 | 🚀 SCALE |
| 3 | ClipGenius | 234 | 3.2 | 3.1 | 📈 GROW |
| 4 | FocusFlow | 45 | 2.8 | 2.3 | 👀 MONITOR |

---

## 6. Responsividade do Widget

### Mobile (375px)
```
┌─────────────────────────────┐
│ ✨ O que achou?             │
│                             │
│ ☆ ☆ ☆ ☆ ☆                  │
│                             │
│ ┌─────────────────────────┐ │
│ │ Sua opinião...          │ │
│ └─────────────────────────┘ │
│                             │
│ 💬 12 · ⭐ 4.2              │
│                             │
│      [Enviar Feedback]      │
└─────────────────────────────┘
```

### Tablet (768px)
- Layout em duas colunas: estrelas + stats à esquerda, textarea à direita

### Desktop (1280px+)
- Layout horizontal completo conforme design original

---

## 7. Armazenamento de Comentários

### 7.1 Opção A: Em Memória (MVP)
- Simples, já implementado no código acima
- Perde dados no restart do servidor
- Bom para validação inicial

### 7.2 Opção B: Banco de Dados (Recomendado)

```prisma
model Feedback {
  id        String   @id @default(cuid())
  appSlug   String
  rating    Int      // 1-5
  comment   String?
  sessionId String
  userAgent String?
  createdAt DateTime @default(now())

  @@index([appSlug])
  @@index([sessionId])
}
```

### 7.3 Dashboard - Visualização de Comentários

```typescript
// Nova página no dashboard: /feedbacks
// Lista todos os comentários agrupados por app
// Filtros: por app, por rating, por data
// Export para CSV
```

---

## 8. Checklist de Implementação

### Para Cada Novo App

- [ ] Adicionar `FeedbackWidget.tsx` em `src/components/`
- [ ] Adicionar `/api/feedback/route.ts`
- [ ] Incluir widget no footer de `page.tsx`
- [ ] Testar em mobile, tablet, desktop
- [ ] Verificar que stats são retornados corretamente

### No Dashboard

- [ ] Adicionar campos `rating_count`, `rating_average`, `composite_score` na tabela
- [ ] Atualizar sync para buscar feedbacks
- [ ] Implementar cálculo de score composto
- [ ] Atualizar visualização dos cards
- [ ] Criar página de comentários

---

## 9. Timeline de Implementação

| Fase | Tarefa | Tempo |
|------|--------|-------|
| 1 | Criar componente FeedbackWidget | 30 min |
| 2 | Criar API de feedback | 30 min |
| 3 | Atualizar template de novo app | 15 min |
| 4 | Atualizar schema do dashboard | 15 min |
| 5 | Atualizar sync do dashboard | 30 min |
| 6 | Criar página de comentários | 45 min |
| **Total** | | ~2h 45min |

---

## 10. Best Practices Seguidas

Baseado em pesquisa de [UserPilot](https://userpilot.com/blog/in-app-feedback/), [Zonka Feedback](https://www.zonkafeedback.com/blog/free-feedback-widget-for-website), e [Qualaroo](https://qualaroo.com/blog/customer-feedback-saas/):

1. **Widget sempre visível** - Não usar modal/popup
2. **Feedback não-intrusivo** - Opcional, não obrigatório
3. **Um voto por sessão** - Evitar spam
4. **Feedback imediato** - Mostrar "Obrigado" após envio
5. **Stats públicos** - Mostrar média e contagem (social proof)
6. **Comentários opcionais** - Estrelas obrigatórias, texto opcional

---

*Plano version: 1.0*
*Last updated: 2026-01-31*
*Aplica-se a: Novos apps apenas*
