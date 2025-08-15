import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { FormulariosService } from './formularios.service';
import { CreateFormulariosDto } from './dto/create-formularios.dto';
import { UpdateFormulariosDto } from './dto/update-formularios.dto';
import { CreateTokenDto } from './dto/create-token.dto';

@Controller('formularios')
export class FormulariosController {
  constructor(private readonly formulariosService: FormulariosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFormulariosDto: CreateFormulariosDto) {
    try {
      const formulario = await this.formulariosService.create(createFormulariosDto);
      return {
        success: true,
        message: 'Formulário criado com sucesso',
        data: formulario
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao criar formulário',
        error: error
      };
    }
  }

  @Get()
  async findAll() {
    try {
      const formularios = await this.formulariosService.findAll();
      return {
        success: true,
        data: formularios
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao buscar formulários',
        error: error
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const formulario = await this.formulariosService.findOne(id);
      return {
        success: true,
        data: formulario
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao buscar formulário',
        error: error
      };
    }
  }

  @Get('laudo/:laudoId')
  async findByLaudoId(@Param('laudoId') laudoId: string) {
    try {
      const formularios = await this.formulariosService.findByLaudoId(laudoId);
      return {
        success: true,
        data: formularios
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao buscar formulários do laudo',
        error: error
      };
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFormulariosDto: UpdateFormulariosDto) {
    try {
      const formulario = await this.formulariosService.update(id, updateFormulariosDto);
      return {
        success: true,
        message: 'Formulário atualizado com sucesso',
        data: formulario
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao atualizar formulário',
        error: error
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.formulariosService.remove(id);
      return {
        success: true,
        message: 'Formulário removido com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao remover formulário',
        error: error
      };
    }
  }

  // ===== ENDPOINTS PARA TOKENS SEGUROS =====

  @Post('generate-token')
  @HttpCode(HttpStatus.CREATED)
  async generateToken(@Body() createTokenDto: CreateTokenDto) {
    try {
      const tokenData = await this.formulariosService.generateFormToken(createTokenDto);
      return {
        success: true,
        message: 'Token gerado com sucesso',
        data: {
          token: tokenData.token,
          expires_at: tokenData.expires_at,
          form_url: `/formulario-ergonomico?token=${tokenData.token}`,
          laudo: tokenData.laudo
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao gerar token',
        error: error
      };
    }
  }

  @Get('validate-token/:token')
  async validateToken(@Param('token') token: string) {
    try {
      const tokenData = await this.formulariosService.validateFormToken(token);
      return {
        success: true,
        message: 'Token válido',
        data: tokenData
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Token inválido',
        error: error
      };
    }
  }

  @Post('clean-expired-tokens')
  @HttpCode(HttpStatus.OK)
  async cleanExpiredTokens() {
    try {
      const result = await this.formulariosService.cleanExpiredTokens();
      return {
        success: true,
        message: `${result.count} tokens expirados removidos`,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao limpar tokens expirados',
        error: error
      };
    }
  }
}
