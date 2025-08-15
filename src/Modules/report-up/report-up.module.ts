import { Module } from '@nestjs/common';
import { ReportUpService } from './report-up.service';
import { ReportUpController } from './report-up.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ReportUpController],
  providers: [ReportUpService, PrismaService],
  exports: [ReportUpService],
})
export class ReportUpModule {}
