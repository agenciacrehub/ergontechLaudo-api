import { Controller, Post, Body, Get, Put, Delete, Param } from "@nestjs/common";
import { CompanyDto } from "./dto/company.dto";
import { CompanyService } from "./company.service";

@Controller('company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}
    
    @Post()
    create(@Body() companyDto: CompanyDto) {
        return this.companyService.create(companyDto);
    }

    @Get()
    findAll() {
        return this.companyService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.companyService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() companyDto: CompanyDto) {
        return this.companyService.update(id, companyDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.companyService.remove(id);
    }
}
