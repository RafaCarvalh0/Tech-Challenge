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
