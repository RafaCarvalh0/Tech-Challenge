import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";

export class DadosCriarServico {
  @ApiProperty({ example: "Troca de óleo" })
  @IsString()
  @MinLength(2)
  nome!: string;

  @ApiProperty({
    example: "Substituição do óleo e do filtro",
    required: false,
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ example: 15000, description: "Valor em centavos" })
  @IsInt()
  @Min(0)
  precoEmCentavos!: number;
}

export class DadosAtualizarServico {
  @ApiProperty({ example: "Troca de óleo", required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  nome?: string;

  @ApiProperty({ example: "Óleo e filtro", required: false, nullable: true })
  @IsOptional()
  @IsString()
  descricao?: string | null;

  @ApiProperty({ example: 17500, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  precoEmCentavos?: number;
}
