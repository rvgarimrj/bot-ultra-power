# API de Targeting Dinamico - Documentacao

## Visao Geral

A API de Targeting expoe dados de publico-alvo, keywords, search queries e contas Twitter dos apps ativos (ultimos 7 dias), permitindo que sistemas externos (como Bot-X-Reply) facam marketing direcionado automaticamente.

**Automatico:** A API sincroniza automaticamente com todos os apps do sistema. Quando um novo app e deployado e adicionado ao banco de dados (via SYNC ou POST), ele aparece automaticamente na API.

---

## Endpoint Principal

```
GET https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting
    ?secret=garimdreaming-stats-2026
```

### Autenticacao

| Parametro | Valor |
|-----------|-------|
| `secret` | `garimdreaming-stats-2026` |

---

## Response Schema

```typescript
interface TargetingResponse {
  success: boolean;
  timestamp: string; // ISO 8601
  activeTargeting: AppTargeting[];
  expiredApps: ExpiredApp[];
  meta: {
    activeCount: number;
    expiredCount: number;
    ttlDays: number;      // 7
    cacheSeconds: number; // 300
    features: {
      urgencyScore: string;
      searchQueries: string;
      twitterAccounts: string;
      feedbackEndpoint: string;
      webhookEndpoint: string;
    };
  };
}

interface AppTargeting {
  appName: string;        // "GestaoMEI"
  appSlug: string;        // "gestao-mei"
  appUrl: string;         // URL direto do app
  portfolioUrl: string;   // URL do portfolio (usar nos replies)
  launchDate: string;     // "2026-02-02"
  expiresAt: string;      // "2026-02-09"
  daysActive: number;     // 0-7
  score: number;          // 0-100
  urgencyScore: number;   // NEW: 0-100 (higher = more urgent)

  targetAudience: {
    description: string;  // "MEIs brasileiros"
    quantity: string;     // "12.9M"
    demographics: string; // "18-65 anos, autonomos"
    painPoint: string;    // "Obrigatoriedade NF-e 2027"
  };

  keywords: {
    'pt-BR': LocaleKeywords;
    'en-US': LocaleKeywords;
    'es': LocaleKeywords;
  };

  // NEW: Optimized Twitter search queries
  searchQueries: {
    'pt-BR': string[];    // ["MEI nota fiscal", "microempreendedor DAS", ...]
    'en-US': string[];    // ["small business invoice", ...]
    'es': string[];       // ["microemprendedor factura", ...]
  };

  // NEW: Relevant Twitter accounts for this app category
  twitterAccounts: string[];  // ["@sebaboredafei", "@meikiobrasil", ...]

  locales: {
    primary: string;      // "pt-BR"
    supported: string[];  // ["pt-BR", "en-US", "es"]
  };
}

interface LocaleKeywords {
  primary: string[];    // ["MEI", "nota fiscal"]
  secondary: string[];  // ["autonomo", "DAS"]
  hashtags: string[];   // ["#MEI", "#Empreendedorismo"]
}

interface ExpiredApp {
  appName: string;
  appSlug: string;
  expiredAt: string;
  reason: string; // "7 days exceeded"
}
```

---

## Novos Campos (v2)

### urgencyScore

Score de urgencia para priorizar apps mais recentes no marketing.

**Formula:** `urgencyScore = 100 - (daysActive * 14)`

| daysActive | urgencyScore |
|------------|--------------|
| 0 (hoje) | 100 |
| 1 | 86 |
| 2 | 72 |
| 3 | 58 |
| 4 | 44 |
| 5 | 30 |
| 6 | 16 |
| 7 | 2 |

**Uso:** Priorizar replies para apps com maior urgencyScore.

### searchQueries

Queries otimizadas para busca no Twitter, geradas a partir das keywords primarias e secundarias.

