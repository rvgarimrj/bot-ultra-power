# Report & Promote Workflow (21:00 - 22:00)

*Processo para documentar resultados do dia e promover apps nas redes sociais.*

---

## Visão Geral

| Etapa | Tempo | Output |
|-------|-------|--------|
| Coletar Métricas | 15 min | Dados de todos os apps |
| Gerar Report | 15 min | Relatório do dia |
| Criar Posts | 20 min | Posts para redes sociais |
| Publicar | 10 min | Posts publicados |

---

## ETAPA 1: COLETAR MÉTRICAS (21:00 - 21:15)

### 1.1 Buscar Stats de Todos os Apps

```bash
# Sync do dashboard (atualiza todas as métricas)
curl "https://garimdreaming-dashboard-production.up.railway.app/api/sync?secret=garimdreaming-stats-2026"

# Verificar resultado
curl "https://garimdreaming-dashboard-production.up.railway.app/api/apps"
```

### 1.2 Métricas Individuais (se necessário)

```bash
# Template para cada app
curl "[URL_APP]/api/stats?secret=garimdreaming-stats-2026&format=json"
```

### 1.3 Dados a Coletar

| Métrica | Fonte |
|---------|-------|
| Total Views | /api/stats |
| Week Views | /api/stats |
| Today Views | /api/stats |
| Unique Visitors | /api/stats |
| GSC Impressions | Google Search Console |
| GSC Clicks | Google Search Console |

---

## ETAPA 2: GERAR REPORT (21:15 - 21:30)

### 2.1 Template de Report Diário

```markdown
# Report - [YYYY-MM-DD]

## Apps Ativos: [N]

| App | Views Hoje | Views Semana | Trend |
|-----|------------|--------------|-------|
| [App 1] | X | Y | ↑/↓/→ |
| [App 2] | X | Y | ↑/↓/→ |

## Totais
- **Total Views**: [soma]
- **Unique Visitors**: [soma]
- **Melhor App**: [nome] ([X] views)

## Ações do Dia
- [x] [O que foi feito]
- [x] [O que foi feito]

## Próximas Ações
- [ ] [O que fazer amanhã]
- [ ] [O que fazer amanhã]

## Screenshots
- Dashboard: [link/arquivo]
- GSC: [link/arquivo]
```

### 2.2 Salvar Report

```bash
# Criar arquivo de report
echo "[CONTEUDO]" > ~/clawd/reports/[YYYY-MM-DD]-report.md
```

---

## ETAPA 3: CRIAR POSTS (21:30 - 21:50)

### 3.1 Redes Sociais Ativas

| Rede | Tipo de Conteúdo | Frequência |
|------|------------------|------------|
| X/Twitter | Texto + Link | Diário |
| LinkedIn | Artigo/Post | Semanal |
| Reddit | Discussion | Quando relevante |
| Instagram | Stories/Reels | Semanal |
| TikTok | Vídeo curto | Quando viral |

### 3.2 Templates por Rede

#### X/Twitter (280 chars)

**PT-BR:**
```
[Problema em forma de pergunta?]

[App] resolve isso em [tempo].

✅ [Feature 1]
✅ [Feature 2]
✅ [Feature 3]

Grátis. Sem cadastro.

[URL]

#FreelancerBR #IA #Produtividade
```

**EN-US:**
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

**ES:**
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

#### LinkedIn

```markdown
# [Título Profissional]

[Parágrafo sobre o problema - contexto profissional]

[Parágrafo sobre a solução - como ajuda profissionais]

## Funcionalidades:
• [Feature 1]
• [Feature 2]
• [Feature 3]

Experimente grátis: [URL]

#[Hashtag1] #[Hashtag2] #[Hashtag3]
```

#### Reddit

```markdown
**Título:** [Fiz um app que resolve X - feedback?]

Oi pessoal!

Eu estava [contexto do problema] e decidi criar [app].

**O que faz:**
- [Feature 1]
- [Feature 2]
- [Feature 3]

**Stack:**
- Next.js 15
- Tailwind CSS
- [Outras tecnologias]

Link: [URL]

Adoraria feedback! O que vocês acham?
```

Subreddits relevantes:
- r/SideProject
- r/webdev
- r/reactjs
- r/indiehackers
- r/EntrepreneurRideAlong

#### Instagram Stories

```
Slide 1: [Problema - texto grande]
Slide 2: [Solução - screenshot do app]
Slide 3: [Features - bullet points]
Slide 4: [CTA - "Link na bio"]
```

#### TikTok

```
Hook (0-3s): "[Problema chocante]"
Demo (3-15s): [Gravação de tela do app]
CTA (15-20s): "Link na bio!"
```

---

## ETAPA 4: PUBLICAR (21:50 - 22:00)

### 4.1 X/Twitter via Playwright

```javascript
// Navegar para compose
mcp__playwright__browser_navigate url="https://x.com/compose/post"

// Colar texto
mcp__playwright__browser_type ref="[textarea-ref]" text="[POST_CONTENT]"

// Clicar em postar
mcp__playwright__browser_click ref="[post-button-ref]"
```

### 4.2 Outras Redes (Manual ou API)

| Rede | Método |
|------|--------|
| X/Twitter | Playwright (automatizado) |
| LinkedIn | Playwright ou manual |
| Reddit | Playwright ou manual |
| Instagram | Mobile app (manual) |
| TikTok | Mobile app (manual) |

### 4.3 Documentar Posts

```markdown
## Posts Publicados - [DATA]

| Rede | Idioma | Link | Engajamento |
|------|--------|------|-------------|
| X | pt-BR | [url] | [likes/retweets] |
| X | en-US | [url] | [likes/retweets] |
| X | es | [url] | [likes/retweets] |
| LinkedIn | pt-BR | [url] | [reactions] |
| Reddit | en-US | [url] | [upvotes/comments] |
```

---

## Checklist de Saída

Antes de encerrar o dia:

- [ ] Métricas coletadas de todos os apps
- [ ] Report salvo em `~/clawd/reports/[DATA]-report.md`
- [ ] Posts publicados no X (3 idiomas)
- [ ] Posts documentados com links
- [ ] CLAUDE.md atualizado se necessário
- [ ] Próximas ações definidas

---

## Automações Futuras

### Ideias para automatizar:
1. Script que coleta todas as métricas automaticamente
2. Bot que posta no X nos 3 idiomas
3. Gerador de posts para LinkedIn
4. Notificação WhatsApp com resumo do dia
5. Dashboard real-time com WebSocket

### Status:
- [x] Dashboard com sync automático
- [ ] Post automático no X
- [ ] Notificação WhatsApp
- [ ] Report automático

---

*Workflow version: 1.0*
*Last updated: 2026-01-31*
