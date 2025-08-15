import { Injectable } from "@nestjs/common";
import { DepartamentDto, UpdateDepartamentDto } from "./dto/departament.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DepartamentService {
    constructor(private readonly prisma: PrismaService) {}

    create(createDepartamentDto: DepartamentDto) {
        return this.prisma.departament.create({ data: createDepartamentDto });
    }

    findAll() {
        return this.prisma.departament.findMany({
            include: {
                setor: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }

    findOne(id: string) {
        return this.prisma.departament.findUnique({ where: { id } });
    }

    update(id: string, updateDepartamentDto: UpdateDepartamentDto) {
        return this.prisma.departament.update({ where: { id }, data: updateDepartamentDto });
    }

    remove(id: string) {
        return this.prisma.departament.delete({ where: { id } });
    }
}
