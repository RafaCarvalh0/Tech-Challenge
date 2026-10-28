import { OrdemServico } from './ordem-servico';
import { StatusOrdemServico } from './status-ordem-servico';
import { ErroValidacao } from '../../../compartilhado/dominio/erros';
import { AcaoOrdemServico } from './acao-ordem-servico';

describe('OrdemServico', () => {
  it('inicia com a situação recebida', () => {
    const ordemServico = OrdemServico.criar({
      clienteId: 'cliente-identificador',
      veiculoId: 'veiculo-identificador',
      descricao: 'Troca de óleo e diagnóstico dos freios',
    });

    expect(ordemServico.status).toBe(StatusOrdemServico.RECEBIDA);
    expect(ordemServico.codigoAcompanhamento).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  it('rejeita descrição vazia do serviço', () => {
    expect(() =>
      OrdemServico.criar({
        clienteId: 'cliente-identificador',
        veiculoId: 'veiculo-identificador',
        descricao: '   ',
      }),
    ).toThrow(ErroValidacao);
  });

  it('registra o início quando o orçamento é aprovado', () => {
    const inicio = new Date('2026-10-28T13:00:00.000Z');
    const ordemServico = OrdemServico.criar({
      clienteId: 'cliente-identificador',
      veiculoId: 'veiculo-identificador',
      descricao: 'Troca de óleo',
    })
      .executarAcao(AcaoOrdemServico.INICIAR_DIAGNOSTICO)
      .executarAcao(AcaoOrdemServico.SOLICITAR_APROVACAO)
      .executarAcao(AcaoOrdemServico.APROVAR, inicio);

    expect(ordemServico.inicioExecucaoEm).toEqual(inicio);
    expect(ordemServico.finalizadoEm).toBeNull();
  });

  it('não inicia a execução quando o orçamento é rejeitado', () => {
    const ordemServico = OrdemServico.criar({
      clienteId: 'cliente-identificador',
      veiculoId: 'veiculo-identificador',
      descricao: 'Alinhamento',
    })
      .executarAcao(AcaoOrdemServico.INICIAR_DIAGNOSTICO)
      .executarAcao(AcaoOrdemServico.SOLICITAR_APROVACAO)
      .executarAcao(AcaoOrdemServico.REJEITAR);

    expect(ordemServico.inicioExecucaoEm).toBeNull();
    expect(ordemServico.finalizadoEm).toBeNull();
  });

  it('registra a finalização e preserva o período após a entrega', () => {
    const inicio = new Date('2026-10-28T13:00:00.000Z');
    const fim = new Date('2026-10-28T15:00:00.000Z');
    const entrega = new Date('2026-10-28T16:00:00.000Z');
    const ordemFinalizada = OrdemServico.criar({
      clienteId: 'cliente-identificador',
      veiculoId: 'veiculo-identificador',
      descricao: 'Revisão completa',
    })
      .executarAcao(AcaoOrdemServico.INICIAR_DIAGNOSTICO)
      .executarAcao(AcaoOrdemServico.SOLICITAR_APROVACAO)
      .executarAcao(AcaoOrdemServico.APROVAR, inicio)
      .executarAcao(AcaoOrdemServico.FINALIZAR, fim);

    expect(ordemFinalizada.inicioExecucaoEm).toEqual(inicio);
    expect(ordemFinalizada.finalizadoEm).toEqual(fim);

    const ordemEntregue = ordemFinalizada.executarAcao(
      AcaoOrdemServico.ENTREGAR,
      entrega,
    );
    expect(ordemEntregue.inicioExecucaoEm).toEqual(inicio);
    expect(ordemEntregue.finalizadoEm).toEqual(fim);
  });
});
