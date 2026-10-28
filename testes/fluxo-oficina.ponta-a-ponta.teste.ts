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
  let tokenAdministrador: string;

  function requisicaoAdministrativa() {
    const servidor = aplicacao.getHttpServer();
    const autenticar = (teste: requisicao.Test): requisicao.Test =>
      teste.auth(tokenAdministrador, { type: 'bearer' });
    return {
      get: (caminho: string) => autenticar(requisicao(servidor).get(caminho)),
      post: (caminho: string) => autenticar(requisicao(servidor).post(caminho)),
      put: (caminho: string) => autenticar(requisicao(servidor).put(caminho)),
      patch: (caminho: string) =>
        autenticar(requisicao(servidor).patch(caminho)),
      delete: (caminho: string) =>
        autenticar(requisicao(servidor).delete(caminho)),
    };
  }

  async function prepararOrcamentoParaDecisao(dados: {
    sufixo: string;
    cpfCnpj: string;
    placa: string;
    quantidadeEstoque: number;
    quantidadeOrcamento: number;
  }): Promise<{ ordemServicoId: string; pecaInsumoId: string }> {
    const respostaCliente = await requisicaoAdministrativa()
      .post('/api/clientes')
      .send({ nome: `Cliente ${dados.sufixo}`, cpfCnpj: dados.cpfCnpj })
      .expect(201);
    const respostaVeiculo = await requisicaoAdministrativa()
      .post('/api/veiculos')
      .send({
        clienteId: respostaCliente.body.identificador,
        placa: dados.placa,
        marca: 'Renault',
        modelo: 'Kwid',
        ano: 2024,
      })
      .expect(201);
    const respostaOrdem = await requisicaoAdministrativa()
      .post('/api/ordens-servico')
      .send({
        clienteId: respostaCliente.body.identificador,
        veiculoId: respostaVeiculo.body.identificador,
        descricao: `Orçamento para ${dados.sufixo}`,
      })
      .expect(201);
    const respostaPeca = await requisicaoAdministrativa()
      .post('/api/pecas-insumos')
      .send({
        codigo: `PECA-${dados.sufixo}`,
        nome: `Peça ${dados.sufixo}`,
        precoUnitarioEmCentavos: 7000,
        quantidadeEstoque: dados.quantidadeEstoque,
      })
      .expect(201);

    await requisicaoAdministrativa()
      .patch(
        `/api/ordens-servico/${respostaOrdem.body.identificador}/acoes/INICIAR_DIAGNOSTICO`,
      )
      .expect(200);
    await requisicaoAdministrativa()
      .put(`/api/ordens-servico/${respostaOrdem.body.identificador}/composicao`)
      .send({
        servicos: [],
        pecasInsumos: [
          {
            pecaInsumoId: respostaPeca.body.identificador,
            quantidade: dados.quantidadeOrcamento,
          },
        ],
      })
      .expect(200);
    await requisicaoAdministrativa()
      .post(`/api/ordens-servico/${respostaOrdem.body.identificador}/orcamento`)
      .expect(201);

    return {
      ordemServicoId: respostaOrdem.body.identificador,
      pecaInsumoId: respostaPeca.body.identificador,
    };
  }

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

    const respostaLogin = await requisicao(aplicacao.getHttpServer())
      .post('/api/autenticacao/login')
      .send({ usuario: 'administrador', senha: 'senha-de-teste' })
      .expect(201);
    tokenAdministrador = respostaLogin.body.accessToken;

    servicoPrisma = aplicacao.get(ServicoPrisma);
    await servicoPrisma.orcamento.deleteMany();
    await servicoPrisma.itemPecaInsumoOrdem.deleteMany();
    await servicoPrisma.itemServicoOrdem.deleteMany();
    await servicoPrisma.pecaInsumo.deleteMany();
    await servicoPrisma.servico.deleteMany();
    await servicoPrisma.ordemServico.deleteMany();
    await servicoPrisma.veiculo.deleteMany();
    await servicoPrisma.cliente.deleteMany();
  });

  afterAll(async () => {
    await servicoPrisma.orcamento.deleteMany();
    await servicoPrisma.itemPecaInsumoOrdem.deleteMany();
    await servicoPrisma.itemServicoOrdem.deleteMany();
    await servicoPrisma.pecaInsumo.deleteMany();
    await servicoPrisma.servico.deleteMany();
    await servicoPrisma.ordemServico.deleteMany();
    await servicoPrisma.veiculo.deleteMany();
    await servicoPrisma.cliente.deleteMany();
    await aplicacao.close();
  });

  it('cria e consulta cliente, veículo e ordem de serviço recebida', async () => {
    const respostaCliente = await requisicaoAdministrativa()
      .post('/api/clientes')
      .send({ nome: 'Maria da Silva', cpfCnpj: '529.982.247-25' })
      .expect(201);

    const respostaVeiculo = await requisicaoAdministrativa()
      .post('/api/veiculos')
      .send({
        clienteId: respostaCliente.body.identificador,
        placa: 'ABC1D23',
        marca: 'Honda',
        modelo: 'Civic',
        ano: 2022,
      })
      .expect(201);

    const respostaOrdemServico = await requisicaoAdministrativa()
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
      codigoAcompanhamento: expect.any(String),
    });

    await requisicaoAdministrativa()
      .get(`/api/ordens-servico/${respostaOrdemServico.body.identificador}`)
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body.status).toBe('RECEBIDA');
      });
  });

  it('lista, edita e exclui cliente sem vínculos', async () => {
    const respostaCriacao = await requisicaoAdministrativa()
      .post('/api/clientes')
      .send({ nome: 'Carlos Souza', cpfCnpj: '111.444.777-35' })
      .expect(201);

    await requisicaoAdministrativa()
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

    await requisicaoAdministrativa()
      .patch(`/api/clientes/${respostaCriacao.body.identificador}`)
      .send({ nome: 'Carlos de Souza' })
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body.nome).toBe('Carlos de Souza');
      });

    await requisicaoAdministrativa()
      .delete(`/api/clientes/${respostaCriacao.body.identificador}`)
      .expect(204);

    await requisicaoAdministrativa()
      .get(`/api/clientes/${respostaCriacao.body.identificador}`)
      .expect(404);
  });

  it('lista, edita e exclui veículo sem ordem de serviço', async () => {
    const respostaCliente = await requisicaoAdministrativa()
      .post('/api/clientes')
      .send({ nome: 'Fernanda Lima', cpfCnpj: '123.456.789-09' })
      .expect(201);

    const respostaVeiculo = await requisicaoAdministrativa()
      .post('/api/veiculos')
      .send({
        clienteId: respostaCliente.body.identificador,
        placa: 'BRA2E19',
        marca: 'Toyota',
        modelo: 'Corolla',
        ano: 2023,
      })
      .expect(201);

    await requisicaoAdministrativa()
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

    await requisicaoAdministrativa()
      .patch(`/api/veiculos/${respostaVeiculo.body.identificador}`)
      .send({ modelo: 'Corolla Altis', ano: 2024 })
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body).toMatchObject({
          modelo: 'Corolla Altis',
          ano: 2024,
        });
      });

    await requisicaoAdministrativa()
      .delete(`/api/veiculos/${respostaVeiculo.body.identificador}`)
      .expect(204);
  });

  it('lista, detalha e controla as transições da ordem de serviço', async () => {
    const respostaCliente = await requisicaoAdministrativa()
      .post('/api/clientes')
      .send({ nome: 'Roberto Alves', cpfCnpj: '935.411.347-80' })
      .expect(201);

    const respostaVeiculo = await requisicaoAdministrativa()
      .post('/api/veiculos')
      .send({
        clienteId: respostaCliente.body.identificador,
        placa: 'DEF4G56',
        marca: 'Ford',
        modelo: 'Ka',
        ano: 2020,
      })
      .expect(201);

    const respostaOrdem = await requisicaoAdministrativa()
      .post('/api/ordens-servico')
      .send({
        clienteId: respostaCliente.body.identificador,
        veiculoId: respostaVeiculo.body.identificador,
        descricao: 'Diagnóstico completo',
      })
      .expect(201);

    await requisicaoAdministrativa()
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

    await requisicaoAdministrativa()
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

    await requisicaoAdministrativa()
      .patch(
        `/api/ordens-servico/${respostaOrdem.body.identificador}/acoes/INICIAR_DIAGNOSTICO`,
      )
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body.status).toBe('EM_DIAGNOSTICO');
      });

    await requisicaoAdministrativa()
      .patch(
        `/api/ordens-servico/${respostaOrdem.body.identificador}/acoes/SOLICITAR_APROVACAO`,
      )
      .expect(400);
  });

  it('abre OS por CPF/CNPJ cadastrando ou reutilizando o veículo pela placa', async () => {
    await requisicaoAdministrativa()
      .post('/api/clientes')
      .send({ nome: 'Juliana Costa', cpfCnpj: '390.533.447-05' })
      .expect(201);

    const primeiraOrdem = await requisicaoAdministrativa()
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

    const segundaOrdem = await requisicaoAdministrativa()
      .post('/api/ordens-servico/abertura')
      .send({
        cpfCnpj: '39053344705',
        descricao: 'Verificação dos freios',
        veiculo: { placa: 'ghi5j67' },
      })
      .expect(201);

    expect(primeiraOrdem.body).toMatchObject({
      status: 'RECEBIDA',
      codigoAcompanhamento: expect.any(String),
    });
    expect(segundaOrdem.body).toMatchObject({
      veiculoId: primeiraOrdem.body.veiculoId,
      status: 'RECEBIDA',
      codigoAcompanhamento: expect.any(String),
    });

    await requisicao(aplicacao.getHttpServer())
      .get(
        `/api/acompanhamento/ordens-servico/${primeiraOrdem.body.identificador}`,
      )
      .set('X-Codigo-Acompanhamento', primeiraOrdem.body.codigoAcompanhamento)
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body).toMatchObject({
          identificador: primeiraOrdem.body.identificador,
          descricao: 'Revisão preventiva',
          status: 'RECEBIDA',
          composicao: null,
          orcamento: null,
        });
        expect(resposta.body).not.toHaveProperty('clienteId');
        expect(resposta.body).not.toHaveProperty('veiculoId');
        expect(resposta.body).not.toHaveProperty('codigoAcompanhamento');
      });

    await requisicao(aplicacao.getHttpServer())
      .get(
        `/api/acompanhamento/ordens-servico/${primeiraOrdem.body.identificador}`,
      )
      .set('X-Codigo-Acompanhamento', 'codigo-invalido')
      .expect(404);

    await requisicao(aplicacao.getHttpServer())
      .get(
        `/api/acompanhamento/ordens-servico/${primeiraOrdem.body.identificador}`,
      )
      .expect(404);

    await requisicaoAdministrativa()
      .get(`/api/ordens-servico/${primeiraOrdem.body.identificador}`)
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body).not.toHaveProperty('codigoAcompanhamento');
      });
  });

  it('desfaz o veículo quando a abertura da OS falha dentro da transação', async () => {
    await requisicaoAdministrativa()
      .post('/api/clientes')
      .send({ nome: 'Cliente Transação', cpfCnpj: '111.444.777-35' })
      .expect(201);

    await servicoPrisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION falhar_ordem_abertura_teste()
      RETURNS trigger AS $$
      BEGIN
        IF NEW.descricao = 'FALHA_TRANSACAO_TESTE' THEN
          RAISE EXCEPTION 'Falha intencional ao criar ordem';
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);
    await servicoPrisma.$executeRawUnsafe(`
      CREATE TRIGGER falhar_ordem_abertura_teste
      BEFORE INSERT ON ordens_servico
      FOR EACH ROW EXECUTE FUNCTION falhar_ordem_abertura_teste()
    `);
    await servicoPrisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION falhar_exclusao_veiculo_teste()
      RETURNS trigger AS $$
      BEGIN
        IF OLD.placa = 'TXA1B23' THEN
          RAISE EXCEPTION 'Falha intencional ao excluir veículo';
        END IF;
        RETURN OLD;
      END;
      $$ LANGUAGE plpgsql
    `);
    await servicoPrisma.$executeRawUnsafe(`
      CREATE TRIGGER falhar_exclusao_veiculo_teste
      BEFORE DELETE ON veiculos
      FOR EACH ROW EXECUTE FUNCTION falhar_exclusao_veiculo_teste()
    `);

    try {
      await requisicaoAdministrativa()
        .post('/api/ordens-servico/abertura')
        .send({
          cpfCnpj: '111.444.777-35',
          descricao: 'FALHA_TRANSACAO_TESTE',
          veiculo: {
            placa: 'TXA1B23',
            marca: 'Toyota',
            modelo: 'Yaris',
            ano: 2025,
          },
        })
        .expect(500);

      await expect(
        servicoPrisma.veiculo.findUnique({ where: { placa: 'TXA1B23' } }),
      ).resolves.toBeNull();
    } finally {
      await servicoPrisma.$executeRawUnsafe(
        'DROP TRIGGER IF EXISTS falhar_ordem_abertura_teste ON ordens_servico',
      );
      await servicoPrisma.$executeRawUnsafe(
        'DROP FUNCTION IF EXISTS falhar_ordem_abertura_teste()',
      );
      await servicoPrisma.$executeRawUnsafe(
        'DROP TRIGGER IF EXISTS falhar_exclusao_veiculo_teste ON veiculos',
      );
      await servicoPrisma.$executeRawUnsafe(
        'DROP FUNCTION IF EXISTS falhar_exclusao_veiculo_teste()',
      );
      await servicoPrisma.veiculo.deleteMany({ where: { placa: 'TXA1B23' } });
    }
  });

  it('reutiliza o mesmo veículo em aberturas concorrentes', async () => {
    await requisicaoAdministrativa()
      .post('/api/clientes')
      .send({ nome: 'Cliente Concorrente', cpfCnpj: '741.852.963-55' })
      .expect(201);

    const abrir = (descricao: string) =>
      requisicaoAdministrativa()
        .post('/api/ordens-servico/abertura')
        .send({
          cpfCnpj: '741.852.963-55',
          descricao,
          veiculo: {
            placa: 'RTX4B26',
            marca: 'Honda',
            modelo: 'City',
            ano: 2025,
          },
        });
    const respostas = await Promise.all([
      abrir('Abertura concorrente 1'),
      abrir('Abertura concorrente 2'),
    ]);

    expect(respostas.map((resposta) => resposta.status).sort()).toEqual([
      201, 201,
    ]);
    expect(respostas[0].body.veiculoId).toBe(respostas[1].body.veiculoId);
  });

  it('cadastra, lista, atualiza, consulta e exclui um serviço', async () => {
    const respostaCriacao = await requisicaoAdministrativa()
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

    await requisicaoAdministrativa()
      .post('/api/servicos')
      .send({ nome: 'Troca de óleo', precoEmCentavos: 16000 })
      .expect(409);

    await requisicaoAdministrativa()
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

    await requisicaoAdministrativa()
      .patch(`/api/servicos/${respostaCriacao.body.identificador}`)
      .send({ precoEmCentavos: 17500 })
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body.precoEmCentavos).toBe(17500);
      });

    await requisicaoAdministrativa()
      .patch(`/api/servicos/${respostaCriacao.body.identificador}`)
      .send({})
      .expect(400);

    await requisicaoAdministrativa()
      .get(`/api/servicos/${respostaCriacao.body.identificador}`)
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body).toMatchObject({
          identificador: respostaCriacao.body.identificador,
          nome: 'Troca de óleo',
          precoEmCentavos: 17500,
        });
      });

    await requisicaoAdministrativa()
      .delete(`/api/servicos/${respostaCriacao.body.identificador}`)
      .expect(204);

    await requisicaoAdministrativa()
      .get(`/api/servicos/${respostaCriacao.body.identificador}`)
      .expect(404);
  });

  it('rejeita serviço com preço negativo', async () => {
    await requisicaoAdministrativa()
      .post('/api/servicos')
      .send({ nome: 'Alinhamento', precoEmCentavos: -1 })
      .expect(400);
  });

  it('gerencia peças e insumos com movimentação de estoque', async () => {
    const respostaCriacao = await requisicaoAdministrativa()
      .post('/api/pecas-insumos')
      .send({
        codigo: 'OLEO-5W30',
        nome: 'Óleo 5W30',
        descricao: 'Embalagem de um litro',
        precoUnitarioEmCentavos: 4500,
        quantidadeEstoque: 10,
      })
      .expect(201);

    expect(respostaCriacao.body).toMatchObject({
      codigo: 'OLEO-5W30',
      nome: 'Óleo 5W30',
      precoUnitarioEmCentavos: 4500,
      quantidadeEstoque: 10,
    });

    await requisicaoAdministrativa()
      .post('/api/pecas-insumos')
      .send({
        codigo: 'oleo-5w30',
        nome: 'Óleo concorrente',
        precoUnitarioEmCentavos: 4000,
        quantidadeEstoque: 1,
      })
      .expect(409);

    await requisicaoAdministrativa()
      .get('/api/pecas-insumos')
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              identificador: respostaCriacao.body.identificador,
              codigo: 'OLEO-5W30',
            }),
          ]),
        );
      });

    await requisicaoAdministrativa()
      .patch(`/api/pecas-insumos/${respostaCriacao.body.identificador}`)
      .send({ nome: 'Óleo sintético 5W30', precoUnitarioEmCentavos: 5000 })
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body).toMatchObject({
          nome: 'Óleo sintético 5W30',
          precoUnitarioEmCentavos: 5000,
        });
      });

    await requisicaoAdministrativa()
      .patch(`/api/pecas-insumos/${respostaCriacao.body.identificador}/estoque`)
      .send({ tipo: 'ENTRADA', quantidade: 5 })
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body.quantidadeEstoque).toBe(15);
      });

    await requisicaoAdministrativa()
      .patch(`/api/pecas-insumos/${respostaCriacao.body.identificador}/estoque`)
      .send({ tipo: 'SAIDA', quantidade: 4 })
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body.quantidadeEstoque).toBe(11);
      });

    await requisicaoAdministrativa()
      .patch(`/api/pecas-insumos/${respostaCriacao.body.identificador}/estoque`)
      .send({ tipo: 'SAIDA', quantidade: 12 })
      .expect(400);

    await requisicaoAdministrativa()
      .get(`/api/pecas-insumos/${respostaCriacao.body.identificador}`)
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body).toMatchObject({
          identificador: respostaCriacao.body.identificador,
          quantidadeEstoque: 11,
        });
      });

    await requisicaoAdministrativa()
      .delete(`/api/pecas-insumos/${respostaCriacao.body.identificador}`)
      .expect(204);

    await requisicaoAdministrativa()
      .get(`/api/pecas-insumos/${respostaCriacao.body.identificador}`)
      .expect(404);
  });

  it('define e consulta a composição da ordem de serviço', async () => {
    const respostaCliente = await requisicaoAdministrativa()
      .post('/api/clientes')
      .send({ nome: 'Paulo Mendes', cpfCnpj: '168.995.350-09' })
      .expect(201);

    const respostaVeiculo = await requisicaoAdministrativa()
      .post('/api/veiculos')
      .send({
        clienteId: respostaCliente.body.identificador,
        placa: 'JKL6M78',
        marca: 'Volkswagen',
        modelo: 'Polo',
        ano: 2022,
      })
      .expect(201);

    const respostaOrdem = await requisicaoAdministrativa()
      .post('/api/ordens-servico')
      .send({
        clienteId: respostaCliente.body.identificador,
        veiculoId: respostaVeiculo.body.identificador,
        descricao: 'Diagnóstico para orçamento',
      })
      .expect(201);

    const respostaServico = await requisicaoAdministrativa()
      .post('/api/servicos')
      .send({ nome: 'Balanceamento completo', precoEmCentavos: 8000 })
      .expect(201);

    const respostaPeca = await requisicaoAdministrativa()
      .post('/api/pecas-insumos')
      .send({
        codigo: 'PASTILHA-FREIO-TESTE',
        nome: 'Pastilha de freio',
        precoUnitarioEmCentavos: 12000,
        quantidadeEstoque: 5,
      })
      .expect(201);

    await requisicaoAdministrativa()
      .patch(
        `/api/ordens-servico/${respostaOrdem.body.identificador}/acoes/INICIAR_DIAGNOSTICO`,
      )
      .expect(200);

    await requisicaoAdministrativa()
      .put(`/api/ordens-servico/${respostaOrdem.body.identificador}/composicao`)
      .send({
        servicos: [
          { servicoId: respostaServico.body.identificador, quantidade: 2 },
        ],
        pecasInsumos: [
          { pecaInsumoId: respostaPeca.body.identificador, quantidade: 2 },
        ],
      })
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body).toMatchObject({
          ordemServicoId: respostaOrdem.body.identificador,
          subtotalServicosEmCentavos: 16000,
          subtotalPecasInsumosEmCentavos: 24000,
          totalEmCentavos: 40000,
        });
      });

    await requisicaoAdministrativa()
      .get(`/api/ordens-servico/${respostaOrdem.body.identificador}`)
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body.composicao).toMatchObject({
          totalEmCentavos: 40000,
          servicos: [
            expect.objectContaining({
              servicoId: respostaServico.body.identificador,
              nome: 'Balanceamento completo',
              quantidade: 2,
              subtotalEmCentavos: 16000,
            }),
          ],
          pecasInsumos: [
            expect.objectContaining({
              pecaInsumoId: respostaPeca.body.identificador,
              codigo: 'PASTILHA-FREIO-TESTE',
              quantidade: 2,
              subtotalEmCentavos: 24000,
            }),
          ],
        });
      });

    await requisicaoAdministrativa()
      .delete(`/api/servicos/${respostaServico.body.identificador}`)
      .expect(409);
    await requisicaoAdministrativa()
      .delete(`/api/pecas-insumos/${respostaPeca.body.identificador}`)
      .expect(409);
  });

  it('gera e envia orçamento calculado automaticamente', async () => {
    const respostaCliente = await requisicaoAdministrativa()
      .post('/api/clientes')
      .send({ nome: 'Empresa de Teste', cpfCnpj: '04.252.011/0001-10' })
      .expect(201);

    const respostaVeiculo = await requisicaoAdministrativa()
      .post('/api/veiculos')
      .send({
        clienteId: respostaCliente.body.identificador,
        placa: 'MNO7P89',
        marca: 'Fiat',
        modelo: 'Strada',
        ano: 2023,
      })
      .expect(201);

    const respostaOrdem = await requisicaoAdministrativa()
      .post('/api/ordens-servico')
      .send({
        clienteId: respostaCliente.body.identificador,
        veiculoId: respostaVeiculo.body.identificador,
        descricao: 'Preparação do orçamento automático',
      })
      .expect(201);

    const respostaServico = await requisicaoAdministrativa()
      .post('/api/servicos')
      .send({ nome: 'Revisão elétrica completa', precoEmCentavos: 10000 })
      .expect(201);

    const respostaPeca = await requisicaoAdministrativa()
      .post('/api/pecas-insumos')
      .send({
        codigo: 'BATERIA-TESTE',
        nome: 'Bateria de teste',
        precoUnitarioEmCentavos: 5000,
        quantidadeEstoque: 10,
      })
      .expect(201);

    await requisicaoAdministrativa()
      .patch(
        `/api/ordens-servico/${respostaOrdem.body.identificador}/acoes/INICIAR_DIAGNOSTICO`,
      )
      .expect(200);

    await requisicaoAdministrativa()
      .put(`/api/ordens-servico/${respostaOrdem.body.identificador}/composicao`)
      .send({
        servicos: [
          { servicoId: respostaServico.body.identificador, quantidade: 1 },
        ],
        pecasInsumos: [
          { pecaInsumoId: respostaPeca.body.identificador, quantidade: 3 },
        ],
      })
      .expect(200);

    await requisicaoAdministrativa()
      .post(`/api/ordens-servico/${respostaOrdem.body.identificador}/orcamento`)
      .expect(201)
      .expect((resposta) => {
        expect(resposta.body).toMatchObject({
          ordemServicoId: respostaOrdem.body.identificador,
          subtotalServicosEmCentavos: 10000,
          subtotalPecasInsumosEmCentavos: 15000,
          totalEmCentavos: 25000,
          situacao: 'PENDENTE',
        });
      });

    await requisicaoAdministrativa()
      .get(`/api/ordens-servico/${respostaOrdem.body.identificador}`)
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body).toMatchObject({
          status: 'AGUARDANDO_APROVACAO',
          orcamento: {
            totalEmCentavos: 25000,
            situacao: 'PENDENTE',
          },
        });
      });
  });

  it('aprova orçamento, inicia execução e baixa o estoque', async () => {
    const dados = await prepararOrcamentoParaDecisao({
      sufixo: 'APROVA',
      cpfCnpj: '24681357928',
      placa: 'QRS1T23',
      quantidadeEstoque: 5,
      quantidadeOrcamento: 2,
    });

    await requisicaoAdministrativa()
      .patch(`/api/ordens-servico/${dados.ordemServicoId}/orcamento/decisao`)
      .send({ decisao: 'APROVAR' })
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body).toMatchObject({
          ordemServico: { status: 'EM_EXECUCAO' },
          orcamento: { situacao: 'APROVADO' },
        });
      });

    await requisicaoAdministrativa()
      .get(`/api/pecas-insumos/${dados.pecaInsumoId}`)
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body.quantidadeEstoque).toBe(3);
      });
  });

  it('rejeita orçamento sem baixar estoque e retorna ao diagnóstico', async () => {
    const dados = await prepararOrcamentoParaDecisao({
      sufixo: 'REJEITA',
      cpfCnpj: '13579246828',
      placa: 'UVW4X56',
      quantidadeEstoque: 4,
      quantidadeOrcamento: 2,
    });

    await requisicaoAdministrativa()
      .patch(`/api/ordens-servico/${dados.ordemServicoId}/orcamento/decisao`)
      .send({ decisao: 'REJEITAR' })
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body).toMatchObject({
          ordemServico: { status: 'EM_DIAGNOSTICO' },
          orcamento: { situacao: 'REJEITADO' },
        });
      });

    await requisicaoAdministrativa()
      .get(`/api/pecas-insumos/${dados.pecaInsumoId}`)
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body.quantidadeEstoque).toBe(4);
      });
  });

  it('mantém orçamento e OS inalterados quando falta estoque', async () => {
    const dados = await prepararOrcamentoParaDecisao({
      sufixo: 'SEM-ESTOQUE',
      cpfCnpj: '98765432100',
      placa: 'YZA7B89',
      quantidadeEstoque: 1,
      quantidadeOrcamento: 1,
    });

    await requisicaoAdministrativa()
      .patch(`/api/pecas-insumos/${dados.pecaInsumoId}/estoque`)
      .send({ tipo: 'SAIDA', quantidade: 1 })
      .expect(200);

    await requisicaoAdministrativa()
      .patch(`/api/ordens-servico/${dados.ordemServicoId}/orcamento/decisao`)
      .send({ decisao: 'APROVAR' })
      .expect(400);

    await requisicaoAdministrativa()
      .get(`/api/ordens-servico/${dados.ordemServicoId}`)
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body).toMatchObject({
          status: 'AGUARDANDO_APROVACAO',
          orcamento: { situacao: 'PENDENTE' },
        });
      });

    await requisicaoAdministrativa()
      .patch(`/api/ordens-servico/${dados.ordemServicoId}/acoes/APROVAR`)
      .expect(400);
  });

  it('aceita apenas uma de duas aprovações concorrentes', async () => {
    const dados = await prepararOrcamentoParaDecisao({
      sufixo: 'CONCORRENTE-APROVA',
      cpfCnpj: '31415926590',
      placa: 'CDE1F23',
      quantidadeEstoque: 5,
      quantidadeOrcamento: 2,
    });

    const decidir = () =>
      requisicaoAdministrativa()
        .patch(`/api/ordens-servico/${dados.ordemServicoId}/orcamento/decisao`)
        .send({ decisao: 'APROVAR' });
    const respostas = await Promise.all([decidir(), decidir()]);

    expect(respostas.map((resposta) => resposta.status).sort()).toEqual([
      200, 400,
    ]);
    await requisicaoAdministrativa()
      .get(`/api/pecas-insumos/${dados.pecaInsumoId}`)
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body.quantidadeEstoque).toBe(3);
      });
  });

  it('mantém decisão e estoque consistentes em aprovação e rejeição concorrentes', async () => {
    const dados = await prepararOrcamentoParaDecisao({
      sufixo: 'CONCORRENTE-MISTA',
      cpfCnpj: '27182818205',
      placa: 'FGH4J56',
      quantidadeEstoque: 5,
      quantidadeOrcamento: 2,
    });
    const decidir = (decisao: 'APROVAR' | 'REJEITAR') =>
      requisicaoAdministrativa()
        .patch(`/api/ordens-servico/${dados.ordemServicoId}/orcamento/decisao`)
        .send({ decisao });

    const respostas = await Promise.all([
      decidir('APROVAR'),
      decidir('REJEITAR'),
    ]);
    expect(respostas.map((resposta) => resposta.status).sort()).toEqual([
      200, 400,
    ]);

    const respostaOrdem = await requisicaoAdministrativa()
      .get(`/api/ordens-servico/${dados.ordemServicoId}`)
      .expect(200);
    const respostaPeca = await requisicaoAdministrativa()
      .get(`/api/pecas-insumos/${dados.pecaInsumoId}`)
      .expect(200);
    if (respostaOrdem.body.orcamento.situacao === 'APROVADO') {
      expect(respostaOrdem.body.status).toBe('EM_EXECUCAO');
      expect(respostaPeca.body.quantidadeEstoque).toBe(3);
    } else {
      expect(respostaOrdem.body.orcamento.situacao).toBe('REJEITADO');
      expect(respostaOrdem.body.status).toBe('EM_DIAGNOSTICO');
      expect(respostaPeca.body.quantidadeEstoque).toBe(5);
    }
  });

  it('mantém composição e orçamento na mesma versão durante concorrência', async () => {
    const respostaCliente = await requisicaoAdministrativa()
      .post('/api/clientes')
      .send({ nome: 'Cliente Versão', cpfCnpj: '16180339805' })
      .expect(201);
    const respostaVeiculo = await requisicaoAdministrativa()
      .post('/api/veiculos')
      .send({
        clienteId: respostaCliente.body.identificador,
        placa: 'JKL1M23',
        marca: 'Honda',
        modelo: 'Fit',
        ano: 2020,
      })
      .expect(201);
    const respostaOrdem = await requisicaoAdministrativa()
      .post('/api/ordens-servico')
      .send({
        clienteId: respostaCliente.body.identificador,
        veiculoId: respostaVeiculo.body.identificador,
        descricao: 'Teste de versão do orçamento',
      })
      .expect(201);
    const respostaServico = await requisicaoAdministrativa()
      .post('/api/servicos')
      .send({ nome: 'Serviço versionado', precoEmCentavos: 9000 })
      .expect(201);
    await requisicaoAdministrativa()
      .patch(
        `/api/ordens-servico/${respostaOrdem.body.identificador}/acoes/INICIAR_DIAGNOSTICO`,
      )
      .expect(200);
    const definirComposicao = (quantidade: number) =>
      requisicaoAdministrativa()
        .put(
          `/api/ordens-servico/${respostaOrdem.body.identificador}/composicao`,
        )
        .send({
          servicos: [
            { servicoId: respostaServico.body.identificador, quantidade },
          ],
          pecasInsumos: [],
        });
    await definirComposicao(1).expect(200);

    let liberarBloqueio: () => void = () => {};
    let sinalizarBloqueio: () => void = () => {};
    const bloqueioAdquirido = new Promise<void>((resolver) => {
      sinalizarBloqueio = resolver;
    });
    const aguardarLiberacao = new Promise<void>((resolver) => {
      liberarBloqueio = resolver;
    });
    const transacaoBloqueio = servicoPrisma.$transaction(async (transacao) => {
      await transacao.$queryRawUnsafe(
        'SELECT identificador FROM ordens_servico WHERE identificador = $1 FOR UPDATE',
        respostaOrdem.body.identificador,
      );
      sinalizarBloqueio();
      await aguardarLiberacao;
    });
    await bloqueioAdquirido;

    const envio = requisicaoAdministrativa()
      .post(`/api/ordens-servico/${respostaOrdem.body.identificador}/orcamento`)
      .then((resposta) => resposta);
    const alteracao = definirComposicao(2).then((resposta) => resposta);
    await new Promise((resolver) => setTimeout(resolver, 100));
    liberarBloqueio();
    const [respostaEnvio] = await Promise.all([
      envio,
      alteracao,
      transacaoBloqueio,
    ]);
    expect(respostaEnvio.status).toBe(201);

    await requisicaoAdministrativa()
      .get(`/api/ordens-servico/${respostaOrdem.body.identificador}`)
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body.orcamento.totalEmCentavos).toBe(
          resposta.body.composicao.totalEmCentavos,
        );
      });
  });

  it('calcula o tempo médio apenas com ordens finalizadas e protege o indicador', async () => {
    await requisicao(aplicacao.getHttpServer())
      .get('/api/indicadores/tempo-medio-servicos')
      .expect(401);

    const cliente = await servicoPrisma.cliente.create({
      data: { nome: 'Cliente Indicadores', cpfCnpj: '11222333000181' },
    });
    const veiculo = await servicoPrisma.veiculo.create({
      data: {
        clienteId: cliente.identificador,
        placa: 'TEM5P67',
        marca: 'Fiat',
        modelo: 'Cronos',
        ano: 2023,
      },
    });
    const servico = await servicoPrisma.servico.create({
      data: {
        nome: 'Serviço para indicador',
        precoEmCentavos: 12000,
      },
    });
    const criarOrdemComServico = async (dados: {
      codigoAcompanhamento: string;
      status: 'FINALIZADA' | 'ENTREGUE' | 'EM_EXECUCAO';
      inicioExecucaoEm: Date;
      finalizadoEm: Date | null;
    }) => {
      const ordemServico = await servicoPrisma.ordemServico.create({
        data: {
          clienteId: cliente.identificador,
          veiculoId: veiculo.identificador,
          codigoAcompanhamento: dados.codigoAcompanhamento,
          descricao: 'Medição do indicador',
          status: dados.status,
          inicioExecucaoEm: dados.inicioExecucaoEm,
          finalizadoEm: dados.finalizadoEm,
        },
      });
      await servicoPrisma.itemServicoOrdem.create({
        data: {
          ordemServicoId: ordemServico.identificador,
          servicoId: servico.identificador,
          nome: servico.nome,
          precoUnitarioEmCentavos: servico.precoEmCentavos,
          quantidade: 1,
        },
      });
    };

    await criarOrdemComServico({
      codigoAcompanhamento: 'INDICADOR-FINALIZADA',
      status: 'FINALIZADA',
      inicioExecucaoEm: new Date('2026-10-28T08:00:00.000Z'),
      finalizadoEm: new Date('2026-10-28T09:00:00.000Z'),
    });
    await criarOrdemComServico({
      codigoAcompanhamento: 'INDICADOR-ENTREGUE',
      status: 'ENTREGUE',
      inicioExecucaoEm: new Date('2026-10-28T10:00:00.000Z'),
      finalizadoEm: new Date('2026-10-28T12:00:00.000Z'),
    });
    await criarOrdemComServico({
      codigoAcompanhamento: 'INDICADOR-EM-EXECUCAO',
      status: 'EM_EXECUCAO',
      inicioExecucaoEm: new Date('2026-10-28T13:00:00.000Z'),
      finalizadoEm: null,
    });

    await requisicaoAdministrativa()
      .get('/api/indicadores/tempo-medio-servicos')
      .expect(200)
      .expect((resposta) => {
        expect(resposta.body).toContainEqual({
          servicoId: servico.identificador,
          nome: 'Serviço para indicador',
          quantidadeOrdens: 2,
          tempoMedioExecucaoEmSegundos: 5400,
        });
      });
  });
});
