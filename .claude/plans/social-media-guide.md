# Social Media Guide - Multi-Platform Promotion

*Estratégia completa para promover apps em múltiplas redes sociais.*

---

## Status Atual das Redes

| Rede | Status | Automação | Prioridade |
|------|--------|-----------|------------|
| X/Twitter | ✅ Ativo | Playwright | P0 - Diário |
| LinkedIn | ⏳ Pendente | Playwright possível | P1 - Semanal |
| Reddit | ⏳ Pendente | Playwright possível | P1 - Por app |
| Instagram | ⏳ Pendente | Manual (app) | P2 - Semanal |
| TikTok | ⏳ Pendente | Manual (app) | P2 - Viral |
| Product Hunt | ⏳ Pendente | Manual | P1 - Por app |
| Hacker News | ⏳ Pendente | Manual | P2 - Seletivo |

---

## X/Twitter (ATIVO)

### Frequência
- **3 posts por dia** (manhã, tarde, noite)
- **3 idiomas** (pt-BR, en-US, es)

### Template PT-BR
```
[Pergunta sobre a dor?]

[App] resolve isso em [tempo].

✅ [Feature 1]
✅ [Feature 2]
✅ [Feature 3]

Grátis. Sem cadastro.

[URL]

#FreelancerBR #IA #Produtividade
```

### Template EN-US
```
[Problem as question?]

[App] solves this in [time].

✅ [Feature 1]
✅ [Feature 2]
✅ [Feature 3]

Built with Next.js + AI

[URL]

#AI #IndieHacker #BuildInPublic
```

### Template ES
```
[¿Problema como pregunta?]

[App] resuelve esto en [tiempo].

✅ [Feature 1]
✅ [Feature 2]
✅ [Feature 3]

Gratis. Sin registro.

[URL]

#IA #Freelancer #Marketing
```

### Automação Playwright
```javascript
// Já implementado - usar para posts diários
mcp__playwright__browser_navigate url="https://x.com/compose/post"
```

---

## LinkedIn (PRÓXIMO A IMPLEMENTAR)

### Frequência
- **1-2 posts por semana**
- **Português e Inglês**

### Por que LinkedIn?
- Público profissional (freelancers, empreendedores)
- Maior alcance orgânico que X
- Bom para B2B apps (PropostaAI, FocusFlow)

### Template LinkedIn
```markdown
💡 [Pergunta sobre problema profissional]

Criei [App] para resolver [problema específico].

O que ele faz:
→ [Feature 1]
→ [Feature 2]
→ [Feature 3]

Por que construí:
[1-2 parágrafos sobre a dor e motivação]

Stack técnica: Next.js 15 + Tailwind + AI

Experimente grátis: [URL]

O que vocês acham? Feedback é muito bem-vindo! 🙏

#[Hashtag1] #[Hashtag2] #[Hashtag3]
```

### Automação Playwright
```javascript
// Login necessário - verificar se logado
mcp__playwright__browser_navigate url="https://www.linkedin.com/feed/"

// Criar post
mcp__playwright__browser_click ref="[start-post-button]"
mcp__playwright__browser_type ref="[post-textarea]" text="[CONTEUDO]"
mcp__playwright__browser_click ref="[post-button]"
```

---

## Reddit (PRÓXIMO A IMPLEMENTAR)

### Frequência
- **1 post por app** (no lançamento)
- **Engajar em comentários**

### Por que Reddit?
- Comunidade técnica engajada
- Feedback valioso
- Pode viralizar se bem feito

### Subreddits Relevantes

| Subreddit | Tipo | Regras |
|-----------|------|--------|
| r/SideProject | Launch | Self-promo OK, ser genuíno |
| r/webdev | Technical | Mostrar código/stack |
| r/reactjs | Technical | Foco em React |
| r/indiehackers | Business | Journey, não só produto |
| r/startups | Business | Feedback request |
| r/EntrepreneurRideAlong | Journey | Build in public |
| r/freelance | Niche | Para PropostaAI, FocusFlow |

### Template Reddit
```markdown
**Título:** Fiz um app que [resolve problema] - buscando feedback

Oi pessoal!

Eu estava [contexto do problema - ser pessoal] e decidi criar [App].

**O que faz:**
- [Feature 1 - detalhar]
- [Feature 2 - detalhar]
- [Feature 3 - detalhar]

**Stack:**
- Next.js 15 (App Router)
- Tailwind CSS
- [Outras tecnologias relevantes]

**Decisões técnicas interessantes:**
- [Por que escolhi X]
- [Desafio e como resolvi]

Link: [URL]

Adoraria feedback! Especificamente:
1. A UX está clara?
2. O que está faltando?
3. Vocês usariam?

Obrigado! 🙏
```

### Regras Importantes
- ❌ NUNCA fazer spam
- ❌ NUNCA postar o mesmo conteúdo em múltiplos subs
- ✅ Ser genuíno e responder TODOS os comentários
- ✅ Agradecer feedback negativo
- ✅ Implementar sugestões e voltar para atualizar

