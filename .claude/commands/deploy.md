# /deploy - Comando de Deploy Coordenado

Inicia o fluxo completo de deploy de um app usando o Deploy Maestro.

## Uso

```
/deploy [caminho_do_app]
```

## Exemplos

```
/deploy ~/builds/proposta-ai
/deploy ~/agent-projects/builds/2026-01-30-clip-to-all
/deploy .
```

## O que acontece

O Deploy Maestro sera invocado para executar as 7 fases do deploy:

1. **Inicializacao** - Valida o projeto e cria arquivo de status
2. **Build** - Executa build e valida que nao ha erros
3. **SEO** - Configura sitemap.ts, robots.ts, meta tags
4. **Railway Deploy** - Faz deploy e captura URL de producao
5. **Teste de Producao** - Testa se o app funciona na URL
6. **Google Search Console** - Submete sitemap
7. **X/Twitter Posts** - Publica em 3 idiomas (pt-BR, en-US, es)

## Status em Tempo Real

Voce recebera atualizacoes a cada fase:

```
[FASE 3/7] DEPLOY RAILWAY - OK
URL: https://meuapp-production.up.railway.app
Proximo: Teste de Producao
```

## Arquivo de Status

O progresso e documentado em:
```
~/clawd/deploys/[DATA]-status.md
```

## Se algo falhar

O maestro para imediatamente e reporta:
- Qual fase falhou
- Detalhes do erro
- O que voce precisa fazer

Voce pode corrigir e rodar `/deploy` novamente.

---

## Instrucoes para o Agente

Ao receber este comando:

1. Identifique o caminho do app (argumento ou diretorio atual)
2. Invoque o Task tool com subagent_type="deploy-maestro" (se disponivel) OU siga o fluxo do deploy-maestro.md diretamente
3. Execute todas as 7 fases em sequencia
4. Reporte status ao usuario apos cada fase
5. Atualize o arquivo de status em ~/clawd/deploys/

Se o caminho nao for fornecido, pergunte ao usuario qual app deployar.

### Fluxo de Execucao

```
FASE 0: Inicializacao
- Verificar se diretorio existe
- Criar ~/clawd/deploys/[DATA]-status.md se nao existir
- Reportar: "[FASE 0/7] INICIALIZACAO - Iniciando deploy de [APP]"

FASE 1: Build
- cd [caminho] && npm run build (ou bun run build)
- Se erro, parar e reportar
- Reportar: "[FASE 1/7] BUILD - OK"

FASE 2: SEO
- Verificar/corrigir app/sitemap.ts (URL correta)
- Verificar/corrigir app/robots.ts (URL correta)
- Verificar meta tags em layout.tsx
- Reportar: "[FASE 2/7] SEO - OK"

FASE 3: Deploy
- railway up (ou railway init se primeiro deploy)
- Capturar URL de producao
- Testar se URL responde
- Reportar: "[FASE 3/7] DEPLOY - OK. URL: [url]"

FASE 4: Teste
- Usar playwright para acessar URL
- Verificar se pagina carrega
- Capturar screenshot
- Reportar: "[FASE 4/7] TESTE - OK"

FASE 5: GSC
- Verificar se sitemap.xml esta acessivel
- Instruir usuario sobre GSC se necessario
- Reportar: "[FASE 5/7] GSC - OK"

FASE 6: X Posts
- Gerar conteudo em 3 idiomas
- Postar via playwright
- Capturar IDs dos posts
- Reportar: "[FASE 6/7] X POSTS - OK. [links]"

FASE 7: Finalizacao
- Atualizar status para 100%
- Gerar resumo final
- Reportar: "[FASE 7/7] COMPLETO!"
```

### Conteudo de Posts

Gere posts seguindo este padrao:

**PT-BR**: Foco em dor do freelancer/empreendedor BR, mencionar "gratis"
**EN-US**: Foco tecnico, mencionar stack (Next.js, AI)
**ES**: Foco em mercado LATAM, "gratis" e sem registro

Hashtags por idioma:
- PT-BR: #FreelancerBR #IA #Produtividade #Empreendedorismo
- EN-US: #AI #IndieHacker #Freelancer #BuildInPublic
- ES: #IA #Freelancer #Marketing #Emprendedor
