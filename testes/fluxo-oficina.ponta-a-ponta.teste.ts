import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import requisicao = require('supertest');

import { ModuloAplicacao } from '../src/aplicacao.module';
import { ServicoPrisma } from '../src/banco-dados/prisma.servico';
import { FiltroExcecaoAplicacao } from '../src/compartilhado/apresentacao/excecao-aplicacao.filtro';
import { validarUrlBancoDadosTeste } from './seguranca-banco-dados';

describe('Fluxo da oficina (ponta a ponta)', () => {
  let aplicacao: INestApplication;
  let servicoPrisma: ServicoPrisma;

  beforeAll(async () => {
    validarUrlBancoDadosTeste(process.env.URL_BANCO_DADOS);

    const referenciaModulo = await Test.createTestingModule({
      imports: [ModuloAplicacao],
    }).compile();

    aplicacao = referenciaModulo.createNestApplication();
    aplicacao.setGlobalPrefix('api');
    aplicacao.useGlobalFilters(new FiltroExcecaoAplicacao());
    aplicacao.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await aplicacao.init();

    servicoPrisma = aplicacao.get(ServicoPrisma);
    await servicoPrisma.ordemServico.deleteMany();
    await servicoPrisma.veiculo.deleteMany();
    await servicoPrisma.cliente.deleteMany();
  });

  afterAll(async () => {
    await servicoPrisma.ordemServico.deleteMany();
    await servicoPrisma.veiculo.deleteMany();
    await servicoPrisma.cliente.deleteMany();
    await aplicacao.close();
  });

  it('cria e consulta cliente, veículo e ordem de serviço recebida', async () => {
    const respostaCliente = await requisicao(aplicacao.getHttpServer())
      .post('/api/clientes')
      .send({ nome: 'Maria da Silva', cpfCnpj: '529.982.247-25' })
      .expect(201);

    const respostaVeiculo = await requisicao(aplicacao.getHttpServer())
      .post('/api/veiculos')
      .send({
        clienteId: respostaCliente.body.identificador,
        placa: 'ABC1D23',
        marca: 'Honda',
        modelo: 'Civic',
        ano: 2022,
      })
      .expect(201);

    const respostaOrdemServico = await requisicao(aplicacao.getHttpServer())
      .post('/api/ordens-servico')
      .send({
        clienteId: respostaCliente.body.identificador,
        veiculoId: respostaVeiculo.body.identificador,
        descricao: 'Troca de óleo e diagnóstico dos freios',
      })
      .expect(201);

    expect(respostaOrdemServico.body).toMatchObject({
      clienteId: respostaCliente.body.identificador,
      veiculoId: respostaVeiculo.body.identificador,
      status: 'RECEBIDA',
    });

    await requisicao(aplicacao.getHttpServer())
      .get(`/api/ordens-servico/${respostaOrdemServico.body.identificador}`)
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body.status).toBe('RECEBIDA');
      });
  });
});
