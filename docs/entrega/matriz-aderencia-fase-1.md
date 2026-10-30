# Matriz de aderência — Fase 1

## Versão em preparação

- Branch: `docs/completa-materiais-entrega-fase-1`
- Commit-base: `a19f537e52d3c1faa9070f71ed716944a038d649`
- Enunciado: `Fase 1 - Tech Challenge.pdf`, páginas 4 a 11
- Estados permitidos: `FEITO`, `PARCIAL`, `PENDENTE` e `NÃO APLICÁVEL`
- Observação: o hash acima identifica o início da preparação, não a versão final.

## Funcionalidades e requisitos técnicos

| Requisito | Evidência no código | Evidência no Miro | Arquivo exportado | Status |
|---|---|---|---|---|
| Identificar cliente por CPF/CNPJ | `abrir-ordem-servico.caso-uso.ts`, `cpf-cnpj.ts` | 05 e 10 | `docs/ddd/event-storming.pdf` | FEITO |
| Cadastrar veículo com placa, marca, modelo e ano | `veiculo.controller.ts`, `criar-veiculo.caso-uso.ts`, `placa.ts` | 05 e 10 | `docs/ddd/diagramas.pdf` | FEITO |
| Incluir serviços na OS | `definir-composicao-ordem-servico.caso-uso.ts` | 05 | `docs/ddd/event-storming.pdf` | FEITO |
| Incluir peças e insumos na OS | `definir-composicao-ordem-servico.caso-uso.ts` | 05 e 07 | `docs/ddd/event-storming.pdf` | FEITO |
| Gerar automaticamente o orçamento | `gerar-orcamento.caso-uso.ts` e `prisma-orcamento.repositorio.ts` | 05 | `docs/ddd/event-storming.pdf` | FEITO |
| Disponibilizar orçamento para aprovação | `acompanhamento.controller.ts`, consulta pelo código | 05 e 06 | `docs/ddd/event-storming.pdf` | FEITO |
| Registrar aprovação ou rejeição | `decidir-orcamento*.caso-uso.ts` | 05 e 06 | `docs/ddd/event-storming.pdf` | FEITO |
| Status RECEBIDA, EM_DIAGNOSTICO, AGUARDANDO_APROVACAO, EM_EXECUCAO, FINALIZADA e ENTREGUE | `status-ordem-servico.ts`, `ordem-servico.ts` e enum Prisma | 06 e 11 | `docs/ddd/diagramas.pdf` | FEITO |
| Controlar alterações e regras de transição | `ordem-servico.ts` e `executar-acao-ordem-servico.caso-uso.ts` | 06 e 11 | `docs/ddd/diagramas.pdf` | FEITO |
| Consulta pública do andamento da OS | `consultar-acompanhamento.caso-uso.ts` e `acompanhamento.controller.ts` | 06 | `docs/ddd/event-storming.pdf` | FEITO |
| CRUD de clientes | `cliente.controller.ts` e casos de uso de clientes | 02, 08 e 10 | `docs/ddd/diagramas.pdf` | FEITO |
| CRUD de veículos | `veiculo.controller.ts` e casos de uso de veículos | 02, 08 e 10 | `docs/ddd/diagramas.pdf` | FEITO |
| CRUD de serviços | `servico.controller.ts` e casos de uso de serviços | 02, 08 e 10 | `docs/ddd/diagramas.pdf` | FEITO |
| CRUD de peças e insumos | `peca-insumo.controller.ts` e respectivos casos de uso | 02, 07, 08 e 10 | `docs/ddd/diagramas.pdf` | FEITO |
| Controle de estoque | `movimentar-estoque.caso-uso.ts`, `peca-insumo.ts` e transação de aprovação | 07 | `docs/ddd/event-storming.pdf` | FEITO |
| Listar e detalhar ordens de serviço | `listar-ordens-servico.caso-uso.ts`, `obter-ordem-servico.caso-uso.ts` | 02 e 06 | `docs/ddd/event-storming.pdf` | FEITO |
| Calcular tempo médio de execução | `obter-tempo-medio-servicos.caso-uso.ts` e repositório Prisma | 06 e 14 | `docs/qualidade/evidencias-testes.md` | FEITO |
| Back-end monolítico em camadas | `src/aplicacao.module.ts` e módulos NestJS separados em apresentação/aplicação/domínio/infraestrutura | 02 e 18 | `docs/arquitetura/c4.md` | FEITO |
| Banco livre com decisão justificada | PostgreSQL em `prisma/schema.prisma` e `docker-compose.yml` | 14 | `docs/arquitetura/adr/0002-postgresql-e-prisma.md` | PARCIAL |
| APIs RESTful | Controllers em `src/modulos/*/apresentacao` | 02 | `docs/arquitetura/c4.md` | FEITO |
| Swagger/OpenAPI | configuração em `src/principal.ts`, acesso em `/docs` | 14 | README | FEITO |
| Autenticação JWT administrativa | `autenticacao-jwt.guarda.ts`, `jwt.servico.ts`, `autenticacao.controller.ts` | 14 | `docs/security/owasp-top-10.md` | FEITO |
| Validar CPF/CNPJ | `cpf-cnpj.ts` e testes | 10 e 13 | `docs/ddd/diagramas.pdf` | FEITO |
| Validar placa | `placa.ts` e testes | 10 e 13 | `docs/ddd/diagramas.pdf` | FEITO |
| Testes unitários | 33 suítes e 130 testes validados em 30/10/2026 | 14 | `docs/qualidade/evidencias-testes.md` | FEITO |
| Testes de integração dos fluxos principais | 4 suítes e 26 testes E2E com PostgreSQL `oficina_teste` | 14 | `docs/qualidade/evidencias-testes.md` | FEITO |
| Cobertura mínima de 80% nos domínios críticos | `package.json`: limiar 80%; execução validada com 100% no escopo configurado | 14 | `docs/qualidade/evidencias-testes.md` | FEITO |
| Execução local simples | `README.md`, `Dockerfile`, `docker-compose.yml`, script `iniciar` | 14 | README | FEITO |
| Dockerfile para build | `Dockerfile` | 14 | README | FEITO |
| Docker Compose para ambiente completo | `docker-compose.yml` | 14 | README | FEITO |
| Transações nos fluxos principais | repositórios Prisma de abertura, composição e orçamento | 07 e 14 | `docs/arquitetura/adr/0004-transacoes-e-controle-de-concorrencia.md` | PARCIAL |
| Relatório de vulnerabilidades | `npm audit` executado; formalização ainda será versionada | 14 | `docs/security/npm-audit-2026-10-30.md` | PARCIAL |

