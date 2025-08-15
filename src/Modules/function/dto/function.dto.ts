import { IsString, IsNotEmpty, IsBoolean } from "class-validator";

export class FunctionDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsBoolean()
    @IsNotEmpty()
    active: boolean;

    @IsString()
    @IsNotEmpty()
    departament_id: string;
}

export class UpdateFunctionDto extends FunctionDto {}