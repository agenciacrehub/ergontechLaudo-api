import { Controller, Post, Body, Get, Put, Delete, Param, Query } from "@nestjs/common";
import { FunctionDto } from "./dto/function.dto";
import { FunctionService } from "./function.service";

@Controller('function')
export class FunctionController {
    constructor(private readonly functionService: FunctionService) {}

    @Post()
    async createFunction(@Body() dto: FunctionDto) {
        return this.functionService.createFunction(dto);
    }

    @Get()
    async getAllFunctions() {
        return this.functionService.getAllFunctions();
    }

    @Put(':id')
    async updateFunction(@Param('id') id: string, @Body() dto: FunctionDto) {
        return this.functionService.updateFunction(id, dto);
    }

    @Delete(':id')
    async deleteFunction(@Param('id') id: string) {
        return this.functionService.deleteFunction(id);
    }
}
