import { Module } from "@nestjs/common";
import { ReportsService } from "./laudo.service";
import { ReportsController } from "./laudo.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
    controllers: [ReportsController],
    providers: [ReportsService, PrismaService],
    exports: [ReportsService],
})
export class ReportsModule {}