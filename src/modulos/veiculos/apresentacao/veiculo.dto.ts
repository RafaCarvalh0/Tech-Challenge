import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class DadosCriarVeiculo {
  @ApiProperty()
  @IsString()
  clienteId!: string;

  @ApiProperty({ example: 'ABC1D23' })
  @IsString()
  placa!: string;

  @ApiProperty({ example: 'Honda' })
  @IsString()
  @MinLength(2)
  marca!: string;

  @ApiProperty({ example: 'Civic' })
  @IsString()
  @MinLength(1)
  modelo!: string;

  @ApiProperty({ example: 2022 })
  @IsInt()
  @Min(1886)
  @Max(new Date().getFullYear() + 1)
  ano!: number;
}

export class DadosAtualizarVeiculo {
  @ApiProperty({ example: 'ABC1D23', required: false })
  @IsOptional()
  @IsString()
  placa?: string;

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
