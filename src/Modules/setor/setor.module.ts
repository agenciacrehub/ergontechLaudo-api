import { Module } from "@nestjs/common";
import { SetorController } from "./setor.controller";
import { SetorService } from "./setor.service";
import { PrismaService } from "../prisma/prisma.service";

@Module({
    controllers: [SetorController],
    providers: [SetorService, PrismaService],
})
export class SetorModule {}