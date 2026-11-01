# ADR 0001 — Adotar monólito modular em camadas

- Status: Aceita
- Data: 30/10/2026
- Última revisão editorial: 31/10/2026 — sem alteração da decisão
- Responsável: Rafael Abreu de Carvalho — RM378596

## Contexto

O MVP precisa entregar todos os fluxos da oficina com execução local simples, baixo custo operacional e separação explícita entre contrato HTTP, casos de uso, regras de domínio e persistência. O escopo possui um único responsável e não exige implantação ou escalabilidade independente por contexto.

## Decisão

Foi adotado um único processo NestJS, organizado por módulos de negócio e pelas camadas de apresentação, aplicação, domínio e infraestrutura. Os limites de contexto permanecem lógicos dentro da mesma unidade de implantação.

## Alternativas

- Microsserviços: rejeitados pelo custo operacional desnecessário ao MVP.
- Estrutura somente técnica: rejeitada por ocultar limites e linguagem do domínio.

## Consequências positivas

- Implantação, depuração e transações distribuídas entre módulos permanecem simples.
- A organização por domínio reduz o acoplamento entre regras de negócio e frameworks.
- O projeto pode separar módulos no futuro se requisitos reais justificarem essa evolução.

## Consequências negativas e riscos

- Os módulos compartilham processo e banco, portanto não escalam nem são implantados independentemente.
- Falhas graves no processo podem afetar toda a aplicação.
- A modularidade depende de disciplina para preservar as fronteiras internas.

## Referências

`src/aplicacao.module.ts`, `src/modulos/`, [c4.md](../c4.md).
