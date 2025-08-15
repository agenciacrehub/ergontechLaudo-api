import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class CreateFormulariosDto {
  @IsString()
  @IsNotEmpty()
  laudo_id: string;

  @IsObject()
  @IsNotEmpty()
  respostas: any; // JSON com todas as respostas do formulário
}
