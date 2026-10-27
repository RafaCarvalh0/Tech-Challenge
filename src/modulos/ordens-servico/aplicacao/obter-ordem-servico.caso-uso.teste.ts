import { ErroNaoEncontrado } from '../../../compartilhado/dominio/erros';
import { OrdemServico } from '../dominio/ordem-servico';
import { CasoUsoObterOrdemServico } from './obter-ordem-servico.caso-uso';
import { RepositorioOrdemServico } from './ordem-servico.repositorio';

class ConsultaOrdemServico implements RepositorioOrdemServico {
  constructor(private readonly ordemServico: OrdemServico | null) {}

  async buscarPorId(): Promise<OrdemServico | null> {
    return this.ordemServico;
  }

  async salvar(): Promise<void> {}
}

describe('CasoUsoObterOrdemServico', () => {
  it('retorna uma ordem de serviço existente', async () => {
    const ordemServico = OrdemServico.restaurar({
      identificador: 'ordem-servico-identificador',
      clienteId: 'cliente-identificador',
      veiculoId: 'veiculo-identificador',
      descricao: 'Troca de óleo',
      status: 'RECEBIDA',
      criadoEm: new Date('2026-10-27T12:00:00.000Z'),
      atualizadoEm: new Date('2026-10-27T12:00:00.000Z'),
    });
    const casoUso = new CasoUsoObterOrdemServico(new ConsultaOrdemServico(ordemServico));

    await expect(casoUso.executar('ordem-servico-identificador')).resolves.toMatchObject({
      identificador: 'ordem-servico-identificador',
      status: 'RECEBIDA',
    });
  });

  it('rejeita ordem de serviço desconhecida', async () => {
    const casoUso = new CasoUsoObterOrdemServico(new ConsultaOrdemServico(null));

    await expect(casoUso.executar('ausente')).rejects.toThrow(ErroNaoEncontrado);
  });
});
