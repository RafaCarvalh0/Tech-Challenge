import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { ServicoPrisma } from '../../../banco-dados/prisma.servico';
import { ErroConflito } from '../../../compartilhado/dominio/erros';
import { Veiculo } from '../dominio/veiculo';
import { RepositorioPrismaVeiculo } from './prisma-veiculo.repositorio';

describe('RepositorioPrismaVeiculo', () => {
  it('converte violação concorrente de placa única em conflito', async () => {
    const criarRegistro = jest.fn().mockRejectedValue(
      new PrismaClientKnownRequestError('Restrição única violada', {
        code: 'P2002',
        clientVersion: '6.19.0',
        meta: { target: ['placa'] },
      }),
    );
    const servicoPrisma = { veiculo: { create: criarRegistro } } as unknown as ServicoPrisma;
    const repositorio = new RepositorioPrismaVeiculo(servicoPrisma);
    const veiculo = Veiculo.criar({
      clienteId: 'cliente-identificador',
      placa: 'ABC1D23',
      marca: 'Honda',
      modelo: 'Civic',
      ano: 2022,
    });

    await expect(repositorio.salvar(veiculo)).rejects.toThrow(ErroConflito);
  });
});
