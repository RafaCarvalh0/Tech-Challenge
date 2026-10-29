# Concluir Pendências de Código - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (recommended) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corrigir e comprovar as pendências técnicas do backend do Tech Challenge, garantindo cobertura mínima de 80%, testes E2E executáveis, build/lint verdes e documentação técnica de execução coerente com o código.

**Architecture:** Preservar o monólito modular NestJS existente, sem alterar os limites entre domínio, aplicação, infraestrutura e apresentação. A cobertura será medida somente sobre `src/modulos/**/dominio`, `src/modulos/**/aplicacao` e `src/compartilhado/dominio`, excluindo adaptadores de persistência e arquivos de teste. Os testes E2E continuarão usando exclusivamente o banco temporário configurado pelo perfil `test`.

**Tech Stack:** Node.js 24, TypeScript, NestJS 11, Jest 29, Supertest, Prisma 6, PostgreSQL 17, Docker Compose e Swagger/OpenAPI.

**Spec:** `Fase 1 - Tech Challenge/Fase 1 - Tech Challenge.pdf`; requisitos complementares do indicador em `docs/superpowers/specs/2026-10-28-indicadores-servicos-design.md`.

## Global Constraints

- Manter as funcionalidades obrigatórias de clientes, veículos, serviços, peças/insumos, ordens de serviço, orçamento, acompanhamento e indicadores.
- Manter autenticação JWT nas APIs administrativas e a rota pública de acompanhamento protegida por código privado.
- Não executar limpeza, migration ou teste contra o banco normal de desenvolvimento; E2E deve usar banco cujo nome termine em `_teste`.
- Não versionar `.env`, credenciais, tokens ou segredos reais.
- Não executar `npm audit fix --force` sem validar compatibilidade com Prisma e migrations.
- A cobertura mínima exigida é de 80% para statements, branches, functions e lines nas áreas críticas.

## Review Focus

- Caminhos de cobertura incorretos: o Jest deve incluir `src/modulos/**` e `src/compartilhado/**`, não os diretórios inexistentes `modules` e `shared`.
- Regras de transição da OS: ações inválidas devem continuar retornando erro e ações válidas devem atualizar os timestamps de execução.
- Indicador de tempo médio: somente OS com início e finalização válidos entram no cálculo; rota administrativa exige JWT.
- Isolamento E2E: falha de teste ou limpeza nunca pode apagar dados do banco normal.
- Segurança de entrada: DTOs devem continuar rejeitando campos desconhecidos e validando CPF/CNPJ, placa, estoque e código de acompanhamento.

---

### Task 1: Corrigir a coleta de cobertura do Jest

**Files:**
- Modify: `package.json:71-79`
- Test: `src/modulos/indicadores/aplicacao/obter-tempo-medio-servicos.caso-uso.teste.ts` como teste de sanidade da coleta

**Interfaces:**
- Consumes: estrutura atual do projeto em `src/modulos` e `src/compartilhado`.
- Produces: relatório Jest que lista arquivos reais e aplica os thresholds configurados.

- [ ] **Step 1: Escrever/confirmar o teste de sanidade**

  Confirmar que `obter-tempo-medio-servicos.caso-uso.teste.ts` cobre o caso de uso e que o arquivo correspondente aparece no relatório.

- [ ] **Step 2: Executar a cobertura antes da alteração**

  Run: `npm run test:cov -- --runInBand`

  Expected: o relatório atual demonstra o problema, normalmente com `All files 0%` ou sem arquivos coletados.

- [ ] **Step 3: Corrigir `collectCoverageFrom`**

  Em `package.json`, substituir:

  - `modules/**/domain/**/*.ts` por `modulos/**/dominio/**/*.ts`
  - `modules/**/application/**/*.ts` por `modulos/**/aplicacao/**/*.ts`
  - `shared/domain/**/*.ts` por `compartilhado/dominio/**/*.ts`

  Manter as exclusões dos arquivos `*.teste.ts` e dos repositórios.

