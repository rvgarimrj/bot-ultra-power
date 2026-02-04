# QA Checklist - Pré-Deploy

**App:** [NOME]
**Data:** [YYYY-MM-DD]
**Testado por:** Claude Agent

---

## 1. Build & Compilação

### 1.1 Build Local
```bash
npm run build
# ou
bun run build
```

| Check | Status | Notas |
|-------|--------|-------|
| [ ] Build completa sem erros | ⬜ | |
| [ ] Sem warnings críticos | ⬜ | |
| [ ] TypeScript sem erros | ⬜ | |
| [ ] Lint passa | ⬜ | |

### 1.2 Dependências
| Check | Status |
|-------|--------|
| [ ] Todas deps instaladas | ⬜ |
| [ ] Sem vulnerabilidades críticas (`npm audit`) | ⬜ |
| [ ] package.json tem scripts corretos | ⬜ |

---

## 2. Funcionalidade Principal

### 2.1 Landing Page
| Check | Status | Notas |
|-------|--------|-------|
| [ ] Página carrega (não 404/500) | ⬜ | |
| [ ] Hero section visível | ⬜ | |
| [ ] CTA principal funciona | ⬜ | |
| [ ] Features section renderiza | ⬜ | |
| [ ] Footer presente | ⬜ | |

### 2.2 Fluxo Principal
| Check | Status | Notas |
|-------|--------|-------|
| [ ] Ação principal funciona | ⬜ | |
| [ ] Resultado é exibido corretamente | ⬜ | |
| [ ] Dados são salvos (se aplicável) | ⬜ | |
| [ ] Feedback visual para usuário | ⬜ | |

### 2.3 Autenticação (se aplicável)
| Check | Status | Notas |
|-------|--------|-------|
| [ ] Login Google funciona | ⬜ | |
| [ ] Login Email funciona | ⬜ | |
| [ ] Logout funciona | ⬜ | |
| [ ] Sessão persiste após refresh | ⬜ | |
| [ ] Rotas protegidas bloqueiam acesso | ⬜ | |

---

## 3. Responsividade

### 3.1 Desktop (1280px+)
| Check | Status |
|-------|--------|
| [ ] Layout correto | ⬜ |
| [ ] Sem overflow horizontal | ⬜ |
| [ ] Imagens não distorcidas | ⬜ |

### 3.2 Tablet (768px)
| Check | Status |
|-------|--------|
| [ ] Layout adapta | ⬜ |
| [ ] Menu funciona | ⬜ |
| [ ] Touch targets adequados | ⬜ |

### 3.3 Mobile (375px)
| Check | Status |
|-------|--------|
| [ ] Layout adapta | ⬜ |
| [ ] Texto legível | ⬜ |
| [ ] Botões clicáveis | ⬜ |
| [ ] Sem overflow horizontal | ⬜ |
| [ ] Menu mobile funciona | ⬜ |

---

## 4. API & Backend

### 4.1 Endpoints
| Endpoint | Method | Status | Response |
|----------|--------|--------|----------|
| /api/[main] | GET/POST | ⬜ | |
| /api/track | POST | ⬜ | |
| /api/stats | GET | ⬜ | |

### 4.2 API Stats (OBRIGATÓRIO)
```bash
curl "[URL]/api/stats?secret=garimdreaming-stats-2026&format=json"
```

| Check | Status | Notas |
|-------|--------|-------|
| [ ] Retorna JSON válido (não HTML 404) | ⬜ | |
| [ ] Campo `totalViews` presente | ⬜ | |
| [ ] Campo `weekViews` presente | ⬜ | |
| [ ] Campo `todayViews` presente | ⬜ | |
| [ ] Campo `uniqueVisitors` presente | ⬜ | |

### 4.3 Segurança
| Check | Status |
|-------|--------|
| [ ] Sem segredos expostos no client | ⬜ |
| [ ] Rate limiting implementado | ⬜ |
| [ ] Input sanitization | ⬜ |
| [ ] CORS configurado | ⬜ |

---

## 5. SEO

### 5.1 Arquivos Obrigatórios
| Arquivo | Existe | Funciona |
|---------|--------|----------|
| app/sitemap.ts | ⬜ | ⬜ |
| app/robots.ts | ⬜ | ⬜ |
| app/layout.tsx (metadata) | ⬜ | ⬜ |

### 5.2 Metadata
| Check | Status | Valor |
|-------|--------|-------|
| [ ] Title presente | ⬜ | |
| [ ] Description presente | ⬜ | |
| [ ] OG Image configurado | ⬜ | |
| [ ] Canonical URL correto | ⬜ | |

### 5.3 URLs Públicas
```bash
curl -I [URL]/sitemap.xml  # Deve retornar 200
curl -I [URL]/robots.txt   # Deve retornar 200
```

| Check | Status |
|-------|--------|
| [ ] /sitemap.xml retorna 200 | ⬜ |
| [ ] /robots.txt retorna 200 | ⬜ |

---

## 6. Performance

### 6.1 Core Web Vitals (target)
| Métrica | Target | Atual | Status |
|---------|--------|-------|--------|
| LCP | < 2.5s | | ⬜ |
| FID | < 100ms | | ⬜ |
| CLS | < 0.1 | | ⬜ |

