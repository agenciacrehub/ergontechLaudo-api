import { IsString, IsNotEmpty, IsBoolean } from "class-validator";

export class SetorDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsBoolean()
    @IsNotEmpty()
    active: boolean;
}

export class UpdateSetorDto extends SetorDto {}