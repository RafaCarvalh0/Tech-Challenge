# Documentação DDD

## Identificação

- Curso: SOAT — Software Architecture
- Fase: 1
- Grupo: 32
- Integrante: Rafael Abreu de Carvalho — RM378596
- Discord: Rafael Carvalho - rm378596

- Miro público: [Documentação completa](https://miro.com/app/board/uXjVEXBA6FI=/?share_link_id=15194992988)
- Event Storming offline: [event-storming.pdf](event-storming.pdf)
- Demais diagramas: [diagramas.pdf](diagramas.pdf)
- Linguagem Ubíqua: [linguagem-ubiqua.md](linguagem-ubiqua.md)
- C4 versionado: [../arquitetura/c4.md](../arquitetura/c4.md)

## Escopo

Os arquivos representam a branch `docs/completa-materiais-entrega-fase-1`. A versão-base da preparação foi `a19f537e52d3c1faa9070f71ed716944a038d649`; o hash final deve ser preenchido no fechamento da entrega.

Os PDFs são reproduções versionadas e legíveis dos frames do Miro, geradas em 30/10/2026. O Miro permanece como fonte visual editável.

## Rastreabilidade

| Documento | Frames do Miro | Implementação principal |
|---|---|---|
| Criação e aprovação | 05 | `src/modulos/ordens-servico/` |
| Acompanhamento | 06 | `src/modulos/acompanhamento/`, `src/modulos/indicadores/` |
| Peças e insumos | 07 | `src/modulos/pecas-insumos/` e aprovação transacional |
| Catálogo DDD | 08 | classes, interfaces e enums em `src/modulos/*/dominio/` |
| Bounded Contexts | 09 | módulos importados em `src/aplicacao.module.ts` |
| Modelo de domínio | 10 | domínio e `prisma/schema.prisma` |
| Ciclo da OS | 11 | `ordem-servico.ts` |
| Linguagem Ubíqua | 12 | nomes usados no código e na API |
| Rastreabilidade | 13 | código, banco e testes |
| Domain Storytelling | 17 | fluxo ponta a ponta implementado |
| Arquitetura DDD | 18 | apresentação, aplicação, domínio e infraestrutura |
