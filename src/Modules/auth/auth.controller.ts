import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {

    // Log dos dados recebidos

    try {
      const user = await this.authService.validateUser(loginDto);
      // Gerar JWT
      const payload = { email: user.email, sub: user.id };
      const access_token = this.jwtService.sign(payload);
      // Retornar no formato esperado pelo frontend
      return { access_token, user };

    } catch (error) {
      this.logger.warn(
        `Login falhou para ${loginDto.email}: ${error?.message}`,
      )
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }
  }
}
