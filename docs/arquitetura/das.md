# DAS — Documento de Aprovação da Solução

## Identificação

- Projeto: Tech Challenge — Oficina Mecânica
- Curso: SOAT — Software Architecture
- Fase: 1
- Grupo: 32
- Integrante: Rafael Abreu de Carvalho — RM378596
- Discord: Rafael Carvalho - rm378596
- Versão final: `PENDENTE`

## Contexto e escopo

MVP para cadastro, abertura e acompanhamento de ordens de serviço, composição, orçamento, estoque, transições e indicador de tempo médio. Fora do escopo: pagamentos, notificações, front-end, mensageria e microsserviços.

## Requisitos e restrições

Consulte [requisitos.md](requisitos.md). Restrições principais: monólito, API REST, Swagger, JWT administrativo, PostgreSQL, Docker e cobertura mínima de 80%.

## Solução aprovada

- Arquitetura: monólito modular em quatro camadas.
- Banco: PostgreSQL 17 com Prisma 6.19.3.
- Segurança: JWT administrativo; código privado para acompanhamento.
- Consistência: transações e baixa condicional de estoque.
- Diagramas: [C4](c4.md) e [documentação DDD](../ddd/README.md).

## Decisões

- [ADR 0001](adr/0001-monolito-modular-em-camadas.md)
- [ADR 0002](adr/0002-postgresql-e-prisma.md)
- [ADR 0003](adr/0003-jwt-e-codigo-de-acompanhamento.md)
- [ADR 0004](adr/0004-transacoes-e-controle-de-concorrencia.md)

## Plano de testes

Lint e build; testes unitários de domínio/aplicação; testes de repositório; E2E com PostgreSQL isolado. Evidências em `docs/qualidade/`.

## Segurança e riscos

Riscos conhecidos: dependências transitivas reportadas pelo `npm audit`, ausência de rate limiting e logging/auditoria estruturados. Não aplicar `npm audit fix --force`; realizar atualizações principais em branch dedicada com regressão completa.

## Aprovação acadêmica

- Responsável do grupo: Rafael Abreu de Carvalho — RM378596
- Data: `PENDENTE`
- Commit aprovado: `PENDENTE`
- Resultado: apto após concluir itens externos do checklist final.
