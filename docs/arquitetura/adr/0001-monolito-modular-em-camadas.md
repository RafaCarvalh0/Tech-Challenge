# ADR 0001 — Monólito modular em camadas

- Status: Aceita

## Contexto

O MVP precisa entregar todos os fluxos de oficina com execução local simples e organização em camadas.

## Decisão

Usar um único processo NestJS, organizado por módulos de negócio e camadas de apresentação, aplicação, domínio e infraestrutura.

## Alternativas

- Microsserviços: rejeitados pelo custo operacional desnecessário ao MVP.
- Estrutura somente técnica: rejeitada por ocultar limites e linguagem do domínio.

## Consequências

Implantação e transações simples; acoplamento de processo e banco compartilhado aceitos. Os Bounded Contexts são lógicos, não unidades independentes de implantação.

## Referências

`src/aplicacao.module.ts`, `src/modulos/`, [c4.md](../c4.md).
