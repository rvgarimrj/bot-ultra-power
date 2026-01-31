# PRD: [NOME DO PRODUTO]

**Data:** [YYYY-MM-DD]
**Autor:** Claude Agent
**Status:** Draft | Review | Approved | Building | Deployed

---

## 1. Visão Geral

### 1.1 Problema
> [Descreva a dor específica que o produto resolve. Seja concreto.]

**Quem sofre:** [Perfil do usuário - ex: freelancers que precisam criar propostas]
**Frequência:** [Com que frequência enfrentam esse problema - ex: toda semana]
**Impacto:** [Quanto custa não resolver - ex: 3-8 horas perdidas por proposta]

### 1.2 Solução
> [1 frase que explica o que o produto faz]

**Diferencial:** [O que torna único vs concorrentes]

### 1.3 Mercado
| Métrica | Valor | Fonte |
|---------|-------|-------|
| TAM | $X bilhões | [fonte] |
| Usuários potenciais | X milhões | [fonte] |
| Crescimento | X%/ano | [fonte] |

---

## 2. Requisitos

### 2.1 Funcionalidades MVP (Obrigatórias)

| # | Feature | Descrição | Prioridade |
|---|---------|-----------|------------|
| 1 | [Feature] | [O que faz] | P0 |
| 2 | [Feature] | [O que faz] | P0 |
| 3 | [Feature] | [O que faz] | P0 |

### 2.2 Nice to Have (V2)

| # | Feature | Descrição |
|---|---------|-----------|
| 1 | [Feature] | [O que faz] |
| 2 | [Feature] | [O que faz] |

### 2.3 Fora de Escopo (NÃO fazer)

- [ ] [Algo que NÃO vamos fazer]
- [ ] [Algo que NÃO vamos fazer]

---

## 3. User Flows

### 3.1 Flow Principal
```
1. Usuário acessa landing page
2. Clica no CTA principal
3. [Passo 3]
4. [Passo 4]
5. Recebe resultado/valor
```

### 3.2 Flow de Autenticação (se necessário)
```
1. Clica em "Entrar"
2. Escolhe Google ou Email
3. Redireciona para dashboard
```

---

## 4. Arquitetura Técnica

### 4.1 Stack
| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 15 + Tailwind CSS |
| Backend | Next.js API Routes |
| Database | Neon PostgreSQL + Prisma |
| Auth | Supabase Auth / Stack Auth |
| Deploy | Railway |
| IA | OpenRouter (Claude) |

### 4.2 Schema do Banco

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relações
}

model [Entidade] {
  id        String   @id @default(cuid())
  // campos
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 4.3 API Endpoints

| Method | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/[recurso] | Lista todos |
| POST | /api/[recurso] | Cria novo |
| GET | /api/[recurso]/[id] | Busca um |
| PATCH | /api/[recurso]/[id] | Atualiza |
| DELETE | /api/[recurso]/[id] | Remove |

---

## 5. Design

### 5.1 Estilo Visual
| Elemento | Valor |
|----------|-------|
| Estilo | [Glassmorphism / Minimalist / etc] |
| Cores principais | [#hex1, #hex2, #hex3] |
| Font | [Inter / SF Pro / etc] |
| Modo | Dark / Light / Both |

### 5.2 Páginas
| Página | Rota | Descrição |
|--------|------|-----------|
| Landing | / | Hero + CTA + Features |
| App | /app | Funcionalidade principal |
| Dashboard | /dashboard | Métricas (se auth) |

### 5.3 Componentes Principais
- [ ] Navbar (floating, glassmorphism)
- [ ] Hero section
- [ ] Feature cards
- [ ] CTA button
- [ ] Footer

---

## 6. SEO & Marketing

### 6.1 Metadata
| Campo | Valor |
|-------|-------|
| Title | [60 chars max] |
| Description | [160 chars max] |
| Keywords | [keyword1, keyword2, keyword3] |

### 6.2 Posts X/Twitter

**PT-BR:**
```
[Pergunta sobre a dor]

[Nome] resolve [problema] em [tempo].

- Feature 1
- Feature 2
- Feature 3

Grátis. Sem cadastro.

[URL]

#FreelancerBR #IA #Produtividade
```

**EN-US:**
```
[Pain point question]

[Name] solves [problem] in [time].

- Feature 1
- Feature 2
- Feature 3

Built with Next.js + AI

[URL]

#AI #IndieHacker #BuildInPublic
```

**ES:**
```
[Pregunta sobre el dolor]

[Nombre] resuelve [problema] en [tiempo].

- Feature 1
- Feature 2
- Feature 3

Gratis. Sin registro.

[URL]

#IA #Freelancer #Productividad
```

---

## 7. Métricas de Sucesso

### 7.1 KPIs
| Métrica | Meta D1 | Meta D7 | Meta D30 |
|---------|---------|---------|----------|
| Page Views | 50 | 200 | 1000 |
| Unique Visitors | 30 | 100 | 500 |
| Conversões | 5 | 20 | 100 |
| Tempo no site | 2min | 3min | 4min |

### 7.2 Tracking Obrigatório
- [ ] /api/track implementado
- [ ] /api/stats implementado
- [ ] Dashboard GarimDreaming atualizado

---

## 8. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| [Risco 1] | Alta/Média/Baixa | Alto/Médio/Baixo | [Como mitigar] |
| [Risco 2] | Alta/Média/Baixa | Alto/Médio/Baixo | [Como mitigar] |

---

## 9. Timeline

| Fase | Horário | Duração | Status |
|------|---------|---------|--------|
| PRD | 07:30-08:00 | 30 min | ⬜ |
| Setup | 08:00-09:00 | 1h | ⬜ |
| Backend | 09:00-12:00 | 3h | ⬜ |
| Frontend | 12:00-17:00 | 5h | ⬜ |
| SEO | 17:00-18:00 | 1h | ⬜ |
| QA | 18:00-20:00 | 2h | ⬜ |
| Deploy | 20:00-21:00 | 1h | ⬜ |
| Report | 21:00-22:00 | 1h | ⬜ |

---

## 10. Checklist Final

### Antes do Build
- [ ] PRD aprovado
- [ ] Schema do banco definido
- [ ] API endpoints listados
- [ ] Design style escolhido
- [ ] Posts de marketing rascunhados

### Antes do Deploy
- [ ] Build passa sem erros
- [ ] Testes manuais OK
- [ ] Mobile responsivo OK
- [ ] API stats funcionando
- [ ] SEO configurado (sitemap, robots, meta)

### Após Deploy
- [ ] URL funcionando
- [ ] GSC sitemap submitted
- [ ] Dashboard atualizado
- [ ] Posts publicados
- [ ] CLAUDE.md atualizado

---

*Template version: 1.0*
*Last updated: 2026-01-31*
