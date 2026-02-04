# Checklist Pos-Deploy OBRIGATORIO

> Este checklist DEVE ser executado APOS cada deploy bem-sucedido.
> O daemon DEVE seguir estes passos na ordem.

---

## 1. VERIFICAR DEPLOY

```bash
# Verificar se app esta online
curl -s -o /dev/null -w "%{http_code}" https://[app]-production.up.railway.app

# Esperado: 200
# Se 404 ou 500: PARAR e investigar
```

---

## 2. VERIFICAR API DE STATS

```bash
# Testar endpoint de estatisticas
curl "https://[app]-production.up.railway.app/api/stats?secret=garimdreaming-stats-2026&format=json"

# Esperado: JSON com totalViews, weekViews, todayViews
# Se erro: verificar se /api/stats/route.ts existe
```

---

## 3. ADICIONAR AO DASHBOARD (CRITICO!)

```bash
# OBRIGATORIO apos cada deploy de app novo
curl -X POST "https://gabrielabiramia-dashboard-production.up.railway.app/api/apps" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "[Nome do App]",
    "slug": "[slug-do-app]",
    "url": "https://[app]-production.up.railway.app",
    "description": "[Descricao em ingles]",
    "score": 85
  }'

# Esperado: {"success":true,"app":{...}}
```

### Regras de Naming

| Campo | Formato | Exemplo |
|-------|---------|---------|
| name | PascalCase ou Titulo | GestaoMEI, FocusFlow |
| slug | lowercase-com-hifens | gestao-mei, focus-flow |
| url | URL completa do Railway | https://gestaomei-production.up.railway.app |
| description | Ingles, max 100 chars | Complete management system for Brazilian microentrepreneurs |
| score | 80-90 para novos apps | 85 |

---

## 4. SINCRONIZAR DASHBOARD

```bash
# OBRIGATORIO apos adicionar app
curl "https://gabrielabiramia-dashboard-production.up.railway.app/api/sync?secret=garimdreaming-stats-2026"

# Esperado: {"message":"Synced X apps..."}
```

---

## 4.5 ALIMENTAR API DE TARGETING (CRITICO!)

A API de Targeting alimenta o Bot-X-Reply com keywords, contas do X e queries de busca.

```bash
# OBRIGATORIO para cada app novo
curl -X POST "https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting?secret=garimdreaming-stats-2026" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "[app-slug]",
    "targetAudience": {
      "description": "[Quem e o publico-alvo em 1 frase]",
      "quantity": "[Tamanho do mercado]",
      "demographics": "[Idade, profissao, interesses]",
      "painPoint": "[Qual dor o app resolve]"
    }
  }'

# Esperado: {"success":true,"message":"Updated targeting for [slug]",...}
```

### Categorias Automaticas (keywords geradas pelo sistema)

| Slug | Categoria | Keywords Automaticas |
|------|-----------|---------------------|
| gestaomei | fintech-mei | MEI, microempreendedor, DAS, CNPJ |
| focusflow | productivity | produtividade, foco, TDAH, gestao do tempo |
| clipgenius, cliptoall, contentatomizer | content-creation | criador de conteudo, video, redes sociais |
| brandpulse-ai | ai-tools | inteligencia artificial, IA, automacao |
| wikiscroll | education | educacao, aprendizado, curiosidades |
| propostaai | business-tools | negocios, proposta comercial, freelancer |

### Contas do X Geradas por Categoria

O sistema gera automaticamente contas do X relevantes para engagement:
- **fintech-mei**: @sebaboredafei, @meikiobrasil, @ContabilidadeME...
- **productivity**: @ProductivityPro, @Focusmate, @tdahbrasil...
- **content-creation**: @vidloapp, @capcutapp, @YTCreators...
- **ai-tools**: @OpenAI, @AnthropicAI, @AIToolsDaily...
- **education**: @WikipediaBR, @TED, @Kurzgesagt...
- **business-tools**: @endeavorbrasil, @FreelancersBR...

### Verificar Targeting Ativo

```bash
curl -s "https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting?secret=garimdreaming-stats-2026" | jq '.activeTargeting[] | {appName, urgencyScore, twitterAccounts}'
```

---

