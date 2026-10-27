import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { ServicoPrisma } from '../../../banco-dados/prisma.servico';
import { ErroConflito } from '../../../compartilhado/dominio/erros';
import { Cliente } from '../dominio/cliente';
import { RepositorioPrismaCliente } from './prisma-cliente.repositorio';

describe('RepositorioPrismaCliente', () => {
  it('converte violação concorrente de CPF/CNPJ único em conflito', async () => {
    const criarRegistro = jest.fn().mockRejectedValue(
      new PrismaClientKnownRequestError('Restrição única violada', {
        code: 'P2002',
        clientVersion: '6.19.0',
        meta: { target: ['cpfCnpj'] },
      }),
    );
    const servicoPrisma = { cliente: { create: criarRegistro } } as unknown as ServicoPrisma;
    const repositorio = new RepositorioPrismaCliente(servicoPrisma);
    const cliente = Cliente.criar({
      nome: 'Maria',
      cpfCnpj: '52998224725',
    });

    await expect(repositorio.salvar(cliente)).rejects.toThrow(ErroConflito);
  });
});
