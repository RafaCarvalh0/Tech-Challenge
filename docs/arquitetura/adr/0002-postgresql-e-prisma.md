# ADR 0002 — Adotar PostgreSQL e Prisma

- Status: Aceita
- Data: 30/10/2026
- Última revisão editorial: 31/10/2026 — sem alteração da decisão
- Responsável: Rafael Abreu de Carvalho — RM378596

## Contexto

Ordens, clientes, veículos, composições, orçamentos e estoque possuem relacionamentos, restrições de integridade e operações que precisam ser confirmadas ou revertidas em conjunto. O ambiente deve ser reproduzível localmente e manter o schema versionado.

## Decisão

Foi adotado PostgreSQL 17 como banco relacional e Prisma 6.19.3 como ORM, cliente tipado, mecanismo de migrations e API transacional.

## Alternativas

- Banco documental: rejeitado porque não simplifica as relações nem a atomicidade exigida.
- SQL manual: rejeitado pelo maior custo de mapeamento e manutenção no MVP.

## Consequências positivas

- Integridade referencial e transações ACID para os fluxos críticos.
- Schema, migrations e cliente tipado versionados junto ao código.
- Execução local reproduzível com a imagem oficial do PostgreSQL.

## Consequências negativas e riscos

- A solução depende do PostgreSQL e das APIs do Prisma.
- Atualizações principais do Prisma exigem migração controlada e regressão completa.
- Consultas específicas podem exigir SQL ou recursos próprios do PostgreSQL em evoluções futuras.

## Referências

`prisma/schema.prisma`, `prisma/migrations/`, `docker-compose.yml`.
