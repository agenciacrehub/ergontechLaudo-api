import { PartialType } from '@nestjs/mapped-types';
import { CreateFormulariosDto } from './create-formularios.dto';

export class UpdateFormulariosDto extends PartialType(CreateFormulariosDto) {}
