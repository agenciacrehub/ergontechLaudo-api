import { IsString, IsNotEmpty, IsBoolean } from "class-validator";

export class CompanyDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    cnpj: string;

    @IsString()
    @IsNotEmpty()
    cnae: string;

    @IsString()
    @IsNotEmpty()
    legal_name: string;

    @IsString()
    @IsNotEmpty()
    street: string;

    @IsString()
    @IsNotEmpty()
    number: string;

    @IsString()
    @IsNotEmpty()
    zip_code: string;

    @IsString()
    @IsNotEmpty()
    neighborhood: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    state: string;

    @IsBoolean()
    @IsNotEmpty()
    active: boolean;
}

export class UpdateCompanyDto extends CompanyDto {}