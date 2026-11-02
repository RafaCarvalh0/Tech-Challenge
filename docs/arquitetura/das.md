# DAS — Design Approval Sheet

## 1. Identificação

| Campo | Valor |
|---|---|
| Projeto | Tech Challenge — Oficina Mecânica |
| Identificador do DAS | `DAS-TC-OFICINA-F1-G32` |
| Versão do documento | `0.2.0` |
| Estado | Em revisão final |
| Data de criação | 30/10/2026 |
| Última revisão | 02/11/2026 |
| Curso | SOAT — Software Architecture |
| Fase | 1 |
| Grupo | 32 |
| Responsável | Rafael Abreu de Carvalho — RM378596 |
| Discord | Rafael Carvalho - rm378596 |

## 2. Contexto, objetivo e valor

O projeto entrega o MVP de um sistema integrado para oficina mecânica. A equipe administrativa cadastra clientes, veículos, serviços e peças/insumos; abre e acompanha ordens de serviço; define a composição; gera orçamentos; controla estoque; executa transições de status; e consulta o tempo médio de execução. O cliente acompanha a própria OS e decide sobre o orçamento por meio de um código privado, sem precisar de conta administrativa.

O sistema substitui controles fragmentados por um fluxo rastreável, reduz risco de inconsistência entre orçamento, estoque e execução, e disponibiliza uma visão objetiva do andamento da OS.

### Escopo desta fase

- API REST e documentação Swagger.
- Autenticação administrativa por JWT.
- Acompanhamento público protegido por código privado.
- Persistência relacional, migrations e execução com Docker Compose.
- Testes unitários, de repositório e E2E.

### Fora do escopo

Front-end próprio, pagamentos, notificações, mensageria, microsserviços, integrações externas, alta disponibilidade e operação em nuvem.

## 3. Requisitos e restrições

Os requisitos completos e sua rastreabilidade estão em [requisitos.md](requisitos.md).

### Requisitos funcionais resumidos

1. Manter clientes, veículos, serviços e peças/insumos.
2. Abrir e consultar ordens de serviço.
3. Controlar o ciclo da OS e suas transições válidas.
4. Definir serviços, peças e quantidades da composição.
5. Gerar, aprovar ou rejeitar orçamento.
6. Controlar estoque com baixa transacional.
7. Permitir acompanhamento público por código privado.
8. Calcular o tempo médio de execução por serviço.

### Requisitos não funcionais e restrições

| Tema | Decisão ou restrição |
|---|---|
| Arquitetura | Monólito modular em camadas; Bounded Contexts lógicos no mesmo processo |
| Segurança | JWT nas rotas administrativas e código privado no acompanhamento |
| Consistência | Transações e atualização condicional de estoque |
| Qualidade | Cobertura mínima de 80% e banco E2E isolado |
| Execução | Ambiente local reproduzível com Docker Compose |
| Documentação | Swagger, C4, ADRs, DDD e rastreabilidade no repositório |

## 4. Arquitetura e tecnologias

| Tecnologia ou abordagem | Uso | Justificativa |
|---|---|---|
| NestJS 11 e TypeScript | API e composição dos módulos | Estrutura modular, injeção de dependência, validação e integração com Swagger |
| Monólito modular | Unidade de implantação | Menor custo operacional para o MVP, mantendo limites de domínio e evolução organizada |
| PostgreSQL 17 | Banco relacional | Integridade referencial, transações ACID e consultas relacionais adequadas ao domínio |
| Prisma 6.19.3 | ORM, migrations e transações | Cliente tipado, schema versionado e suporte aos fluxos transacionais implementados |
| JWT | Autenticação administrativa | Mecanismo stateless adequado à API REST e ao escopo atual |
| Código de acompanhamento | Acesso do cliente | Evita ampliar o MVP com identidade completa do cliente sem expor a OS apenas pelo ID |
| Docker Compose | Execução local | Reproduz aplicação, migração e PostgreSQL com configuração versionada |
| Jest e Supertest | Testes | Suporte a testes unitários, cobertura e validação E2E da API |

Consulte também a [visão arquitetural HLD/LLD](visao-arquitetural.md).

## 5. Estrutura da arquitetura — C4 Model

Os diagramas e suas descrições estão em [c4.md](c4.md).

| Nível/visão | Representação da solução |
|---|---|
| C1 — Contexto | Cliente e equipe da oficina interagem com o sistema de gestão da oficina |
| C2 — Contêineres | API NestJS, processo de migração Prisma e PostgreSQL |
| C3 — Componentes | Módulos de autenticação, clientes, veículos, serviços, peças, OS, acompanhamento, indicadores e persistência |
| C4 — Código | Intencionalmente referenciado ao código e ao modelo DDD, pois é opcional e não deve duplicar a implementação |
| Visão dinâmica | Sequência de aprovação do orçamento e baixa transacional de estoque |
| Implantação | Contêineres Docker, portas, rede interna e volume persistente local |

## 6. Modelo de domínio e de dados

- Modelo de domínio e diagramas: [documentação DDD](../ddd/README.md) e [diagramas exportados](../ddd/diagramas.pdf).
- Modelo relacional executável: `prisma/schema.prisma`.
- Evolução do banco: `prisma/migrations/`.
- Linguagem do domínio: [linguagem ubíqua](../ddd/linguagem-ubiqua.md).

As entidades principais são Cliente, Veículo, Serviço, Peça/Insumo, Ordem de Serviço, Composição e Orçamento. A OS referencia cliente e veículo; composição e orçamento pertencem à OS; a composição mantém snapshots dos itens e preços utilizados no cálculo.

## 7. Decisões de arquitetura

