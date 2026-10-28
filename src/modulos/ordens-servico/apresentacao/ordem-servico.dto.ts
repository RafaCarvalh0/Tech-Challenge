import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
  IsArray,
  ArrayUnique,
} from 'class-validator';

import { StatusOrdemServico } from '../dominio/status-ordem-servico';
import { DecisaoOrcamento } from '../dominio/decisao-orcamento';

export class DadosCriarOrdemServico {
  @ApiProperty()
  @IsString()
  clienteId!: string;

  @ApiProperty()
  @IsString()
  veiculoId!: string;

  @ApiProperty({ example: 'Troca de óleo e diagnóstico dos freios' })
  @IsString()
  @MinLength(3)
  descricao!: string;
}

export class DadosListarOrdensServico {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  clienteId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  veiculoId?: string;

  @ApiProperty({ enum: StatusOrdemServico, required: false })
  @IsOptional()
  @IsEnum(StatusOrdemServico)
  status?: StatusOrdemServico;
}

export class DadosVeiculoAberturaOrdemServico {
  @ApiProperty({ example: 'ABC1D23' })
  @IsString()
  placa!: string;

  @ApiProperty({ example: 'Honda', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  marca?: string;

  @ApiProperty({ example: 'Civic', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  modelo?: string;

  @ApiProperty({ example: 2022, required: false })
  @IsOptional()
  @IsInt()
  @Min(1886)
  @Max(new Date().getFullYear() + 1)
  ano?: number;
}

export class DadosAbrirOrdemServico {
  @ApiProperty({ example: '529.982.247-25' })
  @IsString()
  cpfCnpj!: string;

  @ApiProperty({ example: 'Troca de óleo e diagnóstico dos freios' })
  @IsString()
  @MinLength(3)
  descricao!: string;

  @ApiProperty({ type: DadosVeiculoAberturaOrdemServico })
  @IsDefined()
  @ValidateNested()
  @Type(() => DadosVeiculoAberturaOrdemServico)
  veiculo!: DadosVeiculoAberturaOrdemServico;
}

export class DadosItemServicoComposicao {
  @ApiProperty()
  @IsString()
  servicoId!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  quantidade!: number;
}

export class DadosItemPecaInsumoComposicao {
  @ApiProperty()
  @IsString()
  pecaInsumoId!: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantidade!: number;
}

export class DadosDefinirComposicaoOrdemServico {
  @ApiProperty({ type: [DadosItemServicoComposicao] })
  @IsArray()
  @ArrayUnique((item: DadosItemServicoComposicao) => item.servicoId)
  @ValidateNested({ each: true })
  @Type(() => DadosItemServicoComposicao)
  servicos!: DadosItemServicoComposicao[];

  @ApiProperty({ type: [DadosItemPecaInsumoComposicao] })
  @IsArray()
  @ArrayUnique((item: DadosItemPecaInsumoComposicao) => item.pecaInsumoId)
  @ValidateNested({ each: true })
  @Type(() => DadosItemPecaInsumoComposicao)
  pecasInsumos!: DadosItemPecaInsumoComposicao[];
}

export class DadosDecidirOrcamento {
  @ApiProperty({ enum: DecisaoOrcamento, example: DecisaoOrcamento.APROVAR })
  @IsEnum(DecisaoOrcamento)
  decisao!: DecisaoOrcamento;
}
