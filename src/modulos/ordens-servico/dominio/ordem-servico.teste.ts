import { OrdemServico } from './ordem-servico';
import { StatusOrdemServico } from './status-ordem-servico';
import { ErroValidacao } from '../../../compartilhado/dominio/erros';

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
});
