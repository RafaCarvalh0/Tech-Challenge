# Documentação DDD

## Identificação

- Curso: SOAT — Software Architecture
- Fase: 1
- Grupo: 32
- Integrante: Rafael Abreu de Carvalho — RM378596
- Discord: Rafael Carvalho - rm378596

- Miro público: [Documentação completa](https://miro.com/app/board/uXjVEXBA6FI=/?share_link_id=625881083702)
- Event Storming offline: [event-storming.pdf](event-storming.pdf)
- Demais diagramas: [diagramas.pdf](diagramas.pdf)
- Linguagem Ubíqua: [linguagem-ubiqua.md](linguagem-ubiqua.md)
- Catálogo DDD e rastreabilidade: [catalogo-e-rastreabilidade.md](catalogo-e-rastreabilidade.md)
- C4 versionado: [../arquitetura/c4.md](../arquitetura/c4.md)

## Escopo

Os arquivos representam a entrega na branch `main`. O hash final está registrado no PDF da entrega.

O board principal Tech Challenge e as exportações `event-storming.pdf` e `diagramas.pdf` foram atualizados e revisados visualmente em 31/10/2026.

## Rastreabilidade

| Documento | Frames do Miro | Implementação principal |
|---|---|---|
| Criação e aprovação | 04 | `src/modulos/ordens-servico/` |
| Acompanhamento | 05 | `src/modulos/acompanhamento/`, `src/modulos/indicadores/` |
| Peças e insumos | 06 | `src/modulos/pecas-insumos/` e aprovação transacional |
| Catálogo DDD | 07 | classes, interfaces e enums em `src/modulos/*/dominio/` |
| Bounded Contexts | 08 | módulos importados em `src/aplicacao.module.ts` |
| Modelo de domínio | 09 | domínio e `prisma/schema.prisma` |
| Ciclo da OS | 10 | `ordem-servico.ts` |
| Linguagem Ubíqua | 11 | nomes usados no código e na API |
| Rastreabilidade | 12 | código, banco e testes |
| Arquitetura, qualidade e segurança | 13 | arquitetura, API, testes e vulnerabilidades |
| Domain Storytelling | 14 | fluxo ponta a ponta implementado |
| Arquitetura DDD | 15 | apresentação, aplicação, domínio e infraestrutura |
