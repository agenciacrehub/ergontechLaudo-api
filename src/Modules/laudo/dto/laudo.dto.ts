import { IsNotEmpty } from "class-validator";
import { type_laudos } from "@prisma/client";

export class ReportsDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    company_id: string;

    @IsNotEmpty()
    user_id: string;

    @IsNotEmpty()
    type_laudos: type_laudos;

    @IsNotEmpty()
    status: string;
}