import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTokenDto {
  @IsString()
  @IsNotEmpty()
  laudo_id: string;
}
