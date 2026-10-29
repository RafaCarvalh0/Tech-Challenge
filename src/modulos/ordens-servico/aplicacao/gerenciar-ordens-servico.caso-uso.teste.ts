import {
  ErroNaoEncontrado,
  ErroValidacao,
} from '../../../compartilhado/dominio/erros';
import { AcaoOrdemServico } from '../dominio/acao-ordem-servico';
import { OrdemServico } from '../dominio/ordem-servico';
import { StatusOrdemServico } from '../dominio/status-ordem-servico';
import { CasoUsoExecutarAcaoOrdemServico } from './executar-acao-ordem-servico.caso-uso';
import { CasoUsoListarOrdensServico } from './listar-ordens-servico.caso-uso';
import {
  FiltrosOrdemServico,
  RepositorioOrdemServico,
} from './ordem-servico.repositorio';

class RepositorioOrdemServicoEmMemoria implements RepositorioOrdemServico {
  constructor(readonly ordensServico: OrdemServico[] = []) {}

  async buscarPorId(identificador: string): Promise<OrdemServico | null> {
    return (
      this.ordensServico.find(
        (ordemServico) => ordemServico.identificador === identificador,
      ) ?? null
    );
  }

  async listar(filtros: FiltrosOrdemServico): Promise<OrdemServico[]> {
    return this.ordensServico.filter(
      (ordemServico) =>
        (!filtros.clienteId || ordemServico.clienteId === filtros.clienteId) &&
        (!filtros.veiculoId || ordemServico.veiculoId === filtros.veiculoId) &&
        (!filtros.status || ordemServico.status === filtros.status),
    );
  }

  async salvar(ordemServico: OrdemServico): Promise<void> {
    this.ordensServico.push(ordemServico);
  }

  async atualizarStatus(ordemServico: OrdemServico): Promise<void> {
    const indice = this.ordensServico.findIndex(
      (registro) => registro.identificador === ordemServico.identificador,
    );
    this.ordensServico[indice] = ordemServico;
  }
}

function criarOrdem(
  identificador: string,
  clienteId = 'cliente-1',
  status = StatusOrdemServico.RECEBIDA,
) {
  return OrdemServico.restaurar({
    identificador,
    codigoAcompanhamento: `codigo-${identificador}`,
    clienteId,
    veiculoId: 'veiculo-1',
    descricao: 'Troca de óleo',
    status,
    criadoEm: new Date('2026-10-27T12:00:00.000Z'),
    atualizadoEm: new Date('2026-10-27T12:00:00.000Z'),
  });
}

describe('Gerenciamento de ordens de serviço', () => {
  it('lista ordens filtradas por cliente', async () => {
    const repositorio = new RepositorioOrdemServicoEmMemoria([
      criarOrdem('1', 'cliente-1'),
      criarOrdem('2', 'cliente-2'),
    ]);

    await expect(
      new CasoUsoListarOrdensServico(repositorio).executar({
        clienteId: 'cliente-1',
      }),
    ).resolves.toEqual([
      expect.objectContaining({ identificador: '1', clienteId: 'cliente-1' }),
    ]);
  });

  it('lista todas as ordens quando nenhum filtro é informado', async () => {
    const repositorio = new RepositorioOrdemServicoEmMemoria([
      criarOrdem('1', 'cliente-1'),
      criarOrdem('2', 'cliente-2'),
    ]);

    await expect(
      new CasoUsoListarOrdensServico(repositorio).executar(),
    ).resolves.toHaveLength(2);
  });

  it('executa as ações operacionais permitidas', async () => {
    const repositorio = new RepositorioOrdemServicoEmMemoria([
      criarOrdem('1'),
      criarOrdem('2', 'cliente-1', StatusOrdemServico.EM_EXECUCAO),
      criarOrdem('3', 'cliente-1', StatusOrdemServico.FINALIZADA),
    ]);
    const casoUso = new CasoUsoExecutarAcaoOrdemServico(repositorio);
    const sequencia: Array<[AcaoOrdemServico, StatusOrdemServico]> = [
      [AcaoOrdemServico.INICIAR_DIAGNOSTICO, StatusOrdemServico.EM_DIAGNOSTICO],
      [AcaoOrdemServico.FINALIZAR, StatusOrdemServico.FINALIZADA],
      [AcaoOrdemServico.ENTREGAR, StatusOrdemServico.ENTREGUE],
    ];

    for (const [indice, [acao, statusEsperado]] of sequencia.entries()) {
      const resultado = await casoUso.executar(String(indice + 1), acao);
      expect(resultado.status).toBe(statusEsperado);
    }
  });

  it('bloqueia ações que devem passar pelo orçamento', async () => {
    const repositorio = new RepositorioOrdemServicoEmMemoria([
      criarOrdem('1', 'cliente-1', StatusOrdemServico.EM_DIAGNOSTICO),
    ]);

    await expect(
      new CasoUsoExecutarAcaoOrdemServico(repositorio).executar(
        '1',
        AcaoOrdemServico.SOLICITAR_APROVACAO,
      ),
    ).rejects.toThrow(ErroValidacao);
  });

  it('rejeita ação fora da sequência de status', async () => {
    const repositorio = new RepositorioOrdemServicoEmMemoria([criarOrdem('1')]);

    await expect(
      new CasoUsoExecutarAcaoOrdemServico(repositorio).executar(
        '1',
        AcaoOrdemServico.APROVAR,
      ),
    ).rejects.toThrow(ErroValidacao);
  });

  it('rejeita ação em ordem inexistente', async () => {
    await expect(
      new CasoUsoExecutarAcaoOrdemServico(
        new RepositorioOrdemServicoEmMemoria(),
      ).executar('ausente', AcaoOrdemServico.INICIAR_DIAGNOSTICO),
    ).rejects.toThrow(ErroNaoEncontrado);
  });
});
