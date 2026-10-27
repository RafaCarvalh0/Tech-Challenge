import {
  ErroConflito,
  ErroNaoEncontrado,
  ErroValidacao,
} from '../../../compartilhado/dominio/erros';
import { Veiculo } from '../dominio/veiculo';
import { CasoUsoAtualizarVeiculo } from './atualizar-veiculo.caso-uso';
import { CasoUsoExcluirVeiculo } from './excluir-veiculo.caso-uso';
import { CasoUsoListarVeiculos } from './listar-veiculos.caso-uso';
import { RepositorioVeiculo } from './veiculo.repositorio';

class RepositorioVeiculoEmMemoria implements RepositorioVeiculo {
  constructor(readonly veiculos: Veiculo[] = []) {}

  async buscarPorId(identificador: string): Promise<Veiculo | null> {
    return this.veiculos.find((veiculo) => veiculo.identificador === identificador) ?? null;
  }

  async buscarPorPlaca(placa: string): Promise<Veiculo | null> {
    return this.veiculos.find((veiculo) => veiculo.placa.valor === placa) ?? null;
  }

  async listar(clienteId?: string): Promise<Veiculo[]> {
    return this.veiculos.filter(
      (veiculo) => clienteId === undefined || veiculo.clienteId === clienteId,
    );
  }

  async salvar(veiculo: Veiculo): Promise<void> {
    this.veiculos.push(veiculo);
  }

  async atualizar(veiculo: Veiculo): Promise<void> {
    const indice = this.veiculos.findIndex(
      (registro) => registro.identificador === veiculo.identificador,
    );
    this.veiculos[indice] = veiculo;
  }

  async excluir(identificador: string): Promise<void> {
    const indice = this.veiculos.findIndex(
      (veiculo) => veiculo.identificador === identificador,
    );
    this.veiculos.splice(indice, 1);
  }
}

function criarVeiculo(
  identificador: string,
  clienteId: string,
  placa: string,
): Veiculo {
  return Veiculo.restaurar({
    identificador,
    clienteId,
    placa,
    marca: 'Honda',
    modelo: 'Civic',
    ano: 2022,
    criadoEm: new Date('2026-10-27T12:00:00.000Z'),
  });
}

describe('Gerenciamento de veículos', () => {
  it('lista somente os veículos do cliente informado', async () => {
    const repositorio = new RepositorioVeiculoEmMemoria([
      criarVeiculo('1', 'cliente-1', 'ABC1D23'),
      criarVeiculo('2', 'cliente-2', 'BRA2E19'),
    ]);

    await expect(
      new CasoUsoListarVeiculos(repositorio).executar('cliente-1'),
    ).resolves.toEqual([
      expect.objectContaining({ identificador: '1', clienteId: 'cliente-1' }),
    ]);
  });

  it('atualiza placa, marca, modelo e ano', async () => {
    const repositorio = new RepositorioVeiculoEmMemoria([
      criarVeiculo('1', 'cliente-1', 'ABC1D23'),
    ]);

    const resultado = await new CasoUsoAtualizarVeiculo(repositorio).executar(
      '1',
      {
        placa: 'BRA2E19',
        marca: '  Toyota ',
        modelo: ' Corolla ',
        ano: 2024,
      },
    );

    expect(resultado).toMatchObject({
      placa: 'BRA2E19',
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2024,
    });
  });

  it('rejeita atualização sem nenhum campo', async () => {
    const repositorio = new RepositorioVeiculoEmMemoria([
      criarVeiculo('1', 'cliente-1', 'ABC1D23'),
    ]);

    await expect(
      new CasoUsoAtualizarVeiculo(repositorio).executar('1', {}),
    ).rejects.toThrow(ErroValidacao);
  });

  it('rejeita placa utilizada por outro veículo', async () => {
    const repositorio = new RepositorioVeiculoEmMemoria([
      criarVeiculo('1', 'cliente-1', 'ABC1D23'),
      criarVeiculo('2', 'cliente-1', 'BRA2E19'),
    ]);

    await expect(
      new CasoUsoAtualizarVeiculo(repositorio).executar('1', {
        placa: 'BRA2E19',
      }),
    ).rejects.toThrow(ErroConflito);
  });

  it('exclui veículo existente', async () => {
    const repositorio = new RepositorioVeiculoEmMemoria([
      criarVeiculo('1', 'cliente-1', 'ABC1D23'),
    ]);

    await new CasoUsoExcluirVeiculo(repositorio).executar('1');

    expect(repositorio.veiculos).toHaveLength(0);
  });

  it('rejeita exclusão de veículo inexistente', async () => {
    await expect(
      new CasoUsoExcluirVeiculo(new RepositorioVeiculoEmMemoria()).executar(
        'ausente',
      ),
    ).rejects.toThrow(ErroNaoEncontrado);
  });
});
