import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class DadosCriarCliente {
  @ApiProperty({ example: 'Maria da Silva' })
  @IsString()
  @MinLength(2)
  nome!: string;

  @ApiProperty({ example: '529.982.247-25' })
  @IsString()
  cpfCnpj!: string;
}
