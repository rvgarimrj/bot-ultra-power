# GestaoMEI

## Status
- **URL:** https://gestaomei-production.up.railway.app
- **Stats:** https://gestaomei-production.up.railway.app/api/stats?secret=garimdreaming-stats-2026
- **Deploy Date:** 2026-02-02
- **Status:** Ativo

## Descricao
Portal simples para Microempreendedores Individuais (MEIs) emitirem NF-e, controlarem receitas/despesas e gerarem relatorio DAS automaticamente. Interface ultra-simples focada 100% em MEI.

## Mercado
- **Track:** Brasil
- **Score:** 50/50
- **TAM:** 12.9 milhoes de MEIs ativos no Brasil (SEBRAE Out 2025). Obrigatoriedade de NF-e em todas as transacoes a partir de 2027
- **Publico:** MEIs brasileiros - autonomos, prestadores de servico, pequenos comerciantes

## Stack
- Next.js 14 (App Router)
- Tailwind CSS + shadcn/ui
- Neon PostgreSQL + Prisma
- Stack Auth (Google OAuth + Magic Link)
- Railway (deploy)

## Diferenciais
- Preco: R$19-29/mes vs R$89-119/mes dos concorrentes
- 100% focado em MEI (concorrentes sao feitos para ME/EPP)
- Setup em 2 minutos (vs configuracao complexa)
- Mobile-first (MEIs usam celular para tudo)
- Emissao de NF-e em 3 campos (vs dezenas no portal gov)
- Calculo automatico do DAS mensal
- Export PDF pronto para contador

## Metricas
- Views: via /api/stats
- Feedback: via /api/feedback
- Meta: cadastros, registros de receita/despesa, DAS calculados, PDFs gerados
