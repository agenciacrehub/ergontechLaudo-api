import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFormulariosDto } from './dto/create-formularios.dto';
import { UpdateFormulariosDto } from './dto/update-formularios.dto';
import { CreateTokenDto } from './dto/create-token.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class FormulariosService {
  constructor(private prisma: PrismaService) {}

  async create(createFormulariosDto: CreateFormulariosDto) {
    // Verificar se o laudo existe
    const laudo = await this.prisma.laudo.findUnique({
      where: { id: createFormulariosDto.laudo_id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            legal_name: true,
            cnpj: true,
          }
        }
      }
    });

    if (!laudo) {
      throw new NotFoundException('Laudo não encontrado');
    }

    // Criar o formulário
    const formulario = await this.prisma.formularios.create({
      data: {
        laudo_id: createFormulariosDto.laudo_id,
        respostas: createFormulariosDto.respostas,
      },
      include: {
        laudo: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                legal_name: true,
                cnpj: true,
              }
            }
          }
        }
      }
    });

    return formulario;
  }

  async findAll() {
    return this.prisma.formularios.findMany({
      include: {
        laudo: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                legal_name: true,
                cnpj: true,
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  }

  async findOne(id: string) {
    const formulario = await this.prisma.formularios.findUnique({
      where: { id },
      include: {
        laudo: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                legal_name: true,
                cnpj: true,
              }
            }
          }
        }
      }
    });

    if (!formulario) {
      throw new NotFoundException('Formulário não encontrado');
    }

    return formulario;
  }

  async findByLaudoId(laudoId: string) {
    return this.prisma.formularios.findMany({
      where: { laudo_id: laudoId },
      include: {
        laudo: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                legal_name: true,
                cnpj: true,
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  }

  async update(id: string, updateFormulariosDto: UpdateFormulariosDto) {
    // Verificar se o formulário existe
    const formulario = await this.prisma.formularios.findUnique({
      where: { id }
    });

    if (!formulario) {
      throw new NotFoundException('Formulário não encontrado');
    }

    // Se está atualizando o laudo_id, verificar se o novo laudo existe
    if (updateFormulariosDto.laudo_id) {
      const laudo = await this.prisma.laudo.findUnique({
        where: { id: updateFormulariosDto.laudo_id }
      });

      if (!laudo) {
        throw new NotFoundException('Laudo não encontrado');
      }
    }

    return this.prisma.formularios.update({
      where: { id },
      data: updateFormulariosDto,
      include: {
        laudo: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                legal_name: true,
                cnpj: true,
              }
            }
          }
        }
      }
    });
  }

  async remove(id: string) {
    const formulario = await this.prisma.formularios.findUnique({
      where: { id }
    });

    if (!formulario) {
      throw new NotFoundException('Formulário não encontrado');
    }

    return this.prisma.formularios.delete({
      where: { id }
    });
  }

  // ===== MÉTODOS PARA TOKENS SEGUROS =====

  /**
   * Gera um token seguro para acesso ao formulário
   */
  async generateFormToken(createTokenDto: CreateTokenDto) {
    // Verificar se o laudo existe
    const laudo = await this.prisma.laudo.findUnique({
      where: { id: createTokenDto.laudo_id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            legal_name: true,
            cnpj: true,
          }
        }
      }
    });

    if (!laudo) {
      throw new NotFoundException('Laudo não encontrado');
    }

    // Gerar token único (32 caracteres hexadecimais)
    const token = randomBytes(16).toString('hex');
    
    // Token expira em 6 horas
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 6);

    // Criar token no banco
    const formToken = await this.prisma.form_tokens.create({
      data: {
        token,
        laudo_id: createTokenDto.laudo_id,
        expires_at: expiresAt,
      },
      include: {
        laudo: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                legal_name: true,
                cnpj: true,
              }
            }
          }
        }
      }
    });

    return {
      token: formToken.token,
      expires_at: formToken.expires_at,
      laudo: formToken.laudo
    };
  }

  /**
   * Valida um token e retorna os dados do laudo
   */
  async validateFormToken(token: string) {
    const formToken = await this.prisma.form_tokens.findUnique({
      where: { token },
      include: {
        laudo: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                legal_name: true,
                cnpj: true,
              }
            }
          }
        }
      }
    });

    if (!formToken) {
      throw new NotFoundException('Token inválido');
    }

    // Verificar se o token expirou
    if (new Date() > formToken.expires_at) {
      throw new BadRequestException('Token expirado');
    }

    // Verificar se o token já foi usado (opcional - remover se quiser permitir múltiplos usos)
    // if (formToken.used) {
    //   throw new BadRequestException('Token já foi utilizado');
    // }

    return {
      laudo_id: formToken.laudo_id,
      laudo: formToken.laudo,
      token_id: formToken.id,
      expires_at: formToken.expires_at
    };
  }

  /**
   * Marca um token como usado (opcional)
   */
  async markTokenAsUsed(tokenId: string) {
    return this.prisma.form_tokens.update({
      where: { id: tokenId },
      data: { used: true }
    });
  }

  /**
   * Remove tokens expirados (limpeza)
   */
  async cleanExpiredTokens() {
    const now = new Date();
    return this.prisma.form_tokens.deleteMany({
      where: {
        expires_at: {
          lt: now
        }
      }
    });
  }
}
