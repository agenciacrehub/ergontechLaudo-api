import { Controller, Post, Body, Get, Put, Delete, Param } from "@nestjs/common";
import { ReportsDto } from "./dto/laudo.dto";
import { ReportsService } from "./laudo.service";


@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @Post()
    async createReport(@Body() reportDto: ReportsDto) {
        return this.reportsService.createReport(reportDto);
    }

    @Get()
    async getAllReports() {
        return this.reportsService.getAllReports();
    }

    @Get(':id')
    async getReportById(@Param('id') id: string) {
        return this.reportsService.getReportById(id);
    }

    @Put(':id')
    async updateReport(@Param('id') id: string, @Body() reportDto: ReportsDto) {
        return this.reportsService.updateReport(id, reportDto);
    }

    @Delete(':id')
    async deleteReport(@Param('id') id: string) {
        return this.reportsService.deleteReport(id);
    }
}