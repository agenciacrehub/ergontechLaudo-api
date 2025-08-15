import { Injectable } from "@nestjs/common";
import { CompanyDto, UpdateCompanyDto } from "./dto/company.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CompanyService {
    constructor(private readonly prisma: PrismaService) {}
    create(companyDto: CompanyDto) {
        return this.prisma.company.create({ data: companyDto });
    }

    findAll() {
        return this.prisma.company.findMany();
    }

    findOne(id: string) {
        return this.prisma.company.findUnique({ where: { id } });
    }

    update(id: string, updateCompanyDto: UpdateCompanyDto) {
        return this.prisma.company.update({ where: { id }, data: updateCompanyDto });
    }

    remove(id: string) {
        return this.prisma.company.delete({ where: { id } });
    }
}
