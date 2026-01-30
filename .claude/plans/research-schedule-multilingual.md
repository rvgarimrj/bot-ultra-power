# Research Schedule - Multilingual System

*Daily research cron configuration for the autonomous agent.*

---

## Schedule Overview

| Parameter | Value |
|-----------|-------|
| **Cron Expression** | `0 6 * * *` (06:00 daily) |
| **Total Duration** | 90 minutes (06:00 - 07:30) |
| **Reference** | `/Users/user/clawd/RESEARCH.md` |
| **Agent** | trend-researcher |

---

## Workflow Timeline

### Phase 1: EN Research (06:00 - 06:20) - 20 minutes

**Objective:** Scan English-language sources for global trends and opportunities.

**Queries to Execute:**

```bash
# Dores e Desejos
web_search("I wish there was an app site:twitter.com")
web_search("someone should build site:twitter.com")
web_search("why isn't there an app for site:twitter.com")
web_search("looking for a tool that site:reddit.com")

# Validacao de Mercado
web_search("Product Hunt top products today 2026")
web_search("Show HN site:news.ycombinator.com")
web_search("launched my site:indiehackers.com")
web_search("MRR milestone site:twitter.com indie")

# Problemas Especificos
web_search("hate using site:twitter.com software")
web_search("alternative to site:reddit.com")

# Sinais de Demanda
web_search("would pay for site:twitter.com")
web_search("shut up and take my money site:reddit.com")
```

**Sources to Check:**
- Product Hunt (Top 10 daily)
- Hacker News (Show HN, Ask HN)
- Reddit: r/SideProject, r/startups, r/SaaS
- X/Twitter: #buildinpublic, #indiehackers

**Deliverable:** Top 5 EN opportunities with preliminary scores

---

### Phase 2: PT-BR Research (06:20 - 06:35) - 15 minutes

**Objective:** Scan Portuguese-language sources for Brazilian market opportunities.

**Queries to Execute:**

```bash
# Dores e Desejos
web_search("queria um app que site:twitter.com")
web_search("alguem deveria criar site:twitter.com")
web_search("por que nao existe um app site:twitter.com")
web_search("preciso de um sistema que site:twitter.com")

# Comunidades BR
web_search("site:tabnews.com.br trending")
web_search("site:reddit.com/r/brdev ferramenta")
web_search("site:reddit.com/r/investimentos app")
web_search("startup brasileira site:twitter.com lancou")

# Problemas Locais
web_search("pix integracao problema site:twitter.com")
web_search("nota fiscal automacao site:twitter.com")
web_search("MEI ferramenta site:reddit.com")
```

**Sources to Check:**
- TabNews (trending)
- Reddit: r/brasil, r/brdev, r/investimentos
- X/Twitter BR: #startupbr, #empreendedorismo

**Deliverable:** Top 3 PT-BR opportunities with preliminary scores (+3 market modifier)

---

### Phase 3: ES Research (06:35 - 06:50) - 15 minutes

**Objective:** Scan Spanish-language sources for LATAM market opportunities.

**Queries to Execute:**

```bash
# Dores e Desejos
web_search("ojala existiera una app site:twitter.com")
web_search("alguien deberia crear site:twitter.com")
web_search("necesito una herramienta site:twitter.com")
web_search("busco app para site:twitter.com")

# Comunidades LATAM
web_search("startup latinoamerica site:twitter.com")
web_search("site:reddit.com/r/espanol app")
web_search("emprendedor digital site:twitter.com lanzo")
web_search("herramienta para pymes site:twitter.com")

# Problemas Regionais
web_search("facturacion electronica automatizar site:twitter.com")
web_search("mercado libre integracion site:twitter.com")
```

**Sources to Check:**
- Reddit: r/espanol, r/argentina, r/mexico, r/chile
- X/Twitter ES: #startup, #emprendedor
- Product Hunt (LATAM filter)

**Deliverable:** Top 3 ES opportunities with preliminary scores (+2 market modifier)

---

### Phase 4: Transversal Analysis (06:50 - 07:10) - 20 minutes

**Objective:** Cross-language trends and technology analysis.

**Queries to Execute:**

```bash
# Tendencias de Tecnologia
web_search("AI tool launched 2026")
web_search("GPT wrapper product site:producthunt.com")
web_search("automation no-code site:twitter.com")
web_search("API as a product site:indiehackers.com")

# Cross-reference validation
web_search("[top opportunity] alternative")
web_search("[top opportunity] review")
web_search("[top opportunity] pricing")
```

**Analysis Tasks:**
- Cross-reference same problems across all 3 languages
- Identify recurring themes and patterns
- Apply timing bonus (+2 rising, -2 falling, 0 stable)
- Calculate final scores using formula:
  ```
  SCORE_FINAL = SCORE_BASE + MODIFICADOR_MERCADO + BONUS_TIMING
  ```