## README, repositório e versão

| Requisito | Evidência no código | Evidência no Miro | Arquivo exportado | Status |
|---|---|---|---|---|
| Repositório público durante a avaliação | URL pública ainda não confirmada | 15 | PDF final | PENDENTE |
| Versão identificada por branch/tag/hash | branch registrada; hash final somente após conclusão | 15 | PDF final | PARCIAL |
| Código igual ao vídeo e à documentação | depende da gravação e do hash final | 16 | PDF final | PENDENTE |
| Ausência de credenciais, senhas, tokens e segredos | `.gitignore` e variáveis de ambiente; varredura final pendente | 14 | checklist final | PARCIAL |
| Branch `main` protegida e integração por PR | configuração externa ao repositório | 04 | PDF final | PENDENTE |
| README: objetivo | seção `Objetivo` | 01 | README | FEITO |
| README: resumo da solução | seção `Solução` | 01 | README | FEITO |
| README: arquitetura | seção `Arquitetura` | 02 | README | FEITO |
| README: tecnologias | seção `Tecnologias` | 14 | README | FEITO |
| README: pré-requisitos | seção `Pré-requisitos` | 14 | README | FEITO |
| README: execução | seção `Execução` | 14 | README | FEITO |
| README: testes | seção `Testes` | 14 | README | FEITO |
| README: acesso ao Swagger | seção de documentação da API | 14 | README | FEITO |
| README: decisão do banco | justificativa PostgreSQL/Prisma | 14 | README | FEITO |
| README: autenticação/credenciais | procedimento de login e variáveis de demonstração | 14 | README | FEITO |
| README: diretórios principais | seção de estrutura | 02 | README | FEITO |
| README: link DDD | placeholder deve ser substituído pelo índice e Miro | 15 | `docs/ddd/README.md` | PARCIAL |
| README: link do vídeo | URL ainda não fornecida | 16 | PDF final | PENDENTE |

