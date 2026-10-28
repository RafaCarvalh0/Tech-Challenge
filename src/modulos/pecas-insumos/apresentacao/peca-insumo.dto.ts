import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

import { TipoMovimentacaoEstoque } from '../dominio/tipo-movimentacao-estoque';

export class DadosCriarPecaInsumo {
  @ApiProperty({ example: 'OLEO-5W30' })
  @IsString()
  @MinLength(1)
  codigo!: string;

  @ApiProperty({ example: 'Óleo 5W30' })
  @IsString()
  @MinLength(2)
  nome!: string;

  @ApiProperty({ example: 'Embalagem de um litro', required: false })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ example: 4500, description: 'Valor em centavos' })
  @IsInt()
  @Min(0)
  precoUnitarioEmCentavos!: number;

  @ApiProperty({ example: 10, default: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantidadeEstoque?: number;
}

export class DadosAtualizarPecaInsumo {
  @ApiProperty({ example: 'OLEO-5W30', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  codigo?: string;

  @ApiProperty({ example: 'Óleo sintético 5W30', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  nome?: string;

  @ApiProperty({ example: 'Embalagem de um litro', required: false })
  @IsOptional()
  @IsString()
  descricao?: string | null;

  @ApiProperty({ example: 5000, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  precoUnitarioEmCentavos?: number;
}

export class DadosMovimentarEstoque {
  @ApiProperty({ enum: TipoMovimentacaoEstoque, example: 'ENTRADA' })
  @IsEnum(TipoMovimentacaoEstoque)
  tipo!: TipoMovimentacaoEstoque;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  quantidade!: number;
}
