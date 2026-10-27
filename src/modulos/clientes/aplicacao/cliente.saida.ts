import { Cliente } from '../dominio/cliente';

export interface SaidaCliente {
  identificador: string;
  nome: string;
  cpfCnpj: string;
  criadoEm: Date;
}

export function paraSaidaCliente(cliente: Cliente): SaidaCliente {
  return {
    identificador: cliente.identificador,
    nome: cliente.nome,
    cpfCnpj: cliente.cpfCnpj.valor,
    criadoEm: cliente.criadoEm,
  };
}
