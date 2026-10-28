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
    await servicoPrisma.servico.deleteMany();
    await servicoPrisma.ordemServico.deleteMany();
    await servicoPrisma.veiculo.deleteMany();
    await servicoPrisma.cliente.deleteMany();
  });

  afterAll(async () => {
    await servicoPrisma.servico.deleteMany();
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

  it('lista, edita e exclui cliente sem vínculos', async () => {
    const respostaCriacao = await requisicao(aplicacao.getHttpServer())
      .post('/api/clientes')
      .send({ nome: 'Carlos Souza', cpfCnpj: '111.444.777-35' })
      .expect(201);

    await requisicao(aplicacao.getHttpServer())
      .get('/api/clientes')
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              identificador: respostaCriacao.body.identificador,
              nome: 'Carlos Souza',
            }),
          ]),
        );
      });

    await requisicao(aplicacao.getHttpServer())
      .patch(`/api/clientes/${respostaCriacao.body.identificador}`)
      .send({ nome: 'Carlos de Souza' })
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body.nome).toBe('Carlos de Souza');
      });

    await requisicao(aplicacao.getHttpServer())
      .delete(`/api/clientes/${respostaCriacao.body.identificador}`)
      .expect(204);

    await requisicao(aplicacao.getHttpServer())
      .get(`/api/clientes/${respostaCriacao.body.identificador}`)
      .expect(404);
  });

  it('lista, edita e exclui veículo sem ordem de serviço', async () => {
    const respostaCliente = await requisicao(aplicacao.getHttpServer())
      .post('/api/clientes')
      .send({ nome: 'Fernanda Lima', cpfCnpj: '123.456.789-09' })
      .expect(201);

    const respostaVeiculo = await requisicao(aplicacao.getHttpServer())
      .post('/api/veiculos')
      .send({
        clienteId: respostaCliente.body.identificador,
        placa: 'BRA2E19',
        marca: 'Toyota',
        modelo: 'Corolla',
        ano: 2023,
      })
      .expect(201);

    await requisicao(aplicacao.getHttpServer())
      .get(`/api/veiculos?clienteId=${respostaCliente.body.identificador}`)
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body).toEqual([
          expect.objectContaining({
            identificador: respostaVeiculo.body.identificador,
            placa: 'BRA2E19',
          }),
        ]);
      });

    await requisicao(aplicacao.getHttpServer())
      .patch(`/api/veiculos/${respostaVeiculo.body.identificador}`)
      .send({ modelo: 'Corolla Altis', ano: 2024 })
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body).toMatchObject({
          modelo: 'Corolla Altis',
          ano: 2024,
        });
      });

    await requisicao(aplicacao.getHttpServer())
      .delete(`/api/veiculos/${respostaVeiculo.body.identificador}`)
      .expect(204);
  });

  it('lista, detalha e controla as transições da ordem de serviço', async () => {
    const respostaCliente = await requisicao(aplicacao.getHttpServer())
      .post('/api/clientes')
      .send({ nome: 'Roberto Alves', cpfCnpj: '935.411.347-80' })
      .expect(201);

    const respostaVeiculo = await requisicao(aplicacao.getHttpServer())
      .post('/api/veiculos')
      .send({
        clienteId: respostaCliente.body.identificador,
        placa: 'DEF4G56',
        marca: 'Ford',
        modelo: 'Ka',
        ano: 2020,
      })
      .expect(201);

    const respostaOrdem = await requisicao(aplicacao.getHttpServer())
      .post('/api/ordens-servico')
      .send({
        clienteId: respostaCliente.body.identificador,
        veiculoId: respostaVeiculo.body.identificador,
        descricao: 'Diagnóstico completo',
      })
      .expect(201);

    await requisicao(aplicacao.getHttpServer())
      .get(
        `/api/ordens-servico?clienteId=${respostaCliente.body.identificador}&status=RECEBIDA`,
      )
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body).toEqual([
          expect.objectContaining({
            identificador: respostaOrdem.body.identificador,
            status: 'RECEBIDA',
          }),
        ]);
      });

    await requisicao(aplicacao.getHttpServer())
      .get(`/api/ordens-servico/${respostaOrdem.body.identificador}`)
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body).toMatchObject({
          cliente: {
            identificador: respostaCliente.body.identificador,
            cpfCnpj: '93541134780',
          },
          veiculo: {
            identificador: respostaVeiculo.body.identificador,
            placa: 'DEF4G56',
          },
        });
      });

    const transicoes = [
      ['INICIAR_DIAGNOSTICO', 'EM_DIAGNOSTICO'],
      ['SOLICITAR_APROVACAO', 'AGUARDANDO_APROVACAO'],
      ['APROVAR', 'EM_EXECUCAO'],
      ['FINALIZAR', 'FINALIZADA'],
      ['ENTREGAR', 'ENTREGUE'],
    ];

    for (const [acao, status] of transicoes) {
      await requisicao(aplicacao.getHttpServer())
        .patch(
          `/api/ordens-servico/${respostaOrdem.body.identificador}/acoes/${acao}`,
        )
        .expect(200)
        .expect((resposta) => {
          expect(resposta.body.status).toBe(status);
        });
    }

    await requisicao(aplicacao.getHttpServer())
      .patch(
        `/api/ordens-servico/${respostaOrdem.body.identificador}/acoes/APROVAR`,
      )
      .expect(400);
  });

  it('abre OS por CPF/CNPJ cadastrando ou reutilizando o veículo pela placa', async () => {
    await requisicao(aplicacao.getHttpServer())
      .post('/api/clientes')
      .send({ nome: 'Juliana Costa', cpfCnpj: '390.533.447-05' })
      .expect(201);

    const primeiraOrdem = await requisicao(aplicacao.getHttpServer())
      .post('/api/ordens-servico/abertura')
      .send({
        cpfCnpj: '390.533.447-05',
        descricao: 'Revisão preventiva',
        veiculo: {
          placa: 'GHI5J67',
          marca: 'Chevrolet',
          modelo: 'Onix',
          ano: 2021,
        },
      })
      .expect(201);

    const segundaOrdem = await requisicao(aplicacao.getHttpServer())
      .post('/api/ordens-servico/abertura')
      .send({
        cpfCnpj: '39053344705',
        descricao: 'Verificação dos freios',
        veiculo: { placa: 'ghi5j67' },
      })
      .expect(201);

    expect(primeiraOrdem.body).toMatchObject({ status: 'RECEBIDA' });
    expect(segundaOrdem.body).toMatchObject({
      veiculoId: primeiraOrdem.body.veiculoId,
      status: 'RECEBIDA',
    });
  });

  it('cadastra, lista, atualiza, consulta e exclui um serviço', async () => {
    const respostaCriacao = await requisicao(aplicacao.getHttpServer())
      .post('/api/servicos')
      .send({
        nome: 'Troca de óleo',
        descricao: 'Substituição do óleo e do filtro',
        precoEmCentavos: 15000,
      })
      .expect(201);

    expect(respostaCriacao.body).toMatchObject({
      nome: 'Troca de óleo',
      descricao: 'Substituição do óleo e do filtro',
      precoEmCentavos: 15000,
    });

    await requisicao(aplicacao.getHttpServer())
      .post('/api/servicos')
      .send({ nome: 'Troca de óleo', precoEmCentavos: 16000 })
      .expect(409);

    await requisicao(aplicacao.getHttpServer())
      .get('/api/servicos')
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              identificador: respostaCriacao.body.identificador,
              nome: 'Troca de óleo',
            }),
          ]),
        );
      });

    await requisicao(aplicacao.getHttpServer())
      .patch(`/api/servicos/${respostaCriacao.body.identificador}`)
      .send({ precoEmCentavos: 17500 })
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body.precoEmCentavos).toBe(17500);
      });

    await requisicao(aplicacao.getHttpServer())
      .patch(`/api/servicos/${respostaCriacao.body.identificador}`)
      .send({})
      .expect(400);

    await requisicao(aplicacao.getHttpServer())
      .get(`/api/servicos/${respostaCriacao.body.identificador}`)
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body).toMatchObject({
          identificador: respostaCriacao.body.identificador,
          nome: 'Troca de óleo',
          precoEmCentavos: 17500,
        });
      });

    await requisicao(aplicacao.getHttpServer())
      .delete(`/api/servicos/${respostaCriacao.body.identificador}`)
      .expect(204);

    await requisicao(aplicacao.getHttpServer())
      .get(`/api/servicos/${respostaCriacao.body.identificador}`)
      .expect(404);
  });

  it('rejeita serviço com preço negativo', async () => {
    await requisicao(aplicacao.getHttpServer())
      .post('/api/servicos')
      .send({ nome: 'Alinhamento', precoEmCentavos: -1 })
      .expect(400);
  });
});
