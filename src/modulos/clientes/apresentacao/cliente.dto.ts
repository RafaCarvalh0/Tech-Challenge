import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class DadosCriarCliente {
  @ApiProperty({ example: 'Maria da Silva' })
  @IsString()
  @MinLength(2)
  nome!: string;

  @ApiProperty({ example: '529.982.247-25' })
  @IsString()
  cpfCnpj!: string;
}

export class DadosAtualizarCliente {
  @ApiProperty({ example: 'Maria da Silva', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  nome?: string;

  @ApiProperty({ example: '529.982.247-25', required: false })
  @IsOptional()
  @IsString()
  cpfCnpj?: string;
}
