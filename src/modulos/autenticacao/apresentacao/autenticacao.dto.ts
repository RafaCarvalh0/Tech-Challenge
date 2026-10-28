import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class DadosLoginAdministrador {
  @ApiProperty({ example: "administrador" })
  @IsString()
  @MinLength(1)
  usuario!: string;

  @ApiProperty({ example: "senha-segura" })
  @IsString()
  @MinLength(1)
  senha!: string;
}
