# Indicador de Tempo Médio dos Serviços - Plano de Implementação

> **Para agentes de implementação:** SUB-SKILL OBRIGATÓRIA: use `superpowers:executing-plans` para implementar este plano tarefa por tarefa. As etapas usam caixas de seleção (`- [ ]`) para acompanhamento.

**Objetivo:** registrar a duração de execução das ordens e disponibilizar a média por serviço em uma API administrativa.

**Arquitetura:** a entidade de OS registra timestamps nas transições; o Prisma persiste os campos; o módulo de indicadores executa a agregação no PostgreSQL e expõe uma rota protegida pelo JWT global.

**Tecnologias:** NestJS, TypeScript, Prisma, PostgreSQL, Jest e Supertest.

**Especificação:** `docs/superpowers/specs/2026-10-28-indicadores-servicos-design.md` e `../Fase 1 - Tech Challenge.pdf`.

## Restrições globais

- Manter o back-end monolítico e a organização em camadas.
- Usar português em nomes próprios do projeto sempre que possível.
- Não calcular médias em memória.
- Manter a rota protegida pela autenticação administrativa.
- Implementar cada comportamento com TDD e um commit parcial.

## Foco da revisão

- Uma OS não finalizada não pode entrar na média.
- A entrega não pode apagar ou reiniciar os timestamps.
- Rejeitar um orçamento não pode iniciar a execução.
- Uma OS com vários serviços deve contar uma vez para cada serviço.
- A rota sem JWT deve responder 401.

---

### Task 1: Registrar o período de execução

**Arquivos:**
- Modificar: `src/modulos/ordens-servico/dominio/ordem-servico.ts`
- Modificar: testes da entidade e dos casos de uso da OS
- Modificar: `prisma/schema.prisma`
- Criar: migration para `inicio_execucao_em` e `finalizado_em`
- Modificar: repositórios Prisma de OS, orçamento e abertura

**Interfaces:**
- `OrdemServico.executarAcao(acao, agora?)` registra o início em `APROVAR` e o fim em `FINALIZAR`.
- `OrdemServico.restaurar` recebe os dois timestamps opcionais.

- [x] Escrever testes de domínio para aprovação, rejeição, finalização e entrega.
- [x] Executar os testes e confirmar a falha pela ausência dos timestamps.
- [x] Implementar os campos e regras na entidade.
- [x] Criar schema/migration e atualizar todos os mapeamentos Prisma.
- [x] Executar unitários, lint e build.
- [x] Commitar: `feat: registra tempo de execucao das ordens`.

### Task 2: Calcular e expor o indicador

**Arquivos:**
- Criar: `src/modulos/indicadores/aplicacao/indicador-tempo-medio.repositorio.ts`
- Criar: `src/modulos/indicadores/aplicacao/obter-tempo-medio-servicos.caso-uso.ts`
- Criar: `src/modulos/indicadores/infraestrutura/prisma-indicador-tempo-medio.repositorio.ts`
- Criar: `src/modulos/indicadores/apresentacao/indicador.controller.ts`
- Criar: `src/modulos/indicadores/indicadores.module.ts`
- Modificar: `src/aplicacao.module.ts`
- Modificar: `testes/fluxo-oficina.ponta-a-ponta.teste.ts`

**Interfaces:**
- `RepositorioIndicadorTempoMedio.obterPorServico(): Promise<IndicadorTempoMedioServico[]>`.
- `GET /api/indicadores/tempo-medio-servicos` retorna `servicoId`, `nome`, `quantidadeOrdens` e `tempoMedioExecucaoEmSegundos`.

- [ ] Escrever teste do caso de uso para lista vazia e dados agregados.
- [ ] Executar o teste e confirmar a falha por módulos ausentes.
- [ ] Implementar contrato, caso de uso, consulta SQL agregada, módulo e controller.
- [ ] Escrever E2E para média, exclusão de OS não finalizada e resposta 401 sem token.
- [ ] Executar unitários, E2E, lint e build.
- [ ] Commitar: `feat: adiciona indicador de tempo medio dos servicos`.

### Task 3: Verificação final

- [ ] Executar `npm run lint`.
- [ ] Executar `npm run build`.
- [ ] Executar `npm test -- --runInBand`.
- [ ] Executar `npm run test:ponta-a-ponta -- --runInBand` no banco de teste.
- [ ] Conferir migration, Swagger, proteção JWT e árvore Git limpa.
