import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { ReportUpService } from './report-up.service';
import { CreateReportUpDto } from './dto/create-report-up.dto';
import { UpdateReportUpDto } from './dto/update-report-up.dto';

@Controller('report-up')
export class ReportUpController {
  constructor(private readonly reportUpService: ReportUpService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createReportUpDto: CreateReportUpDto) {
    try {
      const reportUp = await this.reportUpService.create(createReportUpDto);
      return {
        success: true,
        message: 'Dados do AEP salvos com sucesso',
        data: reportUp
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao salvar dados do AEP',
        error: error
      };
    }
  }

  @Get()
  async findAll() {
    try {
      const reportUps = await this.reportUpService.findAll();
      return {
        success: true,
        message: 'Relatórios AEP listados com sucesso',
        data: reportUps
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao listar relatórios AEP',
        error: error
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const reportUp = await this.reportUpService.findOne(id);
      return {
        success: true,
        message: 'Relatório AEP encontrado com sucesso',
        data: reportUp
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao buscar relatório AEP',
        error: error
      };
    }
  }

  @Get('laudo/:laudoId')
  async findByLaudoId(@Param('laudoId') laudoId: string) {
    try {
      const reportUps = await this.reportUpService.findByLaudoId(laudoId);
      return {
        success: true,
        message: 'Relatórios AEP do laudo listados com sucesso',
        data: reportUps
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao buscar relatórios AEP do laudo',
        error: error
      };
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReportUpDto: UpdateReportUpDto) {
    try {
      const reportUp = await this.reportUpService.update(id, updateReportUpDto);
      return {
        success: true,
        message: 'Relatório AEP atualizado com sucesso',
        data: reportUp
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao atualizar relatório AEP',
        error: error
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.reportUpService.remove(id);
      return {
        success: true,
        message: 'Relatório AEP removido com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao remover relatório AEP',
        error: error
      };
    }
  }
}
