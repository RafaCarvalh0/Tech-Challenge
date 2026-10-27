import { Global, Module } from '@nestjs/common';

import { ServicoPrisma } from './prisma.servico';

@Global()
@Module({
  providers: [ServicoPrisma],
  exports: [ServicoPrisma],
})
export class ModuloBancoDados {}
