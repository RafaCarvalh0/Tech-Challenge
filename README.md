# Tech Challenge - Sistema de Oficina

## Objetivo do projeto

Desenvolver uma API para apoiar o atendimento, orçamento, execução e acompanhamento de serviços de uma oficina mecânica.

## Descrição resumida da solução

MVP de um sistema integrado que permite à oficina cadastrar clientes, veículos, serviços e peças/insumos; abrir e acompanhar ordens de serviço; gerar orçamentos; controlar estoque; e disponibilizar ao cliente um acompanhamento público protegido por código privado.

## Funcionalidades implementadas

- CRUD de clientes, veículos, serviços e peças/insumos.
- Validação e normalização de CPF/CNPJ.
- Validação de placas brasileiras antigas e Mercosul.
- Abertura, listagem, detalhamento e transições de ordens de serviço.
- Composição da OS, orçamento automático, aprovação e controle de estoque.
- Validação de propriedade do veículo antes da criação da OS.
- Autenticação JWT das APIs administrativas.
- Acompanhamento público da OS com código privado.
- Abertura transacional de veículo e OS.
- Indicador administrativo de tempo médio de execução por serviço.
- Swagger/OpenAPI.
- Testes unitários, cobertura e fluxo E2E com PostgreSQL real.

## Arquitetura

O projeto é um monólito modular organizado em quatro camadas:

- `dominio`: entidades, objetos de valor e regras de negócio.
- `aplicacao`: casos de uso e contratos de repositório.
- `infraestrutura`: persistência PostgreSQL com Prisma.
- `apresentacao`: controllers REST, DTOs e documentação Swagger.

Os módulos são `autenticacao`, `clientes`, `veiculos`, `servicos`, `pecas-insumos`, `ordens-servico`, `acompanhamento` e `indicadores`. O domínio não depende de NestJS ou Prisma.

## Tecnologias

- Node.js 24
- TypeScript
- NestJS 11
- PostgreSQL 17
- Prisma ORM 6
- Jest e Supertest
- Swagger/OpenAPI
- Docker e Docker Compose

## Por que PostgreSQL

Clientes, veículos e ordens de serviço possuem relações claras e precisam de integridade referencial. O PostgreSQL oferece transações ACID, constraints, índices e bom suporte para consultas relacionais, sendo adequado para controle de estoque, orçamento e histórico nas próximas etapas.

## Pré-requisitos

- Node.js 24 ou superior
- npm
- Docker Desktop com Docker Compose

## Execução com Docker

Antes da primeira execução, copie `.env.example` para `.env` e substitua `SEGREDO_JWT`, `USUARIO_ADMINISTRADOR` e `SENHA_ADMINISTRADOR` por valores próprios.

```bash
docker compose up --build
```

A API ficará disponível em `http://localhost:3000/api` e o Swagger em `http://localhost:3000/docs`.

Para encerrar o ambiente sem apagar os dados:

```bash
docker compose down
```

## Execução local

Antes da primeira execução, copie `.env.example` para `.env`.

Para iniciar todo o ambiente local com um único comando:

```bash
npm run iniciar
```

O comando inicia o banco PostgreSQL no Docker, instala as dependências,
gera o Prisma, aplica as migrations e mantém a API em execução.

Ou execute as etapas manualmente:

1. Inicie apenas o PostgreSQL:

```bash
docker compose up -d banco-dados
```

2. Instale as dependências e prepare o banco:

```bash
npm ci
npm run prisma:generate
npm run prisma:deploy
```

3. Inicie a API:

```bash
npm run start:dev
```

