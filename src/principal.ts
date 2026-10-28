import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ModuloAplicacao } from './aplicacao.module';
import { FiltroExcecaoAplicacao } from './compartilhado/apresentacao/excecao-aplicacao.filtro';

async function iniciarAplicacao(): Promise<void> {
  const aplicacao = await NestFactory.create(ModuloAplicacao);

  aplicacao.setGlobalPrefix('api');
  aplicacao.useGlobalFilters(new FiltroExcecaoAplicacao());
  aplicacao.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configuracaoSwagger = new DocumentBuilder()
    .setTitle('Tech Challenge - Oficina')
    .setDescription('API do sistema integrado de atendimento da oficina')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const documento = SwaggerModule.createDocument(aplicacao, configuracaoSwagger);
  SwaggerModule.setup('docs', aplicacao, documento, { useGlobalPrefix: false });

  await aplicacao.listen(process.env.PORTA ?? 3000);
}

void iniciarAplicacao();
