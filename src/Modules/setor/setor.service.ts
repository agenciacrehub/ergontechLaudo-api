import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SetorDto } from "./dto/setor.dto";

@Injectable()
export class SetorService {
    constructor(private readonly prisma: PrismaService) {}

    async createSetor(dto: SetorDto) {
        return this.prisma.setor.create({ data: dto });
    }

    async getAllSetors() {
        return this.prisma.setor.findMany();
    }

    async updateSetor(id: string, dto: SetorDto) {
        return this.prisma.setor.update({ where: { id }, data: dto });
    }

    async deleteSetor(id: string) {
        return this.prisma.setor.delete({ where: { id } });
    }
}
