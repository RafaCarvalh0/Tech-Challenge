# Catálogo DDD e rastreabilidade

Transcrição dos quadros 07 e 12 do [board do Miro](https://miro.com/app/board/uXjVEXBA6FI=/?share_link_id=625881083702), para consulta sem acesso externo.

## Quadro 07 — Catálogo DDD

### Atores

- **Cliente:** solicita o atendimento, acompanha a OS e aprova ou rejeita o orçamento.
- **Atendente:** cadastra clientes e veículos, abre a OS e registra a entrega do veículo.
- **Mecânico:** inicia o diagnóstico, define serviços e peças e finaliza a execução.
- **Administrador:** mantém cadastros, gerencia estoque e ordens e consulta indicadores.
- **Sistema:** calcula o orçamento, aplica as transições, protege rotas e garante transações.

### Comandos

- **Cadastros:** autenticar administrador; criar, atualizar ou excluir cliente, veículo, serviço e peça/insumo.
- **Estoque:** registrar entrada ou saída de peças e insumos.
- **Ordem de Serviço:** abrir OS; iniciar diagnóstico; definir composição; gerar orçamento; aprovar ou rejeitar; finalizar e entregar.
- **Consultas:** consultar acompanhamento; listar e detalhar ordens; calcular tempo médio por serviço.

### Eventos de domínio

- **Eventos do atendimento:** cliente cadastrado; veículo cadastrado; OS recebida; código de acompanhamento gerado.
- **Eventos da execução:** diagnóstico iniciado; composição definida; orçamento gerado e disponibilizado; execução iniciada; serviço finalizado; veículo entregue.
- **Eventos de decisão e estoque:** orçamento aprovado ou rejeitado; estoque baixado.
- **Observação:** no MVP, os eventos são representados por mudanças de estado persistidas. Não existe event bus nesta fase.

### Políticas e regras

- **Identidade e propriedade:** CPF/CNPJ e placa devem ser válidos. O veículo precisa pertencer ao cliente informado.
- **Ordem de Serviço:** a composição só muda durante o diagnóstico. Cada ação é aceita apenas no status correto.
- **Orçamento e estoque:** o orçamento soma serviços e peças. A aprovação baixa o estoque; a rejeição retorna a OS ao diagnóstico. O estoque nunca pode ficar negativo.
- **Segurança e consistência:** JWT protege as APIs administrativas, o código privado protege o cliente e as operações críticas são transacionais.

### Agregados e raízes

- **OrdemServico — raiz central:** controla ciclo de vida, status, datas e código de acompanhamento.
- **ComposicaoOrdemServico — componente:** reúne snapshots; não é raiz independente.
- **Orcamento e PecaInsumo:** possuem invariantes próprias de decisão e estoque.
- **Raízes cadastrais:** Cliente, Veiculo e Servico têm identidade, repositório e casos de uso próprios.

Os nomes e classificações correspondem às classes, interfaces, enums, repositórios e casos de uso existentes em `src/modulos`.

## Quadro 12 — Rastreabilidade entre DDD, requisitos e implementação

### Conceito / requisito

- **CPF/CNPJ e placa:** objetos de valor implementados: `CpfCnpj` e `Placa`.
- **Ciclo da OS:** `OrdemServico` é a raiz central; `StatusOrdemServico` e `AcaoOrdemServico` são tipos/enums.
- **Composição e orçamento:** `ComposicaoOrdemServico` é componente. Seus itens são interfaces/snapshots; o Prisma persiste `ItemServicoOrdem` e `ItemPecaInsumoOrdem`. `Orcamento` mantém decisão única.
- **Estoque:** `PecaInsumo` controla saldo; `TipoMovimentacaoEstoque` é enum.
- **Módulos de apoio:** acompanhamento, indicadores e autenticação mapeiam seus casos de uso e adaptadores.

### Arquivos principais

- **Domínio:** `src/modulos/clientes/dominio/cpf-cnpj.ts`, `src/modulos/veiculos/dominio/placa.ts`, `src/modulos/ordens-servico/dominio/`, `src/modulos/pecas-insumos/dominio/peca-insumo.ts`
- **Aplicação:** `src/modulos/*/aplicacao/`
- **Apresentação e infraestrutura:** `src/modulos/*/apresentacao/`, `src/modulos/*/infraestrutura/`
- **Banco e testes:** `prisma/schema.prisma`, `prisma/migrations/`, `testes/fluxo-oficina.ponta-a-ponta.teste.ts`

### Evidência e teste

- **Testes unitários:** 33 suítes e 130 testes, com 100% de statements, branches, functions e lines no escopo configurado.
- **Testes de integração / E2E:** 4 suítes e 26 testes executados em PostgreSQL isolado. Cobrem autenticação, fluxo completo, rollback transacional e proteção do banco de desenvolvimento.
- **Comandos de comprovação:** `npm run lint`, `npm run build`, `npm run test:cov -- --runInBand`, `npm run test:ponta-a-ponta -- --runInBand`

A rastreabilidade distingue classes, interfaces, enums e modelos Prisma para representar a implementação entregue, não um exemplo genérico.