### 6.2 Assets
| Check | Status |
|-------|--------|
| [ ] Imagens otimizadas (WebP/AVIF) | ⬜ |
| [ ] Lazy loading implementado | ⬜ |
| [ ] Bundle size razoável (< 500KB) | ⬜ |

---

## 7. Acessibilidade & Contraste Visual

### 7.1 Contraste de Texto (CRITICO)
| Check | Status | Como Testar |
|-------|--------|-------------|
| [ ] **Headings visiveis** (h1-h6 usam text-slate-900/dark:text-slate-50) | ⬜ | Inspecionar elementos |
| [ ] **Paragrafos legiveis** (text-slate-700/dark:text-slate-300 minimo) | ⬜ | Visual + DevTools |
| [ ] **Nenhum texto usa text-*-300 ou text-*-400 em fundo claro** | ⬜ | Grep no codigo |
| [ ] **Placeholders visiveis** (text-slate-400 minimo) | ⬜ | Visual em inputs |
| [ ] **Links destacados** (text-blue-600/dark:text-blue-400) | ⬜ | Visual |
| [ ] **Ratio >= 4.5:1** para todo texto normal | ⬜ | Chrome DevTools color picker |

### 7.2 Componentes Obrigatorios (CRITICO)
| Check | Status | Localizacao |
|-------|--------|-------------|
| [ ] **DonationWidget presente** | ⬜ | Hero ou area visivel da pagina |
| [ ] **DonationWidget visivel** (cores contrastantes) | ⬜ | Screenshot |
| [ ] **FeedbackWidget presente** | ⬜ | Footer da pagina |
| [ ] **FeedbackWidget funcional** | ⬜ | Testar envio |
| [ ] **Wallets corretas no DonationWidget** | ⬜ | Verificar enderecos |

### 7.3 Acessibilidade Geral
| Check | Status |
|-------|--------|
| [ ] Alt text em todas imagens | ⬜ |
| [ ] Labels em todos inputs | ⬜ |
| [ ] Navegacao por teclado funciona | ⬜ |
| [ ] Focus states visiveis (outline ou ring) | ⬜ |
| [ ] prefers-reduced-motion respeitado | ⬜ |

### 7.4 Teste Automatizado de Contraste (Playwright)
```bash
# Rodar apos navegacao para URL
# 1. Capturar snapshot
mcp__playwright__browser_snapshot

# 2. Verificar se DonationWidget e FeedbackWidget aparecem no snapshot
# 3. Screenshot para validacao visual
mcp__playwright__browser_take_screenshot filename=[app]-contrast-check.png

# 4. Testar mobile
mcp__playwright__browser_resize width=375 height=667
mcp__playwright__browser_take_screenshot filename=[app]-mobile-check.png
```

### 7.5 Codigo Proibido (Grep Check)
```bash
# Executar no diretorio do app ANTES do build
grep -rn "text-slate-300\|text-gray-300\|text-zinc-300" --include="*.tsx" .
grep -rn "text-slate-400\s" --include="*.tsx" . | grep -v placeholder

# Se encontrar resultados = FALHA
# Acao: Substituir por text-slate-600 ou mais escuro
```

---

## 8. Testes Playwright (Automáticos)

### 8.1 Comandos
```bash
# Navegar para URL
mcp__playwright__browser_navigate url=[URL]

# Capturar snapshot
mcp__playwright__browser_snapshot

# Screenshot
mcp__playwright__browser_take_screenshot filename=[app]-[test].png

# Resize para mobile
mcp__playwright__browser_resize width=375 height=667

# Clicar em elemento
mcp__playwright__browser_click ref=[ref]
```

### 8.2 Screenshots Obrigatórios
| Screenshot | Arquivo | Status |
|------------|---------|--------|
| Homepage Desktop | [app]-homepage.png | ⬜ |
| Homepage Mobile | [app]-mobile.png | ⬜ |
| Após CTA | [app]-cta-result.png | ⬜ |

---

## 9. Ambiente de Produção

### 9.1 Variáveis de Ambiente
| Variável | Configurada |
|----------|-------------|
| DATABASE_URL | ⬜ |
| NEXTAUTH_SECRET (se auth) | ⬜ |
| [outras] | ⬜ |

### 9.2 Railway
| Check | Status |
|-------|--------|
| [ ] Projeto existe | ⬜ |
| [ ] Build passa no Railway | ⬜ |
| [ ] Deploy healthy | ⬜ |
| [ ] URL pública funciona | ⬜ |

---

## 10. Resultado Final

### Resumo
| Categoria | Passou | Total | % |
|-----------|--------|-------|---|
| Build | /4 | 4 | % |
| Funcionalidade | /X | X | % |
| Responsividade | /10 | 10 | % |
| API | /X | X | % |
| SEO | /X | X | % |
| Performance | /X | X | % |
| Acessibilidade | /5 | 5 | % |
| **TOTAL** | /X | X | % |

### Decisão
- [ ] ✅ **APROVADO** - Pode fazer deploy
- [ ] ⚠️ **APROVADO COM RESSALVAS** - Deploy com issues conhecidas
- [ ] ❌ **REPROVADO** - Corrigir antes de deploy

### Issues Encontradas
| # | Issue | Severidade | Status |
|---|-------|------------|--------|
| 1 | | Alta/Média/Baixa | ⬜ |
| 2 | | Alta/Média/Baixa | ⬜ |

### Notas
> [Observações adicionais]

---

*Checklist version: 1.0*
*Last updated: 2026-01-31*
