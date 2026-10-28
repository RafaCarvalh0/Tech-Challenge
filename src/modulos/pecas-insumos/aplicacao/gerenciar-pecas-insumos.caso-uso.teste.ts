import {
  ErroConflito,
  ErroNaoEncontrado,
  ErroValidacao,
} from '../../../compartilhado/dominio/erros';
import { PecaInsumo } from '../dominio/peca-insumo';
import { TipoMovimentacaoEstoque } from '../dominio/tipo-movimentacao-estoque';
import { CasoUsoAtualizarPecaInsumo } from './atualizar-peca-insumo.caso-uso';
import { CasoUsoCriarPecaInsumo } from './criar-peca-insumo.caso-uso';
import { CasoUsoExcluirPecaInsumo } from './excluir-peca-insumo.caso-uso';
import { CasoUsoListarPecasInsumos } from './listar-pecas-insumos.caso-uso';
import { CasoUsoMovimentarEstoque } from './movimentar-estoque.caso-uso';
import { RepositorioPecaInsumo } from './peca-insumo.repositorio';

class RepositorioPecaInsumoEmMemoria implements RepositorioPecaInsumo {
  constructor(readonly pecasInsumos: PecaInsumo[] = []) {}

  async buscarPorId(identificador: string): Promise<PecaInsumo | null> {
    return (
      this.pecasInsumos.find(
        (registro) => registro.identificador === identificador,
      ) ?? null
    );
  }

  async buscarPorCodigo(codigo: string): Promise<PecaInsumo | null> {
    return (
      this.pecasInsumos.find((registro) => registro.codigo === codigo) ?? null
    );
  }

  async listar(): Promise<PecaInsumo[]> {
    return [...this.pecasInsumos].sort((primeiro, segundo) =>
      primeiro.nome.localeCompare(segundo.nome),
    );
  }

  async salvar(pecaInsumo: PecaInsumo): Promise<void> {
    this.pecasInsumos.push(pecaInsumo);
  }

  async atualizar(pecaInsumo: PecaInsumo): Promise<void> {
    const indice = this.pecasInsumos.findIndex(
      (registro) => registro.identificador === pecaInsumo.identificador,
    );
    this.pecasInsumos[indice] = pecaInsumo;
  }

  async excluir(identificador: string): Promise<void> {
    const indice = this.pecasInsumos.findIndex(
      (registro) => registro.identificador === identificador,
    );
    this.pecasInsumos.splice(indice, 1);
  }
}

describe('Gerenciamento de peças e insumos', () => {
  it('cria e lista registros em ordem alfabética', async () => {
    const repositorio = new RepositorioPecaInsumoEmMemoria();
    const criar = new CasoUsoCriarPecaInsumo(repositorio);
    await criar.executar({
      codigo: 'OLEO',
      nome: 'Óleo',
      precoUnitarioEmCentavos: 4500,
    });
    await criar.executar({
      codigo: 'FILTRO',
      nome: 'Filtro',
      precoUnitarioEmCentavos: 3000,
    });

    await expect(
      new CasoUsoListarPecasInsumos(repositorio).executar(),
    ).resolves.toEqual([
      expect.objectContaining({ codigo: 'FILTRO' }),
      expect.objectContaining({ codigo: 'OLEO' }),
    ]);
  });

  it('rejeita código duplicado', async () => {
    const repositorio = new RepositorioPecaInsumoEmMemoria();
    const criar = new CasoUsoCriarPecaInsumo(repositorio);
    await criar.executar({
      codigo: 'OLEO',
      nome: 'Óleo',
      precoUnitarioEmCentavos: 4500,
    });

    await expect(
      criar.executar({
        codigo: 'oleo',
        nome: 'Outro óleo',
        precoUnitarioEmCentavos: 4000,
      }),
    ).rejects.toThrow(ErroConflito);
  });

  it('atualiza dados e rejeita atualização vazia', async () => {
    const repositorio = new RepositorioPecaInsumoEmMemoria();
    const criado = await new CasoUsoCriarPecaInsumo(repositorio).executar({
      codigo: 'OLEO',
      nome: 'Óleo',
      precoUnitarioEmCentavos: 4500,
    });
    const atualizar = new CasoUsoAtualizarPecaInsumo(repositorio);

    await expect(
      atualizar.executar(criado.identificador, {
        precoUnitarioEmCentavos: 5000,
      }),
    ).resolves.toMatchObject({ precoUnitarioEmCentavos: 5000 });
    await expect(
      atualizar.executar(criado.identificador, {}),
    ).rejects.toThrow(ErroValidacao);
  });

  it('movimenta estoque e impede saldo negativo', async () => {
    const repositorio = new RepositorioPecaInsumoEmMemoria();
    const criado = await new CasoUsoCriarPecaInsumo(repositorio).executar({
      codigo: 'OLEO',
      nome: 'Óleo',
      precoUnitarioEmCentavos: 4500,
      quantidadeEstoque: 2,
    });
    const movimentar = new CasoUsoMovimentarEstoque(repositorio);

    await expect(
      movimentar.executar(
        criado.identificador,
        TipoMovimentacaoEstoque.ENTRADA,
        3,
      ),
    ).resolves.toMatchObject({ quantidadeEstoque: 5 });
    await expect(
      movimentar.executar(
        criado.identificador,
        TipoMovimentacaoEstoque.SAIDA,
        6,
      ),
    ).rejects.toThrow(ErroValidacao);
  });

  it('exclui registro e rejeita identificador inexistente', async () => {
    const repositorio = new RepositorioPecaInsumoEmMemoria();
    const criado = await new CasoUsoCriarPecaInsumo(repositorio).executar({
      codigo: 'OLEO',
      nome: 'Óleo',
      precoUnitarioEmCentavos: 4500,
    });
    const excluir = new CasoUsoExcluirPecaInsumo(repositorio);

    await excluir.executar(criado.identificador);
    expect(repositorio.pecasInsumos).toHaveLength(0);
    await expect(excluir.executar('ausente')).rejects.toThrow(
      ErroNaoEncontrado,
    );
  });
});