```json
{
  "searchQueries": {
    "pt-BR": [
      "MEI microempreendedor",
      "MEI nota fiscal",
      "microempreendedor DAS",
      "MEI prestador de servico",
      "microempreendedor contador",
      "MEI",
      "microempreendedor",
      "nota fiscal",
      "Empreendedorismo"
    ],
    "en-US": [
      "microentrepreneur small business",
      "microentrepreneur invoice",
      "small business self-employed",
      "microentrepreneur freelancer tax",
      "small business tax filing",
      "microentrepreneur",
      "small business",
      "invoice",
      "SmallBusiness"
    ],
    "es": [...]
  }
}
```

### twitterAccounts

Contas do Twitter relevantes para cada categoria de app.

| Categoria | Contas |
|-----------|--------|
| fintech-mei | @sebaboredafei, @meikiobrasil, @ContabilidadeME, @MEIBrasil_ |
| productivity | @ProductivityPro, @Focusmate, @RescueTime, @TodoistOfficial |
| content-creation | @vidloapp, @capcutapp, @YTCreators, @ContentCreatorBR |
| ai-tools | @OpenAI, @AnthropicAI, @TecMundo, @AIToolsDaily |
| education | @WikipediaBR, @TED, @Kurzgesagt, @Superinteressante |
| business-tools | @endeavorbrasil, @StartupsDaily, @salesforce, @hubspot |

---

## Exemplo de Response

```json
{
  "success": true,
  "timestamp": "2026-02-03T01:47:26.137Z",
  "activeTargeting": [
    {
      "appName": "GestaoMEI",
      "appSlug": "gestao-mei",
      "appUrl": "https://gestaomei-production.up.railway.app",
      "portfolioUrl": "https://gabrielabiramia-portfolio-production.up.railway.app/pt-BR",
      "launchDate": "2026-02-02",
      "expiresAt": "2026-02-09",
      "daysActive": 1,
      "score": 90,
      "urgencyScore": 86,
      "qaStatus": "PASS",
      "targetAudience": {
        "quantity": "12.9M",
        "painPoint": "Obrigatoriedade NF-e 2027",
        "description": "MEIs brasileiros",
        "demographics": "18-65 anos, autonomos"
      },
      "keywords": {
        "pt-BR": {
          "primary": ["MEI", "microempreendedor", "nota fiscal", "DAS"],
          "secondary": ["prestador de servico", "contador", "declaracao anual"],
          "hashtags": ["#MEI", "#Empreendedorismo", "#PequenoNegocio"]
        },
        "en-US": {...},
        "es": {...}
      },
      "searchQueries": {
        "pt-BR": ["MEI microempreendedor", "MEI nota fiscal", "microempreendedor DAS", ...],
        "en-US": ["microentrepreneur small business", "small business invoice", ...],
        "es": ["microemprendedor autonomo", "microemprendedor factura electronica", ...]
      },
      "twitterAccounts": [
        "@sebaboredafei",
        "@meikiobrasil",
        "@ContabilidadeME",
        "@seaboredafei",
        "@ContadorPJ",
        "@MEIBrasil_",
        "@PortalMEI"
      ],
      "locales": {
        "primary": "pt-BR",
        "supported": ["pt-BR", "en-US", "es"]
      }
    }
  ],
  "expiredApps": [],
  "meta": {
    "activeCount": 1,
    "expiredCount": 0,
    "ttlDays": 7,
    "cacheSeconds": 300,
    "features": {
      "urgencyScore": "Formula: 100 - (daysActive * 14). Day 0 = 100, Day 7 = 2",
      "searchQueries": "Optimized Twitter search queries per locale",
      "twitterAccounts": "Relevant accounts for targeted engagement",
      "feedbackEndpoint": "/api/targeting/feedback",
      "webhookEndpoint": "/api/targeting/webhook"
    }
  }
}
```

---

## Endpoints Adicionais

### POST /api/targeting - Atualizar Targeting de um App

