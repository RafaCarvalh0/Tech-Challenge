# Conclusão das Pendências de Código - Plano de Implementação

> **Para agentes de implementação:** use `superpowers:executing-plans` ou `superpowers:subagent-driven-development` para executar as tarefas em sequência. Cada tarefa deve terminar com testes e um commit próprio.

**Objetivo:** concluir as pendências de código do MVP descritas na Fase 1, priorizando segurança, acompanhamento do cliente, transações, indicadores e comprovação de qualidade.

**Arquitetura:** manter o monólito NestJS em camadas e a separação por módulos/domínios. Regras de negócio permanecem no domínio e casos de uso; autenticação, consultas públicas e indicadores terão módulos próprios; Prisma continuará responsável pela persistência transacional.

**Tecnologias:** NestJS, TypeScript, PostgreSQL, Prisma, JWT, Jest, Supertest, Docker Compose e Swagger.

**Especificação:** `Fase 1 - Tech Challenge.pdf`

## Restrições globais

- Manter o back-end monolítico e a organização em camadas.
- Manter nomes de arquivos, variáveis e modelos em português sempre que possível.
- Não expor credenciais ou segredos no repositório.
- Preservar a documentação Swagger e as migrations do Prisma.
- Cada entrega deve incluir testes unitários ou de integração correspondentes.

## Foco da revisão

- Uma rota administrativa sem JWT deve responder 401.
- Um token de acompanhamento inválido não deve revelar dados da OS.
- Falha na abertura não pode deixar veículo ou OS parcialmente persistidos.
- Uma OS não finalizada não pode entrar no cálculo do tempo médio.
- `npm run test:cov` deve coletar arquivos reais e validar 80% nos domínios críticos.

### Tarefa 1: Autenticação JWT e proteção administrativa

**Arquivos:**
- Criar: `src/modulos/autenticacao/` com domínio, aplicação, infraestrutura e apresentação.
- Criar: migration/modelo Prisma para usuário administrativo, se necessário.
- Modificar: `src/aplicacao.module.ts` para registrar o módulo.
- Modificar: controllers administrativos para aplicar o guard JWT.
- Testar: testes unitários do login/guard e E2E das respostas 401/200.

**Interfaces:**
- `POST /api/autenticacao/login` recebe credenciais e retorna `{ accessToken, tipoToken }`.
- `GuardAutenticacaoJwt` valida o token e `GuardPerfil` permite o perfil `ADMINISTRADOR`.
- Credencial inicial deve ser fornecida por variáveis de ambiente ou migration segura, nunca hardcoded.

- [x] Escrever testes para credencial válida, inválida, token ausente, token expirado e rota pública.
- [x] Adicionar dependências JWT e configuração de segredo/expiração por ambiente.
- [x] Implementar login, assinatura, estratégia e guards.
- [x] Proteger clientes, veículos, serviços, peças/insumos e operações administrativas de OS.
- [x] Manter saúde e acompanhamento do cliente fora da proteção administrativa.
- [x] Atualizar Swagger com Bearer auth e executar testes unitários, E2E, lint e build.
- [x] Commitar: `feat: adiciona autenticacao jwt administrativa`.

### Tarefa 2: Acompanhamento seguro pelo cliente

**Arquivos:**
- Criar: `src/modulos/acompanhamento/`.
- Modificar: `prisma/schema.prisma` e migration para um código/token de acompanhamento da OS.
- Modificar: criação/abertura de OS para gerar o código de acompanhamento.
- Testar: E2E do acesso válido, inválido e tentativa de acesso administrativo.

**Interfaces:**
- `GET /api/acompanhamento/ordens-servico/:identificador` recebe o código em `X-Codigo-Acompanhamento`.
- A resposta contém somente status, descrição resumida, composição e situação/total do orçamento necessários ao cliente.
- Código inválido, ausente ou pertencente a outra OS retorna 401/404 sem dados sensíveis.

- [x] Escrever testes de contrato e segurança do endpoint.
- [x] Persistir o código de forma não previsível e retornar o código apenas no fluxo autorizado de abertura.
- [x] Implementar consulta pública limitada ao acompanhamento.
- [x] Documentar a rota no Swagger e atualizar o detalhamento administrativo sem expor o código.
- [x] Commitar: `feat: adiciona acompanhamento seguro da ordem`.

