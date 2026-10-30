# Requisitos e rastreabilidade

## Requisitos funcionais

| ID | Requisito | Endpoint/caso de uso | Evidência de teste |
|---|---|---|---|
| RF01 | CRUD de clientes | `cliente.controller.ts`; casos de uso de clientes | testes de domínio, aplicação, repositório e E2E |
| RF02 | CRUD de veículos | `veiculo.controller.ts`; casos de uso de veículos | testes de placa, domínio, aplicação e E2E |
| RF03 | CRUD de serviços | `servico.controller.ts`; casos de uso de serviços | testes de domínio/aplicação e E2E |
| RF04 | CRUD e estoque de peças/insumos | `peca-insumo.controller.ts`; `MovimentarEstoqueCasoUso` | testes de domínio/aplicação e E2E |
| RF05 | Abrir OS por CPF/CNPJ e veículo | `AbrirOrdemServicoCasoUso` | `abrir-ordem-servico.caso-uso.teste.ts` e E2E |
| RF06 | Definir serviços, peças e quantidades | `DefinirComposicaoOrdemServicoCasoUso` | teste unitário e E2E |
| RF07 | Gerar e disponibilizar orçamento | `GerarOrcamentoCasoUso`; acompanhamento | testes unitários e E2E |
| RF08 | Aprovar/rejeitar orçamento | casos de uso `DecidirOrcamento*` | testes unitários e E2E com rollback |
| RF09 | Controlar status da OS | `ExecutarAcaoOrdemServicoCasoUso`; `OrdemServico` | testes de domínio e gerenciamento |
| RF10 | Consultar acompanhamento público | `ConsultarAcompanhamentoCasoUso` | teste unitário e E2E |
| RF11 | Listar/detalhar ordens | `ListarOrdensServicoCasoUso`; `ObterOrdemServicoCasoUso` | testes unitários e E2E |
| RF12 | Calcular tempo médio | `ObterTempoMedioServicosCasoUso` | teste unitário e E2E |

## Requisitos não funcionais

| ID | Requisito | Evidência |
|---|---|---|
| RNF01 | Autenticação administrativa | guarda JWT global e rotas públicas explicitamente decoradas |
| RNF02 | Consistência | transações Prisma e baixa condicional de estoque |
| RNF03 | Cobertura mínima de 80% | limiar Jest e 100% no escopo configurado |
| RNF04 | Execução local | Dockerfile, Compose e README |
| RNF05 | Documentação da API | Swagger em `/docs` |
| RNF06 | Isolamento de testes | E2E exige banco cujo nome termina em `_teste` |
| RNF07 | Validação de dados | DTOs, `CpfCnpj` e `Placa` |
| RNF08 | Rastreabilidade | matriz de aderência, documentos DDD e commits da branch |
