# ADR 0004 — Transações e controle de concorrência

- Status: Aceita

## Contexto

A aprovação altera orçamento, estoque e status da OS; concorrência ou falha parcial poderia produzir saldo negativo ou estado incoerente.

## Decisão

Executar fluxos críticos em transações Prisma. Na aprovação, bloquear/validar a OS, realizar atualização condicional de saldo para cada item e confirmar todas as alterações somente se o conjunto inteiro for válido.

## Alternativas

- Validar saldo fora da transação: rejeitado por condição de corrida.
- Baixa parcial com compensação: rejeitada por maior complexidade e inconsistência temporária.

## Consequências

Atomicidade e rollback integral; maior contenção durante aprovações concorrentes, aceitável no volume do MVP.

## Referências

`prisma-orcamento.repositorio.ts`, `prisma-abertura-ordem-servico.repositorio.ts`, testes E2E de rollback.
