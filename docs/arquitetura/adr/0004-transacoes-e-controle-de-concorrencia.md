# ADR 0004 — Garantir atomicidade e concorrência nos fluxos críticos

- Status: Aceita
- Data: 30/10/2026
- Última revisão editorial: 31/10/2026 — sem alteração da decisão
- Responsável: Rafael Abreu de Carvalho — RM378596

## Contexto

A aprovação altera orçamento, estoque e status da OS. Duas aprovações concorrentes ou uma falha parcial poderiam produzir saldo negativo, baixa incompleta ou divergência entre o orçamento e a situação da OS.

## Decisão

Foram executados os fluxos críticos em transações Prisma. Na aprovação, a implementação bloqueia e valida a OS, realiza atualização condicional de saldo para cada item e confirma as alterações somente quando todo o conjunto é válido.

## Alternativas

- Validar saldo fora da transação: rejeitado por condição de corrida.
- Baixa parcial com compensação: rejeitada por maior complexidade e inconsistência temporária.

## Consequências positivas

- Atomicidade entre decisão, estoque e mudança de status.
- Rollback integral em caso de estoque insuficiente ou falha intermediária.
- Atualização condicional impede saldo negativo sob concorrência.

## Consequências negativas e riscos

- A transação mantém bloqueios por mais tempo e pode gerar contenção.
- O fluxo depende das garantias transacionais do PostgreSQL e da implementação Prisma.
- O volume esperado no MVP torna esse custo aceitável; crescimento futuro deve ser monitorado.

## Referências

`prisma-orcamento.repositorio.ts`, `prisma-abertura-ordem-servico.repositorio.ts`, testes E2E de rollback.
