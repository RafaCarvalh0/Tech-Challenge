import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import {
  ErroConflito,
  ErroNaoEncontrado,
  ErroValidacao,
} from '../dominio/erros';

@Catch(ErroValidacao, ErroConflito, ErroNaoEncontrado)
export class FiltroExcecaoAplicacao implements ExceptionFilter {
  catch(excecao: Error, contexto: ArgumentsHost): void {
    const resposta = contexto.switchToHttp().getResponse<Response>();
    let codigoStatus = HttpStatus.NOT_FOUND;

    if (excecao instanceof ErroValidacao) {
      codigoStatus = HttpStatus.BAD_REQUEST;
    } else if (excecao instanceof ErroConflito) {
      codigoStatus = HttpStatus.CONFLICT;
    }

    resposta.status(codigoStatus).json({
      codigoStatus,
      mensagem: excecao.message,
      erro: excecao.name,
    });
  }
}