## Endpoints principais

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/saude` | Verifica a saúde da API |
| POST | `/api/autenticacao/login` | Obtém o token administrativo |
| POST | `/api/clientes` | Cadastra um cliente |
| GET | `/api/clientes` | Lista clientes |
| GET | `/api/clientes/:identificador` | Detalha um cliente |
| PATCH | `/api/clientes/:identificador` | Atualiza um cliente |
| DELETE | `/api/clientes/:identificador` | Exclui um cliente |
| POST | `/api/veiculos` | Cadastra um veículo |
| GET | `/api/veiculos` | Lista veículos |
| GET | `/api/veiculos/:identificador` | Detalha um veículo |
| PATCH | `/api/veiculos/:identificador` | Atualiza um veículo |
| DELETE | `/api/veiculos/:identificador` | Exclui um veículo |
| POST | `/api/servicos` | Cadastra um serviço |
| GET | `/api/servicos` | Lista serviços |
| GET | `/api/servicos/:identificador` | Detalha um serviço |
| PATCH | `/api/servicos/:identificador` | Atualiza um serviço |
| DELETE | `/api/servicos/:identificador` | Exclui um serviço |
| POST | `/api/pecas-insumos` | Cadastra uma peça ou insumo |
| GET | `/api/pecas-insumos` | Lista peças e insumos |
| GET | `/api/pecas-insumos/:identificador` | Detalha uma peça ou insumo |
| PATCH | `/api/pecas-insumos/:identificador` | Atualiza uma peça ou insumo |
| PATCH | `/api/pecas-insumos/:identificador/estoque` | Registra entrada ou saída de estoque |
| DELETE | `/api/pecas-insumos/:identificador` | Exclui uma peça ou insumo |
| POST | `/api/ordens-servico` | Cria uma ordem de serviço |
| POST | `/api/ordens-servico/abertura` | Abre uma OS por CPF/CNPJ |
| GET | `/api/ordens-servico` | Lista ordens, com filtros opcionais |
| GET | `/api/ordens-servico/:identificador` | Consulta uma ordem de serviço |
| PUT | `/api/ordens-servico/:identificador/composicao` | Define serviços, peças e insumos da OS |
| POST | `/api/ordens-servico/:identificador/orcamento` | Gera e disponibiliza o orçamento |
| PATCH | `/api/ordens-servico/:identificador/orcamento/decisao` | Registra aprovação ou rejeição do orçamento |
| PATCH | `/api/ordens-servico/:identificador/acoes/:acao` | Executa uma transição de status da OS |
| GET | `/api/acompanhamento/ordens-servico/:identificador` | Consulta pública com `X-Codigo-Acompanhamento` |
| PATCH | `/api/acompanhamento/ordens-servico/:identificador/orcamento/decisao` | Registra a decisão pública do cliente com `X-Codigo-Acompanhamento` |
| GET | `/api/indicadores/tempo-medio-servicos` | Calcula o tempo médio de execução por serviço |

As rotas administrativas exigem `Authorization: Bearer <token>`. As ações aceitas para a OS são `INICIAR_DIAGNOSTICO`, `SOLICITAR_APROVACAO`, `APROVAR`, `REJEITAR`, `FINALIZAR` e `ENTREGAR`. O contrato completo, incluindo corpos e respostas, está disponível no Swagger.

## Autenticação administrativa

Defina `USUARIO_ADMINISTRADOR`, `SENHA_ADMINISTRADOR` e `SEGREDO_JWT` no arquivo `.env`. Os valores do `.env.example` são somente exemplos e a senha deve ser substituída antes da execução.

Envie as credenciais configuradas para `POST /api/autenticacao/login`:

```json
{
  "usuario": "administrador",
  "senha": "senha-configurada-no-env"
}
```

Use o token retornado no cabeçalho `Authorization: Bearer <token>` das rotas administrativas. Apenas `/api/saude`, `/api/autenticacao/login` e as rotas de acompanhamento com código privado são públicas.

## Testes

Testes unitários:

```bash
npm test -- --runInBand
```

Cobertura dos domínios críticos:

```bash
npm run test:cov -- --runInBand
```

Testes E2E usam obrigatoriamente um banco temporário cujo nome termina em `_teste`. A proteção impede que a limpeza do teste seja executada no banco normal de desenvolvimento.

Inicie o banco exclusivo:

```bash
docker compose --profile test up -d banco-dados-teste
```

No PowerShell:

```powershell
$env:URL_BANCO_DADOS="postgresql://postgres:postgres@localhost:5433/oficina_teste?schema=public"
npm run prisma:deploy
npm run test:ponta-a-ponta -- --runInBand
```

No Bash:

```bash
export URL_BANCO_DADOS="postgresql://postgres:postgres@localhost:5433/oficina_teste?schema=public"
npm run prisma:deploy
npm run test:ponta-a-ponta -- --runInBand
```

O serviço `banco-dados-teste` usa armazenamento temporário e pode ser encerrado com `docker compose --profile test stop banco-dados-teste`.

O limite configurado é de 80% para statements, branches, functions e lines nas camadas `dominio` e `aplicacao`. A configuração também inclui o domínio compartilhado.

## Segurança

A API valida os dados recebidos e bloqueia campos não declarados nos DTOs. O relatório atualizado de dependências está em `docs/security/npm-audit-2026-10-28.md`.

A autenticação JWT protege todas as APIs administrativas. As credenciais e o segredo são obrigatoriamente configurados por variáveis de ambiente; a rota de saúde e o acompanhamento com código privado permanecem públicos.

## Estrutura principal

```text
src/
  banco-dados/
  saude/
  modulos/
    clientes/
    veiculos/
    servicos/
    pecas-insumos/
    ordens-servico/
    autenticacao/
    acompanhamento/
    indicadores/
  compartilhado/
prisma/
  migrations/
  schema.prisma
testes/
```

## Materiais da entrega acadêmica

Substitua os links abaixo antes da entrega final:

- Documentação DDD: [ADICIONAR_LINK_DA_DOCUMENTACAO_DDD](COLE_AQUI_O_LINK_DA_DOCUMENTACAO_DDD)
- Vídeo da entrega: [ADICIONAR_LINK_DO_VIDEO](COLE_AQUI_O_LINK_DO_VIDEO)
