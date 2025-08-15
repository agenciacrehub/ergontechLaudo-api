import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { FunctionDto } from "./dto/function.dto";

@Injectable()
export class FunctionService {
    constructor(private readonly prisma: PrismaService) {}

    async createFunction(dto: FunctionDto) {
        return this.prisma.job_function.create({ data: dto });
    }

    async getAllFunctions() {
        return this.prisma.job_function.findMany({
            include: {
                departament: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }

    async updateFunction(id: string, dto: FunctionDto) {
        return this.prisma.job_function.update({ where: { id }, data: dto });
    }

    async deleteFunction(id: string) {
        return this.prisma.job_function.delete({ where: { id } });
    }
}