## Documentação DDD

| Requisito | Evidência no código | Evidência no Miro | Arquivo exportado | Status |
|---|---|---|---|---|
| Link DDD direto e sem permissão manual | board `uXjVEXBA6FI`; acesso anônimo ainda deve ser validado | 01 | `docs/ddd/README.md` | PARCIAL |
| Event Storming da criação da OS | casos de uso de abertura, composição e orçamento | 05 | `docs/ddd/event-storming.pdf` | PARCIAL |
| Event Storming do acompanhamento | módulos de acompanhamento, OS e indicadores | 06 | `docs/ddd/event-storming.pdf` | PARCIAL |
| Event Storming de peças e insumos | módulo `pecas-insumos` e aprovação transacional | 07 | `docs/ddd/event-storming.pdf` | PARCIAL |
| Eventos, comandos, políticas/regras e atores | fluxos implementados nos casos de uso e entidades | 05, 06, 07 e 08 | `docs/ddd/event-storming.pdf` | PARCIAL |
| Agregados, entidades e objetos de valor | classes de domínio; classificação será corrigida | 08, 10 e 13 | `docs/ddd/diagramas.pdf` | PARCIAL |
| Bounded Contexts | módulos lógicos do monólito | 09 | `docs/ddd/diagramas.pdf` | PARCIAL |
| Diagramas solicitados em DDD | modelo/ciclo existentes; Domain Storytelling e camadas pendentes | 10, 11, 17 e 18 | `docs/ddd/diagramas.pdf` | PARCIAL |
| Linguagem Ubíqua e glossário | nomes reais do domínio | 12 | `docs/ddd/linguagem-ubiqua.md` | PARCIAL |
| Relação documentação x código | classes, casos de uso e persistência | 13 | `docs/ddd/README.md` | PARCIAL |
| Exportações DDD no repositório | diretório ainda será criado | 05–13, 17 e 18 | `docs/ddd/event-storming.pdf` e `docs/ddd/diagramas.pdf` | PENDENTE |

## PDF e vídeo

| Requisito | Evidência no código | Evidência no Miro | Arquivo exportado | Status |
|---|---|---|---|---|
| PDF único com informações e links | conteúdo planejado | 15 | `docs/entrega/fase-1-tech-challenge.pdf` | PENDENTE |
| Identificação: curso, fase, grupo, integrantes, RMs, Discord e tecnologias | dados pessoais não fornecidos serão marcados `PENDENTE` | 15 | PDF final | PENDENTE |
| Links completos dos repositórios | URL não confirmada | 15 | PDF final | PENDENTE |
| Branch e hash final no PDF | disponível somente no fechamento | 15 | PDF final | PENDENTE |
| Vídeo público no YouTube, até 15 minutos | gravação/publicação depende do grupo | 16 | PDF final | PENDENTE |
| Vídeo com áudio, funcionamento, documentação, arquitetura e integrantes | roteiro será preparado; gravação depende do grupo | 16 | `docs/entrega/roteiro-video.md` | PENDENTE |
| Vídeo demonstra proposta, camadas, banco, DDD/Event Storming, fluxos, JWT, execução, Swagger, testes e vulnerabilidades | roteiro detalhado existente será alinhado ao commit final | 16 | `docs/entrega/roteiro-video.md` | PARCIAL |

## Responsabilidade pelas pendências

- **Execução neste plano:** correção do Miro, exportações, documentação versionada, evidências, README e PDF final.
- **Responsabilidade do grupo:** dados de identificação, URL definitiva do repositório, proteção da `main`, gravação/publicação do vídeo e validação anônima dos links.