```bash
curl -X POST "https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting?secret=garimdreaming-stats-2026" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "gestao-mei",
    "targetAudience": {
      "description": "MEIs brasileiros",
      "quantity": "12.9M",
      "demographics": "18-65 anos",
      "painPoint": "Obrigatoriedade NF-e 2027"
    },
    "keywords": {
      "pt-BR": { "primary": ["MEI"], "secondary": ["autonomo"], "hashtags": ["#MEI"] },
      "en-US": { "primary": ["microentrepreneur"], "secondary": ["self-employed"], "hashtags": ["#SmallBusiness"] },
      "es": { "primary": ["microemprendedor"], "secondary": ["autonomo"], "hashtags": ["#Emprendedor"] }
    }
  }'
```

### PUT /api/targeting - Bulk Update

```bash
curl -X PUT "https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting?secret=garimdreaming-stats-2026" \
  -H "Content-Type: application/json" \
  -d '{
    "apps": [
      { "slug": "app1", "targetAudience": {...}, "keywords": {...} },
      { "slug": "app2", "targetAudience": {...}, "keywords": {...} }
    ]
  }'
```

---

## POST /api/targeting/feedback - Feedback de Interacoes

Registra feedback sobre interacoes para aprendizado e otimizacao.

### Request

```bash
curl -X POST "https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting/feedback?secret=garimdreaming-stats-2026" \
  -H "Content-Type: application/json" \
  -d '{
    "appSlug": "gestao-mei",
    "tweetId": "1234567890123456789",
    "action": "replied",
    "reason": "High engagement potential",
    "locale": "pt-BR",
    "searchQuery": "MEI nota fiscal",
    "metadata": {
      "followerCount": 5000,
      "sentiment": "positive"
    }
  }'
```

### Body Schema

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| appSlug | string | Sim | Slug do app promovido |
| tweetId | string | Sim | ID do tweet no Twitter |
| action | string | Sim | Acao: `replied`, `liked`, `skipped`, `blocked`, `reported` |
| reason | string | Nao | Motivo da acao |
| locale | string | Nao | Locale usado (pt-BR, en-US, es) |
| searchQuery | string | Nao | Query que encontrou o tweet |
| metadata | object | Nao | Dados adicionais |

### Response

```json
{
  "success": true,
  "message": "Feedback recorded: replied for gestao-mei",
  "data": {
    "appSlug": "gestao-mei",
    "tweetId": "1234567890123456789",
    "action": "replied",
    "timestamp": "2026-02-03T15:30:00.000Z"
  }
}
```

### GET /api/targeting/feedback - Estatisticas de Feedback

```bash
# Todos os feedbacks dos ultimos 7 dias
curl "https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting/feedback?secret=garimdreaming-stats-2026"

# Filtrar por app
curl "https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting/feedback?secret=garimdreaming-stats-2026&appSlug=gestao-mei"

# Filtrar por acao
curl "https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting/feedback?secret=garimdreaming-stats-2026&action=replied"

# Ultimos 30 dias
curl "https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting/feedback?secret=garimdreaming-stats-2026&days=30"
```

### Response

```json
{
  "success": true,
  "stats": {
    "total": 150,
    "byAction": {
      "replied": 80,
      "liked": 45,
      "skipped": 20,
      "blocked": 5
    },
    "byApp": {
      "gestao-mei": 50,
      "wikiscroll": 40,
      "focusflow": 60
    },
    "byLocale": {
      "pt-BR": 90,
      "en-US": 40,
      "es": 20
    }
  },
  "recent": [
    {
      "appSlug": "gestao-mei",
      "tweetId": "1234567890123456789",
      "action": "replied",
      "reason": "High engagement",
      "locale": "pt-BR",
      "createdAt": "2026-02-03T15:30:00.000Z"
    }
  ]
}
```

---

## POST /api/targeting/webhook - Registrar Webhook

Registra um webhook para receber notificacoes de novos apps.

### Request

```bash
curl -X POST "https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting/webhook?secret=garimdreaming-stats-2026" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://bot-x-reply.example.com/webhook",
    "events": ["app.launched", "targeting.expired"],
    "secret": "my-webhook-secret",
    "name": "Bot-X-Reply Production"
  }'
```

