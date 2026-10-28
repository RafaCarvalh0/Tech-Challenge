# Orçamento da ordem de serviço - plano de implementação

> **Para agentes:** usar `superpowers:executing-plans` e `superpowers:test-driven-development`, executando as tarefas na ordem e com um commit por tarefa.

**Objetivo:** permitir compor a ordem de serviço, gerar seu orçamento automaticamente e registrar a decisão do cliente com controle transacional de estoque.

**Arquitetura:** a composição e o orçamento serão agregados ao módulo de ordens de serviço. Preços e nomes serão copiados do catálogo para os itens da OS, preservando o valor enviado ao cliente mesmo após alterações cadastrais. A aprovação atualizará orçamento, OS e estoque na mesma transação Prisma.

**Tecnologias:** NestJS 11, TypeScript, Prisma 6, PostgreSQL, Jest e Supertest.

**Especificação:** `../Fase 1 - Tech Challenge.pdf`

## Restrições globais

- Manter nomes próprios do projeto em português.
- Armazenar valores monetários em centavos inteiros.
- Permitir composição apenas em OS no status `EM_DIAGNOSTICO`.
- Não baixar estoque antes da aprovação.
- Impedir aprovação quando qualquer peça possuir estoque insuficiente.
- Manter Swagger, testes unitários e testes E2E atualizados.

## Pontos de revisão

- Itens repetidos na composição devem ser rejeitados.
- Quantidades nulas, negativas ou fracionárias devem ser rejeitadas.
- Serviço ou peça inexistente deve retornar não encontrado.
- Orçamento sem itens não pode ser enviado.
- Falha por estoque insuficiente não pode alterar parcialmente OS, orçamento ou estoque.

---

### Task 1: composição da ordem de serviço

**Arquivos:**
- Criar: `src/modulos/ordens-servico/dominio/composicao-ordem-servico.ts`
- Criar: `src/modulos/ordens-servico/aplicacao/definir-composicao-ordem-servico.caso-uso.ts`
- Criar: `src/modulos/ordens-servico/aplicacao/composicao-ordem-servico.repositorio.ts`
- Criar: `src/modulos/ordens-servico/infraestrutura/prisma-composicao-ordem-servico.repositorio.ts`
- Modificar: schema, módulo, controlador, DTOs, detalhe da OS e teste E2E

**Interface produzida:** `PUT /api/ordens-servico/:identificador/composicao`, recebendo `servicos[{servicoId, quantidade}]` e `pecasInsumos[{pecaInsumoId, quantidade}]`.

- [ ] Escrever o teste E2E e confirmar falha `404`.
- [ ] Implementar composição, persistência transacional e exibição no detalhe da OS.
- [ ] Executar testes da tarefa, lint e build.
- [ ] Commitar a composição da OS.

### Task 2: geração e envio do orçamento

**Arquivos:**
- Criar: domínio, caso de uso e repositório do orçamento dentro de `src/modulos/ordens-servico/`
- Modificar: schema, módulo, controlador, detalhe da OS e teste E2E

**Interface produzida:** `POST /api/ordens-servico/:identificador/orcamento`, sem corpo, retornando subtotais, total e situação `PENDENTE`.

- [ ] Escrever o teste E2E e confirmar falha `404`.
- [ ] Implementar cálculo por preços congelados e transição automática para `AGUARDANDO_APROVACAO`.
- [ ] Executar testes da tarefa, lint e build.
- [ ] Commitar geração e envio do orçamento.

### Task 3: aprovação, rejeição e baixa de estoque

**Arquivos:**
- Criar: caso de uso e operação transacional de decisão do orçamento
- Modificar: ações da OS, controlador, DTOs, repositórios e teste E2E

**Interface produzida:** `PATCH /api/ordens-servico/:identificador/orcamento/decisao`, recebendo `decisao` igual a `APROVAR` ou `REJEITAR`.

- [ ] Escrever testes de aprovação, rejeição e estoque insuficiente; confirmar falha inicial.
- [ ] Aprovar com baixa transacional e mudança para `EM_EXECUCAO`.
- [ ] Rejeitar sem baixa e retornar a OS para `EM_DIAGNOSTICO`.
- [ ] Bloquear as ações genéricas que ignorariam o orçamento.
- [ ] Executar suíte completa, cobertura, lint e build.
- [ ] Commitar decisão e estoque.
