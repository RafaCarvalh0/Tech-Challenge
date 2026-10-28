# Plano de implementação dos CRUDs de serviços e peças/insumos

> **Para agentes:** usar `superpowers:test-driven-development` e executar as tarefas na ordem, com um commit por tarefa.

**Objetivo:** implementar os cadastros administrativos de serviços e peças/insumos exigidos na primeira fase do Tech Challenge.

**Arquitetura:** cada cadastro será um módulo NestJS em camadas (`dominio`, `aplicacao`, `infraestrutura` e `apresentacao`), seguindo os módulos existentes. A persistência será feita com Prisma/PostgreSQL e os contratos REST serão publicados no Swagger.

**Tecnologias:** NestJS 11, TypeScript, Prisma 6, PostgreSQL, Jest e Supertest.

**Especificação:** `../Fase 1 - Tech Challenge.pdf`

## Restrições globais

- Manter nomes de arquivos, classes, propriedades, rotas e banco em português sempre que o framework não exigir inglês.
- Representar valores monetários em centavos inteiros para evitar erros de ponto flutuante.
- Validar entradas nos DTOs e no domínio.
- Criar primeiro os testes que falham e implementar somente depois.
- Produzir um commit independente para cada CRUD.

## Pontos de revisão

- Nome ou código duplicado deve retornar conflito.
- Atualização sem campos deve retornar erro de validação.
- Valores monetários negativos ou fracionários devem ser rejeitados.
- Estoque não pode ficar negativo.
- Consulta e exclusão de identificador inexistente devem retornar não encontrado.

---

### Tarefa 1: CRUD de serviços

**Arquivos:**
- Criar: `src/modulos/servicos/**`
- Modificar: `src/aplicacao.module.ts`, `prisma/schema.prisma`, `testes/fluxo-oficina.ponta-a-ponta.teste.ts`
- Criar: migração Prisma do cadastro de serviços

**Contrato produzido:**
- `POST /api/servicos`
- `GET /api/servicos`
- `GET /api/servicos/:identificador`
- `PATCH /api/servicos/:identificador`
- `DELETE /api/servicos/:identificador`
- Campos: `nome`, `descricao` opcional e `precoEmCentavos`.

- [ ] Escrever testes de domínio, casos de uso e ponta a ponta.
- [ ] Executar os testes e confirmar falha pela ausência do módulo.
- [ ] Implementar domínio, casos de uso, repositório Prisma, controlador, DTOs e módulo.
- [ ] Executar testes, lint e build.
- [ ] Commitar o CRUD de serviços.

### Tarefa 2: CRUD de peças e insumos com estoque

**Arquivos:**
- Criar: `src/modulos/pecas-insumos/**`
- Modificar: `src/aplicacao.module.ts`, `prisma/schema.prisma`, `testes/fluxo-oficina.ponta-a-ponta.teste.ts`
- Criar: migração Prisma do cadastro de peças/insumos

**Contrato produzido:**
- `POST /api/pecas-insumos`
- `GET /api/pecas-insumos`
- `GET /api/pecas-insumos/:identificador`
- `PATCH /api/pecas-insumos/:identificador`
- `PATCH /api/pecas-insumos/:identificador/estoque`
- `DELETE /api/pecas-insumos/:identificador`
- Campos: `codigo`, `nome`, `descricao` opcional, `precoUnitarioEmCentavos` e `quantidadeEstoque`.
- Movimentação de estoque: `tipo` (`ENTRADA` ou `SAIDA`) e `quantidade` inteira positiva.

- [ ] Escrever testes de domínio, casos de uso e ponta a ponta.
- [ ] Executar os testes e confirmar falha pela ausência do módulo.
- [ ] Implementar domínio, casos de uso, repositório Prisma, controlador, DTOs e módulo.
- [ ] Executar a suíte completa, cobertura, lint e build.
- [ ] Commitar o CRUD de peças/insumos.
