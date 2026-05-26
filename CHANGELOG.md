# Changelog

Todas as mudanças relevantes deste projeto são documentadas neste arquivo.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e o projeto adota o [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.1.0] - 2026-05-26

### Adicionado
- **Campo 6 - Pontuação Régua** (`pontuacaoRegua`): novo campo que aparece na linha
  "Resultado" como `| Pontuação <valor>` ao lado do `atg.`.
- **Campo 7 - Pontuação Régua Projeção** (`pontuacaoReguaProjecao`): nova linha
  abaixo da Meta com rótulo "Projeção de Pontos" e o valor à direita.
- Cartão de formatação **Campo 7 - Projeção de Pontos (barra)** com rótulo,
  fonte, cor do rótulo, cor do valor e sufixo (todos editáveis).
- Em **Campo 3 - Resultado/Atingimento**: novas opções *"Separador antes da
  Pontuação"* (padrão ` | `) e *"Rótulo da Pontuação"* (padrão `Pontuação `).
- Em **Números (formatação)**: novas opções *"Casas decimais (Pontuação - Campos
  6 e 7)"* (padrão `0`) e *"Separador de milhar na Pontuação"* (padrão ligado,
  gera `1.250` para `1250`).

### Notas técnicas
- A `viewBox` permanece **817×321** (mesma da v1.0.0). A linha "Projeção de
  Pontos" foi encaixada no espaço de respiro que existia abaixo da Meta, **sem
  alterar a proporção do cartão** — fontes, barra e demais elementos mantêm o
  mesmo tamanho da v1.0.0 (evita o efeito de "encolhimento" causado por
  mudança de aspect ratio no `preserveAspectRatio`).
- **Compatível com a v1.0.0**: visuais que atualizarem sem adicionar os Campos
  6 e 7 ficam visualmente idênticos. As novas linhas só renderizam quando os
  campos correspondentes estão *bind*.

## [1.0.0] - 2026-05-23

### Adicionado
- Primeira versão do visual personalizado **Progresso Índice (Barras)**.
- Réplica nativa do cartão de progresso antes construído em DAX + SVG (HTML Content).
- 8 campos no painel de Dados: Resultado (topo), Meta (topo), Peso, Posição,
  Resultado (barra), Atingimento %, Progresso da barra %, Meta (barra).
- Poço dedicado de **Dicas de ferramenta (tooltips)**.
- Painel de formatação completo: cor de fundo e arredondamento do cartão;
  rótulo, fonte, tamanho, cor e negrito por elemento; cores, limite, número de
  segmentos e altura da barra; casas decimais, separador decimal e tratamento
  de percentuais (fração 0–1).
- Barra de progresso multi-segmento com cor dinâmica (atingido/não atingido).
