# QA & Test Workflow (18:00 - 20:00)

*Processo para garantir qualidade antes do deploy em produção.*

---

## Visão Geral

| Etapa | Tempo | Output |
|-------|-------|--------|
| Testes Automatizados | 30 min | Build + Lint + TypeScript |
| Testes Funcionais | 45 min | Features funcionando |
| Testes de Performance | 15 min | Core Web Vitals OK |
| Correções | 30 min | Bugs corrigidos |

---

## ETAPA 1: TESTES AUTOMATIZADOS (18:00 - 18:30)

### 1.1 Build Test

```bash
cd [DIRETORIO_APP]

# Build completo
npm run build
# ou
bun run build

# Resultado esperado: "Build successful" sem erros
```

### 1.2 Lint

```bash
npm run lint
# ou
npx eslint . --ext .ts,.tsx

# Corrigir automaticamente
npm run lint -- --fix
```

### 1.3 TypeScript Check

```bash
npx tsc --noEmit

# Deve passar sem erros
```

### 1.4 Checklist Automatizado

| Check | Comando | Status |
|-------|---------|--------|
| Build | `npm run build` | ⬜ |
| Lint | `npm run lint` | ⬜ |
| TypeScript | `npx tsc --noEmit` | ⬜ |
| Deps | `npm audit` | ⬜ |

---

## ETAPA 2: TESTES FUNCIONAIS (18:30 - 19:15)

### 2.1 Preparar Ambiente Local

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Verificar se está rodando
curl http://localhost:3000
```

### 2.2 Testes via Playwright

```javascript
// 1. Navegar para homepage
mcp__playwright__browser_navigate url="http://localhost:3000"

// 2. Capturar snapshot inicial
mcp__playwright__browser_snapshot

// 3. Capturar screenshot
mcp__playwright__browser_take_screenshot filename="[app]-homepage.png"
```

### 2.3 Testes por Página

#### Homepage / Landing
- [ ] Página carrega (não 404/500)
- [ ] Hero section visível
- [ ] CTA principal visível e clicável
- [ ] Features section renderiza
- [ ] Footer presente

#### Funcionalidade Principal
- [ ] CTA leva à ação correta
- [ ] Form (se houver) aceita input
- [ ] Resultado é exibido
- [ ] Loading states funcionam
- [ ] Error states funcionam

#### API Endpoints
```bash
# Testar endpoint principal
curl -X POST http://localhost:3000/api/[recurso] \
  -H "Content-Type: application/json" \
  -d '{"campo": "valor"}'

# Testar tracking
curl -X POST http://localhost:3000/api/track \
  -H "Content-Type: application/json" \
  -d '{"page": "/", "sessionId": "test"}'

# Testar stats
curl "http://localhost:3000/api/stats?secret=garimdreaming-stats-2026&format=json"
```

### 2.4 Responsividade

```javascript
// Desktop (1280px)
mcp__playwright__browser_resize width=1280 height=800
mcp__playwright__browser_snapshot
mcp__playwright__browser_take_screenshot filename="[app]-desktop.png"

// Tablet (768px)
mcp__playwright__browser_resize width=768 height=1024
mcp__playwright__browser_snapshot
mcp__playwright__browser_take_screenshot filename="[app]-tablet.png"

// Mobile (375px)
mcp__playwright__browser_resize width=375 height=667
mcp__playwright__browser_snapshot
mcp__playwright__browser_take_screenshot filename="[app]-mobile.png"
```

Verificar em cada viewport:
- [ ] Layout adapta corretamente
- [ ] Sem overflow horizontal
- [ ] Texto legível
- [ ] Botões clicáveis (min 44px)
- [ ] Menu mobile funciona

---

## ETAPA 3: TESTES DE PERFORMANCE (19:15 - 19:30)

### 3.1 Core Web Vitals

| Métrica | Target | Como Medir |
|---------|--------|------------|
| LCP | < 2.5s | Lighthouse |
| FID | < 100ms | Lighthouse |
| CLS | < 0.1 | Lighthouse |

### 3.2 Lighthouse via Playwright

```javascript
// Abrir DevTools e rodar Lighthouse
// Ou usar CLI:
npx lighthouse http://localhost:3000 --output json --output-path lighthouse.json
```

### 3.3 Bundle Size

```bash
# Verificar tamanho do bundle
npm run build 2>&1 | grep -E "First Load|○|●"

# Target: First Load < 100kB para páginas principais
```

### 3.4 Imagens

- [ ] Todas usando next/image
- [ ] Formato WebP/AVIF
- [ ] Width e height definidos
- [ ] Alt text presente

---

## ETAPA 4: CORREÇÕES (19:30 - 20:00)

### 4.1 Priorização de Bugs

| Severidade | Descrição | Ação |
|------------|-----------|------|
| Crítico | App não funciona | CORRIGIR ANTES DO DEPLOY |
| Alto | Feature principal quebrada | CORRIGIR ANTES DO DEPLOY |
| Médio | Bug visual, não bloqueante | Corrigir se tempo permitir |
| Baixo | Polish, nice-to-have | V2 |

### 4.2 Fluxo de Correção

```
1. Identificar bug
2. Reproduzir localmente
3. Corrigir código
4. Re-testar feature específica
5. Rodar build novamente
6. Confirmar correção
```

### 4.3 Documentar Bugs Conhecidos

Se não der tempo de corrigir:

```markdown
## Bugs Conhecidos - [APP]

| # | Bug | Severidade | Status |
|---|-----|------------|--------|
| 1 | [Descrição] | Médio | Pendente |
| 2 | [Descrição] | Baixo | V2 |
```

---

## Checklist Final de QA

### Antes de Aprovar para Deploy

**Build & Compilation:**
- [ ] Build completa sem erros
- [ ] Sem warnings críticos
- [ ] TypeScript passa
- [ ] Lint passa

**Funcionalidade:**
- [ ] Landing page carrega
- [ ] CTA principal funciona
- [ ] Feature principal funciona
- [ ] API stats retorna JSON válido

**Responsividade:**
- [ ] Desktop (1280px) OK
- [ ] Tablet (768px) OK
- [ ] Mobile (375px) OK

**Performance:**
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] Bundle size razoável

**SEO:**
- [ ] sitemap.ts existe
- [ ] robots.ts existe
- [ ] Metadata no layout.tsx

---

## Decisão de Deploy

### Critérios de Aprovação

**APROVADO** (pode deployar):
- Todos os checks críticos passam
- Feature principal funciona
- Mobile responsivo

**APROVADO COM RESSALVAS** (deployar com bugs conhecidos):
- Checks críticos passam
- Alguns bugs médios/baixos pendentes
- Documentar bugs antes de deployar

**REPROVADO** (NÃO deployar):
- Build falha
- Feature principal quebrada
- Bugs críticos não corrigidos

---

## Screenshots Obrigatórios

Antes de deployar, ter no mínimo:

1. `[app]-homepage.png` - Desktop
2. `[app]-mobile.png` - Mobile
3. `[app]-cta-result.png` - Após clicar no CTA

Salvar em: `.playwright-mcp/`

---

*Workflow version: 1.0*
*Last updated: 2026-01-31*
