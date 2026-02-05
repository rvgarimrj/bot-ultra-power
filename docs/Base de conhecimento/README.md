# Base de Conhecimento - GarimDreaming

## Estrutura

```
Base de conhecimento/
  INDEX-GLOBAL.json       # Indice de pesquisas globais
  INDEX-BRASIL.json       # Indice de pesquisas Brasil
  INDEX-APPS-BUILDADOS.json  # Indice dos apps ja buildados
  pesquisas/
    globais/              # DD-MM-AAAA-GLOBAL.MD
    brasil/               # DD-MM-AAAA-BRASIL.MD
  apps-buildados/         # [slug].md (specs + URLs + stats)
  comparacoes/            # Analises comparativas (futuro)
```

## Como Consultar

### Listar todos os apps pesquisados (Global)
```bash
cat "docs/Base de conhecimento/INDEX-GLOBAL.json" | jq '.entries[] | {name, score, date}'
```

### Listar todos os apps pesquisados (Brasil)
```bash
cat "docs/Base de conhecimento/INDEX-BRASIL.json" | jq '.entries[] | {name, score, date}'
```

### Top 5 por score (Global)
```bash
cat "docs/Base de conhecimento/INDEX-GLOBAL.json" | jq '[.entries[] | {name, score}] | sort_by(-.score) | .[0:5]'
```

### Top 5 por score (Brasil)
```bash
cat "docs/Base de conhecimento/INDEX-BRASIL.json" | jq '[.entries[] | {name, score}] | sort_by(-.score) | .[0:5]'
```

### Buscar por categoria
```bash
cat "docs/Base de conhecimento/INDEX-GLOBAL.json" | jq '.entries[] | select(.category == "produtividade")'
```

### Apps buildados com URL
```bash
cat "docs/Base de conhecimento/INDEX-APPS-BUILDADOS.json" | jq '.entries[] | {name, url, status}'
```

## Formato dos Indices

Cada entrada no INDEX-GLOBAL.json ou INDEX-BRASIL.json:
```json
{
  "name": "NomeDoApp",
  "slug": "nome-do-app",
  "date": "DD-MM-AAAA",
  "file": "pesquisas/globais/DD-MM-AAAA-GLOBAL.MD",
  "score": 52,
  "category": "produtividade",
  "description": "Descricao curta em portugues",
  "tam": "$X bilhoes",
  "ranking": 1
}
```

## Tracks

### Track Global
Dores universais que funcionam em qualquer pais sem adaptacao cultural.
Inspiracao: Todoist, Photopea, Formula Bot, Bannerbear, Tally.

### Track Brasil
Problemas especificos do Brasil que concorrentes internacionais nao resolvem.
Foco: burocracia, Pix, regulacao, MEI, NF, cultura brasileira.

## Atualizacao

- Pesquisa Global: Seg-Sab 06:00 (3 apps/dia)
- Pesquisa Brasil: Seg-Sab 06:30 (3 apps/dia)
- Weekly Report: Dom 18:00 (resumo top 5 + tendencias)
