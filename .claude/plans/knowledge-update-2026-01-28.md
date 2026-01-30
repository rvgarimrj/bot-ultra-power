# Knowledge Base Update - 2026-01-28

## New System: Multilingual Research for GarimDreaming

### Summary
Implemented multilingual trend research system covering 3 markets:
- EN (Global) - Baseline market
- PT-BR - +3 modifier, less competition
- ES/LATAM - +2 modifier, growing market

### Score System
- Base Score: Pain(3x) + WTP(3x) + Build(2x) + Diff(1x) + Size(1x) = Max 50
- Final Score = Base + Market Modifier + Timing Bonus
- Minimum to pursue: 25 points

### Market Modifiers
| Market | Modifier | Justification |
|--------|----------|---------------|
| EN (Global) | +0 | Baseline, highest competition |
| PT-BR | +3 | Less competition, home market advantage |
| ES (LATAM) | +2 | Large market, low saturation |

### Timing Bonus
| Trend | Bonus |
|-------|-------|
| Rising | +2 |
| Stable | +0 |
| Falling | -2 |

### Sources per Language

**EN (English):**
- Twitter (#buildinpublic, #indiehackers, #saas)
- Product Hunt (Top 10, Upcoming)
- Hacker News (Show HN, Ask HN)
- Reddit (r/SideProject, r/startups, r/SaaS)
- Indie Hackers (Trending, Revenue milestones)

**PT-BR (Portuguese - Brazil):**
- Twitter BR (#startupbr, #techbr)
- TabNews (Trending, Relevantes)
- Reddit Brasil (r/brasil, r/brdev, r/investimentos)
- Local problems: MEI, NF, Pix, CNPJ

**ES (Spanish - LATAM):**
- Twitter ES (#startup, #emprendedor)
- Reddit LATAM (r/espanol, r/argentina, r/mexico)
- Product Hunt LATAM
- Regional problems: Facturacion electronica, MercadoPago

### Daily Workflow (06:00-07:30)

| Time | Activity |
|------|----------|
| 06:00-06:20 | EN research (Twitter, PH, HN) |
| 06:20-06:35 | PT-BR research (Twitter, TabNews, Reddit) |
| 06:35-06:50 | ES research (Twitter, Reddit LATAM) |
| 06:50-07:10 | Cross-language trends + tech queries |
| 07:10-07:30 | Compile report + scoring + pick TOP |

### Output Format
Comparative ranking report with:
- Global Top 5 (ranked by final score)
- Top 3 per language (EN, PT-BR, ES)
- Daily pick with justification
- MVP scope and next steps
- Market signals and honorable mentions

### Key Advantages
1. **More opportunities** - 3x more idea sources
2. **Less competition** - BR/ES markets less saturated
3. **Competitive advantage** - Better PT-BR market knowledge
4. **Diversification** - Not dependent on EN market only
5. **Fair comparison** - Standardized scoring enables global ranking

### Important Notes
- NEVER use curl, wget, or bash commands for web scraping
- DO NOT use firecrawl - not available in cron sessions
- Use ONLY `web_search` for all research queries

### Reference
Full documentation: `/Users/user/clawd/RESEARCH.md`
Last updated: 2026-01-28