- [ ] **Step 4: Reexecutar a cobertura**

  Run: `npm run test:cov -- --runInBand`

  Expected: o relatório lista os arquivos reais e informa percentuais por statements, branches, functions e lines.

- [ ] **Step 5: Commit**

  ```bash
  git add package.json
  git commit -m "test: corrige caminhos da cobertura do jest"
  ```

### Task 2: Elevar a cobertura crítica para pelo menos 80%

**Files:**
- Modify: testes unitários nos módulos abaixo do threshold, somente após o relatório da Task 1
- Test: `src/modulos/**/dominio/**/*.teste.ts`
- Test: `src/modulos/**/aplicacao/**/*.teste.ts`
- Test: `src/compartilhado/dominio/**/*.teste.ts`, se aplicável

**Interfaces:**
- Consumes: regras e assinaturas já existentes nos casos de uso e entidades.
- Produces: cobertura mínima de 80% em statements, branches, functions e lines sem reduzir thresholds.

- [ ] **Step 1: Identificar arquivos abaixo de 80%**

  Run: `npm run test:cov -- --runInBand`

  Registrar os arquivos abaixo de 80% nas quatro métricas, priorizando regras de domínio e casos de uso.

- [ ] **Step 2: Escrever testes para os caminhos não cobertos**

  Cobrir, conforme o relatório:

  - transições inválidas e válidas de OS;
  - aprovação e rejeição de orçamento;
  - estoque insuficiente e movimentações válidas;
  - CPF/CNPJ e placa inválidos;
  - registros inexistentes e conflitos de unicidade;
  - indicador sem execuções e com múltiplas execuções válidas.

  Os testes devem seguir o padrão Jest existente e usar repositórios em memória nos testes unitários.

- [ ] **Step 3: Executar apenas os testes alterados**

  Run: `npm test -- --runInBand <arquivos-de-teste>`

  Expected: todos os testes alterados passam.

- [ ] **Step 4: Confirmar o threshold global**

  Run: `npm run test:cov -- --runInBand`

  Expected: Jest termina com sucesso e apresenta pelo menos 80% em statements, branches, functions e lines.

- [ ] **Step 5: Commit**

  ```bash
  git add src
  git commit -m "test: comprova cobertura dos dominios criticos"
  ```

### Task 3: Executar e corrigir a validação E2E do fluxo completo

**Files:**
- Modify: `testes/fluxo-oficina.ponta-a-ponta.teste.ts` somente se um cenário existente falhar
- Modify: `testes/configurar-ambiente.teste.ts` somente se a proteção do banco de teste falhar
- Modify: `testes/jest-ponta-a-ponta.json` somente se a configuração impedir a execução documentada
- Modify: `README.md` para refletir comandos comprovados

**Interfaces:**
- Consumes: PostgreSQL temporário em `localhost:5433/oficina_teste` e migrations Prisma.
- Produces: suíte E2E verde cobrindo saúde, autenticação, segurança, CRUDs, OS, orçamento, estoque, acompanhamento, transações e indicador.

- [ ] **Step 1: Subir o banco temporário**

  Run: `docker compose --profile test up -d banco-dados-teste`

- [ ] **Step 2: Configurar explicitamente o banco de teste**

  PowerShell:

  ```powershell
  $env:URL_BANCO_DADOS="postgresql://postgres:postgres@localhost:5433/oficina_teste?schema=public"
  npm run prisma:deploy
  ```

- [ ] **Step 3: Executar a suíte E2E**

  Run: `npm run test:ponta-a-ponta -- --runInBand`

  Expected: todos os testes passam sem acessar o banco `oficina` da aplicação.

- [ ] **Step 4: Corrigir somente falhas reproduzidas**

  Para cada falha, preservar o contrato HTTP e corrigir a menor camada responsável. Adicionar um teste regressivo antes da implementação da correção.

- [ ] **Step 5: Reexecutar E2E e desligar o banco temporário**

  Run: `npm run test:ponta-a-ponta -- --runInBand`

  Depois: `docker compose --profile test stop banco-dados-teste`

