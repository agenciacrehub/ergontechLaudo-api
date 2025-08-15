import { Module } from '@nestjs/common';
import { AuthModule } from './Modules/auth/auth.module';
import { PrismaService } from './Modules/prisma/prisma.service';
import { SetorModule } from './Modules/setor/setor.module';
import { FunctionModule } from './Modules/function/function.module';
import { DepartamentModule } from './Modules/departament/departament.module';
import { CompanyModule } from './Modules/company/company.module';
import { UsersModule } from './Modules/users/users.module';
import { ReportsModule } from './Modules/laudo/laudo.module';
import { FormulariosModule } from './Modules/formularios/formularios.module';
import { ReportUpModule } from './Modules/report-up/report-up.module';

@Module({
  imports: [AuthModule, SetorModule, FunctionModule, DepartamentModule, CompanyModule, UsersModule, ReportsModule, FormulariosModule, ReportUpModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
