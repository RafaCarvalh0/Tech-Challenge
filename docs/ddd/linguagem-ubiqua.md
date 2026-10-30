# Linguagem Ubíqua e glossário

| Termo | Definição no domínio | Contexto | Equivalente no código | Anti-termo |
|---|---|---|---|---|
| Cliente | Pessoa física ou jurídica que solicita atendimento | Atendimento | `Cliente` | Usuário administrativo |
| CPF/CNPJ | Identificador fiscal validado e normalizado | Atendimento | `CpfCnpj` | Login |
| Veículo | Bem do cliente submetido ao atendimento | Atendimento | `Veiculo` | Ordem de serviço |
| Placa | Identificador validado do veículo | Atendimento | `Placa` | Código de acompanhamento |
| Ordem de Serviço (OS) | Registro central do atendimento e seu ciclo de vida | Ordem de Serviço | `OrdemServico` | Orçamento |
| Código de acompanhamento | Segredo entregue ao cliente para consultar e decidir | Acompanhamento | `codigoAcompanhamento` | JWT |
| Diagnóstico | Etapa em que a composição pode ser definida | Ordem de Serviço | `EM_DIAGNOSTICO` | Execução |
| Composição | Snapshot dos serviços, peças, preços e quantidades da OS | Ordem de Serviço | `ComposicaoOrdemServico` | Reserva de estoque |
| Serviço | Item de mão de obra do catálogo | Catálogo | `Servico` | Peça |
| Peça/Insumo | Item físico com preço e saldo | Catálogo e Estoque | `PecaInsumo` | Serviço |
| Orçamento | Totais da composição submetidos a uma única decisão | Ordem de Serviço | `Orcamento` | Pagamento |
| Aprovação | Decisão que baixa estoque e inicia execução atomicamente | Ordem de Serviço | `DecisaoOrcamento.APROVAR` | Finalização |
| Rejeição | Decisão que devolve a OS ao diagnóstico sem baixar estoque | Ordem de Serviço | `DecisaoOrcamento.REJEITAR` | Cancelamento |
| Estoque | Quantidade disponível de uma peça ou insumo | Catálogo e Estoque | `quantidadeEstoque` | Item reservado |
| Baixa atômica | Redução de todos os itens ou rollback integral | Catálogo e Estoque | transação em `prisma-orcamento.repositorio.ts` | Baixa parcial |
| Finalização | Transição de `EM_EXECUCAO` para `FINALIZADA` | Ordem de Serviço | `AcaoOrdemServico.FINALIZAR` | Entrega |
| Entrega | Transição final após a conclusão do serviço | Ordem de Serviço | `AcaoOrdemServico.ENTREGAR` | Finalização |
| Tempo médio | Média entre início e fim das execuções por serviço | Indicadores | `ObterTempoMedioServicosCasoUso` | Tempo total da OS |

## Vocabulário técnico controlado

- `CpfCnpj` e `Placa` são objetos de valor implementados.
- Status, ações, decisões e tipos de movimentação são enums/tipos do domínio.
- Os itens da composição são snapshots; no Prisma, são persistidos como `ItemServicoOrdem` e `ItemPecaInsumoOrdem`.
- Eventos de domínio representam mudanças de estado persistidas; não existe event bus nesta fase.