### Body Schema

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| url | string | Sim | URL do webhook |
| events | string[] | Sim | Eventos: `app.launched`, `app.updated`, `targeting.expired`, `all` |
| secret | string | Nao | Secret para assinatura HMAC |
| name | string | Nao | Nome amigavel |
| metadata | object | Nao | Dados adicionais |

### Response

```json
{
  "success": true,
  "message": "Webhook registered successfully",
  "data": {
    "id": 1,
    "url": "https://bot-x-reply.example.com/webhook",
    "events": ["app.launched", "targeting.expired"],
    "name": "Bot-X-Reply Production",
    "isActive": true,
    "createdAt": "2026-02-03T15:30:00.000Z"
  }
}
```

### Webhook Payload

Quando um evento ocorre, o webhook recebe:

```json
{
  "event": "app.launched",
  "timestamp": "2026-02-03T15:30:00.000Z",
  "data": {
    "appName": "GestaoMEI",
    "appSlug": "gestao-mei",
    "appUrl": "https://gestaomei-production.up.railway.app",
    "urgencyScore": 100,
    "searchQueries": {...},
    "twitterAccounts": [...]
  }
}
```

### Headers

| Header | Descricao |
|--------|-----------|
| Content-Type | application/json |
| X-Garimdreaming-Event | Tipo do evento (app.launched, etc) |
| X-Garimdreaming-Signature | HMAC SHA256 (se secret configurado) |

### GET /api/targeting/webhook - Listar Webhooks

```bash
curl "https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting/webhook?secret=garimdreaming-stats-2026"
```

### DELETE /api/targeting/webhook - Remover Webhook

```bash
# Por URL
curl -X DELETE "https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting/webhook?secret=garimdreaming-stats-2026&url=https://example.com/webhook"

# Por ID
curl -X DELETE "https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting/webhook?secret=garimdreaming-stats-2026&id=1"
```

### PATCH /api/targeting/webhook - Ativar/Desativar Webhook

```bash
curl -X PATCH "https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting/webhook?secret=garimdreaming-stats-2026" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/webhook",
    "isActive": false
  }'
```

---

## Integracao com Bot-X-Reply

### Exemplo de Codigo Completo

```typescript
// ========================================
// BOT-X-REPLY - Integracao com Targeting v2
// ========================================

const TARGETING_API = 'https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting';
const TARGETING_SECRET = 'garimdreaming-stats-2026';

interface AppTargeting {
  appSlug: string;
  urgencyScore: number;
  searchQueries: { [locale: string]: string[] };
  twitterAccounts: string[];
  portfolioUrl: string;
}

// Sync targeting data every 6 hours
async function syncTargetingData(): Promise<AppTargeting[]> {
  const response = await fetch(`${TARGETING_API}?secret=${TARGETING_SECRET}`);
  const data = await response.json();

  if (!data.success) return [];

  // Sort by urgencyScore (already done by API, but verify)
  return data.activeTargeting.sort((a, b) => b.urgencyScore - a.urgencyScore);
}

// Get search queries for a locale
function getSearchQueries(apps: AppTargeting[], locale: string): string[] {
  return apps.flatMap(app => app.searchQueries[locale] || []);
}

// Get accounts to monitor
function getTwitterAccounts(apps: AppTargeting[]): string[] {
  const accounts = new Set<string>();
  apps.forEach(app => app.twitterAccounts.forEach(acc => accounts.add(acc)));
  return [...accounts];
}

// Record feedback after interaction
async function recordFeedback(
  appSlug: string,
  tweetId: string,
  action: 'replied' | 'liked' | 'skipped',
  locale: string,
  searchQuery?: string
): Promise<void> {
  await fetch(`${TARGETING_API}/feedback?secret=${TARGETING_SECRET}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      appSlug,
      tweetId,
      action,
      locale,
      searchQuery
    })
  });
}

