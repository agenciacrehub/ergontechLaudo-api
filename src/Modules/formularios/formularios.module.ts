import { Module } from '@nestjs/common';
import { FormulariosService } from './formularios.service';
import { FormulariosController } from './formularios.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [FormulariosController],
  providers: [FormulariosService, PrismaService],
  exports: [FormulariosService],
})
export class FormulariosModule {}
