# Matriz de aderência — Fase 1

## Versão da entrega

- Branch: `main`
- Último commit técnico validado: `6eb499edef5dba4210998a169a97969e2b615a0e`
- Enunciado: `Fase 1 - Tech Challenge.pdf`, páginas 4 a 11
- Curso: SOAT — Software Architecture
- Fase: 1 | Grupo: 32
- Integrante: Rafael Abreu de Carvalho — RM378596 | Discord: Rafael Carvalho - rm378596
- Estados permitidos: `FEITO`, `PARCIAL`, `PENDENTE` e `NÃO APLICÁVEL`
- Observação: o hash acima identifica a rodada técnica validada. O hash final está no PDF da entrega, e os commits posteriores não alteram o código da aplicação.
- Organização do Miro: o board principal Tech Challenge está organizado em 15 quadros numerados. O quadro 04 foi alinhado à autenticação administrativa, o quadro 13 à auditoria de 31/10/2026 e as exportações DDD foram atualizadas e revisadas.

## Funcionalidades e requisitos técnicos

| Requisito | Evidência no código | Evidência no Miro | Arquivo exportado | Status |
|---|---|---|---|---|
| Identificar cliente por CPF/CNPJ | `abrir-ordem-servico.caso-uso.ts`, `cpf-cnpj.ts` | 04 e 09 | `docs/ddd/event-storming.pdf` | FEITO |
| Cadastrar veículo com placa, marca, modelo e ano | `veiculo.controller.ts`, `criar-veiculo.caso-uso.ts`, `placa.ts` | 04 e 09 | `docs/ddd/diagramas.pdf` | FEITO |
| Incluir serviços na OS | `definir-composicao-ordem-servico.caso-uso.ts` | 04 | `docs/ddd/event-storming.pdf` | FEITO |
| Incluir peças e insumos na OS | `definir-composicao-ordem-servico.caso-uso.ts` | 04 e 06 | `docs/ddd/event-storming.pdf` | FEITO |
| Gerar automaticamente o orçamento | `gerar-orcamento.caso-uso.ts` e `prisma-orcamento.repositorio.ts` | 04 | `docs/ddd/event-storming.pdf` | FEITO |
| Disponibilizar orçamento para aprovação | `acompanhamento.controller.ts`, consulta pelo código | 04 e 05 | `docs/ddd/event-storming.pdf` | FEITO |
| Registrar aprovação ou rejeição | `decidir-orcamento*.caso-uso.ts` | 04 e 05 | `docs/ddd/event-storming.pdf` | FEITO |
| Status RECEBIDA, EM_DIAGNOSTICO, AGUARDANDO_APROVACAO, EM_EXECUCAO, FINALIZADA e ENTREGUE | `status-ordem-servico.ts`, `ordem-servico.ts` e enum Prisma | 05 e 10 | `docs/ddd/diagramas.pdf` | FEITO |
| Controlar alterações e regras de transição | `ordem-servico.ts` e `executar-acao-ordem-servico.caso-uso.ts` | 05 e 10 | `docs/ddd/diagramas.pdf` | FEITO |
| Consulta pública do andamento da OS | `consultar-acompanhamento.caso-uso.ts` e `acompanhamento.controller.ts` | 05 | `docs/ddd/event-storming.pdf` | FEITO |
| CRUD de clientes | `cliente.controller.ts` e casos de uso de clientes | 02, 07 e 09 | `docs/ddd/diagramas.pdf` | FEITO |
| CRUD de veículos | `veiculo.controller.ts` e casos de uso de veículos | 02, 07 e 09 | `docs/ddd/diagramas.pdf` | FEITO |
| CRUD de serviços | `servico.controller.ts` e casos de uso de serviços | 02, 07 e 09 | `docs/ddd/diagramas.pdf` | FEITO |
| CRUD de peças e insumos | `peca-insumo.controller.ts` e respectivos casos de uso | 02, 06, 07 e 09 | `docs/ddd/diagramas.pdf` | FEITO |
| Controle de estoque | `movimentar-estoque.caso-uso.ts`, `peca-insumo.ts` e transação de aprovação | 06 | `docs/ddd/event-storming.pdf` | FEITO |
| Listar e detalhar ordens de serviço | `listar-ordens-servico.caso-uso.ts`, `obter-ordem-servico.caso-uso.ts` | 02 e 05 | `docs/ddd/event-storming.pdf` | FEITO |
| Calcular tempo médio de execução | `obter-tempo-medio-servicos.caso-uso.ts` e repositório Prisma | 05 e 13 | `docs/qualidade/evidencias-testes.md` | FEITO |
| Back-end monolítico em camadas | `src/aplicacao.module.ts` e módulos NestJS separados em apresentação/aplicação/domínio/infraestrutura | 02 e 15 | `docs/arquitetura/c4.md` | FEITO |
| Banco livre com decisão justificada | PostgreSQL em `prisma/schema.prisma` e `docker-compose.yml` | 13 | `docs/arquitetura/adr/0002-postgresql-e-prisma.md` | FEITO |
| APIs RESTful | Controllers em `src/modulos/*/apresentacao` | 02 | `docs/arquitetura/c4.md` | FEITO |
| Swagger/OpenAPI | configuração em `src/principal.ts`, acesso em `/docs` | 13 | README | FEITO |
| Autenticação JWT administrativa | `autenticacao-jwt.guarda.ts`, `jwt.servico.ts`, `autenticacao.controller.ts` | 13 | `docs/security/owasp-top-10.md` | FEITO |
| Validar CPF/CNPJ | `cpf-cnpj.ts` e testes | 09 e 12 | `docs/ddd/diagramas.pdf` | FEITO |
| Validar placa | `placa.ts` e testes | 09 e 12 | `docs/ddd/diagramas.pdf` | FEITO |
| Testes unitários | 33 suítes e 130 testes validados em 31/10/2026 | 13 | `docs/qualidade/evidencias-testes.md` | FEITO |
| Testes de integração dos fluxos principais | 4 suítes e 26 testes E2E com PostgreSQL `oficina_teste` | 13 | `docs/qualidade/evidencias-testes.md` | FEITO |
| Cobertura mínima de 80% nos domínios críticos | `package.json`: limiar 80%; execução validada com 100% no escopo configurado | 13 | `docs/qualidade/evidencias-testes.md` | FEITO |
| Execução local simples | `README.md`, `Dockerfile`, `docker-compose.yml`, script `iniciar` | 13 | README | FEITO |
| Dockerfile para build | `Dockerfile` | 13 | README | FEITO |
| Docker Compose para ambiente completo | `docker-compose.yml` | 13 | README | FEITO |
| Transações nos fluxos principais | repositórios Prisma de abertura, composição e orçamento | 06 e 13 | `docs/arquitetura/adr/0004-transacoes-e-controle-de-concorrencia.md` | FEITO |
| Relatório de vulnerabilidades | `npm audit` e `npm audit --omit=dev` registrados em 31/10/2026 | 13 | `docs/security/npm-audit-2026-10-31.md` | FEITO |

