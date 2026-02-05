# PropostaAI

## Status
- **URL:** https://proposta-ai-production.up.railway.app
- **Stats:** https://proposta-ai-production.up.railway.app/api/stats?secret=garimdreaming-stats-2026
- **Deploy Date:** 2026-01-30
- **Status:** Ativo

## Descricao
Gerador de propostas comerciais profissionais usando IA, especifico para freelancers brasileiros que trabalham em plataformas como 99Freelas, Workana e Upwork. Gera proposta pronta em segundos a partir da descricao do projeto.

## Mercado
- **Track:** Brasil
- **Score:** 49/50
- **TAM:** Milhoes de freelancers brasileiros em plataformas (99Freelas, Workana, Upwork)
- **Publico:** Freelancers brasileiros (devs, designers, redatores, marketeiros), MEIs que prestam servicos

## Stack
- Next.js 14 (App Router)
- Tailwind CSS + shadcn/ui
- OpenAI API (GPT-4-turbo)
- Neon PostgreSQL + Prisma
- Stack Auth (Google OAuth + Magic Link)
- Railway (deploy)
- i18n: PT-BR, EN, ES

## Diferenciais
- 100% em portugues brasileiro com tom e expressoes locais
- Foco em plataformas BR (99Freelas, Workana)
- Simplicidade: nao e um editor, e um gerador
- Preco acessivel: R$29 vs $29 USD dos concorrentes
- 3 templates (Curto, Medio, Detalhado) + 3 tons (Formal, Casual, Tecnico)

## Metricas
- Views: via /api/stats
- Feedback: via /api/feedback
- Meta: volume de propostas geradas, taxa de copia, conversao free-pro
