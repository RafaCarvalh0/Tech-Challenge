import { randomUUID } from 'node:crypto';

import { ErroValidacao } from '../../../compartilhado/dominio/erros';
import { Placa } from './placa';

interface PropriedadesVeiculo {
  clienteId: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
}

interface EntradaRestaurarVeiculo extends PropriedadesVeiculo {
  identificador: string;
  criadoEm: Date;
}

export class Veiculo {
  private constructor(
    readonly identificador: string,
    readonly clienteId: string,
    readonly placa: Placa,
    readonly marca: string,
    readonly modelo: string,
    readonly ano: number,
    readonly criadoEm: Date,
  ) {}

  static criar(dadosEntrada: PropriedadesVeiculo): Veiculo {
    Veiculo.validarAno(dadosEntrada.ano);
    const marca = Veiculo.normalizarTextoObrigatorio(dadosEntrada.marca, 'Marca');
    const modelo = Veiculo.normalizarTextoObrigatorio(dadosEntrada.modelo, 'Modelo');
    return new Veiculo(
      randomUUID(),
      dadosEntrada.clienteId,
      Placa.criar(dadosEntrada.placa),
      marca,
      modelo,
      dadosEntrada.ano,
      new Date(),
    );
  }

  static restaurar(dadosEntrada: EntradaRestaurarVeiculo): Veiculo {
    Veiculo.validarAno(dadosEntrada.ano);
    return new Veiculo(
      dadosEntrada.identificador,
      dadosEntrada.clienteId,
      Placa.criar(dadosEntrada.placa),
      Veiculo.normalizarTextoObrigatorio(dadosEntrada.marca, 'Marca'),
      Veiculo.normalizarTextoObrigatorio(dadosEntrada.modelo, 'Modelo'),
      dadosEntrada.ano,
      dadosEntrada.criadoEm,
    );
  }

  atualizar(dadosEntrada: {
    placa?: string;
    marca?: string;
    modelo?: string;
    ano?: number;
  }): Veiculo {
    const ano = dadosEntrada.ano ?? this.ano;
    Veiculo.validarAno(ano);
    return new Veiculo(
      this.identificador,
      this.clienteId,
      dadosEntrada.placa === undefined
        ? this.placa
        : Placa.criar(dadosEntrada.placa),
      dadosEntrada.marca === undefined
        ? this.marca
        : Veiculo.normalizarTextoObrigatorio(dadosEntrada.marca, 'Marca'),
      dadosEntrada.modelo === undefined
        ? this.modelo
        : Veiculo.normalizarTextoObrigatorio(dadosEntrada.modelo, 'Modelo'),
      ano,
      this.criadoEm,
    );
  }

  private static validarAno(ano: number): void {
    const anoMaximo = new Date().getFullYear() + 1;
    if (!Number.isInteger(ano) || ano < 1886 || ano > anoMaximo) {
      throw new ErroValidacao('Ano do veículo inválido');
    }
  }

  private static normalizarTextoObrigatorio(valor: string, campo: string): string {
    const valorNormalizado = valor.trim();
    if (!valorNormalizado) {
      throw new ErroValidacao(`${campo} do veículo é obrigatório`);
    }
    return valorNormalizado;
  }
}
