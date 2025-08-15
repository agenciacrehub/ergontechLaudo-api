import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator"


export enum role_type {
  MASTER = 'MASTER',
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  USER = 'USER',
}

export enum AddressType {
  Home = 'HOME',
  Work = 'WORK',
  School = 'SCHOOL',
}

export enum phone_type {
  MOBILE = 'MOBILE',
  LANDLINE = 'LANDLINE',
  WHATSAPP = 'WHATSAPP',
  COMMERCIAL = 'COMMERCIAL',
  OTHER = 'OTHER',
}

export class UserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(role_type)
  @IsOptional()
  role?: role_type;

  @IsOptional()
  class_id?: number;
}

export class PhoneDto {

  @IsString()
  @IsOptional()
  profile_id?: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsEnum(phone_type)
  @IsNotEmpty()
  type: phone_type;

  @IsBoolean()
  @IsOptional()
  is_primary?: boolean;
}

export class EmailDto {
  @IsString()
  @IsOptional()
  profile_id?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsBoolean()
  @IsOptional()
  is_primary?: boolean;
}

export class AddressDto {

  @IsString()
  @IsOptional()
  profile_id?: string;

  @IsEnum(AddressType)
  @IsNotEmpty()
  type: AddressType;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsOptional()
  complement?: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  zip_code: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsBoolean()
  @IsOptional()
  is_primary?: boolean;
}

export class ProfileDto {
    @IsString()
    @IsNotEmpty()
    user_id: string;

    @IsString()
    @IsNotEmpty()
    institution_id: string;

    @IsDateString()
    @IsOptional()
    birth_date?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PhoneDto)
    phones: PhoneDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EmailDto)
    emails: EmailDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddressDto)
    addresses: AddressDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Profile_photoDto)
    photos: Profile_photoDto[];
}

export class Profile_photoDto {
    @IsString()
    @IsOptional()
    profile_id?: string;

    @IsString()
    @IsNotEmpty()
    photo: string;
}

export class CreateUserDto {
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @ValidateNested()
  @Type(() => ProfileDto)
  profile: ProfileDto;
}



export class UpdateUserDto extends CreateUserDto {}