---

## Instagram (FUTURO)

### Frequência
- **2-3 posts por semana**
- **Stories diários**

### Por que Instagram?
- Público mais amplo
- Visual-first (bom para demos)
- Stories = engagement

### Tipos de Conteúdo

1. **Carrossel de Features**
   - Slide 1: Problema (hook)
   - Slides 2-4: Features do app
   - Slide final: CTA

2. **Reels de Demo**
   - 15-30 segundos
   - Gravação de tela
   - Música trending

3. **Stories**
   - Bastidores do desenvolvimento
   - Métricas (views, users)
   - Polls e Q&A

### Template Carrossel
```
Slide 1: "Cansado de [problema]? 😩"
Slide 2: "Apresento [App] ✨"
Slide 3: "Feature 1: [descrição]"
Slide 4: "Feature 2: [descrição]"
Slide 5: "Feature 3: [descrição]"
Slide 6: "Grátis. Sem cadastro. Link na bio 🔗"
```

---

## TikTok (FUTURO)

### Frequência
- **Quando tiver conteúdo viral**
- **2-3 por semana se ativo**

### Por que TikTok?
- Potencial de viralização massivo
- Público jovem e tech-curious
- Algoritmo favorece conteúdo novo

### Tipos de Conteúdo

1. **Problem-Solution**
   ```
   Hook (0-3s): "POV: Você precisa fazer [tarefa chata]"
   Demo (3-15s): [Gravação de tela resolvendo]
   CTA (15-20s): "Link na bio!"
   ```

2. **Build in Public**
   ```
   Hook: "Dia [X] construindo um app..."
   Conteúdo: [Mostrar código, decisões, métricas]
   ```

3. **Tech Humor**
   ```
   Hook: "[Situação relatável para devs]"
   Punch: [Mostrar como o app resolve]
   ```

---

## Product Hunt (POR APP)

### Quando usar
- **1 vez por app** (no lançamento oficial)
- Preparar com antecedência

### Checklist Product Hunt

**1 semana antes:**
- [ ] Criar conta (se não tiver)
- [ ] Preparar assets (logo, screenshots)
- [ ] Escrever descrição
- [ ] Preparar first comment

**No dia:**
- [ ] Lançar às 00:01 PST (para ter o dia inteiro)
- [ ] Compartilhar em todas as redes
- [ ] Responder TODOS os comentários
- [ ] Engajar com outros produtos

### Template Product Hunt

**Tagline (60 chars):**
```
[Ação] em [tempo] com [diferencial]
```

**Description:**
```
[App] helps [quem] [fazer o quê] [como].

✨ Features:
- [Feature 1]
- [Feature 2]
- [Feature 3]

🚀 Built with: Next.js, Tailwind CSS, AI

💡 Why I built this:
[1 parágrafo sobre a motivação]

🙏 Would love your feedback!
```

---

## Hacker News (SELETIVO)

### Quando usar
- Apps técnicos/inovadores
- Build in public stories
- Open source projects

### Template Show HN
```
Show HN: [App Name] – [Descrição em 1 linha]

[1-2 parágrafos sobre o que faz e por quê]

Tech stack: [lista]

Link: [URL]

Repo (se open source): [GitHub]

Would appreciate any feedback!
```

### Regras
- ❌ Marketing speak
- ✅ Técnico e direto
- ✅ Explicar decisões
- ✅ Ser humilde

---

## Plano de Implementação

### Fase 1 (Esta Semana)
- [x] X/Twitter automatizado
- [ ] LinkedIn - configurar automação Playwright
- [ ] Reddit - primeiro post de app

### Fase 2 (Próximas 2 Semanas)
- [ ] Instagram - criar conta business
- [ ] Product Hunt - preparar primeiro launch
- [ ] Templates padronizados para cada rede

### Fase 3 (Mês que vem)
- [ ] TikTok - testar conteúdo
- [ ] Automação cross-posting
- [ ] Analytics unificado

---

## Calendário Semanal Sugerido

| Dia | X/Twitter | LinkedIn | Reddit | Instagram |
|-----|-----------|----------|--------|-----------|
| Seg | 3 posts | 1 post | - | 1 carrossel |
| Ter | 3 posts | - | - | Stories |
| Qua | 3 posts | - | 1 post | 1 reel |
| Qui | 3 posts | 1 post | - | Stories |
| Sex | 3 posts | - | - | 1 carrossel |
| Sab | 1 post | - | - | Stories |
| Dom | 1 post | - | - | - |

---

## Métricas a Acompanhar

| Rede | Métrica Principal | Meta Semanal |
|------|-------------------|--------------|
| X/Twitter | Impressions | 10k |
| LinkedIn | Views | 5k |
| Reddit | Upvotes | 50 |
| Instagram | Reach | 2k |
| Product Hunt | Upvotes | 100 |

---

*Guide version: 1.0*
*Last updated: 2026-01-31*