### Tarefa 3: Transação atômica no fluxo de abertura

**Arquivos:**
- Criar/modificar: `src/modulos/ordens-servico/aplicacao/abertura-ordem-servico.repositorio.ts`.
- Modificar: `src/modulos/ordens-servico/aplicacao/abrir-ordem-servico.caso-uso.ts`.
- Modificar: `src/modulos/ordens-servico/infraestrutura/prisma-ordem-servico.repositorio.ts` ou criar repositório transacional dedicado.
- Testar: teste E2E com falha após criação do veículo e verificar rollback completo.

**Interfaces:**
- `abrir(dados): Promise<{ ordemServico: OrdemServico; veiculo: Veiculo; codigoAcompanhamento: string }>` executa criação/vínculo do veículo e OS em uma única transação Prisma.

- [ ] Escrever teste que force conflito/erro na criação da OS e confirme que o veículo novo não permanece.
- [ ] Mover a orquestração de persistência para uma transação única.
- [ ] Preservar as validações atuais de CPF/CNPJ, placa, propriedade e dados do veículo.
- [ ] Executar unitários, E2E, lint e build.
- [ ] Commitar: `fix: torna abertura da ordem transacional`.

### Tarefa 4: Tempo médio de execução dos serviços

**Arquivos:**
- Modificar: `prisma/schema.prisma` com timestamps de início/finalização da execução, se ainda não existirem.
- Modificar: `src/modulos/ordens-servico/dominio/ordem-servico.ts` e ações de transição.
- Criar: `src/modulos/indicadores/` com caso de uso, repositório Prisma e controller.
- Testar: domínio, consulta agregada e endpoint E2E.

**Interfaces:**
- `GET /api/indicadores/tempo-medio-servicos` retorna serviço, quantidade de OS concluídas e média em segundos/minutos.
- Somente OS com início e finalização válidos entram no cálculo.

- [ ] Escrever testes para nenhuma execução, uma execução e múltiplas execuções.
- [ ] Registrar os timestamps nas transições `APROVAR`, `FINALIZAR` e demais transições necessárias.
- [ ] Implementar consulta agregada por serviço, sem carregar todo o histórico em memória.
- [ ] Proteger a rota com JWT administrativo e documentá-la no Swagger.
- [ ] Commitar: `feat: adiciona indicador de tempo medio`.

### Tarefa 5: Corrigir e comprovar cobertura de 80%

**Arquivos:**
- Modificar: `package.json` na configuração Jest de `collectCoverageFrom`.
- Modificar: testes dos domínios/casos de uso que ficarem abaixo do limite.
- Opcional: criar `jest.cobertura.json` caso a configuração unitária e E2E precise ser separada.

- [ ] Corrigir os caminhos antigos `modules`/`shared` para `modulos`/`compartilhado` relativos ao `rootDir` atual.
- [ ] Executar `npm run test:cov -- --runInBand` e identificar arquivos abaixo de 80%.
- [ ] Adicionar testes apenas para regras críticas não cobertas.
- [ ] Confirmar statements, branches, functions e lines em pelo menos 80%.
- [ ] Commitar: `test: corrige cobertura dos dominios criticos`.

### Tarefa 6: Atualizar documentação técnica de execução

**Arquivos:**
- Modificar: `README.md`.
- Modificar: exemplos de ambiente e comandos de teste, se necessário.
- Testar: executar os comandos documentados em ambiente limpo.

- [ ] Atualizar a lista completa de endpoints, JWT, acompanhamento, orçamento, estoque e indicadores.
- [ ] Corrigir o nome/URL do banco de testes e documentar `npm run iniciar`.
- [ ] Documentar credencial de demonstração por procedimento seguro, sem publicar segredo real.
- [ ] Atualizar estrutura de diretórios e comandos de cobertura.
- [ ] Commitar: `docs: atualiza guia de execucao da api`.

## Verificação final

- [ ] Executar `npm test -- --runInBand`.
- [ ] Executar a suíte E2E com PostgreSQL temporário.
- [ ] Executar `npm run test:cov -- --runInBand` e confirmar o mínimo de 80%.
- [ ] Executar `npm run lint`.
- [ ] Executar `npm run build`.
- [ ] Validar todos os endpoints no Swagger.
- [ ] Conferir `git diff --check` e ausência de credenciais versionadas.
