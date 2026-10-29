import { ErroNaoEncontrado } from '../../../compartilhado/dominio/erros';
import { PecaInsumo } from '../dominio/peca-insumo';
import { CasoUsoObterPecaInsumo } from './obter-peca-insumo.caso-uso';
import { RepositorioPecaInsumo } from './peca-insumo.repositorio';

class ConsultaPecaInsumo implements RepositorioPecaInsumo {
  constructor(private readonly pecaInsumo: PecaInsumo | null) {}

  async buscarPorId(): Promise<PecaInsumo | null> {
    return this.pecaInsumo;
  }

  async buscarPorCodigo(): Promise<PecaInsumo | null> {
    return this.pecaInsumo;
  }

  async listar(): Promise<PecaInsumo[]> {
    return this.pecaInsumo ? [this.pecaInsumo] : [];
  }

  async salvar(): Promise<void> {}
  async atualizar(): Promise<void> {}
  async excluir(): Promise<void> {}
}

describe('CasoUsoObterPecaInsumo', () => {
  it('retorna a peça ou insumo existente', async () => {
    const pecaInsumo = PecaInsumo.restaurar({
      identificador: 'peca-1',
      codigo: 'FILTRO-01',
      nome: 'Filtro de óleo',
      descricao: 'Filtro do motor',
      precoUnitarioEmCentavos: 3000,
      quantidadeEstoque: 5,
      criadoEm: new Date('2026-10-27T12:00:00.000Z'),
      atualizadoEm: new Date('2026-10-27T12:00:00.000Z'),
    });

    await expect(
      new CasoUsoObterPecaInsumo(new ConsultaPecaInsumo(pecaInsumo)).executar(
        'peca-1',
      ),
    ).resolves.toMatchObject({
      identificador: 'peca-1',
      codigo: 'FILTRO-01',
      quantidadeEstoque: 5,
    });
  });

  it('rejeita peça ou insumo inexistente', async () => {
    await expect(
      new CasoUsoObterPecaInsumo(new ConsultaPecaInsumo(null)).executar(
        'ausente',
      ),
    ).rejects.toThrow(ErroNaoEncontrado);
  });
});
