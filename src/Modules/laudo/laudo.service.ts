import { Injectable } from "@nestjs/common";
import { ReportsDto } from "./dto/laudo.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ReportsService {
    constructor(private readonly prisma: PrismaService) {}
    
    async createReport(reportDto: ReportsDto) {
        return this.prisma.laudo.create({
            data: {
                name: reportDto.name,
                company_id: reportDto.company_id,
                user_id: reportDto.user_id,
                type_laudos: reportDto.type_laudos,
                status: reportDto.status,
            },
        });
    }

    async getAllReports() {
        return this.prisma.laudo.findMany({
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        legal_name: true,
                        cnpj: true,
                        street: true,
                        number: true,
                        neighborhood: true,
                        city: true,
                        state: true,
                        zip_code: true,
                        cnae: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                report_ups: {
                    select: {
                        id: true,
                        created_at: true,
                    },
                },
                formularios: {
                    select: {
                        id: true,
                        created_at: true,
                        respostas: true,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
        });
    }

    async getReportById(id: string) {
        return this.prisma.laudo.findUnique({
            where: {
                id,
            },
        });
    }

    async updateReport(id: string, reportDto: ReportsDto) {
        return this.prisma.laudo.update({
            where: {
                id,
            },
            data: {
                name: reportDto.name,
                company_id: reportDto.company_id,
                user_id: reportDto.user_id,
                type_laudos: reportDto.type_laudos,
                status: reportDto.status,
            },
        });
    }

    async deleteReport(id: string) {
        return this.prisma.laudo.delete({
            where: {
                id,
            },
        });
    }
}