## 5. ADICIONAR AO PORTFOLIO

```bash
# OBRIGATORIO apos adicionar ao dashboard
curl -X POST "https://gabrielabiramia-portfolio-production.up.railway.app/api/add-app" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer garimdreaming-portfolio-2026" \
  -d '{
    "key": "[slug]",
    "icon": "Rocket",
    "color": "from-indigo-500 to-blue-600",
    "name": {
      "pt-BR": "[Nome PT]",
      "en-US": "[Nome EN]",
      "es": "[Nome ES]"
    },
    "description": {
      "pt-BR": "[Descricao PT]",
      "en-US": "[Descricao EN]",
      "es": "[Descricao ES]"
    },
    "url": "https://[app]-production.up.railway.app",
    "features": ["feature1", "feature2", "feature3"],
    "stack": ["Next.js", "TypeScript", "Tailwind"]
  }'
```

---

## 6. SUBMETER SITEMAP NO GSC

```bash
# Se GSC estiver logado
# Navegar para: https://search.google.com/search-console
# Adicionar: https://[app]-production.up.railway.app/sitemap.xml

# Se nao estiver logado: anotar para fazer manualmente depois
```

---

## 7. VERIFICAR WIDGETS

### Screenshot Visual
```bash
# Playwright: Verificar DonationWidget e FeedbackWidget
mcp__playwright__browser_navigate url=https://[app]-production.up.railway.app
mcp__playwright__browser_take_screenshot filename=[app]-widgets-check.png

# VERIFICAR:
# - DonationWidget visivel (nao colapsado)
# - FeedbackWidget no footer
# - Textos legiveis
```

### Teste de Feedback
```bash
# Testar se API de feedback funciona
curl -X POST "https://[app]-production.up.railway.app/api/feedback" \
  -H "Content-Type: application/json" \
  -d '{"rating":5,"comment":"Test feedback"}'

# Esperado: {"success":true}
```

---

## 8. CRIAR GATE DE DEPLOY

```bash
# Criar arquivo de gate
cat > ~/agent-projects/gates/$(date +%Y-%m-%d)-deploy-[app].json << 'EOF'
{
  "date": "$(date +%Y-%m-%d)",
  "phase": "deploy",
  "passed": true,
  "timestamp": "$(date -Iseconds)",
  "app": {
    "name": "[App Name]",
    "slug": "[app-slug]",
    "url": "https://[app]-production.up.railway.app",
    "dashboard": true,
    "portfolio": true,
    "widgets": true
  }
}
EOF
```

---

## RESUMO RAPIDO

```bash
# Apos deploy bem-sucedido, executar NESTA ORDEM:

# 1. Verificar online
curl -I https://[app]-production.up.railway.app

# 2. Adicionar ao dashboard
curl -X POST "https://gabrielabiramia-dashboard-production.up.railway.app/api/apps" \
  -H "Content-Type: application/json" \
  -d '{"name":"[Name]","slug":"[slug]","url":"https://[app]-production.up.railway.app","description":"[desc]","score":85}'

# 3. Sync dashboard
curl "https://gabrielabiramia-dashboard-production.up.railway.app/api/sync?secret=garimdreaming-stats-2026"

# 4. Alimentar API de Targeting (keywords + contas X)
curl -X POST "https://gabrielabiramia-dashboard-production.up.railway.app/api/targeting?secret=garimdreaming-stats-2026" \
  -H "Content-Type: application/json" \
  -d '{"slug":"[slug]","targetAudience":{"description":"[publico]","quantity":"[mercado]","demographics":"[idade/profissao]","painPoint":"[dor]"}}'

# 5. Adicionar ao portfolio (ver formato completo acima)

# 6. Verificar widgets visualmente
```

---

## POR QUE SEGUIR ESTE CHECKLIST?

1. **Dashboard sem app** = Metricas nao sao rastreadas
2. **Portfolio sem app** = App nao aparece para usuarios
3. **Widgets invisiveis** = Feedback e doacoes perdidas
4. **Gate nao criado** = QA e posts podem ser bloqueados

---

**REGRA:** Se QUALQUER passo falhar, PARAR e reportar imediatamente.

Ultima atualizacao: 2026-02-04
