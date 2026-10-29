# Aderência Final da Fase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** concluir as três ressalvas de código encontradas na comparação com o PDF da Fase 1.

**Architecture:** manter a decisão transacional no módulo de ordens de serviço e adicionar somente a autorização por código no módulo público de acompanhamento. Os testes unitários exercitam diretamente os casos de uso críticos; dependências permanecem na linha Prisma 6.

**Tech Stack:** NestJS 11, TypeScript, Prisma 6.19.3, PostgreSQL 17, Jest e Supertest.

**Spec:** `docs/superpowers/specs/2026-10-28-aderencia-final-fase-1-design.md`

## Global Constraints

- Preservar JWT em todas as rotas administrativas.
- Não revelar a existência da OS quando o código de acompanhamento estiver ausente ou inválido.
- Não duplicar regras de decisão, estoque ou transação.
- Não usar `npm audit fix --force` nem migrar para Prisma 7.
- Produzir um commit independente para cada uma das três alterações.

## Review Focus

- Código de acompanhamento inválido ou de outra OS não pode decidir o orçamento.
- A rota pública deve funcionar sem JWT somente com o código correto.
- Aprovação deve manter a baixa de estoque transacional já existente.
- Testes unitários devem cobrir sucessos e falhas reais dos casos de uso críticos.
- Prisma CLI e Client devem permanecer na mesma versão, com o risco residual documentado.

---

### Task 1: Decisão pública segura do orçamento

**Files:**
- Create: `src/modulos/acompanhamento/aplicacao/decidir-orcamento-acompanhamento.caso-uso.ts`
- Create: `src/modulos/acompanhamento/apresentacao/acompanhamento.dto.ts`
- Modify: `src/modulos/acompanhamento/acompanhamento.module.ts`
- Modify: `src/modulos/acompanhamento/apresentacao/acompanhamento.controller.ts`
- Modify: `src/modulos/ordens-servico/ordens-servico.module.ts`
- Test: `testes/fluxo-oficina.ponta-a-ponta.teste.ts`

**Interfaces:**
- Consumes: `CasoUsoConsultarAcompanhamento.executar(id, codigo)` e `CasoUsoDecidirOrcamento.executar(id, decisao)`.
- Produces: `PATCH /api/acompanhamento/ordens-servico/:identificador/orcamento/decisao`.

- [ ] Escrever E2E para código inválido e decisão válida sem JWT.
- [ ] Executar E2E e confirmar falha 404 da rota inexistente.
- [ ] Implementar caso de uso, DTO, rota e injeção entre módulos.
- [ ] Reexecutar E2E, lint e build.
- [ ] Commitar `feat: permite decisao segura do orcamento pelo cliente`.

### Task 2: Cobertura dos casos críticos de OS

**Files:**
- Create: `src/modulos/ordens-servico/aplicacao/definir-composicao-ordem-servico.caso-uso.teste.ts`
- Create: `src/modulos/ordens-servico/aplicacao/gerar-orcamento.caso-uso.teste.ts`
- Create: `src/modulos/ordens-servico/aplicacao/decidir-orcamento.caso-uso.teste.ts`

**Interfaces:**
- Consumes: casos de uso e contratos de repositório existentes.
- Produces: cobertura unitária dos caminhos de sucesso e erro críticos.

- [ ] Escrever testes comportamentais para os três casos de uso.
- [ ] Confirmar que mutações relevantes nos casos de uso seriam detectadas.
- [ ] Executar testes direcionados e cobertura global.
- [ ] Commitar `test: cobre casos de uso criticos de ordens de servico`.

### Task 3: Alinhamento de dependências e segurança

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `docs/security/npm-audit-2026-10-28.md`

**Interfaces:**
- Produces: `prisma` e `@prisma/client` em `6.19.3`, com auditoria atual documentada.

- [ ] Atualizar ambos os pacotes para `6.19.3` sem Prisma 7.
- [ ] Gerar o client e executar `npm audit --omit=dev`.
- [ ] Atualizar o relatório para 3 vulnerabilidades altas remanescentes.
- [ ] Executar lint, build, unitários, cobertura e E2E.
- [ ] Commitar `chore: alinha prisma e atualiza relatorio de seguranca`.

## Verificação final

- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm run test:cov -- --runInBand`
- [ ] `npm run test:ponta-a-ponta -- --runInBand`
- [ ] `npm audit --omit=dev` documentado
- [ ] `git diff --check`
