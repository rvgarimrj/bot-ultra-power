# Product Definition Workflow (07:30 - 08:00)

*Processo para transformar uma ideia em PRD estruturado pronto para build.*

---

## Visão Geral

| Etapa | Tempo | Output |
|-------|-------|--------|
| Análise da Ideia | 5 min | Problema e solução definidos |
| Pesquisa de Mercado | 10 min | TAM, concorrentes, diferencial |
| Definição de Features | 10 min | MVP features listadas |
| Arquitetura | 5 min | Stack e schema definidos |

---

## ETAPA 1: ANÁLISE DA IDEIA (07:30 - 07:35)

### 1.1 Validar a Ideia

```markdown
## Checklist de Validação

1. **Problema é real?**
   - [ ] Pessoas realmente sofrem com isso?
   - [ ] Com que frequência?
   - [ ] Quanto custa não resolver?

2. **Solução é viável?**
   - [ ] É possível fazer em 1 dia?
   - [ ] Requer APIs pagas?
   - [ ] Tem precedente (apps similares)?

3. **Mercado existe?**
   - [ ] Quem são os usuários?
   - [ ] Onde encontrá-los?
   - [ ] Vão compartilhar?
```

### 1.2 Definir One-Liner

```
[Nome] ajuda [quem] a [fazer o quê] [como/diferencial].
```

**Exemplos:**
- PropostaAI ajuda freelancers a criar propostas profissionais em 60 segundos usando IA.
- FocusFlow ajuda trabalhadores remotos a manter foco com sessões guiadas de 25 minutos.
- WikiScroll ajuda curiosos a aprender fatos interessantes enquanto scrollam.

---

## ETAPA 2: PESQUISA DE MERCADO (07:35 - 07:45)

### 2.1 Buscar Dados

```bash
# Usar Firecrawl para pesquisa rápida
mcp__firecrawl__firecrawl_search query="[problema] market size statistics"
mcp__firecrawl__firecrawl_search query="[tipo de app] alternatives competitors"
```

### 2.2 Preencher Tabela de Mercado

| Métrica | Valor | Fonte |
|---------|-------|-------|
| TAM (Total Addressable Market) | $X bilhões | [fonte] |
| Usuários potenciais | X milhões | [fonte] |
| Crescimento anual | X% | [fonte] |

### 2.3 Análise de Concorrentes

| Concorrente | O que faz bem | O que falta |
|-------------|---------------|-------------|
| [Nome 1] | [Pontos fortes] | [Gap que vamos preencher] |
| [Nome 2] | [Pontos fortes] | [Gap que vamos preencher] |

### 2.4 Definir Diferencial

```markdown
## Nosso Diferencial

**Concorrentes fazem:** [O que eles fazem]
**Nós fazemos:** [O que fazemos diferente]
**Por isso somos melhores:** [Razão clara]
```

---

## ETAPA 3: DEFINIÇÃO DE FEATURES (07:45 - 07:55)

### 3.1 Listar Features Candidatas

```markdown
## Brainstorm de Features

1. [Feature óbvia que resolve o problema]
2. [Feature que melhora a experiência]
3. [Feature que incentiva compartilhamento]
4. [Feature avançada]
5. [Feature de monetização]
```

### 3.2 Priorizar com MoSCoW

| Feature | Must | Should | Could | Won't |
|---------|------|--------|-------|-------|
| [Feature 1] | ✅ | | | |
| [Feature 2] | ✅ | | | |
| [Feature 3] | | ✅ | | |
| [Feature 4] | | | ✅ | |
| [Feature 5] | | | | ✅ |

### 3.3 Definir MVP (Máximo 3 Features Must)

```markdown
## MVP Features

1. **[Feature Core]** - [Descrição em 1 linha]
2. **[Feature Core]** - [Descrição em 1 linha]
3. **[Feature Core]** - [Descrição em 1 linha]

## V2 Features (Depois do lançamento)
- [Feature Should 1]
- [Feature Should 2]
```

---

## ETAPA 4: ARQUITETURA (07:55 - 08:00)

### 4.1 Definir Stack

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| Frontend | Next.js 15 + Tailwind | Padrão do studio |
| Backend | Next.js API Routes | Server components |
| Database | Neon PostgreSQL | Serverless, gratuito |
| Auth | Supabase Auth | Se necessário |
| AI | OpenRouter (Claude) | Se necessário |
| Deploy | Railway | Padrão do studio |

### 4.2 Definir Schema Inicial

```prisma
// Modelos mínimos para MVP
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}

model [EntidadePrincipal] {
  id        String   @id @default(cuid())
  // campos específicos do app
  userId    String?
  createdAt DateTime @default(now())
}
```

### 4.3 Definir Endpoints

| Method | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/[recurso] | Listar |
| POST | /api/[recurso] | Criar |
| GET | /api/track | Tracking (obrigatório) |
| GET | /api/stats | Stats (obrigatório) |

---

## OUTPUT: PRD Completo

Ao final de 07:30-08:00, você deve ter:

1. **Arquivo criado:** `docs/prd-[app-name].md`
2. **Preenchido com:**
   - Problema e solução claros
   - Mercado validado com números
   - 3 features MVP definidas
   - Stack e schema prontos
   - Endpoints listados

### Template de PRD

Ver: `.claude/templates/prd-template.md`

---

## Checklist de Saída

Antes de iniciar o Build (08:00), confirme:

- [ ] PRD está em `docs/prd-[app-name].md`
- [ ] Problema está claro e validado
- [ ] Solução está em 1 frase
- [ ] MVP tem máximo 3 features
- [ ] Schema do banco está definido
- [ ] Endpoints estão listados
- [ ] Não há dependências bloqueantes (APIs pagas sem crédito, etc.)

---

*Workflow version: 1.0*
*Last updated: 2026-01-31*