**Deliverable:** Unified ranking with cross-language validation

---

### Phase 5: Report Generation (07:10 - 07:30) - 20 minutes

**Objective:** Compile comparative ranking report and select daily product.

**Report Structure:**

```markdown
# Trend Research Report - [DATE]

## RANKING GLOBAL (Top 5)

| Rank | Produto | Mercado | Score Base | Mod | Timing | Final |
|------|---------|---------|------------|-----|--------|-------|
| 1 | ... | ... | ... | ... | ... | ... |

## TOP 3 - INGLES
...

## TOP 3 - PORTUGUES
...

## TOP 3 - ESPANHOL
...

## ESCOLHA DO DIA
[Selected product with justification]

## MVP Scope
[Features to build]

## Market Signals
[Key observations]
```

**Deliverable:** Complete report saved to `/Users/user/AppsCalude/Bot-Ultra-Power/research-reports/[DATE].md`

---

## Scoring Reference

### Base Score (Max: 50)

| Criteria | Question | Weight |
|----------|----------|--------|
| Pain | Is it a real, urgent pain? | 3x (0-10) |
| Willingness to Pay | Would people pay? | 3x (0-10) |
| Buildable | Can build MVP in 1 day? | 2x (0-10) |
| Differentiation | Unique angle? | 1x (0-10) |
| Market Size | Enough users? | 1x (0-10) |

### Market Modifiers

| Market | Modifier | Reason |
|--------|----------|--------|
| EN (Global) | +0 | Baseline, high competition |
| PT-BR | +3 | Less competition, home market |
| ES (LATAM) | +2 | Large market, low saturation |

### Timing Bonus

| Trend | Bonus |
|-------|-------|
| Rising | +2 |
| Stable | +0 |
| Falling | -2 |

**Minimum Score to Pursue:** 25 points

---

## Research Agent Checklist

### Pre-Research
- [ ] Verify `web_search` tool availability
- [ ] Confirm report output directory exists
- [ ] Check previous day's report for continuity

### EN Phase (06:00-06:20)
- [ ] Execute at least 5 EN queries
- [ ] Verify Product Hunt top 10
- [ ] Check Hacker News front page
- [ ] Scan r/SideProject, r/startups
- [ ] Document top 5 EN opportunities

### PT-BR Phase (06:20-06:35)
- [ ] Execute at least 3 PT-BR queries
- [ ] Check TabNews trending
- [ ] Scan r/brdev, r/brasil
- [ ] Check local problems (Pix, NF, MEI)
- [ ] Document top 3 PT-BR opportunities

### ES Phase (06:35-06:50)
- [ ] Execute at least 3 ES queries
- [ ] Scan Reddit LATAM subs
- [ ] Check regional problems (facturacion, MercadoPago)
- [ ] Document top 3 ES opportunities

### Transversal Phase (06:50-07:10)
- [ ] Execute AI/tech trend queries
- [ ] Cross-reference problems across languages
- [ ] Apply market modifiers
- [ ] Apply timing bonuses
- [ ] Compile global ranking

### Report Phase (07:10-07:30)
- [ ] Generate complete report using template
- [ ] Select daily product with justification
- [ ] Define MVP scope (3-5 features)
- [ ] Save report to output directory
- [ ] Notify user via WhatsApp (if configured)

---

## Tool Constraints

**IMPORTANT:**

- **USE ONLY:** `web_search` for all research
- **NEVER USE:** `curl`, `wget`, bash commands for web scraping
- **NOT AVAILABLE:** `firecrawl` in cron sessions

---

## Output Configuration

| Setting | Value |
|---------|-------|
| Report Directory | `/Users/user/AppsCalude/Bot-Ultra-Power/research-reports/` |
| Report Format | Markdown (.md) |
| Filename Pattern | `research-[YYYY-MM-DD].md` |
| Notification | WhatsApp (via ClawdBot) |

---

## Integration with Autonomous Workflow

This research phase feeds into the daily product cycle:

| Time | Activity | Input | Output |
|------|----------|-------|--------|
| 06:00 | Research | web_search | Trend Report |
| 07:00 | Product Definition | Trend Report | Product Spec |
| 08:00-20:00 | Build | Product Spec | Working App |
| 20:00 | Deploy | Working App | Public URL |
| 21:00 | Report | All artifacts | WhatsApp Summary |

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-28 | 1.0.0 | Initial multilingual system configuration |

---

*Reference: /Users/user/clawd/RESEARCH.md*
*Agent: trend-researcher*
*Schedule: 06:00 daily*
