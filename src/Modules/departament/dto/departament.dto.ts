import { IsString, IsNotEmpty, IsBoolean } from "class-validator";


export class DepartamentDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsBoolean()
    @IsNotEmpty()
    active: boolean;

    @IsString()
    @IsNotEmpty()
    setor_id: string;
}

export class UpdateDepartamentDto extends DepartamentDto {}
