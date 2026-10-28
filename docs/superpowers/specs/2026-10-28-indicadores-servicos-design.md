# Indicador de Tempo Médio dos Serviços

## Intenção

Atender ao requisito do Tech Challenge de monitorar o tempo médio de execução dos serviços, usando dados reais do ciclo da ordem de serviço e mantendo a consulta restrita à administração.

## Escopo

- Registrar o início quando o orçamento é aprovado e a OS entra em execução.
- Registrar a finalização quando a OS passa para `FINALIZADA`.
- Preservar os horários após a entrega.
- Calcular a média por serviço usando somente OS finalizadas ou entregues.
- Retornar o serviço, a quantidade de OS consideradas e a média em segundos.
- Proteger o endpoint com o JWT administrativo já existente.

Não fazem parte desta entrega dashboards, filtros por período ou histórico completo de todas as mudanças de status.

## Abordagens consideradas

1. **Timestamps na OS e agregação SQL por serviço — escolhida.** É simples, auditável e suficiente para o MVP. A duração total da OS é atribuída a cada serviço presente nela.
2. **Histórico completo de status.** Permitiria análises mais detalhadas, mas adicionaria entidades e complexidade além do requisito atual.
3. **Usar `atualizadoEm`.** Foi descartada porque qualquer alteração posterior mudaria o valor e produziria médias incorretas.

## Arquitetura

A entidade `OrdemServico` controla `inicioExecucaoEm` e `finalizadoEm` nas transições. O Prisma persiste esses campos. Um módulo `indicadores` consulta o PostgreSQL com agregação sobre ordens e itens de serviço, sem carregar o histórico em memória. O endpoint será `GET /api/indicadores/tempo-medio-servicos`.

## Regras

- OS sem os dois timestamps não participa do cálculo.
- OS em execução, recebida, em diagnóstico ou aguardando aprovação não participa.
- Uma OS com vários serviços contribui com sua duração para cada serviço.
- Cada par OS/serviço conta uma vez, independentemente da quantidade do item.
- Sem dados concluídos, a resposta é uma lista vazia.
