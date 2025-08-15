import { ApiProperty } from '@nestjs/swagger';

// Types baseados no schema Prisma
type RoleType = 'MASTER' | 'ADMIN' | 'CLIENT' | 'USER';
type GenderType = 'MALE' | 'FEMALE' | 'OTHER' | 'NOT_INFORMED';

export class LoginResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty({ enum: ['MASTER', 'ADMIN', 'CLIENT', 'USER'] })
  role: RoleType;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty({ required: false, type: () => ProfileDto, nullable: true })
  profile?: ProfileDto | null;
}

export class ProfileDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty({ required: false, nullable: true })
  birth_date?: string | null;

  @ApiProperty()
  company_id: string;

  @ApiProperty()
  function_id: string;

  @ApiProperty({ required: false, enum: ['MALE', 'FEMALE', 'OTHER', 'NOT_INFORMED'], nullable: true })
  gender?: GenderType | null;

  @ApiProperty({ required: false, type: () => CompanyDto, nullable: true })
  company?: CompanyDto | null;

  @ApiProperty({ required: false, type: () => JobFunctionDto, nullable: true })
  job_function?: JobFunctionDto | null;
}

export class CompanyDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  legal_name: string;
}

export class JobFunctionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, type: () => DepartamentDto, nullable: true })
  departament?: DepartamentDto | null;
}

export class DepartamentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, type: () => SetorDto, nullable: true })
  setor?: SetorDto | null;
}

export class SetorDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}