## README, repositório e versão

| Requisito | Evidência no código | Evidência no Miro | Arquivo exportado | Status |
|---|---|---|---|---|
| Repositório público durante a avaliação | `https://github.com/RafaCarvalh0/Tech-Challenge` validado como público | N/A — evidência externa | PDF externo | FEITO |
| Versão identificada por branch/tag/hash | branch `main`; hash final registrado no PDF | N/A — evidência externa | PDF externo | FEITO |
| Código igual ao vídeo e à documentação | vídeo gravado com o código de `6eb499e`; commits posteriores não alteram o código da aplicação | N/A — evidência externa | PDF externo | FEITO |
| Ausência de credenciais, senhas, tokens e segredos | `.env` ignorado e não versionado; varredura de padrões comuns concluída | 13 | `.gitignore` | FEITO |
| Branch `main` protegida e integração por PR | proteção confirmada; integrações realizadas por Pull Request | N/A — configuração do repositório | PDF externo | FEITO |
| README: objetivo | seção `Objetivo` | 01 | README | FEITO |
| README: resumo da solução | seção `Solução` | 01 | README | FEITO |
| README: arquitetura | seção `Arquitetura` | 02 | README | FEITO |
| README: tecnologias | seção `Tecnologias` | 13 | README | FEITO |
| README: pré-requisitos | seção `Pré-requisitos` | 13 | README | FEITO |
| README: execução | seção `Execução` | 13 | README | FEITO |
| README: testes | seção `Testes` | 13 | README | FEITO |
| README: acesso ao Swagger | seção de documentação da API | 13 | README | FEITO |
| README: decisão do banco | justificativa PostgreSQL/Prisma | 13 | README | FEITO |
| README: autenticação/credenciais | procedimento de login e variáveis de demonstração | 13 | README | FEITO |
| README: diretórios principais | seção de estrutura | 02 | README | FEITO |
| README: link DDD | links para índice versionado e Miro | Board principal Tech Challenge | `docs/ddd/README.md` | FEITO |
| README: link do vídeo | seção `Materiais da entrega acadêmica` | N/A — evidência externa | README | FEITO |

