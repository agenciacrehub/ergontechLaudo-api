import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class CreateReportUpDto {
  @IsString()
  @IsNotEmpty()
  laudo_id: string;

  @IsObject()
  @IsNotEmpty()
  conteudo: any; // JSON com todo o conteúdo do formulário AEP
}
