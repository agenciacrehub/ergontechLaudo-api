import { PartialType } from '@nestjs/mapped-types';
import { CreateReportUpDto } from './create-report-up.dto';

export class UpdateReportUpDto extends PartialType(CreateReportUpDto) {}
