# Tech Challenge - Sistema de Oficina

MVP de um sistema integrado para atendimento e execução de serviços de uma oficina mecânica. Este primeiro incremento implementa o fluxo `Cliente -> Veículo -> Ordem de Serviço`.

## Funcionalidades implementadas

- Cadastro e consulta de clientes.
- Validação e normalização de CPF/CNPJ.
- Cadastro e consulta de veículos vinculados a clientes.
- Validação de placas brasileiras antigas e Mercosul.
- Criação e consulta de ordens de serviço.
- Status inicial obrigatório `RECEBIDA`.
- Validação de propriedade do veículo antes da criação da OS.
- Swagger/OpenAPI.
- Testes unitários, cobertura e fluxo E2E com PostgreSQL real.

## Arquitetura

O projeto é um monólito modular organizado em quatro camadas:

- `domain`: entidades, objetos de valor e regras de negócio.
- `application`: casos de uso e contratos de repositório.
- `infrastructure`: persistência PostgreSQL com Prisma.
- `presentation`: controllers REST, DTOs e documentação Swagger.

Os módulos iniciais são `clientes`, `veiculos` e `ordens-servico`. O domínio não depende de NestJS ou Prisma.

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
| POST | `/api/clientes` | Cadastra um cliente |
| GET | `/api/clientes/:identificador` | Consulta um cliente |
| POST | `/api/veiculos` | Cadastra um veículo |
| GET | `/api/veiculos/:identificador` | Consulta um veículo |
| POST | `/api/ordens-servico` | Cria uma ordem de serviço |
| GET | `/api/ordens-servico/:identificador` | Consulta uma ordem de serviço |

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
$env:URL_BANCO_DADOS="postgresql://postgres:postgres@localhost:5433/oficina_testee?schema=public"
npm run prisma:deploy
npm run test:ponta-a-ponta -- --runInBand
```

No Bash:

```bash
export URL_BANCO_DADOS="postgresql://postgres:postgres@localhost:5433/oficina_testee?schema=public"
npm run prisma:deploy
npm run test:ponta-a-ponta -- --runInBand
```

O serviço `banco-dados-teste` usa armazenamento temporário e pode ser encerrado com `docker compose --profile test stop banco-dados-teste`.

O limite configurado é de 80% para statements, branches, functions e lines nas camadas `domain` e `application`.

## Segurança

A API valida os dados recebidos e bloqueia campos não declarados nos DTOs. O relatório inicial de dependências está em `docs/security/npm-audit-2026-10-27.md`.

A autenticação JWT ainda não faz parte deste incremento; portanto, não existem credenciais de demonstração nesta versão.

## Estrutura principal

```text
src/
  banco-dados/
  saude/
  modulos/
    clientes/
    veiculos/
    ordens-servico/
  compartilhado/
prisma/
  migrations/
  schema.prisma
test/
```

## Próximos incrementos

- Autenticação JWT e perfis administrativos.
- CRUD de serviços, peças e insumos.
- Controle de estoque.
- Itens da OS, cálculo e aprovação do orçamento.
- Regras de transição entre todos os status da OS.
- Listagem administrativa e tempo médio de execução.
- Documentação DDD exportada e vídeo da entrega.
