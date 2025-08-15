import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportUpDto } from './dto/create-report-up.dto';
import { UpdateReportUpDto } from './dto/update-report-up.dto';

@Injectable()
export class ReportUpService {
  constructor(private prisma: PrismaService) {}

  async create(createReportUpDto: CreateReportUpDto) {
    // Verificar se o laudo existe
    const laudo = await this.prisma.laudo.findUnique({
      where: { id: createReportUpDto.laudo_id },
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

    // Preparar imagens a partir do JSON de conteúdo
    const images = this.extractImagesFromConteudo(createReportUpDto.conteudo);

    // Verificar se já existe um report_up para este laudo
    const existingReport = await this.prisma.report_up.findFirst({
      where: { laudo_id: createReportUpDto.laudo_id }
    });

    if (existingReport) {
      // Atualizar conteúdo e sincronizar imagens dentro de uma transação
      const result = await this.prisma.$transaction(async (tx) => {
        const updated = await tx.report_up.update({
          where: { id: existingReport.id },
          data: {
            conteudo: createReportUpDto.conteudo,
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

        await this.syncReportImages(tx, updated.id, images);
        return updated;
      });
      return result;
    }

    // Criar novo report_up e sincronizar imagens
    const result = await this.prisma.$transaction(async (tx) => {
      const created = await tx.report_up.create({
        data: {
          laudo_id: createReportUpDto.laudo_id,
          conteudo: createReportUpDto.conteudo,
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

      await this.syncReportImages(tx, created.id, images);
      return created;
    });

    return result;
  }

  async findAll() {
    return this.prisma.report_up.findMany({
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
    const reportUp = await this.prisma.report_up.findUnique({
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

    if (!reportUp) {
      throw new NotFoundException('Relatório AEP não encontrado');
    }

    return reportUp;
  }

  async findByLaudoId(laudoId: string) {
    return this.prisma.report_up.findMany({
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

  async update(id: string, updateReportUpDto: UpdateReportUpDto) {
    // Verificar se o report_up existe
    const reportUp = await this.prisma.report_up.findUnique({
      where: { id }
    });

    if (!reportUp) {
      throw new NotFoundException('Relatório AEP não encontrado');
    }

    // Se está atualizando o laudo_id, verificar se o novo laudo existe
    if (updateReportUpDto.laudo_id) {
      const laudo = await this.prisma.laudo.findUnique({
        where: { id: updateReportUpDto.laudo_id }
      });

      if (!laudo) {
        throw new NotFoundException('Laudo não encontrado');
      }
    }

    // Se houver conteúdo no update, extrair imagens e sincronizar; caso contrário, apenas atualizar dados
    const images =
      typeof updateReportUpDto.conteudo !== 'undefined'
        ? this.extractImagesFromConteudo(updateReportUpDto.conteudo)
        : null;

    const result = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.report_up.update({
        where: { id },
        data: updateReportUpDto,
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

      if (images) {
        await this.syncReportImages(tx, updated.id, images);
      }

      return updated;
    });

    return result;
  }

  // Helpers privados
  private extractImagesFromConteudo(conteudo: any): { name: string; data: string; type: string | null }[] {
    const images: { name: string; data: string; type: string | null }[] = [];

    if (!conteudo || typeof conteudo !== 'object') return images;

    // Logo da empresa
    const logo = conteudo?.logoEmpresa || conteudo?.logo_empresa;
    const logoData = logo?.imageData || logo?.data || null;
    const logoType = logo?.fileType || this.parseDataUrlMime(logoData);
    if (logoData) {
      images.push({ name: 'logo_empresa', data: logoData, type: logoType || null });
    }

    // Postos de trabalho (aceita tanto no root quanto em conteudo.imagensPostoTrabalho)
    const container = conteudo?.imagensPostoTrabalho || conteudo;
    const keys = ['imagem1', 'imagem2', 'imagem3', 'imagem4'];
    keys.forEach((k, idx) => {
      const obj = container?.[k];
      const data = obj?.data || obj?.imageData || null;
      const type = obj?.file?.type || obj?.fileType || this.parseDataUrlMime(data);
      if (data) {
        images.push({ name: `posto_trabalho_${idx + 1}`, data, type: type || null });
      }
    });

    return images;
  }

  private parseDataUrlMime(dataUrl?: string | null): string | null {
    if (!dataUrl || typeof dataUrl !== 'string') return null;
    const match = dataUrl.match(/^data:(.+?);base64,/);
    return match ? match[1] : null;
  }

  private async syncReportImages(
    tx: any,
    reportUpId: string,
    images: { name: string; data: string; type: string | null }[],
  ): Promise<void> {
    // Nomes esperados para manter sincronização coerente
    const expectedNames = new Set<string>([
      'logo_empresa',
      'posto_trabalho_1',
      'posto_trabalho_2',
      'posto_trabalho_3',
      'posto_trabalho_4',
    ]);

    const incomingByName = new Map<string, { data: string; type: string | null }>();
    for (const img of images) {
      if (img && img.name && img.data) {
        incomingByName.set(img.name, { data: img.data, type: img.type || null });
      }
    }

    const existing = await tx.report_up_image.findMany({
      where: { report_up_id: reportUpId },
    });

    // Deletar imagens que não estão presentes (ou vieram vazias)
    for (const rec of existing) {
      const incoming = incomingByName.get(rec.image_name);
      if (!incoming) {
        await tx.report_up_image.delete({ where: { id: rec.id } });
      }
    }

    // Criar/atualizar imagens presentes
    for (const name of expectedNames) {
      const incoming = incomingByName.get(name);
      if (!incoming) continue; // já tratamos deleções acima

      const current = existing.find((e: any) => e.image_name === name);
      const image_type = incoming.type || 'image/png';
      const image_data = incoming.data;

      if (current) {
        await tx.report_up_image.update({
          where: { id: current.id },
          data: { image_data, image_type },
        });
      } else {
        await tx.report_up_image.create({
          data: {
            report_up_id: reportUpId,
            image_name: name,
            image_data,
            image_type,
          },
        });
      }
    }
  }

  async remove(id: string) {
    const reportUp = await this.prisma.report_up.findUnique({
      where: { id }
    });

    if (!reportUp) {
      throw new NotFoundException('Relatório AEP não encontrado');
    }

    return this.prisma.report_up.delete({
      where: { id }
    });
  }
}
