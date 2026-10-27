import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

import { StatusOrdemServico } from '../dominio/status-ordem-servico';

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
