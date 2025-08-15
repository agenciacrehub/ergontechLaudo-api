import { Controller, Delete, Get, Param, Post, Put, Body } from "@nestjs/common";
import { DepartamentService } from "./departament.service";
import { DepartamentDto, UpdateDepartamentDto } from "./dto/departament.dto";

@Controller('departament')
export class DepartamentController {
    constructor(private readonly departamentService: DepartamentService) {}

    @Post()
    create(@Body() createDepartamentDto: DepartamentDto) {
        return this.departamentService.create(createDepartamentDto);
    }

    @Get()
    findAll() {
        return this.departamentService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.departamentService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateDepartamentDto: UpdateDepartamentDto) {
        return this.departamentService.update(id, updateDepartamentDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.departamentService.remove(id);
    }
}