- [ ] **Step 6: Commit**

  ```bash
  git add src testes README.md
  git commit -m "test: valida fluxo e2e completo da oficina"
  ```

### Task 4: Atualizar a documentação técnica baseada no código validado

**Files:**
- Modify: `README.md:102-196`
- Modify: `.env.example` somente se algum nome de variável documentado divergir do código

**Interfaces:**
- Consumes: endpoints efetivamente expostos pelos controllers e comandos validados nas Tasks 1-3.
- Produces: README executável por uma pessoa sem contexto prévio do projeto.

- [ ] **Step 1: Atualizar a tabela de endpoints**

  Incluir orçamento, decisão do orçamento, movimentação de estoque, acompanhamento e `GET /api/indicadores/tempo-medio-servicos`.

- [ ] **Step 2: Documentar autenticação de demonstração**

  Explicar o uso das variáveis `USUARIO_ADMINISTRADOR`, `SENHA_ADMINISTRADOR` e `SEGREDO_JWT` sem publicar valores reais.

- [ ] **Step 3: Remover “próximos incrementos” já implementados**

  Remover ou atualizar os itens de indicador, regras de transição e listagem/tempo médio que já existem no código.

- [ ] **Step 4: Validar os comandos documentados**

  Confirmar `npm run build`, `npm test -- --runInBand`, `npm run test:cov -- --runInBand` e `npm run test:ponta-a-ponta -- --runInBand` conforme as Tasks anteriores.

- [ ] **Step 5: Commit**

  ```bash
  git add README.md .env.example
  git commit -m "docs: atualiza guia de execucao e endpoints"
  ```

### Task 5: Fazer a verificação final de qualidade e segurança

**Files:**
- Modify: `docs/security/npm-audit-2026-10-27.md` com a data e o resultado atualizados
- Modify: `package.json` e `package-lock.json` somente se uma atualização segura for comprovada

**Interfaces:**
- Consumes: branch completa e resultado das Tasks 1-4.
- Produces: branch pronta para revisão, sem regressões conhecidas e com riscos de dependências explicitamente registrados.

- [ ] **Step 1: Executar lint e build**

  Run: `npm run lint`

  Run: `npm run build`

  Expected: ambos terminam com sucesso.

- [ ] **Step 2: Executar a bateria unitária e a cobertura**

  Run: `npm test -- --runInBand`

  Run: `npm run test:cov -- --runInBand`

  Expected: todos os testes passam e o threshold de 80% é atendido.

- [ ] **Step 3: Executar análise de dependências**

  Run: `npm audit --omit=dev`

  Atualizar o relatório com o resultado. Se a correção exigir Prisma 7 ou migration incompatível, não aplicar atualização automática; registrar o risco e a decisão técnica.

- [ ] **Step 4: Verificar arquivos sensíveis e diferenças**

  Run: `git diff --check`

  Run: `git ls-files .env .env.*`

  Expected: nenhum `.env` real versionado e nenhum erro de whitespace.

- [ ] **Step 5: Confirmar estado final da branch**

  Run: `git status --short`

  Expected: árvore limpa após os commits e branch `feature/concluir-pendencias-codigo` pronta para revisão/PR.

- [ ] **Step 6: Commit final do relatório de segurança, se alterado**

  ```bash
  git add docs/security/npm-audit-2026-10-27.md package.json package-lock.json
  git commit -m "chore: atualiza verificacao de dependencias"
  ```

## Verificação final

- [ ] `npm test -- --runInBand` passa.
- [ ] `npm run test:cov -- --runInBand` passa com pelo menos 80% nas quatro métricas.
- [ ] `npm run test:ponta-a-ponta -- --runInBand` passa com PostgreSQL temporário.
- [ ] `npm run lint` passa.
- [ ] `npm run build` passa.
- [ ] `npm audit --omit=dev` foi executado e documentado.
- [ ] `git diff --check` passa.
- [ ] Nenhuma credencial real está versionada.
- [ ] A branch está limpa e pronta para abrir Pull Request.
