import { Controller, Post, Body, Get, Put, Delete, Param, Query } from "@nestjs/common";
import { SetorDto } from "./dto/setor.dto";
import { SetorService } from "./setor.service";

@Controller('setor')
export class SetorController {
    constructor(private readonly setorService: SetorService) {}

    @Post()
    async createSetor(@Body() dto: SetorDto) {
        return this.setorService.createSetor(dto);
    }

    @Get()
    async getAllSetors() {
        return this.setorService.getAllSetors();
    }

    @Put(':id')
    async updateSetor(@Param('id') id: string, @Body() dto: SetorDto) {
        return this.setorService.updateSetor(id, dto);
    }

    @Delete(':id')
    async deleteSetor(@Param('id') id: string) {
        return this.setorService.deleteSetor(id);
    }
}