// Register webhook for real-time notifications
async function registerWebhook(webhookUrl: string): Promise<void> {
  await fetch(`${TARGETING_API}/webhook?secret=${TARGETING_SECRET}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: webhookUrl,
      events: ['app.launched', 'targeting.expired'],
      name: 'Bot-X-Reply'
    })
  });
}

// Main loop example
async function main() {
  // Register webhook for instant notifications
  await registerWebhook('https://my-bot.example.com/webhook');

  // Sync targeting data
  const apps = await syncTargetingData();

  // Get search queries for Portuguese
  const queries = getSearchQueries(apps, 'pt-BR');
  console.log('Search queries:', queries);

  // Get accounts to monitor
  const accounts = getTwitterAccounts(apps);
  console.log('Accounts to monitor:', accounts);

  // After replying to a tweet
  await recordFeedback('gestao-mei', '1234567890', 'replied', 'pt-BR', 'MEI nota fiscal');
}
```

---

## Logica de Expiracao

- **TTL:** 7 dias a partir do `launchDate`
- **Calculo:** `expiresAt = launchDate + 7 dias`
- **Verificacao:** Apps com `daysActive > 7` nao aparecem em `activeTargeting`

---

## Categorias de Keywords Disponiveis

| Categoria | Slug Pattern | Keywords Exemplo | Twitter Accounts |
|-----------|--------------|------------------|------------------|
| Fintech MEI | `gestao-mei`, `gestaomei` | MEI, nota fiscal, DAS | @sebaboredafei, @meikiobrasil |
| Produtividade | `focusflow` | foco, TDAH, gestao do tempo | @ProductivityPro, @Focusmate |
| Content Creation | `clipgenius`, `cliptoall` | video, TikTok, viral | @YTCreators, @capcutapp |
| AI Tools | `brandpulse-ai` | IA, automacao, ChatGPT | @OpenAI, @AnthropicAI |
| Educacao | `wikiscroll` | educacao, conhecimento | @WikipediaBR, @TED |
| Business Tools | `propostaai` | proposta, freelancer | @endeavorbrasil, @hubspot |

---

## Testes

```bash
# GET - Buscar apps ativos com novos campos
curl -s "https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting?secret=garimdreaming-stats-2026" | jq '.activeTargeting[0] | {appName, urgencyScore, searchQueries, twitterAccounts}'

# Verificar urgencyScore
curl -s "https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting?secret=garimdreaming-stats-2026" | jq '[.activeTargeting[] | {appName, daysActive, urgencyScore}]'

# Extrair todas as search queries (pt-BR)
curl -s "https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting?secret=garimdreaming-stats-2026" | jq '[.activeTargeting[].searchQueries["pt-BR"]] | flatten | unique'

# Extrair todas as contas Twitter
curl -s "https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting?secret=garimdreaming-stats-2026" | jq '[.activeTargeting[].twitterAccounts] | flatten | unique'

# Enviar feedback
curl -X POST "https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting/feedback?secret=garimdreaming-stats-2026" \
  -H "Content-Type: application/json" \
  -d '{"appSlug":"gestao-mei","tweetId":"123","action":"replied","locale":"pt-BR"}'

# Ver estatisticas de feedback
curl -s "https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting/feedback?secret=garimdreaming-stats-2026" | jq '.stats'

# Registrar webhook
curl -X POST "https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting/webhook?secret=garimdreaming-stats-2026" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/webhook","events":["app.launched"],"name":"Test"}'

# Listar webhooks
curl -s "https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting/webhook?secret=garimdreaming-stats-2026" | jq '.webhooks'
```

---

## Frequencia Recomendada

| Operacao | Frequencia |
|----------|------------|
| Sync targeting | A cada 6 horas |
| Record feedback | Apos cada interacao |
| Cache da API | 5 minutos |
| TTL das keywords | 7 dias (expira automaticamente) |

---

## Changelog

- **2026-02-03:** v2 - Adicionado urgencyScore, searchQueries, twitterAccounts
- **2026-02-03:** v2 - Novo endpoint POST /api/targeting/feedback
- **2026-02-03:** v2 - Novo endpoint POST /api/targeting/webhook
- **2026-02-03:** v1 - API criada com GET/POST/PUT
