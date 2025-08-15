import { Module } from "@nestjs/common";
import { FunctionController } from "./function.controller";
import { FunctionService } from "./function.service";
import { PrismaService } from "../prisma/prisma.service";

@Module({
    controllers: [FunctionController],
    providers: [FunctionService, PrismaService],
})
export class FunctionModule {}