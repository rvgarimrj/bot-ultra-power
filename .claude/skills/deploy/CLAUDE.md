# /deploy - Comando de Deploy Coordenado

Inicia o fluxo completo de deploy de um app usando o Deploy Maestro.

## Uso

```
/deploy [caminho_do_app]
```

Se nenhum caminho for fornecido, pergunte ao usuario qual app deployar.

## Fluxo de 7 Fases

Execute TODAS as fases em sequencia, reportando ao usuario apos cada uma:

### FASE 0: Inicializacao
```bash
# Verificar diretorio
ls -la $APP_PATH

# Criar/verificar arquivo de status
mkdir -p ~/clawd/deploys
```
Reporte: `[FASE 0/7] INICIALIZACAO - Iniciando deploy de [APP_NAME]`

### FASE 1: Build
```bash
cd $APP_PATH && npm run build
# ou: bun run build
```
Se falhar, PARE e reporte o erro.
Reporte: `[FASE 1/7] BUILD - OK`

### FASE 2: SEO
Verifique e corrija se necessario:
- `app/sitemap.ts` - URL de producao correta
- `app/robots.ts` - URL de producao correta
- `app/layout.tsx` - meta tags e verification

Reporte: `[FASE 2/7] SEO - OK`

### FASE 3: Deploy Railway
```bash
cd $APP_PATH && railway up
```
Capture a URL de producao.
Teste se responde: `curl -I $URL`

Reporte: `[FASE 3/7] DEPLOY - OK. URL: [url]`

### FASE 4: Teste de Producao
Use playwright para:
1. Navegar para a URL
2. Verificar se carrega
3. Tirar screenshot

Reporte: `[FASE 4/7] TESTE - OK`

### FASE 5: Google Search Console
Verifique se sitemap.xml esta acessivel.
Instrua usuario sobre GSC se necessario.

Reporte: `[FASE 5/7] GSC - OK`

### FASE 6: X/Twitter Posts
Poste em 3 idiomas usando playwright:

**PT-BR:**
```
[Pergunta sobre dor]

[App] resolve [problema].

- Feature 1
- Feature 2
- Feature 3

Gratis. [URL]

#Hashtags
```

**EN-US:**
```
[Pain point question]

[App] solves [problem].

- Feature 1
- Feature 2
- Feature 3

Built with [Stack]. [URL]

#Hashtags
```

**ES:**
```
[Pregunta sobre dolor]

[App] resuelve [problema].

- Feature 1
- Feature 2
- Feature 3

Gratis. Sin registro. [URL]

#Hashtags
```

Reporte: `[FASE 6/7] X POSTS - OK`

### FASE 7: Finalizacao
Atualize o arquivo de status para 100%.
Gere resumo final com URLs e links dos posts.

Reporte: `[FASE 7/7] COMPLETO!`

## Arquivo de Status

Mantenha atualizado em `~/clawd/deploys/[DATA]-status.md`:

```markdown
# Deploy Status - [DATA]

## [APP_NAME]

| Fase | Status | Timestamp | Detalhes |
|------|--------|-----------|----------|
| Build | OK | HH:MM | No errors |
| SEO | OK | HH:MM | sitemap.ts, robots.ts |
| Deploy | OK | HH:MM | https://... |
| Teste | OK | HH:MM | Screenshot OK |
| GSC | OK | HH:MM | Sitemap submitted |
| X Posts | OK | HH:MM | 3 posts |

## URLs
- Production: https://...
- X Posts:
  - PT-BR: https://x.com/status/...
  - EN-US: https://x.com/status/...
  - ES: https://x.com/status/...
```

## Tratamento de Erros

Se QUALQUER fase falhar:
1. PARE imediatamente
2. Documente no arquivo de status
3. Reporte ao usuario:
```
[FASE X/7] [FASE] - FALHOU

Erro: [descricao]
Acao necessaria: [o que fazer]
```
4. Aguarde instrucoes

## Importante

- NUNCA pule fases
- SEMPRE reporte status ao usuario
- SEMPRE atualize o arquivo de status
- Se X nao estiver logado, avise o usuario