| ADR | Data | Estado | Decisão |
|---|---|---|---|
| [0001](adr/0001-monolito-modular-em-camadas.md) | 30/10/2026 | Aceita | Monólito modular em quatro camadas |
| [0002](adr/0002-postgresql-e-prisma.md) | 30/10/2026 | Aceita | PostgreSQL 17 e Prisma 6.19.3 |
| [0003](adr/0003-jwt-e-codigo-de-acompanhamento.md) | 30/10/2026 | Aceita | JWT administrativo e código privado para o cliente |
| [0004](adr/0004-transacoes-e-controle-de-concorrencia.md) | 30/10/2026 | Aceita | Transações e baixa condicional de estoque |

ADRs aceitas não devem ser alteradas para representar uma nova decisão. Uma mudança futura deve gerar uma nova ADR que substitua a anterior e preserve o histórico.

## 8. Documentação da API

- Swagger local: `http://localhost:3000/docs`.
- Saúde da aplicação: `GET http://localhost:3000/api/saude`.
- Tabela de endpoints e autenticação: [README](../../README.md#endpoints-principais).
- Contrato executável: decorators e DTOs em `src/modulos/*/apresentacao/`.

As rotas administrativas exigem Bearer JWT. As rotas de acompanhamento exigem `X-Codigo-Acompanhamento` e não exigem JWT.

## 9. Instalação, configuração e implantação

O procedimento completo está no [README](../../README.md#execução-com-docker).

Fluxo resumido:

1. Criar `.env` a partir de `.env.example` e substituir os segredos de demonstração.
2. Executar `docker compose up -d --build`.
3. Aguardar a saúde do PostgreSQL e a conclusão do contêiner de migração.
4. Validar `GET /api/saude` e abrir `/docs`.

O ambiente local possui API na porta `3000`, PostgreSQL na porta `5432` e volume `postgres_data`. O banco E2E usa `oficina_teste` na porta `5433` quando o perfil de testes é ativado.

## 10. Plano de testes e monitoramento

| Verificação | Ferramenta/escopo | Evidência |
|---|---|---|
| Análise estática | ESLint | [estratégia de testes](../qualidade/estrategia-testes.md) |
| Build | Nest CLI/TypeScript | [evidências](../qualidade/evidencias-testes.md) |
| Testes unitários | Jest | 33 suítes e 130 testes aprovados |
| Cobertura | Jest Coverage | 100% no escopo configurado, acima do mínimo de 80% |
| Testes E2E | Jest e Supertest com PostgreSQL isolado | 4 suítes e 26 testes aprovados |
| Monitoramento | Não implementado nesta fase | Fora do escopo do MVP local; produção exigiria logs estruturados, métricas, alertas e verificação de saúde |

## 11. Segurança, compliance e riscos

- JWT protege as operações administrativas; o segredo é fornecido por variável de ambiente.
- O código de acompanhamento deve ser tratado como segredo temporário do cliente.
- DTOs, objetos de valor e validação global rejeitam entradas inválidas e campos não previstos.
- Prisma utiliza queries parametrizadas e transações para reduzir riscos de injeção e inconsistência.
- `.env` e credenciais reais não devem ser versionados ou exibidos na entrega.
- O projeto utiliza dados fictícios de demonstração; uma operação real exigiria política de retenção, direitos do titular, base legal e demais controles de LGPD.
- Checklist detalhado: [OWASP Top 10](../security/owasp-top-10.md).
- Auditoria vigente: [npm audit de 31/10/2026](../security/npm-audit-2026-10-31.md).

Riscos conhecidos: 36 vulnerabilidades na auditoria completa e 3 altas na auditoria sem dependências de desenvolvimento, ausência de rate limiting, logging estruturado e monitoramento. Não aplicar `npm audit fix --force`; atualizações principais devem ocorrer em branch dedicada com regressão completa.

## 12. Continuidade e backup

O ambiente local mantém os dados no volume Docker `postgres_data`, o que evita perda ao recriar apenas os contêineres. Isso não constitui uma estratégia completa de backup.

Backup automatizado, retenção, restauração testada, recuperação de desastre e alta disponibilidade não fazem parte do MVP. Antes de uso produtivo, a solução deve definir rotina de `pg_dump`, armazenamento externo protegido, período de retenção, teste periódico de restauração e objetivos de recuperação (RPO/RTO).

## 13. Critérios de aprovação

| Critério | Situação |
|---|---|
| Requisitos obrigatórios implementados e rastreados | Aprovado |
| Arquitetura C4 e documentação DDD coerentes com o código | Aprovado |
| ADRs aceitas e centralizadas | Aprovado |
| Lint, build, testes e cobertura validados | Aprovado em `6eb499e`; os commits posteriores não alteram o código da aplicação |
| Swagger e execução Docker documentados | Aprovado |
| Riscos de segurança registrados | Aprovado com riscos conhecidos |
| Commit final, vídeo e PDF externo | Registrados no PDF da entrega; situação na [matriz de aderência](../entrega/matriz-aderencia-fase-1.md) |

## 14. Aprovação acadêmica

- Responsável: Rafael Abreu de Carvalho — RM378596.
- Data da revisão: 02/11/2026.
- Resultado: solução e documentação técnica aptas; o commit definitivo e os materiais externos estão indicados no PDF da entrega.
- Commit aprovado: informado no PDF da entrega; última validação técnica em `6eb499edef5dba4210998a169a97969e2b615a0e`.

## 15. Histórico do documento

| Versão | Data | Alteração |
|---|---|---|
| 0.1.0 | 30/10/2026 | Consolidação inicial da solução, ADRs, testes e riscos |
| 0.2.0 | 31/10/2026 | Alinhamento ao template DAS: C4, dados, API, instalação, monitoramento, segurança, continuidade e aprovação |
| 0.3.0 | 02/11/2026 | Atualização das referências de versão da entrega |
