import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import requisicao = require('supertest');

import { ModuloAplicacao } from '../src/aplicacao.module';

describe('API de saúde (ponta a ponta)', () => {
  let aplicacao: INestApplication;

  beforeAll(async () => {
    const referenciaModulo = await Test.createTestingModule({
      imports: [ModuloAplicacao],
    }).compile();

    aplicacao = referenciaModulo.createNestApplication();
    aplicacao.setGlobalPrefix('api');
    await aplicacao.init();
  });

  afterAll(async () => {
    await aplicacao.close();
  });

  it('retorna a situação de saúde do serviço', async () => {
    await requisicao(aplicacao.getHttpServer())
      .get('/api/saude')
      .expect(200)
      .expect({ situacao: 'ok' });
  });
});
