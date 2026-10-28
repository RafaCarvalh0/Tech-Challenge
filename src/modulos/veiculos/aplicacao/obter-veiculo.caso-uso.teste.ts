import { ErroNaoEncontrado } from '../../../compartilhado/dominio/erros';
import { Veiculo } from '../dominio/veiculo';
import { CasoUsoObterVeiculo } from './obter-veiculo.caso-uso';
import { RepositorioVeiculo } from './veiculo.repositorio';

class ConsultaVeiculo implements RepositorioVeiculo {
  constructor(private readonly veiculo: Veiculo | null) {}

  async buscarPorId(): Promise<Veiculo | null> {
    return this.veiculo;
  }

  async buscarPorPlaca(): Promise<Veiculo | null> {
    return null;
  }

  async listar(): Promise<Veiculo[]> {
    return this.veiculo ? [this.veiculo] : [];
  }

  async salvar(): Promise<void> {}

  async atualizar(): Promise<void> {}

  async excluir(): Promise<void> {}
}

describe('CasoUsoObterVeiculo', () => {
  it('retorna um veículo existente', async () => {
    const veiculo = Veiculo.restaurar({
      identificador: 'veiculo-identificador',
      clienteId: 'cliente-identificador',
      placa: 'ABC1D23',
      marca: 'Honda',
      modelo: 'Civic',
      ano: 2022,
      criadoEm: new Date('2026-10-27T12:00:00.000Z'),
    });
    const casoUso = new CasoUsoObterVeiculo(new ConsultaVeiculo(veiculo));

    await expect(casoUso.executar('veiculo-identificador')).resolves.toMatchObject({
      identificador: 'veiculo-identificador',
      clienteId: 'cliente-identificador',
      placa: 'ABC1D23',
    });
  });

  it('rejeita um veículo desconhecido', async () => {
    const casoUso = new CasoUsoObterVeiculo(new ConsultaVeiculo(null));

    await expect(casoUso.executar('ausente')).rejects.toThrow(ErroNaoEncontrado);
  });
});