## Documentação DDD

| Requisito | Evidência no código | Evidência no Miro | Arquivo exportado | Status |
|---|---|---|---|---|
| Link DDD direto e sem permissão manual | board `uXjVEXBA6FI` carregado em navegador isolado sem solicitação de permissão | 01 | `docs/ddd/README.md` | FEITO |
| Event Storming da criação da OS | Miro e exportação atualizados com o fluxo e o ator administrativo corretos | 04 | `docs/ddd/event-storming.pdf` | FEITO |
| Event Storming do acompanhamento | módulos de acompanhamento, OS e indicadores | 05 | `docs/ddd/event-storming.pdf` | FEITO |
| Event Storming de peças e insumos | módulo `pecas-insumos` e aprovação transacional | 06 | `docs/ddd/event-storming.pdf` | FEITO |
| Eventos, comandos, políticas/regras e atores | fluxos implementados e ator administrativo corrigido no quadro 04 e na exportação | 04, 05, 06 e 07 | `docs/ddd/event-storming.pdf` | FEITO |
| Agregados, entidades e objetos de valor | classificação corrigida conforme classes/interfaces/enums reais | 07, 09 e 12 | `docs/ddd/diagramas.pdf` | FEITO |
| Bounded Contexts | módulos lógicos, upstream/downstream e comunicação em processo | 08 | `docs/ddd/diagramas.pdf` | FEITO |
| Diagramas solicitados em DDD | modelo, ciclo, Domain Storytelling e camadas DDD | 09, 10, 14 e 15 | `docs/ddd/diagramas.pdf` | FEITO |
| Linguagem Ubíqua e glossário | nomes reais do domínio | 11 | `docs/ddd/linguagem-ubiqua.md` | FEITO |
| Relação documentação x código | classes, casos de uso e persistência | 12 | `docs/ddd/README.md` | FEITO |
| Exportações DDD no repositório | `event-storming.pdf` (quadros 04–06), `diagramas.pdf` (08, 09, 10, 14 e 15), `linguagem-ubiqua.md` (11) e `catalogo-e-rastreabilidade.md` (07 e 12) | 04–12, 14 e 15 | `docs/ddd/` | FEITO |

## PDF e vídeo

| Requisito | Evidência no código | Evidência no Miro | Arquivo exportado | Status |
|---|---|---|---|---|
| PDF único com informações e links | material de entrega externo ao repositório | N/A — evidência externa | PDF externo | FEITO |
| Identificação: curso, fase, grupo, integrantes, RMs, Discord e tecnologias | dados informados na primeira página do PDF | N/A — evidência externa | PDF externo | FEITO |
| Links completos dos repositórios | URL pública informada no PDF | N/A — evidência externa | PDF externo | FEITO |
| Branch e hash final no PDF | informados no fechamento | N/A — evidência externa | PDF externo | FEITO |
| Vídeo público no YouTube | [publicado como público](https://www.youtube.com/watch?v=O61U_2Skc6M) | N/A — evidência externa | README e PDF externo | FEITO |
| Duração do vídeo de até 15 minutos | duração atual de 15:19; ajustar no YouTube Studio | N/A — evidência externa | PDF externo | PENDENTE |
| Vídeo com áudio, funcionamento, documentação, arquitetura e integrantes | apresentação gravada com demonstração no Swagger | N/A — evidência externa | README e PDF externo | FEITO |
| Vídeo demonstra proposta, camadas, banco, DDD/Event Storming, fluxos, JWT, execução, Swagger, testes e vulnerabilidades | itens abordados na apresentação | N/A — evidência externa | README e PDF externo | FEITO |
