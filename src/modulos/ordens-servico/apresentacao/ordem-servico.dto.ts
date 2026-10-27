import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

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
