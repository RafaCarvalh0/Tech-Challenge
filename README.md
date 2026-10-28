# Tech Challenge - Sistema de Oficina

MVP de um sistema integrado para atendimento e execução de serviços de uma oficina mecânica.

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
- Swagger/OpenAPI.
- Testes unitários, cobertura e fluxo E2E com PostgreSQL real.

## Arquitetura

O projeto é um monólito modular organizado em quatro camadas:

- `dominio`: entidades, objetos de valor e regras de negócio.
- `aplicacao`: casos de uso e contratos de repositório.
- `infraestrutura`: persistência PostgreSQL com Prisma.
- `apresentacao`: controllers REST, DTOs e documentação Swagger.

Os módulos são `autenticacao`, `clientes`, `veiculos`, `servicos`, `pecas-insumos`, `ordens-servico` e `acompanhamento`. O domínio não depende de NestJS ou Prisma.

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

3. Instale as dependências e prepare o banco:

```bash
npm ci
npm run prisma:generate
npm run prisma:deploy
```

4. Inicie a API:

```bash
npm run start:dev
```

## Endpoints iniciais

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/saude` | Verifica a saúde da API |
| POST | `/api/autenticacao/login` | Obtém o token administrativo |
| POST | `/api/clientes` | Cadastra um cliente |
| POST | `/api/veiculos` | Cadastra um veículo |
| POST | `/api/ordens-servico` | Cria uma ordem de serviço |
| POST | `/api/ordens-servico/abertura` | Abre uma OS por CPF/CNPJ |
| GET | `/api/ordens-servico/:identificador` | Consulta uma ordem de serviço |
| GET | `/api/acompanhamento/ordens-servico/:identificador` | Consulta pública com `X-Codigo-Acompanhamento` |

As rotas administrativas exigem `Authorization: Bearer <token>`. O contrato completo está disponível no Swagger.

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

O limite configurado é de 80% para statements, branches, functions e lines nas camadas `domain` e `application`.

## Segurança

A API valida os dados recebidos e bloqueia campos não declarados nos DTOs. O relatório inicial de dependências está em `docs/security/npm-audit-2026-10-27.md`.

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
  compartilhado/
prisma/
  migrations/
  schema.prisma
test/
```

## Próximos incrementos

- Indicador de tempo médio de execução dos serviços.
- Comprovação da cobertura mínima de 80% nos domínios críticos.
- Revisão final da documentação técnica.
- Regras de transição entre todos os status da OS.
- Listagem administrativa e tempo médio de execução.
- Documentação DDD exportada e vídeo da entrega.
