import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly prisma: PrismaService) { }

  async validateUser(loginDto: LoginDto): Promise<LoginResponseDto> {
    try {
      // Buscar o usuário com o e-mail fornecido
      const user = await this.prisma.user.findUnique({
        where: { email: loginDto.email },
        include: {
          profiles: {
            include: {
              company: true,
              job_function: {
                include: {
                  departament: {
                    include: {
                      setor: true
                    }
                  }
                }
              },
              profile_photo: true,
              profile_email: true,
              profile_phone: true,
              profile_address: true,
            },
          },
        },
      });

      if (!user) {
        this.logger.warn(`Usuário não encontrado: ${loginDto.email}`);
        throw new UnauthorizedException('E-mail ou senha inválidos.');
      }

      if (!user.is_active) {
        this.logger.warn(`Usuário inativo: ${loginDto.email}`);
        throw new UnauthorizedException('Usuário inativo.');
      }

      const valid = await bcrypt.compare(loginDto.password, user.password);

      if (!valid) {
        this.logger.warn(`Senha inválida para: ${loginDto.email}`);
        throw new UnauthorizedException('E-mail ou senha inválidos.');
      }

      // Remove campos sensíveis e converte datas para string
      const { password, ...userSafe } = user;

      const response: LoginResponseDto = {
        id: userSafe.id,
        name: userSafe.name,
        email: userSafe.email,
        is_active: userSafe.is_active,
        role: userSafe.role,
        created_at: userSafe.created_at.toISOString(),
        updated_at: userSafe.updated_at.toISOString(),
        profile: userSafe.profiles?.[0]
          ? {
            id: userSafe.profiles[0].id,
            created_at: userSafe.profiles[0].created_at.toISOString(),
            updated_at: userSafe.profiles[0].updated_at.toISOString(),
            user_id: userSafe.profiles[0].user_id,
            birth_date: userSafe.profiles[0].birth_date?.toISOString() || null,
            company_id: userSafe.profiles[0].company_id,
            function_id: userSafe.profiles[0].function_id,
            gender: userSafe.profiles[0].gender || null,
            company: userSafe.profiles[0].company ? {
              id: userSafe.profiles[0].company.id,
              name: userSafe.profiles[0].company.name,
              legal_name: userSafe.profiles[0].company.legal_name,
            } : null,
            job_function: userSafe.profiles[0].job_function ? {
              id: userSafe.profiles[0].job_function.id,
              name: userSafe.profiles[0].job_function.name,
              departament: userSafe.profiles[0].job_function.departament ? {
                id: userSafe.profiles[0].job_function.departament.id,
                name: userSafe.profiles[0].job_function.departament.name,
                setor: userSafe.profiles[0].job_function.departament.setor ? {
                  id: userSafe.profiles[0].job_function.departament.setor.id,
                  name: userSafe.profiles[0].job_function.departament.setor.name,
                } : null
              } : null
            } : null
          }
          : null,
      };

      this.logger.log(`Login realizado com sucesso para: ${loginDto.email}`);
      return response;
    } catch (error) {
      this.logger.error(`Erro no validateUser: ${error.message}`);
      throw error;
    }
  }
}
