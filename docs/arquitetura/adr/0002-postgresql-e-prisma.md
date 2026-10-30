# ADR 0002 — PostgreSQL e Prisma

- Status: Aceita

## Contexto

Ordens, clientes, veículos, composições, orçamentos e estoque possuem relacionamentos e exigem consistência transacional.

## Decisão

Usar PostgreSQL 17 como banco relacional e Prisma 6.19.3 como ORM, cliente tipado e mecanismo de migrations.

## Alternativas

- Banco documental: rejeitado porque não simplifica as relações nem a atomicidade exigida.
- SQL manual: rejeitado pelo maior custo de mapeamento e manutenção no MVP.

## Consequências

Integridade relacional, transações e migrations reproduzíveis; dependência do Prisma e necessidade de migração controlada antes de versões principais.

## Referências

`prisma/schema.prisma`, `prisma/migrations/`, `docker-compose.yml`.
