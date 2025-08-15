import { Module } from "@nestjs/common";
import { DepartamentService } from "./departament.service";
import { DepartamentController } from "./departament.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
    providers: [DepartamentService, PrismaService],
    controllers: [DepartamentController],
})
export class DepartamentModule {}
